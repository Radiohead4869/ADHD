import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GitMerge, Plus, GitCommit, AlertCircle } from 'lucide-react';

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
    
    return (
      <div key={pattern.id} className="relative">
        <div className={`
          flex items-start gap-4 p-4 rounded-xl border transition-all
          ${pattern.status === 'rooted' ? 'bg-[#00FF00]/5 border-[#00FF00]/20' : 
            pattern.status === 'failed' ? 'bg-red-950/10 border-red-900/20 opacity-50' : 
            'bg-[#111] border-[#333]'}
        `}>
          <div className="mt-1">
            {pattern.status === 'rooted' ? (
              <div className="w-4 h-4 rounded-full bg-[#00FF00] shadow-[0_0_10px_rgba(0,255,0,0.5)]" />
            ) : pattern.status === 'failed' ? (
              <div className="w-4 h-4 rounded-full bg-red-500" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-[#888]" />
            )}
          </div>
          <div className="flex-1">
            <h4 className={`font-bold ${pattern.status === 'rooted' ? 'text-[#00FF00]' : 'text-white'}`}>
              {pattern.name}
            </h4>
            <p className="text-sm text-[#888] mt-1">{pattern.description}</p>
            
            <div className="flex gap-2 mt-3">
              {pattern.status === 'active' && (
                <>
                  <button 
                    onClick={() => updatePatternStatus(pattern.id, 'rooted')}
                    className="text-xs px-2 py-1 bg-[#222] hover:bg-[#00FF00]/20 hover:text-[#00FF00] rounded transition-colors"
                  >
                    标记为已扎根
                  </button>
                  <button 
                    onClick={() => updatePatternStatus(pattern.id, 'failed')}
                    className="text-xs px-2 py-1 bg-[#222] hover:bg-red-900/50 hover:text-red-400 rounded transition-colors"
                  >
                    标记为失败
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {children.length > 0 && (
          <div className="ml-6 pl-6 border-l border-[#333] mt-4 space-y-4 relative">
            {children.map(child => renderPatternNode(child.id, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">定式树</h2>
          <p className="text-[#888] mt-2">递归稳态迭代协议 (RSIP)。在已扎根的习惯上构建局部最优解。</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-[#00FF00] text-black px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-[#00cc00] transition-colors"
        >
          <Plus className="w-4 h-4" />
          新定式
        </button>
      </header>

      {isCreating && (
        <div className="bg-[#111] border border-[#333] rounded-xl p-6 relative">
          <h3 className="text-xl font-semibold mb-4">引入新定式</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-[#888] mb-1 uppercase">定式名称</label>
              <input 
                type="text" 
                value={newPattern.name}
                onChange={e => setNewPattern({...newPattern, name: e.target.value})}
                placeholder="例如：手机不带进卧室"
                className="w-full bg-[#050505] border border-[#333] rounded-md px-4 py-2 text-white focus:border-[#00FF00] focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-[#888] mb-1 uppercase">描述</label>
              <input 
                type="text" 
                value={newPattern.description}
                onChange={e => setNewPattern({...newPattern, description: e.target.value})}
                placeholder="具体行为是什么？"
                className="w-full bg-[#050505] border border-[#333] rounded-md px-4 py-2 text-white focus:border-[#00FF00] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-[#888] mb-1 uppercase">父定式 (可选)</label>
              <select 
                value={newPattern.parentId}
                onChange={e => setNewPattern({...newPattern, parentId: e.target.value})}
                className="w-full bg-[#050505] border border-[#333] rounded-md px-4 py-2 text-white focus:border-[#00FF00] focus:outline-none transition-colors"
              >
                <option value="">-- 根定式 (无父节点) --</option>
                {patterns.filter(p => p.status === 'rooted' || p.status === 'active').map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <p className="text-xs text-[#666] mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                如果父定式失败，其所有子定式将自动失败。
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-[#888] hover:text-white transition-colors"
              >
                取消
              </button>
              <button 
                type="submit"
                className="bg-white text-black px-6 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors"
              >
                种下定式
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 min-h-[400px]">
        {rootPatterns.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#666] space-y-4 mt-20">
            <GitMerge className="w-12 h-12 opacity-20" />
            <p>尚未种下定式。从一个微小、可控的根定式开始吧。</p>
          </div>
        ) : (
          <div className="space-y-8">
            {rootPatterns.map(p => renderPatternNode(p.id))}
          </div>
        )}
      </div>
    </div>
  );
}
