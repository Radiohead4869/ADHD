import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Anchor, GitMerge, Map, Shield, Clock, Calendar, CheckSquare, Mic } from 'lucide-react';
import { cn } from '../lib/utils';
import { WhiteNoisePlayer } from './WhiteNoisePlayer';

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
          <h1 className="text-2xl font-bold tracking-tighter uppercase flex items-center gap-2">
            <Shield className="w-6 h-6 text-[var(--primary)]" />
            <span className="text-gradient">DEADLINE MASTER</span>
          </h1>
          <p className="text-xs text-[var(--text-dim)] mt-2 font-mono uppercase tracking-widest">自我工程工具</p>
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
