import * as SQLite from 'expo-sqlite';
import type { SQLiteDatabase } from 'expo-sqlite';

import { migrate } from './migrations';

const DATABASE_NAME = 'the-right-path.db';

let connection: Promise<SQLiteDatabase> | null = null;

/**
 * The single database handle, opened and migrated once.
 *
 * Repositories await this rather than receiving a handle, so nothing above
 * them has to thread a connection through props or context. Callers outside
 * React (services, analytics) can use it just as easily as hooks can.
 */
export function getDatabase(): Promise<SQLiteDatabase> {
  if (!connection) {
    connection = (async () => {
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      // Write-ahead logging keeps reads from blocking on writes, and foreign
      // keys are off by default in SQLite.
      await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
      await migrate(db);
      return db;
    })().catch((error) => {
      // Let the next call retry rather than caching a rejected promise.
      connection = null;
      throw error;
    });
  }

  return connection;
}

/** Test/debug helper: forget the cached handle. */
export function resetDatabaseConnection(): void {
  connection = null;
}
