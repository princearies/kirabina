import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Print template at actual physical size (1:1 scale)
 * This opens a new window with the template and triggers print dialog
 */
export const printTemplate = (elementId: string) => {
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

  // Get SVG viewBox dimensions
  const viewBox = svg.getAttribute('viewBox');
  if (!viewBox) {
    console.error('SVG viewBox not found');
    return;
  }

  const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);

  // Clone the SVG and set it to print at actual size
  const svgClone = svg.cloneNode(true) as SVGElement;
  
  // Set SVG to render at actual pixel size (96 DPI = 1 inch)
  // This ensures the template prints at 1:1 scale
  svgClone.setAttribute('width', `${vbWidth}px`);
  svgClone.setAttribute('height', `${vbHeight}px`);
  svgClone.style.width = `${vbWidth}px`;
  svgClone.style.height = `${vbHeight}px`;

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups for this website to print templates');
    return;
  }

  // Create print document with 1:1 scale
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Print Template - 100% Scale</title>
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
        }
        .print-info {
          background: #f0f9ff;
          border: 2px solid #0ea5e9;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 8px;
        }
        .print-info h2 {
          color: #0369a1;
          margin-bottom: 8px;
          font-size: 16px;
        }
        .print-info p {
          color: #0c4a6e;
          font-size: 13px;
          line-height: 1.5;
        }
        .print-info ul {
          margin-top: 8px;
          padding-left: 20px;
          color: #0c4a6e;
          font-size: 13px;
        }
        .template-wrapper {
          border: 1px solid #ccc;
          padding: 10px;
          display: inline-block;
        }
        .scale-warning {
          background: #fef3c7;
          border: 2px solid #f59e0b;
          padding: 10px;
          margin-top: 15px;
          border-radius: 8px;
          font-size: 12px;
          color: #92400e;
        }
        @media print {
          .print-info,
          .scale-warning,
          .no-print {
            display: none !important;
          }
          body {
            padding: 0;
          }
          .template-wrapper {
            border: none;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-info no-print">
        <h2>🖨️ Print Template at 100% Scale</h2>
        <p>Before printing, please ensure:</p>
        <ul>
          <li>Printer settings: Set <strong>Scale to 100%</strong> (NOT "Fit to page")</li>
          <li>Paper size: Select appropriate size for your template</li>
          <li>After printing, verify measurements with a ruler</li>
        </ul>
      </div>
      <div class="template-wrapper">
        ${svgClone.outerHTML}
      </div>
      <div class="scale-warning no-print">
        ⚠️ <strong>Important:</strong> If the template doesn't print at actual size, 
        check your printer settings and ensure "Scale" is set to 100% or "Actual Size".
        Do NOT use "Fit to page" or "Shrink to fit".
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
          window.onafterprint = function() {
            // Don't auto-close so user can verify print
          };
        };
      </script>
    </body>
    </html>
  `);
  
  printWindow.document.close();
};

/**
 * Download template as PDF
 * Note: PDF scale may not be 1:1 physical size - use Print for accurate measurements
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
      scale: 3, // High quality for print
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });

    // Create PDF in landscape for wider templates
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'in',
      format: 'letter',
    });

    // Page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 0.5;
    const maxWidth = pageWidth - 2 * margin;
    const maxHeight = pageHeight - 2 * margin;

    // Calculate dimensions to fit on page
    const imgWidth = maxWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= maxHeight) {
      // Fits on one page
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        margin,
        margin,
        imgWidth,
        imgHeight
      );
    } else {
      // Need to split across pages
      let position = margin;
      let heightLeft = imgHeight;

      // First page
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        margin,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= (maxHeight);

      // Additional pages
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

    // Add info text at bottom of first page
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text(
      'Generated by BuildCalc - For accurate 1:1 scale, use Print function instead',
      margin,
      pageHeight - margin
    );

    // Save PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

/**
 * Download template as high-resolution PNG image
 */
export const downloadPNG = async (elementId: string, filename: string = 'template') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Template element not found');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 3, // High resolution
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });

    // Convert to blob and download
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
