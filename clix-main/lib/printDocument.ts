/**
 * Print helper — hidden iframe (no pop-up). Waits for images before printing.
 */

export interface PrintOptions {
  landscape?: boolean;
  width?: number;
  height?: number;
  delayMs?: number;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildPrintHtml(contentHtml: string, title: string, options: PrintOptions): string {
  const pageSize = options.landscape ? 'A4 landscape' : 'A4 portrait';
  const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) => node.outerHTML)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
${headStyles}
<style>
  *, *::before, *::after { box-sizing: border-box; }
  @page {
    size: ${pageSize};
    margin: 0;
  }
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    background: #ffffff !important;
    color: #111111 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body {
    font-family: 'Plus Jakarta Sans', Georgia, "Times New Roman", system-ui, sans-serif;
  }
  img { max-width: 100%; height: auto; display: block; }
  .ccms-print-page {
    position: relative;
    width: 100%;
    max-width: ${options.landscape ? '297mm' : '210mm'};
    min-height: ${options.landscape ? '210mm' : '297mm'};
    margin: 0 auto;
    background: #fff;
    page-break-inside: avoid;
  }
  .ccms-print-page + .ccms-print-page { page-break-before: always; }
</style>
</head>
<body>
<div class="ccms-print-root">${contentHtml}</div>
</body>
</html>`;
}

function printWhenReady(win: Window, baseDelay = 400): void {
  const doc = win.document;
  const run = () => {
    try {
      win.focus();
      win.print();
    } catch (e) {
      console.error('[print]', e);
    }
  };

  const waitImages = () => {
    const imgs = Array.from(doc.images || []);
    if (imgs.length === 0) {
      window.setTimeout(run, baseDelay);
      return;
    }
    let left = imgs.length;
    const tick = () => {
      left -= 1;
      if (left <= 0) window.setTimeout(run, Math.max(baseDelay, 200));
    };
    imgs.forEach(img => {
      if (img.complete) tick();
      else {
        img.onload = tick;
        img.onerror = tick;
      }
    });
    window.setTimeout(run, 8000);
  };

  if (doc.readyState === 'complete') waitImages();
  else win.addEventListener('load', waitImages);
}

function printViaIframe(fullHtml: string, options: PrintOptions): boolean {
  try {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('title', 'Print document');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText =
      'position:fixed;left:-9999px;top:0;width:800px;height:600px;border:0;opacity:0;pointer-events:none;';

    document.body.appendChild(iframe);

    const win = iframe.contentWindow;
    const doc = win?.document;
    if (!doc || !win) {
      iframe.remove();
      return false;
    }

    const cleanup = () => {
      window.setTimeout(() => iframe.remove(), 2000);
    };

    win.addEventListener('afterprint', cleanup);
    window.setTimeout(cleanup, 15000);

    doc.open();
    doc.write(fullHtml);
    doc.close();

    printWhenReady(win, options.delayMs ?? 450);
    return true;
  } catch (e) {
    console.error('[print] iframe failed', e);
    return false;
  }
}

function printViaPopup(fullHtml: string, options: PrintOptions): boolean {
  const w = options.width ?? 960;
  const h = options.height ?? 720;
  const win = window.open('', '_blank', `noopener,noreferrer,width=${w},height=${h}`);
  if (!win) return false;
  win.document.open();
  win.document.write(fullHtml);
  win.document.close();
  printWhenReady(win, options.delayMs ?? 500);
  return true;
}

export function openPrintWindow(contentHtml: string, title: string, options: PrintOptions = {}): boolean {
  const fullHtml = buildPrintHtml(contentHtml, title, options);
  if (printViaIframe(fullHtml, options)) return true;
  return printViaPopup(fullHtml, options);
}

export function getPrintableHtml(element: HTMLElement): string {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.background = '#ffffff';
  clone.style.color = '#111111';
  clone.querySelectorAll('*').forEach(node => {
    const el = node as HTMLElement;
    if (el.style) {
      if (el.style.backdropFilter) el.style.backdropFilter = 'none';
    }
  });
  clone.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    if (src) {
      try {
        img.setAttribute('src', new URL(src, window.location.href).href);
      } catch {
        /* keep */
      }
    }
  });
  return clone.innerHTML;
}

export function printElementById(elementId: string, title: string, options?: PrintOptions): boolean {
  const el = document.getElementById(elementId);
  if (!el?.innerHTML.trim()) {
    console.warn('[print] Element not ready:', elementId);
    return false;
  }
  return openPrintWindow(
    `<div class="ccms-print-page">${getPrintableHtml(el)}</div>`,
    title,
    options
  );
}

export function printFirstAvailable(elementIds: string[], title: string, options?: PrintOptions): boolean {
  for (const id of elementIds) {
    const el = document.getElementById(id);
    if (el?.innerHTML.trim()) {
      return printElementById(id, title, options);
    }
  }
  return false;
}

export function printElementsByIds(elementIds: string[], title: string, options?: PrintOptions): boolean {
  const parts: string[] = [];
  for (const id of elementIds) {
    const el = document.getElementById(id);
    if (el?.innerHTML.trim()) {
      parts.push(`<div class="ccms-print-page">${getPrintableHtml(el)}</div>`);
    }
  }
  if (parts.length === 0) return false;
  return openPrintWindow(parts.join(''), title, { ...options, delayMs: options?.delayMs ?? 800 });
}

export function printHtmlDocument(bodyHtml: string, title: string, options?: PrintOptions): boolean {
  return openPrintWindow(`<div class="ccms-print-page">${bodyHtml}</div>`, title, options);
}

/** Event pass HTML — reliable print without cloning glass UI */
export function printEventPassHtml(data: {
  clubName: string;
  eventTitle: string;
  studentName: string;
  ticketId: string;
  eventDate: string;
  qrData: string;
}): boolean {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(data.qrData)}`;
  const dateStr = new Date(data.eventDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return printHtmlDocument(
    `
    <div style="position: relative; border: 2px solid #0f172a; border-radius: 24px; max-width: 720px; margin: 24px auto; background: #ffffff; box-shadow: 0 28px 60px rgba(15, 23, 42, 0.08); overflow: hidden; font-family: 'Inter', system-ui, sans-serif;">
      <div style="position: absolute; inset: 0; opacity: 0.05; pointer-events: none; background: url('/image.png') right bottom 40px / 160px no-repeat;" />
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 26px; background: #0f172a;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width:56px;height:56px;border-radius:18px;background:#111827;color:#ffffff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:22px;">${escapeHtml(data.clubName[0] || 'M')}</div>
            <div>
              <div class="hindi-name" style="margin:0;color:#f8fafc;">माधव प्रौद्योगिकी एवं विज्ञान संस्थान, ग्वालियर</div>
              <div class="english-name" style="margin:4px 0 0;color:#f8fafc;">Madhav Institute of Technology & Science, Gwalior</div>
              <div class="document-subtitle" style="margin-top:4px;color:#cbd5e1;">(Deemed to be University u/s 3 of UGC Act, 1956 | NAAC A++ Grade)</div>
            </div>
          </div>
          <img src="/mitslogo.jpg" width="56" height="56" alt="MITS Logo" style="border-radius: 14px; background: #ffffff; padding: 6px;" />
        </div>
        <div style="font-size: 9px; font-weight: 800; color: #cbd5e1; letter-spacing: 0.3em; text-transform: uppercase;">Trusted by Clix</div>
      </div>
      <div style="display: grid; grid-template-columns: 1.9fr 1fr; gap: 24px; padding: 28px 26px 22px;">
        <div style="display: flex; flex-direction: column; gap: 18px; min-width: 0;">
          <div>
            <p style="margin: 0 0 10px; font-size: 9px; font-weight: 900; letter-spacing: 0.25em; color: #0f172a; text-transform: uppercase;">${escapeHtml(data.clubName)} Presents</p>
            <h1 style="margin: 0; font-size: 28px; font-weight: 900; color: #111827; line-height: 1.05;">${escapeHtml(data.eventTitle)}</h1>
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;">
            <div style="padding: 18px; border-radius: 20px; background: #f8fafc; border: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase; color: #475569;">Attendee</p>
              <p style="margin: 0; font-size: 16px; font-weight: 800; color: #0f172a;">${escapeHtml(data.studentName)}</p>
            </div>
            <div style="padding: 18px; border-radius: 20px; background: #f8fafc; border: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase; color: #475569;">Date & Time</p>
              <p style="margin: 0; font-size: 16px; font-weight: 800; color: #0f172a;">${escapeHtml(dateStr)}</p>
            </div>
          </div>
          <div style="padding: 18px; border-radius: 20px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 8px; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase; color: #475569;">Ticket ID</p>
            <p style="margin: 0; font-size: 16px; font-weight: 800; color: #0f172a; font-family: 'Courier New', monospace;">${escapeHtml(data.ticketId)}</p>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 18px;">
          <div style="padding: 18px; background: #0f172a; border-radius: 24px; width: 100%; display: flex; align-items: center; justify-content: center; min-height: 258px;">
            <div style="position: relative; display: inline-block; border-radius: 22px; background: #ffffff; padding: 10px;">
              <img src="${qr}" width="190" height="190" alt="QR Code" style="display:block; border-radius: 12px;" />
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 44px; height: 44px; background: #ffffff; border-radius: 10px; padding: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.18); display: flex; align-items: center; justify-content: center;">
                <img src="/logo.png" alt="CLIX" style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px;" />
              </div>
            </div>
          </div>
          <div style="padding: 16px; border-radius: 18px; background: #f8fafc; border: 1px solid #e2e8f0; width: 100%; text-align: center;">
            <p style="margin: 0 0 6px; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase; color: #475569;">Verification Code</p>
            <p style="margin: 0; font-size: 10px; font-weight: 700; color: #0f172a; word-break: break-word;">${escapeHtml(data.qrData)}</p>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 18px; padding: 20px 26px 26px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
        <span style="font-size: 8px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: #475569;">Official Event Access Pass</span>
        <span style="display:inline-flex; align-items:center; gap:8px; font-size: 9px; font-weight: 900; letter-spacing: 0.15em; color: #111827; text-transform: uppercase;"><img src="/image.png" alt="Clix trusted" width="16" height="16" style="display:block;" />Trusted by Clix</span>
      </div>
    </div>
    `,
    `Event Pass - ${data.ticketId}`,
    { delayMs: 700 }
  );
}
