import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * Schema migrations, applied in order and tracked by SQLite's own
 * `user_version`. Each migration is additive; never edit a shipped one —
 * add another.
 */
interface Migration {
  version: number;
  up: (db: SQLiteDatabase) => Promise<void>;
}

const MIGRATIONS: Migration[] = [
  {
    version: 1,
    up: async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          calculation_method TEXT NOT NULL,
          madhhab TEXT NOT NULL,
          adjustments TEXT NOT NULL,
          latitude REAL,
          longitude REAL,
          timezone TEXT,
          city TEXT,
          location_mode TEXT NOT NULL DEFAULT 'device',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        -- One row per prayer per day. The unique constraint is what makes
        -- repeated taps update rather than accumulate duplicates.
        CREATE TABLE IF NOT EXISTS prayer_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          local_date TEXT NOT NULL,
          prayer_name TEXT NOT NULL,
          scheduled_time TEXT,
          completed INTEGER NOT NULL DEFAULT 0,
          completed_at TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          UNIQUE (local_date, prayer_name)
        );
        CREATE INDEX IF NOT EXISTS idx_prayer_logs_date ON prayer_logs (local_date);

        -- Rawatib are one row per slot per day; general Nafl can repeat, so
        -- the uniqueness below is a partial index rather than a constraint.
        CREATE TABLE IF NOT EXISTS sunnah_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          local_date TEXT NOT NULL,
          category TEXT NOT NULL,
          sunnah_id TEXT NOT NULL,
          rakah_count INTEGER,
          completed INTEGER NOT NULL DEFAULT 0,
          completed_at TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS idx_sunnah_rawatib_unique
          ON sunnah_logs (local_date, sunnah_id) WHERE category = 'rawatib';
        CREATE INDEX IF NOT EXISTS idx_sunnah_logs_date ON sunnah_logs (local_date);

        -- The slot column keeps Qiyam and Tahajjud a single record: the type
        -- names it, the slot guarantees only one of it per night.
        CREATE TABLE IF NOT EXISTS night_prayer_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          local_date TEXT NOT NULL,
          slot TEXT NOT NULL,
          type TEXT NOT NULL,
          rakah_count INTEGER,
          after_sleeping INTEGER NOT NULL DEFAULT 0,
          last_third INTEGER NOT NULL DEFAULT 0,
          completed INTEGER NOT NULL DEFAULT 0,
          completed_at TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          UNIQUE (local_date, slot)
        );
        CREATE INDEX IF NOT EXISTS idx_night_logs_date ON night_prayer_logs (local_date);
      `);
    },
  },
  {
    version: 2,
    up: async (db) => {
      // The detail sheet's answers are part of the record, not decoration:
      // Prayer Review will read them directly. Added as a separate migration
      // so an already-created database picks them up too.
      await db.execAsync(`
        ALTER TABLE prayer_logs ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
        ALTER TABLE prayer_logs ADD COLUMN timing TEXT;
        ALTER TABLE prayer_logs ADD COLUMN place TEXT;
        ALTER TABLE prayer_logs ADD COLUMN congregation TEXT;
      `);
      // Backfill rows written before this migration existed.
      await db.execAsync(
        "UPDATE prayer_logs SET status = 'prayed' WHERE completed = 1 AND status = 'pending'"
      );
    },
  },
];

export const LATEST_VERSION = MIGRATIONS[MIGRATIONS.length - 1].version;

export async function migrate(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;

  for (const migration of MIGRATIONS) {
    if (migration.version <= version) continue;
    await migration.up(db);
    version = migration.version;
    // PRAGMA can't be parameterised, and `version` is a literal from this file.
    await db.execAsync(`PRAGMA user_version = ${version}`);
  }
}
