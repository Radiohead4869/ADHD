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
        <h2 className="text-3xl font-bold tracking-tight text-gradient">多巴胺总览 (Dopamine Dashboard)</h2>
        <p className="text-[var(--text-dim)] mt-2">ADHD 玩家的专属能量库与成长轨迹。看看自己战胜了多少困难！</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-panel bg-glow border border-[var(--border-light)] rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame className="w-24 h-24 text-[var(--primary)]" />
          </div>
          <div className="glow-content">
            <h3 className="text-sm font-mono text-[var(--text-dim)] uppercase tracking-wider mb-2">活跃打工结界</h3>
            <div className="text-4xl font-bold text-gradient">{activeAnchors.length}</div>
            <div className="mt-4 text-xs text-[var(--text-dark)]">当前正在为你屏蔽干扰的专注结界</div>
          </div>
        </div>

        <div className="bg-panel bg-glow border border-[var(--border-light)] rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <GitCommit className="w-24 h-24 text-[var(--neon-purple)]" />
          </div>
          <div className="glow-content">
            <h3 className="text-sm font-mono text-[var(--text-dim)] uppercase tracking-wider mb-2">潜意识托管习惯</h3>
            <div className="text-4xl font-bold text-gradient">{activePatterns.length}</div>
            <div className="mt-4 text-xs text-[var(--text-dark)]">已经不需要耗费意志力就能执行的习惯</div>
          </div>
        </div>

        <div className="bg-panel bg-glow border border-[var(--border-light)] rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-24 h-24 text-[var(--primary)]" />
          </div>
          <div className="glow-content">
            <h3 className="text-sm font-mono text-[var(--text-dim)] uppercase tracking-wider mb-2">夺回的总专注时间</h3>
            <div className="text-4xl font-bold text-[var(--text-main)]">{formatTime(totalFocusTime)}</div>
            <div className="mt-4 text-xs text-[var(--text-dark)]">一次次战胜分心，夺回的时间！</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-[var(--text-main)]">
            <Activity className="w-5 h-5 text-[var(--primary)]" />
            近期开工记录
          </h3>
          <div className="bg-[var(--panel)] border border-[var(--border-light)] rounded-xl p-1 shadow-sm">
            {sessions.slice(-5).reverse().map(session => {
              const anchor = anchors.find(a => a.id === session.anchorId);
              return (
                <div key={session.id} className="p-4 border-b border-[var(--border-light)] last:border-0 flex justify-between items-center hover:bg-[var(--panel-hover)] transition-colors rounded-lg">
                  <div>
                    <div className="font-bold text-[var(--text-main)]">{anchor?.name || '未知位面'}</div>
                    <div className="text-xs text-[var(--text-dim)] mt-1 font-mono">
                      {new Date(session.startTime).toLocaleString()}
                    </div>
                  </div>
                  <div className={`text-xs px-3 py-1.5 rounded-md uppercase tracking-wider font-bold ${
                    session.status === 'completed' ? 'bg-[var(--success)]/10 text-[var(--success)]' :
                    session.status === 'interrupted' ? 'bg-[var(--danger)]/10 text-[var(--danger)]' :
                    'bg-[var(--secondary)]/10 text-[var(--secondary)]'
                  }`}>
                    {session.status === 'completed' ? '成功专注！' : session.status === 'interrupted' ? '分心打断' : '正在全力输出...'}
                  </div>
                </div>
              );
            })}
            {sessions.length === 0 && (
              <div className="p-8 text-center text-[var(--text-dark)] text-sm">
                暂无记录。去设置一个属于你的开工结界吧！
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-[var(--text-main)]">
            <Flame className="w-5 h-5 text-[var(--primary)]" />
            最高连击记录
          </h3>
          <div className="bg-[var(--panel)] border border-[var(--border-light)] rounded-xl p-1 shadow-sm">
            {anchors.sort((a, b) => b.chainLength - a.chainLength).slice(0, 5).map(anchor => (
              <div key={anchor.id} className="p-4 border-b border-[var(--border-light)] last:border-0 flex justify-between items-center hover:bg-[var(--panel-hover)] transition-colors rounded-lg">
                <div>
                  <div className="font-bold text-[var(--text-main)]">{anchor.name}</div>
                  <div className="text-xs text-[var(--text-dim)] mt-1 truncate max-w-[200px]">
                    {anchor.description}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-[var(--bg-main)] px-3 py-1 rounded-full border border-[var(--border-light)]">
                  <span className="text-2xl font-black text-[var(--primary)]">{anchor.chainLength}</span>
                  <span className="text-[10px] font-bold text-[var(--text-dark)] uppercase">连击</span>
                </div>
              </div>
            ))}
            {anchors.length === 0 && (
              <div className="p-8 text-center text-[var(--text-dark)] text-sm">
                还没有建立过持久的专注！
                <div className="mt-4">
                  <Link to="/anchors" className="text-[var(--primary)] font-bold hover:underline">去设置开工结界</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
