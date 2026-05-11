import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Anchor, GitMerge, Map, Shield, Clock, Calendar, CheckSquare, Mic, Zap } from 'lucide-react';
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
  { path: '/backtrack', label: '思绪回收站', icon: Map },
  { path: '/daily', label: '今日高光', icon: Calendar },
  { path: '/coach', label: '语音向导', icon: Mic },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-[var(--primary)] selection:text-[var(--bg-main)] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--panel-hover)] bg-[var(--bg-dark)] flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <Logo />
            <span className="text-gradient drop-shadow-[0_0_10px_rgba(255,143,107,0.3)] leading-none mt-1">DEADLINE<br/>MASTER</span>
          </h1>
          <p className="text-xs text-[var(--text-dim)] mt-3 font-bold uppercase tracking-widest bg-[var(--panel)] inline-block px-2 py-1 rounded border border-[var(--border-light)] shadow-sm">ADHD 战胜指南</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-[var(--panel-hover)] text-[var(--primary)] border border-[var(--border)]" 
                    : "text-[var(--text-dim)] hover:bg-[var(--panel)] hover:text-[var(--text-muted)]"
                )}
              >
                <Icon className="w-4 h-4" />
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
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          {children}
        </div>
      </main>
      
      <WhiteNoisePlayer />
    </div>
  );
}
