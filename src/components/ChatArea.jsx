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

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input.trim();
        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: userText,
            timestamp: new Date().toISOString()
        };

        const currentMessages = [...messages, userMsg];
        setMessages(currentMessages);
        setInput('');
        setIsTyping(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey || apiKey === 'your_gemini_api_key_here') {
                throw new Error("Missing Gemini API Key. Please get your API key from https://aistudio.google.com/ and add it to .env.local as VITE_GEMINI_API_KEY.");
            }

            // Convert chat history to Gemini format
            const history = currentMessages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            const systemInstruction = `You are Mind Ease, an empathetic and supportive AI therapist. Listen without judgment, ask guiding questions to help the user reflect, and validate their feelings. Keep responses concise and conversational. The user's current self-reported mood is: ${mood || 'Not specified'}.`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: systemInstruction }]
                    },
                    contents: history,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 250,
                    }
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error?.message || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble understanding right now. Can you try again?";

            const botMsg = {
                id: Date.now() + 1,
                sender: 'bot',
                text: botText,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Gemini API Error:", error);
            const errorMsg = {
                id: Date.now() + 1,
                sender: 'bot',
                text: `[System]: I encountered an error: ${error.message}`,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
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
