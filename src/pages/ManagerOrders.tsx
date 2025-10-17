import { useEffect, useRef, useState } from "react";
import OrdersTable from "../components/OrdersTable";
import { listOrders, updateStatus } from "../utils/api";
import type {
  OrderResponse,
  OrderStatus,
  PageResponse,
} from "../interfaces/types";

export default function ManagerOrders() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const invalidIcao = filter !== "" && !/^[A-Z]{4}$/.test(filter);

  // Auto-refresh when filter is cleared (avoid double-run on initial mount)
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (filter === "") {
      setPage(0);
      refresh(0, size);
    }
  }, [filter]);

  async function refresh(p = page, s = size) {
    setLoading(true);
    setError(null);
    try {
      const resp: PageResponse<OrderResponse> = await listOrders(
        {
          airportIcao: filter,
        },
        { page: p, size: s }
      );
      setOrders(resp.content);
      setTotalPages(resp.totalPages);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onAdvance(id: string, next: OrderStatus) {
    setError(null);
    try {
      await updateStatus(id, next);
      await refresh(page, size);
    } catch (e: any) {
      setError(e?.message ?? "Failed to update status");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white">Manage Orders</h1>

        {/* Filters and Controls */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Filter by ICAO */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by ICAO Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4))}
                  placeholder="OMDB"
                  maxLength={4}
                  aria-invalid={invalidIcao}
                  className={`flex-1 px-4 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${invalidIcao ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'}`}
                />
                <button
                  disabled={invalidIcao || (filter !== "" && filter.length !== 4)}
                  onClick={() => {
                    setPage(0);
                    refresh(0, size);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Apply
                </button>
              </div>
              {invalidIcao && (
                <p className="mt-2 text-sm text-red-400">ICAO must be exactly 4 letters (A–Z).</p>
              )}
            </div>

            {/* Page Size */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Page Size
              </label>
              <select
                value={size}
                onChange={(e) => {
                  const ns = Number(e.target.value);
                  setSize(ns);
                  setPage(0);
                  refresh(0, ns);
                }}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
            </div>

            {/* Pagination Info */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Page
              </label>
              <div className="px-4 py-2 bg-gray-700/30 border border-gray-600 rounded-lg text-white text-center">
                {page + 1} / {Math.max(1, totalPages)}
              </div>
            </div>

            {/* Pagination Controls */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Navigation
              </label>
              <div className="flex gap-2">
                <button
                  disabled={page <= 0}
                  onClick={() => {
                    const p = Math.max(0, page - 1);
                    setPage(p);
                    refresh(p, size);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Previous
                </button>
                <button
                  disabled={page + 1 >= totalPages}
                  onClick={() => {
                    const p = page + 1;
                    setPage(p);
                    refresh(p, size);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 mt-4">Loading orders...</p>
          </div>
        )}

        {/* Orders Table */}
        {!loading && <OrdersTable orders={orders} onAdvance={onAdvance} />}
      </div>
    </div>
  );
}
