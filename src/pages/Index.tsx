
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Shield, Zap, Globe, BarChart3, ArrowRight, Menu, X } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleGetStarted = () => {
    toast({
      title: "Welcome to Mobiwave Innovations!",
      description: "Your enterprise communication platform is ready to deploy.",
    });
  };

  const features = [
    {
      icon: MessageSquare,
      title: "Real-time Messaging",
      description: "Instant communication across teams with advanced message routing and delivery guarantees."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless team workspace with file sharing, video calls, and project management integration."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "End-to-end encryption, SSO integration, and compliance with industry standards."
    },
    {
      icon: Zap,
      title: "High Performance",
      description: "Microservices architecture ensuring 99.9% uptime and lightning-fast response times."
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Distributed infrastructure supporting millions of concurrent users worldwide."
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Comprehensive reporting and analytics for team productivity and engagement metrics."
    }
  ];

  const services = [
    { name: "User Management Service", status: "Active", load: "85%" },
    { name: "Message Routing Service", status: "Active", load: "72%" },
    { name: "Notification Service", status: "Active", load: "68%" },
    { name: "File Storage Service", status: "Active", load: "45%" },
    { name: "Analytics Service", status: "Active", load: "33%" },
    { name: "Authentication Service", status: "Active", load: "91%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Toaster />
      
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mobiwave Innovations
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#architecture" className="text-slate-600 hover:text-blue-600 transition-colors">Architecture</a>
              <a href="#services" className="text-slate-600 hover:text-blue-600 transition-colors">Services</a>
              <Button variant="outline" className="mr-2">Sign In</Button>
              <Button onClick={handleGetStarted} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <div className="flex flex-col space-y-3">
                <a href="#features" className="text-slate-600 hover:text-blue-600 px-2 py-1">Features</a>
                <a href="#architecture" className="text-slate-600 hover:text-blue-600 px-2 py-1">Architecture</a>
                <a href="#services" className="text-slate-600 hover:text-blue-600 px-2 py-1">Services</a>
                <div className="flex flex-col space-y-2 pt-2">
                  <Button variant="outline" size="sm">Sign In</Button>
                  <Button onClick={handleGetStarted} size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            Enterprise Communication Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Scale Your Team Communication with
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Microservices Architecture
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Built on Node.js, React, PostgreSQL, and Kubernetes. Deploy enterprise-grade communication 
            infrastructure that scales with your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleGetStarted} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
              Deploy Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              View Documentation
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Enterprise-Grade Features
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Built for scale, security, and performance with modern microservices architecture
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Architecture Overview */}
      <section id="architecture" className="bg-white/50 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Microservices Architecture
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Scalable, resilient, and maintainable infrastructure design
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Technology Stack</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-800 border-green-200">Frontend</Badge>
                  <span className="text-slate-700">React, TypeScript, Tailwind CSS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Backend</Badge>
                  <span className="text-slate-700">Node.js, Express, Microservices</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">Database</Badge>
                  <span className="text-slate-700">PostgreSQL, Redis Caching</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">Queue</Badge>
                  <span className="text-slate-700">RabbitMQ, Redis Streams</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">Infrastructure</Badge>
                  <span className="text-slate-700">Docker, Kubernetes, CI/CD</span>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-xl">Infrastructure Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span>Load Balancer</span>
                    <Badge variant="secondary">NGINX</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span>API Gateway</span>
                    <Badge variant="secondary">Express</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span>Service Mesh</span>
                    <Badge variant="secondary">Istio</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span>Container Orchestration</span>
                    <Badge variant="secondary">Kubernetes</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span>Message Queue</span>
                    <Badge variant="secondary">RabbitMQ</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span>Monitoring</span>
                    <Badge variant="secondary">Prometheus</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Status */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Service Health Dashboard
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real-time monitoring of all microservices
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Microservices Status</span>
              <Badge className="bg-green-100 text-green-800 border-green-200">All Systems Operational</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, index) => (
                <div key={index} className="p-4 border rounded-lg bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-900">{service.name}</h4>
                    <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                      {service.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600">
                    CPU Load: <span className="font-medium">{service.load}</span>
                  </div>
                  <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: service.load }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Mobiwave Innovations</span>
              </div>
              <p className="text-slate-400 mb-4">
                Enterprise communication platform built for the future of work. 
                Scalable, secure, and performant microservices architecture.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Mobiwave Innovations. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
