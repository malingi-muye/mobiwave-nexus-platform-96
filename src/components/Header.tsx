
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">Mobiwave</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/services" className="text-gray-600 hover:text-gray-900">Services</Link>
          <Link to="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard">Client Portal</Link>
            </Button>
            <Button asChild variant="default" size="sm">
              <Link to="/admin">Admin Portal</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};
