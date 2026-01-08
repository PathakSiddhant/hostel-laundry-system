"use client";

import { useState } from "react";
import api from "@/utils/api";
import { Search, Shirt, CheckCircle, AlertCircle } from "lucide-react";

// --- TYPES (Fixed to avoid 'any' errors) ---
interface Bag {
  id: number;
  status: string;
  created_at: string;
  clothes_count: number;
}

interface StudentData {
  student: {
    name: string;
    room_no: string;
    total_credits: number;
  };
  active_bags: Bag[];
}

export default function StudentPortal() {
  const [cardNo, setCardNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StudentData | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNo) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await api.get(`/status/${cardNo}`);
      setData(response.data);
    } catch (err: unknown) {
      setError("No active laundry found for this Card.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received": return "bg-gray-100 text-gray-700 border-gray-300";
      case "washing": return "bg-blue-50 text-blue-700 border-blue-200"; 
      case "ready": return "bg-green-50 text-green-700 border-green-200"; 
      case "delivered": return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    // FIX APPLIED: Centered content using min-h-screen and justify-center
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-transparent -mt-16">
      
      {/* --- CLEAN HEADER (No Logo, Just Title) --- */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-extrabold text-[#1e3a8a] uppercase tracking-wide">
          Laundry Status
        </h2>
        <div className="h-1 w-20 bg-[#fbbf24] mx-auto mt-2 rounded-full"></div>
        <p className="text-gray-500 text-sm mt-2">Enter your ID Card Number to track clothes</p>
      </div>

      {/* --- SEARCH BAR (Clean & Wide) --- */}
      <div className="w-full max-w-lg">
        <form onSubmit={handleSearch} className="relative flex items-center shadow-lg rounded-full">
          <input
            type="text"
            placeholder="Search Bag / Card No (e.g. C101)"
            value={cardNo}
            onChange={(e) => setCardNo(e.target.value)}
            className="w-full p-4 pl-6 bg-white border-2 border-gray-100 rounded-l-full focus:outline-none focus:border-[#1e3a8a] text-lg font-medium uppercase text-gray-800 placeholder:normal-case transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1e3a8a] hover:bg-[#172554] text-white px-8 py-4 rounded-r-full font-bold transition-all flex items-center justify-center"
          >
            {loading ? "..." : <Search size={24} />}
          </button>
        </form>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-center font-medium border border-red-100 animate-in fade-in">
            {error}
          </div>
        )}
      </div>

      {/* --- RESULT CARD --- */}
      {data && (
        <div className="w-full max-w-lg mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Student Info Header */}
          <div className="bg-[#1e3a8a] p-5 text-white flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{data.student.name}</h3>
              <p className="text-blue-200 text-sm">Room: {data.student.room_no}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Credits</span>
              <p className="font-mono text-2xl font-bold text-[#fbbf24]">{data.student.total_credits}</p>
            </div>
          </div>

          {/* List */}
          <div className="p-4 bg-gray-50">
            {data.active_bags.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active laundry.</p>
            ) : (
              <div className="space-y-3">
                {data.active_bags.map((bag) => (
                  <div key={bag.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${bag.status === 'ready' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                          {bag.status === 'ready' ? <CheckCircle size={24} /> : <Shirt size={24} />}
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(bag.status)}`}>
                          {bag.status}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(bag.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {bag.clothes_count > 0 && (
                      <div className="text-right">
                          <span className="block text-2xl font-bold text-gray-800">{bag.clothes_count}</span>
                          <span className="text-[10px] text-gray-400 uppercase">Clothes</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- IMPROVED CREDITS FOOTER --- */}
      {/* Added responsive padding and flexible layout */}
      <footer className="w-full mt-16 pb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-gray-400 font-bold mb-3">
          Designed & Developed By
        </p>

        {/* flex-col for Mobile (Stack Names) 
            md:flex-row for Desktop (Names Side-by-Side)
        */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-8 text-lg md:text-xl font-extrabold text-[#1e3a8a]">
          <a 
            href="https://www.linkedin.com/in/siddhant-pathak-380a5b31a/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#fbbf24] transition-colors hover:scale-105 transform duration-200 border-b-2 border-transparent hover:border-[#fbbf24]"
          >
            Siddhant Pathak
          </a>
          
          {/* Divider only visible on Desktop */}
          <span className="hidden md:inline text-gray-300">|</span>
          
          <a 
            href="https://www.linkedin.com/in/rohit-murmu-b17916290/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#fbbf24] transition-colors hover:scale-105 transform duration-200 border-b-2 border-transparent hover:border-[#fbbf24]"
          >
            Rohit Murmu
          </a>
        </div>

        <p className="text-xs md:text-sm text-gray-400 mt-3 font-medium">
          B.Tech CSE (AI & DS) • Batch 2023-27
        </p>
      </footer>

    </main>
  );
}