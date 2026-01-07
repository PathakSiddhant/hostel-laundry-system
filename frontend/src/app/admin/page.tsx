"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shirt, Truck, CheckCircle, ClipboardList, AlertCircle } from "lucide-react";
import api from "@/utils/api";

// --- TYPES (To prevent linting errors) ---
interface ProcessResult {
  success: boolean;
  message: string;
  student?: string;
  credits?: string;
}

type ApiError = {
  response?: {
    data?: {
      detail?: string;
    };
  };
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("entry");
  const [loading, setLoading] = useState(false);

  // --- STATE FOR TAB 1: ENTRY ---
  const [entryCard, setEntryCard] = useState("");
  const [entryResult, setEntryResult] = useState<ProcessResult | null>(null);

  // --- STATE FOR TAB 2: WASHING ---
  const [washCard, setWashCard] = useState("");
  const [washCount, setWashCount] = useState("");
  const [washResult, setWashResult] = useState<ProcessResult | null>(null);

  // --- STATE FOR TAB 3: READY ---
  const [readyCard, setReadyCard] = useState("");
  const [readyResult, setReadyResult] = useState<ProcessResult | null>(null);

  // --- STATE FOR TAB 4: DELIVERY ---
  const [delCard, setDelCard] = useState("");
  const [delResult, setDelResult] = useState<ProcessResult | null>(null);

  // --- HANDLER: ENTRY ---
  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryCard) return;

    setLoading(true);
    setEntryResult(null);

    try {
      await api.post("/entry/", { card_no: entryCard });
      setEntryResult({
        success: true,
        message: "Bag Received Successfully!",
        student: "Student Found",
        credits: "Credit Deducted"
      });
      setEntryCard(""); 
    } catch (error: unknown) {
      const err = error as ApiError;
      setEntryResult({
        success: false,
        message: err.response?.data?.detail || "Failed to add entry. Check Card No.",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER: WASHING ---
  const handleWashSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!washCard || !washCount) return;

    setLoading(true);
    setWashResult(null);

    try {
      await api.put(`/process/wash/${washCard}`, { clothes_count: Number(washCount) });
      setWashResult({ success: true, message: `Bag ${washCard} moved to Washing Machine!` });
      setWashCard(""); 
      setWashCount("");
    } catch (error: unknown) {
      const err = error as ApiError;
      setWashResult({ success: false, message: err.response?.data?.detail || "Error processing bag." });
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER: READY ---
  const handleReadySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!readyCard) return;

    setLoading(true);
    setReadyResult(null);

    try {
      await api.put(`/process/ready/${readyCard}`);
      setReadyResult({ success: true, message: `Bag ${readyCard} is marked READY!` });
      setReadyCard("");
    } catch (error: unknown) {
      const err = error as ApiError;
      setReadyResult({ success: false, message: err.response?.data?.detail || "Error marking ready." });
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER: DELIVERY ---
  const handleDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delCard) return;

    setLoading(true);
    setDelResult(null);

    try {
      await api.post(`/checkout/${delCard}`);
      setDelResult({ success: true, message: `Bag ${delCard} Delivered to Student!` });
      setDelCard("");
    } catch (error: unknown) {
      const err = error as ApiError;
      setDelResult({ success: false, message: err.response?.data?.detail || "Error during checkout." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 font-sans">
      
      {/* --- 1. BIGGER HEADER FIX --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-md h-32 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
            <div className="flex items-center gap-6"> 
                
                {/* --- LOGO SIZE FIX --- */}
                <div className="relative h-24 w-auto min-w-[100px]">
                   <img src="/poornima-logo.png" alt="PU" className="h-full w-auto object-contain" />
                </div>

                <div>
                    <h1 className="text-3xl font-extrabold text-[#1e3a8a] leading-none tracking-tight">POORNIMA LAUNDRY</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="bg-[#fbbf24] h-2.5 w-2.5 rounded-full animate-pulse"></span>
                        <p className="text-base font-semibold text-gray-500">Admin Control Center</p>
                    </div>
                </div>
            </div>
            
            {/* Staff ID Placeholder */}
            <div className="hidden md:block text-right">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Logged in as</p>
                <div className="bg-blue-50 px-4 py-2 rounded-lg mt-1 border border-blue-100">
                  <p className="text-sm font-bold text-[#1e3a8a]">Hostel Staff</p>
                </div>
            </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 mt-6">
        
        {/* --- 2. BIGGER & BOLDER TABS --- */}
        <Tabs defaultValue="entry" value={activeTab} onValueChange={setActiveTab} className="w-full">
          
          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"> 
            <TabsList className="flex w-max md:w-full h-auto bg-white p-2 gap-3 rounded-2xl border border-gray-200 shadow-sm">
                
                {/* Tab 1: Entry */}
                <TabsTrigger 
                    value="entry" 
                    className="flex-1 flex flex-col items-center justify-center gap-2 px-8 py-4 rounded-xl border border-transparent hover:bg-gray-50 data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all min-w-[120px]"
                >
                    <ClipboardList size={28} /> {/* Bigger Icon */}
                    <span className="text-sm font-bold">NEW ENTRY</span>
                </TabsTrigger>

                {/* Tab 2: Washing */}
                <TabsTrigger 
                    value="washing" 
                    className="flex-1 flex flex-col items-center justify-center gap-2 px-8 py-4 rounded-xl border border-transparent hover:bg-gray-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all min-w-[120px]"
                >
                    <Shirt size={28} />
                    <span className="text-sm font-bold">WASHING</span>
                </TabsTrigger>

                {/* Tab 3: Ready */}
                <TabsTrigger 
                    value="ready" 
                    className="flex-1 flex flex-col items-center justify-center gap-2 px-8 py-4 rounded-xl border border-transparent hover:bg-gray-50 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all min-w-[120px]"
                >
                    <CheckCircle size={28} />
                    <span className="text-sm font-bold">READY</span>
                </TabsTrigger>

                {/* Tab 4: Delivery */}
                <TabsTrigger 
                    value="delivery" 
                    className="flex-1 flex flex-col items-center justify-center gap-2 px-8 py-4 rounded-xl border border-transparent hover:bg-gray-50 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all min-w-[120px]"
                >
                    <Truck size={28} />
                    <span className="text-sm font-bold">DELIVER</span>
                </TabsTrigger>
            </TabsList>
          </div>

          {/* --- CONTENT AREA (Cards thode aur clean kar diye) --- */}
          <div className="mt-4">
            
            {/* TAB 1 CONTENT */}
            <TabsContent value="entry">
              <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-[#1e3a8a] h-2 w-full"></div> {/* Top Accent Line */}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Scan New Bag</CardTitle>
                  <CardDescription>Drop-off Counter • Register 1</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto space-y-6 py-4">
                    <form onSubmit={handleEntrySubmit} className="space-y-4">
                        <div className="relative">
                            <Input 
                              placeholder="SCAN CARD HERE..." 
                              className="text-2xl h-16 text-center uppercase font-bold tracking-widest border-2 focus-visible:ring-[#1e3a8a]"
                              value={entryCard}
                              onChange={(e) => setEntryCard(e.target.value)}
                              autoFocus
                            />
                        </div>
                        <Button type="submit" size="lg" disabled={loading} className="w-full h-14 text-lg bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold rounded-xl shadow-lg">
                          {loading ? "PROCESSING..." : "ACCEPT BAG"}
                        </Button>
                    </form>
                    {/* Result Message */}
                    {entryResult && (
                      <div className={`p-4 rounded-xl border-l-4 flex items-center gap-4 ${entryResult.success ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
                        {entryResult.success ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
                        <div>
                          <p className="font-bold text-lg">{entryResult.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2 CONTENT (Washing) */}
            <TabsContent value="washing">
              <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-blue-600 h-2 w-full"></div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Send to Washing</CardTitle>
                  <CardDescription>Machine Area • Register 2</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto space-y-6 py-4">
                    <form onSubmit={handleWashSubmit} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Card Number</label>
                                <Input 
                                  placeholder="C101" 
                                  className="text-xl h-14 uppercase font-bold border-2"
                                  value={washCard}
                                  onChange={(e) => setWashCard(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Clothes</label>
                                <Input 
                                  type="number" 
                                  placeholder="0" 
                                  className="text-xl h-14 text-center font-bold border-2"
                                  value={washCount}
                                  onChange={(e) => setWashCount(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button type="submit" size="lg" disabled={loading} className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg">
                          START WASH
                        </Button>
                    </form>
                    {washResult && (
                        <div className={`p-4 rounded-xl font-bold text-center ${washResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {washResult.message}
                        </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3 CONTENT (Ready) */}
            <TabsContent value="ready">
              <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-green-600 h-2 w-full"></div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Mark as Ready</CardTitle>
                  <CardDescription>Ironing/Shelving Area • Register 3</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto space-y-6 py-4">
                    <form onSubmit={handleReadySubmit} className="space-y-4">
                        <Input 
                          placeholder="SCAN CARD..." 
                          className="text-2xl h-16 text-center uppercase font-bold tracking-widest border-2 focus-visible:ring-green-600"
                          value={readyCard}
                          onChange={(e) => setReadyCard(e.target.value)}
                        />
                        <Button type="submit" size="lg" disabled={loading} className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg">
                          MARK READY
                        </Button>
                    </form>
                    {readyResult && (
                        <div className={`p-4 rounded-xl font-bold text-center ${readyResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {readyResult.message}
                        </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4 CONTENT (Delivery) */}
            <TabsContent value="delivery">
              <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-purple-600 h-2 w-full"></div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Student Delivery</CardTitle>
                  <CardDescription>Exit Kiosk • Register 4</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto space-y-6 py-4">
                    <form onSubmit={handleDeliverySubmit} className="space-y-4">
                        <Input 
                          placeholder="SCAN CARD..." 
                          className="text-2xl h-16 text-center uppercase font-bold tracking-widest border-2 focus-visible:ring-purple-600"
                          value={delCard}
                          onChange={(e) => setDelCard(e.target.value)}
                        />
                        <Button type="submit" size="lg" disabled={loading} className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg">
                          DELIVER BAG
                        </Button>
                    </form>
                    {delResult && (
                        <div className={`p-4 rounded-xl font-bold text-center ${delResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {delResult.message}
                        </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </div>
        </Tabs>
      </div>
    </div>
  );
}