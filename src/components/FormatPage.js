import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChaptersFromDB } from '../db';
import './ChaptersPage.css';

const ChaptersPage = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      const chaptersFromDB = await getChaptersFromDB();
      setChapters(chaptersFromDB);
    };
    fetchChapters();
  }, []);

  const handleChapterClick = (chapterId) => {
    navigate(`/typing-console/${chapterId}`);
  };

  return (
    <div className="chapters-page">
      <header className="header">
        <h1>TypeLit.io</h1>
        <nav>
          <button className="back-button">Back</button>
          <span>Books / Chapters</span>
          <div className="right-buttons">
            <button>Import</button>
            <button>About</button>
            <button className="profile-button">👤 Profile</button>
          </div>
        </nav>
      </header>
      <main className="main-content">
        <section className="book-info">
          <img src="/images/previewbook.jpg" alt="Book Cover" className="book-cover" />
          <div className="book-details">
            <h2>Book Title</h2>
            <p>Author</p>
            <div className="book-stats">
              <p>{chapters.length} Chapters</p>
              <p>{chapters.reduce((acc, chapter) => acc + chapter.pages, 0)} Pages</p>
            </div>
          </div>
        </section>
        <section className="chapter-list">
          {chapters.map(chapter => (
            <div key={chapter.id} className="chapter-item" onClick={() => handleChapterClick(chapter.id)}>
              <span>{chapter.title}</span>
              <span className="page-count">{chapter.pages} Pages</span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ChaptersPage;