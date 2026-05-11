import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GitMerge, Plus, AlertCircle, Check, RotateCcw, Zap, Sparkles } from 'lucide-react';

export function PatternTree() {
  const { patterns, addPattern, updatePatternStatus } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newPattern, setNewPattern] = useState({ name: '', description: '', parentId: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPattern.name) return;
    addPattern({
      name: newPattern.name,
      description: newPattern.description,
      parentId: newPattern.parentId || null
    });
    setNewPattern({ name: '', description: '', parentId: '' });
    setIsCreating(false);
  };

  // Build tree structure
  const rootPatterns = patterns.filter(p => !p.parentId);
  
  const renderPatternNode = (patternId: string, depth: number = 0) => {
    const pattern = patterns.find(p => p.id === patternId);
    if (!pattern) return null;
    
    const children = patterns.filter(p => p.parentId === patternId);
    
    const getStatusTheme = (status: string) => {
      switch (status) {
        case 'rooted': return { color: 'var(--success)', bg: 'rgba(102,204,138,0.1)', shadow: 'rgba(102,204,138,0.3)', icon: Check, label: '已永久精通' };
        case 'active': return { color: 'var(--primary)', bg: 'rgba(255,143,107,0.1)', shadow: 'rgba(255,143,107,0.2)', icon: Zap, label: '正在修炼中' };
        case 'failed': return { color: 'var(--text-dim)', bg: 'rgba(153,153,153,0.1)', shadow: 'transparent', icon: RotateCcw, label: '需要重新激活' };
        default: return { color: 'var(--border-light)', bg: 'var(--bg-main)', shadow: 'transparent', icon: Zap, label: '' };
      }
    };
    
    const theme = getStatusTheme(pattern.status);
    const StatusIcon = theme.icon;

    return (
      <div key={pattern.id} className="relative flex flex-col items-start w-full">
        {/* Skill Node */}
        <div 
          className={`relative z-10 flex items-center gap-4 p-4 rounded-xl border-2 transition-all w-full max-w-lg overflow-hidden group
            ${pattern.status === 'failed' ? 'opacity-70 saturate-50' : 'hover:scale-[1.02]'}
          `}
          style={{ 
            borderColor: theme.color, 
            backgroundColor: 'var(--panel)',
            boxShadow: `0 4px 20px ${theme.shadow}`
          }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 z-0 pointer-events-none transition-colors" style={{ backgroundColor: theme.bg }} />
          
          <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full border-4 flex items-center justify-center bg-[var(--bg-main)] shadow-inner" style={{ borderColor: theme.color }}>
            <StatusIcon className="w-6 h-6" style={{ color: theme.color }} />
          </div>
          
          <div className="relative z-10 flex-1">
            <h4 className="font-bold text-lg font-display tracking-wide" style={{ color: pattern.status === 'failed' ? 'var(--text-main)' : theme.color }}>
              {pattern.name}
            </h4>
            <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">{pattern.description}</p>
          </div>
          
          <div className="relative z-10 flex flex-col gap-2 ml-4">
            {pattern.status === 'active' && (
              <>
                <button 
                  onClick={() => updatePatternStatus(pattern.id, 'rooted')}
                  className="text-xs px-3 py-1.5 bg-[var(--success)] text-white hover:brightness-110 hover:shadow-[0_0_10px_var(--success)] rounded-md uppercase font-bold tracking-wider transition-all"
                >
                  满级精通!
                </button>
                <button 
                  onClick={() => updatePatternStatus(pattern.id, 'failed')}
                  className="text-xs px-3 py-1.5 bg-[var(--bg-dark)] text-[var(--text-muted)] border border-[var(--border)] hover:bg-[var(--border-light)] rounded-md font-bold transition-all"
                >
                  暂时休眠
                </button>
              </>
            )}
            {pattern.status === 'failed' && (
              <button 
                onClick={() => updatePatternStatus(pattern.id, 'active')}
                className="text-xs px-3 py-1.5 bg-[var(--primary)] text-white hover:brightness-110 hover:shadow-[0_0_10px_var(--primary)] rounded-md font-bold transition-all flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                重新激活
              </button>
            )}
          </div>
        </div>
        
        {/* Child Skills (Branches) */}
        {children.length > 0 && (
           <div className="relative w-full pt-6 ml-10 flex flex-col gap-6" style={{ opacity: pattern.status === 'failed' ? 0.5 : 1 }}>
             {/* Vertical Stem connecting to parent */}
             <div className="absolute left-[5px] inset-y-0 w-1 rounded-full" style={{ backgroundColor: theme.color, bottom: '2rem' }} />
             
             {children.map(child => (
               <div key={child.id} className="relative w-full pl-8">
                 {/* Horizontal Branch connecting this child to the stem */}
                 <div className="absolute left-[5px] top-1/2 h-1 w-8 rounded-full" style={{ backgroundColor: theme.color, transform: 'translateY(-50%)' }} />
                 {renderPatternNode(child.id, depth + 1)}
               </div>
             ))}
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient">连击习惯链 (Habit Streaks)</h2>
          <p className="text-[var(--text-dim)] mt-2">将复杂的困难拆解成小习惯，把一个小习惯链接在另一个习惯后面，不靠记忆，靠惯性。</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded-md font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[var(--primary-hover)] hover:shadow-[0_0_15px_var(--primary)] transition-all"
        >
          <Sparkles className="w-5 h-5" />
          养成新习惯
        </button>
      </header>

      {isCreating && (
        <div className="bg-[var(--panel)] border-2 border-[var(--primary)] rounded-xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(255,143,107,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent pointer-events-none" />
          <h3 className="text-xl font-bold text-[var(--primary)] font-display mb-4 relative z-10 tracking-widest flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            习惯培养皿
          </h3>
          <form onSubmit={handleCreate} className="space-y-4 relative z-10">
            <div>
              <label className="block text-sm font-mono text-[var(--text-dim)] mb-1 uppercase tracking-wider">微习惯名称</label>
              <input 
                type="text" 
                value={newPattern.name}
                onChange={e => setNewPattern({...newPattern, name: e.target.value})}
                placeholder="例如：吃药、看一眼日历"
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-md px-4 py-3 text-[var(--text-main)] focus:border-[var(--primary)] focus:shadow-[0_0_10px_var(--primary)] focus:outline-none transition-all font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-[var(--text-dim)] mb-1 uppercase tracking-wider">具体怎么做？(越简单越好)</label>
              <input 
                type="text" 
                value={newPattern.description}
                onChange={e => setNewPattern({...newPattern, description: e.target.value})}
                placeholder="例如：把药瓶放在饮水机旁边，喝水时顺手吃药"
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-md px-4 py-3 text-[var(--text-main)] focus:border-[var(--primary)] focus:shadow-[0_0_10px_var(--primary)] focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-[var(--text-dim)] mb-1 uppercase tracking-wider">绑定哪个老习惯？(可选)</label>
              <select 
                value={newPattern.parentId}
                onChange={e => setNewPattern({...newPattern, parentId: e.target.value})}
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-md px-4 py-3 text-[var(--text-main)] focus:border-[var(--primary)] focus:shadow-[0_0_10px_var(--primary)] focus:outline-none transition-all cursor-pointer font-medium"
              >
                <option value="">-- 作为初始习惯 (不需要前置) --</option>
                {patterns.filter(p => p.status === 'rooted' || p.status === 'active').map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <p className="text-xs text-[var(--text-dim)] mt-3 flex items-center gap-1 font-mono">
                <AlertCircle className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-[var(--primary)]">提示：</span> 把新习惯绑在老习惯后面（例如"刷牙" -&gt; "吃药"），这样最不容易忘记！
              </p>
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
                className="bg-[var(--primary)] text-white px-8 py-2 rounded-md font-bold hover:bg-[var(--primary-hover)] hover:shadow-[0_0_15px_var(--primary)] transition-all uppercase tracking-wider flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                添加到日常
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[var(--bg-dark)] border-2 border-[var(--border-light)] shadow-sm hover:shadow-md transition-shadow rounded-3xl p-8 min-h-[500px] overflow-x-auto relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,143,107,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        {rootPatterns.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[var(--text-dim)] space-y-4 mt-20 relative z-10">
            <GitMerge className="w-16 h-16 opacity-30 text-[var(--primary)]" />
            <p className="font-bold text-lg">习惯链空空如也，从一个极小的微习惯开始吧。</p>
          </div>
        ) : (
          <div className="space-y-12 relative z-10 px-4 py-8">
            {rootPatterns.map(p => renderPatternNode(p.id))}
          </div>
        )}
      </div>
    </div>
  );
}
