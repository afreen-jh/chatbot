import { useState, useRef } from 'react';

function ChatWindow({ activeChat, messages, onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Helper function to cleanly format bold markdown text, asterisks, and bullet breaks
  const formatMessageText = (rawText) => {
    if (!rawText) return '';

    // Split lines to handle list layouts cleanly
    return rawText.split('\n').map((line, lineIdx) => {
      let cleanLine = line;

      // Convert Markdown list indicators (*) into clean spacing
      const isBullet = cleanLine.trim().startsWith('* ');
      if (isBullet) {
        cleanLine = cleanLine.trim().substring(2);
      }

      // Regex parser to replace **text** with HTML <strong> tags dynamically
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const formattedContent = parts.map((part, index) => {
        if (index % 2 === 1) {
          // Every odd element in the split array was wrapped in **
          const cleanPart = part.replace(/\*\*/g, '');
          return <strong key={index} style={{ color: '#ffffff', fontWeight: '600' }}>{cleanPart}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={lineIdx} className="workspace-bullet-line">
            <span className="bullet-dot">•</span>
            <span className="bullet-text">{formattedContent}</span>
          </div>
        );
      }

      return <p key={lineIdx} className="workspace-paragraph">{formattedContent}</p>;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    onSendMessage(inputText, selectedImage);
    setInputText('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>{activeChat}</h2>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message-row ${msg.isBot ? 'bot-row' : 'user-row'}`}>
            <span className="sender-tag">{msg.isBot ? '🤖 Workspace' : '👤 Request'}</span>
            <div className="message-bubble">
              {msg.image && (
                <img src={msg.image} alt="Workspace Attachment" className="chat-feed-img" />
              )}
              <div className="formatted-workspace-text">
                {formatMessageText(msg.text)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleFormSubmit} className="typing-bar-area">
        {selectedImage && (
          <div className="image-preview-thumbnail-holder">
            <img src={selectedImage} alt="Preview" />
            <button type="button" onClick={() => setSelectedImage(null)} className="remove-preview-btn">X</button>
          </div>
        )}

        <div className="typing-bar-container">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button type="button" onClick={() => fileInputRef.current.click()} className="action-plus-btn">
            +
          </button>
          <input
            type="text"
            className="typing-input"
            placeholder="Ask a question or request code guidelines..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="send-btn">Send</button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;