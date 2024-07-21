import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveChaptersToDB, clearDB } from '../db';
import './ImportText.css';

const ImportText = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    handleFileUpload(selectedFile);
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      const chapters = parseFileContent(content, file.type);
      await clearDB();
      await saveChaptersToDB(chapters);
      console.log('Chapters saved to IndexedDB:', chapters); // 打印确认信息
      navigate('/chapters');
    };
    reader.readAsText(file);
  };

  const parseFileContent = (content, fileType) => {
    const chapterRegex = /Chapter \d+/g;
    const chapters = content.split(chapterRegex).map((text, index) => ({
      id: index + 1,
      title: `Chapter ${index + 1}`,
      text,
      pages: Math.ceil(text.length / 2000), // 假设每页2000字符
    }));
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
          <div className="file-drop" onClick={() => document.getElementById('fileInput').click()}>
            <input id="fileInput" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
            <p>Click or drag n' drop a file here</p>
            <p>EPUB, PDF, TXT, and TYPELIT files accepted</p>
            <p>Max Size: 5MB</p>
          </div>
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