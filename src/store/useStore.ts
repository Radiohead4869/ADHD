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

      updatePatternStatus: (patternId, status) => set((state) => {
        // If a pattern fails, all its children must also fail (RSIP logic)
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
      }))
    }),
    {
      name: 'steadstate-storage',
    }
  )
);
