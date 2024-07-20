import React from 'react';

const TypingLine = ({ line, input, onChange }) => {
  const highlightedText = () => {
    let displayHTML = '';

    for (let i = 0; i < line.length; i++) {
      if (i < input.length) {
        if (input[i] === line[i]) {
          displayHTML += `<span class="correct">${line[i]}</span>`;
        } else {
          displayHTML += `<span class="incorrect">${line[i]}</span>`;
        }
      } else {
        displayHTML += line[i];
      }
    }

    return { __html: displayHTML };
  };

  return (
    <div className="typing-line">
      <div className="text-line" dangerouslySetInnerHTML={highlightedText()}></div>
      <input
        type="text"
        className="input-line"
        value={input}
        onChange={e => onChange(e.target.value, e)}
      />
    </div>
  );
};

export default TypingLine;