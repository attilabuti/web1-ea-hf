import React, { useState, useEffect } from 'react';

import './Pomodoro.css';

const WORK_DURATION_MINUTES = 25;

function Pomodoro() {
    const [timeRemaining, setTimeRemaining] = useState(WORK_DURATION_MINUTES * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let intervalId = null;

        if (isActive && timeRemaining > 0) {
            intervalId = setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            setIsActive(false);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isActive, timeRemaining]);

    const handleToggle = () => {
        if (timeRemaining === 0 && !isActive) {
            return;
        }

        setIsActive(!isActive);
    };

    const handleReset = () => {
        setIsActive(false);
        setTimeRemaining(WORK_DURATION_MINUTES * 60);
    };

    const formatTime = totalSeconds => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    };

    return (
        <div className="pomodoro-timer">
            <h2>Pomodoro Időzítő</h2>

            <div className="timer-display">
                <h1>{formatTime(timeRemaining)}</h1>
            </div>

            <div className="timer-controls">
                <button onClick={handleToggle} disabled={timeRemaining === 0 && !isActive}>
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button onClick={handleReset}>
                    Reset
                </button>
            </div>

            {timeRemaining === 0 && <p className="timer-finished-message">Lejárt az idő!</p>}
        </div>
    );
}

export default Pomodoro;
