import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ImportText from './components/ImportText';
import ChaptersPage from './components/ChaptersPage';
import TypingConsole from './components/TypingConsole';
import FormatPage from './components/FormatPage';
import TopPage from './components/TopPage'; // 引入 TopPage 作为首页
import { initDB } from './db'; // 引入初始化函数

initDB().then(() => {
  console.log('Database initialized');
}); // 初始化数据库

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopPage />} /> {/* 将 TopPage 设为首页 */}
        <Route path="/importtext" element={<ImportText />} />
        <Route path="/chapters/:bookId" element={<ChaptersPage />} /> {/* 修改路由配置，接收 bookId */}
        <Route path="/typing-console/:chapterId" element={<TypingConsole />} />
        <Route path="/format" element={<FormatPage />} /> {/* 添加 FormatPage 路由 */}
      </Routes>
    </Router>
  );
}

export default App;