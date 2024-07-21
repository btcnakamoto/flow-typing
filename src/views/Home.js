import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import TypingLine from '../components/TypingLine';
import ChapterNavigator from '../components/ChapterNavigator';

const Home = ({ chapters }) => {
  const LINE_LENGTH = 57; // 统一定义每行字符数
  const [currentArticle, setCurrentArticle] = useState(null);
  const [content, setContent] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [timer, setTimer] = useState(300);
  const [intervalId, setIntervalId] = useState(null);
  const [backspaces, setBackspaces] = useState(0);
  const contentRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [articleId, setArticleId] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  useEffect(() => {
    if (content.length > 0) {
      startTimer();
    }
    return () => clearInterval(intervalId);
  }, [content, intervalId]);

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/article/random`);
      const article = response.data;
      setCurrentArticle(article);
      setArticleId(article.id);
      const initialContent = splitContent(article.content.slice(0, 1000), LINE_LENGTH);
      setContent(initialContent);
      setUserInput(Array(initialContent.length).fill(''));
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  };

  const splitContent = (content, length) => {
    const regex = new RegExp(`.{1,${length}}`, 'g');
    return content.match(regex) || [];
  };

  const startTimer = () => {
    const id = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 1) {
          clearInterval(id);
          alert('时间到！');
        }
        return prevTimer - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  const pause = () => {
    clearInterval(intervalId);
  };

  const stop = () => {
    clearInterval(intervalId);
    alert('练习已结束！');
  };

  const checkInput = (index, value, event) => {
    setUserInput(prevInput => {
      const newInput = [...prevInput];
      newInput[index] = value;
      return newInput;
    });
    if (event && event.inputType === 'deleteContentBackward') {
      setBackspaces(prevBackspaces => prevBackspaces + 1);
    }
  };

  const calculateWPM = () => {
    const wordsTyped = userInput.reduce((acc, line) => acc + line.trim().split(/\s+/).length, 0);
    const minutes = (300 - timer) / 60;
    return Math.round(wordsTyped / minutes) || 0;
  };

  const calculateAccuracy = () => {
    let totalChars = 0;
    let correctChars = 0;

    content.forEach((line, index) => {
      const inputText = userInput[index] || '';
      totalChars += inputText.length;
      for (let i = 0; i < inputText.length; i++) {
        if (inputText[i] === line[i]) {
          correctChars++;
        }
      }
    });

    return totalChars ? Math.round((correctChars / totalChars) * 100) : 0;
  };

  const loadMoreContent = useCallback(async () => {
    if (!currentArticle || loading) return;

    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/article/${articleId}/content`, {
        params: { start: content.length * LINE_LENGTH, length: 1000 }
      });
      const newContent = splitContent(response.data.content, LINE_LENGTH);
      setContent(prevContent => [...prevContent, ...newContent]);
      setUserInput(prevInput => [...prevInput, ...Array(newContent.length).fill('')]);
    } catch (error) {
      console.error('Error loading more content:', error);
    }
    setLoading(false);
  }, [currentArticle, content.length, loading, articleId]);

  const handleScroll = useCallback(() => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10 && !loading) {
        loadMoreContent();
      }
    }
  }, [loading, loadMoreContent]);

  useEffect(() => {
    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      return () => {
        currentRef.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  const timerText = `${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`;

  const totalTyped = userInput.reduce((acc, line) => acc + line.length, 0);

  const errors = userInput.reduce((acc, input, index) => {
    let lineErrors = 0;
    for (let i = 0; input && i < input.length; i++) {
      if (input[i] !== content[index][i]) {
        lineErrors++;
      }
    }
    return acc + lineErrors;
  }, 0);

  return (
    <div className="container">
      <ChapterNavigator chapters={chapters} />
      {currentArticle && (
        <div>
          <h2>{currentArticle.title}</h2>
          <p>难度: {currentArticle.difficulty_level}</p>
          <p>语言: {currentArticle.language}</p>
          <p>单词数: {currentArticle.word_count}</p>
        </div>
      )}
      <div className="content" ref={contentRef}>
        {content.map((line, index) => (
          <div key={index} className="text-section">
            <TypingLine line={line} input={userInput[index]} onChange={(value, event) => checkInput(index, value, event)} />
          </div>
        ))}
      </div>
      <div className="status-panel">
        <div>倒计时: <span>{timerText}</span></div>
        <div>速度: <span>{calculateWPM()} WPM</span></div>
        <div>正确率: <span>{calculateAccuracy()}%</span></div>
        <div>错误: <span>{errors} 字</span></div>
        <div>总字数: <span>{totalTyped} 字</span></div>
        <div>退格: <span>{backspaces} 次</span></div>
        <div>
          <button onClick={pause}>暂停</button>
          <button onClick={stop}>退出</button>
        </div>
      </div>
    </div>
  );
};

export default Home;