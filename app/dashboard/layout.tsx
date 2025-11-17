import DashboardHeader from './components/dashboard-header';
import Script from "next/script";
import DashboardFooter from './components/dashboard-footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <DashboardHeader />
      {children}
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="lazyOnload" 
      />
      <DashboardFooter />
    </div>
  );
}