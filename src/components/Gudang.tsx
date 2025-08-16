import { useState } from "react";
import { Plus, Package, Calendar, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DashboardCard } from "./DashboardCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";

interface StockEntry {
  id: string;
  item_name: string;
  item_code: string;
  batch: string;
  quantity: number;
  unit: string;
  expired_date: string;
  supplier: string;
  entry_date: string;
  source_fund: string;
}

const mockStockEntries: StockEntry[] = [
  {
    id: "1",
    item_name: "Amoxicillin 500mg",
    item_code: "AMX001",
    batch: "BA001",
    quantity: 1000,
    unit: "tablet",
    expired_date: "2025-12-31",
    supplier: "PT Kimia Farma",
    entry_date: "2024-01-15",
    source_fund: "BOK"
  },
  {
    id: "2",
    item_name: "Paracetamol 500mg",
    item_code: "PCT001",
    batch: "BP001",
    quantity: 2000,
    unit: "tablet",
    expired_date: "2025-06-30",
    supplier: "PT Kalbe Farma",
    entry_date: "2024-01-10",
    source_fund: "APBD"
  },
  {
    id: "3",
    item_name: "Betadine 10ml",
    item_code: "BTD001",
    batch: "BB001",
    quantity: 50,
    unit: "botol",
    expired_date: "2024-12-31",
    supplier: "PT Mundipharma",
    entry_date: "2024-01-05",
    source_fund: "JKN"
  }
];

export function Gudang() {
  const [stockEntries, setStockEntries] = useState<StockEntry[]>(mockStockEntries);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<StockEntry>>({});
  const { toast } = useToast();

  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    paginatedData: paginatedEntries,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    totalItems,
    startIndex,
    endIndex
  } = usePagination({ data: stockEntries, itemsPerPage: 10 });

  const totalStockItems = stockEntries.length;
  const totalQuantity = stockEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const expiringStock = stockEntries.filter(entry => {
    const expiredDate = new Date(entry.expired_date);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiredDate <= threeMonthsFromNow;
  }).length;

  const handleSave = () => {
    if (!formData.item_name || !formData.batch || !formData.quantity) {
      toast({
        title: "Error",
        description: "Harap lengkapi semua field yang diperlukan",
        variant: "destructive"
      });
      return;
    }

    const newEntry: StockEntry = {
      id: Date.now().toString(),
      item_name: formData.item_name!,
      item_code: formData.item_code || "",
      batch: formData.batch!,
      quantity: formData.quantity!,
      unit: formData.unit || "buah",
      expired_date: formData.expired_date || "",
      supplier: formData.supplier || "",
      entry_date: new Date().toISOString().split('T')[0],
      source_fund: formData.source_fund || "BOK"
    };

    setStockEntries([...stockEntries, newEntry]);
    toast({
      title: "Berhasil",
      description: "Data barang masuk berhasil ditambahkan"
    });
    setIsDialogOpen(false);
    setFormData({});
  };

  const handleAdd = () => {
    setFormData({});
    setIsDialogOpen(true);
  };

  const getExpiryStatus = (expiredDate: string) => {
    const expiry = new Date(expiredDate);
    const now = new Date();
    const diffMonths = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (diffMonths < 1) return { variant: "destructive" as const, text: "Kadaluarsa" };
    if (diffMonths < 3) return { variant: "secondary" as const, text: "Akan Kadaluarsa" };
    return { variant: "default" as const, text: "Baik" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gudang</h1>
          <p className="text-muted-foreground">Kelola stok barang masuk dan keluar</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Barang Masuk
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Input Barang Masuk</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="item_name">Nama Barang</Label>
                <Select value={formData.item_name || ""} onValueChange={(value) => setFormData({...formData, item_name: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih barang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Amoxicillin 500mg">Amoxicillin 500mg</SelectItem>
                    <SelectItem value="Paracetamol 500mg">Paracetamol 500mg</SelectItem>
                    <SelectItem value="CTM 4mg">CTM 4mg</SelectItem>
                    <SelectItem value="Oralit">Oralit</SelectItem>
                    <SelectItem value="Betadine 10ml">Betadine 10ml</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="batch">Batch</Label>
                <Input
                  id="batch"
                  value={formData.batch || ""}
                  onChange={(e) => setFormData({...formData, batch: e.target.value})}
                  placeholder="Masukkan nomor batch"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Jumlah</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity || ""}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                  placeholder="Masukkan jumlah"
                />
              </div>
              <div>
                <Label htmlFor="expired_date">Tanggal Kadaluarsa</Label>
                <Input
                  id="expired_date"
                  type="date"
                  value={formData.expired_date || ""}
                  onChange={(e) => setFormData({...formData, expired_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={formData.supplier || ""}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  placeholder="Masukkan nama supplier"
                />
              </div>
              <div>
                <Label htmlFor="source_fund">Sumber Dana</Label>
                <Select value={formData.source_fund || ""} onValueChange={(value) => setFormData({...formData, source_fund: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sumber dana" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOK">BOK</SelectItem>
                    <SelectItem value="APBD">APBD</SelectItem>
                    <SelectItem value="JKN">JKN</SelectItem>
                    <SelectItem value="Bantuan">Bantuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleSave}>
                  Simpan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard
          title="Total Item"
          value={totalStockItems.toString()}
          subtitle="jenis barang"
          icon={Package}
          trend={{ value: "+5%", isPositive: true }}
        />
        <DashboardCard
          title="Total Stok"
          value={totalQuantity.toLocaleString()}
          subtitle="unit barang"
          icon={TrendingUp}
          trend={{ value: "+12%", isPositive: true }}
        />
        <DashboardCard
          title="Akan Kadaluarsa"
          value={expiringStock.toString()}
          subtitle="dalam 3 bulan"
          icon={AlertTriangle}
          trend={{ value: "-2", isPositive: true }}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Riwayat Barang Masuk</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              Menampilkan {startIndex}-{endIndex} dari {totalItems} data
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Tanggal Masuk</TableHead>
                <TableHead>Kadaluarsa</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Sumber Dana</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEntries.map((entry) => {
                const expiryStatus = getExpiryStatus(entry.expired_date);
                return (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.item_name}</TableCell>
                    <TableCell className="font-mono">{entry.batch}</TableCell>
                    <TableCell>{entry.quantity.toLocaleString()} {entry.unit}</TableCell>
                    <TableCell>{new Date(entry.entry_date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>{new Date(entry.expired_date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>{entry.supplier}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.source_fund}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={expiryStatus.variant}>{expiryStatus.text}</Badge>
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
    </div>
  );
}