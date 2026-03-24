'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { lotSchema, LotInput } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function NewLotPage() {
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<LotInput>({
    resolver: zodResolver(lotSchema) as any,
    defaultValues: {
      name: '',
      address: '',
      lat: 12.9716,
      lng: 77.5946,
      open_time: '06:00',
      close_time: '22:00',
      is_active: true,
    },
  });

  const onSubmit = async (data: LotInput) => {
    const { data: lot, error } = await supabase
      .from('parking_lots')
      .insert(data)
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Parking lot created!');
    router.push(`/admin/lots/${lot.id}`);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/admin/lots"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Lots
        </Link>
        <h1 className="text-2xl font-bold">Create Parking Lot</h1>
        <p className="text-muted-foreground">Add a new parking facility to SafePark</p>
      </div>

      <div className="max-w-2xl">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Lot Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Lot Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Central City Parking"
                  className="bg-secondary border-border"
                  {...register('name')}
                />
                {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="e.g. 123 MG Road, Bangalore"
                  className="bg-secondary border-border"
                  {...register('address')}
                />
                {errors.address && <p className="text-destructive text-xs">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude *</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    placeholder="12.9716"
                    className="bg-secondary border-border"
                    {...register('lat', { valueAsNumber: true })}
                  />
                  {errors.lat && <p className="text-destructive text-xs">{errors.lat.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude *</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    placeholder="77.5946"
                    className="bg-secondary border-border"
                    {...register('lng', { valueAsNumber: true })}
                  />
                  {errors.lng && <p className="text-destructive text-xs">{errors.lng.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="open_time">Opening Time</Label>
                  <Input
                    id="open_time"
                    type="time"
                    className="bg-secondary border-border"
                    {...register('open_time')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="close_time">Closing Time</Label>
                  <Input
                    id="close_time"
                    type="time"
                    className="bg-secondary border-border"
                    {...register('close_time')}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  className="h-4 w-4 rounded border-border"
                  defaultChecked
                  {...register('is_active')}
                />
                <Label htmlFor="is_active">Active (visible to users)</Label>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Creating...' : 'Create Parking Lot'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
