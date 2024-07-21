import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBooksFromDB } from '../db'; // 引入获取数据的函数
import './TopPage.css';

const books = [
  { id: 1, title: '1984', author: 'George Orwell', pages: 346 },
  { id: 2, title: 'Alice in Wonderland', author: 'Lewis Carroll', pages: 115 },
  { id: 3, title: 'Animal Farm', author: 'George Orwell', pages: 102 },
  { id: 4, title: 'Anna Karenina', author: 'Leo Tolstoy', pages: 1416 },
  { id: 5, title: 'Anne of Green Gables', author: 'Lucy Maud Montgomery', pages: 367 },
  { id: 6, title: 'The Art of War', author: 'Sun Tzu', pages: 60 },
  { id: 7, title: 'Botchan', author: 'Natsume Sōseki', pages: 155 },
  { id: 8, title: 'The Call of Cthulhu', author: 'H.P. Lovecraft', pages: 40 },
  { id: 9, title: 'The Call of the Wild', author: 'Jack London', pages: 104 }
];

const TopPage = () => {
  const [activeTab, setActiveTab] = useState('classics');
  const [customBooks, setCustomBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'custom') {
      const fetchCustomBooks = async () => {
        const booksFromDB = await getBooksFromDB();
        console.log('Custom books from IndexedDB:', booksFromDB); // 输出获取的书本列表
        setCustomBooks(booksFromDB);
      };

      fetchCustomBooks();
    }
  }, [activeTab]);

  const handleAddCustomText = () => {
    navigate('/importtext');
  };

  const handleBookClick = (bookId) => {
    navigate(`/chapters/${bookId}`); // 使用 navigate 跳转到 ChaptersPage 页面，并传递书本的 id
  };

  return (
    <div className="top-page">
      <header className="header">
        <h1>TypeLit.io</h1>
        <nav>
          <button>Import</button>
          <button>About</button>
          <button className="icon-button">🚀</button>
        </nav>
      </header>
      <main className="main-content">
        <section className="book-selection">
          <div className="selection-header">
            <h3>Latest Features: Fonts and Themes</h3>
            <div className="selection-controls">
              <div className="tab-container">
                <button 
                  className={`tab ${activeTab === 'classics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('classics')}
                >
                  Classics
                </button>
                <button 
                  className={`tab ${activeTab === 'custom' ? 'active' : ''}`}
                  onClick={() => setActiveTab('custom')}
                >
                  Custom
                </button>
              </div>
              <select>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
          <div className="book-list">
            {activeTab === 'classics' ? (
              // 显示经典书籍列表
              books.map(book => (
                <div key={book.id} className="book-card">
                  <img src="/images/previewbook.jpg" alt={book.title} />
                  <div className="book-info">
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                  </div>
                  <span className="page-count">{book.pages} Pages</span>
                </div>
              ))
            ) : (
              // 显示自定义模式的书籍
              <div>
                {customBooks.length > 0 ? (
                  customBooks.map(book => (
                    <div key={book.id} className="book-card" onClick={() => handleBookClick(book.id)}>
                      <img src="/images/previewbook.jpg" alt={book.title} />
                      <div className="book-info">
                        <h4>{book.title}</h4>
                        <p>{book.author || 'Unknown Author'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="add-custom-book">
                    <button className="add-button" onClick={handleAddCustomText}>+</button>
                    <p>Add custom text</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TopPage;