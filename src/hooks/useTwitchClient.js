import { useEffect, useState, useRef } from 'react';
import tmi from 'tmi.js';
import { useTasks, ACTIONS } from '../context/TasksContext';

// Helper to replace strings
const replaceStrings = (text, replacements) => {
    let result = text;
    for (const [key, value] of Object.entries(replacements)) {
        result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return result;
};

export function useTwitchClient() {
    const { dispatch, state } = useTasks();
    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // Use Ref to access latest state inside the event listener closure
    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        // Access configs from global window object
        const configs = window.configs;
        if (!configs) {
            console.error("Configs not loaded!");
            return;
        }

        const { user, commands, responses } = configs;

        // Check if credentials are set
        if (!user.username || !user.oauth || !user.channel) {
            console.warn("Twitch credentials missing in configs.js. Chat features will be disabled.");
            return;
        }

        const twitchClient = new tmi.Client({
            options: { debug: true, skipUpdatingEmotesets: true },
            identity: {
                username: user.username,
                password: user.oauth
            },
            channels: [user.channel]
        });

        twitchClient.connect().then(() => {
            setIsConnected(true);
            console.log("Connected to Twitch!");
        }).catch(console.error);

        setClient(twitchClient);

        const handleMessage = (channel, tags, message, self) => {
            if (self || !message.startsWith('!')) return;

            const args = message.slice(1).split(' ');
            const command = args.shift().toLowerCase();
            const taskContent = args.join(' ');
            const sender = tags['display-name'];
            const senderColor = tags['color'];
            const isMod = tags['mod'] || tags.username.toLowerCase() === user.channel.toLowerCase();

            // Access latest state
            const currentState = stateRef.current;
            const userData = currentState.tasks.get(sender);

            // --- COMMAND HANDLING ---
            const formatTask = (t) => `[${t.id}] "${t.description}"`;

            // ADD TASK
            if (commands.addTaskCommands.includes(command)) {
                if (!taskContent) {
                    const msg = replaceStrings(responses.noTaskContent, { user: sender, command: command });
                    twitchClient.say(channel, `/me ${msg}`);
                    return;
                }
                const tasks = taskContent.split(/[;,]/).filter(t => t.trim());

                // Determine starting ID
                let nextId = userData ? userData.nextTaskId : 1;

                const taskDisplays = [];

                tasks.forEach(desc => {
                    const cleanDesc = desc.trim();
                    if (!cleanDesc) return;

                    dispatch({
                        type: ACTIONS.ADD_TASK,
                        payload: { userId: sender, description: cleanDesc, userColor: senderColor }
                    });

                    taskDisplays.push(`[${nextId}] "${cleanDesc}"`);
                    nextId++; // Predict next ID
                });

                let msg = "";
                if (taskDisplays.length === 1) {
                    msg = replaceStrings(responses.singleTaskAdded, { user: sender, task: taskDisplays[0] });
                } else {
                    msg = replaceStrings(responses.multipleTasksAdded, { user: sender, tasks: taskDisplays.join('  •  ') });
                }
                twitchClient.say(channel, `/me ${msg}`);
            }

            // DONE TASK
            else if (commands.finishTaskCommands.includes(command)) {
                // Support both comma and semicolon
                const taskIds = taskContent.split(/[;,]/).map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                if (taskIds.length === 0) {
                    const msg = replaceStrings(responses.invalidTaskNumber, { user: sender, command: command });
                    twitchClient.say(channel, `/me ${msg}`);
                    return;
                }

                if (!userData || userData.tasks.length === 0) {
                    const msg = replaceStrings(responses.noTasksToDelete, { user: sender });
                    twitchClient.say(channel, `/me ${msg}`);
                    return;
                }

                let finishedTasks = [];
                if (userData) {
                    finishedTasks = userData.tasks.filter(t => taskIds.includes(t.id) && !t.completed);
                }

                if (finishedTasks.length === 0) return;

                dispatch({
                    type: ACTIONS.COMPLETE_TASK,
                    payload: { userId: sender, taskIds }
                });

                let msg = "";
                if (finishedTasks.length === 1) {
                    const t = finishedTasks[0];
                    msg = replaceStrings(responses.singleTaskFinished, { user: sender, task: `[${t.id}] "${t.description}"` });
                } else {
                    const names = finishedTasks.map(t => `[${t.id}] "${t.description}"`).join('  •  ');
                    msg = replaceStrings(responses.multipleTasksFinished, { user: sender, tasks: names });
                }
                twitchClient.say(channel, `/me ${msg}`);
            }

            // DELETE TASK
            else if (commands.deleteTaskCommands.includes(command)) {
                const taskIds = taskContent.split(/[;,]/).map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                if (taskIds.length === 0) {
                    // Optionally handle empty args
                    if (!taskContent && userData && userData.tasks.length === 0) {
                        const msg = replaceStrings(responses.noTasksToDelete, { user: sender });
                        twitchClient.say(channel, `/me ${msg}`);
                    }
                    return;
                }

                let deletedTasks = [];
                if (userData) {
                    // Find tasks to be deleted
                    deletedTasks = userData.tasks.filter(t => taskIds.includes(t.id));
                }

                if (deletedTasks.length === 0) {
                    const msg = replaceStrings(responses.invalidTaskIds, { user: sender, invalidIds: taskIds.join(', ') });
                    twitchClient.say(channel, `/me ${msg}`);
                    return;
                }

                dispatch({
                    type: ACTIONS.DELETE_TASK,
                    payload: { userId: sender, taskIds }
                });

                const taskString = deletedTasks.map(formatTask).join('  •  ');
                // Use same message for single/multiple as per request style (or standard template)
                // Request said: @{user}, I have removed the following tasks: ...
                // Both templates now match this pattern in configs.js
                // We pass 'task' as the whole string list to match the template variable
                let msg = "";
                if (deletedTasks.length === 1) {
                    msg = replaceStrings(responses.singleTaskDeleted, { user: sender, task: taskString });
                } else {
                    msg = replaceStrings(responses.multipleTasksDeleted, { user: sender, task: taskString });
                }
                twitchClient.say(channel, `/me ${msg}`);
            }

            // EDIT TASK
            else if (commands.editTaskCommands.includes(command)) {
                if (!userData || userData.tasks.length === 0) {
                    const msg = replaceStrings(responses.noTasksToDelete, { user: sender });
                    twitchClient.say(channel, `/me ${msg}`);
                } else {
                    const parts = taskContent.split(' ');
                    const taskId = parseInt(parts[0]);
                    const newContent = parts.slice(1).join(' ');
                    if (!isNaN(taskId) && newContent) {
                        dispatch({
                            type: ACTIONS.EDIT_TASK,
                            payload: { userId: sender, taskId, newContent }
                        });

                        const msg = replaceStrings(responses.taskEdited, { user: sender, taskNumber: taskId, task: newContent });
                        twitchClient.say(channel, `/me ${msg}`);
                    }
                }
            }

            // NOW (Set Current)
            else if (commands.setCurrentTaskCommands.includes(command)) {
                if (!userData || userData.tasks.length === 0) {
                    const msg = replaceStrings(responses.noTasksToDelete, { user: sender });
                    twitchClient.say(channel, `/me ${msg}`);
                } else {
                    const taskId = parseInt(taskContent);
                    if (!isNaN(taskId)) {
                        const task = userData ? userData.tasks.find(t => t.id === taskId) : null;
                        if (task) {
                            if (task.completed) {
                                const msg = replaceStrings(responses.cannotSetCurrent, { user: sender });
                                twitchClient.say(channel, `/me ${msg}`);
                            } else {
                                dispatch({
                                    type: ACTIONS.SET_CURRENT_TASK,
                                    payload: { userId: sender, taskId }
                                });
                                // Template: `@{user}, you are currently focused on {task}`
                                // We pass formatted task string
                                const msg = replaceStrings(responses.currentTask, { user: sender, task: formatTask(task) });
                                twitchClient.say(channel, `/me ${msg}`);
                            }
                        } else {
                            const msg = replaceStrings(responses.invalidTaskNumber, { user: sender });
                            twitchClient.say(channel, `/me ${msg}`);
                        }
                    }
                }
            }

            // CHECK CURRENT
            else if (commands.checkCurrentTaskCommands.includes(command)) {
                const current = userData ? userData.tasks.find(t => t.isCurrent) : null;
                if (current) {
                    // Template: `@{user}, your current task is: {task}` (or updated focused on)
                    // The user requested: "Current task: @{user}, you are currently focused on [2] "task 2""
                    // Config variable used: currentTask (same as !now confirmation usually)
                    const msg = replaceStrings(responses.currentTask, { user: sender, task: formatTask(current) });
                    twitchClient.say(channel, `/me ${msg}`);
                } else {
                    const msg = replaceStrings(responses.noCurrentTask, { user: sender });
                    twitchClient.say(channel, `/me ${msg}`);
                }
            }

            // CHECK ALL TASKS
            else if (commands.checkAllTasksCommands.includes(command)) {
                if (!userData || userData.tasks.length === 0) {
                    const msg = replaceStrings(responses.noTask, { user: sender });
                    twitchClient.say(channel, `/me ${msg}`);
                } else {
                    const titles = userData.tasks.map(formatTask).join('  •  ');
                    const msg = replaceStrings(responses.allTasks, { user: sender, tasks: titles });
                    twitchClient.say(channel, `/me ${msg}`);
                }
            }

            // CHECK INCOMPLETE TASKS
            else if (commands.checkIncompleteTasksCommands.includes(command)) {
                if (!userData || userData.tasks.length === 0) {
                    const msg = replaceStrings(responses.noTask, { user: sender });
                    twitchClient.say(channel, `/me ${msg}`);
                } else {
                    const incomplete = userData.tasks.filter(t => !t.completed);
                    if (incomplete.length === 0) {
                        const msg = replaceStrings(responses.allTasksCompleted, { user: sender });
                        twitchClient.say(channel, `/me ${msg}`);
                    } else {
                        const titles = incomplete.map(formatTask).join('  •  ');
                        const msg = replaceStrings(responses.allIncompleteTasks, { user: sender, tasks: titles });
                        twitchClient.say(channel, `/me ${msg}`);
                    }
                }
            }

            // REMOVE CURRENT TASK
            else if (commands.removeCurrentTaskCommands.includes(command)) {
                dispatch({
                    type: ACTIONS.SET_CURRENT_TASK,
                    payload: { userId: sender, taskId: -1 }
                });
                const msg = replaceStrings(responses.currentTaskRemoved, { user: sender });
                twitchClient.say(channel, `/me ${msg}`);
            }

            // DELETE ALL TASKS (User)
            else if (commands.deleteAllTasksCommands.includes(command)) {
                if (!userData || userData.tasks.length === 0) {
                    const msg = replaceStrings(responses.noTasksToDelete, { user: sender });
                    twitchClient.say(channel, `/me ${msg}`);
                } else {
                    dispatch({
                        type: ACTIONS.REMOVE_USER_TASKS,
                        payload: { userId: sender }
                    });
                    const msg = replaceStrings(responses.allTasksDeleted, { user: sender });
                    twitchClient.say(channel, `/me ${msg}`);
                }
            }

            // HELP
            else if (commands.helpCommands.includes(command)) {
                const msg = replaceStrings(responses.taskHelp, { user: sender });
                twitchClient.say(channel, `/me ${msg}`);
            }

            // --- ADMIN COMMANDS ---

            // ADMIN: CLEAR ALL (Delete everything)
            else if (commands.adminClearTaskListCommands.includes(command) && isMod) {
                dispatch({ type: ACTIONS.CLEAR_ALL_TASKS });
                const msg = replaceStrings(responses.adminTaskListCleared, { mod: sender });
                twitchClient.say(channel, `/me ${msg}`);
            }

            // ADMIN: DELETE USER TASKS (!adel @user)
            else if (commands.adminDeleteCommands.includes(command) && isMod) {
                // args[0] might be @user or user
                if (!taskContent) return;

                let targetUser = taskContent.split(' ')[0];
                if (targetUser.startsWith('@')) targetUser = targetUser.slice(1);

                // Check if user exists
                if (currentState.tasks.has(targetUser)) {
                    dispatch({
                        type: ACTIONS.REMOVE_USER_TASKS,
                        payload: { userId: targetUser }
                    });
                    const msg = replaceStrings(responses.adminUserTasksCleared, { mod: sender, adminTarget: targetUser });
                    twitchClient.say(channel, `/me ${msg}`);
                } else {
                    const msg = replaceStrings(responses.noTaskA, { user: sender });
                    twitchClient.say(channel, `/me ${msg}`);
                }
            }

            // ADMIN: CLEAR COMPLETED (!aclear)
            else if (commands.adminClearDoneCommands.includes(command) && isMod) {
                dispatch({ type: ACTIONS.CLEAR_COMPLETED_TASKS });
                const msg = replaceStrings(responses.adminClear, { mod: sender });
                twitchClient.say(channel, `/me ${msg}`);
            }

            // ADMIN: RESET COUNTERS (!resetcounters)
            else if (commands.adminResetCounterCommands.includes(command) && isMod) {
                // Our RESET_COUNTERS action also clears tasks currently, which matches typical "reset" behavior for these bots.
                dispatch({ type: ACTIONS.RESET_COUNTERS });
                twitchClient.say(channel, `/me Counters and tasks have been reset.`);
            } else if (isMod === false && (commands.adminDeleteCommands.includes(command) || commands.adminClearDoneCommands.includes(command) || commands.adminResetCounterCommands.includes(command))) {
                const msg = replaceStrings(responses.notMod, { user: sender });
                twitchClient.say(channel, `/me ${msg}`);
            }
        };

        twitchClient.on('message', handleMessage);

        return () => {
            twitchClient.disconnect();
        };

    }, []); // Run once on mount

    return { client, isConnected };
}
