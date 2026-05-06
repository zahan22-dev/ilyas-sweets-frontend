"use client";

import { useState } from "react";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { OrderStatus, Order } from "@/lib/services/orders";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const fulfillmentColors: Record<string, string> = {
  DELIVERY: "bg-orange-100 text-orange-800",
  PICKUP: "bg-teal-100 text-teal-800",
};

const paymentMethodColors: Record<string, string> = {
  COD: "bg-green-100 text-green-800",
  ONLINE_PAYMENT: "bg-blue-100 text-blue-800",
};

const paymentStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  VERIFIED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

// Eye Icon Component
function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// X Icon Component
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

// Order Details Modal Component
function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
  isUpdating,
}: {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: number, status: OrderStatus) => void;
  isUpdating: boolean;
}) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");

  if (!isOpen || !order) return null;

  const isDelivery = order.fulfillmentType === "DELIVERY" || !order.fulfillmentType;
  const deliveryFee = isDelivery ? 150 : 0;
  const subtotal = Number(order.totalAmount) - deliveryFee;

  const handleStatusChange = () => {
    if (selectedStatus && selectedStatus !== order.status) {
      onStatusUpdate(order.id, selectedStatus as OrderStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              Order #{order.id}
            </h2>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                statusColors[order.status]
              }`}
            >
              {order.status}
            </span>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                fulfillmentColors[order.fulfillmentType || "DELIVERY"]
              }`}
            >
              {order.fulfillmentType || "DELIVERY"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <XIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Order Information */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
                  Order Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-900">Cash on Delivery</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fulfillment</span>
                    <span
                      className={`font-medium ${
                        isDelivery ? "text-orange-600" : "text-teal-600"
                      }`}
                    >
                      {isDelivery ? "Delivery" : "Store Pickup"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
                  Customer Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600 block mb-1">Full Name</span>
                    <span className="font-medium text-gray-900 text-lg">
                      {order.customerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-1">Phone Number</span>
                    <span className="font-medium text-gray-900">
                      {order.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fulfillment Type */}
              <div className={`rounded-xl p-5 border ${
                order.fulfillmentType === 'DELIVERY' 
                  ? 'bg-orange-50 border-orange-100' 
                  : 'bg-teal-50 border-teal-100'
              }`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${
                  order.fulfillmentType === 'DELIVERY' ? 'text-orange-600' : 'text-teal-600'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Fulfillment Type
                </h3>
                <p className="font-medium">{order.fulfillmentType === 'DELIVERY' ? '🚚 Delivery' : '🏪 Store Pickup'}</p>
              </div>

              {/* Payment Method & Status */}
              <div className={`rounded-xl p-5 border ${
                order.paymentMethod === 'ONLINE_PAYMENT' 
                  ? 'bg-blue-50 border-blue-100' 
                  : 'bg-green-50 border-green-100'
              }`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                  order.paymentMethod === 'ONLINE_PAYMENT' ? 'text-blue-600' : 'text-green-600'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2"/>
                    <line x1="2" x2="22" y1="10" y2="10"/>
                  </svg>
                  Payment
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Method</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentMethodColors[order.paymentMethod || 'COD']}`}>
                      {order.paymentMethod === 'ONLINE_PAYMENT' ? 'Online Payment' : 'Cash on Delivery'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatusColors[order.paymentStatus || 'PENDING']}`}>
                      {(order.paymentStatus || 'PENDING').replace('_', ' ')}
                    </span>
                  </div>
                  {order.paymentMethod === 'ONLINE_PAYMENT' && order.paymentStatus === 'PENDING' && (
                    <p className="text-xs text-blue-600 mt-2 pt-2 border-t border-blue-200">
                      Awaiting screenshot verification
                    </p>
                  )}
                </div>
              </div>

              {/* Address or Pickup */}
              {isDelivery ? (
                <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-4 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Delivery Address
                  </h3>
                  <p className="text-gray-900 font-medium">{order.address}</p>
                </div>
              ) : (
                <div className="bg-teal-50 rounded-xl p-5 border border-teal-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600 mb-4 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Store Pickup Branch
                  </h3>
                  {order.branch ? (
                    <div className="space-y-1">
                      <p className="font-bold text-teal-900">{order.branch.name}</p>
                      <p className="text-sm text-teal-700">{order.branch.address}</p>
                      <p className="text-sm text-teal-700">{order.branch.phone}</p>
                    </div>
                  ) : (
                    <p className="text-teal-800 font-medium">
                      Customer will pick up from Ilyas Sweets store
                    </p>
                  )}
                </div>
              )}

              {/* Notes */}
              {order.notes && (
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-3">
                    Customer Notes
                  </h3>
                  <p className="text-gray-700 italic">&ldquo;{order.notes}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Right Column - Order Items */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items?.map((item: any, idx: number) => {
                    const itemPrice = Number(item.price);
                    const lineTotal = itemPrice * item.quantity;
                    const variantLabel = item.variant?.label;
                    const customValue = item.customValue;

                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-100"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {variantLabel
                              ? `Variant: ${variantLabel}`
                              : customValue
                              ? `Custom: ${customValue} ${
                                  item.product.productType === "WEIGHT"
                                    ? "kg"
                                    : "pcs"
                                }`
                              : "Standard"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × Rs. {itemPrice}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            Rs. {lineTotal}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-900 text-white rounded-xl p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                  Order Total
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  {isDelivery && (
                    <div className="flex justify-between text-gray-300">
                      <span>Delivery Fee</span>
                      <span>Rs. {deliveryFee}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Grand Total</span>
                      <span className="text-[#FFC702]">
                        Rs. {order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
                  Update Status
                </h3>
                <div className="flex gap-3">
                  <select
                    value={selectedStatus || order.status}
                    onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <button
                    onClick={handleStatusChange}
                    disabled={
                      isUpdating ||
                      !selectedStatus ||
                      selectedStatus === order.status
                    }
                    className="px-4 py-2 bg-[#FFC702] text-[#111111] font-semibold rounded-lg hover:bg-[#e6b300] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | undefined>(undefined);
  const { data: orders, isLoading, isError, error } = useAdminOrders(filter);
  const updateStatus = useUpdateOrderStatus();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleStatusUpdate(orderId: number, newStatus: OrderStatus) {
    try {
      await updateStatus.mutateAsync({ id: orderId, status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status");
    }
  }

  function openOrderDetails(order: Order) {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  function closeOrderDetails() {
    setIsModalOpen(false);
    setSelectedOrder(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error?.message}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        
        {/* Status Filter */}
        <select
          value={filter || ""}
          onChange={(e) => setFilter(e.target.value as OrderStatus || undefined)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        >
          <option value="">All Orders</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status / Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-600">{order.phone}</div>
                    {order.fulfillmentType === 'DELIVERY' && order.address && (
                      <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{order.address}</div>
                    )}
                    {order.fulfillmentType === 'PICKUP' && order.branch && (
                      <div className="text-xs text-teal-600 mt-1 font-semibold">🏪 {order.branch.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full w-fit ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full w-fit ${fulfillmentColors[order.fulfillmentType || 'DELIVERY']}`}>
                        {order.fulfillmentType || 'DELIVERY'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full w-fit ${paymentMethodColors[order.paymentMethod || 'COD']}`}>
                        {order.paymentMethod === 'ONLINE_PAYMENT' ? 'Online' : 'COD'}
                      </span>
                      {order.paymentMethod === 'ONLINE_PAYMENT' && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full w-fit ${paymentStatusColors[order.paymentStatus || 'PENDING']}`}>
                          {(order.paymentStatus || 'PENDING').replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="mb-1 text-gray-600 text-xs">
                        {item.quantity}x {item.product.name} 
                        {item.variant ? ` (${item.variant.label})` : ` (Custom: ${item.customValue})`}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    Rs. {order.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="p-2 text-gray-600 hover:text-[#FFC702] hover:bg-yellow-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <EyeIcon />
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                        disabled={updateStatus.isPending}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {orders?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={closeOrderDetails}
        onStatusUpdate={handleStatusUpdate}
        isUpdating={updateStatus.isPending}
      />
    </div>
  );
}
