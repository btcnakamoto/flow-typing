import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveBookToDB, saveChaptersToDB, clearDB } from '../db';
import './ImportText.css';

const ImportText = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    console.log('Selected file:', selectedFile); // 打印所选文件信息
  };

  const handleFileUpload = async () => {
    if (!file) return;
    console.log('File selected, starting upload process'); // 添加日志

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      console.log('File read successfully:', content.substring(0, 100)); // 添加日志，显示文件内容的前100个字符

      const chapters = parseFileContent(content, file.type);
      console.log('Parsed chapters:', chapters); // 添加日志，显示解析后的章节信息

      const book = {
        title: bookTitle,
        author: authorName,
      };
      console.log('Book info:', book); // 添加日志，显示书本信息

      await clearDB();
      console.log('Database cleared'); // 添加日志

      await saveBookToDB(book);
      console.log('Book saved to IndexedDB'); // 添加日志

      await saveChaptersToDB(chapters);
      console.log('Chapters saved to IndexedDB'); // 添加日志

      console.log('Book and chapters saved to IndexedDB:', book, chapters); // 打印保存到 IndexedDB 的书籍和章节信息
      navigate('/chapters'); // 在上传文件后导航到 ChaptersPage 页面
    };

    reader.onerror = (err) => {
      console.error('Error reading file:', err); // 添加错误日志
    };

    reader.readAsText(file);
    console.log('File reading initiated'); // 添加日志
  };

  const parseFileContent = (content, fileType) => {
    const chapterRegex = /(Chapter \d+|第[\d一二三四五六七八九十]+章)/g;
    const splits = content.split(chapterRegex);

    let chapters = [];
    for (let i = 1; i < splits.length; i += 2) {
      chapters.push({
        id: (i + 1) / 2,
        title: splits[i],
        text: splits[i + 1],
        pages: Math.ceil(splits[i + 1].length / 2000), // 假设每页2000字符
      });
    }
    return chapters;
  };

  return (
    <div className="import-text">
      <header className="header">
        <h1>TypeLit.io</h1>
        <nav>
          <button>Import</button>
          <button>About</button>
          <button className="profile-button">👤 Profile</button>
        </nav>
      </header>
      <main className="main-content">
        <section className="import-section">
          <h2>Import an Ebook or Text File</h2>
          <div>
            <input
              type="text"
              placeholder="Book Title"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Author Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
          </div>
          <div className="file-drop" onClick={() => document.getElementById('fileInput').click()}>
            <input id="fileInput" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
            <p>Click or drag n' drop a file here</p>
            <p>EPUB, PDF, TXT, and TYPELIT files accepted</p>
            <p>Max Size: 5MB</p>
          </div>
          <button onClick={handleFileUpload}>Upload</button>
          <p className="or-divider">OR</p>
          <div className="text-paste">
            <h3>Paste Some Text</h3>
            <textarea placeholder="Text Here" maxLength="50000"></textarea>
            <div className="textarea-footer">
              <button className="how-to-button">HOW-TO</button>
              <button className="quick-convert-button">QUICK CONVERT</button>
              <span className="character-count">0 / 50000</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ImportText;