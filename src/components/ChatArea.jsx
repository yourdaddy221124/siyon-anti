import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, Mic, MicOff, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import './ChatArea.css';

const CHARACTERS = [
    {
        id: 'yoda',
        name: 'Master Yoda',
        emoji: '🧙‍♂️',
        desc: 'Wise Jedi Master',
        color: '#4ade80',
        greeting: "Mmm. Come to talk, you have. Listen, I will. Troubled your mind is — feel it, I do. Speak freely, young one. Judge you, I shall not. 💚",
        prompt: `You are Master Yoda from Star Wars, acting as an empathetic and wise mental health companion. Speak in Yoda's iconic inverted syntax (object-subject-verb). Use Yoda phrases like "Mmm", "Strong with you, the feelings are", "Fear leads to suffering, yes", "Patient you must be", "Clear your mind must be", "A great burden you carry". Always be compassionate, wise, and supportive. Never break character. Use 💚 green heart emoji occasionally. The user's mood: {mood}.`,
    },
    {
        id: 'hermione',
        name: 'Hermione Granger',
        emoji: '📚',
        desc: 'Brilliant & Caring Friend',
        color: '#c084fc',
        greeting: "Oh, I'm so glad you reached out! You know, it's incredibly brave to talk about how you're feeling. I've read extensively about emotional wellbeing — let's work through this together, shall we? 💜",
        prompt: `You are Hermione Granger from Harry Potter, acting as a warm, intelligent, and caring mental health companion. Be bookish, slightly anxious yourself but very supportive. Reference books, logic, and learning. Use phrases like "I've read about this", "According to...", "Logically speaking", "You're incredibly brave", "Let's think this through". Be kind, direct, and encouraging. Occasionally mention you understand stress (NEWTS!) with empathy. Never break character. Use 💜 occasionally. The user's mood: {mood}.`,
    },
    {
        id: 'marcus',
        name: 'Marcus Aurelius',
        emoji: '⚡',
        desc: 'Stoic Emperor & Philosopher',
        color: '#fbbf24',
        greeting: "Greetings, friend. That you have chosen to reflect upon your inner state is wisdom itself. The mind, disciplined, becomes a fortress. Tell me what weighs upon you — we shall examine it together with reason and equanimity. 🌟",
        prompt: `You are Marcus Aurelius, the Roman Emperor and Stoic philosopher, acting as a wise mental health companion. Speak in a measured, philosophical tone. Reference Stoic principles: control what you can, accept what you cannot; focus on virtue; the present moment is all we have. Use phrases like "You have power over your mind, not outside events", "The obstacle is the way", "Waste no more time arguing", "Look within". Be grounding, calm, and deeply compassionate underneath the stoic exterior. Never break character. Use 🌟 occasionally. The user's mood: {mood}.`,
    },
    {
        id: 'gandalf',
        name: 'Gandalf',
        emoji: '🧙',
        desc: 'The Grey Wizard',
        color: '#94a3b8',
        greeting: "Ah, a wanderer arrives seeking counsel! A wizard is never late, nor is wisdom ever too soon. You have taken the most important step — reaching out. Now then, speak your mind. Even the smallest person can change the course of the future. 🌟",
        prompt: `You are Gandalf from The Lord of the Rings, acting as a warm, wise, and occasionally humorous mental health companion. Speak with gravitas and warmth. Use phrases like "All we have to decide is what to do with the time that is given to us", "Even the wisest cannot see all ends", "You are stronger than you know", "There is always hope", "A wizard's counsel is given freely". Be encouraging but also acknowledge darkness — you've faced the Balrog! Be deeply empathetic. Never break character. The user's mood: {mood}.`,
    },
    {
        id: 'alfred',
        name: 'Alfred Pennyworth',
        emoji: '🎩',
        desc: 'Loyal Butler & Mentor',
        color: '#64748b',
        greeting: "Good evening. I'm delighted you've chosen to speak with me. You know, Master Bruce often found that a quiet conversation over tea helped greatly. Whatever is on your mind, I assure you — you have my complete and undivided attention. 🫖",
        prompt: `You are Alfred Pennyworth, Batman's loyal butler, acting as a sophisticated, warm, and deeply caring mental health companion. Speak in a refined British manner. Be witty but never dismissive. Use phrases like "Might I suggest", "If I may be so bold", "In my experience", "Rather", "Indeed", "You know, even the greatest heroes need support". Be a steadfast, compassionate presence — someone who has seen the worst and still believes in people. Occasionally reference tea. Never break character. The user's mood: {mood}.`,
    },
    {
        id: 'dory',
        name: 'Dory',
        emoji: '🐟',
        desc: 'Optimistic & Bubbly Friend',
        color: '#38bdf8',
        greeting: "Oh hi!! I'm SO happy you're here! Wait — what was I saying? Oh right! Hi!! 🐟 I might forget things sometimes but one thing I never forget is: just keep swimming! Tell me everything — I'm all ears! Well, fins. You know what I mean! 💙",
        prompt: `You are Dory from Finding Nemo, acting as an enthusiastic and surprisingly wise mental health companion. Be upbeat, easily distracted but always return to what matters. Use phrases like "Just keep swimming", "I shall call him Squishy", "I forget things but I never forget what's important — you!", "Ooh look!", then refocus. Despite forgetfulness, be genuinely empathetic and always positive. Occasionally go off on tangents but circle back with warmth and encouragement. Never break character. Use 🐟💙 occasionally. The user's mood: {mood}.`,
    },
];

