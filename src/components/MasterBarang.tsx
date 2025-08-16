import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Package, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";

interface Item {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  satuan: string;
  stok_minimal: number;
  aktif: boolean;
  no_batch?: string;
  kadaluarsa?: Date;
  deskripsi?: string;
}

const mockItems: Item[] = [
  { id: "1", kode: "AMX001", nama: "Amoxicillin 500mg", kategori: "Antibiotik", satuan: "tablet", stok_minimal: 100, aktif: true, no_batch: "B001", kadaluarsa: new Date("2025-12-31") },
  { id: "2", kode: "PCT001", nama: "Paracetamol 500mg", kategori: "Analgesik", satuan: "tablet", stok_minimal: 200, aktif: true, no_batch: "B002", kadaluarsa: new Date("2026-06-15") },
  { id: "3", kode: "CTM001", nama: "CTM 4mg", kategori: "Antihistamin", satuan: "tablet", stok_minimal: 50, aktif: true, no_batch: "B003", kadaluarsa: new Date("2025-03-20") },
  { id: "4", kode: "ORS001", nama: "Oralit", kategori: "Elektrolit", satuan: "sachet", stok_minimal: 100, aktif: true, no_batch: "B004", kadaluarsa: new Date("2027-01-10") },
  { id: "5", kode: "BTD001", nama: "Betadine 10ml", kategori: "Antiseptik", satuan: "botol", stok_minimal: 25, aktif: false, no_batch: "B005", kadaluarsa: new Date("2025-09-30") },
];

export function MasterBarang() {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<Partial<Item>>({});
  const { toast } = useToast();

  const filteredItems = items.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    paginatedData: paginatedItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPagination,
    totalItems,
    startIndex,
    endIndex
  } = usePagination<Item>({ data: filteredItems, itemsPerPage: 10 });

  useEffect(() => {
    resetPagination();
  }, [searchTerm, resetPagination]);

  const handleSave = () => {
    if (!formData.nama || !formData.kode || !formData.kategori || !formData.no_batch) {
      toast({
        title: "Error",
        description: "Harap lengkapi semua field yang diperlukan",
        variant: "destructive"
      });
      return;
    }

    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
      toast({
        title: "Berhasil",
        description: "Data barang berhasil diperbarui"
      });
    } else {
      const newItem: Item = {
        id: Date.now().toString(),
        kode: formData.kode!,
        nama: formData.nama!,
        kategori: formData.kategori!,
        satuan: formData.satuan || "buah",
        stok_minimal: formData.stok_minimal || 0,
        aktif: formData.aktif ?? true,
        no_batch: formData.no_batch,
        kadaluarsa: formData.kadaluarsa,
        deskripsi: formData.deskripsi
      };
      setItems([...items, newItem]);
      toast({
        title: "Berhasil",
        description: "Data barang berhasil ditambahkan"
      });
    }

    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Berhasil",
      description: "Data barang berhasil dihapus"
    });
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Master Barang</h1>
          <p className="text-muted-foreground">Kelola daftar obat dan alat kesehatan</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Barang
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Barang" : "Tambah Barang"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="kode">Kode Barang</Label>
                <Input
                  id="kode"
                  value={formData.kode || ""}
                  onChange={(e) => setFormData({...formData, kode: e.target.value})}
                  placeholder="Masukkan kode barang"
                />
              </div>
              <div>
                <Label htmlFor="nama">Nama Barang</Label>
                <Input
                  id="nama"
                  value={formData.nama || ""}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  placeholder="Masukkan nama barang"
                />
              </div>
              <div>
                <Label htmlFor="kategori">Kategori</Label>
                <Select value={formData.kategori || ""} onValueChange={(value) => setFormData({...formData, kategori: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Antibiotik">Antibiotik</SelectItem>
                    <SelectItem value="Analgesik">Analgesik</SelectItem>
                    <SelectItem value="Antihistamin">Antihistamin</SelectItem>
                    <SelectItem value="Antiseptik">Antiseptik</SelectItem>
                    <SelectItem value="Elektrolit">Elektrolit</SelectItem>
                    <SelectItem value="Vitamin">Vitamin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="satuan">Satuan</Label>
                <Select value={formData.satuan || ""} onValueChange={(value) => setFormData({...formData, satuan: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih satuan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="kapsul">Kapsul</SelectItem>
                    <SelectItem value="botol">Botol</SelectItem>
                    <SelectItem value="sachet">Sachet</SelectItem>
                    <SelectItem value="ampul">Ampul</SelectItem>
                    <SelectItem value="tube">Tube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stok_minimal">Stok Minimal</Label>
                <Input
                  id="stok_minimal"
                  type="number"
                  value={formData.stok_minimal || ""}
                  onChange={(e) => setFormData({...formData, stok_minimal: parseInt(e.target.value) || 0})}
                  placeholder="Masukkan stok minimal"
                />
              </div>
              <div>
                <Label htmlFor="no_batch">No. Batch</Label>
                <Input
                  id="no_batch"
                  value={formData.no_batch || ""}
                  onChange={(e) => setFormData({...formData, no_batch: e.target.value})}
                  placeholder="Masukkan nomor batch"
                />
              </div>
              <div>
                <Label htmlFor="kadaluarsa">Tanggal Kadaluarsa</Label>
                <Input
                  id="kadaluarsa"
                  type="date"
                  value={formData.kadaluarsa ? format(formData.kadaluarsa, "yyyy-MM-dd") : ""}
                  onChange={(e) => setFormData({...formData, kadaluarsa: e.target.value ? new Date(e.target.value) : undefined})}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleSave}>
                  {editingItem ? "Perbarui" : "Simpan"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>Daftar Barang</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              Menampilkan {startIndex}-{endIndex} dari {totalItems} barang
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari barang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
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
                <TableHead>Kategori</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead>No. Batch</TableHead>
                <TableHead>Kadaluarsa</TableHead>
                <TableHead>Stok Min</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.kode}</TableCell>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell>{item.kategori}</TableCell>
                  <TableCell>{item.satuan}</TableCell>
                  <TableCell className="font-mono">{item.no_batch || "-"}</TableCell>
                  <TableCell>
                    {item.kadaluarsa ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {format(item.kadaluarsa, "dd/MM/yyyy")}
                        </span>
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell>{item.stok_minimal}</TableCell>
                  <TableCell>
                    <Badge variant={item.aktif ? "default" : "secondary"}>
                      {item.aktif ? "Aktif" : "Non-aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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