import { useState } from "react";
import { FileText, Download, Calendar, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DashboardCard } from "./DashboardCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";

interface LPLPOData {
  id: string;
  item_code: string;
  item_name: string;
  unit: string;
  stok_awal: number;
  penerimaan: number;
  pengeluaran: number;
  stok_akhir: number;
  kebutuhan_bulan_depan: number;
  permintaan: number;
  pemberian: number;
  sisa_stok: number;
  keterangan: string;
}

const mockLPLPOData: LPLPOData[] = [
  {
    id: "1",
    item_code: "AMX001",
    item_name: "Amoxicillin 500mg",
    unit: "tablet",
    stok_awal: 1000,
    penerimaan: 500,
    pengeluaran: 800,
    stok_akhir: 700,
    kebutuhan_bulan_depan: 900,
    permintaan: 1000,
    pemberian: 500,
    sisa_stok: 700,
    keterangan: "Normal"
  },
  {
    id: "2",
    item_code: "PCT001",
    item_name: "Paracetamol 500mg",
    unit: "tablet",
    stok_awal: 2000,
    penerimaan: 1000,
    pengeluaran: 1500,
    stok_akhir: 1500,
    kebutuhan_bulan_depan: 1600,
    permintaan: 1800,
    pemberian: 1000,
    sisa_stok: 1500,
    keterangan: "Normal"
  },
  {
    id: "3",
    item_code: "CTM001",
    item_name: "CTM 4mg",
    unit: "tablet",
    stok_awal: 300,
    penerimaan: 200,
    pengeluaran: 450,
    stok_akhir: 50,
    kebutuhan_bulan_depan: 400,
    permintaan: 500,
    pemberian: 200,
    sisa_stok: 50,
    keterangan: "Stok Rendah"
  },
  {
    id: "4",
    item_code: "ORS001",
    item_name: "Oralit",
    unit: "sachet",
    stok_awal: 500,
    penerimaan: 300,
    pengeluaran: 600,
    stok_akhir: 200,
    kebutuhan_bulan_depan: 700,
    permintaan: 800,
    pemberian: 300,
    sisa_stok: 200,
    keterangan: "Perlu Tambahan"
  },
  {
    id: "5",
    item_code: "BTD001",
    item_name: "Betadine 10ml",
    unit: "botol",
    stok_awal: 100,
    penerimaan: 50,
    pengeluaran: 80,
    stok_akhir: 70,
    kebutuhan_bulan_depan: 90,
    permintaan: 100,
    pemberian: 50,
    sisa_stok: 70,
    keterangan: "Normal"
  }
];

export function LaporanLPLPO() {
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<LPLPOData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredData = mockLPLPOData.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    paginatedData: paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    totalItems,
    startIndex,
    endIndex
  } = usePagination<LPLPOData>({ data: filteredData, itemsPerPage: 10 });

  const totalItems = filteredData.length;
  const totalStokAwal = filteredData.reduce((sum, item) => sum + item.stok_awal, 0);
  const totalPenerimaan = filteredData.reduce((sum, item) => sum + item.penerimaan, 0);
  const totalStokAkhir = filteredData.reduce((sum, item) => sum + item.stok_akhir, 0);

  const getStatusBadge = (keterangan: string) => {
    switch (keterangan) {
      case "Normal":
        return <Badge variant="default">Normal</Badge>;
      case "Stok Rendah":
        return <Badge variant="secondary">Stok Rendah</Badge>;
      case "Perlu Tambahan":
        return <Badge variant="destructive">Perlu Tambahan</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const showDetail = (item: LPLPOData) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const months = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Laporan LPLPO</h1>
          <p className="text-muted-foreground">Laporan Pemakaian dan Lembar Permintaan Obat</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Laporan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="month">Bulan</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year">Tahun</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="search">Cari Barang</Label>
              <Input
                id="search"
                placeholder="Nama atau kode barang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full gap-2">
                <Calendar className="h-4 w-4" />
                Generate Laporan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Item"
          value={totalItems.toString()}
          subtitle="jenis obat"
          icon={FileText}
          trend={{ value: "Complete", isPositive: true }}
        />
        <DashboardCard
          title="Stok Awal"
          value={totalStokAwal.toLocaleString()}
          subtitle="total unit"
          icon={FileText}
          trend={{ value: "+5%", isPositive: true }}
        />
        <DashboardCard
          title="Penerimaan"
          value={totalPenerimaan.toLocaleString()}
          subtitle="unit masuk"
          icon={FileText}
          trend={{ value: "+12%", isPositive: true }}
        />
        <DashboardCard
          title="Stok Akhir"
          value={totalStokAkhir.toLocaleString()}
          subtitle="sisa unit"
          icon={FileText}
          trend={{ value: "Stable", isPositive: true }}
        />
      </div>

      {/* LPLPO Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>LPLPO Bulan {months.find(m => m.value === selectedMonth)?.label} {selectedYear}</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              Menampilkan {startIndex}-{endIndex} dari {totalItems} item
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Obat</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead>Stok Awal</TableHead>
                  <TableHead>Penerimaan</TableHead>
                  <TableHead>Pengeluaran</TableHead>
                  <TableHead>Stok Akhir</TableHead>
                  <TableHead>Kebutuhan</TableHead>
                  <TableHead>Permintaan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.item_code}</TableCell>
                    <TableCell className="font-medium">{item.item_name}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.stok_awal.toLocaleString()}</TableCell>
                    <TableCell>{item.penerimaan.toLocaleString()}</TableCell>
                    <TableCell>{item.pengeluaran.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold">{item.stok_akhir.toLocaleString()}</TableCell>
                    <TableCell>{item.kebutuhan_bulan_depan.toLocaleString()}</TableCell>
                    <TableCell>{item.permintaan.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(item.keterangan)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => showDetail(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={goToPreviousPage}
                      className={hasPreviousPage ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => goToPage(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={goToNextPage}
                      className={hasNextPage ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail LPLPO - {selectedItem?.item_name}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Informasi Barang</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Kode:</span>
                      <span className="text-sm font-mono">{selectedItem.item_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Nama:</span>
                      <span className="text-sm font-medium">{selectedItem.item_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Satuan:</span>
                      <span className="text-sm">{selectedItem.unit}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Pergerakan Stok</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Stok Awal:</span>
                      <span className="text-sm font-semibold">{selectedItem.stok_awal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Penerimaan:</span>
                      <span className="text-sm font-semibold text-green-600">+{selectedItem.penerimaan.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pengeluaran:</span>
                      <span className="text-sm font-semibold text-red-600">-{selectedItem.pengeluaran.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Stok Akhir:</span>
                      <span className="text-sm font-bold">{selectedItem.stok_akhir.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Perencanaan Bulan Depan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Kebutuhan Estimasi:</span>
                    <span className="text-sm">{selectedItem.kebutuhan_bulan_depan.toLocaleString()} {selectedItem.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Permintaan:</span>
                    <span className="text-sm font-semibold">{selectedItem.permintaan.toLocaleString()} {selectedItem.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className="text-sm">{getStatusBadge(selectedItem.keterangan)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}