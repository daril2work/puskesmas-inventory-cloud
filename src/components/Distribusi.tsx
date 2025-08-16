import { useState } from "react";
import { Plus, ArrowRight, Package, Clock } from "lucide-react";
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

interface Distribution {
  id: string;
  item_name: string;
  from_unit: string;
  to_unit: string;
  quantity: number;
  unit: string;
  date: string;
  status: "pending" | "completed" | "cancelled";
  notes?: string;
  requester: string;
}

const mockDistributions: Distribution[] = [
  {
    id: "1",
    item_name: "Paracetamol 500mg",
    from_unit: "Gudang Utama",
    to_unit: "Poli Umum",
    quantity: 100,
    unit: "tablet",
    date: "2024-01-15",
    status: "completed",
    requester: "Dr. Ahmad Suryadi"
  },
  {
    id: "2", 
    item_name: "Amoxicillin 500mg",
    from_unit: "Gudang Utama",
    to_unit: "IGD",
    quantity: 50,
    unit: "tablet",
    date: "2024-01-14",
    status: "pending",
    requester: "Dr. Siti Nurjanah"
  },
  {
    id: "3",
    item_name: "Betadine 10ml",
    from_unit: "Gudang Utama", 
    to_unit: "Poli Anak",
    quantity: 10,
    unit: "botol",
    date: "2024-01-13",
    status: "completed",
    requester: "Dr. Budi Santoso"
  },
  {
    id: "4",
    item_name: "ORS",
    from_unit: "Gudang Utama",
    to_unit: "IGD",
    quantity: 25,
    unit: "sachet",
    date: "2024-01-12",
    status: "cancelled",
    notes: "Stok tidak mencukupi",
    requester: "Dr. Siti Nurjanah"
  }
];

export function Distribusi() {
  const [distributions, setDistributions] = useState<Distribution[]>(mockDistributions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Distribution>>({});
  const { toast } = useToast();

  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    paginatedData: paginatedDistributions,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    totalItems,
    startIndex,
    endIndex
  } = usePagination({ data: distributions, itemsPerPage: 10 });

  const totalDistributions = distributions.length;
  const pendingDistributions = distributions.filter(d => d.status === "pending").length;
  const completedToday = distributions.filter(d => {
    const today = new Date().toISOString().split('T')[0];
    return d.date === today && d.status === "completed";
  }).length;

  const handleSave = () => {
    if (!formData.item_name || !formData.to_unit || !formData.quantity) {
      toast({
        title: "Error",
        description: "Harap lengkapi semua field yang diperlukan",
        variant: "destructive"
      });
      return;
    }

    const newDistribution: Distribution = {
      id: Date.now().toString(),
      item_name: formData.item_name!,
      from_unit: "Gudang Utama",
      to_unit: formData.to_unit!,
      quantity: formData.quantity!,
      unit: formData.unit || "buah",
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      notes: formData.notes,
      requester: formData.requester || "Current User"
    };

    setDistributions([newDistribution, ...distributions]);
    toast({
      title: "Berhasil",
      description: "Permintaan distribusi berhasil dibuat"
    });
    setIsDialogOpen(false);
    setFormData({});
  };

  const handleAdd = () => {
    setFormData({});
    setIsDialogOpen(true);
  };

  const updateStatus = (id: string, status: "completed" | "cancelled") => {
    setDistributions(distributions.map(dist => 
      dist.id === id 
        ? { ...dist, status }
        : dist
    ));
    toast({
      title: "Berhasil",
      description: `Status distribusi berhasil diubah menjadi ${status === "completed" ? "selesai" : "dibatalkan"}`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Selesai</Badge>;
      case "pending":
        return <Badge variant="secondary">Menunggu</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Distribusi</h1>
          <p className="text-muted-foreground">Kelola distribusi barang antar unit</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Buat Distribusi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Buat Distribusi Baru</DialogTitle>
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
                <Label htmlFor="to_unit">Unit Tujuan</Label>
                <Select value={formData.to_unit || ""} onValueChange={(value) => setFormData({...formData, to_unit: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih unit tujuan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Poli Umum">Poli Umum</SelectItem>
                    <SelectItem value="IGD">IGD</SelectItem>
                    <SelectItem value="Poli Anak">Poli Anak</SelectItem>
                    <SelectItem value="Poli Gigi">Poli Gigi</SelectItem>
                    <SelectItem value="Rawat Inap">Rawat Inap</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="unit">Satuan</Label>
                <Select value={formData.unit || ""} onValueChange={(value) => setFormData({...formData, unit: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih satuan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="kapsul">Kapsul</SelectItem>
                    <SelectItem value="botol">Botol</SelectItem>
                    <SelectItem value="sachet">Sachet</SelectItem>
                    <SelectItem value="ampul">Ampul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="requester">Peminta</Label>
                <Input
                  id="requester"
                  value={formData.requester || ""}
                  onChange={(e) => setFormData({...formData, requester: e.target.value})}
                  placeholder="Nama peminta"
                />
              </div>
              <div>
                <Label htmlFor="notes">Catatan</Label>
                <Input
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Catatan tambahan (opsional)"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleSave}>
                  Buat Distribusi
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard
          title="Total Distribusi"
          value={totalDistributions.toString()}
          subtitle="semua permintaan"
          icon={Package}
          trend={{ value: "+3", isPositive: true }}
        />
        <DashboardCard
          title="Menunggu"
          value={pendingDistributions.toString()}
          subtitle="perlu diproses"
          icon={Clock}
          trend={{ value: "Urgent", isPositive: false }}
        />
        <DashboardCard
          title="Selesai Hari Ini"
          value={completedToday.toString()}
          subtitle="distribusi selesai"
          icon={ArrowRight}
          trend={{ value: "Good", isPositive: true }}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-primary" />
              <CardTitle>Riwayat Distribusi</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              Menampilkan {startIndex}-{endIndex} dari {totalItems} distribusi
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Barang</TableHead>
                <TableHead>Dari</TableHead>
                <TableHead>Ke</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Peminta</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDistributions.map((dist) => (
                <TableRow key={dist.id}>
                  <TableCell>{new Date(dist.date).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell className="font-medium">{dist.item_name}</TableCell>
                  <TableCell>{dist.from_unit}</TableCell>
                  <TableCell>{dist.to_unit}</TableCell>
                  <TableCell>{dist.quantity} {dist.unit}</TableCell>
                  <TableCell>{dist.requester}</TableCell>
                  <TableCell>{getStatusBadge(dist.status)}</TableCell>
                  <TableCell>
                    {dist.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStatus(dist.id, "completed")}
                        >
                          Selesai
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStatus(dist.id, "cancelled")}
                        >
                          Batal
                        </Button>
                      </div>
                    )}
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
        </CardContent>
      </Card>
    </div>
  );
}