import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { AppState, Anchor, FocusSession, Pattern } from '../types';

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      anchors: [],
      sessions: [],
      patterns: [],
      dailyRecords: {},
      bingoTasks: [
        { id: uuidv4(), text: '喝一杯水', completed: false },
        { id: uuidv4(), text: '伸一个懒腰', completed: false },
        { id: uuidv4(), text: '闭眼深呼吸三次', completed: false },
        { id: uuidv4(), text: '整理一下桌面', completed: false },
        { id: uuidv4(), text: '回复一条消息', completed: false },
        { id: uuidv4(), text: '站起来走两步', completed: false },
        { id: uuidv4(), text: '写下今天重要的一件事', completed: false },
        { id: uuidv4(), text: '吃个水果或补充剂', completed: false },
        { id: uuidv4(), text: '看一眼窗外远方', completed: false },
        { id: uuidv4(), text: '洗把脸清醒一下', completed: false },
        { id: uuidv4(), text: '听一首喜欢的歌', completed: false },
        { id: uuidv4(), text: '把身边的垃圾扔掉', completed: false },
        { id: uuidv4(), text: '活动一下脖子', completed: false },
        { id: uuidv4(), text: '梳一下头发', completed: false },
        { id: uuidv4(), text: '给植物浇水或者摸摸宠物', completed: false },
        { id: uuidv4(), text: '对自己微笑一下', completed: false },
      ],
      currentSessionId: null,

      addAnchor: (anchorData) => set((state) => ({
        anchors: [...state.anchors, {
          ...anchorData,
          id: uuidv4(),
          createdAt: Date.now(),
          chainLength: 0,
          isActive: true,
          allowedExceptions: []
        }]
      })),

      startSession: (anchorId, withDelay = false) => set((state) => {
        const newSession: FocusSession = {
          id: uuidv4(),
          anchorId,
          startTime: Date.now(),
          duration: 0,
          status: withDelay ? 'delayed' : 'ongoing',
          delayEndTime: withDelay ? Date.now() + 15 * 60 * 1000 : undefined
        };
        return {
          sessions: [...state.sessions, newSession],
          currentSessionId: newSession.id
        };
      }),

      endSession: (sessionId, status) => set((state) => {
        const session = state.sessions.find(s => s.id === sessionId);
        if (!session) return state;

        const updatedSession = { ...session, endTime: Date.now(), status };
        
        // Update anchor chain length if completed
        let updatedAnchors = state.anchors;
        if (status === 'completed') {
          updatedAnchors = state.anchors.map(a => 
            a.id === session.anchorId ? { ...a, chainLength: a.chainLength + 1 } : a
          );
        }

        return {
          sessions: state.sessions.map(s => s.id === sessionId ? updatedSession : s),
          anchors: updatedAnchors,
          currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId
        };
      }),

      addException: (anchorId, exception) => set((state) => ({
        anchors: state.anchors.map(a => 
          a.id === anchorId ? { ...a, allowedExceptions: [...a.allowedExceptions, exception] } : a
        )
      })),

      resetChain: (anchorId) => set((state) => ({
        anchors: state.anchors.map(a => 
          a.id === anchorId ? { ...a, chainLength: 0 } : a
        )
      })),

      addPattern: (patternData) => set((state) => ({
        patterns: [...state.patterns, {
          ...patternData,
          id: uuidv4(),
          createdAt: Date.now(),
          status: 'active'
        }]
      })),

      reorderPatterns: (newOrder: Pattern[]) => set((state) => {
        const newPatterns = [...state.patterns];
        const currentIndices = newOrder.map(p => state.patterns.findIndex(sp => sp.id === p.id)).sort((a, b) => a - b);
        
        currentIndices.forEach((index, i) => {
          newPatterns[index] = newOrder[i];
        });

        return { patterns: newPatterns };
      }),

      updatePatternStatus: (patternId, status) => set((state) => {
        if (status === 'failed') {
          const failTree = (id: string, currentPatterns: Pattern[]): Pattern[] => {
            let updated = currentPatterns.map(p => p.id === id ? { ...p, status: 'failed' as const } : p);
            const children = currentPatterns.filter(p => p.parentId === id);
            children.forEach(child => {
              updated = failTree(child.id, updated);
            });
            return updated;
          };
          return { patterns: failTree(patternId, state.patterns) };
        }

        return {
          patterns: state.patterns.map(p => p.id === patternId ? { ...p, status } : p)
        };
      }),

      setDailyName: (date, name, achievement) => set((state) => ({
        dailyRecords: {
          ...state.dailyRecords,
          [date]: { date, name, achievement }
        }
      })),

      addBingoTask: (text) => set((state) => ({
        bingoTasks: [...state.bingoTasks, { id: uuidv4(), text, completed: false }]
      })),

      toggleBingoTask: (id) => set((state) => ({
        bingoTasks: state.bingoTasks.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      })),

      removeBingoTask: (id) => set((state) => ({
        bingoTasks: state.bingoTasks.filter(t => t.id !== id)
      })),

      clearBingoBoard: () => set(() => ({
        bingoTasks: []
      }))
    }),
    {
      name: 'steadstate-storage',
    }
  )
);
