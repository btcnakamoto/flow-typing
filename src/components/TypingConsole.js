import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChaptersFromDB } from '../db';
import './TypingConsole.css';

const TypingConsole = () => {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchChapter = async () => {
      const chapters = await getChaptersFromDB();
      const selectedChapter = chapters.find(ch => ch.id === Number(chapterId));
      setChapter(selectedChapter);
    };
    fetchChapter();
  }, [chapterId]);

  const chunkText = (text, chunkSize) => {
    const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
    return text.match(regex);
  };

  const textByPages = chapter ? chunkText(chapter.text, 2000) : [];

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < textByPages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="typing-console">
      <header className="header">
        <nav>
          <span>Books / Chapters / Typing Console</span>
        </nav>
        <div className="chapter-info">
          <span>{chapter ? chapter.title : 'Loading...'}</span>
          <span>Page {currentPage}/{textByPages.length}</span>
          <span>— WPM</span>
          <span>— ACC</span>
          <button className="profile-button">👤</button>
          <button className="refresh-button">🔄</button>
          <button className="settings-button">⚙️</button>
        </div>
      </header>
      <main className="main-content">
        <div className="text-display">
          {textByPages[currentPage - 1] && textByPages[currentPage - 1].split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <div className="pagination-controls">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>{'<'}</button>
          <button onClick={handleNextPage} disabled={currentPage === textByPages.length}>{'>'}</button>
        </div>
      </main>
    </div>
  );
};

export default TypingConsole;