import JSZip from 'jszip';
import { detectAdapter } from './adapters/registry';
import { detectTikTok, parseTikTok, type TikTokSummary } from './adapters/tiktok';
import { excludeSelf, ownerFromFilename } from './owner';
import { analyze, type Report } from './report-model';

export type LoadResult =
  | { kind: 'badZip' }
  | { kind: 'unrecognized' }
  | { kind: 'tiktok'; summary: TikTokSummary }
  | { kind: 'noInteractions'; unreadable: string[] }
  | { kind: 'report'; report: Report };

/**
 * Read an export zip into the result to show. Only a zip that fails to open is
 * `badZip`; any later failure rejects so the caller can report it as such.
 */
export async function loadExport(
  file: Parameters<typeof JSZip.loadAsync>[0],
  filename: string,
): Promise<LoadResult> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    return { kind: 'badZip' };
  }
  if (detectTikTok(zip)) return { kind: 'tiktok', summary: await parseTikTok(zip) };
  const adapter = detectAdapter(zip);
  if (!adapter) return { kind: 'unrecognized' };
  const data = excludeSelf(await adapter.parse(zip), ownerFromFilename(filename));
  if (data.interactions.length === 0) {
    return { kind: 'noInteractions', unreadable: data.unreadable ?? [] };
  }
  return { kind: 'report', report: analyze(data) };
}
