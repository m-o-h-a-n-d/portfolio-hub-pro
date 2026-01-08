import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import PrivateRoute from "./components/admin/PrivateRoute";
import DashboardLayout from "./components/admin/DashboardLayout";
import LoginPage from "./pages/admin/LoginPage";
import DashboardHome from "./pages/admin/DashboardHome";
import ProfileManager from "./pages/admin/ProfileManager";
import ResumeManager from "./pages/admin/ResumeManager";
import PortfolioManager from "./pages/admin/PortfolioManager";
import MessagesInbox from "./pages/admin/MessagesInbox";
import SettingsManager from "./pages/admin/SettingsManager";
import BlogsManager from "./pages/admin/BlogsManager";
import ClientsManager from "./pages/admin/ClientsManager";
import TestimonialsManager from "./pages/admin/TestimonialsManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
            {/* Public Portfolio */}
            <Route path="/" element={<Index />} />
            
            {/* Admin Login */}
            <Route path="/admin/login" element={<LoginPage />} />
            
            {/* Admin Dashboard (Protected) */}
            <Route path="/admin" element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="profile" element={<ProfileManager />} />
              <Route path="resume" element={<ResumeManager />} />
              <Route path="portfolio" element={<PortfolioManager />} />
              <Route path="messages" element={<MessagesInbox />} />
              <Route path="settings" element={<SettingsManager />} />
              <Route path="blogs" element={<BlogsManager />} />
              <Route path="clients" element={<ClientsManager />} />
              <Route path="testimonials" element={<TestimonialsManager />} />
            </Route>
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
