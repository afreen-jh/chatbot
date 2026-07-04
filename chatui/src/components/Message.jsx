function Message({ text, isBot }) {
  return (
    <div className={`message-row ${isBot ? 'bot-row' : 'user-row'}`}>
      <div className={`message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}>
        <span className="sender-tag">{isBot ? '🤖 AI' : '👤 You'}</span>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Message;