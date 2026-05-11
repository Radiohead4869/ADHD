import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Anchor, Plus, Play, ShieldAlert, Clock, Sparkles } from 'lucide-react';

export function AnchorsPage() {
  const { anchors, addAnchor, startSession, currentSessionId, sessions } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newAnchor, setNewAnchor] = useState({ name: '', description: '', consequence: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnchor.name || !newAnchor.consequence) return;
    addAnchor(newAnchor);
    setNewAnchor({ name: '', description: '', consequence: '' });
    setIsCreating(false);
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient">开工结界 (Focus Pods)</h2>
          <p className="text-[var(--text-dim)] mt-2">你的工作区设定：创建一个零干扰的环境，用番茄钟强迫自己开始第一步。</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-[var(--primary)] text-[var(--panel)] px-4 py-2 rounded-md font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[var(--primary-hover)] hover:shadow-[0_0_15px_var(--primary)] transition-all"
        >
          <Plus className="w-5 h-5" />
          设置新开工结界
        </button>
      </header>

      {isCreating && (
        <div className="bg-[var(--panel)] border-2 border-[var(--primary)] rounded-xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(255,143,107,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent pointer-events-none" />
          <h3 className="text-xl font-bold text-[var(--primary)] font-display mb-4 relative z-10 tracking-widest flex items-center gap-2"><Sparkles className="w-5 h-5" /> 布置新办公区</h3>
          <form onSubmit={handleCreate} className="space-y-4 relative z-10">
            <div>
              <label className="block text-sm font-mono text-[var(--text-dim)] mb-1 uppercase tracking-wider">结界名称位置</label>
              <input 
                type="text" 
                value={newAnchor.name}
                onChange={e => setNewAnchor({...newAnchor, name: e.target.value})}
                placeholder="例如：客厅站立桌、断网咖啡时间"
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-md px-4 py-3 text-[var(--text-main)] focus:border-[var(--primary)] focus:shadow-[0_0_10px_var(--primary)] focus:outline-none transition-all font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-[var(--text-dim)] mb-1 uppercase tracking-wider">结界核心任务</label>
              <input 
                type="text" 
                value={newAnchor.description}
                onChange={e => setNewAnchor({...newAnchor, description: e.target.value})}
                placeholder="在这个结界里，我必须做什么事情？"
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-md px-4 py-3 text-[var(--text-main)] focus:border-[var(--primary)] focus:shadow-[0_0_10px_var(--primary)] focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-[var(--neon-yellow)] mb-1 uppercase tracking-wider">分心惩戒 (如果打开手机/发呆)</label>
              <p className="text-xs text-[var(--text-dark)] mb-2 font-mono">ADHD 容易跑神，给自己定个小小的物理提醒吧！</p>
              <textarea 
                value={newAnchor.consequence}
                onChange={e => setNewAnchor({...newAnchor, consequence: e.target.value})}
                placeholder="例如：立刻做5个深呼吸，或者站起来喝水。"
                className="w-full bg-[var(--neon-yellow)]/5 border border-[var(--neon-yellow)]/30 rounded-md px-4 py-3 text-[var(--text-main)] focus:border-[var(--neon-yellow)] focus:shadow-[0_0_15px_rgba(255,213,79,0.4)] focus:outline-none transition-all h-24 resize-none placeholder:text-[var(--text-muted)]/50"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)]">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="px-6 py-2 text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors font-bold uppercase tracking-wider"
              >
                取消
              </button>
              <button 
                type="submit"
                className="bg-[var(--primary)] text-[var(--panel)] px-8 py-2 rounded-md font-bold uppercase tracking-wider hover:bg-[var(--primary-hover)] hover:shadow-[0_0_15px_var(--primary)] transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                保存开工结界
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {anchors.map((anchor, i) => {
          // Cycle through RPG tier colors for visual variety
          const colors = [
            { main: 'var(--primary)', shadow: 'rgba(255,143,107,0.2)', bg: 'rgba(255,143,107,0.05)' },
            { main: 'var(--secondary)', shadow: 'rgba(77,208,225,0.2)', bg: 'rgba(77,208,225,0.05)' },
            { main: 'var(--neon-purple)', shadow: 'rgba(179,136,255,0.2)', bg: 'rgba(179,136,255,0.05)' },
            { main: 'var(--success)', shadow: 'rgba(102,204,138,0.2)', bg: 'rgba(102,204,138,0.05)' },
          ];
          const theme = colors[i % colors.length];

          return (
            <div key={anchor.id} 
              className="bg-[var(--panel)] border-2 rounded-2xl p-6 flex flex-col relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{
                borderColor: theme.main,
                boxShadow: `0 8px 30px ${theme.shadow}`
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: theme.bg }} />
              
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="flex-1 pr-4">
                  <h3 className="text-2xl font-bold font-display uppercase tracking-wider mb-2 flex items-center gap-3 text-[var(--text-main)]">
                    <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center bg-[var(--bg-main)]" style={{ borderColor: theme.main }}>
                      <Anchor className="w-5 h-5" style={{ color: theme.main }} />
                    </div>
                    Lv.{anchor.chainLength} {anchor.name}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] ml-14">{anchor.description}</p>
                </div>
                <div className="bg-[var(--bg-main)] px-4 py-2 rounded-lg border-2 flex flex-col items-center justify-center min-w-[80px]" style={{ borderColor: theme.main }}>
                  <span className="text-[10px] font-mono text-[var(--text-dim)] uppercase">总番茄数</span>
                  <span className="text-2xl font-bold" style={{ color: theme.main }}>x{anchor.chainLength}</span>
                </div>
              </div>

              <div className="relative z-10 bg-[var(--neon-yellow)]/10 border border-[var(--neon-yellow)]/30 rounded-xl p-5 mb-8 flex-1 group hover:border-[var(--neon-yellow)] transition-all">
                <div className="flex items-center gap-2 text-[var(--neon-yellow)] text-xs font-mono uppercase tracking-widest mb-3">
                  <ShieldAlert className="w-4 h-4" />
                  分心提醒
                </div>
                <p className="text-sm text-[var(--text-main)] font-medium italic">"{anchor.consequence}"</p>
              </div>

              <div className="relative z-10 flex gap-4 mt-auto">
                <button 
                  onClick={() => startSession(anchor.id, false)}
                  disabled={!!currentSessionId}
                  className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-[var(--panel)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:brightness-105 active:scale-95"
                  style={{ backgroundColor: theme.main, boxShadow: `0 4px 15px ${theme.shadow}` }}
                >
                  <Play className="w-5 h-5 fill-current" />
                  立刻开工
                </button>
                <button 
                  onClick={() => startSession(anchor.id, true)}
                  disabled={!!currentSessionId}
                  className="flex-1 border-2 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-[var(--bg-main)] disabled:opacity-50 active:scale-95"
                  style={{ borderColor: theme.main, color: theme.main }}
                >
                  <Clock className="w-5 h-5" />
                  开启 15 分钟番茄钟
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
