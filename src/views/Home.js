import React, { useState, useEffect, useRef, useCallback } from 'react';
import TypingLine from '../components/TypingLine';
import ChapterNavigator from '../components/ChapterNavigator';

const Home = ({ chapters }) => {
  const initialText = `本书内容是一个我们称之为“荒原狼”的人留下的自述。他之所以有此雅号是因为他多次自称“荒原狼”。他的文稿是否需要加序，我们可以姑且不论；不过，我觉得需要在荒原狼的自述前稍加几笔，记下我对他的回忆。
  `;

  const [currentChapter] = useState({ text: initialText });
  const [content, setContent] = useState(currentChapter.text.split('\n').slice(0, 20));
  const [userInput, setUserInput] = useState(Array(content.length).fill(''));
  const [timer, setTimer] = useState(300);
  const [intervalId, setIntervalId] = useState(null);
  const [backspaces, setBackspaces] = useState(0);
  const contentRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalId); // 清除定时器
  }, [intervalId]); // 添加 intervalId 作为依赖

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

  const loadMoreContent = useCallback(() => {
    setLoading(true);
    // 模拟加载新内容，这里可以替换为实际的API调用
    const allLines = currentChapter.text.split('\n');
    const newLines = allLines.slice(content.length, content.length + 20);
    setContent(prevContent => [...prevContent, ...newLines]);
    setUserInput(prevInput => [...prevInput, ...Array(newLines.length).fill('')]);
    setLoading(false);
  }, [content.length, currentChapter.text]);

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
