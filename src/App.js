import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopPage from './components/TopPage';
import ImportText from './components/ImportText'; // 确保你已经创建了这个组件
import FormatPage from './components/FormatPage'; // 引入新创建的 FormatPage 组件
import ChaptersPage from './components/ChaptersPage'; // 引入新创建的 ChaptersPage 组件
import TypingConsole from './components/TypingConsole'; // 引入新创建的 TypingConsole 组件


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/importtext" element={<ImportText />} />
        <Route path="/format" element={<FormatPage />} />
        <Route path="/chapters" element={<ChaptersPage />} /> {/* 新增 ChaptersPage 路由 */}
        <Route path="/typing-console/:chapterId" element={<TypingConsole />} />
        {/* 你可以在这里添加更多的路由 */}
      </Routes>
    </Router>
  );
};

export default App;