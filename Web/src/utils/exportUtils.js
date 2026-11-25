import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MEDIVA_LOGO_BASE64 } from "../assets/logoBase64";

/**
 * Helper untuk format tanggal Indonesia
 * Contoh: 26 Nov 2026 02:38
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
 * Dilengkapi Logo Mediva dan styling persis sesuai mockup Image 2
 * @param {Object} options
 * @param {Array<Object>} options.data - Data pergerakan stok
 * @param {string} options.roleName - Role yang mencetak (misal: "staff" atau "admin")
 * @param {string} [options.fileName] - Nama file output
 */
export const exportInventoryToExcel = async ({
  data = [],
  roleName = "staff",
  fileName = "Laporan_Inventori_Obat.xlsx",
}) => {
  if (!data || data.length === 0) {
    alert("Tidak ada data untuk diexport!");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Mediva";
  workbook.lastModifiedBy = "Mediva";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet("Inventori Obat", {
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

  // Row heights untuk area logo & judul
  worksheet.getRow(1).height = 28;
  worksheet.getRow(2).height = 24;

  // 2. Judul (LAPORAN INVENTORI OBAT) di cell C1 / D1
  worksheet.mergeCells("C1:F1");
  const titleCell = worksheet.getCell("C1");
  titleCell.value = "LAPORAN INVENTORI OBAT";
  titleCell.font = {
    name: "Arial",
    size: 14,
    bold: true,
    color: { argb: "FF000000" },
  };
  titleCell.alignment = { horizontal: "left", vertical: "middle" };

  // 3. Metadata (Row 3, 4, 5)
  const metaStyle = {
    name: "Arial",
    size: 10,
    color: { argb: "FF000000" },
  };

  worksheet.getRow(3).height = 20;
  worksheet.getCell("A3").value = `Tanggal Cetak : ${formatIndoDateTime()}`;
  worksheet.getCell("A3").font = metaStyle;

  worksheet.getRow(4).height = 20;
  worksheet.getCell("A4").value = `Dicetak Oleh  : ${roleName.toLowerCase()}`;
  worksheet.getCell("A4").font = metaStyle;

  worksheet.getRow(5).height = 20;
  worksheet.getCell("A5").value = "Status        : Laporan Lengkap";
  worksheet.getCell("A5").font = metaStyle;

  // Row 6 adalah baris kosong pemisah
  worksheet.getRow(6).height = 12;

  // 4. Table Header (Row 7) - Background Biru #1976D2, Font Putih Bold
  worksheet.getRow(7).height = 26;
  const headerColKeys = ["No", "Tanggal", "Nama Obat", "Pemasukan", "Pengeluaran", "Stok Akhir"];

  const thinBorder = {
    top: { style: "thin", color: { argb: "FFD1D5DB" } },
    bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
    left: { style: "thin", color: { argb: "FFD1D5DB" } },
    right: { style: "thin", color: { argb: "FFD1D5DB" } },
  };

  headerColKeys.forEach((label, idx) => {
    const colNumber = idx + 1;
    const cell = worksheet.getRow(7).getCell(colNumber);
    cell.value = label;
    cell.font = {
      name: "Arial",
      size: 10,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1976D2" }, // Biru Mediva persis di gambar
    };
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF0D47A1" } },
      bottom: { style: "thin", color: { argb: "FF0D47A1" } },
      left: { style: "thin", color: { argb: "FF0D47A1" } },
      right: { style: "thin", color: { argb: "FF0D47A1" } },
    };
  });

  // 5. Data Rows (Row 8 onwards)
  let currentRow = 8;
  let sumStokAkhir = 0;

  data.forEach((item, idx) => {
    const row = worksheet.getRow(currentRow + idx);
    row.height = 22;

    const stokAkhir = Number(item.stok_akhir ?? item.jumlah ?? 0);
    sumStokAkhir += stokAkhir;

    // Col 1: No
    const c1 = row.getCell(1);
    c1.value = idx + 1;
    c1.alignment = { horizontal: "center", vertical: "middle" };
    c1.font = { name: "Arial", size: 10 };
    c1.border = thinBorder;

    // Col 2: Tanggal
    const c2 = row.getCell(2);
    c2.value = item.tanggal || "-";
    c2.alignment = { horizontal: "center", vertical: "middle" };
    c2.font = { name: "Arial", size: 10 };
    c2.border = thinBorder;

    // Col 3: Nama Obat
    const c3 = row.getCell(3);
    c3.value = item.nama_obat || "-";
    c3.alignment = { horizontal: "left", vertical: "middle" };
    c3.font = { name: "Arial", size: 10 };
    c3.border = thinBorder;

    // Col 4: Pemasukan
    const c4 = row.getCell(4);
    c4.value = Number(item.pemasukan || 0);
    c4.alignment = { horizontal: "center", vertical: "middle" };
    c4.font = { name: "Arial", size: 10 };
    c4.border = thinBorder;

    // Col 5: Pengeluaran
    const c5 = row.getCell(5);
    c5.value = Number(item.pengeluaran || 0);
    c5.alignment = { horizontal: "center", vertical: "middle" };
    c5.font = { name: "Arial", size: 10 };
    c5.border = thinBorder;

    // Col 6: Stok Akhir (bold)
    const c6 = row.getCell(6);
    c6.value = stokAkhir;
    c6.alignment = { horizontal: "center", vertical: "middle" };
    c6.font = { name: "Arial", size: 10, bold: true };
    c6.border = thinBorder;
  });

  // 6. Baris TOTAL (Persis seperti mockup Excel Gambar 2)
  const totalRowIndex = currentRow + data.length;
  const totalRow = worksheet.getRow(totalRowIndex);
  totalRow.height = 24;

  // Col 1 & 2: kosong dengan garis atas
  totalRow.getCell(1).border = { top: { style: "thin", color: { argb: "FFD1D5DB" } } };
  totalRow.getCell(2).border = { top: { style: "thin", color: { argb: "FFD1D5DB" } } };

  // Col 3: TOTAL (Border hijau di gambar)
  const totC = totalRow.getCell(3);
  totC.value = "TOTAL";
  totC.font = { name: "Arial", size: 10, bold: true };
  totC.alignment = { horizontal: "left", vertical: "middle" };
  totC.border = {
    top: { style: "medium", color: { argb: "FF1E7E34" } },
    bottom: { style: "medium", color: { argb: "FF1E7E34" } },
    left: { style: "medium", color: { argb: "FF1E7E34" } },
  };

  // Col 4: Abu-abu solid
  const totD = totalRow.getCell(4);
  totD.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD9D9D9" },
  };
  totD.border = {
    top: { style: "medium", color: { argb: "FF1E7E34" } },
    bottom: { style: "medium", color: { argb: "FF1E7E34" } },
  };

  // Col 5: Abu-abu solid
  const totE = totalRow.getCell(5);
  totE.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD9D9D9" },
  };
  totE.border = {
    top: { style: "medium", color: { argb: "FF1E7E34" } },
    bottom: { style: "medium", color: { argb: "FF1E7E34" } },
  };

  // Col 6: Nilai Stok Akhir
  const totF = totalRow.getCell(6);
  totF.value = sumStokAkhir;
  totF.font = { name: "Arial", size: 10, bold: true };
  totF.alignment = { horizontal: "right", vertical: "middle" };
  totF.border = {
    top: { style: "medium", color: { argb: "FF1E7E34" } },
    bottom: { style: "medium", color: { argb: "FF1E7E34" } },
    right: { style: "medium", color: { argb: "FF1E7E34" } },
  };

  // 7. Atur Lebar Kolom
  worksheet.columns = [
    { key: "no", width: 7 },
    { key: "tanggal", width: 22 },
    { key: "nama_obat", width: 36 },
    { key: "pemasukan", width: 16 },
    { key: "pengeluaran", width: 16 },
    { key: "stok_akhir", width: 16 },
  ];

  // 8. Download File Excel
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
 * Cetak Laporan ke PDF dengan tampilan persis sesuai Mockup Image 1
 * Logo Kinara diganti dengan Logo Mediva
 * @param {Object} options
 * @param {Array<Object>} options.data - Data pergerakan stok
 * @param {string} options.roleName - Role yang mencetak (misal: "Staff" atau "Admin")
 * @param {string} [options.fileName] - Nama file output
 */
export const exportInventoryToPdf = ({
  data = [],
  roleName = "Staff",
  fileName = "Laporan_Inventori_Obat.pdf",
}) => {
  if (!data || data.length === 0) {
    alert("Tidak ada data untuk dicetak!");
    return;
  }

  const doc = new jsPDF("p", "mm", "a4");

  // 1. Logo Mediva di tengah atas (menggantikan logo Kinara)
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
  doc.text("Laporan Inventori Obat", 105, 29, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Sistem Manajemen Apotek", 105, 33.5, { align: "center" });

  // 3. Garis Biru Pembatas (Persis sesuai gambar)
  doc.setDrawColor(25, 118, 210); // #1976D2
  doc.setLineWidth(0.7);
  doc.line(14, 37, 196, 37);

  // 4. Informasi Metadata (2 Kolom)
  const totalItemObat = new Set(data.map((d) => d.nama_obat || d.obat_id)).size;
  const totalPemasukan = data.reduce((acc, row) => acc + (Number(row.pemasukan) || 0), 0);
  const totalPengeluaran = data.reduce((acc, row) => acc + (Number(row.pengeluaran) || 0), 0);
  const totalStokReal = data.reduce((acc, row) => acc + (Number(row.stok_akhir) || 0), 0);

  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);

  // Kolom Kiri
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

  // Kolom Kanan
  const xRight = 118;
  doc.setFont("helvetica", "bold");
  doc.text("Total Obat", xRight, yStart);
  doc.text("Total Pemasukan", xRight, yStart + lineSpacing);
  doc.text("Total Pengeluaran", xRight, yStart + lineSpacing * 2);

  doc.setFont("helvetica", "normal");
  doc.text(`:  ${totalItemObat} item`, xRight + 34, yStart);
  doc.text(`:  ${totalPemasukan.toLocaleString("id-ID")} unit`, xRight + 34, yStart + lineSpacing);
  doc.text(`:  ${totalPengeluaran.toLocaleString("id-ID")} unit`, xRight + 34, yStart + lineSpacing * 2);

  // 5. Tabel Data (AutoTable)
  const headers = ["No", "Obat", "Pemasukan", "Pengeluaran", "Stok Real"];
  const rows = data.map((row, idx) => [
    idx + 1,
    row.nama_obat || "-",
    Number(row.pemasukan || 0).toLocaleString("id-ID"),
    Number(row.pengeluaran || 0).toLocaleString("id-ID"),
    Number(row.stok_akhir || 0).toLocaleString("id-ID"),
  ]);

  autoTable(doc, {
    startY: 61,
    head: [headers],
    body: rows,
    theme: "plain",
    headStyles: {
      fillColor: [25, 118, 210], // Biru Mediva persis di gambar
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
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      1: { halign: "left", cellWidth: 84 },
      2: { halign: "center", cellWidth: 28 },
      3: { halign: "center", cellWidth: 28 },
      4: { halign: "center", cellWidth: 30, fontStyle: "bold" },
    },
    foot: [
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
          content: totalStokReal.toLocaleString("id-ID"),
          styles: {
            halign: "center",
            fontStyle: "bold",
            textColor: [21, 101, 192],
            fillColor: [227, 242, 253],
            fontSize: 8.5,
          },
        },
      ],
    ],
    margin: { left: 14, right: 14 },
    showFoot: "lastPage",
  });

  // 6. Bagian Tanda Tangan (Mengetahui di kanan bawah)
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
