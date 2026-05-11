import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Calendar, Award } from 'lucide-react';
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
        <div className="w-16 h-16 bg-[#111] border border-[#333] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Award className="w-8 h-8 text-[#00FF00]" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">每日命名</h2>
        <p className="text-[#888] mt-2">定义你的个人叙事。用你最大的胜利来命名这一天。</p>
      </header>

      <div className="bg-[#111] border border-[#00FF00]/30 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF00]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
          <Calendar className="w-5 h-5 text-[#00FF00]" />
          今日：{format(new Date(), 'yyyy年MM月dd日')}
        </h3>

        <form onSubmit={handleSave} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-mono text-[#888] mb-2 uppercase">今日命名</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：伟大的重构之日"
              className="w-full bg-[#050505] border border-[#333] rounded-lg px-6 py-4 text-2xl font-bold text-white focus:border-[#00FF00] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-[#888] mb-2 uppercase">核心成就</label>
            <textarea 
              value={achievement}
              onChange={(e) => setAchievement(e.target.value)}
              placeholder="是什么具体行动赢得了这个名字？"
              className="w-full bg-[#050505] border border-[#333] rounded-lg px-6 py-4 text-[#ccc] focus:border-[#00FF00] focus:outline-none transition-colors h-32 resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="submit"
              className="bg-[#00FF00] text-black px-8 py-3 rounded-md font-bold hover:bg-[#00cc00] transition-colors"
            >
              封存今日
            </button>
          </div>
        </form>
      </div>

      <div className="mt-16">
        <h3 className="text-lg font-mono text-[#888] uppercase tracking-wider mb-6">编年史</h3>
        <div className="space-y-4">
          {pastDays.map(date => {
            const record = dailyRecords[date];
            return (
              <div key={date} className="flex gap-6 items-stretch">
                <div className="w-24 shrink-0 flex flex-col items-end justify-center border-r border-[#333] pr-6 py-4">
                  <div className="text-sm font-bold text-[#e5e5e5]">{format(new Date(date), 'MMM d')}</div>
                  <div className="text-xs text-[#666]">{format(new Date(date), 'EEEE')}</div>
                </div>
                <div className="flex-1 py-4">
                  {record ? (
                    <div>
                      <h4 className="text-xl font-bold text-[#00FF00] mb-1">"{record.name}"</h4>
                      <p className="text-[#888] text-sm">{record.achievement}</p>
                    </div>
                  ) : (
                    <div className="h-full flex items-center text-[#444] text-sm italic">
                      未记录
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
