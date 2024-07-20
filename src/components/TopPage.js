import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const TopPage = () => {
  // 简化的图书数据
  const newReleases = [
    { id: 1, title: "起業しよう" },
    { id: 2, title: "夜すべての" },
    { id: 3, title: "下町ロケット" },
    { id: 4, title: "殺人鬼" },
    { id: 5, title: "万博と" }
  ];

  const newManga = [
    { id: 11, title: "ジョジョの奇妙な冒険" },
    { id: 12, title: "鬼滅の刃" },
    { id: 13, title: "進撃の巨人" },
    { id: 14, title: "ワンピース" },
    { id: 15, title: "呪術廻戦" }
  ];

  const limitedTimeOffers = [
    { id: 21, title: "多元宇宙論" },
    { id: 22, title: "主婦の給料" },
    { id: 23, title: "忘却の聖女" },
    { id: 24, title: "真夜中の約束" },
    { id: 25, title: "長女たち" }
  ];

  const BookSection = ({ title, books, backgroundColor }) => (
    <section className="book-section" style={{ backgroundColor }}>
      <h2>{title}</h2>
      <div className="book-list">
        {books.map((book) => (
          <Link to={`/book/${book.id}`} key={book.id} className="book-card">
            <img src="/images/previewbook.jpg" alt={book.title} />
            <h3>{book.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <div className="top-page">
      <aside className="sidebar">
        <h2>电子书店</h2>
        <nav>
          <ul>
            <li><Link to="/">首页</Link></li>
            <li><Link to="/library">我的书库</Link></li>
            <li><Link to="/store">书店</Link></li>
            <li><Link to="/categories">分类</Link></li>
            <li><Link to="/wishlist">愿望清单</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="top-header">
          <div className="search-bar">
            <input type="text" placeholder="搜索书籍、作者或类别" />
            <button>搜索</button>
          </div>
          <div className="user-info">
            <img src="/images/previewbook.jpg" alt="用户头像" />
            <span>欢迎, 用户名</span>
          </div>
        </header>
        <BookSection title="推荐新书" books={newReleases} backgroundColor="#1c1c1e" />
        <BookSection title="热门漫画" books={newManga} backgroundColor="#3c1518" />
        <BookSection title="限时优惠" books={limitedTimeOffers} backgroundColor="#1c1c1e" />
        <section className="featured-book">
          <h2>本周特色</h2>
          <div className="featured-book-content">
            <img src="/images/previewbook.jpg" alt="特色书籍" />
            <div className="featured-book-info">
              <h3>特色书籍标题</h3>
              <p>作者: 某某著</p>
              <p>简介: 这是一本非常精彩的书,讲述了...(书籍简介)</p>
              <button>立即阅读</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TopPage;