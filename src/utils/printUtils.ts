import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Print template at TRUE 1:1 physical scale
 * This ensures the template prints at actual size for cutting
 */
export const printTemplate = (elementId: string, unit: 'in' | 'mm' = 'in') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Template element not found');
    return;
  }

  // Get the SVG element
  const svg = element.querySelector('svg');
  if (!svg) {
    console.error('SVG element not found');
    return;
  }

  // Get SVG viewBox dimensions (these are in pixels at 96 DPI = 1 inch)
  const viewBox = svg.getAttribute('viewBox');
  if (!viewBox) {
    console.error('SVG viewBox not found');
    return;
  }

  const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);

  // For TRUE 1:1 scale:
  // - Screen: 96 DPI (standard CSS)
  // - Print: 96 DPI (standard printer)
  // - So 1 pixel on screen = 1 pixel on print = 1/96 inch
  // - We set SVG width/height in pixels to match physical size

  // Convert viewBox pixels to inches (assuming 96 DPI)
  const widthInches = vbWidth / 96;
  const heightInches = vbHeight / 96;

  // Clone the SVG
  const svgClone = svg.cloneNode(true) as SVGElement;
  
  // Set SVG to render at ACTUAL physical size
  // This is the key for 1:1 printing
  svgClone.setAttribute('width', `${vbWidth}`);
  svgClone.setAttribute('height', `${vbHeight}`);
  svgClone.style.width = `${vbWidth}px`;
  svgClone.style.height = `${vbHeight}px`;
  svgClone.style.maxWidth = 'none';
  svgClone.style.maxHeight = 'none';

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups for this website to print templates');
    return;
  }

  // Create print document with TRUE 1:1 scale
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Full Scale Template - 1:1 Print</title>
      <style>
        @page {
          margin: 0.25in;
          size: auto;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background: #f9fafb;
        }
        .print-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        .print-header h1 {
          font-size: 20px;
          margin-bottom: 8px;
        }
        .print-header p {
          font-size: 13px;
          opacity: 0.95;
          line-height: 1.5;
        }
        .instructions {
          background: #fef3c7;
          border: 2px solid #f59e0b;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 8px;
        }
        .instructions h2 {
          color: #92400e;
          font-size: 15px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .instructions ol {
          color: #78350f;
          font-size: 13px;
          line-height: 1.8;
          padding-left: 20px;
        }
        .instructions li {
          margin-bottom: 5px;
        }
        .template-container {
          background: white;
          border: 2px solid #e5e7eb;
          padding: 20px;
          display: inline-block;
          position: relative;
        }
        .scale-indicator {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: #dbeafe;
          border: 2px solid #3b82f6;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 11px;
          color: #1e40af;
          font-weight: bold;
        }
        .ruler {
          margin-top: 15px;
          padding: 10px;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
        }
        .ruler-title {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .ruler-bar {
          height: 30px;
          background: white;
          border: 2px solid #374151;
          position: relative;
          display: flex;
          align-items: flex-end;
        }
        .ruler-mark {
          flex: 1;
          border-left: 1px solid #374151;
          height: 100%;
          position: relative;
          display: flex;
          align-items: flex-end;
          padding-bottom: 2px;
          font-size: 9px;
          color: #374151;
          justify-content: center;
        }
        .ruler-mark:first-child {
          border-left: none;
        }
        .verification-box {
          margin-top: 15px;
          padding: 12px;
          background: #dcfce7;
          border: 2px solid #16a34a;
          border-radius: 6px;
        }
        .verification-box h3 {
          color: #166534;
          font-size: 13px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .verification-box p {
          color: #14532d;
          font-size: 12px;
          line-height: 1.6;
        }
        @media print {
          body {
            background: white;
            padding: 0;
          }
          .print-header,
          .instructions,
          .scale-indicator,
          .ruler,
          .verification-box,
          .no-print {
            display: none !important;
          }
          .template-container {
            border: none;
            padding: 0;
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-header no-print">
        <h1>🖨️ Full Scale Template (1:1)</h1>
        <p>This template is designed to print at TRUE physical size. Follow the instructions below to ensure accurate 1:1 scale printing.</p>
      </div>

      <div class="instructions no-print">
        <h2>📋 Printing Instructions</h2>
        <ol>
          <li><strong>Printer Settings:</strong> Set Scale to <strong>100%</strong> or <strong>"Actual Size"</strong></li>
          <li><strong>DO NOT</strong> use "Fit to page" or "Shrink to fit"</li>
          <li><strong>Paper Size:</strong> Use Letter (8.5" × 11") or A4</li>
          <li><strong>Orientation:</strong> Auto-select based on template size</li>
          <li><strong>After Printing:</strong> Use the ruler below to verify scale</li>
        </ol>
      </div>

      <div class="template-container">
        ${svgClone.outerHTML}
        <div class="scale-indicator">
          SCALE: 1:1 (100%)
        </div>
      </div>

      <div class="ruler no-print">
        <div class="ruler-title">📏 Verification Ruler (measure with actual ruler to confirm scale)</div>
        <div class="ruler-bar">
          ${Array.from({ length: 11 }).map((_, i) => `
            <div class="ruler-mark">
              ${i}"
            </div>
          `).join('')}
        </div>
      </div>

      <div class="verification-box no-print">
        <h3>✅ Verify Print Scale</h3>
        <p>
          <strong>Before cutting:</strong> Place a physical ruler on the printed template and verify that the ruler marks match exactly. 
          If the measurements don't match, check your printer settings and ensure "Scale" is set to 100% (NOT "Fit to page").
          <br><br>
          <strong>Template dimensions:</strong> ${(widthInches).toFixed(2)}" × ${(heightInches).toFixed(2)}" (${(widthInches * 25.4).toFixed(1)} mm × ${(heightInches * 25.4).toFixed(1)} mm)
        </p>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
  `);
  
  printWindow.document.close();
};

/**
 * Download template as PDF
 */
export const downloadPDF = async (elementId: string, filename: string = 'template') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Template element not found');
    return;
  }

  try {
    // Convert element to canvas at high resolution
    const canvas = await html2canvas(element, {
      scale: 3, // High quality
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'in',
      format: 'letter',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 0.5;
    const maxWidth = pageWidth - 2 * margin;
    const maxHeight = pageHeight - 2 * margin;

    const imgWidth = maxWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= maxHeight) {
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        margin,
        margin,
        imgWidth,
        imgHeight
      );
    } else {
      let position = margin;
      let heightLeft = imgHeight;

      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        margin,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= maxHeight;

      while (heightLeft > 0) {
        position = margin - (imgHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          margin,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= maxHeight;
      }
    }

    // Add scale info
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text(
      'For 1:1 scale printing, use Print function instead of PDF',
      margin,
      pageHeight - margin
    );

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

/**
 * Download template as PNG
 */
export const downloadPNG = async (elementId: string, filename: string = 'template') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Template element not found');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (error) {
    console.error('Error generating PNG:', error);
    alert('Error generating PNG. Please try again.');
  }
};
