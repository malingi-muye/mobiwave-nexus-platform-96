
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">Mobiwave</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
          <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
          <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
        </nav>
      </div>
    </header>
  );
};
