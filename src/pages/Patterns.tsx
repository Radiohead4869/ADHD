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
          ${pattern.status === 'rooted' ? 'bg-[var(--panel-hover)] border-[var(--border)] opacity-80' : 
            pattern.status === 'failed' ? 'bg-red-950/20 border-red-900/30 opacity-50' : 
            'bg-[var(--panel)] border-[var(--primary)]/30 hover:border-[var(--primary)]/60'}
        `} style={{ marginLeft: `${depth * 2}rem` }}>
          
          {depth > 0 && (
            <div className="absolute left-0 w-6 h-px bg-[var(--border)]" style={{ marginLeft: `${(depth * 2) - 1}rem` }} />
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className={`font-bold ${pattern.status === 'failed' ? 'line-through text-[var(--text-dark)]' : ''}`}>
                {pattern.name}
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-mono tracking-wider
                ${pattern.status === 'rooted' ? 'bg-[var(--border)] text-[var(--text-dim)]' : 
                  pattern.status === 'failed' ? 'bg-red-500/10 text-red-500' : 
                  'bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
                {pattern.status}
              </span>
            </div>
            <p className="text-sm text-[var(--text-dim)] mt-1">{pattern.description}</p>
          </div>

          {pattern.status === 'active' && (
            <div className="flex gap-2">
              <button 
                onClick={() => updatePatternStatus(pattern.id, 'rooted')}
                className="p-2 text-[var(--text-dim)] hover:text-[var(--primary)] transition-colors"
                title="Mark as Rooted (Stable)"
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => updatePatternStatus(pattern.id, 'failed')}
                className="p-2 text-[var(--text-dim)] hover:text-red-500 transition-colors"
                title="Mark as Failed (Cascades to children)"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        {children.length > 0 && (
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--border)]" style={{ marginLeft: `${(depth * 2) + 1}rem` }} />
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
            <GitMerge className="w-8 h-8 text-[var(--primary)]" />
            Pattern Tree
          </h2>
          <p className="text-[var(--text-dim)] mt-2">Recursive Steady-State Iteration Protocol (RSIP). Build local optimums.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-[var(--primary)] text-[var(--bg-main)] px-4 py-2 rounded font-bold uppercase text-sm tracking-wider hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Pattern
        </button>
      </header>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-[var(--panel)] border border-[var(--border)] p-6 rounded-xl space-y-4">
          <h3 className="text-xl font-semibold mb-4">Define New Pattern</h3>
          
          <div>
            <label className="block text-sm font-mono text-[var(--text-dim)] uppercase mb-1">Pattern Name</label>
            <input 
              type="text" 
              value={newPattern.name}
              onChange={e => setNewPattern({...newPattern, name: e.target.value})}
              placeholder="e.g., Phone outside bedroom"
              className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-[var(--text-dim)] uppercase mb-1">Description</label>
            <input 
              type="text" 
              value={newPattern.description}
              onChange={e => setNewPattern({...newPattern, description: e.target.value})}
              placeholder="What specific behavior does this pattern enforce?"
              className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-[var(--text-dim)] uppercase mb-1">Parent Pattern (Optional)</label>
            <select 
              value={newPattern.parentId}
              onChange={e => setNewPattern({...newPattern, parentId: e.target.value})}
              className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded p-3 text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none transition-colors"
            >
              <option value="">-- Root Pattern (No Parent) --</option>
              {patterns.filter(p => p.status !== 'failed').map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <p className="text-xs text-[var(--text-dark)] mt-2">If parent fails, this pattern will automatically fail.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-[var(--text-dim)] hover:text-white">Cancel</button>
            <button type="submit" className="bg-[var(--primary)] text-[var(--bg-main)] px-6 py-2 rounded font-bold uppercase text-sm tracking-wider">Deploy Pattern</button>
          </div>
        </form>
      )}

      <div className="bg-[var(--bg-dark)] border border-[var(--panel-hover)] rounded-xl p-8 min-h-[400px]">
        {rootPatterns.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[var(--text-dark)] space-y-4 py-20">
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
