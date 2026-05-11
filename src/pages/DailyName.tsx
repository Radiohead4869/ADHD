import React, { useState } from 'react';
import { Calendar as CalendarIcon, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, subDays, addDays, isSameDay } from 'date-fns';

export function DailyName() {
  const { dailyRecords, setDailyName } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const record = dailyRecords[dateStr];

  const [name, setName] = useState(record?.name || '');
  const [achievement, setAchievement] = useState(record?.achievement || '');

  // Update local state when date changes
  React.useEffect(() => {
    setName(record?.name || '');
    setAchievement(record?.achievement || '');
  }, [dateStr, record]);

  const handleSave = () => {
    if (!name) return;
    setDailyName(dateStr, name, achievement);
  };

  const isToday = isSameDay(currentDate, new Date());

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--panel)] border border-[var(--border)] mb-6">
          <CalendarIcon className="w-8 h-8 text-[var(--primary)]" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Daily Nomenclature</h2>
        <p className="text-[var(--text-dim)] mt-4">
          Define the narrative of your day. What is the single most important thing that happened?
        </p>
      </header>

      <div className="flex items-center justify-between bg-[var(--panel)] border border-[var(--border-light)] rounded-xl p-4 mb-8">
        <button 
          onClick={() => setCurrentDate(subDays(currentDate, 1))}
          className="p-2 hover:bg-[var(--border-light)] rounded transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="text-xl font-bold">{format(currentDate, 'MMMM d, yyyy')}</div>
          <div className="text-xs text-[var(--text-dark)] font-mono uppercase tracking-wider mt-1">
            {isToday ? 'Today' : format(currentDate, 'EEEE')}
          </div>
        </div>
        <button 
          onClick={() => setCurrentDate(addDays(currentDate, 1))}
          disabled={isToday}
          className="p-2 hover:bg-[var(--border-light)] rounded transition-colors disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-8 space-y-6 relative overflow-hidden">
        {record && (
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Award className="w-32 h-32" />
          </div>
        )}

        <div className="relative z-10">
          <label className="block text-sm font-mono text-[var(--primary)] uppercase mb-2 tracking-wider">
            Name of the Day
          </label>
          <input 
            type="text" 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., The Great Refactoring Day"
            className="w-full bg-transparent border-b-2 border-[var(--border)] focus:border-[var(--primary)] text-3xl font-bold py-2 outline-none transition-colors placeholder:text-[var(--border)]"
          />
        </div>

        <div className="relative z-10">
          <label className="block text-sm font-mono text-[var(--text-dim)] uppercase mb-2 tracking-wider">
            Core Achievement / Reason
          </label>
          <textarea 
            value={achievement}
            onChange={e => setAchievement(e.target.value)}
            placeholder="Why does it deserve this name?"
            className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg p-4 text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none transition-colors h-32 resize-none"
          />
        </div>

        <div className="flex justify-end pt-4 relative z-10">
          <button 
            onClick={handleSave}
            disabled={!name || (name === record?.name && achievement === record?.achievement)}
            className="bg-[var(--primary)] text-[var(--bg-main)] px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {record ? 'Update Chronicle' : 'Seal Chronicle'}
          </button>
        </div>
      </div>
    </div>
  );
}
