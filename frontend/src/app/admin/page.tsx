"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shirt, Truck, CheckCircle, ClipboardList, AlertCircle } from "lucide-react";
import api from "@/utils/api";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("entry");
  const [loading, setLoading] = useState(false);

  // --- STATE FOR TAB 1: ENTRY ---
  const [entryCard, setEntryCard] = useState("");
  const [entryResult, setEntryResult] = useState<any>(null);

  // --- STATE FOR TAB 2: WASHING ---
  const [washCard, setWashCard] = useState("");
  const [washCount, setWashCount] = useState("");
  const [washResult, setWashResult] = useState<any>(null);

  // --- STATE FOR TAB 3: READY ---
  const [readyCard, setReadyCard] = useState("");
  const [readyResult, setReadyResult] = useState<any>(null);

  // --- STATE FOR TAB 4: DELIVERY ---
  const [delCard, setDelCard] = useState("");
  const [delResult, setDelResult] = useState<any>(null);

  // --- HANDLER FOR TAB 1: ENTRY ---
  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryCard) return;

    setLoading(true);
    setEntryResult(null);

    try {
      // API CALL
      const response = await api.post("/entry/", { card_no: entryCard });
      
      // SUCCESS
      setEntryResult({
        success: true,
        message: "Bag Received Successfully!",
        student: "Student Found",
        credits: "Credit Deducted"
      });
      setEntryCard(""); // Clear input for next scan
    } catch (err: any) {
      // ERROR
      setEntryResult({
        success: false,
        message: err.response?.data?.detail || "Failed to add entry. Check Card No.",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER FOR TAB 2: WASHING SUBMIT ---
  const handleWashSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!washCard || !washCount) return;

    setLoading(true);
    setWashResult(null);

    try {
      // Backend Refactor ke hisab se body mein count bhej rahe hain
      await api.put(`/process/wash/${washCard}`, { clothes_count: Number(washCount) });
      setWashResult({ success: true, message: `Bag ${washCard} moved to Washing Machine!` });
      setWashCard(""); // Clear inputs
      setWashCount("");
    } catch (err: any) {
      setWashResult({ success: false, message: err.response?.data?.detail || "Error processing bag." });
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER FOR TAB 3: READY SUBMIT ---
  const handleReadySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!readyCard) return;

    setLoading(true);
    setReadyResult(null);

    try {
      await api.put(`/process/ready/${readyCard}`);
      setReadyResult({ success: true, message: `Bag ${readyCard} is marked READY!` });
      setReadyCard("");
    } catch (err: any) {
      setReadyResult({ success: false, message: err.response?.data?.detail || "Error marking ready." });
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER FOR TAB 4: DELIVERY SUBMIT ---
  const handleDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delCard) return;

    setLoading(true);
    setDelResult(null);

    try {
      await api.post(`/checkout/${delCard}`);
      setDelResult({ success: true, message: `Bag ${delCard} Delivered to Student!` });
      setDelCard("");
    } catch (err: any) {
      setDelResult({ success: false, message: err.response?.data?.detail || "Error during checkout." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-extrabold text-gray-900">Laundry Admin</h1>
          <p className="text-lg text-gray-600 mt-2">Poornima University Hostel - Staff Portal</p>
        </header>

        <Tabs defaultValue="entry" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-16 mb-8 bg-white border border-gray-200 shadow-sm rounded-xl">
            <TabsTrigger value="entry" className="text-lg gap-2 data-[state=active]:bg-black data-[state=active]:text-white transition-all">
              <ClipboardList size={20} /> New Entry
            </TabsTrigger>
            <TabsTrigger value="washing" className="text-lg gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
              <Shirt size={20} /> Washing
            </TabsTrigger>
            <TabsTrigger value="ready" className="text-lg gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all">
              <CheckCircle size={20} /> Mark Ready
            </TabsTrigger>
            <TabsTrigger value="delivery" className="text-lg gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all">
              <Truck size={20} /> Delivery
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: ENTRY */}
          <TabsContent value="entry">
            <Card className="bg-white border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Register 1: New Drop-off</CardTitle>
                <CardDescription className="text-gray-500">Scan card to accept laundry bag. (No clothes count needed)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md mx-auto space-y-6">
                  <form onSubmit={handleEntrySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Student Card Number</label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Scan Card (e.g. C101)" 
                          className="text-lg h-12 uppercase"
                          value={entryCard}
                          onChange={(e) => setEntryCard(e.target.value)}
                          autoFocus
                        />
                        <Button type="submit" size="lg" disabled={loading} className="bg-black text-white hover:bg-gray-800">
                          {loading ? "..." : "Accept"}
                        </Button>
                      </div>
                    </div>
                  </form>
                  {entryResult && (
                    <div className={`p-4 rounded-lg border flex items-start gap-3 ${entryResult.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                      {entryResult.success ? <CheckCircle className="shrink-0" /> : <AlertCircle className="shrink-0" />}
                      <div>
                        <p className="font-bold text-lg">{entryResult.message}</p>
                        {entryResult.success && <p className="text-sm">Bag Received. Ready for next.</p>}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: WASHING (Scan + Count) */}
          <TabsContent value="washing">
            <Card className="bg-white border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Register 2: Send to Wash</CardTitle>
                <CardDescription>Enter Clothes Count and Send to Machine.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md mx-auto space-y-6">
                  <form onSubmit={handleWashSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Card Input */}
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium">Card Number</label>
                        <Input 
                          placeholder="C101" 
                          className="text-lg h-12 uppercase"
                          value={washCard}
                          onChange={(e) => setWashCard(e.target.value)}
                        />
                      </div>
                      {/* Count Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Count</label>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          className="text-lg h-12"
                          value={washCount}
                          onChange={(e) => setWashCount(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button type="submit" size="lg" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      {loading ? "..." : "Send to Wash"}
                    </Button>
                  </form>

                  {washResult && (
                    <div className={`p-4 rounded-lg border ${washResult.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                      <p className="font-bold">{washResult.message}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: READY (Scan Only) */}
          <TabsContent value="ready">
            <Card className="bg-white border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Register 3: Mark Ready</CardTitle>
                <CardDescription>Scan bags after ironing is done.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md mx-auto space-y-6">
                  <form onSubmit={handleReadySubmit} className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Scan Card (e.g. C101)" 
                        className="text-lg h-12 uppercase"
                        value={readyCard}
                        onChange={(e) => setReadyCard(e.target.value)}
                      />
                      <Button type="submit" size="lg" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                        {loading ? "..." : "Mark Ready"}
                      </Button>
                    </div>
                  </form>

                  {readyResult && (
                    <div className={`p-4 rounded-lg border ${readyResult.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                      <p className="font-bold">{readyResult.message}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: DELIVERY (Scan Only) */}
          <TabsContent value="delivery">
            <Card className="bg-white border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Register 4: Student Pickup</CardTitle>
                <CardDescription>Final checkout. Bag will be marked delivered.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md mx-auto space-y-6">
                  <form onSubmit={handleDeliverySubmit} className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Scan Card (e.g. C101)" 
                        className="text-lg h-12 uppercase"
                        value={delCard}
                        onChange={(e) => setDelCard(e.target.value)}
                      />
                      <Button type="submit" size="lg" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
                        {loading ? "..." : "Deliver Bag"}
                      </Button>
                    </div>
                  </form>

                  {delResult && (
                    <div className={`p-4 rounded-lg border ${delResult.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                      <p className="font-bold">{delResult.message}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}