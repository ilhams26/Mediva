import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MEDIVA_LOGO_BASE64 } from "../assets/logoBase64";

/**
 * Helper untuk format tanggal Indonesia
 */
const formatIndoDateTime = (date = new Date()) => {
  const d = new Date(date);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

const formatIndoDateOnly = (date = new Date()) => {
  const d = new Date(date);
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

/**
 * Export Laporan ke Excel (.xlsx) menggunakan ExcelJS
 * Menyesuaikan layout Staff vs Admin sesuai mockup
 */
export const exportInventoryToExcel = async ({
  data = [],
  roleName = "staff",
  fileName = "Laporan.xlsx",
}) => {
  if (!data || data.length === 0) {
    alert("Tidak ada data untuk diexport!");
    return;
  }

  const isAdmin = roleName.toLowerCase() === "admin";
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Mediva";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Laporan", {
    views: [{ showGridLines: true }],
  });

  // 1. Tambahkan Logo Mediva ke Excel (di area A1:B2)
  try {
    const base64Data = MEDIVA_LOGO_BASE64.replace(/^data:image\/\w+;base64,/, "");
    const imageId = workbook.addImage({
      base64: base64Data,
      extension: "png",
    });

    worksheet.addImage(imageId, {
      tl: { col: 0.1, row: 0.1 },
      ext: { width: 135, height: 58 },
    });
  } catch (err) {
    console.error("Gagal menambahkan logo ke Excel:", err);
  }

  worksheet.getRow(1).height = 28;
  worksheet.getRow(2).height = 24;

  // 2. Judul
  worksheet.mergeCells("C1:F1");
  const titleCell = worksheet.getCell("C1");
  titleCell.value = isAdmin ? "LAPORAN PENJUALAN OBAT" : "LAPORAN PERGERAKAN STOK";
  titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FF000000" } };
  titleCell.alignment = { horizontal: "left", vertical: "middle" };

  // 3. Metadata
  const metaStyle = { name: "Arial", size: 10, color: { argb: "FF000000" } };
  worksheet.getRow(3).height = 20;
  worksheet.getCell("A3").value = `Tanggal Cetak : ${formatIndoDateTime()}`;
  worksheet.getCell("A3").font = metaStyle;

  worksheet.getRow(4).height = 20;
  worksheet.getCell("A4").value = `Dicetak Oleh  : ${roleName.toLowerCase()}`;
  worksheet.getCell("A4").font = metaStyle;

  worksheet.getRow(5).height = 20;
  worksheet.getCell("A5").value = "Status        : Laporan Lengkap";
  worksheet.getCell("A5").font = metaStyle;

  worksheet.getRow(6).height = 12;

  // 4. Header Kolom
  worksheet.getRow(7).height = 26;
  const headerColKeys = isAdmin
    ? ["No", "Tanggal", "Nama Obat", "Jumlah", "Pemasukan", "Stok Real"]
    : ["No", "Tanggal", "Nama Obat", "Pemasukan", "Pengeluaran", "Stok Akhir"];

  const thinBorder = {
    top: { style: "thin", color: { argb: "FFD1D5DB" } },
    bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
    left: { style: "thin", color: { argb: "FFD1D5DB" } },
    right: { style: "thin", color: { argb: "FFD1D5DB" } },
  };

  headerColKeys.forEach((label, idx) => {
    const cell = worksheet.getRow(7).getCell(idx + 1);
    cell.value = label;
    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1976D2" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = thinBorder;
  });

  // 5. Data Rows
  let currentRow = 8;
  let totalSum = 0;

  data.forEach((item, idx) => {
    const row = worksheet.getRow(currentRow + idx);
    row.height = 22;

    if (isAdmin) {
      const pemasukanNum = Number(item.pemasukan || 0);
      totalSum += pemasukanNum;

      row.getCell(1).value = idx + 1;
      row.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

      row.getCell(2).value = item.tanggal || "-";
      row.getCell(2).alignment = { horizontal: "center", vertical: "middle" };

      row.getCell(3).value = item.nama_obat || "-";
      row.getCell(3).alignment = { horizontal: "center", vertical: "middle" };

      row.getCell(4).value = Number(item.jumlah || 0);
      row.getCell(4).alignment = { horizontal: "center", vertical: "middle" };

      row.getCell(5).value = pemasukanNum;
      row.getCell(5).numFmt = "#,##0";
      row.getCell(5).font = { name: "Arial", size: 10, bold: true, color: { argb: "FF16A34A" } };
      row.getCell(5).alignment = { horizontal: "center", vertical: "middle" };

      row.getCell(6).value = Number(item.stok_real || 0);
      row.getCell(6).alignment = { horizontal: "center", vertical: "middle" };
      row.getCell(6).font = { name: "Arial", size: 10, bold: true };
    } else {
      const stokAkhir = Number(item.stok_akhir ?? item.jumlah ?? 0);
      totalSum += stokAkhir;

      row.getCell(1).value = idx + 1;
      row.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

      row.getCell(2).value = item.tanggal || "-";
      row.getCell(2).alignment = { horizontal: "center", vertical: "middle" };

      row.getCell(3).value = item.nama_obat || "-";
      row.getCell(3).alignment = { horizontal: "center", vertical: "middle" };

      row.getCell(4).value = Number(item.pemasukan || 0);
      row.getCell(4).numFmt = "#,##0";
      row.getCell(4).alignment = { horizontal: "center", vertical: "middle" };

      row.getCell(5).value = Number(item.pengeluaran || 0);
      row.getCell(5).numFmt = "#,##0";
      row.getCell(5).alignment = { horizontal: "center", vertical: "middle" };

      row.getCell(6).value = stokAkhir;
      row.getCell(6).numFmt = "#,##0";
      row.getCell(6).alignment = { horizontal: "center", vertical: "middle" };
      row.getCell(6).font = { name: "Arial", size: 10, bold: true };
    }

    for (let c = 1; c <= 6; c++) {
      row.getCell(c).border = thinBorder;
      if (!row.getCell(c).font) {
        row.getCell(c).font = { name: "Arial", size: 10 };
      }
    }
  });

  // 6. Baris Total (Tampilan persis sesuai gambar mockup untuk Admin & Staff)
  const totalRowIndex = currentRow + data.length;
  const totalRow = worksheet.getRow(totalRowIndex);
  totalRow.height = 24;

  // Gabungkan Kolom A s/d E dengan label TOTAL / TOTAL PENJUALAN
  worksheet.mergeCells(`A${totalRowIndex}:E${totalRowIndex}`);
  const totLabel = worksheet.getCell(`A${totalRowIndex}`);
  totLabel.value = isAdmin ? "TOTAL PENJUALAN" : "TOTAL";
  totLabel.font = { name: "Arial", size: 10, bold: true };
  totLabel.alignment = { horizontal: "center", vertical: "middle" };
  totLabel.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDBEAFE" } }; // Biru muda lembut

  // Kolom F dengan teks angka hijau tebal persis seperti di gambar
  const totVal = worksheet.getCell(`F${totalRowIndex}`);
  totVal.value = totalSum;
  totVal.numFmt = "#,##0";
  totVal.font = { name: "Arial", size: 11, bold: true, color: { argb: "FF16A34A" } }; // Warna hijau tebal
  totVal.alignment = { horizontal: "center", vertical: "middle" };
  totVal.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDBEAFE" } };

  for (let c = 1; c <= 6; c++) {
    totalRow.getCell(c).border = thinBorder;
  }

  // 7. Lebar Kolom
  worksheet.columns = [
    { key: "no", width: 7 },
    { key: "tanggal", width: 22 },
    { key: "nama_obat", width: 34 },
    { key: "col4", width: 16 },
    { key: "col5", width: 18 },
    { key: "col6", width: 16 },
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

/**
 * Cetak Laporan ke PDF dengan tampilan persis sesuai Mockup
 */
export const exportInventoryToPdf = ({
  data = [],
  roleName = "Staff",
  fileName = "Laporan.pdf",
}) => {
  if (!data || data.length === 0) {
    alert("Tidak ada data untuk dicetak!");
    return;
  }

  const isAdmin = roleName.toLowerCase() === "admin";
  const doc = new jsPDF("p", "mm", "a4");

  // 1. Logo Mediva di tengah atas
  try {
    const logoWidth = 36;
    const logoHeight = 15.8;
    const logoX = (210 - logoWidth) / 2;
    doc.addImage(MEDIVA_LOGO_BASE64, "PNG", logoX, 8, logoWidth, logoHeight);
  } catch (err) {
    console.error("Gagal memuat logo ke PDF:", err);
  }

  // 2. Teks di bawah Logo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(isAdmin ? "Laporan Penjualan Obat" : "Laporan Inventori Obat", 105, 29, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Sistem Manajemen Apotek", 105, 33.5, { align: "center" });

  // 3. Garis Biru Pembatas
  doc.setDrawColor(25, 118, 210);
  doc.setLineWidth(0.7);
  doc.line(14, 37, 196, 37);

  // 4. Informasi Metadata (2 Kolom)
  const totalItemObat = new Set(data.map((d) => d.nama_obat || d.obat_id)).size;
  const totalSum = isAdmin
    ? data.reduce((acc, row) => acc + (Number(row.pemasukan) || 0), 0)
    : data.reduce((acc, row) => acc + (Number(row.stok_akhir) || 0), 0);

  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);

  const yStart = 44;
  const lineSpacing = 5;

  doc.setFont("helvetica", "bold");
  doc.text("Tanggal Cetak", 14, yStart);
  doc.text("Dicetak Oleh", 14, yStart + lineSpacing);
  doc.text("Status", 14, yStart + lineSpacing * 2);

  doc.setFont("helvetica", "normal");
  doc.text(`:  ${formatIndoDateTime()}`, 40, yStart);
  doc.text(`:  ${roleName}`, 40, yStart + lineSpacing);
  doc.text(`:  Laporan Lengkap`, 40, yStart + lineSpacing * 2);

  const xRight = 118;
  doc.setFont("helvetica", "bold");
  doc.text(isAdmin ? "Total Transaksi" : "Total Obat", xRight, yStart);
  doc.text(isAdmin ? "Total Obat Terjual" : "Total Pemasukan", xRight, yStart + lineSpacing);
  doc.text(isAdmin ? "Total Penjualan" : "Total Pengeluaran", xRight, yStart + lineSpacing * 2);

  doc.setFont("helvetica", "normal");
  if (isAdmin) {
    const totalQty = data.reduce((acc, row) => acc + (Number(row.jumlah) || 0), 0);
    doc.text(`:  ${data.length} transaksi`, xRight + 34, yStart);
    doc.text(`:  ${totalQty} item`, xRight + 34, yStart + lineSpacing);
    doc.text(`:  Rp ${totalSum.toLocaleString("id-ID")}`, xRight + 34, yStart + lineSpacing * 2);
  } else {
    const totalIn = data.reduce((acc, row) => acc + (Number(row.pemasukan) || 0), 0);
    const totalOut = data.reduce((acc, row) => acc + (Number(row.pengeluaran) || 0), 0);
    doc.text(`:  ${totalItemObat} item`, xRight + 34, yStart);
    doc.text(`:  ${totalIn.toLocaleString("id-ID")} unit`, xRight + 34, yStart + lineSpacing);
    doc.text(`:  ${totalOut.toLocaleString("id-ID")} unit`, xRight + 34, yStart + lineSpacing * 2);
  }

  // 5. Tabel AutoTable
  const headers = isAdmin
    ? ["No", "Tanggal", "Nama Obat", "Jumlah", "Pemasukan", "Stok Real"]
    : ["No", "Obat", "Pemasukan", "Pengeluaran", "Stok Real"];

  const rows = isAdmin
    ? data.map((row, idx) => [
        idx + 1,
        row.tanggal || "-",
        row.nama_obat || "-",
        Number(row.jumlah || 0),
        Number(row.pemasukan || 0).toLocaleString("id-ID"),
        Number(row.stok_real || 0).toLocaleString("id-ID"),
      ])
    : data.map((row, idx) => [
        idx + 1,
        row.nama_obat || "-",
        Number(row.pemasukan || 0).toLocaleString("id-ID"),
        Number(row.pengeluaran || 0).toLocaleString("id-ID"),
        Number(row.stok_akhir || 0).toLocaleString("id-ID"),
      ]);

  const footContent = isAdmin
    ? [
        [
          {
            content: "TOTAL PENJUALAN",
            colSpan: 5,
            styles: {
              halign: "center",
              fontStyle: "bold",
              textColor: [30, 41, 59],
              fillColor: [219, 234, 254],
              fontSize: 8.5,
            },
          },
          {
            content: totalSum.toLocaleString("id-ID"),
            styles: {
              halign: "center",
              fontStyle: "bold",
              textColor: [22, 163, 74],
              fillColor: [219, 234, 254],
              fontSize: 8.5,
            },
          },
        ],
      ]
    : [
        [
          {
            content: "TOTAL STOK REAL",
            colSpan: 4,
            styles: {
              halign: "right",
              fontStyle: "bold",
              textColor: [21, 101, 192],
              fillColor: [227, 242, 253],
              fontSize: 8.5,
            },
          },
          {
            content: totalSum.toLocaleString("id-ID"),
            styles: {
              halign: "center",
              fontStyle: "bold",
              textColor: [21, 101, 192],
              fillColor: [227, 242, 253],
              fontSize: 8.5,
            },
          },
        ],
      ];

  autoTable(doc, {
    startY: 61,
    head: [headers],
    body: rows,
    theme: "plain",
    headStyles: {
      fillColor: [25, 118, 210],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "center",
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 2.2,
      lineColor: [226, 232, 240],
      lineWidth: { bottom: 0.1 },
    },
    columnStyles: isAdmin
      ? {
          0: { halign: "center", cellWidth: 12 },
          1: { halign: "center", cellWidth: 34 },
          2: { halign: "center", cellWidth: 48 },
          3: { halign: "center", cellWidth: 24 },
          4: { halign: "center", cellWidth: 34, textColor: [22, 163, 74], fontStyle: "bold" },
          5: { halign: "center", cellWidth: 30, fontStyle: "bold" },
        }
      : {
          0: { halign: "center", cellWidth: 12 },
          1: { halign: "left", cellWidth: 84 },
          2: { halign: "center", cellWidth: 28 },
          3: { halign: "center", cellWidth: 28 },
          4: { halign: "center", cellWidth: 30, fontStyle: "bold" },
        },
    foot: footContent,
    margin: { left: 14, right: 14 },
    showFoot: "lastPage",
  });

  // 6. Tanda Tangan
  let finalY = doc.lastAutoTable.finalY + 16;
  if (finalY + 36 > 285) {
    doc.addPage();
    finalY = 25;
  }

  const signX = 140;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  doc.text(`Indramayu, ${formatIndoDateOnly()}`, signX + 25, finalY, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.text("Mengetahui,", signX + 25, finalY + 5, { align: "center" });

  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.3);
  doc.line(signX, finalY + 24, signX + 50, finalY + 24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Pemilik Apotek Mediva", signX + 25, finalY + 29, { align: "center" });

  doc.save(fileName);
};
