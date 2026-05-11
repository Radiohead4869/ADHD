import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Anchor, Plus, ShieldAlert, Play, Square, AlertTriangle } from 'lucide-react';

export function Anchors() {
  const { anchors, addAnchor, startSession, endSession, currentSessionId, sessions, resetChain, addException } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newAnchor, setNewAnchor] = useState({ name: '', description: '', consequence: '' });
  const [activeExceptionModal, setActiveExceptionModal] = useState<string | null>(null);
  const [exceptionReason, setExceptionReason] = useState('');

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnchor.name || !newAnchor.consequence) return;
    addAnchor(newAnchor);
    setNewAnchor({ name: '', description: '', consequence: '' });
    setIsCreating(false);
  };

  const handleInterrupt = (anchorId: string) => {
    setActiveExceptionModal(anchorId);
  };

  const submitException = (anchorId: string, type: 'break' | 'allow') => {
    if (type === 'break') {
      resetChain(anchorId);
      if (currentSessionId) endSession(currentSessionId, 'interrupted');
    } else {
      if (!exceptionReason) return;
      addException(anchorId, exceptionReason);
      if (currentSessionId) endSession(currentSessionId, 'completed'); // Technically allowed, so it doesn't break the chain, but ends the session.
    }
    setActiveExceptionModal(null);
    setExceptionReason('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Anchor className="w-8 h-8 text-[#00FF00]" />
            Sacred Seats
          </h2>
          <p className="text-[#888] mt-2">Define physical or digital anchors that demand 100% focus.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-[#00FF00] text-black px-4 py-2 rounded font-bold uppercase text-sm tracking-wider hover:bg-[#00cc00] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Anchor
        </button>
      </header>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-[#111] border border-[#333] p-6 rounded-xl space-y-4">
          <h3 className="text-xl font-semibold mb-4">Establish New Sacred Seat</h3>
          
          <div>
            <label className="block text-sm font-mono text-[#888] uppercase mb-1">Anchor Name</label>
            <input 
              type="text" 
              value={newAnchor.name}
              onChange={e => setNewAnchor({...newAnchor, name: e.target.value})}
              placeholder="e.g., The Black Desk, Focus Mode Profile"
              className="w-full bg-[#050505] border border-[#333] rounded p-3 text-[#e5e5e5] focus:border-[#00FF00] focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-[#888] uppercase mb-1">Definition & Rules</label>
            <textarea 
              value={newAnchor.description}
              onChange={e => setNewAnchor({...newAnchor, description: e.target.value})}
              placeholder="What exactly constitutes sitting in this seat?"
              className="w-full bg-[#050505] border border-[#333] rounded p-3 text-[#e5e5e5] focus:border-[#00FF00] focus:outline-none transition-colors h-24 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-[#888] uppercase mb-1 text-red-400">The Consequence (Crucial)</label>
            <textarea 
              value={newAnchor.consequence}
              onChange={e => setNewAnchor({...newAnchor, consequence: e.target.value})}
              placeholder="If I break this rule, what do I truly lose? (e.g., 'I break my promise to myself and lose the 30-day chain')"
              className="w-full bg-[#050505] border border-red-900/50 rounded p-3 text-[#e5e5e5] focus:border-red-500 focus:outline-none transition-colors h-24 resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-[#888] hover:text-white">Cancel</button>
            <button type="submit" className="bg-[#00FF00] text-black px-6 py-2 rounded font-bold uppercase text-sm tracking-wider">Establish</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {anchors.map(anchor => {
          const isSessionActive = currentSession?.anchorId === anchor.id && currentSession?.status === 'ongoing';
          
          return (
            <div key={anchor.id} className={`bg-[#111] border rounded-xl p-6 relative overflow-hidden transition-colors ${isSessionActive ? 'border-[#00FF00]' : 'border-[#222]'}`}>
              {isSessionActive && (
                <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF00] animate-pulse" />
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{anchor.name}</h3>
                  <div className="text-xs font-mono text-[#666] mt-1">Chain: #{anchor.chainLength}</div>
                </div>
                
                {isSessionActive ? (
                  <button 
                    onClick={() => handleInterrupt(anchor.id)}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 p-2 rounded flex items-center gap-2 text-sm font-bold uppercase"
                  >
                    <Square className="w-4 h-4" />
                    Interrupt
                  </button>
                ) : (
                  <button 
                    onClick={() => startSession(anchor.id)}
                    disabled={!!currentSessionId}
                    className="bg-[#00FF00]/10 text-[#00FF00] hover:bg-[#00FF00]/20 p-2 rounded flex items-center gap-2 text-sm font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4" />
                    Enter Seat
                  </button>
                )}
              </div>

              <p className="text-[#888] text-sm mb-4">{anchor.description}</p>
              
              <div className="bg-red-950/20 border border-red-900/30 p-3 rounded text-sm text-red-200/80 mb-4">
                <span className="font-bold uppercase text-xs block mb-1 text-red-400">Consequence</span>
                {anchor.consequence}
              </div>

              {anchor.allowedExceptions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#222]">
                  <span className="text-xs font-mono text-[#666] uppercase block mb-2">Permanent Exceptions</span>
                  <ul className="text-xs text-[#888] list-disc list-inside space-y-1">
                    {anchor.allowedExceptions.map((exc, i) => (
                      <li key={i}>{exc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Exception Modal (下必为例) */}
      {activeExceptionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-[#333] rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <ShieldAlert className="w-8 h-8" />
              <h3 className="text-2xl font-bold">Jurisprudence Selector</h3>
            </div>
            
            <p className="text-[#ccc] mb-6">You are about to leave the sacred seat. Choose your consequence:</p>

            <div className="space-y-4">
              <div className="border border-[#333] rounded-lg p-4 hover:border-red-500 transition-colors cursor-pointer" onClick={() => submitException(activeExceptionModal, 'break')}>
                <div className="font-bold text-red-400 mb-1">[A] Break the Chain</div>
                <p className="text-sm text-[#888]">Terminate session immediately. Chain resets to #0. Tomorrow starts from #1.</p>
              </div>

              <div className="border border-[#333] rounded-lg p-4 hover:border-yellow-500 transition-colors">
                <div className="font-bold text-yellow-400 mb-1">[B] Establish Precedent (Permanent Exception)</div>
                <p className="text-sm text-[#888] mb-3">Allow this behavior, but it will be PERMANENTLY allowed for the lifetime of this anchor.</p>
                <input 
                  type="text"
                  value={exceptionReason}
                  onChange={e => setExceptionReason(e.target.value)}
                  placeholder="Define the exact exception (e.g., 'Bathroom break under 2 mins')"
                  className="w-full bg-[#050505] border border-[#444] rounded p-2 text-sm text-[#e5e5e5] focus:border-yellow-500 focus:outline-none"
                />
                <button 
                  onClick={() => submitException(activeExceptionModal, 'allow')}
                  disabled={!exceptionReason}
                  className="mt-3 w-full bg-yellow-500/20 text-yellow-500 py-2 rounded text-sm font-bold uppercase disabled:opacity-50"
                >
                  Confirm Precedent
                </button>
              </div>
            </div>

            <button onClick={() => setActiveExceptionModal(null)} className="mt-6 w-full text-[#666] hover:text-white text-sm">Cancel (Return to Seat)</button>
          </div>
        </div>
      )}
    </div>
  );
}
