import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import './ChatArea.css';

function ChatArea({ mood }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: "Hi there. I'm Mind Ease. I'm here to listen, completely judgment-free. How are things feeling right now?",
            timestamp: new Date().toISOString()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: input.trim(),
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Mock bot response based on mood
        setTimeout(() => {
            let botText = "I hear you. Tell me more about that.";
            if (mood === 'Anxious') botText = "It sounds like you're carrying a lot of weight right now. Let's take a deep breath. What's the main thing causing this anxiety?";
            if (mood === 'Low') botText = "I'm sorry you're feeling low. It's okay to feel this way. Be gentle with yourself today. Do you want to unpack it, or just distraction?";
            if (mood === 'Great') botText = "That's wonderful to hear! It's always good to acknowledge the positive days. What's making today great?";

            const botMsg = {
                id: Date.now() + 1,
                sender: 'bot',
                text: botText,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="chat-container">
            <div className="messages-area">
                <div className="welcome-banner animate-fade-in">
                    <p>Your session is secure and private.</p>
                </div>

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`message-wrapper animate-fade-in ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
                    >
                        <div className="avatar">
                            {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>
                        <div className="message-content glass-panel">
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="message-wrapper bot-msg animate-fade-in">
                        <div className="avatar">
                            <Bot size={20} />
                        </div>
                        <div className="message-content glass-panel typing-indicator">
                            <Loader className="spin" size={20} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area-wrapper glass-panel">
                <form onSubmit={handleSend} className="input-form">
                    <input
                        type="text"
                        className="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your thoughts here..."
                    />
                    <button
                        type="submit"
                        className="send-btn"
                        disabled={!input.trim()}
                    >
                        <Send size={20} />
                    </button>
                </form>
                <p className="disclaimer">Mind Ease is an AI companion, not a replacement for professional therapy.</p>
            </div>
        </div>
    );
}

export default ChatArea;
