"use client";

import { useState, useEffect } from "react";
import {
  useDeliverySettings,
  useUpdateDeliverySettings,
  useDeliverySlabs,
  useCreateDeliverySlab,
  useUpdateDeliverySlab,
  useDeleteDeliverySlab,
} from "@/hooks/useDelivery";
import { DeliveryPricingMode, DeliverySlab } from "@/lib/services/delivery";
import toast from "react-hot-toast";

export default function DeliverySettingsPage() {
  const { data: settings, isLoading: settingsLoading } = useDeliverySettings();
  const { data: slabs, isLoading: slabsLoading } = useDeliverySlabs();
  const updateSettings = useUpdateDeliverySettings();
  const createSlab = useCreateDeliverySlab();
  const updateSlab = useUpdateDeliverySlab();
  const deleteSlab = useDeleteDeliverySlab();

  const [pricingMode, setPricingMode] = useState<DeliveryPricingMode>("PER_KM");
  const [pricePerKm, setPricePerKm] = useState<string>("30");

  const [editingSlab, setEditingSlab] = useState<DeliverySlab | null>(null);
  const [slabForm, setSlabForm] = useState({ minKm: "", maxKm: "", fee: "" });
  const [showSlabForm, setShowSlabForm] = useState(false);

  useEffect(() => {
    if (settings) {
      setPricingMode(settings.pricingMode);
      setPricePerKm(settings.pricePerKm.toString());
    }
  }, [settings]);

  async function handleSaveSettings() {
    try {
      await updateSettings.mutateAsync({
        pricingMode,
        pricePerKm: Number(pricePerKm),
      });
      toast.success("Delivery settings updated");
    } catch {
      toast.error("Failed to update settings");
    }
  }

  function openSlabForm(slab?: DeliverySlab) {
    if (slab) {
      setEditingSlab(slab);
      setSlabForm({
        minKm: slab.minKm.toString(),
        maxKm: slab.maxKm.toString(),
        fee: slab.fee.toString(),
      });
    } else {
      setEditingSlab(null);
      setSlabForm({ minKm: "", maxKm: "", fee: "" });
    }
    setShowSlabForm(true);
  }

  async function handleSlabSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      minKm: Number(slabForm.minKm),
      maxKm: Number(slabForm.maxKm),
      fee: Number(slabForm.fee),
    };

    if (payload.minKm >= payload.maxKm) {
      toast.error("Min distance must be less than Max distance");
      return;
    }

    try {
      if (editingSlab) {
        await updateSlab.mutateAsync({ id: editingSlab.id, data: payload });
        toast.success("Slab updated");
      } else {
        await createSlab.mutateAsync(payload);
        toast.success("Slab created");
      }
      setShowSlabForm(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save slab");
    }
  }

  async function handleDeleteSlab(id: number) {
    if (!confirm("Delete this delivery slab?")) return;
    try {
      await deleteSlab.mutateAsync(id);
      toast.success("Slab deleted");
    } catch {
      toast.error("Failed to delete slab");
    }
  }

  if (settingsLoading || slabsLoading) {
    return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Delivery Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure how delivery fees are calculated across the platform.
        </p>
      </div>

      {/* Main Settings */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Pricing Mode</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <label className={`p-4 border-2 rounded-xl cursor-pointer transition-colors ${pricingMode === "PER_KM" ? "border-[#FFC702] bg-yellow-50" : "border-gray-200"}`}>
            <div className="flex items-center gap-3 mb-2">
              <input 
                type="radio" 
                checked={pricingMode === "PER_KM"} 
                onChange={() => setPricingMode("PER_KM")}
                className="accent-[#FFC702]" 
              />
              <span className="font-bold">Per Kilometer</span>
            </div>
            <p className="text-sm text-gray-500 ml-7">Fee is calculated by multiplying the exact distance by a fixed rate.</p>
          </label>

          <label className={`p-4 border-2 rounded-xl cursor-pointer transition-colors ${pricingMode === "DISTANCE_SLAB" ? "border-[#FFC702] bg-yellow-50" : "border-gray-200"}`}>
            <div className="flex items-center gap-3 mb-2">
              <input 
                type="radio" 
                checked={pricingMode === "DISTANCE_SLAB"} 
                onChange={() => setPricingMode("DISTANCE_SLAB")}
                className="accent-[#FFC702]" 
              />
              <span className="font-bold">Distance Slabs</span>
            </div>
            <p className="text-sm text-gray-500 ml-7">Fee is determined by which predefined distance range the customer falls into.</p>
          </label>
        </div>

        {pricingMode === "PER_KM" && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Kilometer (Rs.)</label>
            <input
              type="number"
              value={pricePerKm}
              onChange={(e) => setPricePerKm(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC702] outline-none"
            />
          </div>
        )}

        <button
          onClick={handleSaveSettings}
          disabled={updateSettings.isPending}
          className="px-6 py-2.5 bg-[#111111] text-white font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {updateSettings.isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Slabs Configuration */}
      {pricingMode === "DISTANCE_SLAB" && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Delivery Slabs</h2>
              <p className="text-sm text-gray-500">Configure distance ranges and their flat fees.</p>
            </div>
            <button
              onClick={() => openSlabForm()}
              className="px-4 py-2 bg-[#FFC702] text-[#111111] font-semibold rounded-lg hover:bg-[#e6b300]"
            >
              Add Slab
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold text-gray-600">Distance Range</th>
                  <th className="py-3 px-4 font-semibold text-gray-600">Delivery Fee</th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slabs?.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">
                      No delivery slabs configured. Deliveries will fail until slabs are added.
                    </td>
                  </tr>
                ) : (
                  slabs?.map((slab) => (
                    <tr key={slab.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">
                        {slab.minKm} km — {slab.maxKm} km
                      </td>
                      <td className="py-3 px-4 text-green-600 font-semibold">
                        Rs. {slab.fee}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openSlabForm(slab)}
                          className="text-blue-600 hover:text-blue-800 font-semibold mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSlab(slab.id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slab Form Modal */}
      {showSlabForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSlabForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{editingSlab ? "Edit Slab" : "New Slab"}</h3>
            <form onSubmit={handleSlabSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Min Distance (km)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={slabForm.minKm}
                    onChange={(e) => setSlabForm({ ...slabForm, minKm: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Max Distance (km)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={slabForm.maxKm}
                    onChange={(e) => setSlabForm({ ...slabForm, maxKm: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fee (Rs.)</label>
                <input
                  type="number"
                  required
                  value={slabForm.fee}
                  onChange={(e) => setSlabForm({ ...slabForm, fee: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSlabForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSlab.isPending || updateSlab.isPending}
                  className="flex-1 px-4 py-2 bg-[#FFC702] rounded-lg font-semibold hover:bg-[#e6b300]"
                >
                  Save Slab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
