import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE } from "../utils/api"; 

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        const savedStart = localStorage.getItem("timerStartTimestamp");
        if (savedStart) {
            const startTime = parseInt(savedStart, 10);
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            setTime(elapsed);
            setRunning(true);
        }
    }, []);

    useEffect(() => {
        let interval;
        if (running) {
            interval = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running]);

    const start = () => {
        if (!localStorage.getItem("timerStartTimestamp")) {
            localStorage.setItem("timerStartTimestamp", Date.now().toString());
        }
        setRunning(true);
    };

    const stop = () => {
        setRunning(false);
    };

    const reset = () => {
        setTime(0);
        setRunning(false);
        localStorage.removeItem("timerStartTimestamp");
    };

    return (
        <TimerContext.Provider value={{ time, start, stop, reset }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => useContext(TimerContext);
