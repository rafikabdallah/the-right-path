import { MoonStar, Sparkles } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';

import { PlaceholderDetail } from '@/components/ui/PlaceholderDetail';
import { salahBlocks } from '@/data/salah';

const BLOCK_ICONS = {
  sunnah: Sparkles,
  'night-prayer': MoonStar,
} as const;

/**
 * Destination for Salah's Sunnah and Night Prayer blocks. Intentionally a
 * placeholder — what these screens contain is still an open product
 * decision.
 */
export default function SalahBlockRoute() {
  const { block: blockId } = useLocalSearchParams<{ block: string }>();
  const block = salahBlocks.find((item) => item.id === blockId);

  return (
    <PlaceholderDetail
      title={block?.title}
      icon={blockId ? BLOCK_ICONS[blockId as keyof typeof BLOCK_ICONS] : undefined}
    />
  );
}
