'use client';

import { Button } from "@/components/ui/button";
import { Search, Home, User, Megaphone } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-950 p-4 border-r border-slate-800">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold">my<span className="text-blue-500">ITS</span> Research</h2>
      </div>
      <nav className="flex flex-col space-y-2">
        <Button variant="ghost" className="justify-start text-lg">
          <Home className="mr-3 h-5 w-5" />
          Home
        </Button>
        <Button variant="secondary" className="justify-start text-lg">
          <Search className="mr-3 h-5 w-5" />
          Recommender
        </Button>
        <Button variant="ghost" className="justify-start text-lg">
          <User className="mr-3 h-5 w-5" />
          Account
        </Button>
        <Button variant="ghost" className="justify-start text-lg">
          <Megaphone className="mr-3 h-5 w-5" />
          Announcement
        </Button>
      </nav>
    </aside>
  );
}