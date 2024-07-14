import React from 'react';
import { Link } from 'react-router-dom';

const ChapterNavigator = ({ chapters }) => {
  return (
    <nav className="chapter-nav">
      {chapters.map((chapter, index) => (
        <Link key={index} to={`/chapter/${index}`}>{chapter.title}</Link>
      ))}
    </nav>
  );
};

export default ChapterNavigator;
