import JSZip from 'jszip'
import { detectAdapter } from './adapters/registry'
import { analyze } from './report-model'
import { renderReport } from './ui/view'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

function dropzone(): HTMLElement {
  const zone = document.createElement('div')
  zone.className = 'dropzone'
  zone.innerHTML =
    '<h1>influence-sensor</h1>' +
    '<p>Pick or drop your Instagram data export (.zip, <strong>JSON format</strong>). ' +
    'It never leaves your browser.</p>' +
    '<input type="file" accept=".zip,application/zip" id="file" />' +
    '<p class="hint">On mobile? Request your data in JSON and, to keep the file small, ' +
    'limit it to your activity (likes, following, comments) or a date range.</p>'
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
    const data = await adapter.parse(zip)
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
