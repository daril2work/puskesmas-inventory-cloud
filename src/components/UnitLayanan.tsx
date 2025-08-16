import { useState } from "react";
import { Plus, Building2, Users, Package } from "lucide-react";
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

interface Unit {
  id: string;
  nama: string;
  kode: string;
  tipe: string;
  penanggung_jawab: string;
  aktif: boolean;
  stok_count: number;
}

const mockUnits: Unit[] = [
  {
    id: "1",
    nama: "Poli Umum",
    kode: "PU01",
    tipe: "Poliklinik",
    penanggung_jawab: "Dr. Ahmad Suryadi",
    aktif: true,
    stok_count: 45
  },
  {
    id: "2",
    nama: "IGD",
    kode: "IGD01",
    tipe: "Instalasi Gawat Darurat",
    penanggung_jawab: "Dr. Siti Nurjanah",
    aktif: true,
    stok_count: 78
  },
  {
    id: "3",
    nama: "Poli Anak",
    kode: "PA01",
    tipe: "Poliklinik",
    penanggung_jawab: "Dr. Budi Santoso",
    aktif: true,
    stok_count: 32
  },
  {
    id: "4",
    nama: "Poli Gigi",
    kode: "PG01",
    tipe: "Poliklinik",
    penanggung_jawab: "drg. Maya Sari",
    aktif: true,
    stok_count: 28
  },
  {
    id: "5",
    nama: "Rawat Inap",
    kode: "RI01",
    tipe: "Rawat Inap",
    penanggung_jawab: "Ns. Dewi Lestari",
    aktif: false,
    stok_count: 0
  }
];

export function UnitLayanan() {
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [formData, setFormData] = useState<Partial<Unit>>({});
  const { toast } = useToast();

  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    paginatedData: paginatedUnits,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    totalItems,
    startIndex,
    endIndex
  } = usePagination({ data: units, itemsPerPage: 10 });

  const totalUnits = units.length;
  const activeUnits = units.filter(unit => unit.aktif).length;
  const totalStockItems = units.reduce((sum, unit) => sum + unit.stok_count, 0);

  const handleSave = () => {
    if (!formData.nama || !formData.kode || !formData.tipe) {
      toast({
        title: "Error",
        description: "Harap lengkapi semua field yang diperlukan",
        variant: "destructive"
      });
      return;
    }

    if (editingUnit) {
      setUnits(units.map(unit => 
        unit.id === editingUnit.id 
          ? { ...unit, ...formData }
          : unit
      ));
      toast({
        title: "Berhasil",
        description: "Data unit layanan berhasil diperbarui"
      });
    } else {
      const newUnit: Unit = {
        id: Date.now().toString(),
        nama: formData.nama!,
        kode: formData.kode!,
        tipe: formData.tipe!,
        penanggung_jawab: formData.penanggung_jawab || "",
        aktif: formData.aktif ?? true,
        stok_count: 0
      };
      setUnits([...units, newUnit]);
      toast({
        title: "Berhasil",
        description: "Unit layanan berhasil ditambahkan"
      });
    }

    setIsDialogOpen(false);
    setEditingUnit(null);
    setFormData({});
  };

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setFormData(unit);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingUnit(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const toggleStatus = (id: string) => {
    setUnits(units.map(unit => 
      unit.id === id 
        ? { ...unit, aktif: !unit.aktif }
        : unit
    ));
    toast({
      title: "Berhasil",
      description: "Status unit layanan berhasil diubah"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Unit Layanan</h1>
          <p className="text-muted-foreground">Kelola unit layanan dan ruangan</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Unit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUnit ? "Edit Unit Layanan" : "Tambah Unit Layanan"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nama">Nama Unit</Label>
                <Input
                  id="nama"
                  value={formData.nama || ""}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  placeholder="Masukkan nama unit"
                />
              </div>
              <div>
                <Label htmlFor="kode">Kode Unit</Label>
                <Input
                  id="kode"
                  value={formData.kode || ""}
                  onChange={(e) => setFormData({...formData, kode: e.target.value})}
                  placeholder="Masukkan kode unit"
                />
              </div>
              <div>
                <Label htmlFor="tipe">Tipe Unit</Label>
                <Select value={formData.tipe || ""} onValueChange={(value) => setFormData({...formData, tipe: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Poliklinik">Poliklinik</SelectItem>
                    <SelectItem value="Instalasi Gawat Darurat">IGD</SelectItem>
                    <SelectItem value="Rawat Inap">Rawat Inap</SelectItem>
                    <SelectItem value="Farmasi">Farmasi</SelectItem>
                    <SelectItem value="Laboratorium">Laboratorium</SelectItem>
                    <SelectItem value="Radiologi">Radiologi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="penanggung_jawab">Penanggung Jawab</Label>
                <Input
                  id="penanggung_jawab"
                  value={formData.penanggung_jawab || ""}
                  onChange={(e) => setFormData({...formData, penanggung_jawab: e.target.value})}
                  placeholder="Masukkan nama penanggung jawab"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleSave}>
                  {editingUnit ? "Perbarui" : "Simpan"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard
          title="Total Unit"
          value={totalUnits.toString()}
          subtitle="unit layanan"
          icon={Building2}
          trend={{ value: "Lengkap", isPositive: true }}
        />
        <DashboardCard
          title="Unit Aktif"
          value={activeUnits.toString()}
          subtitle="sedang beroperasi"
          icon={Users}
          trend={{ value: `${Math.round(activeUnits/totalUnits*100)}%`, isPositive: true }}
        />
        <DashboardCard
          title="Total Stok"
          value={totalStockItems.toString()}
          subtitle="item di semua unit"
          icon={Package}
          trend={{ value: "Update", isPositive: true }}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Daftar Unit Layanan</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              Menampilkan {startIndex}-{endIndex} dari {totalItems} unit
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Unit</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Penanggung Jawab</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-mono">{unit.kode}</TableCell>
                  <TableCell className="font-medium">{unit.nama}</TableCell>
                  <TableCell>{unit.tipe}</TableCell>
                  <TableCell>{unit.penanggung_jawab}</TableCell>
                  <TableCell>{unit.stok_count} items</TableCell>
                  <TableCell>
                    <Badge variant={unit.aktif ? "default" : "secondary"}>
                      {unit.aktif ? "Aktif" : "Non-aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(unit)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(unit.id)}
                      >
                        {unit.aktif ? "Non-aktifkan" : "Aktifkan"}
                      </Button>
                    </div>
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