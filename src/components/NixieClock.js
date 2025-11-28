import React, { useState, useEffect, useRef } from 'react';
 import '../css/NixieClock.css';

const NixieClock = () => {
    // State to manage the 'off' class for power toggle
    const [isOff, setIsOff] = useState(true);

    // State to hold the current time/date string
    const [displayStr, setDisplayStr] = useState('');

    // Refs for the character display elements
    const charRefs = useRef([]);

    // Function to update the time and date display string
    const updateTimeAndDate = () => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const amPm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        if (hours > 12) {
            hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }

        // Format time string (2 chars: H, M1, M2)
        let timeStr = hours.toString().padStart(2, '0') + minutes;
        if (timeStr.startsWith('0')) {
            timeStr = ' ' + timeStr.slice(1);
        }

        // Format date string (M1, M2, D1, D2, Y1, Y2)
        let month = (now.getMonth() + 1).toString().padStart(2, '0');
        let day = now.getDate().toString().padStart(2, '0');
        const year = now.getFullYear().toString().slice(-2);
        
        if (month.startsWith('0')) {
            month = ' ' + month.slice(1);
        }
        if (day.startsWith('0')) {
            day = ' ' + day.slice(1);
        }

        // Combine all parts: HHMM + AMPM + MDDYY (12 characters total)
        // Note: The original JS logic only used 12 characters, mapping to char01-char112
        const fullDisplayStr = timeStr + amPm + month + day + year;
        
        // Truncate or adjust to fit the 12 expected display characters
        const finalDisplayStr = fullDisplayStr.slice(0, 12);
        
        setDisplayStr(finalDisplayStr);
    };

    // Effect for initial load and setting up the interval
    useEffect(() => {
        updateTimeAndDate(); // Initial call
        
        // Set up interval to update every minute (60000ms)
        const intervalId = setInterval(updateTimeAndDate, 60000);

        // Cleanup function
        return () => clearInterval(intervalId);
    }, []);

    // Effect to update the DOM when displayStr changes
    useEffect(() => {
        // Update the content of the referenced div elements
        displayStr.split('').forEach((char, i) => {
            const char1Ref = charRefs.current[i * 2];
            const char2Ref = charRefs.current[i * 2 + 1];
            
            if (char1Ref) char1Ref.textContent = char;
            if (char2Ref) char2Ref.textContent = char;
        });
    }, [displayStr]);

    // Helper to render a single column (Nixie tube digits)
    const renderCol = (index) => (
        <div className="col">
            {/* The '8' is the ghosted placeholder */}
            <div>8</div>
            {/* char1 - Ref for the glow effect */}
            <div id={`char${index}1`} ref={el => charRefs.current[index * 2] = el}>
                {displayStr[index * 2]} 
            </div>
            {/* char2 - Ref for the main text/shadow */}
            <div id={`char${index}2`} ref={el => charRefs.current[index * 2 + 1] = el}>
                {displayStr[index * 2]}
            </div>
        </div>
    );
    
    // Toggle function for the button
    const toggleClock = () => setIsOff(prev => !prev);


    return (
       <>
        <div className='container'> 
            <svg id="noise-svg">
                <filter id='noiseFilter'>
                    <feTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch' />
                </filter>
                <rect id="noise-rect" filter='url(#noiseFilter)' />
            </svg>
            <div className={`clock ${isOff ? 'off' : ''}`}>
                <div className="shadow"></div>
        
                <div className="base-container"><div className="base"><div></div></div></div>
                <div className="small-outer-pipe">
                    <div className="small-inner-pipe"></div>
                </div>
                <div className="outer-pipe">
                    <div className="inner-pipe"></div>
                </div>
                <div className="pipe-accents">
                    <div className="top-tube"></div>
                    <div className="tube-holders">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className="top"></div>
                    <div className="topinset"></div>
                    <div className="left"><div></div><div></div><div></div></div>
                    <div className="right"><div></div><div></div><div></div></div>
                    <div className="bottom-left"></div>
                    <div className="bottom-right"></div>
                </div>
        
                <div className="display">
                    {/* Time (HH:MM) - Using indices 0, 1, 2, 3 for H1, H2, M1, M2 */}
                    <div className="row">
                        {renderCol(0)}
                        {renderCol(1)}
                    </div>
                    <div className="row">
                        {renderCol(2)}
                        {renderCol(3)}
                    </div>

                    <div style={{ height: '0.2em' }}></div>

                    <div className="small-row">
                        <div className="row">
                            {/* AM/PM - Using indices 4, 5 for A, M/P, M */}
                            <div className="col">
                                <div>8</div>
                                <div id="char41" ref={el => charRefs.current[8] = el}>{displayStr[8]}</div> 
                                <div id="char42" ref={el => charRefs.current[9] = el}>{displayStr[8]}</div> 
                            </div>
                            <div className="col">
                                <div>8</div>
                                <div id="char51" ref={el => charRefs.current[10] = el}>{displayStr[9]}</div>
                                <div id="char52" ref={el => charRefs.current[11] = el}>{displayStr[9]}</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Date (MM:DD) - Using indices 6, 7, 8, 9 for M1, M2, D1, D2 */}
                  
                    <div className="row">
                        {renderCol(8)}
                        {renderCol(9)}
                    </div>
                    <div className="row">
                        {renderCol(6)}
                        {renderCol(7)}
                    </div>
                    
                    {/* Year (YY) - Using indices 10, 11 for Y1, Y2 */}
                    <div className="row">
                        {renderCol(10)}
                        {renderCol(11)}
                    </div>
                </div>
        
                <div className="glass-tube"></div>
                <div className="hex">
                    <div className="overlay"></div>
                </div>
        
                <div className="tube-base-container">
                    <div className="wires"><div></div><div></div></div>
                    <div className="tube-base"></div>
                    <div className="rods">
                        <div className="left-rod"></div>
                        <div className="center-rod"></div>
                        <div className="right-rod"></div>
                    </div>
                    <div className="tube-btm"></div>
                </div>
        
                <div className="power-cord">
                    <div></div>
                    <div></div>
                </div>
                
                <div className="button" onClick={toggleClock}>
                    <div></div>
                </div> 
            </div>
        </div>
        </>
     
    );
};

export default NixieClock;