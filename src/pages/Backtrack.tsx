import React, { useState } from 'react';
import { Map, ArrowUp, Target } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export function Backtrack() {
  const [steps, setSteps] = useState([{ question: 'What were you doing just now?', answer: '' }]);
  const [isComplete, setIsComplete] = useState(false);
  const { addPattern } = useStore();
  const navigate = useNavigate();

  const handleNext = (index: number) => {
    if (!steps[index].answer) return;
    
    if (index < 4) {
      const nextQuestions = [
        "What made you do that?",
        "What led to that state?",
        "What was the trigger before that?",
        "What is the earliest point of failure?"
      ];
      setSteps([...steps, { question: nextQuestions[index], answer: '' }]);
    } else {
      setIsComplete(true);
    }
  };

  const handleCreatePattern = () => {
    const rootCause = steps[steps.length - 1].answer;
    addPattern({
      name: `Prevent: ${rootCause.substring(0, 30)}...`,
      description: `Derived from backtrack analysis. Root cause: ${rootCause}`,
      parentId: null
    });
    navigate('/patterns');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--panel)] border border-[var(--border)] mb-6">
          <Map className="w-8 h-8 text-[var(--primary)]" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Inescapable Zone Analysis</h2>
        <p className="text-[var(--text-dim)] mt-4 max-w-xl mx-auto">
          Don't fight the behavior at the end of the chain. Trace it back to the earliest intervention point.
        </p>
      </header>

      <div className="space-y-6 relative">
        {/* Vertical connecting line */}
        <div className="absolute left-6 top-10 bottom-10 w-px bg-[var(--border)] -z-10" />

        {steps.map((step, index) => (
          <div key={index} className="flex gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-12 h-12 rounded-full bg-[var(--panel)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 text-[var(--text-dim)] font-mono text-sm">
              {index + 1}
            </div>
            <div className="flex-1 bg-[var(--panel)] border border-[var(--border-light)] rounded-xl p-6">
              <h4 className="text-[var(--primary)] font-mono text-sm uppercase tracking-wider mb-4">
                {step.question}
              </h4>
              <textarea
                value={step.answer}
                onChange={(e) => {
                  const newSteps = [...steps];
                  newSteps[index].answer = e.target.value;
                  setSteps(newSteps);
                }}
                disabled={index < steps.length - 1}
                placeholder="Type your answer..."
                className="w-full bg-[var(--bg-dark)] border border-[var(--border)] rounded p-4 text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none transition-colors resize-none disabled:opacity-50"
                rows={3}
              />
              {index === steps.length - 1 && !isComplete && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleNext(index)}
                    disabled={!step.answer}
                    className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] disabled:opacity-50 transition-colors font-bold uppercase text-sm tracking-wider"
                  >
                    Trace Deeper <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isComplete && (
          <div className="flex gap-6 animate-in zoom-in duration-500 pt-8">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)] flex items-center justify-center flex-shrink-0 text-[var(--primary)]">
              <Target className="w-6 h-6" />
            </div>
            <div className="flex-1 bg-[var(--primary)]/5 border border-[var(--primary)]/30 rounded-xl p-6">
              <h4 className="text-[var(--primary)] font-bold text-xl mb-2">Intervention Point Identified</h4>
              <p className="text-[var(--text-muted)] mb-6">
                Your root cause is: <span className="text-white font-medium">"{steps[steps.length - 1].answer}"</span>. 
                This is your Inescapable Zone boundary. We need a pattern here.
              </p>
              <button
                onClick={handleCreatePattern}
                className="w-full bg-[var(--primary)] text-[var(--bg-main)] py-3 rounded font-bold uppercase tracking-wider hover:bg-[var(--primary-hover)] transition-colors"
              >
                Create Pattern for this Node
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
