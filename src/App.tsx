
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from './components/auth/AuthProvider';
import NotFound from './pages/NotFound';

// Route components
import { publicRoutes } from './routes/PublicRoutes';
import { clientRoutes } from './routes/ClientRoutes';
import { AdminRoutes } from './routes/AdminRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              {publicRoutes}

              {/* Client Routes */}
              {clientRoutes}

              {/* Admin Routes */}
              <Route path="/admin/*" element={<AdminRoutes />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
