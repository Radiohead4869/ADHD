import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AnchorsPage } from './pages/AnchorsPage';
import { PatternTree } from './pages/PatternTree';
import { BacktrackMap } from './pages/BacktrackMap';
import { DailyNaming } from './pages/DailyNaming';
import { VoiceCoach } from './pages/VoiceCoach';
import { ActiveSession } from './components/ActiveSession';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/anchors" element={<AnchorsPage />} />
          <Route path="/patterns" element={<PatternTree />} />
          <Route path="/backtrack" element={<BacktrackMap />} />
          <Route path="/daily" element={<DailyNaming />} />
          <Route path="/coach" element={<VoiceCoach />} />
        </Routes>
        <ActiveSession />
      </Layout>
    </Router>
  );
}
