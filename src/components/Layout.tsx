import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Anchor, GitMerge, Map, Shield, Clock, Calendar, CheckSquare, Mic } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/', label: '稳态仪表盘', icon: Activity },
  { path: '/anchors', label: '神圣座位', icon: Anchor },
  { path: '/patterns', label: '定式树', icon: GitMerge },
  { path: '/backtrack', label: '回溯地图', icon: Map },
  { path: '/daily', label: '每日命名', icon: Calendar },
  { path: '/coach', label: '语音教练', icon: Mic },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] font-sans selection:bg-[#00FF00] selection:text-black flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1a1a1a] bg-[#050505] flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tighter uppercase flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#00FF00]" />
            SteadState
          </h1>
          <p className="text-xs text-[#666] mt-2 font-mono uppercase tracking-widest">自我工程工具</p>
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
                    ? "bg-[#1a1a1a] text-[#00FF00] border border-[#333]" 
                    : "text-[#888] hover:bg-[#111] hover:text-[#ccc]"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[#1a1a1a]">
          <div className="text-xs font-mono text-[#444]">
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
    </div>
  );
}
