"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shirt, Truck, CheckCircle, ClipboardList } from "lucide-react";
import api from "@/utils/api";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("entry");
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Laundry Admin Portal</h1>
          <p className="text-gray-500">Manage daily laundry operations</p>
        </header>

        <Tabs defaultValue="entry" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 h-16 mb-8">
            <TabsTrigger value="entry" className="text-lg gap-2">
              <ClipboardList size={20} /> New Entry
            </TabsTrigger>
            <TabsTrigger value="washing" className="text-lg gap-2">
              <Shirt size={20} /> Washing
            </TabsTrigger>
            <TabsTrigger value="ready" className="text-lg gap-2">
              <CheckCircle size={20} /> Mark Ready
            </TabsTrigger>
            <TabsTrigger value="delivery" className="text-lg gap-2">
              <Truck size={20} /> Delivery
            </TabsTrigger>
          </TabsList>

          {/* REGISTER 1: ENTRY */}
          <TabsContent value="entry">
            <Card>
              <CardHeader>
                <CardTitle>Register 1: New Drop-off</CardTitle>
                <CardDescription>Scan card and enter clothes count.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-center justify-center bg-gray-50 border-2 border-dashed rounded-xl">
                  <p className="text-gray-400">Entry Form will come here...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REGISTER 2: WASHING */}
          <TabsContent value="washing">
            <Card>
              <CardHeader>
                <CardTitle>Register 2: Send to Wash</CardTitle>
                <CardDescription>Scan bags to move them to washing machines.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="h-40 flex items-center justify-center bg-gray-50 border-2 border-dashed rounded-xl">
                  <p className="text-gray-400">Washing Logic will come here...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

           {/* REGISTER 3: READY */}
           <TabsContent value="ready">
            <Card>
              <CardHeader>
                <CardTitle>Register 3: Mark as Ready</CardTitle>
                <CardDescription>Scan bags that are ironed and shelved.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="h-40 flex items-center justify-center bg-gray-50 border-2 border-dashed rounded-xl">
                  <p className="text-gray-400">Ready Logic will come here...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

           {/* REGISTER 4: DELIVERY */}
           <TabsContent value="delivery">
            <Card>
              <CardHeader>
                <CardTitle>Register 4: Student Pickup</CardTitle>
                <CardDescription>Final checkout when student takes the bag.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="h-40 flex items-center justify-center bg-gray-50 border-2 border-dashed rounded-xl">
                  <p className="text-gray-400">Checkout Logic will come here...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}