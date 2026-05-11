import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GitMerge, Plus, ArrowRight, XCircle, CheckCircle2 } from 'lucide-react';
import { Pattern } from '../types';

export function Patterns() {
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
  
  const renderPatternNode = (pattern: Pattern, depth = 0) => {
    const children = patterns.filter(p => p.parentId === pattern.id);
    
    return (
      <div key={pattern.id} className="relative">
        <div className={`
          flex items-center gap-4 p-4 rounded-lg border mb-2 transition-all
          ${pattern.status === 'rooted' ? 'bg-[#1a1a1a] border-[#333] opacity-80' : 
            pattern.status === 'failed' ? 'bg-red-950/20 border-red-900/30 opacity-50' : 
            'bg-[#111] border-[#00FF00]/30 hover:border-[#00FF00]/60'}
        `} style={{ marginLeft: `${depth * 2}rem` }}>
          
          {depth > 0 && (
            <div className="absolute left-0 w-6 h-px bg-[#333]" style={{ marginLeft: `${(depth * 2) - 1}rem` }} />
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className={`font-bold ${pattern.status === 'failed' ? 'line-through text-[#666]' : ''}`}>
                {pattern.name}
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-mono tracking-wider
                ${pattern.status === 'rooted' ? 'bg-[#333] text-[#888]' : 
                  pattern.status === 'failed' ? 'bg-red-500/10 text-red-500' : 
                  'bg-[#00FF00]/10 text-[#00FF00]'}`}>
                {pattern.status}
              </span>
            </div>
            <p className="text-sm text-[#888] mt-1">{pattern.description}</p>
          </div>

          {pattern.status === 'active' && (
            <div className="flex gap-2">
              <button 
                onClick={() => updatePatternStatus(pattern.id, 'rooted')}
                className="p-2 text-[#888] hover:text-[#00FF00] transition-colors"
                title="Mark as Rooted (Stable)"
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => updatePatternStatus(pattern.id, 'failed')}
                className="p-2 text-[#888] hover:text-red-500 transition-colors"
                title="Mark as Failed (Cascades to children)"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        {children.length > 0 && (
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-[#333]" style={{ marginLeft: `${(depth * 2) + 1}rem` }} />
            {children.map(child => renderPatternNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <GitMerge className="w-8 h-8 text-[#00FF00]" />
            Pattern Tree
          </h2>
          <p className="text-[#888] mt-2">Recursive Steady-State Iteration Protocol (RSIP). Build local optimums.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-[#00FF00] text-black px-4 py-2 rounded font-bold uppercase text-sm tracking-wider hover:bg-[#00cc00] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Pattern
        </button>
      </header>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-[#111] border border-[#333] p-6 rounded-xl space-y-4">
          <h3 className="text-xl font-semibold mb-4">Define New Pattern</h3>
          
          <div>
            <label className="block text-sm font-mono text-[#888] uppercase mb-1">Pattern Name</label>
            <input 
              type="text" 
              value={newPattern.name}
              onChange={e => setNewPattern({...newPattern, name: e.target.value})}
              placeholder="e.g., Phone outside bedroom"
              className="w-full bg-[#050505] border border-[#333] rounded p-3 text-[#e5e5e5] focus:border-[#00FF00] focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-[#888] uppercase mb-1">Description</label>
            <input 
              type="text" 
              value={newPattern.description}
              onChange={e => setNewPattern({...newPattern, description: e.target.value})}
              placeholder="What specific behavior does this pattern enforce?"
              className="w-full bg-[#050505] border border-[#333] rounded p-3 text-[#e5e5e5] focus:border-[#00FF00] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-[#888] uppercase mb-1">Parent Pattern (Optional)</label>
            <select 
              value={newPattern.parentId}
              onChange={e => setNewPattern({...newPattern, parentId: e.target.value})}
              className="w-full bg-[#050505] border border-[#333] rounded p-3 text-[#e5e5e5] focus:border-[#00FF00] focus:outline-none transition-colors"
            >
              <option value="">-- Root Pattern (No Parent) --</option>
              {patterns.filter(p => p.status !== 'failed').map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <p className="text-xs text-[#666] mt-2">If parent fails, this pattern will automatically fail.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-[#888] hover:text-white">Cancel</button>
            <button type="submit" className="bg-[#00FF00] text-black px-6 py-2 rounded font-bold uppercase text-sm tracking-wider">Deploy Pattern</button>
          </div>
        </form>
      )}

      <div className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-8 min-h-[400px]">
        {rootPatterns.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#666] space-y-4 py-20">
            <GitMerge className="w-12 h-12 opacity-20" />
            <p>No patterns defined. Start building your steady state.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {rootPatterns.map(pattern => renderPatternNode(pattern))}
          </div>
        )}
      </div>
    </div>
  );
}
