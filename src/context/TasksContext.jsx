import { createContext, useReducer, useContext, useEffect } from 'react';

// Initial state
const initialState = {
    tasks: new Map(), // userId -> { tasks: [], nextTaskId: 1 }
    usersWithCompletions: new Set(), // Track unique users who have completed at least one task
    totalUsers: 0,
    totalTasks: 0,
    totalCompletedTasks: 0,
};

// Action types
const ACTIONS = {
    ADD_TASK: 'ADD_TASK',
    EDIT_TASK: 'EDIT_TASK',
    DELETE_TASK: 'DELETE_TASK',
    COMPLETE_TASK: 'COMPLETE_TASK',
    SET_CURRENT_TASK: 'SET_CURRENT_TASK',
    REMOVE_USER_TASKS: 'REMOVE_USER_TASKS',
    RESET_COUNTERS: 'RESET_COUNTERS',
    CLEAR_ALL_TASKS: 'CLEAR_ALL_TASKS',
    CLEAR_COMPLETED_TASKS: 'CLEAR_COMPLETED_TASKS',
};

// Helper to calculate total users (Active in Map OR in Completion History)
const calculateTotalUsers = (tasksMap, completionsSet) => {
    const activeUsers = new Set(tasksMap.keys());
    const allUsers = new Set([...activeUsers, ...completionsSet]);
    return allUsers.size;
};

// Reducer
function tasksReducer(state, action) {
    const newState = {
        ...state,
        tasks: new Map(state.tasks),
        usersWithCompletions: new Set(state.usersWithCompletions)
    };

    switch (action.type) {
        case ACTIONS.ADD_TASK: {
            const { userId, description, userColor } = action.payload;
            const userData = newState.tasks.get(userId) || { tasks: [], nextTaskId: 1, userColor };

            const newTask = {
                id: userData.nextTaskId++,
                description,
                completed: false,
                isCurrent: false,
            };

            userData.tasks.push(newTask);

            // Update user color if provided
            if (userColor) userData.userColor = userColor;

            newState.tasks.set(userId, userData);
            newState.totalUsers = calculateTotalUsers(newState.tasks, newState.usersWithCompletions);
            newState.totalTasks++;
            return newState;
        }

        case ACTIONS.EDIT_TASK: {
            const { userId, taskId, newContent } = action.payload;
            const userData = newState.tasks.get(userId);
            if (!userData) return state;

            const task = userData.tasks.find(t => t.id === taskId);
            if (task) {
                task.description = newContent;
                // Force map update
                newState.tasks.set(userId, { ...userData });
            }
            return newState;
        }

        case ACTIONS.DELETE_TASK: {
            const { userId, taskIds } = action.payload;
            const userData = newState.tasks.get(userId);
            if (!userData) return state;

            let deletedCount = 0;
            userData.tasks = userData.tasks.filter(task => {
                if (taskIds.includes(task.id)) {
                    if (!task.completed) deletedCount++;
                    return false;
                }
                return true;
            });

            // Renumber IDs
            let nextId = 1;
            userData.tasks.forEach(t => t.id = nextId++);
            userData.nextTaskId = nextId;

            if (userData.tasks.length === 0) {
                newState.tasks.delete(userId);
            } else {
                newState.tasks.set(userId, userData);
            }

            newState.totalUsers = calculateTotalUsers(newState.tasks, newState.usersWithCompletions);
            newState.totalTasks -= deletedCount;
            return newState;
        }

        case ACTIONS.COMPLETE_TASK: {
            const { userId, taskIds } = action.payload;
            const userData = newState.tasks.get(userId);
            if (!userData) return state;

            let completedCount = 0;
            userData.tasks.forEach(task => {
                if (taskIds.includes(task.id) && !task.completed) {
                    task.completed = true;
                    task.isCurrent = false;
                    completedCount++;
                }
            });

            if (completedCount > 0) {
                newState.usersWithCompletions.add(userId);
                newState.totalUsers = calculateTotalUsers(newState.tasks, newState.usersWithCompletions);
            }

            // Reorder might be needed depending on preference, but for now just mark connected
            newState.totalCompletedTasks += completedCount;
            newState.tasks.set(userId, { ...userData });
            return newState;
        }

        case ACTIONS.SET_CURRENT_TASK: {
            const { userId, taskId } = action.payload;
            const userData = newState.tasks.get(userId);
            if (!userData) return state;

            userData.tasks.forEach(task => {
                if (task.id === taskId) task.isCurrent = true;
                else task.isCurrent = false;
            });
            newState.tasks.set(userId, { ...userData });
            return newState;
        }

        case ACTIONS.REMOVE_USER_TASKS: {
            const { userId } = action.payload;
            if (newState.tasks.has(userId)) {
                const userData = newState.tasks.get(userId);
                const incompleteCount = userData.tasks.filter(t => !t.completed).length;
                newState.totalTasks -= incompleteCount;
                newState.tasks.delete(userId);

                newState.totalUsers = calculateTotalUsers(newState.tasks, newState.usersWithCompletions);
            }
            return newState;
        }

        case ACTIONS.CLEAR_ALL_TASKS: {
            let incompleteCountToRemove = 0;
            for (const userData of newState.tasks.values()) {
                incompleteCountToRemove += userData.tasks.filter(t => !t.completed).length;
            }

            newState.totalTasks -= incompleteCountToRemove;
            newState.tasks = new Map();
            newState.totalUsers = calculateTotalUsers(newState.tasks, newState.usersWithCompletions);

            return newState;
        }

        case ACTIONS.CLEAR_COMPLETED_TASKS: {
            for (const [userId, userData] of newState.tasks.entries()) {
                // Filter out completed for this action
                userData.tasks = userData.tasks.filter(t => !t.completed);

                if (userData.tasks.length > 0) {

                    // Renumber
                    let nextId = 1;
                    userData.tasks.forEach(t => t.id = nextId++);
                    userData.nextTaskId = nextId;

                    newState.tasks.set(userId, userData);
                } else {
                    newState.tasks.delete(userId);
                    // Do NOT decrement totalUsers
                }
            }

            // We consciously DO NOT reset totalTasks, totalCompletedTasks, or totalUsers here
            return newState;
        }

        case ACTIONS.RESET_COUNTERS: {
            newState.totalTasks = 0;
            newState.totalCompletedTasks = 0;
            newState.totalUsers = 0;
            newState.tasks = new Map();
            newState.usersWithCompletions = new Set();
            return newState;
        }

        default:
            return state;
    }
}

