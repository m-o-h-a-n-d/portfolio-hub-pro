import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { DataProvider } from "./context/DataContext";
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
import ServicesManager from "./pages/admin/ServicesManager";
import ForgetPassword from "./pages/admin/ForgetPassword";
import OTPVerification from "./pages/admin/OTPVerification";
import ResetPassword from "./pages/admin/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DataProvider>
          <AuthProvider>
            <NotificationProvider>
            <Routes>
            {/* Public Portfolio */}
            <Route path="/" element={<Index />} />
            
	            {/* Admin Auth */}
	            <Route path="/admin/login" element={<LoginPage />} />
	            <Route path="/admin/forget-password" element={<ForgetPassword />} />
	            <Route path="/admin/otp-verification" element={<OTPVerification />} />
	            <Route path="/admin/reset-password" element={<ResetPassword />} />
            
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
              <Route path="services" element={<ServicesManager />} />
            </Route>
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
              </Routes>
            </NotificationProvider>
          </AuthProvider>
        </DataProvider>
      </BrowserRouter>
      <SpeedInsights/>
    </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
