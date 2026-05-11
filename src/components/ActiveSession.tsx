import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { ShieldAlert, XCircle, CheckCircle2, Clock } from 'lucide-react';

export function ActiveSession() {
  const { currentSessionId, sessions, anchors, endSession, addException, resetChain } = useStore();
  const [showPrecedent, setShowPrecedent] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const session = sessions.find(s => s.id === currentSessionId);
  const anchor = anchors.find(a => a.id === session?.anchorId);

  useEffect(() => {
    if (!session) return;

    if (session.status === 'delayed' && session.delayEndTime) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((session.delayEndTime! - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining === 0) {
          // Auto-start session when delay ends
          // In a real app, we might require manual confirmation
          useStore.setState(state => ({
            sessions: state.sessions.map(s => s.id === session.id ? { ...s, status: 'ongoing' } : s)
          }));
        }
      }, 1000);
      return () => clearInterval(interval);
    } else if (session.status === 'ongoing') {
      const interval = setInterval(() => {
        setTimeLeft(Math.floor((Date.now() - session.startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [session]);

  if (!session || !anchor) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleInterrupt = () => {
    setShowPrecedent(true);
  };

  const handlePrecedentChoice = (choice: 'A' | 'B') => {
    if (choice === 'A') {
      resetChain(anchor.id);
      endSession(session.id, 'interrupted');
    } else {
      addException(anchor.id, `Interrupted at ${new Date().toLocaleTimeString()}`);
      endSession(session.id, 'interrupted');
    }
    setShowPrecedent(false);
  };

  if (showPrecedent) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-[#111] border border-red-900/50 rounded-2xl max-w-lg w-full p-8 shadow-2xl shadow-red-900/20 animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 text-red-500 mb-6">
            <ShieldAlert className="w-8 h-8" />
            <h2 className="text-2xl font-bold">判例选择器</h2>
          </div>
          
          <p className="text-[#ccc] mb-8 text-lg">
            你刚才似乎离开了 <strong className="text-white">{anchor.name}</strong> 的专注状态。
            <br/><br/>
            请选择：
          </p>

          <div className="space-y-4">
            <button 
              onClick={() => handlePrecedentChoice('A')}
              className="w-full text-left p-6 rounded-xl border border-[#333] hover:border-red-500 hover:bg-red-950/20 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#222] group-hover:bg-red-500 text-white flex items-center justify-center text-xs font-bold">A</div>
                <h3 className="font-bold text-lg text-white">接受惩罚</h3>
              </div>
              <p className="text-[#888] pl-9">立即终止专注链，#{anchor.chainLength} 清零，明天从 #1 重新开始。</p>
            </button>

            <button 
              onClick={() => handlePrecedentChoice('B')}
              className="w-full text-left p-6 rounded-xl border border-[#333] hover:border-yellow-500 hover:bg-yellow-950/20 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#222] group-hover:bg-yellow-500 text-white flex items-center justify-center text-xs font-bold">B</div>
                <h3 className="font-bold text-lg text-white">下必为例</h3>
              </div>
              <p className="text-[#888] pl-9">允许这次行为，但<strong className="text-yellow-500">从此以后，该行为在这条专注链的整个生命周期内永久允许</strong>，无法再视为违规。</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-[#111]/90 backdrop-blur-md border border-[#333] rounded-full px-6 py-4 shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#00FF00] animate-pulse" />
          <div className="font-medium text-white">{anchor.name}</div>
        </div>
        
        <div className="font-mono text-2xl tracking-wider text-[#00FF00]">
          {session.status === 'delayed' ? '-' : ''}{timeLeft !== null ? formatTime(timeLeft) : '00:00'}
        </div>

        <div className="flex items-center gap-2 border-l border-[#333] pl-6">
          <button 
            onClick={() => endSession(session.id, 'completed')}
            className="w-10 h-10 rounded-full bg-[#222] hover:bg-[#00FF00] hover:text-black flex items-center justify-center transition-colors text-[#888]"
            title="完成专注"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handleInterrupt}
            className="w-10 h-10 rounded-full bg-[#222] hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors text-[#888]"
            title="中断专注"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
