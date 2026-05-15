import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../../lib/api';
import type { Product } from '../components/CartContext';
import { useAdminAuth } from './AdminAuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

const CATEGORIES = ['Zip-up', 'Non Zip', 'Limited Edition'] as const;

function colorsToInput(colors: string[]): string {
  return colors.join(', ');
}

function parseColorsInput(raw: string): string[] {
  return raw
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
}

export default function AdminProductsPage() {
  const { token, logout } = useAdminAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [colorsRaw, setColorsRaw] = useState('#0A0A0A, #2C2C2C');
  const [image, setImage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/admin/products', { token });
      if (res.status === 401) {
        logout();
        toast.error('Session expired. Please sign in again.');
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to load products');
      }
      const data = (await res.json()) as Product[];
      setItems(data);
    } catch {
      toast.error('Could not load products');
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setName('');
    setPrice('');
    setCategory(CATEGORIES[0]);
    setColorsRaw('#0A0A0A, #2C2C2C');
    setImage('');
    setDialogOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setName(p.name);
    setPrice(String(p.price));
    setCategory(p.category);
    setColorsRaw(colorsToInput(p.colors));
    setImage(p.image);
    setDialogOpen(true);
  }

  async function saveProduct() {
    const colors = parseColorsInput(colorsRaw);
    if (colors.length < 1) {
      toast.error('Add at least one color (comma-separated hex values)');
      return;
    }
    const priceNum = Number(price);
    if (!Number.isInteger(priceNum) || priceNum < 0) {
      toast.error('Price must be a non-negative whole number');
      return;
    }
    const body = {
      name: name.trim(),
      price: priceNum,
      category,
      colors,
      image: image.trim(),
    };
    if (!body.name || !body.image) {
      toast.error('Name and image URL are required');
      return;
    }
    try {
      if (editing) {
        const res = await apiFetch(`/admin/products/${editing.id}`, {
          method: 'PATCH',
          token,
          body: JSON.stringify(body),
        });
        if (res.status === 401) {
          logout();
          return;
        }
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as {
            message?: string | string[];
          };
          const msg = Array.isArray(err.message)
            ? err.message.join(', ')
            : err.message;
          throw new Error(msg || 'Update failed');
        }
        toast.success('Product updated');
      } else {
        const res = await apiFetch('/admin/products', {
          method: 'POST',
          token,
          body: JSON.stringify(body),
        });
        if (res.status === 401) {
          logout();
          return;
        }
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as {
            message?: string | string[];
          };
          const msg = Array.isArray(err.message)
            ? err.message.join(', ')
            : err.message;
          throw new Error(msg || 'Create failed');
        }
        toast.success('Product created');
      }
      setDialogOpen(false);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      const res = await apiFetch(`/admin/products/${deleteTarget.id}`, {
        method: 'DELETE',
        token,
      });
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) {
        throw new Error('Delete failed');
      }
      toast.success('Product deleted');
      setDeleteTarget(null);
      await load();
    } catch {
      toast.error('Could not delete product');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-4xl tracking-wider text-[#F0EDE8]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Products
          </h1>
          <p className="text-[#F0EDE8]/60 text-sm">
            Manage catalog items in the database. Changes appear on the storefront
            after refresh.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-[#C0392B] hover:bg-[#C0392B]/90 text-[#F0EDE8]"
        >
          <Plus className="w-4 h-4" />
          Add product
        </Button>
      </div>

      <div className="rounded-lg border border-[#2C2C2C] bg-[#141414]/80 overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-[#F0EDE8]/70">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-[#F0EDE8]/70">
            No products yet. Seed the database or add your first item.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[#2C2C2C] hover:bg-transparent">
                <TableHead className="text-[#F0EDE8]">Name</TableHead>
                <TableHead className="text-[#F0EDE8]">Category</TableHead>
                <TableHead className="text-[#F0EDE8] text-right">
                  Price (LKR)
                </TableHead>
                <TableHead className="text-[#F0EDE8] w-[120px] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p.id} className="border-[#2C2C2C]">
                  <TableCell className="font-medium text-[#F0EDE8]">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.image}
                        alt=""
                        className="w-10 h-10 shrink-0 rounded object-cover bg-[#2C2C2C]"
                      />
                      <span className="truncate">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#F0EDE8]/80">
                    {p.category}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-[#F0EDE8]">
                    {p.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-[#F0EDE8] hover:bg-[#C0392B]/20"
                      onClick={() => openEdit(p)}
                      aria-label={`Edit ${p.name}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-[#C0392B] hover:bg-[#C0392B]/15"
                      onClick={() => setDeleteTarget(p)}
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#141414] border-[#2C2C2C] text-[#F0EDE8] max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {editing ? 'Edit product' : 'New product'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#0A0A0A] border-[#2C2C2C] text-[#F0EDE8]"
              />
            </div>
            <div className="space-y-2">
              <Label>Price (LKR, integer)</Label>
              <Input
                type="number"
                min={0}
                step={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-[#0A0A0A] border-[#2C2C2C] text-[#F0EDE8]"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="w-full h-9 rounded-md border border-[#2C2C2C] bg-[#0A0A0A] px-3 text-sm text-[#F0EDE8]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Colors (comma-separated hex)</Label>
              <Input
                value={colorsRaw}
                onChange={(e) => setColorsRaw(e.target.value)}
                className="bg-[#0A0A0A] border-[#2C2C2C] font-mono text-sm text-[#F0EDE8]"
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="bg-[#0A0A0A] border-[#2C2C2C] text-[#F0EDE8]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#C0392B] hover:bg-[#C0392B]/90 text-[#F0EDE8]"
              onClick={saveProduct}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-[#141414] border-[#2C2C2C] text-[#F0EDE8]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#F0EDE8]/70">
              {deleteTarget ? (
                <>
                  This removes <strong>{deleteTarget.name}</strong> from the
                  catalog. This cannot be undone.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#2C2C2C] bg-transparent text-[#F0EDE8]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
              className="bg-[#C0392B] hover:bg-[#C0392B]/90 text-[#F0EDE8]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
