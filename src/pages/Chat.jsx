import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import MoodTracker from '../components/MoodTracker';
import './Chat.css';

function Chat() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentMood, setCurrentMood] = useState('Neutral');

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="chat-layout">
            {/* Sidebar Overlay for Mobile */}
            {!sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(true)}
                ></div>
            )}

            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            <main className="chat-main-content">
                <header className="chat-header glass-panel">
                    <button className="btn-icon" onClick={toggleSidebar}>
                        {/* Hamburger icon for mobile / toggling */}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <h2>Mind Ease Assistant</h2>
                    <div className="header-actions">
                        <MoodTracker currentMood={currentMood} setMood={setCurrentMood} />
                    </div>
                </header>

                <div className="chat-scroll-area">
                    <ChatArea mood={currentMood} />
                </div>
            </main>
        </div>
    );
}

export default Chat;
