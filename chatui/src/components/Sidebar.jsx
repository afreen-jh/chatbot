import React from 'react';

function Sidebar({ chats, activeChat, setActiveChat, onAddNewChat }) {
  return (
    <div className="app-sidebar">
      {/* Brand Workspace Header */}
      <div className="sidebar-brand">
        <div className="brand-dot"></div>
        <span className="brand-name">CyberChat</span>
      </div>

      {/* Action Control Button */}
      <button className="create-space-btn" onClick={onAddNewChat}>
        <span className="btn-plus-icon">+</span> New Space
      </button>

      {/* Navigation Space List Container */}
      <div className="workspace-history">
        <h3 className="history-title">Recent Workspaces</h3>
        <div className="history-scroll-container">
          {chats.map((title, index) => {
            const isActive = activeChat === title;
            return (
              <div
                key={index}
                className={`workspace-row-item ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveChat(title)}
              >
                <div className="row-item-status-indicator"></div>
                <span className="row-item-text">{title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;