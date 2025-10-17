import { useState } from "react";
import type { OrderResponse, OrderStatus } from "../interfaces/types";
import ConfirmModal from "./ConfirmModal";

export default function OrdersTable({
  orders,
  onAdvance,
}: {
  orders: OrderResponse[];
  onAdvance: (id: string, next: OrderStatus) => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [pendingNextStatus, setPendingNextStatus] = useState<OrderStatus | null>(null);

  function nextStatus(s: OrderStatus): OrderStatus | null {
    if (s === "PENDING") return "CONFIRMED";
    if (s === "CONFIRMED") return "COMPLETED";
    return null;
  }

  function openConfirm(orderId: string, next: OrderStatus) {
    setPendingOrderId(orderId);
    setPendingNextStatus(next);
    setConfirmOpen(true);
  }

  function closeConfirm() {
    setConfirmOpen(false);
    setPendingOrderId(null);
    setPendingNextStatus(null);
  }

  function confirmAction() {
    if (pendingOrderId && pendingNextStatus) {
      onAdvance(pendingOrderId, pendingNextStatus);
    }
    closeConfirm();
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                Tail Number
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                ICAO
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                Volume (Gallons)
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                Delivery Window
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                Created At
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {orders.map((o, index) => {
              const next = nextStatus(o.status);
              return (
                <tr
                  key={o.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-800/30" : "bg-gray-800/50"
                  } hover:bg-gray-700/50 transition-colors duration-200`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {o.tailNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {o.airportIcao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                    {o.requestedFuelVolume.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Start:</span>
                      <span>
                        {new Date(o.deliveryWindowStart).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">End:</span>
                      <span>
                        {new Date(o.deliveryWindowEnd).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        o.status === "PENDING"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : o.status === "CONFIRMED"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : o.status === "COMPLETED"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {next && (
                      <button
                        onClick={() => openConfirm(o.id, next)}
                        title={`Mark as ${next}`}
                        className={`${
                          next === "COMPLETED"
                            ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                        } text-white font-medium py-1 px-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer`}
                      >
                        {next === "COMPLETED" ? "Complete" : next === "CONFIRMED" ? "Confirm" : next}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No orders found</p>
          <p className="text-gray-500 text-sm mt-2">
            Orders will appear here once they are created
          </p>
        </div>
      )}
      <ConfirmModal
        open={confirmOpen}
        title="Confirm Action"
        message={`Are you sure you want to mark this order as ${pendingNextStatus ?? ""}?`}
        onCancel={closeConfirm}
        onConfirm={confirmAction}
      />
    </div>
  );
}
