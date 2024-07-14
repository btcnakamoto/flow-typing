import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TypingLine from '../components/TypingLine';
import ChapterNavigator from '../components/ChapterNavigator';

const Home = ({ chapters }) => {
  const { chapterId } = useParams();
  const currentChapter = chapters[chapterId] || chapters[0];
  const lines = currentChapter.text.split('\n'); // 确保文本按行分割

  const [userInput, setUserInput] = useState(Array(lines.length).fill(''));
  const [timer, setTimer] = useState(300);
  const [intervalId, setIntervalId] = useState(null);
  const [backspaces, setBackspaces] = useState(0);

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalId); // 清除定时器
  }, []); // 空数组作为依赖意味着只在组件挂载和卸载时执行

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

    lines.forEach((line, index) => {
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

  const timerText = `${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`;

  const totalTyped = userInput.reduce((acc, line) => acc + line.length, 0);

  const errors = userInput.reduce((acc, input, index) => {
    let lineErrors = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== lines[index][i]) {
        lineErrors++;
      }
    }
    return acc + lineErrors;
  }, 0);

  return (
    <div className="container">
      <ChapterNavigator chapters={chapters} />
      {lines.map((line, index) => (
        <div key={index} className="text-section">
          <TypingLine line={line} input={userInput[index]} onChange={(value, event) => checkInput(index, value, event)} />
        </div>
      ))}
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
