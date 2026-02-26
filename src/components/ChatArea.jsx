import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import './ChatArea.css';

function ChatArea({ mood, chatMode }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: chatMode === 'genz'
                ? "Heyyy bestie 👋 I'm Mind Ease, no cap your safe space fr fr. What's the vibe rn? How you been feeling lowkey? 💙"
                : "Hi there. I'm Mind Ease. I'm here to listen, completely judgment-free. How are things feeling right now?",
            timestamp: new Date().toISOString()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isTtsEnabled, setIsTtsEnabled] = useState(true);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Update greeting when mode changes
    useEffect(() => {
        setMessages([{
            id: 1,
            sender: 'bot',
            text: chatMode === 'genz'
                ? "Heyyy bestie 👋 I'm Mind Ease, no cap your safe space fr fr. What's the vibe rn? How you been feeling lowkey? 💙"
                : "Hi there. I'm Mind Ease. I'm here to listen, completely judgment-free. How are things feeling right now?",
            timestamp: new Date().toISOString()
        }]);
    }, [chatMode]);

    // Text-to-speech helper
    const speak = (text) => {
        if (!isTtsEnabled || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 0.95;
        utter.pitch = 1;
        utter.volume = 1;
        // Pick a nice voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.lang.startsWith('en'));
        if (preferred) utter.voice = preferred;
        window.speechSynthesis.speak(utter);
    };

    // Speech-to-text
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
        recognition.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };

    const toggleMic = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const toggleTts = () => {
        if (isTtsEnabled) {
            window.speechSynthesis?.cancel();
        }
        setIsTtsEnabled(prev => !prev);
    };

    const buildSystemInstruction = () => {
        if (chatMode === 'genz') {
            return `You are Mind Ease, an empathetic AI therapist who speaks in authentic Gen-Z language. Use Gen-Z slang naturally: "no cap", "fr fr", "lowkey", "highkey", "slay", "bussin", "vibe check", "it's giving", "on god", "periodt", "hits different", "I - ", "bestie", "oof", "valid", "understood the assignment", "rent free", "that's wild", "not gonna lie ngl", "that's a lot", "big yikes", "main character energy", "real talk", "sheesh", "ok but fr", "that's rough bestie", "we don't talk about that". Be warm, supportive, and deeply empathetic but still in Gen-Z speak. Short punchy sentences. Use emojis naturally. The user's current mood: ${mood || 'Not specified'}.`;
        }
        return `You are Mind Ease, an empathetic and supportive AI therapist. Listen without judgment, ask guiding questions to help the user reflect, and validate their feelings. Keep responses concise and conversational. The user's current self-reported mood is: ${mood || 'Not specified'}.`;
    };

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
                throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env.local file.");
            }

            const history = currentMessages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            const systemInstruction = buildSystemInstruction();

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: systemInstruction }] },
                    contents: history,
                    generationConfig: {
                        temperature: chatMode === 'genz' ? 0.9 : 0.7,
                        maxOutputTokens: 300,
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
            speak(botText);

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

    const isGenZ = chatMode === 'genz';

    return (
        <div className={`chat-container ${isGenZ ? 'genz-mode' : ''}`}>
            <div className="messages-area">
                <div className="welcome-banner animate-fade-in">
                    {isGenZ
                        ? '🔥 Gen-Z Mode — no cap, fr fr, vibe detected ✨'
                        : '🔒 Your session is secure and private.'}
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
                        <div className="avatar"><Bot size={20} /></div>
                        <div className="message-content glass-panel typing-indicator">
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area-wrapper glass-panel">
                <form onSubmit={handleSend} className="input-form">
                    {/* Mic Button */}
                    <button
                        type="button"
                        className={`mic-btn ${isListening ? 'listening' : ''}`}
                        onClick={toggleMic}
                        title={isListening ? 'Stop listening' : 'Voice input'}
                    >
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                        {isListening && <span className="mic-pulse"></span>}
                    </button>

                    <input
                        type="text"
                        className="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                            isListening
                                ? '🎙 Listening...'
                                : isGenZ
                                    ? 'spill the tea bestie... 🍵'
                                    : 'Type your thoughts here...'
                        }
                    />

                    {/* TTS Toggle */}
                    <button
                        type="button"
                        className={`tts-btn ${isTtsEnabled ? 'active' : ''}`}
                        onClick={toggleTts}
                        title={isTtsEnabled ? 'Mute voice' : 'Enable voice'}
                    >
                        {isTtsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>

                    <button
                        type="submit"
                        className="send-btn"
                        disabled={!input.trim()}
                    >
                        <Send size={20} />
                    </button>
                </form>
                <p className="disclaimer">
                    {isGenZ
                        ? '✨ Gen-Z AI bestie — not a replacement for actual therapy ok periodt 💅'
                        : 'Mind Ease is an AI companion, not a replacement for professional therapy.'}
                </p>
            </div>
        </div>
    );
}

export default ChatArea;
