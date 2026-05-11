import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Calendar, Award, Star } from 'lucide-react';
import { format, subDays } from 'date-fns';

export function DailyNaming() {
  const { dailyRecords, setDailyName } = useStore();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [name, setName] = useState(dailyRecords[today]?.name || '');
  const [achievement, setAchievement] = useState(dailyRecords[today]?.achievement || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setDailyName(today, name, achievement);
  };

  // Generate last 7 days
  const pastDays = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), i + 1);
    return format(d, 'yyyy-MM-dd');
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header className="text-center mb-12">
        <div className="w-20 h-20 bg-[var(--panel)] border-[3px] border-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,184,0,0.2)]">
          <Award className="w-10 h-10 text-[var(--secondary)]" />
        </div>
        <h2 className="text-4xl font-display font-bold tracking-tight text-gradient">多巴胺提取机 (Dopamine Wins)</h2>
        <p className="text-[var(--text-dim)] mt-3">ADHD 大脑需要极强的正反馈。每天至少记录一个微小的胜利，不管多小！</p>
      </header>

      <div className="bg-[var(--panel)] border-2 border-[var(--secondary)]/50 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(255,184,0,0.1)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--secondary)]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <h3 className="text-xl font-bold font-display uppercase tracking-wider mb-6 flex items-center gap-2 relative z-10 text-[var(--secondary)]">
          <Star className="w-5 h-5 fill-current" />
          封存高光时刻：{format(new Date(), 'yyyy年MM月dd日')}
        </h3>

        <form onSubmit={handleSave} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-mono text-[var(--text-dim)] mb-2 uppercase tracking-wide">今日最大的那个胜利！</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：终于叠好了那堆衣服、回了一封讨厌的邮件"
              className="w-full bg-[var(--bg-dark)] border-2 border-[var(--border)] rounded-xl px-6 py-4 text-3xl font-display font-bold text-[var(--text-main)] focus:border-[var(--secondary)] focus:shadow-[0_0_15px_rgba(255,184,0,0.3)] focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-[var(--text-dim)] mb-2 uppercase tracking-wide">尽情夸夸自己！(因为你值得)</label>
            <textarea 
              value={achievement}
              onChange={(e) => setAchievement(e.target.value)}
              placeholder="哪怕中间分心了100次，但我最后还是做到了！写下这种感觉..."
              className="w-full bg-[var(--bg-dark)] border-2 border-[var(--border)] rounded-xl px-6 py-4 text-[var(--text-muted)] focus:border-[var(--secondary)] focus:shadow-[0_0_15px_rgba(255,184,0,0.3)] focus:outline-none transition-all h-32 resize-none leading-relaxed"
            />
          </div>
          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className="bg-[var(--secondary)] text-[var(--bg-main)] px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 hover:shadow-[0_0_20px_var(--secondary)] transition-all flex items-center gap-3"
            >
              <Award className="w-5 h-5" />
              提取多巴胺！
            </button>
          </div>
        </form>
      </div>

      <div className="mt-20">
        <h3 className="text-lg font-mono text-[var(--secondary)] uppercase tracking-wider mb-8 flex items-center gap-3">
          <div className="h-px bg-gradient-to-r from-transparent to-[var(--secondary)] flex-1 opacity-50" />
          <span>多巴胺历史库 (Dopamine Vault)</span>
          <div className="h-px bg-gradient-to-l from-transparent to-[var(--secondary)] flex-1 opacity-50" />
        </h3>
        
        <div className="space-y-6">
          {pastDays.map(date => {
            const record = dailyRecords[date];
            return (
              <div key={date} className="flex gap-6 items-center group">
                <div className="w-32 shrink-0 flex flex-col items-end justify-center border-r-[3px] border-[var(--border)] group-hover:border-[var(--secondary)] transition-colors pr-6 py-4">
                  <div className="text-sm font-display font-bold text-[var(--text-main)]">{format(new Date(date), 'MMM d')}</div>
                  <div className="text-xs font-mono text-[var(--text-dark)] mt-1">{format(new Date(date), 'EEEE')}</div>
                </div>
                <div className="flex-1 py-4">
                  {record ? (
                    <div className="bg-[var(--panel)] p-6 rounded-2xl border border-[var(--border-light)] group-hover:border-[var(--secondary)] transition-all">
                      <h4 className="text-2xl font-display font-bold text-[var(--secondary)] mb-2 tracking-wide">
                        🏆 {record.name}
                      </h4>
                      <p className="text-[var(--text-muted)] text-sm leading-relaxed">{record.achievement}</p>
                    </div>
                  ) : (
                    <div className="h-full flex items-center text-[var(--border-light)] text-sm italic font-mono px-6">
                      // 空白之日 (未记录多巴胺)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
