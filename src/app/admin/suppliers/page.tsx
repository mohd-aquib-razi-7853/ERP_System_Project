'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Pencil, Eye } from "lucide-react"

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Tech Distributors", contact: "9876543210", email: "tech@suppliers.com", address: "Delhi", status: "Active" },
    { id: 2, name: "Global Components", contact: "9123456789", email: "global@suppliers.com", address: "Mumbai", status: "Inactive" }
  ])

  const [form, setForm] = useState({
    name: "", contact: "", email: "", address: "", status: "Active"
  })

  const handleAddSupplier = () => {
    const newSupplier = {
      ...form,
      id: suppliers.length + 1
    }
    setSuppliers([...suppliers, newSupplier])
    setForm({ name: "", contact: "", email: "", address: "", status: "Active" })
  }

  const handleDelete = (id: number) => {
    setSuppliers(suppliers.filter(s => s.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Suppliers</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex gap-2"><Plus size={18} /> Add Supplier</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Supplier Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Contact Number" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
              <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              <Input placeholder="Status (Active/Inactive)" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} />
              <Button onClick={handleAddSupplier} className="w-full">Add Supplier</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-xl overflow-hidden shadow-sm dark:border-neutral-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.address}</TableCell>
                <TableCell>{supplier.status}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon"><Eye size={16} /></Button>
                  <Button variant="ghost" size="icon"><Pencil size={16} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(supplier.id)}>
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
