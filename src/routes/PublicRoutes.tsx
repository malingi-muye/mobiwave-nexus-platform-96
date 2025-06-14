
import React from 'react';
import { Route } from 'react-router-dom';
import Index from '../pages/Index';
import { AuthPage } from '../components/auth/AuthPage';
import About from '../pages/About';
import Services from '../pages/Services';
import Pricing from '../pages/Pricing';
import Contact from '../pages/Contact';

export function PublicRoutes() {
  return (
    <>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact />} />
    </>
  );
}
