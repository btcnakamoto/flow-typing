import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopPage from './components/TopPage';
import Home from './views/Home';
import './App.css';

const chapters = [
  { title: '第一章', text: '...小说的第一章内容...' },
  { title: '第二章', text: '...小说的第二章内容...' },
  // ...更多章节
];

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/chapter/:chapterId" element={<Home chapters={chapters} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;