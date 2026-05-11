import React, { useState } from 'react';
import { Map, ArrowDown, Search, ArrowRight, Droplets } from 'lucide-react';

export function BacktrackMap() {
  const [steps, setSteps] = useState<{question: string, answer: string}[]>([
    { question: "你现在遇到了什么任务？（或者在哪里卡住了？）", answer: "" }
  ]);
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswerChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index].answer = value;
    setSteps(newSteps);
  };

  const handleNextStep = () => {
    if (steps.length < 5) {
      setSteps([...steps, { question: `为什么会发生这种情况呢？ ("${steps[steps.length - 1].answer}")`, answer: "" }]);
    } else {
      setIsComplete(true);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <header className="text-center mb-12">
        <div className="w-20 h-20 bg-[var(--panel)] border-4 border-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Droplets className="w-10 h-10 text-[var(--secondary)]" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gradient">思绪理清池 (Unblocker)</h2>
        <p className="text-[var(--text-dim)] mt-3">启动困难？卡住了？不要有压力，连问自己 5 个为什么，把庞大的焦虑拆解成极小的一步。</p>
      </header>

      <div className="space-y-6 relative">
        {/* Connecting line */}
        <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-[var(--secondary)]/50 to-[var(--primary)]/50 rounded-full -z-10" />

        {steps.map((step, index) => (
          <div key={index} className="flex gap-6 animate-in slide-in-from-top-4">
            <div className="w-12 h-12 rounded-full bg-[var(--panel)] border-2 border-[var(--secondary)] flex items-center justify-center font-bold text-[var(--secondary)] shrink-0 z-10 shadow-sm">
              {index + 1}
            </div>
            <div className="flex-1 bg-[var(--panel)] border-2 border-[var(--border-light)] rounded-2xl p-6 shadow-sm hover:border-[var(--secondary)]/50 transition-colors">
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-3">
                {step.question}
              </label>
              <input 
                type="text"
                value={step.answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                disabled={isComplete || index < steps.length - 1}
                placeholder="我的回答是..."
                className="w-full bg-[var(--bg-main)] border-2 border-[var(--border-light)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:border-[var(--secondary)] focus:outline-none transition-all disabled:opacity-50 font-medium"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && step.answer.trim() && !isComplete && index === steps.length - 1) {
                    handleNextStep();
                  }
                }}
              />
            </div>
          </div>
        ))}

        {!isComplete && steps[steps.length - 1].answer.trim() && (
          <div className="flex justify-center pt-4">
            <button 
              onClick={handleNextStep}
              className="bg-[var(--secondary)] hover:bg-[#3bc4d7] text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              <ArrowDown className="w-5 h-5" />
              继续拆解 (Why?)
            </button>
          </div>
        )}

        {isComplete && (
          <div className="mt-12 p-8 bg-[var(--panel)] border-2 border-[var(--primary)] rounded-3xl animate-in zoom-in-95 shadow-[0_10px_40px_rgba(255,143,107,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex items-center gap-3 text-[var(--primary)] mb-6 relative z-10">
              <Search className="w-8 h-8" />
              <h3 className="text-2xl font-bold font-display">找到最小的那一步了！</h3>
            </div>
            <p className="text-[var(--text-muted)] mb-6 relative z-10 text-lg leading-relaxed">
              ADHD 大脑在面对模糊庞大的任务时会直接宕机。现在，什么都别管，只需要做这一件极小的事：
            </p>
            <div className="bg-[var(--bg-main)] border-2 border-[var(--primary)]/40 p-8 rounded-2xl text-xl font-bold text-[var(--text-main)] mb-8 relative z-10 shadow-inner">
              "{steps[steps.length - 1].answer}"
            </div>
            <div className="flex justify-end relative z-10">
              <button 
                onClick={() => window.location.href = '/anchors'}
                className="bg-[var(--primary)] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-[var(--primary-hover)] transition-all shadow-md hover:shadow-[0_0_25px_var(--primary)]"
              >
                带着这个只做 15 分钟
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