function ChatArea({ mood, chatMode, character, onCharacterChange }) {
    const rawMessages = useQuery(api.messages.list);
    const sendMessage = useMutation(api.messages.send);

    // Sort messages since Convex might return them in different orders or we want reverse order
    const messages = [...(rawMessages || [])].sort((a, b) => a.timestamp - b.timestamp);

    const currentChar = chatMode === 'character'
        ? CHARACTERS.find(c => c.id === character) || CHARACTERS[0]
        : null;

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

    // Text-to-speech helper
    const speak = (text) => {
        if (!isTtsEnabled || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 0.95;
        window.speechSynthesis.speak(utter);
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
            setInput(event.results[0][0].transcript);
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
        recognition.start();
    };

    const toggleMic = () => {
        if (isListening) recognitionRef.current?.stop();
        else startListening();
    };

    const toggleTts = () => {
        if (isTtsEnabled) window.speechSynthesis?.cancel();
        setIsTtsEnabled(prev => !prev);
    };

    const buildSystemInstruction = () => {
        if (chatMode === 'character' && currentChar) {
            return currentChar.prompt.replace('{mood}', mood || 'Not specified');
        }
        if (chatMode === 'genz') {
            return `You are Mind Ease, an empathetic AI therapist who speaks in authentic Gen-Z language. Use Gen-Z slang naturally. The user's current mood: ${mood || 'Not specified'}.`;
        }
        return `You are Mind Ease, an empathetic and supportive AI therapist. The user's current self-reported mood is: ${mood || 'Not specified'}.`;
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input.trim();
        setInput('');
        setIsTyping(true);

        try {
            await sendMessage({ text: userText, sender: 'user' });

            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const history = messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));
            history.push({ role: 'user', parts: [{ text: userText }] });

            const systemInstruction = buildSystemInstruction();

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: systemInstruction }] },
                    contents: history,
                    generationConfig: {
                        temperature: 0.8,
                        maxOutputTokens: 350,
                    }
                })
            });

            let botText = "";

            if (!response.ok) {
                if (response.status === 429) {
                    console.warn("Gemini Quota Exceeded. Falling back to free secondary API...");
                    const fallbackPrompt = `${systemInstruction}\n\nUser: ${userText}\n\nRespond briefly as your character:`;
                    const fallbackRes = await fetch(`https://text.pollinations.ai/prompt/${encodeURIComponent(fallbackPrompt)}`);

                    if (!fallbackRes.ok) throw new Error("API request failed and Fallback API also failed.");
                    botText = await fallbackRes.text();
                } else {
                    throw new Error(`API request failed with status ${response.status}`);
                }
            } else {
                const data = await response.json();
                botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble understanding right now.";
            }

            await sendMessage({ text: botText, sender: 'bot' });
            speak(botText);

        } catch (error) {
            console.error("Error:", error);
            await sendMessage({ text: `[System]: I encountered an error: ${error.message}`, sender: 'bot' });
        } finally {
            setIsTyping(false);
        }
    };

    const isGenZ = chatMode === 'genz';
    const isCharMode = chatMode === 'character';

    return (
        <div className={`chat-container ${isGenZ ? 'genz-mode' : ''} ${isCharMode ? 'character-mode' : ''}`}>
            <div className="messages-area">
                <div className="welcome-banner animate-fade-in">
                    {isCharMode && currentChar
                        ? <span style={{ color: currentChar.color }}>{currentChar.emoji} Character Mode — chatting as <strong>{currentChar.name}</strong></span>
                        : isGenZ
                            ? '🔥 Gen-Z Mode — no cap, fr fr, vibe detected ✨'
                            : '🔒 Your session is secure and private.'}
                </div>

                {isCharMode && (
                    <div className="char-picker-bar animate-fade-in">
                        <span className="char-picker-label">Choose character:</span>
                        <div className="char-picker-chips">
                            {CHARACTERS.map(char => (
                                <button
                                    key={char.id}
                                    className={`char-chip ${character === char.id ? 'active' : ''}`}
                                    style={character === char.id ? { borderColor: char.color, color: char.color, background: `${char.color}18` } : {}}
                                    onClick={() => onCharacterChange && onCharacterChange(char.id)}
                                    title={char.desc}
                                >
                                    {char.emoji} {char.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`message-wrapper animate-fade-in ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
                    >
                        <div className="avatar" style={
                            isCharMode && currentChar && msg.sender === 'bot'
                                ? { background: `${currentChar.color}22`, color: currentChar.color, border: `1.5px solid ${currentChar.color}55`, fontSize: '18px' }
                                : {}
                        }>
                            {msg.sender === 'user'
                                ? <User size={20} />
                                : isCharMode && currentChar
                                    ? currentChar.emoji
                                    : <Bot size={20} />}
                        </div>
                        <div className="message-content glass-panel" style={
                            isCharMode && currentChar && msg.sender === 'bot'
                                ? { borderLeft: `2px solid ${currentChar.color}88` }
                                : {}
                        }>
                            {isCharMode && currentChar && msg.sender === 'bot' && (
                                <span className="char-name-tag" style={{ color: currentChar.color }}>
                                    {currentChar.emoji} {currentChar.name}
                                </span>
                            )}
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="message-wrapper bot-msg animate-fade-in">
                        <div className="avatar" style={
                            isCharMode && currentChar
                                ? { background: `${currentChar.color}22`, color: currentChar.color, border: `1.5px solid ${currentChar.color}55`, fontSize: '18px' }
                                : {}
                        }>
                            {isCharMode && currentChar ? currentChar.emoji : <Bot size={20} />}
                        </div>
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
                                : isCharMode && currentChar
                                    ? `Talk to ${currentChar.name}... ${currentChar.emoji}`
                                    : isGenZ
                                        ? 'spill the tea bestie... 🍵'
                                        : 'Type your thoughts here...'
                        }
                    />

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
                    {isCharMode && currentChar
                        ? `${currentChar.emoji} ${currentChar.name} is an AI character — not a replacement for professional therapy.`
                        : isGenZ
                            ? '✨ Gen-Z AI bestie — not a replacement for actual therapy ok periodt 💅'
                            : 'Mind Ease is an AI companion, not a replacement for professional therapy.'}
                </p>
            </div>
        </div>
    );
}

export default ChatArea;
