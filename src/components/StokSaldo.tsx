import { useState } from "react";
import { Package, TrendingDown, AlertTriangle, Eye, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DashboardCard } from "./DashboardCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";

interface StockBalance {
  id: string;
  item_name: string;
  item_code: string;
  unit: string;
  gudang_qty: number;
  poli_umum_qty: number;
  igd_qty: number;
  poli_anak_qty: number;
  total_qty: number;
  min_stock: number;
  last_update: string;
  batch_info: string;
  expired_date: string;
  nilai_persediaan: number;
}

const mockStockBalances: StockBalance[] = [
  {
    id: "1",
    item_name: "Paracetamol 500mg",
    item_code: "PCT001",
    unit: "tablet",
    gudang_qty: 1500,
    poli_umum_qty: 100,
    igd_qty: 200,
    poli_anak_qty: 50,
    total_qty: 1850,
    min_stock: 200,
    last_update: "2024-01-15",
    batch_info: "BP001, BP002",
    expired_date: "2025-06-30",
    nilai_persediaan: 925000
  },
  {
    id: "2",
    item_name: "Amoxicillin 500mg",
    item_code: "AMX001",
    unit: "tablet",
    gudang_qty: 800,
    poli_umum_qty: 50,
    igd_qty: 100,
    poli_anak_qty: 25,
    total_qty: 975,
    min_stock: 100,
    last_update: "2024-01-14",
    batch_info: "BA001",
    expired_date: "2025-12-31",
    nilai_persediaan: 1462500
  },
  {
    id: "3",
    item_name: "CTM 4mg",
    item_code: "CTM001",
    unit: "tablet",
    gudang_qty: 30,
    poli_umum_qty: 10,
    igd_qty: 5,
    poli_anak_qty: 2,
    total_qty: 47,
    min_stock: 50,
    last_update: "2024-01-13",
    batch_info: "BC001",
    expired_date: "2025-08-31",
    nilai_persediaan: 94000
  },
  {
    id: "4",
    item_name: "Betadine 10ml",
    item_code: "BTD001",
    unit: "botol",
    gudang_qty: 15,
    poli_umum_qty: 5,
    igd_qty: 8,
    poli_anak_qty: 2,
    total_qty: 30,
    min_stock: 25,
    last_update: "2024-01-12",
    batch_info: "BB001",
    expired_date: "2024-12-31",
    nilai_persediaan: 450000
  },
  {
    id: "5",
    item_name: "Oralit",
    item_code: "ORS001",
    unit: "sachet",
    gudang_qty: 150,
    poli_umum_qty: 25,
    igd_qty: 40,
    poli_anak_qty: 15,
    total_qty: 230,
    min_stock: 100,
    last_update: "2024-01-11",
    batch_info: "BO001",
    expired_date: "2025-09-30",
    nilai_persediaan: 345000
  }
];

