import JSZip from 'jszip'
import { detectAdapter } from './adapters/registry'
import { excludeSelf, ownerFromFilename } from './owner'
import { analyze } from './report-model'
import { renderReport } from './ui/view'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

function dropzone(): HTMLElement {
  const zone = document.createElement('div')
  zone.className = 'dropzone'
  zone.innerHTML =
    '<h1>influence-sensor</h1>' +
    '<p>Pick or drop your Instagram data export (<strong>.zip in JSON format</strong>). ' +
    'It never leaves your browser.</p>' +
    '<input type="file" accept=".zip,application/zip" id="file" />' +
    '<details class="export-help">' +
    '<summary>How to download the right export</summary>' +
    '<p>In Instagram: <em>Settings → Accounts Center → Your information and permissions → ' +
    'Download your information</em>. Choose <strong>“Some of your information”</strong> and tick:</p>' +
    '<ul><li>Likes</li><li>Comments</li><li>Saved</li><li>Story interactions</li>' +
    '<li>Followers and following</li></ul>' +
    '<p>Set <strong>Format: JSON</strong> (not HTML) and <strong>Date range: All time</strong> ' +
    'for the fullest picture. Liked posts can’t be analysed (Instagram omits the author), so ' +
    '“Story interactions” is what gives the richest result.</p>' +
    '</details>'
  return zone
}

function footer(): HTMLElement {
  const f = document.createElement('footer')
  f.className = 'app-footer'
  f.innerHTML = `influence-sensor <span class="version">v${__APP_VERSION__}</span>`
  return f
}

async function handleFile(file: File, results: HTMLElement): Promise<void> {
  results.innerHTML = ''
  const status = document.createElement('p')
  status.textContent = 'Reading…'
  results.appendChild(status)
  try {
    const zip = await JSZip.loadAsync(file)
    const adapter = detectAdapter(zip)
    if (!adapter) {
      status.textContent = 'Unrecognized export. Is this an Instagram .zip downloaded in JSON format?'
      return
    }
    // Exclude the account owner — you don't influence yourself. The owner is taken
    // from the export filename (instagram-<username>-<date>-<hash>.zip).
    const data = excludeSelf(await adapter.parse(zip), ownerFromFilename(file.name))
    if (data.interactions.length === 0) {
      status.textContent = 'No likes/comments found. Did you download in HTML instead of JSON format?'
      return
    }
    const report = analyze(data)
    status.remove()
    renderReport(results, report)
  } catch {
    status.textContent = 'Could not read that file as a .zip.'
  }
}

function init(): void {
  app.innerHTML = ''
  const zone = dropzone()
  const results = document.createElement('div')
  results.id = 'results'
  app.append(zone, results, footer())

  const input = zone.querySelector<HTMLInputElement>('#file')!
  input.addEventListener('change', () => {
    const file = input.files?.[0]
    if (file) void handleFile(file, results)
  })
  const stop = (e: DragEvent) => {
    e.preventDefault()
  }
  zone.addEventListener('dragover', stop)
  zone.addEventListener('drop', (e) => {
    stop(e)
    const file = e.dataTransfer?.files?.[0]
    if (file) void handleFile(file, results)
  })
}

init()
