import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import './App.css';

const chapters = [
  { title: '第一章', text: '...小说的第一章内容...' },
  { title: '第二章', text: '...小说的第二章内容...' },
  // ...
];

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>在线打字练习</h1>
        </header>
        <main>
          <Routes>
            <Route path="/chapter/:chapterId" element={<Home chapters={chapters} />} />
            <Route path="/" element={<Home chapters={chapters} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
