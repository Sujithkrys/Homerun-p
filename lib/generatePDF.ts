import { jsPDF } from "jspdf";
import { CartItem, ProjectEstimate, EstimationSummary } from "./types";

export function generateEstimatePDF(
  items: CartItem[],
  projectEstimate: ProjectEstimate | null,
  estimationSummary: EstimationSummary | null
): Blob {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const estimateNumber = `HR-${Math.floor(100000 + Math.random() * 900000)}`;

  // Header Banner
  doc.setFillColor(245, 197, 24); // #f5c518 yellow
  doc.roundedRect(margin, y, 16, 16, 3, 3, "F");

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("HR", margin + 4, y + 11);

  doc.setFontSize(20);
  doc.setTextColor(26, 122, 58); // #1a7a3a brand green
  doc.text("HomeRun", margin + 20, y + 8);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128); // #6b7280
  doc.text("Material Estimate & Bill of Materials", margin + 20, y + 14);

  // Top-right meta
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81);
  doc.text(`Estimate #: ${estimateNumber}`, pageWidth - margin, y + 6, {
    align: "right",
  });
  doc.text(`Date: ${today}`, pageWidth - margin, y + 11, { align: "right" });
  doc.text(`Valid for: 7 Days`, pageWidth - margin, y + 16, { align: "right" });

  y += 24;

  // Divider line
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  function checkPageBreak(neededSpace: number) {
    if (y + neededSpace > pageHeight - 25) {
      doc.addPage();
      y = margin + 5;
    }
  }

  // Multi-room Project Estimate layout
  if (projectEstimate && projectEstimate.rooms && projectEstimate.rooms.length > 0) {
    // Project Title Box
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text(`Project: ${projectEstimate.project_name || "Material Estimate"}`, margin + 4, y + 9);

    if (estimationSummary?.area_sqft) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Total Area: ${estimationSummary.area_sqft} sqft`, pageWidth - margin - 4, y + 9, {
        align: "right",
      });
    }

    y += 18;

    projectEstimate.rooms.forEach((room, rIdx) => {
      checkPageBreak(35);

      // Room Header
      doc.setFillColor(236, 253, 245); // light emerald green
      doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(6, 95, 70); // deep green
      const roomTitle = `${room.room_name} — ${room.task_type.toUpperCase()}${
        room.area_sqft ? ` (${room.area_sqft} sqft)` : ""
      }`;
      doc.text(roomTitle, margin + 4, y + 5.5);
      doc.text(`Subtotal: Rs. ${room.room_total.toLocaleString("en-IN")}`, pageWidth - margin - 4, y + 5.5, {
        align: "right",
      });

      y += 11;

      // Table Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(107, 114, 128);
      doc.text("ITEM", margin + 4, y);
      doc.text("QTY", margin + 105, y, { align: "right" });
      doc.text("UNIT PRICE", margin + 140, y, { align: "right" });
      doc.text("TOTAL", pageWidth - margin - 4, y, { align: "right" });

      y += 3;
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;

      // Items
      room.cart_items.forEach((item) => {
        checkPageBreak(10);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(31, 41, 55);

        // Truncate long item names
        const itemName = item.name.length > 45 ? item.name.substring(0, 42) + "..." : item.name;
        doc.text(itemName, margin + 4, y);
        doc.text(`${item.quantity} ${item.unit}`, margin + 105, y, { align: "right" });
        doc.text(`Rs. ${item.unit_price.toLocaleString("en-IN")}`, margin + 140, y, { align: "right" });
        doc.setFont("helvetica", "bold");
        doc.text(`Rs. ${item.total.toLocaleString("en-IN")}`, pageWidth - margin - 4, y, { align: "right" });
        y += 6;
      });

      y += 4;
    });

    // Grand summary box
    checkPageBreak(30);
    y += 4;
    doc.setDrawColor(209, 213, 219);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(17, 24, 39);
    doc.text("Grand Total:", pageWidth - margin - 60, y);
    doc.setTextColor(26, 122, 58);
    doc.text(`Rs. ${projectEstimate.grand_total.toLocaleString("en-IN")}`, pageWidth - margin - 4, y, {
      align: "right",
    });

    if (projectEstimate.savings_on_bulk > 0) {
      y += 6;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(16, 185, 129);
      doc.text(
        `Bulk Pricing Savings Applied: Rs. ${projectEstimate.savings_on_bulk.toLocaleString("en-IN")}`,
        pageWidth - margin - 4,
        y,
        { align: "right" }
      );
    }
  } else {
    // Single estimate or Cart items table
    const tableItems = items.length > 0 ? items : [];
    const subtotal = tableItems.reduce((sum, item) => sum + item.total, 0);
    const delivery = subtotal >= 500 ? 0 : 49;
    const grandTotal = subtotal + delivery;

    // Table Header
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(margin, y, contentWidth, 8, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    doc.text("ITEM DESCRIPTION", margin + 4, y + 5.5);
    doc.text("QTY", margin + 110, y + 5.5, { align: "right" });
    doc.text("UNIT PRICE", margin + 145, y + 5.5, { align: "right" });
    doc.text("TOTAL", pageWidth - margin - 4, y + 5.5, { align: "right" });

    y += 12;

    tableItems.forEach((item, idx) => {
      checkPageBreak(10);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(31, 41, 55);

      const itemName = item.name.length > 48 ? item.name.substring(0, 45) + "..." : item.name;
      doc.text(itemName, margin + 4, y);
      doc.text(`${item.quantity} ${item.unit}`, margin + 110, y, { align: "right" });
      doc.text(`Rs. ${item.unit_price.toLocaleString("en-IN")}`, margin + 145, y, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.text(`Rs. ${item.total.toLocaleString("en-IN")}`, pageWidth - margin - 4, y, { align: "right" });

      y += 6;
      doc.setDrawColor(243, 244, 246);
      doc.line(margin, y - 1, pageWidth - margin, y - 1);
    });

    // Summary Totals
    checkPageBreak(30);
    y += 6;
    doc.setDrawColor(209, 213, 219);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text("Subtotal:", pageWidth - margin - 55, y);
    doc.text(`Rs. ${subtotal.toLocaleString("en-IN")}`, pageWidth - margin - 4, y, { align: "right" });

    y += 6;
    doc.text("Express Delivery (60 min):", pageWidth - margin - 55, y);
    doc.text(delivery === 0 ? "FREE" : `Rs. ${delivery}`, pageWidth - margin - 4, y, { align: "right" });

    y += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text("Estimated Total:", pageWidth - margin - 55, y);
    doc.setTextColor(26, 122, 58);
    doc.text(`Rs. ${grandTotal.toLocaleString("en-IN")}`, pageWidth - margin - 4, y, { align: "right" });

    if (grandTotal >= 50000) {
      y += 6;
      doc.setFontSize(9);
      doc.setTextColor(16, 185, 129);
      doc.text("🎉 2% Cashback applicable on this order!", pageWidth - margin - 4, y, { align: "right" });
    }
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const footerY = pageHeight - 16;

    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.4);
    doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text("Generated by HomeRun AI | home-run.co", margin, footerY + 2);
    doc.text("Delivery in 60 minutes across Bangalore | 105+ pin codes", margin, footerY + 6);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, footerY + 2, { align: "right" });
    doc.text("Prices valid as of date. Estimates may vary based on site conditions.", pageWidth - margin, footerY + 6, {
      align: "right",
    });
  }

  return doc.output("blob");
}
