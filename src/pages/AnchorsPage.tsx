import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Anchor, Plus, Play, AlertTriangle, ShieldAlert, Clock } from 'lucide-react';

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
          <h2 className="text-3xl font-bold tracking-tight">神圣座位</h2>
          <p className="text-[#888] mt-2">定义强制100%专注的物理或数字锚点。</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-[#00FF00] text-black px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-[#00cc00] transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建锚点
        </button>
      </header>

      {isCreating && (
        <div className="bg-[#111] border border-[#333] rounded-xl p-6 relative">
          <h3 className="text-xl font-semibold mb-4">建立新神圣座位</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-[#888] mb-1 uppercase">锚点名称</label>
              <input 
                type="text" 
                value={newAnchor.name}
                onChange={e => setNewAnchor({...newAnchor, name: e.target.value})}
                placeholder="例如：黑色书桌、图书馆42号座位"
                className="w-full bg-[#050505] border border-[#333] rounded-md px-4 py-2 text-white focus:border-[#00FF00] focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-[#888] mb-1 uppercase">描述</label>
              <input 
                type="text" 
                value={newAnchor.description}
                onChange={e => setNewAnchor({...newAnchor, description: e.target.value})}
                placeholder="是什么定义了这个状态？"
                className="w-full bg-[#050505] border border-[#333] rounded-md px-4 py-2 text-white focus:border-[#00FF00] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-[#888] mb-1 uppercase text-red-400">破坏代价</label>
              <p className="text-xs text-[#666] mb-2">如果我破坏了这个锚点的规则，我真正失去的是什么？</p>
              <textarea 
                value={newAnchor.consequence}
                onChange={e => setNewAnchor({...newAnchor, consequence: e.target.value})}
                placeholder="例如：我将失去自尊，并被剥夺使用这张书桌3天的权利。"
                className="w-full bg-[#050505] border border-red-900/50 rounded-md px-4 py-2 text-white focus:border-red-500 focus:outline-none transition-colors h-24 resize-none"
                required
              />
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
                签署契约
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {anchors.map(anchor => (
          <div key={anchor.id} className="bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Anchor className="w-5 h-5 text-[#888]" />
                  {anchor.name}
                </h3>
                <p className="text-sm text-[#666] mt-1">{anchor.description}</p>
              </div>
              <div className="bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#333] flex items-center gap-2">
                <span className="text-xs font-mono text-[#888]">链条</span>
                <span className="text-lg font-bold text-[#00FF00]">#{anchor.chainLength}</span>
              </div>
            </div>

            <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-4 mb-6 flex-1">
              <div className="flex items-center gap-2 text-red-400 text-xs font-mono uppercase mb-2">
                <ShieldAlert className="w-4 h-4" />
                契约代价
              </div>
              <p className="text-sm text-red-200/80 italic">"{anchor.consequence}"</p>
            </div>

            <div className="flex gap-3 mt-auto">
              <button 
                onClick={() => startSession(anchor.id, false)}
                disabled={!!currentSessionId}
                className="flex-1 bg-[#222] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                进入状态
              </button>
              <button 
                onClick={() => startSession(anchor.id, true)}
                disabled={!!currentSessionId}
                className="flex-1 border border-[#333] hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed text-[#888] hover:text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Clock className="w-4 h-4" />
                15分钟延迟
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
