const prisma = require('../../config/prisma');
const { bulanIni, rentangBulan } = require('../../shared/utils/date');

// Dipanggil dashboard core (CR-04): total pemasukan & pengeluaran bulan berjalan.
// Transaksi yang dihapus (soft delete) tidak dihitung (BR-09, BR-10).
async function getRingkasanKeuangan() {
  const bulan = bulanIni();
  const { awal, akhir } = rentangBulan(bulan);

  const totalPerJenis = await prisma.kuTransaction.groupBy({
    by: ['jenis'],
    where: { deleted_at: null, tanggal: { gte: awal, lte: akhir } },
    _sum: { nominal: true },
  });

  const total = (jenis) => Number(totalPerJenis.find((t) => t.jenis === jenis)?._sum.nominal ?? 0);
  const pemasukan = total('PEMASUKAN');
  const pengeluaran = total('PENGELUARAN');

  return {
    bulan,
    total_pemasukan: pemasukan,
    total_pengeluaran: pengeluaran,
    saldo: pemasukan - pengeluaran,
  };
}

module.exports = { getRingkasanKeuangan };
