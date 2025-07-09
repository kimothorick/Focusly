(function () {
    'use strict';

    window.addEventListener('load', function () {
        const user = configs.user;
        const commands = configs.commands;
        const responses = configs.responses;
        const userTasks = new Map();
        const channel = user.channel;

        const styles = configs.styles;
        const style = document.createElement('style');
        document.head.appendChild(style);
        const headerDescriptionElement = document.querySelector('.header-description');
        headerDescriptionElement.textContent = styles.taskHeaderDescription

        //Adds date
        const today = new Date();
        const options = {month: 'short', day: 'numeric', year: 'numeric'};
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(today);
        const dateElement = document.querySelector('.date-text');
        dateElement.textContent = formattedDate;

        //tasks etc
        const totalTaskCountElement = document.querySelector('.total-tasks-count');
        const totalUsersElement = document.querySelector('.total-users');
        let totalUserCount = 0;
        let totalTaskCount = 0;
        const completionProgressElement = document.querySelector('.completion-progress');
        let totalCompletedTasks = 0;

        updateCounters();
        updateCompletionProgress();
        window.taskAnimations.initScrolling();  // Infinite scrolling

        // Using a counter for unique task IDs
        const taskListElement = document.getElementById('task-list');
        const client = new tmi.Client({
            options: {
                skipUpdatingEmotesets: true, debug: true
            }, identity: {
                username: `${user.username}`, password: `${user.oauth}`
            }, channels: [`${user.channel}`]
        });

        client.connect().catch(console.error);

        client.on('message', (channel, tags, message, self) => {
            if (self || !message.startsWith('!')) return;
            const args = message.slice(1).split(' ');
            const command = args.shift().toLowerCase();
            const isMod = tags['mod'];
            const isBroadCaster = tags.username.toLowerCase() === user.channel.toLowerCase();

            let messageSplit = message.trim().split(' ');
            let sender = tags['display-name']

            let senderColor = tags['color'];
            let taskContent = messageSplit.slice(1).join(' ');

            if (commands.addTaskCommands.indexOf(command) > -1) {
                if (taskContent.length === 0) {
                    let finalMsg = replaceStrings(responses.noTaskContent, {
                        user: sender,
                        command: command
                    });
                    client.say(channel, `/me ${finalMsg}`);
                    return;
                }

                const userData = userTasks.get(sender) || {tasks: []};
                const existingTaskCount = userData.tasks.length;

                const tasks = taskContent.split(';').map(taskDescription => taskDescription.trim());

                const validTasks = tasks.filter(task => task.trim() !== '');

                if (validTasks.length === 0) {
                    // Handle empty or invalid tasks
                    /*client.say(channel, `/me ${replaceStrings(responses.invalidTaskContent, {
                        user: sender
                    })}`);*/
                    return;
                }

                validTasks.forEach(taskDescription => {
                    addTask(sender, taskDescription, senderColor);
                });

                // Fetch updated user data after adding tasks
                const updatedUserData = userTasks.get(sender);

                // Check for task addition and send an appropriate message
                if (existingTaskCount === 0 && updatedUserData.tasks.length === 1) {
                    // Single task added (initial task)
                    const addedTask = updatedUserData.tasks[0];
                    const finalMsg = replaceStrings(responses.singleTaskAdded, {
                        task: `${addedTask.id}: ${addedTask.description}`,
                        user: sender
                    });
                    client.say(channel, `/me ${finalMsg}`);
                } else if (existingTaskCount === 0 && updatedUserData.tasks.length > 1) {
                    // Multiple tasks added (initial tasks)
                    const initialTasksString = updatedUserData.tasks.map((task, index) => `${index === 0 ? '' : '• '} ${task.id}: ${task.description}`).join(' ');
                    const finalMsg = replaceStrings(responses.multipleTasksAdded, {
                        tasks: initialTasksString,
                        user: sender
                    });
                    client.say(channel, `/me ${finalMsg}`);
                } else if (updatedUserData.tasks.length > existingTaskCount) {
                    // Tasks added to the existing list
                    const addedTasks = updatedUserData.tasks.slice(existingTaskCount);
                    const addedTasksString = addedTasks.map((task, index) =>
                        `${index === 0 ? '' : '• '} ${task.id}: ${task.description}`).join(' ');
                    const finalMsg = replaceStrings(responses.multipleTasksAdded, {
                        tasks: addedTasksString,
                        user: sender
                    });
                    client.say(channel, `/me ${finalMsg}`);
                }
            } else if (commands.editTaskCommands.indexOf(command) > -1) {
                const parts = taskContent.split(' ');

                if (parts.length < 2) {
                    const finalMsg = replaceStrings(responses.editTaskInvalidNumber, {
                        user: sender
                    });
                    client.say(channel, `/me ${finalMsg}`);
                    return;
                }

                const taskId = parseInt(parts[0]);
                console.log(`TAsk Id: ${taskId}`);
                const newContent = parts.slice(1).join(' ');

                const message = editTask(sender, command, taskId, newContent);
                client.say(channel, `/me ${message}`);
            } else if (commands.setCurrentTaskCommands.indexOf(command) > -1) {
                setCurrentTask(sender, taskContent);
            } else if (commands.checkCurrentTaskCommands.indexOf(command) > -1) {
                getCurrentTask(sender, tags);
            } else if (commands.checkAllTasksCommands.indexOf(command) > -1) {
                if (userHasTasks(sender)) {
                    getAllUserTasks(sender);
                } else {
                    client.say(channel, `/me ${replaceStrings(responses.noTask, {
                        user: sender
                    })}`);
                }
            } else if (commands.checkIncompleteTasksCommands.indexOf(command) > -1) {
                let finalMsg = ""
                if (userHasTasks(sender)) {
                    getIncompleteTasks(sender);
                } else {
                    finalMsg = replaceStrings(responses.noTask, {
                        user: sender
                    });
                }
                client.say(channel, `/me ${finalMsg}`);
            } else if (commands.deleteTaskCommands.indexOf(command) > -1) {
                const taskIds = taskContent.split(',').map(Number); // Extract task IDs
                if (taskIds.length === 0) {
                    const finalMsg = replaceStrings(responses.noTaskNumber, {
                        user: sender
                    });
                    client.say(channel, `/me ${finalMsg}`);
                    return;
                } else {
                    console.log(`task id's: ${taskIds}`)
                    // Validate task IDs and delete tasks
                    deleteTasks(sender, taskIds);
                }
            } else if (commands.deleteAllTasksCommands.indexOf(command) > -1) {
                deleteAllTasks(sender);
            } else if (commands.removeCurrentTaskCommands.indexOf(command) > -1) {
                removeCurrentTask(sender)
            } else if (commands.adminDeleteCommands.indexOf(command) > -1) {
                const isMod = tags['mod'];
                const isBroadCaster = tags.username.toLowerCase() === user.channel.toLowerCase();
                if (isMod || isBroadCaster) {
                    adminDeleteUserTasks(taskContent, sender);
                } else {
                    const finalMsg = replaceStrings(responses.notMod, {
                        user: sender
                    });
                    client.say(channel, `/me ${finalMsg}`);
                }
            } else if (commands.adminClearDoneCommands.indexOf(command) > -1) {
                const isMod = tags['mod'];
                const isBroadCaster = tags.username.toLowerCase() === user.channel.toLowerCase();
                if (isMod || isBroadCaster) {
                    adminDeleteAllCompletedTasks(sender)
                } else {
                    const finalMsg = replaceStrings(responses.notMod, {
                        user: sender
                    });
                    client.say(channel, `/me ${finalMsg}`);
                }
            } else if (commands.finishTaskCommands.indexOf(command) > -1) {
                markTasksCompleted(sender, taskContent);
            } else if (commands.adminClearTaskListCommands.indexOf(command) > -1) {
                if (isMod || isBroadCaster) {
                    adminDeleteAllTasks(sender)
                } else {
                    const finalMsg = replaceStrings(responses.notMod, {
                        user: sender
                    });
                    client.say(channel, `/me ${finalMsg}`);
                }
            } else if (commands.adminResetCounterCommands.indexOf(command) > -1) {
                if (isMod || isBroadCaster) {
                    resetCounters();
                } else {
                    const finalMsg = replaceStrings(responses.notMod, {
                        user: sender
                    });
                    client.say(channel, `/me ${finalMsg}`);
                }
            } else if(commands.helpCommands.indexOf(command)>-1){
                client.say(channel, `/me ${replaceStrings(responses.taskHelp, {
                    user: sender
                })}`);
            }

            console.log(userTasks);
        });

        function addTask(userId, taskDescription, senderColor) {
            let userData = userTasks.get(userId) || {tasks: [], nextTaskId: 1};
            const newTask = {
                id: userData.nextTaskId++,
                description: taskDescription.trim(),
                completed: false,
                isCurrent: false
            };

            userData.tasks.push(newTask);
            userTasks.set(userId, userData);

            // Ensure the task list element exists
            //  const taskListElement = document.getElementById('task-list');
            if (!taskListElement) {
                console.error('Task list element not found. Please check your HTML structure.');
                return;
            }

            // Find or create the user's task list element
            let userTasksElement = taskListElement.querySelector(`.user-tasks[data-user-id="${userId}"]`);
            if (!userTasksElement) {
                userTasksElement = document.createElement('div');
                userTasksElement.classList.add('user-tasks');
                userTasksElement.setAttribute('data-user-id', userId);
                userTasksElement.setAttribute('data-user-color', senderColor);

                // Create the username element
                const userNameElement = document.createElement('div');
                userNameElement.classList.add('user-name');
                userNameElement.textContent = userId;
                if (styles.useUserTwitchColor) {
                    userNameElement.style.color = senderColor;
                }
                userTasksElement.appendChild(userNameElement);

                // Create the task list element within the userTasksElement
                const userTaskList = document.createElement('div');
                userTaskList.classList.add('user-task-list');
                userTasksElement.appendChild(userTaskList);
                taskListElement.appendChild(userTasksElement);
                totalUserCount++;
            }

            // Find the user's task list element, ensuring it exists
            userTasksElement = taskListElement.querySelector(`.user-tasks[data-user-id="${userId}"]`);
            const userTaskList = userTasksElement.querySelector('.user-task-list');

            // Create and append the new task element
            const taskElement = document.createElement('div');
            taskElement.classList.add('task', 'fade-in');
            taskElement.dataset.taskId = String(newTask.id);

            // Create elements for task ID and description
            const taskIndicatorElement = document.createElement('div');
            if (styles.preferredTaskOrdering.checkbox) {
                taskIndicatorElement.classList.add('task-indicator');
            } else {
                taskIndicatorElement.classList.add('task-number');
                taskIndicatorElement.textContent = `${newTask.id.toString()}. `
            }

            const taskDescriptionElement = document.createElement('div');
            taskDescriptionElement.classList.add('task-description');
            taskDescriptionElement.textContent = newTask.description;


            taskElement.appendChild(taskIndicatorElement);
            taskElement.appendChild(taskDescriptionElement);

            userTaskList.appendChild(taskElement);
            totalTaskCount++;
            updateCounters();
            updateCompletionProgress();
        }

        function editTask(userId, command, taskId, newContent) {
            const userData = userTasks.get(userId);

            if (!userData) {
                return replaceStrings(responses.noTask, {
                    user: userId
                });
            }

            const taskIndex = userData.tasks.findIndex(task => task.id === taskId);

            if (taskIndex === -1) {
                return replaceStrings(responses.editTaskInvalidNumber, {
                    user: userId,
                    command: command
                });
            }

            userData.tasks[taskIndex].description = newContent;
            userTasks.set(userId, userData);

            // Update the DOM
            const userTasksElement = document.querySelector(`.user-tasks[data-user-id="${userId}"]`);
            if (userTasksElement) {
                const taskElements = userTasksElement.querySelectorAll('.task');
                if (taskIndex < taskElements.length) {
                    const taskElement = taskElements[taskIndex];
                    const taskDescriptionElement = taskElement.querySelector('.task-description');

                    // Update the text content and trigger the animation
                    taskDescriptionElement.textContent = newContent;
                    taskDescriptionElement.classList.add('fade-in');

                    setTimeout(() => {
                        taskDescriptionElement.classList.remove('fade-in');
                    }, 500); // Adjust the duration as needed
                }
            }

            return replaceStrings(responses.taskEdited, {
                user: userId,
                taskNumber: taskId,
                task: newContent
            });
        }

        function getAllUserTasks(userId) {
            console.log("Called!")
            const userData = userTasks.get(userId);
            if (!userData) {
                console.log("No userdata")
                return; // Return empty string for non-existent user
            }

            const tasks = userData.tasks;
            if (!tasks.length) {
                console.log("No tasks")
                return null; // Inform user about the empty list
            }

            client.say(channel, `${replaceStrings(responses.allTasks, {
                user: userId,
                tasks: tasks.map((task, index) => `${index === 0 ? '' : '• '}  ${task.id}: ${task.description}`).join(' ')
            })}`)
            // Construct the task list string
            return true;
        }

        function getIncompleteTasks(userId) {
            const userData = userTasks.get(userId);
            if (!userData) {
                return []; // User doesn't exist or has no tasks
            }

            const incompleteTasks = userData.tasks.filter(task => !task.completed);

            if (incompleteTasks.length === 0) {
                const finalMsg = replaceStrings(responses.allTasksCompleted, {
                    user: userId
                });
                client.say(channel, `/me ${finalMsg}`);
                return;
            }
            const finalMsg = replaceStrings(responses.allIncompleteTasks, {
                user: userId,
                tasks: incompleteTasks.map((task, index) => `${index === 0 ? '' : '• '}  ${task.id}: ${task.description}`).join(' ')
            });
            client.say(channel, `/me ${finalMsg}`);
            return true; //Indicate success
        }

        function setCurrentTask(userId, taskId) {
            const taskNumber = parseInt(taskId, 10);
            console.log(`${taskNumber}`);
            const userData = userTasks.get(userId);
            if (!userData) {
                let finalMsg = replaceStrings(responses.noTask, {
                    user: userId
                });
                client.say(channel, `/me ${finalMsg}`);
                return false; // Indicate failure
            }

            const task = userData.tasks.find(task => task.id === taskNumber);
            if (!task) {
                let finalMsg = replaceStrings(responses.invalidTaskNumber, {
                    user: userId
                });
                client.say(channel, `/me ${finalMsg}`);
                return false; // Indicate failure
            }

            if (task.completed) {
                let finalMsg = replaceStrings(responses.cannotSetCurrent, {
                    user: userId
                });
                client.say(channel, `/me ${finalMsg}`);
                return false; // Indicate failure
            }

            const currentTask = userData.tasks.find(task => task.isCurrent);
            if (currentTask && currentTask.id === taskNumber) {
                let finalMsg = replaceStrings(responses.taskAlreadyCurrent, {
                    user: userId,
                    task: task.description,
                    taskNumber: taskNumber
                });
                client.say(channel, `/me ${finalMsg}`);
                return false; // Indicate failure
            }

            if (currentTask) {
                currentTask.isCurrent = false; // Set previous current task to not current
            }

            task.isCurrent = true; // Set the specified task as the new current task

            userTasks.set(userId, userData);

            let finalMsg = replaceStrings(responses.currentTaskAdded, {
                user: userId,
                task: task.description,
                taskNumber: taskNumber
            });
            client.say(channel, `/me ${finalMsg}`);

            return true; // Indicate success
        }

        function getCurrentTask(userId, tags) {
            const userData = userTasks.get(userId);
            if (!userHasTasks(userId)) { // Check using the hasTasks function
                const finalMsg = replaceStrings(responses.noTask, {
                    user: userId
                });
                client.say(channel, `/me ${finalMsg}`);
                return false; // Indicate no tasks for the user
            }
            if (userData) {
                const currentTask = userData.tasks.find(task => task.isCurrent);
                if (currentTask) {
                    const taskNumber = userData.tasks.indexOf(currentTask) + 1; // Calculate task number

                    const finalMsg = replaceStrings(responses.currentTask, {
                        user: userId,
                        task: currentTask.description,
                        taskNumber: taskNumber.toString()
                    });
                    client.say(channel, `/me ${finalMsg}`);
                    return true; // Indicate success
                }
            }

            const finalMsg = replaceStrings(responses.noCurrentTask, {
                user: userId
            });

            client.say(channel, `/me ${finalMsg}`);
            return false; // Indicate failure
        }

        function removeCurrentTask(userId) {
            const userData = userTasks.get(userId);
            if (!userData) {
                let finalMsg = replaceStrings(responses.noTask, {
                    user: userId
                });
                client.say(channel, `/me ${finalMsg}`);
                return false; // Indicate failure
            }

            const currentTask = userData.tasks.find(task => task.isCurrent);
            if (!currentTask) {
                let finalMsg = replaceStrings(responses.noCurrentTask, {
                    user: userId
                });
                client.say(channel, `/me ${finalMsg}`);
                return false; // Indicate failure
            }

            currentTask.isCurrent = false;
            userTasks.set(userId, userData);

            let finalMsg = replaceStrings(responses.currentTaskRemoved, {
                user: userId
            });
            client.say(channel, `/me ${finalMsg}`);

            return true; // Indicate success
        }

        function deleteTasks(userId, taskIds) {
            const userData = userTasks.get(userId);
            if (!userData) {
                const finalMsg = replaceStrings(responses.noTask, {
                    user: userId
                });
                client.say(channel, `/me ${finalMsg}`);
                return []; // User doesn't exist or has no tasks
            }

            const validTaskIds = taskIds.filter(taskId => !isNaN(taskId) && taskId >= 1 && taskId <= userData.tasks.length);
            const invalidIds = taskIds.filter(taskId => !validTaskIds.includes(taskId));

            const deletedTasks = [];
            userData.tasks = userData.tasks.filter(task => {
                if (validTaskIds.includes(task.id)) {
                    deletedTasks.push(task);
                    return false; // Remove the task
                }
                return true; // Keep the task
            });

            // Count the number of incomplete deleted tasks
            const deletedIncompleteTasks = deletedTasks.filter(task => !task.completed).length;

            // Reset task IDs after deletion and update currentTaskId
            userData.nextTaskId = 1;
            userData.tasks.forEach((task, index) => {
                task.id = userData.nextTaskId++;
                if (task.id === userData.currentTaskId) {
                    userData.currentTaskId = newId; // Update the currentTaskId if necessary
                }
            });

            // Remove a user from the map if no tasks remaining
            if (userData.tasks.length === 0) {
                userTasks.delete(userId);
                updateCounters();
                updateCompletionProgress();
            } else {
                userTasks.set(userId, userData);
            }

            // Remove deleted tasks from DOM
            const taskListElement = document.getElementById('task-list');
            if (taskListElement) {
                const userTasksElement = taskListElement.querySelector(`.user-tasks[data-user-id="${userId}"]`);
                if (userTasksElement) {
                    const taskElements = userTasksElement.querySelectorAll('.task');

                    deletedTasks.forEach(deletedTask => {
                        for (const taskElement of taskElements) {
                            const taskId = parseInt(taskElement.dataset.taskId);
                            if (taskId === deletedTask.id) {
                                taskElement.remove();
                                break;
                            }
                        }
                    });

                    // Reassign datasetIds for remaining tasks
                    userData.tasks.forEach((task, index) => {
                        const taskElement = userTasksElement.querySelectorAll('.task')[index];
                        if (taskElement) {
                            taskElement.dataset.taskId = task.id.toString();
                        }
                    });

                    // Remove the entire user's task list if no tasks remain
                    if (userData.tasks.length === 0) {
                        userTasksElement.remove();
                    }
                }
            }

            // Sends a confirmation message based on deleted tasks
            if (deletedTasks.length > 0) {
                const deletedTasksString = deletedTasks.map((task, index) => `${index === 0 ? '' : '• '} ${task.id}: ${task.description}`).join(' ');
                const finalMsg = deletedTasks.length === 1
                    ? replaceStrings(responses.singleTaskDeleted, {user: userId, task: deletedTasksString})
                    : replaceStrings(responses.multipleTasksDeleted, {user: userId, task: deletedTasksString});
                client.say(channel, `/me ${finalMsg}`);
            } else {
                // Send error message for invalid task IDs
                const invalidIdsString = invalidIds.join(', ');
                const finalMsg = replaceStrings(responses.invalidTaskIds, {
                    user: userId,
                    invalidIds: invalidIdsString
                });
                client.say(channel, `/me ${finalMsg}`);
            }

            // Update the total task counter for incomplete tasks only
            totalTaskCount -= deletedIncompleteTasks;
            updateCounters();
            return true;
        }

        function deleteAllTasks(userId) {
            const userData = userTasks.get(userId);
            if (!userData) {
                client.say(channel, `/me ${replaceStrings(responses.noTasksToDelete, {
                    user: userId
                })}`);
                return; // User doesn't exist or has no tasks
            }
            // Count incomplete tasks before deletion
            const incompleteTasksCount = userData.tasks.filter(task => !task.completed).length;

            userTasks.delete(userId);

            // Remove the user's task list from the DOM
            if (taskListElement) {
                const userTasksElement = taskListElement.querySelector(`.user-tasks[data-user-id="${userId}"]`);
                if (userTasksElement) {
                    userTasksElement.remove();
                }
            }

            const finalMsg = replaceStrings(responses.allTasksDeleted, {
                user: userId
            });
            client.say(channel, `/me ${finalMsg}`);

            // Update the total task counter
            totalTaskCount -= incompleteTasksCount;
            updateCounters();
            return true;
        }

        function adminDeleteUserTasks(userId, mod) {
            const username = userId.replace('@', ''); // Remove the @ symbol
            const userData = userTasks.get(username);

            if (!userData) {
                client.say(channel, `/me ${replaceStrings(responses.adminUserTasksClearFailed, {
                    mod: mod
                })}`);
                return; // User doesn't exist or has no tasks
            }
            // Count completed tasks before deleting the user
            const incompleteTasksCount = userData.tasks.filter(task => !task.completed).length;

            userTasks.delete(username);
            totalTaskCount -= incompleteTasksCount;
            totalUserCount--;
            updateCounters();
            updateCompletionProgress();
            // Remove the user's task list from the DOM
            if (taskListElement) {
                const userTasksElement = taskListElement.querySelector(`.user-tasks[data-user-id="${username}"]`);
                if (userTasksElement) {
                    userTasksElement.remove();
                }
            }

            client.say(channel, `/me ${replaceStrings(responses.adminUserTasksCleared, {
                adminTarget: username,
                mod: mod
            })}`);
            return true;
        }

        function markTasksCompleted(userId, taskContent) {
            const userData = userTasks.get(userId);
            if (!userData) {
                client.say(channel, `${replaceStrings(responses.noTask, {
                    user: userId
                })}`);
                return; // User doesn't exist or has no tasks
            }

            const taskIds = taskContent.split(',').map(Number); // Extract task IDs from taskContent
            if (!Array.isArray(taskIds) || taskIds.length === 0) {
                // Handle invalid task IDs
                const finalMsg = replaceStrings(responses.invalidTaskIds, {
                    user: userId
                });
                client.say(channel, `/me ${finalMsg}`);
                return;
            }

            const validTaskIds = taskIds.filter(taskId => !isNaN(taskId) && taskId >= 1 && taskId <= userData.tasks.length);
            const invalidIds = taskIds.filter(taskId => !validTaskIds.includes(taskId));
            const alreadyCompletedTasks = validTaskIds.filter(taskId => userData.tasks.find(task => task.id === taskId && task.completed));

            const tasksToComplete = userData.tasks.filter(task => validTaskIds.includes(task.id) && !task.completed);

            if (tasksToComplete.length === 0) {
                if (invalidIds.length > 0) {
                    // Invalid task IDs
                    const invalidIdsString = invalidIds.join(', ');
                    const finalMsg = replaceStrings(responses.invalidTaskIds, {
                        user: userId,
                        invalidIds: invalidIdsString
                    });
                    client.say(channel, `/me ${finalMsg}`);
                } else {
                    // All tasks are already completed
                    const alreadyCompletedTasksString = alreadyCompletedTasks.join(', ');
                    const finalMsg = replaceStrings(responses.taskAlreadyCompleted, {
                        user: userId,
                        task: alreadyCompletedTasksString
                    });
                    client.say(channel, `/me ${finalMsg}`);
                }
                return;
            }

            const completedTasks = tasksToComplete.map(task => {
                task.completed = true;
                task.isCurrent = false; // Remove the current task status if applicable
                totalCompletedTasks++;
                return task;
            });

            userData.tasks = userData.tasks.map(task => (completedTasks.find(completed => completed.id === task.id) || task));

            userTasks.set(userId, userData);

            // Update task IDs after marking completed tasks
            if (completedTasks.length > 0) {
                let newId = 1;
                userData.tasks.forEach((task, index) => {
                    task.id = newId++;
                });
                userTasks.set(userId, userData);
            }

            updateCompletionProgress();
            // Send a confirmation message based on the number of completed tasks
            if (completedTasks.length === 1) {
                const completedTask = completedTasks[0];
                const finalMsg = replaceStrings(responses.singleTaskFinished, {
                    user: userId,
                    taskNumber: completedTask.id,
                    task: completedTask.description
                });
                client.say(channel, `/me ${finalMsg}`);
            } else if (completedTasks.length > 1) {
                const completedTasksString = completedTasks.map((task, index) => `${index === 0 ? '' : '• '} ${task.id}: ${task.description}`).join(' ');
                const finalMsg = replaceStrings(responses.multipleTasksFinished, {
                    user: userId,
                    tasks: completedTasksString,
                });
                client.say(channel, `/me ${finalMsg}`);
            }

            // Update the DOM to reflect completed tasks
            //const taskListElement = document.getElementById('task-list');
            if (taskListElement) {
                const userTasksElement = taskListElement.querySelector(`.user-tasks[data-user-id="${userId}"]`);
                if (userTasksElement) {
                    const taskElements = userTasksElement.querySelectorAll('.task');

                    tasksToComplete.forEach(completedTask => {
                        for (const taskElement of taskElements) {
                            const taskId = parseInt(taskElement.dataset.taskId);
                            if (taskId === completedTask.id) {
                                /* const taskIndicatorElement = taskElement.querySelector('.task-indicator');
                                 taskIndicatorElement.classList.add('completed');*/

                                if (styles.preferredTaskOrdering.checkbox) {
                                    const taskIndicatorElement = taskElement.querySelector('.task-indicator');
                                    taskIndicatorElement.classList.add('completed');
                                } else {
                                    const taskNumberElement = taskElement.querySelector(`.task-number`);
                                    taskNumberElement.classList.add(`completed`);
                                }
                                const taskDescriptionElement = taskElement.querySelector('.task-description');
                                taskDescriptionElement.classList.add('taskCompleted');
                                break;
                            }
                        }
                    });
                }
            }

        }

        function adminDeleteAllCompletedTasks(mod) {
            console.log(`mod: ${mod}`);
            userTasks.forEach((userData, userId) => {
                const completedTasks = userData.tasks.filter(task => task.completed);
                const originalTaskCount = userData.tasks.length;
                userData.tasks = userData.tasks.filter(task => !task.completed);

                // Reset task ID counter only if tasks were deleted for this user
                if (userData.tasks.length < originalTaskCount) {
                    userData.nextTaskId = 1;
                    userData.tasks.forEach((task, index) => {
                        task.id = userData.nextTaskId++;
                    });
                }

                userTasks.set(userId, userData);

                // Remove completed tasks from the DOM
                if (taskListElement) {
                    const userTasksElement = taskListElement.querySelector(`.user-tasks[data-user-id="${userId}"]`);
                    if (userTasksElement) {
                        const taskElements = userTasksElement.querySelectorAll('.task');
                        // Remove completed tasks and reassign datasetIds for remaining tasks
                        completedTasks.forEach(completedTask => {
                            const taskElement = userTasksElement.querySelector(`.task[data-task-id="${completedTask.id}"]`);
                            if (taskElement) {
                                taskElement.remove();
                            }
                        });

                        // Reassign datasetIds for remaining tasks
                        userData.tasks.forEach((task, index) => {
                            const taskElement = userTasksElement.querySelectorAll('.task')[index];
                            if (taskElement) {
                                taskElement.dataset.taskId = task.id.toString();
                            }
                        });

                        // Remove the entire user's task list if no tasks remain
                        if (userData.tasks.length === 0) {
                            userTasksElement.remove();
                        }
                    }
                }

                // Check if the user has any remaining tasks
                if (userData.tasks.length === 0) {
                    userTasks.delete(userId); // Remove user data from the map
                }
            });

            const finalMsg = replaceStrings(responses.adminClear, {
                mod: mod
            });
            client.say(channel, `/me ${finalMsg}`);
        }

        function adminDeleteAllTasks(mod) {
            userTasks.clear();

            // Clear the task list DOM
            const taskListElement = document.getElementById('task-list');
            if (taskListElement) {
                taskListElement.innerHTML = ''; // Clear all child elements
            }

            totalUserCount = 0;
            totalTaskCount = 0
            totalCompletedTasks = 0;
            updateCounters();
            updateCompletionProgress();

            const finalMsg = replaceStrings(responses.adminTaskListCleared, {
                mod: mod
            });
            client.say(channel, `/me ${finalMsg}`);
        }

        function userHasTasks(userId) {
            const userData = userTasks.get(userId);
            return userData && userData.tasks.length > 0;
        }

        // Function to update task completion progress
        function updateCompletionProgress() {
            if (totalTaskCount === 0) {
                completionProgressElement.textContent = "0%";
                return;
            }
            const completionPercentage = totalCompletedTasks / totalTaskCount * 100;
            // Update the DOM element displaying the completion progress
            completionProgressElement.textContent = `${completionPercentage.toFixed(0)}%`;
        }

        // Function to update total user and task counters
        function updateCounters() {
            // Update DOM elements with the new counters
            totalTaskCountElement.textContent = `${totalTaskCount.toString()} Total Tasks`;
            totalUsersElement.textContent = totalUserCount.toString();
        }

        function resetCounters() {
            totalTaskCount = 0;
            totalUserCount = 0;
            totalCompletedTasks = 0;
            updateCounters();
            updateCompletionProgress();
        }

        function replaceStrings(msg, replacements = {}) {
            // Loop over each replacement and replace the corresponding placeholder in the message
            for (const [key, value] of Object.entries(replacements)) {
                const placeholder = new RegExp(`\\{${key}\\}`, 'g');
                msg = msg.replace(placeholder, value ?? ''); // Replace with value or empty string if null/undefined
            }
            return msg;
        }


        ///TESTING AREA
        function addTasksTest() {
            const users = [
                {
                    id: "alicejohnson",
                    tasks: [
                        "Buy groceries",
                        "Do laundry",
                        "Walk the dog",
                        "Pay bills",
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.\""
                    ], color: "#7e0b4c"
                },
                {
                    id: "BobSmith",
                    tasks: [
                        "Finish the report",
                        "Attend the meeting",
                        "Review the code",
                        "Test the new feature",
                        "Deploy the update"
                    ], color: "#856c33"
                },
                {
                    id: "charliebrown",
                    tasks: [
                        "Practice guitar",
                        "Read a book",
                        "Watch a movie",
                        "Go for a run",
                        "Meditate"
                    ], color: "#2785c0"
                },
               {
                    id: "davidlee",
                    tasks: [
                        "Plan the vacation",
                        "Book flights",
                        "Pack the bags",
                        "Confirm accommodations",
                        "Notify colleagues"
                    ], color: "#490a4b"
                },
                 {
                     id: "emilychen",
                     tasks: [
                         "Study for the exam",
                         "Write the essay",
                         "Review the notes",
                         "Attend the lecture",
                         "Participate in the discussion"
                     ], color: "#8a0a57"
                 },
                 {
                     id: "FrankGarcia",
                     tasks: [
                         "Water the plants",
                         "Feed the cat",
                         "Mow the lawn",
                         "Trim the hedges",
                         "Clean the gutters"
                     ], color: "#83159d"
                 },
                 {
                     id: "GraceKim",
                     tasks: [
                         "Cook dinner",
                         "Bake a cake",
                         "Set the table",
                         "Clean the dishes",
                         "Put away groceries"
                     ], color: "#c23737"
                 },
                 {
                     id: "HenryNguyen",
                     tasks: [
                         "Write a blog post",
                         "Create a social media post",
                         "Respond to comments",
                         "Optimize website SEO",
                         "Analyze website traffic"
                     ], color: "#2e751e"
                 },
                 {
                     id: "isabellalopez",
                     tasks: [
                         "Go to the gym",
                         "Lift weights",
                         "Do cardio",
                         "Stretch",
                         "Cool down"
                     ], color: "#2785c0"
                 },
                 {
                     id: "JacobTaylor",
                     tasks: [
                         "Learn a new programming language",
                         "Build a web application",
                         "Contribute to open source projects",
                         "Attend a tech conference",
                         "Network with other developers"
                     ], color: "#349355"
                 }
            ];
            users.forEach(user => {
                user.tasks.forEach(taskDescription => {
                    addTask(user.id, taskDescription, user.color);
                });
            });
        }

        function markTasksAsCompleteTest() {
            const users = [
                {
                    id: "alicejohnson",
                    tasks: [
                        "1,3,4,5"
                    ]
                },
                {
                    id: "BobSmith",
                    tasks: [
                        "1,3,4"
                    ]
                },
                {
                    id: "charliebrown",
                    tasks: [
                        "1,3,4"
                    ]
                },
                {
                    id: "davidlee",
                    tasks: [
                        "1,3,4"
                    ]
                },
                {
                    id: "emilychen",
                    tasks: [
                        "1,3,4"
                    ]
                },
                {
                    id: "FrankGarcia",
                    tasks: [
                        "1,3,4"
                    ]
                }
            ];
            users.forEach(user => {
                user.tasks.forEach(taskDescription => {
                    markTasksCompleted(user.id, taskDescription);
                });
            });
        }


        if (configs.testingMode) {
            addTasksTest();
            markTasksAsCompleteTest();
        }
    })
})();