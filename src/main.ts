import JSZip from 'jszip'
import { detectLocale, getLocale, LOCALES, setLocale, t } from './i18n'
import { detectAdapter } from './adapters/registry'
import { detectTikTok, parseTikTok, type TikTokSummary } from './adapters/tiktok'
import { excludeSelf, ownerFromFilename } from './owner'
import { analyze, type Report } from './report-model'
import { renderReport } from './ui/view'
import { renderTikTokReport } from './ui/tiktok-view'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!
let lastReport: Report | null = null
let lastTikTok: TikTokSummary | null = null

function langSelector(): HTMLElement {
  const sel = document.createElement('select')
  sel.className = 'lang-select'
  sel.setAttribute('aria-label', 'Language')
  for (const locale of LOCALES) {
    const opt = document.createElement('option')
    opt.value = locale.code
    opt.textContent = locale.label
    if (locale.code === getLocale()) opt.selected = true
    sel.appendChild(opt)
  }
  sel.addEventListener('change', () => {
    setLocale(sel.value)
    render()
  })
  return sel
}

function dropzone(): HTMLElement {
  const zone = document.createElement('div')
  zone.className = 'dropzone'
  zone.innerHTML =
    '<h1 translate="no">influence-sensor</h1>' +
    `<p>${t('drop.prompt')}</p>` +
    '<input type="file" accept=".zip,application/zip" id="file" />' +
    `<details class="export-help"><summary>${t('drop.helpSummary')}</summary>` +
    `<p>${t('drop.helpSteps')}</p>` +
    `<ul><li>${t('drop.itemLikes')}</li><li>${t('drop.itemComments')}</li>` +
    `<li>${t('drop.itemSaved')}</li><li>${t('drop.itemStories')}</li>` +
    `<li>${t('drop.itemFollowers')}</li></ul>` +
    `<p>${t('drop.helpFormat')}</p></details>` +
    `<details class="export-help"><summary>${t('drop.tkHelpSummary')}</summary>` +
    `<p>${t('drop.tkHelpSteps')}</p></details>` +
    `<details class="export-help"><summary>${t('drop.ytHelpSummary')}</summary>` +
    `<p>${t('drop.ytHelpSteps')}</p></details>`
  return zone
}

function footer(): HTMLElement {
  const f = document.createElement('footer')
  f.className = 'app-footer'
  f.innerHTML = `<span translate="no">influence-sensor</span> <span class="version">v${__APP_VERSION__}</span>`
  return f
}

async function handleFile(file: File, results: HTMLElement): Promise<void> {
  results.innerHTML = ''
  const status = document.createElement('p')
  status.textContent = t('status.reading')
  results.appendChild(status)
  try {
    const zip = await JSZip.loadAsync(file)
    if (detectTikTok(zip)) {
      lastTikTok = await parseTikTok(zip)
      lastReport = null
      status.remove()
      renderTikTokReport(results, lastTikTok)
      return
    }
    const adapter = detectAdapter(zip)
    if (!adapter) {
      status.textContent = t('status.unrecognized')
      return
    }
    const data = excludeSelf(await adapter.parse(zip), ownerFromFilename(file.name))
    if (data.interactions.length === 0) {
      status.textContent = t('status.noInteractions')
      return
    }
    lastReport = analyze(data)
    lastTikTok = null
    status.remove()
    renderReport(results, lastReport)
  } catch {
    status.textContent = t('status.badZip')
  }
}

function wireDropzone(zone: HTMLElement, results: HTMLElement): void {
  const input = zone.querySelector<HTMLInputElement>('#file')!
  input.addEventListener('change', () => {
    const file = input.files?.[0]
    if (file) void handleFile(file, results)
  })
  const stop = (e: DragEvent) => e.preventDefault()
  zone.addEventListener('dragover', stop)
  zone.addEventListener('drop', (e) => {
    stop(e)
    const file = e.dataTransfer?.files?.[0]
    if (file) void handleFile(file, results)
  })
}

function render(): void {
  app.innerHTML = ''
  const topbar = document.createElement('div')
  topbar.className = 'topbar'
  topbar.appendChild(langSelector())
  const zone = dropzone()
  const results = document.createElement('div')
  results.id = 'results'
  app.append(topbar, zone, results, footer())
  wireDropzone(zone, results)
  if (lastTikTok) renderTikTokReport(results, lastTikTok)
  else if (lastReport) renderReport(results, lastReport)
}

setLocale(detectLocale())
render()
