// src/app/editor/utils/generatePdf.js
// Client-only: dipanggil dari komponen "use client"
export async function generatePdfFromElement({
  elementId,
  filename = 'my-cv.pdf',
  withWatermark = false,
  watermarkText = 'CVBuilder • Demo',
  quality = 2,
}) {
  if (typeof window === 'undefined') return;

  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const node = document.getElementById(elementId);
  if (!node) throw new Error(`Element #${elementId} tidak ditemukan`);

  // Tambah watermark sementara (tidak permanen)
  let wm;
  if (withWatermark) {
    wm = document.createElement('div');
    wm.style.position = 'absolute';
    wm.style.inset = '0';
    wm.style.pointerEvents = 'none';
    wm.style.display = 'grid';
    wm.style.placeItems = 'center';
    wm.style.opacity = '0.12';
    wm.style.fontSize = '48px';
    wm.style.fontWeight = '700';
    wm.style.letterSpacing = '2px';
    wm.style.transform = 'rotate(-18deg)';
    wm.style.color = '#000';
    wm.style.textAlign = 'center';
    wm.style.mixBlendMode = 'multiply';
    wm.textContent = watermarkText;

    node.style.position = node.style.position || 'relative';
    node.appendChild(wm);
  }

  const canvas = await html2canvas(node, {
    scale: quality,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  if (wm) node.removeChild(wm);

  const imgData = canvas.toDataURL('image/jpeg', 0.98);
  const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4', compress: true });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
  const imgW = canvas.width * ratio;
  const imgH = canvas.height * ratio;
  const x = (pageWidth - imgW) / 2;
  const y = (pageHeight - imgH) / 2;

  pdf.addImage(imgData, 'JPEG', x, y, imgW, imgH, undefined, 'FAST');
  pdf.save(filename);
}
