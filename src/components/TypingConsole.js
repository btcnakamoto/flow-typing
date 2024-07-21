import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChaptersFromDB } from '../db';
import './TypingConsole.css';

const TypingConsole = () => {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const charactersPerPage = 2000; // 每页字符数

  useEffect(() => {
    const fetchChapter = async () => {
      const chapters = await getChaptersFromDB();
      const selectedChapter = chapters.find(chap => chap.id === parseInt(chapterId, 10));
      if (selectedChapter) {
        setChapter(selectedChapter);
        setTotalPages(Math.ceil(selectedChapter.text.length / charactersPerPage));
      }
      setLoading(false);
    };

    fetchChapter();
  }, [chapterId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!chapter) {
    return <div>Chapter not found</div>;
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const start = (currentPage - 1) * charactersPerPage;
  const end = start + charactersPerPage;
  const currentText = chapter.text.slice(start, end);

  return (
    <div className="typing-console">
      <header className="header">
        <h1>{chapter.title}</h1>
      </header>
      <main className="main-content">
        <p>{currentText}</p>
      </main>
      <footer className="footer">
        {currentPage > 1 && <button onClick={handlePreviousPage}>Previous</button>}
        {currentPage < totalPages && <button onClick={handleNextPage}>Next</button>}
      </footer>
    </div>
  );
};

export default TypingConsole;