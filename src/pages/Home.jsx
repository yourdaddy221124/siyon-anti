import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Shield, Heart, Zap, Phone, Star, MapPin, Award } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import './Home.css';

const THERAPISTS = [
    {
        id: 1,
        name: 'Dr. Arjun Sharma',
        photo: '/therapist_arjun.png',
        specialty: 'Anxiety & Depression',
        qualification: 'PhD Clinical Psychology, AIIMS Delhi',
        experience: '14 Years Experience',
        location: 'New Delhi, India',
        phone: '+91 98101 42367',
        languages: 'Hindi, English',
        rating: 4.9,
        reviews: 312,
        badge: 'Top Rated',
    },
    {
        id: 2,
        name: 'Dr. Priya Mehta',
        photo: '/therapist_priya.png',
        specialty: 'Trauma & Relationship Therapy',
        qualification: 'M.Phil Psychiatry, NIMHANS Bangalore',
        experience: '11 Years Experience',
        location: 'Bangalore, India',
        phone: '+91 80459 73821',
        languages: 'Kannada, English, Hindi',
        rating: 4.8,
        reviews: 245,
        badge: 'Most Compassionate',
    },
    {
        id: 3,
        name: 'Dr. Rahul Desai',
        photo: '/therapist_rahul.png',
        specialty: 'OCD & Stress Management',
        qualification: 'MD Psychiatry, KEM Hospital Mumbai',
        experience: '9 Years Experience',
        location: 'Mumbai, India',
        phone: '+91 22678 51094',
        languages: 'Marathi, Hindi, English',
        rating: 4.7,
        reviews: 189,
        badge: 'CBT Expert',
    },
    {
        id: 4,
        name: 'Dr. Kavya Nair',
        photo: '/therapist_kavya.png',
        specialty: 'Youth & Adolescent Therapy',
        qualification: 'MSc Applied Psychology, TISS Mumbai',
        experience: '7 Years Experience',
        location: 'Chennai, India',
        phone: '+91 44923 68175',
        languages: 'Tamil, English, Malayalam',
        rating: 4.9,
        reviews: 203,
        badge: 'Youth Specialist',
    },
];

const REVIEWS = [
    {
        id: 1,
        name: 'Ananya R.',
        city: 'Pune',
        rating: 5,
        text: "Mind Ease helped me through the toughest phase of my life. The AI is genuinely empathetic, and the Gen-Z mode made it feel like talking to a friend who truly gets me!",
        date: 'Feb 2026',
        avatar: 'AR',
        color: '#7c3aed',
    },
    {
        id: 2,
        name: 'Rohan S.',
        city: 'Mumbai',
        rating: 5,
        text: "No cap, the Gen-Z chat mode is bussin. It doesn't feel like a robot at all! I've been consistent with my mental health check-ins for 3 weeks now. Highly recommend fr fr.",
        date: 'Feb 2026',
        avatar: 'RS',
        color: '#0284c7',
    },
    {
        id: 3,
        name: 'Meena K.',
        city: 'Bangalore',
        rating: 5,
        text: "The voice feature is a game changer! I just talk out loud and the AI listens and responds — literally reads its reply back to me. Feels like talking to an actual therapist!",
        date: 'Jan 2026',
        avatar: 'MK',
        color: '#059669',
    },
    {
        id: 4,
        name: 'Arjit T.',
        city: 'Delhi',
        rating: 4,
        text: "Classic mode is professional and calm — exactly what I needed during severe anxiety. The structured conversation helped me organize my thoughts. Very helpful app!",
        date: 'Jan 2026',
        avatar: 'AT',
        color: '#d97706',
    },
    {
        id: 5,
        name: 'Sneha P.',
        city: 'Hyderabad',
        rating: 5,
        text: "The therapist contact section helped me book a session with Dr. Kavya Nair — she's incredible! The AI bridged the gap beautifully between self-help and professional care.",
        date: 'Feb 2026',
        avatar: 'SP',
        color: '#be185d',
    },
    {
        id: 6,
        name: 'Vikram N.',
        city: 'Chennai',
        rating: 4,
        text: "Switching between Classic and Gen-Z mode is brilliant. Classic when I need professional advice, Gen-Z when I want a chill convo. Two apps in one. Absolutely 10/10!",
        date: 'Jan 2026',
        avatar: 'VN',
        color: '#0891b2',
    },
];

function StarRating({ rating }) {
    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map(s => (
                <Star
                    key={s}
                    size={14}
                    className={s <= Math.floor(rating) ? 'star-filled' : 'star-empty'}
                    fill={s <= Math.floor(rating) ? 'currentColor' : 'none'}
                />
            ))}
            <span className="rating-num">{rating}</span>
        </div>
    );
}