const TasksContext = createContext(null);

export function TasksProvider({ children, configs }) {
    const [state, dispatch] = useReducer(tasksReducer, initialState);

    useEffect(() => {
        // When testing mode changes, we reset and (re)load data if needed
        if (configs?.testingMode) {
            // Reset first to clear any previous state (real or dummy)
            dispatch({ type: ACTIONS.RESET_COUNTERS });

            if (configs.dummyData) {
                configs.dummyData.forEach(user => {
                    // Add tasks
                    user.tasks.forEach(taskDesc => {
                        dispatch({
                            type: ACTIONS.ADD_TASK,
                            payload: { userId: user.id, description: taskDesc, userColor: user.color }
                        });
                    });

                    // Mark completed tasks
                    if (user.completedTasks && user.completedTasks.length > 0) {
                        dispatch({
                            type: ACTIONS.COMPLETE_TASK,
                            payload: { userId: user.id, taskIds: user.completedTasks }
                        });
                    }

                    // Set current task
                    if (user.currentTask) {
                        dispatch({
                            type: ACTIONS.SET_CURRENT_TASK,
                            payload: { userId: user.id, taskId: user.currentTask }
                        });
                    }
                });
            }
        } else {
            // If not in testing mode, we start fresh (or maybe we should persist real data? 
            // For now, "Live Preview" usually implies switching between Clean and Test.
            // If the user wants to keep real data, they wouldn't toggle test mode on a live stream ideally.
            // We'll clear to ensure "Test Mode Off" = "Clean Slate" or "Real Data only" (which is empty until twitch connects).
            dispatch({ type: ACTIONS.RESET_COUNTERS });
        }
    }, [configs?.testingMode, configs?.dummyData]); // Only re-run if testing flag or data changes

    return (
        <TasksContext.Provider value={{ state, dispatch }}>
            {children}
        </TasksContext.Provider>
    );
}

export function useTasks() {
    return useContext(TasksContext);
}

export { ACTIONS };
