import { createContext, useContext, useEffect, useState } from 'react';

const ProgressContext = createContext();

export const useProgress = () => {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
};

export const ProgressProvider = ({ children }) => {
    const [brushedToday, setBrushedToday] = useState(0);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [streakDays, setStreakDays] = useState(0);
    const [lastBrushDate, setLastBrushDate] = useState(null);

    // Check daily reset on mount
    useEffect(() => {
        const today = new Date().toDateString();
        if (lastBrushDate && lastBrushDate !== today) {
            // New day - reset daily counters but maintain streak if they brushed yesterday
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastBrushDate !== yesterday.toDateString()) {
                // Missed a day - reset streak
                setStreakDays(0);
            }

            setBrushedToday(0);
            setPointsEarned(0);
            setLastBrushDate(today);
        } else if (!lastBrushDate) {
            setLastBrushDate(today);
        }
    }, []);

    const addBrushingSession = () => {
        const today = new Date().toDateString();

        if (brushedToday < 2) {
            const newBrushedCount = brushedToday + 1;
            setBrushedToday(newBrushedCount);

            // Award points for brushing
            addPoints(50);

            // Update streak if completed daily goal
            if (newBrushedCount === 2 && lastBrushDate !== today) {
                setStreakDays(prev => prev + 1);
                setLastBrushDate(today);
            }
        }
    };

    const addPoints = (points) => {
        setPointsEarned(prev => prev + points);
    };

    const resetDailyProgress = () => {
        const today = new Date().toDateString();
        setBrushedToday(0);
        setPointsEarned(0);
        setLastBrushDate(today);
    };

    return (
        <ProgressContext.Provider
            value={{
                brushedToday,
                pointsEarned,
                streakDays,
                addBrushingSession,
                addPoints,
                resetDailyProgress
            }}
        >
            {children}
        </ProgressContext.Provider>
    );
};