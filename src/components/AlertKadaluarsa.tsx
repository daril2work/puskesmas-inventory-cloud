import { useState } from "react";
import { AlertTriangle, Calendar, Package, Search, Filter, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardCard } from "./DashboardCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";

interface ExpiredAlert {
  id: string;
  item_code: string;
  item_name: string;
  batch: string;
  quantity: number;
  unit: string;
  expired_date: string;
  days_remaining: number;
  location: string;
  supplier: string;
  entry_date: string;
  priority: "critical" | "warning" | "info";
}

const mockExpiredAlerts: ExpiredAlert[] = [
  {
    id: "1",
    item_code: "AMX001",
    item_name: "Amoxicillin 500mg",
    batch: "BA001",
    quantity: 150,
    unit: "tablet",
    expired_date: "2024-02-15",
    days_remaining: 15,
    location: "Gudang Utama",
    supplier: "PT Kimia Farma",
    entry_date: "2023-08-15",
    priority: "critical"
  },
  {
    id: "2",
    item_code: "PCT001",
    item_name: "Paracetamol 500mg",
    batch: "BP002",
    quantity: 300,
    unit: "tablet",
    expired_date: "2024-03-20",
    days_remaining: 45,
    location: "Gudang Utama",
    supplier: "PT Kalbe Farma",
    entry_date: "2023-09-20",
    priority: "warning"
  },
  {
    id: "3",
    item_code: "BTD001",
    item_name: "Betadine 10ml",
    batch: "BB003",
    quantity: 25,
    unit: "botol",
    expired_date: "2024-01-30",
    days_remaining: 5,
    location: "Poli Umum",
    supplier: "PT Mundipharma",
    entry_date: "2023-07-30",
    priority: "critical"
  },
  {
    id: "4",
    item_code: "CTM001",
    item_name: "CTM 4mg",
    batch: "BC004",
    quantity: 80,
    unit: "tablet",
    expired_date: "2024-04-10",
    days_remaining: 65,
    location: "IGD",
    supplier: "PT Sanbe Farma",
    entry_date: "2023-10-10",
    priority: "info"
  },
  {
    id: "5",
    item_code: "ORS001",
    item_name: "Oralit",
    batch: "BO005",
    quantity: 200,
    unit: "sachet",
    expired_date: "2024-02-28",
    days_remaining: 28,
    location: "Poli Anak",
    supplier: "PT Pharos",
    entry_date: "2023-08-28",
    priority: "warning"
  },
  {
    id: "6",
    item_code: "VIT001",
    item_name: "Vitamin B Complex",
    batch: "BV006",
    quantity: 120,
    unit: "tablet",
    expired_date: "2024-05-15",
    days_remaining: 85,
    location: "Gudang Utama",
    supplier: "PT Soho",
    entry_date: "2023-11-15",
    priority: "info"
  }
];

export function AlertKadaluarsa() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");

  const filteredAlerts = mockExpiredAlerts.filter(alert => {
    const matchesSearch = alert.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.batch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === "all" || alert.priority === filterPriority;
    const matchesLocation = filterLocation === "all" || alert.location === filterLocation;
    
    return matchesSearch && matchesPriority && matchesLocation;
  });

  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    paginatedData: paginatedAlerts,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    totalItems,
    startIndex,
    endIndex
  } = usePagination<ExpiredAlert>({ data: filteredAlerts, itemsPerPage: 10 });

  const criticalAlerts = filteredAlerts.filter(alert => alert.priority === "critical").length;
  const warningAlerts = filteredAlerts.filter(alert => alert.priority === "warning").length;
  const totalValue = filteredAlerts.reduce((sum, alert) => sum + (alert.quantity * 1000), 0); // Estimasi nilai

  const getPriorityBadge = (priority: string, daysRemaining: number) => {
    if (daysRemaining <= 30) {
      return <Badge variant="destructive">Kritis ({daysRemaining} hari)</Badge>;
    } else if (daysRemaining <= 60) {
      return <Badge variant="secondary">Peringatan ({daysRemaining} hari)</Badge>;
    } else {
      return <Badge variant="default">Info ({daysRemaining} hari)</Badge>;
    }
  };

  const getRowClassName = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-50 border-l-4 border-red-500";
      case "warning":
        return "bg-yellow-50 border-l-4 border-yellow-500";
      default:
        return "";
    }
  };

  const uniqueLocations = [...new Set(mockExpiredAlerts.map(alert => alert.location))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alert Kadaluarsa</h1>
          <p className="text-muted-foreground">Monitor barang yang akan kadaluarsa dalam 90 hari</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            Kirim Notifikasi
          </Button>
          <Button className="gap-2">
            <Package className="h-4 w-4" />
            Tindak Lanjut
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Alert"
          value={filteredAlerts.length.toString()}
          subtitle="barang akan kadaluarsa"
          icon={AlertTriangle}
          trend={{ value: filteredAlerts.length > 0 ? "Perlu Perhatian" : "Aman", isPositive: filteredAlerts.length === 0 }}
        />
        <DashboardCard
          title="Kritis"
          value={criticalAlerts.toString()}
          subtitle="≤ 30 hari"
          icon={AlertTriangle}
          trend={{ value: criticalAlerts > 0 ? "Urgent" : "Safe", isPositive: criticalAlerts === 0 }}
        />
        <DashboardCard
          title="Peringatan"
          value={warningAlerts.toString()}
          subtitle="31-60 hari"
          icon={Calendar}
          trend={{ value: warningAlerts > 0 ? "Monitor" : "Good", isPositive: warningAlerts === 0 }}
        />
        <DashboardCard
          title="Estimasi Nilai"
          value={`Rp ${(totalValue / 1000000).toFixed(1)}M`}
          subtitle="potensi kerugian"
          icon={Package}
          trend={{ value: "Calculate", isPositive: false }}
        />
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Cari barang, kode, atau batch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Prioritas</SelectItem>
                  <SelectItem value="critical">Kritis</SelectItem>
                  <SelectItem value="warning">Peringatan</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter lokasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Lokasi</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Daftar Barang Akan Kadaluarsa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prioritas</TableHead>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Tanggal Kadaluarsa</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Tanggal Masuk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id} className={getRowClassName(alert.priority)}>
                  <TableCell>{getPriorityBadge(alert.priority, alert.days_remaining)}</TableCell>
                  <TableCell className="font-mono">{alert.item_code}</TableCell>
                  <TableCell className="font-medium">{alert.item_name}</TableCell>
                  <TableCell className="font-mono">{alert.batch}</TableCell>
                  <TableCell>{alert.quantity.toLocaleString()} {alert.unit}</TableCell>
                  <TableCell>{alert.location}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{new Date(alert.expired_date).toLocaleDateString('id-ID')}</span>
                      <span className="text-xs text-muted-foreground">{alert.days_remaining} hari lagi</span>
                    </div>
                  </TableCell>
                  <TableCell>{alert.supplier}</TableCell>
                  <TableCell>{new Date(alert.entry_date).toLocaleDateString('id-ID')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredAlerts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Tidak ada alert kadaluarsa</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterPriority !== "all" || filterLocation !== "all" 
                ? "Tidak ada barang yang sesuai dengan filter yang dipilih."
                : "Semua barang masih dalam kondisi baik dan belum mendekati tanggal kadaluarsa."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}