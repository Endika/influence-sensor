import type JSZip from 'jszip';
import type { NormalizedData } from '../schema';
import { instagramAdapter } from './instagram';
import { youtubeAdapter } from './youtube';

export interface Adapter {
  id: string;
  label: string;
  detect(zip: JSZip): boolean;
  parse(zip: JSZip): Promise<NormalizedData>;
}

const ADAPTERS: Adapter[] = [instagramAdapter, youtubeAdapter];

export function detectAdapter(zip: JSZip): Adapter | null {
  return ADAPTERS.find((a) => a.detect(zip)) ?? null;
}
