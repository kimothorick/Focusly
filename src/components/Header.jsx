import { useEffect, useState } from 'react';
import { useTasks } from '../context/TasksContext';

export default function Header({ configs }) {
    const { state } = useTasks();
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        setFormattedDate(new Intl.DateTimeFormat('en-US', options).format(today));
    }, []);

    if (!configs?.styles) return null;

    const { styles } = configs;
    const { totalUsers, totalTasks, totalCompletedTasks } = state;

    const percentage = state.totalTasks > 0 ? Math.round((state.totalCompletedTasks / state.totalTasks) * 100) : 0;

    // Circular Progress Props
    const radius = 18;
    const stroke = 4;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="header">
            {/* Top Row: Title/Desc + Progress */}
            <div className="header-main-row">
                <div className="header-content-left">
                    {/* Title */}
                    <div className="header-title">
                        Focusly
                    </div>

                    {/* Description */}
                    {styles.showHeaderDescription && (
                        <div className="header-description">
                            There are {state.totalTasks - state.totalCompletedTasks} tasks to complete today
                        </div>
                    )}
                </div>

                {/* Circular Progress Section */}
                <div className="header-progress-right">
                    <div className="circular-progress-container">
                        <svg
                            height={radius * 2}
                            width={radius * 2}
                            style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
                        >
                            <circle
                                stroke="var(--completion-progress-background)"
                                strokeWidth={stroke}
                                fill="transparent"
                                r={normalizedRadius}
                                cx={radius}
                                cy={radius}
                            />
                            <circle
                                stroke="var(--completion-progress-main)"
                                fill="transparent"
                                strokeWidth={stroke}
                                strokeDasharray={circumference + ' ' + circumference}
                                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.35s' }}
                                strokeLinecap="round"
                                r={normalizedRadius}
                                cx={radius}
                                cy={radius}
                            />
                        </svg>
                        <div className="circular-progress-text">
                            {percentage}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Meta (Date + Stats) */}
            <div className="header-meta-row">
                <div className="header-date">
                    <span className="material-symbols-rounded icon-small">flag</span>
                    <span>{formattedDate}</span>
                </div>

                <div className="header-stats">
                    <div className="stat-item">
                        <span className="material-symbols-rounded icon-small">group</span>
                        <span>{state.totalUsers} Users</span>
                    </div>
                    <div className="stat-item">
                        <span className="material-symbols-rounded icon-small">task</span>
                        <span>{state.totalTasks} Tasks</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
