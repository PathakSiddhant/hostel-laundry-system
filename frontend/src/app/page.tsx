// frontend/src/app/page.tsx
"use client";

import { useState } from "react";
import api from "@/utils/api";
import { Search, Shirt, CheckCircle, Clock, Package } from "lucide-react";

export default function StudentPortal() {
  const [cardNo, setCardNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNo) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      // Backend Call
      const response = await api.get(`/status/${cardNo}`);
      setData(response.data);
    } catch (err: any) {
      setError("Bag not found or invalid Card Number.");
    } finally {
      setLoading(false);
    }
  };

  // Status Badge Color Logic
  const getStatusColor = (status: string) => {
    switch (status) {
      case "received": return "bg-gray-100 text-gray-800 border-gray-300";
      case "washing": return "bg-blue-100 text-blue-800 border-blue-300";
      case "ready": return "bg-green-100 text-green-800 border-green-300";
      case "delivered": return "bg-purple-100 text-purple-800 border-purple-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Laundry Tracker
        </h1>
        <p className="text-gray-500 mt-2">Enter your Card Number to check status</p>
      </div>

      {/* Search Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Card No (e.g., C101)"
            value={cardNo}
            onChange={(e) => setCardNo(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "..." : <Search size={20} />}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Result Card */}
      {data && (
        <div className="w-full max-w-md mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Student Info */}
          <div className="bg-gray-900 p-4 text-white flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">{data.student.name}</h2>
              <p className="text-gray-400 text-sm">Room: {data.student.room_no}</p>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase tracking-wider text-gray-400">Credits</span>
              <p className="font-mono text-xl text-yellow-400">{data.student.total_credits}</p>
            </div>
          </div>

          {/* Active Bags List */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
              Active Bags
            </h3>
            
            {data.active_bags.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active laundry.</p>
            ) : (
              <div className="space-y-3">
                {data.active_bags.map((bag: any) => (
                  <div key={bag.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-full border border-gray-200">
                         {bag.status === 'ready' ? <CheckCircle size={20} className="text-green-500" /> : <Shirt size={20} className="text-blue-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Clothes: {bag.clothes_count}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(bag.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(bag.status)}`}>
                      {bag.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}