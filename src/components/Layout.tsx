import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Anchor, GitMerge, Map, Shield, Clock, Calendar, CheckSquare, Mic, Zap, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { WhiteNoisePlayer } from './WhiteNoisePlayer';

const Logo = () => (
  <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
    <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B30] to-[#FF9500] rounded-full shadow-[0_0_15px_rgba(255,59,48,0.5)]"></div>
    <div className="absolute inset-[2px] bg-[#2C1C1C] rounded-full flex items-center justify-center border border-[#FF3B30]/50">
      <div className="absolute inset-0 rounded-full border border-dashed border-[#FF3B30]/30 m-1 animate-[spin_20s_linear_infinite]"></div>
      <div className="absolute w-[2px] h-3 bg-[#FF3B30] top-1/2 left-1/2 origin-bottom -translate-x-1/2 -translate-y-full rounded-full"></div>
      <div className="absolute w-[2px] h-2 bg-[#FF3B30] top-1/2 left-1/2 origin-bottom -translate-x-1/2 -translate-y-full rotate-90 rounded-full"></div>
    </div>
    <Zap className="w-5 h-5 text-[#FFEA00] absolute drop-shadow-[0_0_5px_#FFEA00] z-10 -ml-0.5" fill="#FFEA00" />
  </div>
);

const navItems = [
  { path: '/', label: '多巴胺总览', icon: Activity },
  { path: '/anchors', label: '开工结界', icon: Anchor },
  { path: '/patterns', label: '常规习惯链', icon: GitMerge },
  { path: '/bingo', label: '多巴胺宾果', icon: CheckSquare },
  { path: '/backtrack', label: '思绪回收站', icon: Map },
  { path: '/daily', label: '今日高光', icon: Calendar },
  { path: '/coach', label: '语音向导', icon: Mic },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-[var(--primary)] selection:text-[var(--bg-main)] flex flex-col md:flex-row">
      <header className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border-light)] bg-[var(--bg-dark)] sticky top-0 z-50">
        <h1 className="text-xl font-black tracking-tighter flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
          <Logo />
          <span className="text-gradient drop-shadow-[0_0_10px_rgba(255,143,107,0.3)] leading-none mt-1">DEADLINE<br/>MASTER</span>
        </h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[var(--text-main)]">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 w-64 border-r border-[var(--panel-hover)] bg-[var(--bg-dark)] flex flex-col z-50 transform transition-transform duration-300 md:translate-x-0 h-full",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <Logo />
            <span className="text-gradient drop-shadow-[0_0_10px_rgba(255,143,107,0.3)] leading-none mt-1">DEADLINE<br/>MASTER</span>
          </h1>
          <p className="text-xs text-[var(--text-dim)] mt-3 font-bold uppercase tracking-widest bg-[var(--panel)] inline-block px-2 py-1 rounded border border-[var(--border-light)] shadow-sm">ADHD 战胜指南</p>
        </div>

        <div className="p-4 md:hidden border-b border-[var(--border-light)] flex justify-end">
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[var(--text-main)]">
                 <X className="w-6 h-6" />
             </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-[var(--panel-hover)] text-[var(--primary)] border border-[var(--border)]" 
                    : "text-[var(--text-dim)] hover:bg-[var(--panel)] hover:text-[var(--text-muted)]"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[var(--panel-hover)]">
          <div className="text-xs font-mono text-[var(--border)]">
            v2.0.0 RSIP 协议运行中
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden w-full relative h-[calc(100vh-73px)] md:h-screen overflow-y-auto">
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
      
      <WhiteNoisePlayer />
    </div>
  );
}
