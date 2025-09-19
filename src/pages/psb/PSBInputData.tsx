import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Save, RefreshCw } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { psbApi } from '@/services/psbApi';
import { CreatePSBOrderRequest } from '@/types/psb';
import { toast } from 'sonner';
const STATUS_OPTIONS = [{
  value: 'Pending',
  label: 'Pending'
}, {
  value: 'In Progress',
  label: 'In Progress'
}, {
  value: 'Completed',
  label: 'Completed'
}, {
  value: 'Cancelled',
  label: 'Cancelled'
}];
const PACKAGE_OPTIONS = ['Indihome 20 Mbps', 'Indihome 30 Mbps', 'Indihome 50 Mbps', 'Indihome 100 Mbps', 'IndiHome Gamer 50 Mbps', 'IndiHome Gamer 100 Mbps'];
export const PSBInputData: React.FC = () => {
  const [formData, setFormData] = useState<CreatePSBOrderRequest>({
    cluster: '',
    sto: '',
    orderNo: '',
    customerName: '',
    customerPhone: '',
    address: '',
    package: '',
    status: 'Pending',
    technician: '',
    notes: ''
  });
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const handleInputChange = (field: keyof CreatePSBOrderRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cluster || !formData.sto || !formData.orderNo || !formData.customerName || !formData.customerPhone || !formData.address || !formData.package) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }
    try {
      setLoading(true);
      const response = await psbApi.createOrder(formData);
      if (response.success) {
        toast.success('Data PSB berhasil disimpan!');
        // Reset form
        setFormData({
          cluster: '',
          sto: '',
          orderNo: '',
          customerName: '',
          customerPhone: '',
          address: '',
          package: '',
          status: 'Pending',
          technician: '',
          notes: ''
        });
        setDate(new Date());
      }
    } catch (error) {
      console.error('Error creating PSB order:', error);
      toast.error('Gagal menyimpan data PSB');
    } finally {
      setLoading(false);
    }
  };
  const handleReset = () => {
    setFormData({
      cluster: '',
      sto: '',
      orderNo: '',
      customerName: '',
      customerPhone: '',
      address: '',
      package: '',
      status: 'Pending',
      technician: '',
      notes: ''
    });
    setDate(new Date());
  };
  return <div className="space-y-6 p-0 sm:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Input Data PSB</h1>
        <p className="text-muted-foreground">
          Tambahkan data order PSB baru ke dalam sistem
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Input Data PSB</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Date */}
              <div className="space-y-2">
                <Label>Tanggal <span className="text-red-500">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", {
                      locale: id
                    }) : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={date => date && setDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Cluster */}
              <div className="space-y-2">
                <Label htmlFor="cluster">Cluster <span className="text-red-500">*</span></Label>
                <Input id="cluster" value={formData.cluster} onChange={e => handleInputChange('cluster', e.target.value)} placeholder="Masukkan nama cluster" required />
              </div>

              {/* STO */}
              <div className="space-y-2">
                <Label htmlFor="sto">STO <span className="text-red-500">*</span></Label>
                <Input id="sto" value={formData.sto} onChange={e => handleInputChange('sto', e.target.value)} placeholder="Masukkan nama STO" required />
              </div>

              {/* Order Number */}
              <div className="space-y-2">
                <Label htmlFor="orderNo">Nomor Order <span className="text-red-500">*</span></Label>
                <Input id="orderNo" value={formData.orderNo} onChange={e => handleInputChange('orderNo', e.target.value)} placeholder="Masukkan nomor order" required />
              </div>

              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="customerName">Nama Pelanggan <span className="text-red-500">*</span></Label>
                <Input id="customerName" value={formData.customerName} onChange={e => handleInputChange('customerName', e.target.value)} placeholder="Masukkan nama pelanggan" required />
              </div>

              {/* Customer Phone */}
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Nomor Telepon <span className="text-red-500">*</span></Label>
                <Input id="customerPhone" type="tel" value={formData.customerPhone} onChange={e => handleInputChange('customerPhone', e.target.value)} placeholder="Masukkan nomor telepon" required />
              </div>

              {/* Package */}
              <div className="space-y-2">
                <Label>Paket <span className="text-red-500">*</span></Label>
                <Select value={formData.package} onValueChange={value => handleInputChange('package', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih paket" />
                  </SelectTrigger>
                  <SelectContent>
                    {PACKAGE_OPTIONS.map(pkg => <SelectItem key={pkg} value={pkg}>
                        {pkg}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={value => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(status => <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Technician */}
              <div className="space-y-2">
                <Label htmlFor="technician">Teknisi</Label>
                <Input id="technician" value={formData.technician} onChange={e => handleInputChange('technician', e.target.value)} placeholder="Masukkan nama teknisi" />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Alamat <span className="text-red-500">*</span></Label>
              <Textarea id="address" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} placeholder="Masukkan alamat lengkap pelanggan" rows={3} required />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea id="notes" value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} placeholder="Catatan tambahan (opsional)" rows={3} />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </> : <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Data
                  </>}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>;
};