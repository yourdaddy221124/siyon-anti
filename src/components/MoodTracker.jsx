import React, { useState } from 'react';
import { Smile, Frown, Meh, Heart } from 'lucide-react';
import './MoodTracker.css';

function MoodTracker({ currentMood, setMood }) {
    const [isOpen, setIsOpen] = useState(false);

    const moods = [
        { label: 'Great', icon: Heart, color: '#34d399' },
        { label: 'Good', icon: Smile, color: '#38bdf8' },
        { label: 'Neutral', icon: Meh, color: '#94a3b8' },
        { label: 'Anxious', icon: Frown, color: '#fb923c' },
        { label: 'Low', icon: Frown, color: '#f43f5e' },
    ];

    const CurrentIcon = moods.find(m => m.label === currentMood)?.icon || Meh;
    const currentColor = moods.find(m => m.label === currentMood)?.color || '#94a3b8';

    return (
        <div className="mood-tracker">
            <button
                className="mood-toggle glass-panel"
                onClick={() => setIsOpen(!isOpen)}
                style={{ '--icon-color': currentColor }}
            >
                <span className="mood-status">How are you?</span>
                <CurrentIcon size={20} className="current-mood-icon" />
            </button>

            {isOpen && (
                <div className="mood-dropdown glass-panel animate-fade-in">
                    <p className="mood-title">Log your mood</p>
                    <div className="mood-grid">
                        {moods.map((mood) => {
                            const Icon = mood.icon;
                            const isSelected = currentMood === mood.label;
                            return (
                                <button
                                    key={mood.label}
                                    className={`mood-option ${isSelected ? 'selected' : ''}`}
                                    onClick={() => {
                                        setMood(mood.label);
                                        setIsOpen(false);
                                    }}
                                    style={{ '--hover-color': mood.color }}
                                    title={mood.label}
                                >
                                    <Icon size={24} color={isSelected ? mood.color : 'inherit'} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MoodTracker;
