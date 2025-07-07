'use client';
import { Bell, Menu } from 'lucide-react';

export default function Topbar() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-[#2C3E50]">Tableau de bord</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <Menu size={16} />
          </span>
        </div>
        <Bell className="text-gray-500 hover:text-gray-700 cursor-pointer" />
      </div>
    </div>
  );
}
