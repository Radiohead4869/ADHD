import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, Activity } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

export function VoiceCoach() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const inputAnalyserRef = useRef<AnalyserNode | null>(null);
  const outputAnalyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>(0);

  const nextPlayTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const connect = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set. Please configure it in your environment.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Initialize Audio Context for playback (24kHz for output)
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = audioCtx;
      nextPlayTimeRef.current = audioCtx.currentTime;

      const outputAnalyser = audioCtx.createAnalyser();
      outputAnalyser.fftSize = 512;
      outputAnalyserRef.current = outputAnalyser;
      outputAnalyser.connect(audioCtx.destination);

      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "你是一个名为 SteadState 的自我工程工具的语音教练。你的任务是帮助用户反思他们的习惯，执行回溯分析，并建立定式。你的语气应该像一个专业的工程师或教练：冷静、客观、理性、不带评判性。不要说鸡汤，直接切入核心问题。用中文回答。",
        },
        callbacks: {
          onopen: async () => {
            setIsConnected(true);
            setIsConnecting(false);
            
            // Start capturing microphone input
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: {
                sampleRate: 16000,
                channelCount: 1,
                echoCancellation: true,
                noiseSuppression: true,
              } });
              streamRef.current = stream;
              
              // Create a separate audio context for input at 16kHz
              const inputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
              const source = inputAudioCtx.createMediaStreamSource(stream);
              sourceRef.current = source;
              
              const inputAnalyser = inputAudioCtx.createAnalyser();
              inputAnalyser.fftSize = 512;
              inputAnalyserRef.current = inputAnalyser;
              
              const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
              processorRef.current = processor;
              
              processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcm16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  let s = Math.max(-1, Math.min(1, inputData[i]));
                  pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }
                
                const buffer = new ArrayBuffer(pcm16.length * 2);
                const view = new DataView(buffer);
                for (let i = 0; i < pcm16.length; i++) {
                  view.setInt16(i * 2, pcm16[i], true);
                }
                
                let binary = '';
                const bytes = new Uint8Array(buffer);
                for (let i = 0; i < bytes.byteLength; i++) {
                  binary += String.fromCharCode(bytes[i]);
                }
                const base64 = btoa(binary);
                
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({
                    audio: { data: base64, mimeType: 'audio/pcm;rate=16000' }
                  });
                });
              };
              
              source.connect(inputAnalyser);
              inputAnalyser.connect(processor);
              processor.connect(inputAudioCtx.destination);
            } catch (err) {
              console.error("Error accessing microphone:", err);
              setError("无法访问麦克风，请检查权限。");
              disconnect();
            }
          },
          onmessage: (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const audioCtx = audioContextRef.current;
              const binary = atob(base64Audio);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
              }
              
              const pcm16 = new Int16Array(bytes.buffer);
              const audioBuffer = audioCtx.createBuffer(1, pcm16.length, 24000);
              const channelData = audioBuffer.getChannelData(0);
              for (let i = 0; i < pcm16.length; i++) {
                channelData[i] = pcm16[i] / 32768.0;
              }
              
              const source = audioCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAnalyserRef.current!);
              
              if (nextPlayTimeRef.current < audioCtx.currentTime) {
                nextPlayTimeRef.current = audioCtx.currentTime;
              }
              
              source.start(nextPlayTimeRef.current);
              nextPlayTimeRef.current += audioBuffer.duration;
              
              activeSourcesRef.current.push(source);
              source.onended = () => {
                activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source);
              };
            }
            
            if (message.serverContent?.interrupted) {
              activeSourcesRef.current.forEach(source => {
                try { source.stop(); } catch (e) {}
              });
              activeSourcesRef.current = [];
              if (audioContextRef.current) {
                nextPlayTimeRef.current = audioContextRef.current.currentTime;
              }
            }
          },
          onclose: () => {
            disconnect();
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setError("连接发生错误。");
            disconnect();
          }
        }
      });
      
      sessionRef.current = await sessionPromise;
      
    } catch (err: any) {
      console.error("Failed to connect:", err);
      setError(err.message || "连接失败");
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch (e) {}
      sessionRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    inputAnalyserRef.current = null;
    outputAnalyserRef.current = null;

    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    activeSourcesRef.current = [];
    
    setIsConnected(false);
    setIsConnecting(false);
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (isConnected && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);
        const width = canvas.width;
        const height = canvas.height;
        
        // Clean background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);

        // Draw guide lines
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.25);
        ctx.lineTo(width, height * 0.25);
        ctx.moveTo(0, height * 0.75);
        ctx.lineTo(width, height * 0.75);
        ctx.stroke();

        const drawWaveform = (analyser: AnalyserNode | null, color: string, centerY: number, maxAmplitude: number) => {
          if (!analyser) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#333';
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.stroke();
            return;
          }
          
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteTimeDomainData(dataArray);

          ctx.lineWidth = 2;
          ctx.strokeStyle = color;
          ctx.beginPath();

          const sliceWidth = width * 1.0 / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0 - 1.0;
            const y = (v * maxAmplitude) + centerY;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
            x += sliceWidth;
          }
          ctx.stroke();
        };

        // Output (AI) - Top Half
        drawWaveform(outputAnalyserRef.current, '#00FF00', height * 0.25, height * 0.2);
        // Input (User) - Bottom Half
        drawWaveform(inputAnalyserRef.current, '#FFFFFF', height * 0.75, height * 0.2);
        
        ctx.fillStyle = '#666';
        ctx.font = '10px monospace';
        ctx.fillText('AI OUTPUT', 10, height * 0.25 - height * 0.2 - 5);
        ctx.fillText('USER INPUT', 10, height * 0.75 - height * 0.2 - 5);
      };

      draw();
    }
  }, [isConnected]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter uppercase flex items-center gap-3">
          <Activity className="w-8 h-8 text-[#00FF00]" />
          语音教练 (Voice Coach)
        </h1>
        <p className="text-[#888] mt-2">
          与 SteadState 语音教练进行实时对话，进行习惯反思与回溯分析。
        </p>
      </header>

      <div className="bg-[#111] border border-[#222] rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
        {/* Background animation when connected */}
        {isConnected && (
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="w-64 h-64 bg-[#00FF00] rounded-full blur-[100px] animate-pulse" />
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center space-y-8 w-full">
          <button
            onClick={isConnected ? disconnect : connect}
            disabled={isConnecting}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isConnected 
                ? 'bg-[#1a1a1a] border-2 border-[#00FF00] text-[#00FF00] shadow-[0_0_30px_rgba(0,255,0,0.2)]' 
                : isConnecting
                  ? 'bg-[#1a1a1a] border border-[#333] text-[#888]'
                  : 'bg-[#00FF00] text-black hover:bg-[#00cc00] hover:scale-105'
            }`}
          >
            {isConnecting ? (
              <Loader2 className="w-12 h-12 animate-spin" />
            ) : isConnected ? (
              <Mic className="w-12 h-12 animate-pulse" />
            ) : (
              <MicOff className="w-12 h-12" />
            )}
          </button>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-medium">
              {isConnecting ? '正在连接...' : isConnected ? '正在聆听' : '点击开始对话'}
            </h3>
            <p className="text-sm text-[#666]">
              {isConnected ? '请直接说话，教练会实时回应' : '需要麦克风权限'}
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-950/50 border border-red-900/50 text-red-400 rounded-lg text-sm max-w-md text-center">
              {error}
            </div>
          )}

          {isConnected && (
            <div className="w-full max-w-lg mt-8">
              <canvas
                ref={canvasRef}
                width={800}
                height={200}
                className="w-full h-32 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] shadow-inner"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
