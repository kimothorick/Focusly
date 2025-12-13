import { useTasks } from '../context/TasksContext';
import { useEffect, useRef, useState } from 'react';

// Helper for rendering individual tasks
function TaskItem({ task, configs }) {
    const isCompleted = task.completed;
    const isCurrent = task.isCurrent;
    const isFocusMode = configs?.styles?.focusMode;

    const { numbered, checkbox } = configs?.styles?.preferredTaskOrdering || { numbered: false, checkbox: true };

    return (
        <div
            className={`task fade-in ${isFocusMode && isCurrent ? 'task-focused' : ''}`}
            data-task-id={task.id}
            style={isFocusMode && isCurrent ? {
                '--focus-mode-background-color': configs?.styles?.focusModeBackgroundColor,
                '--focus-mode-text-color': configs?.styles?.focusModeTextColor,
                '--focus-mode-checkbox-color': configs?.styles?.focusModeCheckboxColor
            } : {}}
        >
            {/* Checkbox */}
            {checkbox && (
                <div className={`task-indicator ${isCompleted ? 'completed' : ''}`}>

                </div>
            )}

            <div className="task-description">
                {numbered && (
                    <span
                        className="task-number"
                        style={{
                            marginRight: '4px',
                            color: isCompleted ? configs?.styles?.completedTaskTextColor : 'inherit'
                        }}
                    >
                        {task.id}.
                    </span>
                )}
                <span className={isCompleted ? 'taskCompleted' : ''}>{task.description}</span>
            </div>
        </div>
    );
}

export default function TaskList({ configs }) {
    const { state } = useTasks();
    const tasksMap = state.tasks;
    const listRef = useRef(null);
    const originalContentRef = useRef(null); // Ref to measure actual content size
    const [shouldScroll, setShouldScroll] = useState(false);
    const [scrollDuration, setScrollDuration] = useState('20s');

    // Convert Map to Array for rendering
    const userTasksArray = Array.from(tasksMap.entries());

    // Check for overflow to enable scrolling
    useEffect(() => {
        const list = listRef.current;
        const content = originalContentRef.current;

        if (!list || !content) return;

        // Measure immediately without resetting state first
        const scrollHeight = content.scrollHeight;
        const clientHeight = list.clientHeight;
        const isOverflowing = scrollHeight > clientHeight;

        // Only update state if it changes to avoid resetting animation
        if (isOverflowing) {
            // Calculate duration (approx 30px per second)
            const speed = 30;
            const duration = scrollHeight / speed;
            const newDuration = `${duration}s`;

            if (!shouldScroll || scrollDuration !== newDuration) {
                setShouldScroll(true);
                setScrollDuration(newDuration);
            }
        } else {
            if (shouldScroll) {
                setShouldScroll(false);
            }
        }
    }, [userTasksArray, shouldScroll, scrollDuration]);

    const renderUserTasks = (keySuffix = '') => (
        userTasksArray.map(([userId, userData]) => (
            <div key={`${userId}-${keySuffix}`} className="user-tasks" data-user-id={userId}>
                <div className="user-name" style={{ color: configs?.styles?.useUserTwitchColor ? (userData.userColor || 'var(--username-color)') : 'var(--username-color)' }}>
                    {userId}
                </div>
                <div className="user-task-list">
                    {userData.tasks.map((task) => (
                        <TaskItem key={task.id} task={task} configs={configs} />
                    ))}
                </div>
            </div>
        ))
    );

    return (
        <div className="task-list" id="task-list" ref={listRef} style={{ overflow: 'hidden', position: 'relative' }}>
            <div
                className={`task-scroll-container ${shouldScroll ? 'animate-scroll' : ''}`}
                style={{
                    ...(shouldScroll ? { animationDuration: scrollDuration } : {})
                }}
            >
                {/* Wrap original content in a div to measure it */}
                <div ref={originalContentRef} className="tasks-wrapper">
                    {renderUserTasks('original')}
                </div>

                {/* Duplicate content for seamless scrolling */}
                {shouldScroll && (
                    <div className="duplicate-content">
                        {renderUserTasks('duplicate')}
                    </div>
                )}
            </div>
        </div>
    );
}
