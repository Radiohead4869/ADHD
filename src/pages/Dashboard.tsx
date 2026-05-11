import React from 'react';
import { useStore } from '../store/useStore';
import { Activity, Flame, GitCommit, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { anchors, patterns, sessions } = useStore();

  const activeAnchors = anchors.filter(a => a.isActive);
  const activePatterns = patterns.filter(p => p.status === 'active' || p.status === 'rooted');
  
  const totalFocusTime = sessions
    .filter(s => s.status === 'completed')
    .reduce((acc, s) => acc + (s.endTime! - s.startTime) / 1000, 0);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">稳态仪表盘</h2>
        <p className="text-[#888] mt-2">当前系统概览与活跃约束。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111] border border-[#222] rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-mono text-[#888] uppercase tracking-wider mb-2">活跃锚点</h3>
            <div className="text-4xl font-bold text-[#e5e5e5]">{activeAnchors.length}</div>
            <div className="mt-4 text-xs text-[#666]">当前正在执行规则的神圣座位</div>
          </div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <GitCommit className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-mono text-[#888] uppercase tracking-wider mb-2">稳定定式</h3>
            <div className="text-4xl font-bold text-[#e5e5e5]">{activePatterns.length}</div>
            <div className="mt-4 text-xs text-[#666]">定式树中的活跃节点</div>
          </div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-mono text-[#888] uppercase tracking-wider mb-2">总专注时长</h3>
            <div className="text-4xl font-bold text-[#e5e5e5]">{formatTime(totalFocusTime)}</div>
            <div className="mt-4 text-xs text-[#666]">在不可逃逸区中度过的时间</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00FF00]" />
            近期活动
          </h3>
          <div className="bg-[#111] border border-[#222] rounded-xl p-1">
            {sessions.slice(-5).reverse().map(session => {
              const anchor = anchors.find(a => a.id === session.anchorId);
              return (
                <div key={session.id} className="p-4 border-b border-[#222] last:border-0 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{anchor?.name || 'Unknown Anchor'}</div>
                    <div className="text-xs text-[#888] mt-1">
                      {new Date(session.startTime).toLocaleString()}
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded uppercase tracking-wider font-mono ${
                    session.status === 'completed' ? 'bg-[#00FF00]/10 text-[#00FF00]' :
                    session.status === 'interrupted' ? 'bg-red-500/10 text-red-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {session.status}
                  </div>
                </div>
              );
            })}
            {sessions.length === 0 && (
              <div className="p-8 text-center text-[#666] text-sm">
                暂无活动记录。
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#00FF00]" />
            最长链条
          </h3>
          <div className="bg-[#111] border border-[#222] rounded-xl p-1">
            {anchors.sort((a, b) => b.chainLength - a.chainLength).slice(0, 5).map(anchor => (
              <div key={anchor.id} className="p-4 border-b border-[#222] last:border-0 flex justify-between items-center">
                <div>
                  <div className="font-medium">{anchor.name}</div>
                  <div className="text-xs text-[#888] mt-1 truncate max-w-[200px]">
                    {anchor.description}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#00FF00]">{anchor.chainLength}</span>
                  <span className="text-xs text-[#666] uppercase">链条</span>
                </div>
              </div>
            ))}
            {anchors.length === 0 && (
              <div className="p-8 text-center text-[#666] text-sm">
                尚未创建锚点。
                <div className="mt-4">
                  <Link to="/anchors" className="text-[#00FF00] hover:underline">创建神圣座位</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
