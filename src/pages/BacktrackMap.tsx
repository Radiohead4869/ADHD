import React, { useState } from 'react';
import { Map, ArrowDown, Search, ArrowRight } from 'lucide-react';

export function BacktrackMap() {
  const [steps, setSteps] = useState<{question: string, answer: string}[]>([
    { question: "你目前处于什么负面状态？", answer: "" }
  ]);
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswerChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index].answer = value;
    setSteps(newSteps);
  };

  const handleNextStep = () => {
    if (steps.length < 5) {
      setSteps([...steps, { question: `是什么让你这么做？ ("${steps[steps.length - 1].answer}")`, answer: "" }]);
    } else {
      setIsComplete(true);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <header className="text-center mb-12">
        <div className="w-16 h-16 bg-[#111] border border-[#333] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Map className="w-8 h-8 text-[#00FF00]" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">回溯地图</h2>
        <p className="text-[#888] mt-2">追踪负面状态的因果链，找到真正的干预节点（不可逃逸区边界）。</p>
      </header>

      <div className="space-y-6 relative">
        {/* Connecting line */}
        <div className="absolute left-6 top-8 bottom-8 w-px bg-[#222] -z-10" />

        {steps.map((step, index) => (
          <div key={index} className="flex gap-6 animate-in slide-in-from-top-4">
            <div className="w-12 h-12 rounded-full bg-[#111] border border-[#333] flex items-center justify-center font-mono text-[#888] shrink-0 z-10">
              {index + 1}
            </div>
            <div className="flex-1 bg-[#111] border border-[#222] rounded-xl p-6">
              <label className="block text-sm font-medium text-[#ccc] mb-3">
                {step.question}
              </label>
              <input 
                type="text"
                value={step.answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                disabled={isComplete || index < steps.length - 1}
                placeholder="输入你的回答..."
                className="w-full bg-[#050505] border border-[#333] rounded-md px-4 py-3 text-white focus:border-[#00FF00] focus:outline-none transition-colors disabled:opacity-50"
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
              className="bg-[#222] hover:bg-[#333] text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-colors"
            >
              <ArrowDown className="w-4 h-4" />
              继续深挖
            </button>
          </div>
        )}

        {isComplete && (
          <div className="mt-12 p-8 bg-[#00FF00]/10 border border-[#00FF00]/30 rounded-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-[#00FF00] mb-4">
              <Search className="w-6 h-6" />
              <h3 className="text-xl font-bold">发现干预节点</h3>
            </div>
            <p className="text-[#ccc] mb-6">
              你无法直接对抗最终状态。你必须建立一个定式来预防根本原因：
            </p>
            <div className="bg-[#050505] border border-[#00FF00]/20 p-6 rounded-xl text-lg font-medium text-white mb-6">
              "{steps[steps.length - 1].answer}"
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => window.location.href = '/patterns'}
                className="bg-[#00FF00] text-black px-6 py-3 rounded-md font-bold flex items-center gap-2 hover:bg-[#00cc00] transition-colors"
              >
                为此节点创建定式
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
