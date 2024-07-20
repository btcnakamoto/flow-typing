import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import TypingLine from '../components/TypingLine';
import ChapterNavigator from '../components/ChapterNavigator';

const Home = ({ chapters }) => {
  const [currentArticle, setCurrentArticle] = useState(null);
  const [content, setContent] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [timer, setTimer] = useState(300);
  const [intervalId, setIntervalId] = useState(null);
  const [backspaces, setBackspaces] = useState(0);
  const contentRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const length = 1000; // 每次加载1000个字符

  useEffect(() => {
    fetchArticle(0);
  }, []);

  const startTimer = useCallback(() => {
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
  }, []);

  useEffect(() => {
    if (content.length > 0) {
      startTimer();
    }
    return () => clearInterval(intervalId);
  }, [content, startTimer]);

  const fetchArticle = async (start) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/article/1/content`, {
        params: { start, length },
      });

      const content = response.data.content;

      setCurrentArticle(response.data);
      setContent(prevContent => [...prevContent, ...content.split('\n')]);
      setUserInput(prevInput => [...prevInput, ...Array(content.length).fill('')]);
      setHasMore(response.data.has_more);
    } catch (error) {
      console.error('Error fetching article:', error);
    }
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

  const loadMoreContent = useCallback(() => {
    if (!hasMore || loading) return;
    setLoading(true);
    setStart(prevStart => prevStart + length);
    fetchArticle(start + length);
    setLoading(false);
  }, [hasMore, loading, start, length]);

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