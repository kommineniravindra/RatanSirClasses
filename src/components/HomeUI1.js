import React, { useState, useEffect } from 'react';
import '../css/HomeUI1.css';
import { FaGraduationCap, FaAngleRight, FaReact, FaHtml5, FaCss3Alt, FaJs, FaPython, FaJava, FaDocker, FaAws, FaNodeJs } from 'react-icons/fa'; 
import { SiMysql, SiSpringboot } from 'react-icons/si';

function HomeUI1() {
    const tickerItems = [
        { name: 'HTML5', icon: FaHtml5, color: '#E34F26' },
        { name: 'CSS3', icon: FaCss3Alt, color: '#1572B6' },
        { name: 'JavaScript', icon: FaJs, color: '#F7DF1E' },
        { name: 'React', icon: FaReact, color: '#61DAFB' },
        { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
        { name: 'Python', icon: FaPython, color: '#3776AB' },
        { name: 'Java', icon: FaJava, color: '#007396' },
        { name: 'SQL', icon: SiMysql, color: '#4479A1' },
        { name: 'AWS', icon: FaAws, color: '#FF9900' },
        { name: 'Docker', icon: FaDocker, color: '#2496ED' },
        { name: 'Spring Boot', icon: SiSpringboot, color: '#6DB33F' }
    ];

    const icons = [
        { component: FaReact, color: '#61DAFB' },
        { component: FaHtml5, color: '#E34F26' },
        { component: FaCss3Alt, color: '#1572B6' },
        { component: FaJs, color: '#F7DF1E' },
        { component: FaPython, color: '#3776AB' },
        { component: FaJava, color: '#007396' },
        { component: FaDocker, color: '#2496ED' },
        { component: FaAws, color: '#FF9900' },
        { component: SiMysql, color: '#4479A1' },
        { component: SiSpringboot, color: '#6DB33F' }
    ];

    const [currentIconIndex, setCurrentIconIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [icons.length]);

    const CurrentIcon = icons[currentIconIndex].component;

    return (
        <div className="landing-wrapper">
            <header className="hero-section-glassy">
                <div className="hero-content-glassy">
                    <h1 className="hero-title-glassy">
                        Future of Tech<span className="text-light-blue-accent">Begins Here</span>
                    </h1>
                    
                    <p className="hero-subtitle-glassy">
                        Unlock structured learning paths, hands-on projects, and personalized support that take your skills to the next level.                    </p>
                    <div className="hero-buttons-glassy">
                        <button className="primary-btn-domed">
                            <FaGraduationCap /> Enroll Now
                        </button>
                        <button className="secondary-btn-soft">
                            View Syllabus <FaAngleRight />
                        </button>
                    </div>
                </div>
                
                <div className="hero-graphic-sphere">
                    <CurrentIcon 
                        className="sphere-icon fade-transition" 
                        style={{ color: icons[currentIconIndex].color }} 
                    />
                </div>
            </header>

            <div className="ticker-wrap">
                <div className="ticker-track">
                    {[...tickerItems, ...tickerItems].map((item, index) => (
                        <div className="ticker-item" key={index}>
                            <item.icon style={{ color: item.color, fontSize: '1.5rem' }} />
                            <span>{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomeUI1;