function Home() {
    return (
        <div className="home-container">
            {/* Navigation */}
            <nav className="navbar glass-panel">
                <div className="nav-brand">
                    <Sparkles className="brand-icon" />
                    <span>Mind Ease</span>
                </div>
                <div className="nav-links">
                    <ThemeToggle />
                    <a href="#therapists" className="nav-link">Therapists</a>
                    <Link to="/subscription" className="nav-link">Pricing</Link>
                    <Link to="/login" className="nav-link">Sign In</Link>
                    <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="hero-section">
                <div className="hero-content">
                    <div className="badge animate-fade-in">
                        <span className="badge-dot"></span>
                        Your AI Mental Companion
                    </div>
                    <h1 className="hero-title animate-fade-in delay-100">
                        A safe space to <span className="text-gradient">process your thoughts</span>.
                    </h1>
                    <p className="hero-description animate-fade-in delay-200">
                        Mind Ease is an intelligent companion available 24/7. Choose Classic mode for a calm therapeutic session, or Gen-Z mode for a vibe check that hits different. Now with voice chat!
                    </p>
                    <div className="hero-actions animate-fade-in delay-300">
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Start Talking <ArrowRight size={18} className="ml-2" />
                        </Link>
                        <Link to="/subscription" className="btn btn-secondary btn-lg">
                            View Plans
                        </Link>
                    </div>
                </div>

                {/* Features / Visuals */}
                <div className="hero-visuals animate-fade-in delay-300">
                    <div className="glass-panel feature-card card-1">
                        <Heart className="feature-icon" />
                        <h3>No Judgment</h3>
                        <p>Express yourself freely in a completely private environment.</p>
                    </div>
                    <div className="glass-panel feature-card card-2">
                        <Zap className="feature-icon" />
                        <h3>Classic & Gen-Z Mode</h3>
                        <p>Therapist tone or Gen-Z slang — choose your vibe.</p>
                    </div>
                    <div className="glass-panel feature-card card-3">
                        <Shield className="feature-icon" />
                        <h3>Voice & Text Chat</h3>
                        <p>Speak your mind or type — the AI replies both ways.</p>
                    </div>
                </div>
            </main>

            {/* Therapist Directory Section */}
            <section id="therapists" className="therapists-section">
                <div className="section-header">
                    <div className="section-badge">
                        <Award size={16} />
                        Real Professional Help
                    </div>
                    <h2 className="section-title">Connect with <span className="text-gradient">Licensed Indian Therapists</span></h2>
                    <p className="section-subtitle">
                        Our AI helps you reflect — but real healing often takes a human touch. Connect with these certified professionals across India.
                    </p>
                </div>

                <div className="therapists-grid">
                    {THERAPISTS.map(t => (
                        <div key={t.id} className="therapist-card glass-panel">
                            <div className="therapist-badge-pill">{t.badge}</div>
                            <div className="therapist-photo-wrapper">
                                <img src={t.photo} alt={t.name} className="therapist-photo" />
                            </div>
                            <div className="therapist-info">
                                <h3 className="therapist-name">{t.name}</h3>
                                <span className="therapist-specialty">{t.specialty}</span>
                                <StarRating rating={t.rating} />
                                <p className="therapist-detail">🎓 {t.qualification}</p>
                                <p className="therapist-detail">⏱ {t.experience}</p>
                                <p className="therapist-detail"><MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />{t.location}</p>
                                <p className="therapist-detail">🗣 {t.languages}</p>
                                <a href={`tel:${t.phone}`} className="therapist-call-btn">
                                    <Phone size={15} />
                                    {t.phone}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Reviews Section */}
            <section className="reviews-section">
                <div className="section-header">
                    <div className="section-badge">
                        <Star size={16} fill="currentColor" />
                        User Stories
                    </div>
                    <h2 className="section-title">What our <span className="text-gradient">community says</span></h2>
                    <p className="section-subtitle">Real experiences from people across India who found their calm with Mind Ease.</p>
                </div>

                <div className="reviews-grid">
                    {REVIEWS.map(r => (
                        <div key={r.id} className="review-card glass-panel">
                            <div className="review-header">
                                <div className="review-avatar" style={{ background: r.color }}>{r.avatar}</div>
                                <div className="review-meta">
                                    <span className="review-name">{r.name}</span>
                                    <span className="review-city">{r.city} · {r.date}</span>
                                </div>
                                <div className="review-stars">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={12} fill={s <= r.rating ? '#f59e0b' : 'none'} color={s <= r.rating ? '#f59e0b' : '#4b5563'} />
                                    ))}
                                </div>
                            </div>
                            <p className="review-text">"{r.text}"</p>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="footer">
                <p>© {new Date().getFullYear()} Mind Ease. Built with ❤️ for mental wellness in India.</p>
            </footer>
        </div>
    );
}

export default Home;
