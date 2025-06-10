'use client';

import { useState } from 'react';
import { Cloud, Sun, Droplets, Wind, MapPin, ArrowRight, Users, Globe, Zap } from 'lucide-react';
import Link from 'next/link';

// Floating Animation Component
const FloatingIcon = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <div 
    className="absolute animate-bounce opacity-20"
    style={{ 
      animationDelay: `${delay}s`,
      animationDuration: '3s'
    }}
  >
    {children}
  </div>
);

export default function WelcomePage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>

      {/* Floating Weather Icons */}
      <FloatingIcon delay={0}>
        <Sun className="w-16 h-16 text-yellow-400" style={{ top: '10%', left: '10%' }} />
      </FloatingIcon>
      <FloatingIcon delay={1}>
        <Cloud className="w-12 h-12 text-gray-300" style={{ top: '20%', right: '15%' }} />
      </FloatingIcon>
      <FloatingIcon delay={2}>
        <Droplets className="w-10 h-10 text-blue-400" style={{ bottom: '30%', left: '20%' }} />
      </FloatingIcon>
      <FloatingIcon delay={1.5}>
        <Wind className="w-14 h-14 text-teal-400" style={{ bottom: '20%', right: '10%' }} />
      </FloatingIcon>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Hero Section */}
          <div className="mb-16">
            <div className="relative inline-block mb-8">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                Weather Universe
              </h1>
              <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-3xl rounded-full"></div>
            </div>
            
            <p className="text-xl sm:text-2xl lg:text-3xl text-blue-100/90 font-light mb-8 max-w-4xl mx-auto leading-relaxed">
              Experience the most advanced weather forecasting platform with real-time data, 
              interactive maps, and personalized insights
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 max-w-4xl mx-auto">
              {[
                { icon: Globe, title: 'Global Coverage', desc: 'Weather data from anywhere in the world' },
                { icon: Zap, title: 'Real-time Updates', desc: 'Live weather conditions and forecasts' },
                { icon: MapPin, title: 'Interactive Maps', desc: 'Detailed weather visualization layers' }
              ].map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300">
                  <feature.icon className="w-12 h-12 text-white/80 mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16">
            <Link href="/signup">
              <button 
                className="group relative px-8 py-4 sm:px-12 sm:py-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl font-bold text-white text-lg sm:text-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-3">
                  Get Started Free
                  <ArrowRight className={`w-6 h-6 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
                </span>
              </button>
            </Link>

            <Link href="/login">
              <button className="group px-8 py-4 sm:px-12 sm:py-6 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl font-semibold text-white text-lg sm:text-xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <span className="relative flex items-center gap-3">
                  <Users className="w-6 h-6" />
                  Sign In
                </span>
              </button>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
            {[
              { number: '200K+', label: 'Cities Covered' },
              { number: '99.9%', label: 'Uptime' },
              { number: '24/7', label: 'Real-time Data' },
              { number: '10+', label: 'Weather Layers' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/70 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Bottom Info */}
          <div className="mt-16 text-white/60">
            <p className="text-sm sm:text-base">
              Join thousands of users who trust Weather Universe for accurate forecasts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}