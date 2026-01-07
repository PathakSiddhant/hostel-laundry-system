"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shirt, Truck, CheckCircle, ClipboardList, AlertCircle, Lock, KeyRound, Download } from "lucide-react";
import api from "@/utils/api";

export default function AdminDashboard() {
  // --- SECURITY STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default Locked
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("entry");
  const [loading, setLoading] = useState(false);

  // --- DASHBOARD STATES ---
  const [entryCard, setEntryCard] = useState("");
  const [entryResult, setEntryResult] = useState<any>(null);

  const [washCard, setWashCard] = useState("");
  const [washCount, setWashCount] = useState("");
  const [washResult, setWashResult] = useState<any>(null);

  const [readyCard, setReadyCard] = useState("");
  const [readyResult, setReadyResult] = useState<any>(null);

  const [delCard, setDelCard] = useState("");
  const [delResult, setDelResult] = useState<any>(null);

  // --- LOGIN HANDLER ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple Hardcoded Password
    if (passcode === "admin123") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect Access Code");
      setPasscode("");
    }
  };

  // --- DOWNLOAD REPORT HANDLER ---
  const handleDownloadReport = async () => {
    try {
      // Backend URL construction
      const downloadUrl = `http://localhost:8000/export/daily`;
      
      // Create hidden link and trigger click
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `Laundry_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      alert("Failed to download report. Make sure backend is running.");
    }
  };

  // --- DASHBOARD HANDLERS ---
  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryCard) return;
    setLoading(true);
    setEntryResult(null);
    try {
      await api.post("/entry/", { card_no: entryCard });
      setEntryResult({ success: true, message: "Bag Received Successfully!" });
      setEntryCard("");
    } catch (err: any) {
      setEntryResult({ success: false, message: err.response?.data?.detail || "Failed to add entry." });
    } finally {
      setLoading(false);
    }
  };

  const handleWashSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!washCard || !washCount) return;
    setLoading(true);
    setWashResult(null);
    try {
      await api.put(`/process/wash/${washCard}`, { clothes_count: Number(washCount) });
      setWashResult({ success: true, message: `Bag ${washCard} moved to Washing!` });
      setWashCard(""); setWashCount("");
    } catch (err: any) {
      setWashResult({ success: false, message: err.response?.data?.detail || "Error processing bag." });
    } finally {
      setLoading(false);
    }
  };

  const handleReadySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!readyCard) return;
    setLoading(true);
    setReadyResult(null);
    try {
      await api.put(`/process/ready/${readyCard}`);
      setReadyResult({ success: true, message: `Bag ${readyCard} is READY!` });
      setReadyCard("");
    } catch (err: any) {
      setReadyResult({ success: false, message: err.response?.data?.detail || "Error marking ready." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delCard) return;
    setLoading(true);
    setDelResult(null);
    try {
      await api.post(`/checkout/${delCard}`);
      setDelResult({ success: true, message: `Bag ${delCard} Delivered!` });
      setDelCard("");
    } catch (err: any) {
      setDelResult({ success: false, message: err.response?.data?.detail || "Error during checkout." });
    } finally {
      setLoading(false);
    }
  };

  // --- 🔒 RENDER LOGIN SCREEN IF NOT AUTHENTICATED ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
           {/* Login Header */}
           <div className="bg-[#1e3a8a] p-8 text-center">
              <div className="h-16 w-auto mx-auto mb-4 bg-white rounded-lg p-2 inline-block">
                <img src="/poornima-logo.png" alt="PU" className="h-full w-auto object-contain" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">STAFF PORTAL</h2>
              <p className="text-blue-200 text-sm mt-1">Authorized Access Only</p>
           </div>
           
           {/* Login Form */}
           <div className="p-8">
             <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-400 uppercase">Access Code</label>
                   <div className="relative">
                     <KeyRound className="absolute left-3 top-3 text-gray-400" size={20} />
                     <Input 
                        type="password" 
                        placeholder="Enter Staff PIN" 
                        className="pl-10 h-12 text-lg font-bold tracking-widest"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        autoFocus
                      />
                   </div>
                </div>

                <Button type="submit" className="w-full h-12 bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold text-lg rounded-xl shadow-lg transition-transform active:scale-95">
                   LOGIN SECURELY
                </Button>
             </form>

             {loginError && (
               <div className="mt-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center font-bold border border-red-100 flex items-center justify-center gap-2 animate-in shake">
                  <AlertCircle size={16} /> {loginError}
               </div>
             )}
           </div>
           <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <Lock size={12} /> Secure System v1.0
              </p>
           </div>
        </div>
      </div>
    );
  }

  // --- 🔓 RENDER DASHBOARD IF AUTHENTICATED ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 font-sans">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-md h-32 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
            <div className="flex items-center gap-6">
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
            
            {/* Header Right Side: Download + Profile */}
            <div className="flex items-center gap-4">
                
                {/* --- DOWNLOAD REPORT BUTTON --- */}
                <Button 
                  onClick={handleDownloadReport}
                  variant="outline" 
                  className="hidden md:flex gap-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50 font-bold"
                >
                  <Download size={18} />
                  Daily Report
                </Button>

                <div className="hidden md:block text-right">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Logged in as</p>
                    <div className="bg-blue-50 px-4 py-2 rounded-lg mt-1 border border-blue-100">
                      <p className="text-sm font-bold text-[#1e3a8a]">Hostel Staff</p>
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <div className="max-w-5xl mx-auto p-4 mt-6">
        <Tabs defaultValue="entry" value={activeTab} onValueChange={setActiveTab} className="w-full">
          
          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"> 
            <TabsList className="flex w-max md:w-full h-auto bg-white p-2 gap-3 rounded-2xl border border-gray-200 shadow-sm">
                <TabsTrigger value="entry" className="flex-1 flex flex-col items-center justify-center gap-2 px-8 py-4 rounded-xl border border-transparent hover:bg-gray-50 data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all min-w-[120px]">
                    <ClipboardList size={28} /> <span className="text-sm font-bold">NEW ENTRY</span>
                </TabsTrigger>
                <TabsTrigger value="washing" className="flex-1 flex flex-col items-center justify-center gap-2 px-8 py-4 rounded-xl border border-transparent hover:bg-gray-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all min-w-[120px]">
                    <Shirt size={28} /> <span className="text-sm font-bold">WASHING</span>
                </TabsTrigger>
                <TabsTrigger value="ready" className="flex-1 flex flex-col items-center justify-center gap-2 px-8 py-4 rounded-xl border border-transparent hover:bg-gray-50 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all min-w-[120px]">
                    <CheckCircle size={28} /> <span className="text-sm font-bold">READY</span>
                </TabsTrigger>
                <TabsTrigger value="delivery" className="flex-1 flex flex-col items-center justify-center gap-2 px-8 py-4 rounded-xl border border-transparent hover:bg-gray-50 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all min-w-[120px]">
                    <Truck size={28} /> <span className="text-sm font-bold">DELIVER</span>
                </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-4">
            {/* ENTRY TAB */}
            <TabsContent value="entry">
              <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-[#1e3a8a] h-2 w-full"></div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Scan New Bag</CardTitle>
                  <CardDescription>Drop-off Counter • Register 1</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto space-y-6 py-4">
                    <form onSubmit={handleEntrySubmit} className="space-y-4">
                        <Input placeholder="SCAN CARD HERE..." className="text-2xl h-16 text-center uppercase font-bold tracking-widest border-2 focus-visible:ring-[#1e3a8a]" value={entryCard} onChange={(e) => setEntryCard(e.target.value)} autoFocus />
                        <Button type="submit" size="lg" disabled={loading} className="w-full h-14 text-lg bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold rounded-xl shadow-lg">{loading ? "PROCESSING..." : "ACCEPT BAG"}</Button>
                    </form>
                    {entryResult && (<div className={`p-4 rounded-xl border-l-4 flex items-center gap-4 ${entryResult.success ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'}`}>{entryResult.success ? <CheckCircle size={32} /> : <AlertCircle size={32} />}<div><p className="font-bold text-lg">{entryResult.message}</p></div></div>)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* WASHING TAB */}
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
                            <div className="col-span-2"><label className="text-xs font-bold text-gray-400 uppercase ml-1">Card Number</label><Input placeholder="C101" className="text-xl h-14 uppercase font-bold border-2" value={washCard} onChange={(e) => setWashCard(e.target.value)} /></div>
                            <div><label className="text-xs font-bold text-gray-400 uppercase ml-1">Clothes</label><Input type="number" placeholder="0" className="text-xl h-14 text-center font-bold border-2" value={washCount} onChange={(e) => setWashCount(e.target.value)} /></div>
                        </div>
                        <Button type="submit" size="lg" disabled={loading} className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg">START WASH</Button>
                    </form>
                    {washResult && (<div className={`p-4 rounded-xl font-bold text-center ${washResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{washResult.message}</div>)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* READY TAB */}
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
                        <Input placeholder="SCAN CARD..." className="text-2xl h-16 text-center uppercase font-bold tracking-widest border-2 focus-visible:ring-green-600" value={readyCard} onChange={(e) => setReadyCard(e.target.value)} />
                        <Button type="submit" size="lg" disabled={loading} className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg">MARK READY</Button>
                    </form>
                    {readyResult && (<div className={`p-4 rounded-xl font-bold text-center ${readyResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{readyResult.message}</div>)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* DELIVERY TAB */}
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
                        <Input placeholder="SCAN CARD..." className="text-2xl h-16 text-center uppercase font-bold tracking-widest border-2 focus-visible:ring-purple-600" value={delCard} onChange={(e) => setDelCard(e.target.value)} />
                        <Button type="submit" size="lg" disabled={loading} className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg">DELIVER BAG</Button>
                    </form>
                    {delResult && (<div className={`p-4 rounded-xl font-bold text-center ${delResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{delResult.message}</div>)}
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