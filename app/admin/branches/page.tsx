"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import { useAdminBranches, useCreateBranch, useUpdateBranch, useDeleteBranch } from "@/hooks/useBranches";
import { Branch } from "@/lib/services/branches";
import toast from "react-hot-toast";

const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => <div className="h-[200px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Loading map...</div>
});

interface BranchFormData {
  name: string;
  address: string;
  phone: string;
  latitude: string;
  longitude: string;
  isActive: boolean;
}

const EMPTY_FORM: BranchFormData = { name: "", address: "", phone: "", latitude: "", longitude: "", isActive: true };

export default function BranchesPage() {
  const { data: branches, isLoading, isError } = useAdminBranches();
  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();
  const deleteBranch = useDeleteBranch();

  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BranchFormData>(EMPTY_FORM);
  const [isGeocoding, setIsGeocoding] = useState(false);

  async function fetchCoordinates() {
    if (!form.address) {
      toast.error("Please enter a full address first");
      return;
    }
    setIsGeocoding(true);
    try {
      // Add Karachi, Pakistan to the query to improve accuracy if not present
      const query = form.address.toLowerCase().includes('karachi') 
        ? form.address 
        : `${form.address}, Karachi, Pakistan`;
        
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setForm(prev => ({
          ...prev,
          latitude: data[0].lat,
          longitude: data[0].lon
        }));
        toast.success("Coordinates found!");
      } else {
        toast.error("Could not find coordinates. Try being more specific.");
      }
    } catch (err) {
      toast.error("Failed to fetch coordinates");
    } finally {
      setIsGeocoding(false);
    }
  }

  function openCreate() {
    setEditingBranch(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(branch: Branch) {
    setEditingBranch(branch);
    setForm({ 
      name: branch.name, 
      address: branch.address, 
      phone: branch.phone, 
      latitude: branch.latitude?.toString() || "",
      longitude: branch.longitude?.toString() || "",
      isActive: branch.isActive 
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingBranch(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        ...form,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      };

      if (editingBranch) {
        await updateBranch.mutateAsync({ id: editingBranch.id, data: payload });
        toast.success("Branch updated!");
      } else {
        await createBranch.mutateAsync(payload);
        toast.success("Branch created!");
      }
      closeForm();
    } catch (err: any) {
      toast.error(err.message || "Failed to save branch");
    }
  }

  async function handleToggleActive(branch: Branch) {
    try {
      await updateBranch.mutateAsync({ id: branch.id, data: { isActive: !branch.isActive } });
      toast.success(`Branch ${branch.isActive ? "deactivated" : "activated"}!`);
    } catch {
      toast.error("Failed to update branch status");
    }
  }

  async function handleDelete(branch: Branch) {
    if (!confirm(`Delete branch "${branch.name}"? This cannot be undone.`)) return;
    try {
      await deleteBranch.mutateAsync(branch.id);
      toast.success("Branch deleted!");
    } catch {
      toast.error("Failed to delete branch");
    }
  }

  if (isLoading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading branches...</div>;
  if (isError) return <div className="flex items-center justify-center h-64 text-red-500">Failed to load branches</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage pickup branches. Active branches appear in checkout.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#FFC702] text-[#111111] font-semibold rounded-lg hover:bg-[#e6b300] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          Add Branch
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingBranch ? `Edit Branch: ${editingBranch.name}` : "Create New Branch"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Branch Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="e.g. Main Branch — Gulshan"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Address *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="e.g. Shop 5, Block 7, Gulshan-e-Iqbal, Karachi"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="021-34567890"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-semibold text-gray-700">Location Coordinates</label>
                    <button
                      type="button"
                      onClick={fetchCoordinates}
                      disabled={isGeocoding || !form.address}
                      className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 disabled:opacity-50 transition-colors font-semibold"
                    >
                      {isGeocoding ? "Fetching..." : "📍 Fetch from Address"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g. 24.8607"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g. 67.0011"
                  />
                </div>
              </div>
              
              {form.latitude && form.longitude && (
                <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden animate-in fade-in">
                  <MapPicker 
                    lat={Number(form.latitude)} 
                    lng={Number(form.longitude)} 
                    onChange={(lat, lng) => setForm(prev => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }))}
                    height="200px"
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 accent-yellow-500"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">Active (visible in checkout)</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createBranch.isPending || updateBranch.isPending}
                  className="flex-1 px-4 py-2.5 bg-[#FFC702] text-[#111111] font-semibold rounded-lg hover:bg-[#e6b300] disabled:opacity-50 transition-colors"
                >
                  {createBranch.isPending || updateBranch.isPending ? "Saving..." : editingBranch ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branches Grid */}
      {branches?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">🏪</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No branches yet</h3>
          <p className="text-gray-500 mb-6">Create your first branch to enable pickup orders.</p>
          <button onClick={openCreate} className="px-6 py-2.5 bg-[#FFC702] text-[#111111] font-semibold rounded-lg hover:bg-[#e6b300]">
            Add First Branch
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches?.map((branch) => (
            <div key={branch.id} className={`bg-white rounded-xl border-2 p-5 transition-all ${branch.isActive ? "border-green-200" : "border-gray-200 opacity-60"}`}>
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${branch.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {branch.isActive ? "● Active" : "○ Inactive"}
                </span>
                <span className="text-xs text-gray-400">ID #{branch.id}</span>
              </div>

              {/* Info */}
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {branch.name}
                {branch.latitude && branch.longitude && (
                  <span className="ml-2 inline-flex items-center text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded" title={`Lat: ${branch.latitude}, Lng: ${branch.longitude}`}>
                    📍 Mapped
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600 mb-1 flex items-start gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-gray-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                {branch.address}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.91 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>
                {branch.phone}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => openEdit(branch)}
                  className="flex-1 px-3 py-1.5 text-sm font-semibold border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(branch)}
                  disabled={updateBranch.isPending}
                  className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 ${branch.isActive ? "bg-orange-100 text-orange-700 hover:bg-orange-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                >
                  {branch.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(branch)}
                  disabled={deleteBranch.isPending}
                  className="px-3 py-1.5 text-sm font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