export function StokSaldo() {
  const [stockBalances, setStockBalances] = useState<StockBalance[]>(mockStockBalances);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUnit, setFilterUnit] = useState("all");
  const [selectedStock, setSelectedStock] = useState<StockBalance | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredStocks = stockBalances.filter(stock => {
    const matchesSearch = stock.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.item_code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    paginatedData: paginatedStocks,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    totalItems,
    startIndex,
    endIndex
  } = usePagination<StockBalance>({ data: filteredStocks, itemsPerPage: 10 });

  const totalStockItems = stockBalances.length;
  const lowStockItems = stockBalances.filter(stock => stock.total_qty <= stock.min_stock).length;
  const totalValue = stockBalances.reduce((sum, stock) => sum + stock.nilai_persediaan, 0);
  const expiringItems = stockBalances.filter(stock => {
    const expiredDate = new Date(stock.expired_date);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiredDate <= threeMonthsFromNow;
  }).length;

  const getStockStatus = (current: number, minimum: number) => {
    if (current <= minimum * 0.5) return { variant: "destructive" as const, text: "Kritis" };
    if (current <= minimum) return { variant: "secondary" as const, text: "Rendah" };
    return { variant: "default" as const, text: "Normal" };
  };

  const showDetail = (stock: StockBalance) => {
    setSelectedStock(stock);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Stok & Saldo</h1>
          <p className="text-muted-foreground">Monitor stok barang dan nilai persediaan</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Item"
          value={totalStockItems.toString()}
          subtitle="jenis barang"
          icon={Package}
          trend={{ value: "Complete", isPositive: true }}
        />
        <DashboardCard
          title="Stok Rendah"
          value={lowStockItems.toString()}
          subtitle="perlu restock"
          icon={TrendingDown}
          trend={{ value: lowStockItems > 0 ? "Urgent" : "Safe", isPositive: lowStockItems === 0 }}
        />
        <DashboardCard
          title="Nilai Persediaan"
          value={`Rp ${(totalValue / 1000000).toFixed(1)}M`}
          subtitle="total aset"
          icon={Package}
          trend={{ value: "+5%", isPositive: true }}
        />
        <DashboardCard
          title="Akan Kadaluarsa"
          value={expiringItems.toString()}
          subtitle="dalam 3 bulan"
          icon={AlertTriangle}
          trend={{ value: expiringItems > 0 ? "Watch" : "Good", isPositive: expiringItems === 0 }}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>Saldo Stok Real Time</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              Menampilkan {startIndex}-{endIndex} dari {totalItems} stok
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari barang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Gudang</TableHead>
                <TableHead>Poli Umum</TableHead>
                <TableHead>IGD</TableHead>
                <TableHead>Poli Anak</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Min Stok</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nilai</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStocks.map((stock) => {
                const status = getStockStatus(stock.total_qty, stock.min_stock);
                return (
                  <TableRow key={stock.id}>
                    <TableCell className="font-mono">{stock.item_code}</TableCell>
                    <TableCell className="font-medium">{stock.item_name}</TableCell>
                    <TableCell>{stock.gudang_qty}</TableCell>
                    <TableCell>{stock.poli_umum_qty}</TableCell>
                    <TableCell>{stock.igd_qty}</TableCell>
                    <TableCell>{stock.poli_anak_qty}</TableCell>
                    <TableCell className="font-semibold">{stock.total_qty} {stock.unit}</TableCell>
                    <TableCell>{stock.min_stock}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.text}</Badge>
                    </TableCell>
                    <TableCell>Rp {stock.nilai_persediaan.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => showDetail(stock)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
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
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Stok - {selectedStock?.item_name}</DialogTitle>
          </DialogHeader>
          {selectedStock && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Informasi Barang</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Kode:</span>
                      <span className="text-sm font-mono">{selectedStock.item_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Satuan:</span>
                      <span className="text-sm">{selectedStock.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Batch:</span>
                      <span className="text-sm">{selectedStock.batch_info}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Kadaluarsa:</span>
                      <span className="text-sm">{new Date(selectedStock.expired_date).toLocaleDateString('id-ID')}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Distribusi Stok</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Gudang:</span>
                      <span className="text-sm font-semibold">{selectedStock.gudang_qty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Poli Umum:</span>
                      <span className="text-sm font-semibold">{selectedStock.poli_umum_qty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">IGD:</span>
                      <span className="text-sm font-semibold">{selectedStock.igd_qty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Poli Anak:</span>
                      <span className="text-sm font-semibold">{selectedStock.poli_anak_qty}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Total:</span>
                      <span className="text-sm font-bold">{selectedStock.total_qty}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Analisis Stok</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Stok Minimum:</span>
                    <span className="text-sm">{selectedStock.min_stock} {selectedStock.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Stok Tersedia:</span>
                    <span className="text-sm font-semibold">{selectedStock.total_qty - selectedStock.min_stock} {selectedStock.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Nilai Persediaan:</span>
                    <span className="text-sm font-semibold">Rp {selectedStock.nilai_persediaan.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Update Terakhir:</span>
                    <span className="text-sm">{new Date(selectedStock.last_update).toLocaleDateString('id-ID')}</span>
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