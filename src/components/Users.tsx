import { useState } from "react";
import { Plus, Edit, Trash2, Users as UsersIcon, Shield, UserCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { DashboardCard } from "./DashboardCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "gudang" | "unit";
  unit?: string;
  status: "active" | "inactive";
  last_login?: string;
  created_at: string;
  phone?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. Ahmad Suryadi",
    email: "ahmad.suryadi@puskesmas.go.id",
    role: "admin",
    status: "active",
    last_login: "2024-01-15T10:30:00Z",
    created_at: "2023-06-01T00:00:00Z",
    phone: "081234567890"
  },
  {
    id: "2",
    name: "Siti Nurjanah",
    email: "siti.nurjanah@puskesmas.go.id",
    role: "gudang",
    status: "active",
    last_login: "2024-01-15T09:15:00Z",
    created_at: "2023-06-15T00:00:00Z",
    phone: "081234567891"
  },
  {
    id: "3",
    name: "Budi Santoso",
    email: "budi.santoso@puskesmas.go.id",
    role: "unit",
    unit: "Poli Umum",
    status: "active",
    last_login: "2024-01-14T16:45:00Z",
    created_at: "2023-07-01T00:00:00Z",
    phone: "081234567892"
  },
  {
    id: "4",
    name: "Maya Sari",
    email: "maya.sari@puskesmas.go.id",
    role: "unit",
    unit: "IGD",
    status: "active",
    last_login: "2024-01-15T08:20:00Z",
    created_at: "2023-07-15T00:00:00Z",
    phone: "081234567893"
  },
  {
    id: "5",
    name: "Dewi Lestari",
    email: "dewi.lestari@puskesmas.go.id",
    role: "unit",
    unit: "Poli Anak",
    status: "inactive",
    last_login: "2024-01-10T14:30:00Z",
    created_at: "2023-08-01T00:00:00Z",
    phone: "081234567894"
  }
];

const units = [
  "Poli Umum",
  "IGD",
  "Poli Anak",
  "Poli Gigi",
  "Rawat Inap",
  "Farmasi",
  "Laboratorium"
];

export function Users() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const { toast } = useToast();

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === "active").length;
  const adminUsers = users.filter(user => user.role === "admin").length;

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Error",
        description: "Harap lengkapi semua field yang diperlukan",
        variant: "destructive"
      });
      return;
    }

    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ));
      toast({
        title: "Berhasil",
        description: "Data pengguna berhasil diperbarui"
      });
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name!,
        email: formData.email!,
        role: formData.role as "admin" | "gudang" | "unit",
        unit: formData.unit,
        status: formData.status || "active",
        phone: formData.phone,
        created_at: new Date().toISOString()
      };
      setUsers([...users, newUser]);
      toast({
        title: "Berhasil",
        description: "Pengguna baru berhasil ditambahkan"
      });
    }

    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({});
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: "Berhasil",
      description: "Pengguna berhasil dihapus"
    });
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ status: "active" });
    setIsDialogOpen(true);
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ));
    toast({
      title: "Berhasil",
      description: "Status pengguna berhasil diubah"
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="default">Admin</Badge>;
      case "gudang":
        return <Badge variant="secondary">Petugas Gudang</Badge>;
      case "unit":
        return <Badge variant="outline">Unit User</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" 
      ? <Badge variant="default">Aktif</Badge>
      : <Badge variant="destructive">Non-aktif</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">Kelola akses pengguna sistem inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Pengguna
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit Pengguna" : "Tambah Pengguna"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Masukkan email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Masukkan nomor telepon"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role || ""} onValueChange={(value) => setFormData({...formData, role: value as "admin" | "gudang" | "unit"})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="gudang">Petugas Gudang</SelectItem>
                    <SelectItem value="unit">Unit User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role === "unit" && (
                <div>
                  <Label htmlFor="unit">Unit Kerja</Label>
                  <Select value={formData.unit || ""} onValueChange={(value) => setFormData({...formData, unit: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih unit kerja" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status || ""} onValueChange={(value) => setFormData({...formData, status: value as "active" | "inactive"})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Non-aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleSave}>
                  {editingUser ? "Perbarui" : "Simpan"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard
          title="Total Pengguna"
          value={totalUsers.toString()}
          subtitle="terdaftar"
          icon={UsersIcon}
          trend={{ value: "Complete", isPositive: true }}
        />
        <DashboardCard
          title="Pengguna Aktif"
          value={activeUsers.toString()}
          subtitle="sedang aktif"
          icon={UserCheck}
          trend={{ value: `${Math.round(activeUsers/totalUsers*100)}%`, isPositive: true }}
        />
        <DashboardCard
          title="Administrator"
          value={adminUsers.toString()}
          subtitle="admin sistem"
          icon={Shield}
          trend={{ value: "Secure", isPositive: true }}
        />
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengguna berdasarkan nama, email, atau role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-primary" />
            Daftar Pengguna ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Login Terakhir</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      {user.phone && (
                        <div className="text-sm text-muted-foreground">{user.phone}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.unit || "-"}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    {user.last_login ? (
                      <div className="text-sm">
                        {new Date(user.last_login).toLocaleDateString('id-ID')}
                        <br />
                        <span className="text-muted-foreground">
                          {new Date(user.last_login).toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Belum pernah</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(user.id)}
                      >
                        {user.status === "active" ? "Non-aktifkan" : "Aktifkan"}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus pengguna "{user.name}"? 
                              Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(user.id)}>
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}