import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';
import { loadExport } from '../src/load';

const bytes = (zip: JSZip) => zip.generateAsync({ type: 'uint8array' });

describe('loadExport', () => {
  it('says badZip only when the file is not a zip', async () => {
    const result = await loadExport(new TextEncoder().encode('plain text'), 'x.zip');
    expect(result).toEqual({ kind: 'badZip' });
  });

  it('rejects, rather than blaming the zip, when a valid zip has an unreadable payload', async () => {
    const zip = new JSZip();
    zip.file('user_data_tiktok.json', '{"Profile And Settings": ');
    await expect(loadExport(await bytes(zip), 'tiktok.zip')).rejects.toThrow(SyntaxError);
  });

  it('flags an unrecognized export', async () => {
    const zip = new JSZip();
    zip.file('random.txt', 'hello');
    expect(await loadExport(await bytes(zip), 'x.zip')).toEqual({ kind: 'unrecognized' });
  });

  it('names the unreadable sections when nothing could be analysed', async () => {
    const zip = new JSZip();
    zip.file('your_instagram_activity/story_interactions/story_likes.json', '[{');
    expect(await loadExport(await bytes(zip), 'x.zip')).toEqual({
      kind: 'noInteractions',
      unreadable: ['your_instagram_activity/story_interactions/story_likes.json'],
    });
  });

  it('carries unreadable sections into the report', async () => {
    const zip = new JSZip();
    zip.file(
      'your_instagram_activity/story_interactions/story_likes.json',
      JSON.stringify([{ title: 'someone', timestamp: 1700000000 }]),
    );
    zip.file('your_instagram_activity/comments/post_comments_1.json', 'oops');
    const result = await loadExport(await bytes(zip), 'x.zip');
    expect(result.kind).toBe('report');
    if (result.kind !== 'report') return;
    expect(result.report.totalInteractions).toBe(1);
    expect(result.report.unreadable).toEqual([
      'your_instagram_activity/comments/post_comments_1.json',
    ]);
  });
});
