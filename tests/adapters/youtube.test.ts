import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';
import { youtubeAdapter } from '../../src/adapters/youtube';

interface WatchEntry {
  header: string;
  title: string;
  titleUrl: string;
  time: string;
  subtitles?: Array<{ name: string; url: string }>;
}

// A watched entry: the channel lives in subtitles[0] (name + /channel/ URL).
function watched(
  title: string,
  videoId: string,
  channel?: { name: string; id: string },
): WatchEntry {
  const e: WatchEntry = {
    header: 'YouTube',
    title: `Has visto ${title}`,
    titleUrl: `https://www.youtube.com/watch?v=${videoId}`,
    time: '2026-05-31T16:42:57.328Z',
  };
  if (channel)
    e.subtitles = [{ name: channel.name, url: `https://www.youtube.com/channel/${channel.id}` }];
  return e;
}

const CANAL_A = { name: 'Canal A', id: 'UCAAA' };
const CANAL_B = { name: 'Canal B', id: 'UCBBB' };

const history = [
  watched('vid uno', 'v1', CANAL_A),
  watched('vid dos', 'v2', CANAL_A),
  watched('vid tres', 'v3', CANAL_B),
  watched('un anuncio', 'v4'), // no subtitles → unattributed
];

// Spanish-localized headers; the channel the user renamed (UCAAA) keeps a new title here.
const subscriptionsCsv =
  'ID del canal,URL del canal,Título del canal\n' +
  'UCAAA,http://www.youtube.com/channel/UCAAA,Canal A Renombrado\n' +
  'UCBBB,http://www.youtube.com/channel/UCBBB,Canal B\n' +
  'UCCCC,http://www.youtube.com/channel/UCCCC,"Canal, con coma"\n';

// Search history looks almost identical (header + watch?v= titleUrl) but carries no
// channel subtitles. It must NOT be mistaken for the watch history.
const searchHistory = [
  {
    header: 'YouTube',
    title: 'Has buscado gatos',
    titleUrl: 'https://www.youtube.com/results?search_query=gatos',
    time: '2026-05-30T10:00:00Z',
  },
  {
    header: 'YouTube',
    title: 'Has visto un vídeo buscado',
    titleUrl: 'https://www.youtube.com/watch?v=zzz',
    time: '2026-05-30T10:01:00Z',
  },
];

// Spanish folder/file names — proves we never hardcode localized paths. Search history
// is inserted FIRST so a naive "first matching JSON" would grab the wrong file.
function spanishZip(): JSZip {
  const zip = new JSZip();
  const base = 'Takeout/YouTube y YouTube Music';
  zip.file(`${base}/historial/historial-de-búsqueda.json`, JSON.stringify(searchHistory));
  zip.file(`${base}/historial/historial-de-reproducciones.json`, JSON.stringify(history));
  zip.file(`${base}/suscripciones/suscripciones.csv`, subscriptionsCsv);
  return zip;
}

// English folder/file names — same export, different locale.
function englishZip(): JSZip {
  const zip = new JSZip();
  const base = 'Takeout/YouTube and YouTube Music';
  zip.file(`${base}/history/search-history.json`, JSON.stringify(searchHistory));
  zip.file(`${base}/history/watch-history.json`, JSON.stringify(history));
  zip.file(`${base}/subscriptions/subscriptions.csv`, subscriptionsCsv);
  return zip;
}

describe('youtube adapter', () => {
  it('detects a YouTube Takeout by structure, not by path', async () => {
    expect(youtubeAdapter.detect(spanishZip())).toBe(true);
    expect(youtubeAdapter.detect(englishZip())).toBe(true);
    const other = new JSZip();
    other.file('whatever.json', '{}');
    expect(youtubeAdapter.detect(other)).toBe(false);
  });

  it('turns watch history into channel-attributed interactions', async () => {
    const data = await youtubeAdapter.parse(spanishZip());
    expect(data.interactions).toHaveLength(3);
    expect(data.interactions.every((i) => i.kind === 'watch')).toBe(true);
    const byAccount = data.interactions.reduce<Record<string, number>>((m, i) => {
      m[i.account] = (m[i.account] ?? 0) + 1;
      return m;
    }, {});
    expect(byAccount).toEqual({ 'Canal A': 2, 'Canal B': 1 });
    expect(data.interactions[0].timestamp).toBe(
      Math.floor(Date.parse('2026-05-31T16:42:57.328Z') / 1000),
    );
  });

  it('counts entries without a channel as unattributed', async () => {
    const data = await youtubeAdapter.parse(spanishZip());
    expect(data.unattributed).toBe(1);
  });

  it('reads subscriptions as follows, reconciling renamed channels by ID', async () => {
    const data = await youtubeAdapter.parse(spanishZip());
    // UCAAA reconciled to its watch-history name (not the renamed title), UCBBB by title,
    // UCCCC (quoted comma) by title. No followers list in Takeout.
    expect(data.follows).toEqual(new Set(['Canal A', 'Canal B', 'Canal, con coma']));
    expect(data.followers).toBeUndefined();
  });

  it('is locale-independent (English paths parse identically)', async () => {
    const es = await youtubeAdapter.parse(spanishZip());
    const en = await youtubeAdapter.parse(englishZip());
    expect(en.interactions).toHaveLength(es.interactions.length);
    expect(en.follows).toEqual(es.follows);
    expect(en.unattributed).toBe(es.unattributed);
  });
});
