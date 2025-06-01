
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageSquare, BarChart, Globe, Zap, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const mainServices = [
    {
      icon: Phone,
      title: "Bulk SMS",
      description: "Send thousands of SMS messages instantly with our reliable SMS gateway. Perfect for marketing campaigns, notifications, and alerts.",
      features: ["Global coverage", "99.9% delivery rate", "Real-time tracking", "Personalization"],
      color: "bg-blue-500"
    },
    {
      icon: Mail,
      title: "Email Marketing",
      description: "Create and send professional email campaigns with advanced analytics and automation features.",
      features: ["Responsive templates", "A/B testing", "Automation workflows", "Advanced analytics"],
      color: "bg-green-500"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Business",
      description: "Connect with customers on WhatsApp with our official Business API integration.",
      features: ["Rich media support", "Two-way messaging", "Chatbot integration", "Message templates"],
      color: "bg-emerald-500"
    },
    {
      icon: BarChart,
      title: "Analytics & Reporting",
      description: "Get detailed insights into your messaging performance with comprehensive analytics.",
      features: ["Real-time metrics", "Custom reports", "ROI tracking", "Performance insights"],
      color: "bg-purple-500"
    }
  ];

  const additionalServices = [
    {
      icon: Globe,
      title: "USSD Services",
      description: "Interactive USSD menus for mobile banking, surveys, and customer service."
    },
    {
      icon: Zap,
      title: "Short Codes",
      description: "Memorable short codes for marketing campaigns and customer engagement."
    },
    {
      icon: Shield,
      title: "Secure Messaging",
      description: "End-to-end encrypted messaging for sensitive communications."
    },
    {
      icon: Clock,
      title: "Scheduled Campaigns",
      description: "Schedule your messages for optimal delivery times across time zones."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Comprehensive messaging solutions to help your business communicate effectively with customers across all channels.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Core Services</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mainServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center`}>
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full">
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Additional Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <service.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Mobiwave?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Reliable Infrastructure</h3>
                    <p className="text-gray-600">99.9% uptime with redundant systems and global carrier partnerships.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Easy Integration</h3>
                    <p className="text-gray-600">RESTful APIs and comprehensive documentation for quick implementation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">24/7 Support</h3>
                    <p className="text-gray-600">Round-the-clock technical support and dedicated account management.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop"
                alt="Technology and development"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
