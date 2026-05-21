import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Check, Plus, Trash2, Award, Zap } from 'lucide-react';

export function BingoBoard() {
  const { bingoTasks, toggleBingoTask, addBingoTask, removeBingoTask } = useStore();
  const [newTaskText, setNewTaskText] = useState('');

  // Calculate if Bingo is achieved for a 4x4 grid
  const isBingoAchieved = () => {
    const grid = [];
    for (let i = 0; i < 4; i++) {
       const row = [];
       for (let j = 0; j < 4; j++) {
         const task = bingoTasks[i * 4 + j];
         row.push(task ? task.completed : false);
       }
       grid.push(row);
    }

    // Check rows & cols
    for (let i = 0; i < 4; i++) {
       if (grid[i][0] && grid[i][1] && grid[i][2] && grid[i][3]) return true; // Row
       if (grid[0][i] && grid[1][i] && grid[2][i] && grid[3][i]) return true; // Col
    }

    // Check diagonals
    if (grid[0][0] && grid[1][1] && grid[2][2] && grid[3][3]) return true;
    if (grid[0][3] && grid[1][2] && grid[2][1] && grid[3][0]) return true;

    return false;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() && bingoTasks.length < 16) {
      addBingoTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  const boardTasks = Array.from({ length: 16 }, (_, i) => bingoTasks[i] || null);

  const completedCount = bingoTasks.filter(t => t.completed).length;
  const showBingo = isBingoAchieved();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient flex items-center gap-2">
            <Zap className="w-8 h-8 text-[var(--primary)]" />
            多巴胺宾果 (Dopamine Bingo)
          </h2>
          <p className="text-[var(--text-dim)] mt-2">打卡微小任务，集齐一条线获得满格的多巴胺奖励！不要有压力，随便填满就行。</p>
        </div>
      </header>

      {showBingo && (
        <div className="bg-[var(--success)]/20 border-2 border-[var(--success)] rounded-2xl p-6 flex items-center justify-center gap-4 animate-in zoom-in-95 duration-300">
          <Award className="w-12 h-12 text-[var(--success)] animate-pulse" />
          <div>
            <h3 className="text-2xl font-bold text-[var(--success)] font-display tracking-widest">BINGO! 任务连线达成！</h3>
            <p className="text-white font-medium">你超棒的！今天已经攒够了满满的多巴胺。</p>
          </div>
          <Award className="w-12 h-12 text-[var(--success)] animate-pulse" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-[var(--panel)] border-2 border-[var(--border-light)] shadow-sm rounded-3xl p-8 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,143,107,0.05)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-xl font-bold font-display uppercase tracking-widest text-[var(--text-main)]">宾果画板</h3>
              <div className="text-sm font-mono text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-full">
                已完成 {completedCount} / {bingoTasks.length}
              </div>
            </div>

            {bingoTasks.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-dim)]">
                <p>还没有设定任务，快去右边添加一些微不足道的小事吧！</p>
              </div>
            ) : (
              <div 
                className="grid gap-3 relative z-10 grid-cols-4" 
              >
                {boardTasks.map((task, index) => {
                  if (!task) {
                    return (
                      <div key={`empty-${index}`} className="aspect-square rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-main)]/30 flex flex-col items-center justify-center opacity-50">
                        <Plus className="w-6 h-6 text-[var(--border-light)] mb-1" />
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">未配置</span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleBingoTask(task.id)}
                      className={`
                        aspect-square flex items-center justify-center text-center p-1 sm:p-2 rounded-xl border-2 transition-all group relative overflow-hidden
                        ${task.completed 
                          ? 'bg-[var(--primary)]/20 border-[var(--primary)] shadow-[0_0_15px_rgba(255,143,107,0.3)]' 
                          : 'bg-[var(--bg-main)] border-[var(--border)] hover:border-[var(--border-light)] hover:bg-[var(--bg-dark)]'}
                      `}
                    >
                      {task.completed && (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,143,107,0.2)_0%,transparent_100%)] pointer-events-none animate-in fade-in" />
                      )}
                      <span className={`text-[11px] sm:text-xs font-bold leading-tight relative z-10 w-full px-0.5 ${task.completed ? 'text-[var(--text-main)]' : 'text-[var(--text-dim)] group-hover:text-[var(--text-main)]'}`}>
                        {task.text}
                      </span>
                      {task.completed && (
                        <Check className="w-8 h-8 text-[var(--primary)] absolute opacity-50 z-0 scale-150 rotate-12" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--panel)] border border-[var(--border-light)] rounded-2xl p-6">
            <h3 className="text-lg font-bold font-display uppercase tracking-widest text-[var(--text-main)] mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[var(--primary)]" />
              添加宾果方块
            </h3>
            <form onSubmit={handleAdd} className="flex gap-2">
              <input 
                type="text" 
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                placeholder="例如：整理一下桌面"
                className="flex-1 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none transition-all"
              />
              <button 
                type="submit"
                disabled={!newTaskText.trim()}
                className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg font-bold uppercase disabled:opacity-50 hover:bg-[var(--primary-hover)] transition-all"
              >
                添加
              </button>
            </form>
          </div>

          <div className="bg-[var(--panel)] border border-[var(--border-light)] rounded-2xl p-6">
            <h3 className="text-lg font-bold font-display uppercase tracking-widest text-[var(--text-main)] mb-4">
              任务池管理
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {bingoTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border)]">
                  <span className="text-sm text-[var(--text-main)] truncate mr-2">{task.text}</span>
                  <button 
                    onClick={() => removeBingoTask(task.id)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-md transition-all"
                    title="移除该任务"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
