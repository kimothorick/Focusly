const configs = (function () {
    'use strict';

    /**
     * Basic authentication and channel setup.
     * Set these values to get your bot connected and working on a Twitch channel.
     *
     * @const {string} channel - The Twitch channel name where the bot will run.
     * @const {string} username - The bot’s account username.
     * @const {string} oauth - The bot’s OAuth token (format: oauth:xxxxxxxxxxxx).
     */
    const channel = '';   // Insert your Twitch channel name here
    const username = '';  // Insert your bot’s account username here
    const oauth = '';     // Insert your bot’s OAuth token here

    // Enable to use dummy data, set false to remove dummy data and true to fill with dummy data
    const testingMode = false;

    // Main appearance settings for the bot overlay
    const height = '660px'; // Height of the overlay
    const width = '410px'; // Width of the overlay

    // Layout preference - set true for the view you want and false for the other
    const preferredLayout = {
        singleView: true, // true = single-view, false = multi-view
        multiView: false,   // true = multi-view, false = single-view
    };

    // UI settings for single/multi-view modes
    // when using multi-view
    const headerCornerRadius = 15;           // Corner radius for header in multi-view mode
    const taskContainerCornerRadius = 15;    // Corner radius for the task container in multi-view mode

    // When using single-view
    const tasklistCornerRadius = 20;   // Corner radius for the task list in single-view mode

    // Task ordering preference (numbered tasks or checkboxes) - set true for the style you want and false for the other
    const preferredTaskOrdering = {
        numbered: false, // true = ordered tasks, false = checkbox style
        checkbox: true // true = checkbox style, false = ordered
    };

    // Font
    const fontFamily = 'Inter'; // Supports all google fonts - https://fonts.google.com/ - ensure it matches Google Fonts spelling

    // Header details for the bot overlay
    const headerTitleFontSize = 16;   // Font size for header title
    const headerTitleFontWeight = 600; // Font weight for header title
    const showHeaderDescription = true;  // Set to true to display a header description
    const taskHeaderDescription = "Progress isn’t about speed but consistency. Stay committed, and remember, small wins add up!"  // Customize header description text
    const headerDescriptionFontSize = 13; // Font size for header description
    const headerDescriptionFontWeight = 500; // Font weight for header description
    const headerDetailsFontSize = 14;  // Font size for header details
    const headerDetailsFontWeight = 500;  // Font weight for header details
    const headerDetailsIconSize = 20; // Icon size for header details
    const completionProgressFontSize = 14; // Font size for completion progress
    const completionProgressFontWeight = 500; // Font weight for completion progress

    // Tasks settings
    const usernameFontSize = 14; // Font size for usernames
    const usernameFontWeight = 600; // Font weight for usernames
    const useUserTwitchColor = true;  // Use user's Twitch color for username in the task list (true/false)
    const taskFontSize = 14; // Font size for tasks
    const taskFontWeight = 500; // Font weight for tasks
    const italicsOnCompletedTask = true; // Set to true to italicize completed tasks
    const checkBoxSize = 14;  // Size of checkboxes (applies if checkbox style is enabled)


    // Add task - use commands in this exact format
    const addTaskCommands = ['taskadd', 'addtask', 'task', 'add'];

    // Edit task - use commands in this exact format
    const editTaskCommands = ['taskedit', 'edittask', 'edit'];

    // Set current task - use commands in this exact format
    const setCurrentTaskCommands = ['now'];

    // Check current task - use commands in this exact format
    const checkCurrentTaskCommands = ['current', 'checknow'];

    // Remove current task - use commands in this exact format
    const removeCurrentTaskCommands = ['removecurrent'];

    // Delete task - use commands in this exact format
    const deleteTaskCommands = ['taskdel', 'deltask', 'taskdelete', 'deletetask', 'taskremove', 'removetask', 'remove', 'delete'];

    // Delete all tasks - use commands in this exact format
    const deleteAllTasksCommands = ['removeall', 'deleteall'];

    // Finish task - use commands in this exact format
    const finishTaskCommands = ['taskf', 'taskfinish', 'finishtask', 'taskdone', 'finish', 'done', 'finished'];

    // Check incomplete tasks - use commands in this exact format
    const checkIncompleteTasksCommands = ['taskc', 'taskcheck', 'ctask', 'checktask', 'mytasks', 'check', 'tasks'];

    // Check all tasks - use commands in this exact format
    const checkAllTasksCommands = ['alltasks'];

    // Help commands - use commands in this exact format
    const helpCommands = ['taskh', 'taskhelp', 'helptask'];

    // Admin delete task - use commands in this exact format
    const adminDeleteCommands = ['taskadel', 'adel', 'adelete', 'admindelete'];

    // Admin clear all tasks - use commands in this exact format
    const adminClearTaskListCommands = ['admindeleteall'];

    // Admin clear completed tasks only - use commands in this exact format
    const adminClearDoneCommands = ['aclear', 'adminclear', 'clearadmin', 'taskaclear'];

    // Admin reset task counters - use commands in this exact format
    const adminResetCounterCommands = ['resetcounters'];

    // Responses to user actions
    const singleTaskAdded = '@{user}, "Task {task}" has been added to your list!';
    const multipleTasksAdded = 'Added task(s): "{tasks} " to your list. All set, @{user}!';
    const noTaskContent = '@{user} Oops! You need to specify the task. Try using: !{command} your-task-here.';
    const noTaskButEdited = 'There was no task to edit, but I’ve added "Tasks {task}" for you, @{user}!';
    const invalidTaskNumber = 'Invalid task number! Try using: !now task-number-here, @{user}!';
    const currentTaskAdded = `@{user} Your current task is now "Task #{taskNumber}: {task}"`;
    const allTasks = `@{user} Here are all your tasks: "{tasks}"`;
    const allIncompleteTasks = `@{user} Here are all your incomplete tasks: "{tasks}"`;
    const allTasksCompleted = `@{user} You currently have no incomplete tasks. Congrats on completing everything on your list!`;
    const currentTask = `@{user} Your current task is "Task #{taskNumber}: {task}"`;
    const noCurrentTask = "You haven't set a current task yet. Try using: !now task-number-here, @{user}.";
    const taskAlreadyCurrent = `@{user}, "Task {taskNumber}: {task}" is already your current task.`;
    const taskEdited = '@{user} Task #{taskNumber} has been updated to: "{task}".';
    const editTaskInvalidNumber = `Invalid task number! Try using: !{command} task-number-here content-here, @{user}!.`
    const singleTaskDeleted = 'Task "{task}" has been removed from your list, @{user}.';
    const multipleTasksDeleted = 'Tasks "{task}" have been removed from your list, @{user}.';
    const modDeletedTasks = `All of @{user}'s tasks have been cleared.`;
    const singleTaskFinished = 'Congrats on finishing "task #{taskNumber}: {task}", @{user}!';
    const multipleTasksFinished = '@{user} Congrats on finishing "{tasks}".';
    const taskCheck = '@{user}, your current task is: "{task}"';
    const noTask = "It seems like you don't have a task listed yet, @{user}.";
    const noTaskA = "There's no task from that user, @{user}.";
    const notMod = "Sorry, @{user}, but you’re not a mod.";
    const adminClear = '@{mod} All completed tasks have been cleared 🧹';
    const help = `@{user}, here are the commands you can use: !add, !delete, !edit, !done. Mods can also use !adel @user or !adel user. Need more help? Feel free to ask a mod! 🤝`;
    const invalidTaskIds = `@{user} Task(s): {invalidIds} do not exist. Please enter valid task numbers.`;
    const noTaskNumber = `@{user} You need to specify a task!`;
    const allTasksDeleted = `@{user} All your tasks have been deleted!`;
    const noTasksToDelete = `@{user} You currently have no tasks on the task board to delete.`;
    const cannotSetCurrent = `@{user} You cannot set that task as current. Please make sure it is not completed.`
    const currentTaskRemoved = `@{user} Your current task has been reset.`
    const adminUserTasksCleared = `@{mod} All @{adminTarget}'s tasks have been cleared.`;
    const adminUserTasksClearFailed = `@{mod} User has no tasks to be deleted. Please check their username and try again.`;
    const adminTaskListCleared = `@{mod} The task list has been cleared.`;
    const taskAlreadyCompleted = `@{user} Task {task} is already completed.`;
    const taskHelp = `@{user}, Add tasks: !task <task1;task;> | Edit task: !edit <#> <task> | Set current task: !now <#> | Check current task: !current | Remove current task: !removecurrent | Delete tasks: !taskdel <#, #, #> | Delete all tasks: !deleteall | Mark tasks as done: !done <#, #, #> | Show incomplete tasks: !mytasks | Show all tasks: !alltasks | Help: !taskhelp`;

    // Commands object containing all user credentials for connecting the bot to the specified Twitch channel.
    const user = {
        channel,    // Twitch channel name
        username,   // Bot's account username
        oauth,      // OAuth token for authentication
    };

    // Commands object containing all available style settings for the bot overlay.
    const styles = {
        height,
        width,
        usernameFontSize,
        usernameFontWeight,
        checkBoxSize,
        taskFontSize,
        taskFontWeight,
        headerTitleFontSize,
        headerTitleFontWeight,
        fontFamily,
        taskHeaderDescription,
        headerDescriptionFontSize,
        headerDescriptionFontWeight,
        headerDetailsFontSize,
        headerDetailsFontWeight,
        preferredTaskOrdering,
        useUserTwitchColor,
        preferredLayout,
        completionProgressFontSize,
        completionProgressFontWeight,
        headerDetailsIconSize,
        headerCornerRadius,
        taskContainerCornerRadius,
        tasklistCornerRadius,
        italicsOnCompletedTask,
        showHeaderDescription
    };

    // Commands object containing all available bot commands categorized by functionality.
    const commands = {
        addTaskCommands,
        editTaskCommands,
        setCurrentTaskCommands,
        checkCurrentTaskCommands,
        deleteTaskCommands,
        finishTaskCommands,
        checkIncompleteTasksCommands,
        checkAllTasksCommands,
        helpCommands,
        adminDeleteCommands,
        adminClearDoneCommands,
        deleteAllTasksCommands,
        removeCurrentTaskCommands,
        adminClearTaskListCommands,
        adminResetCounterCommands
    };

    // Response messages for various bot actions. Each response is a template that will be personalized with user and task details.
    const responses = {
        singleTaskAdded,
        multipleTasksAdded,
        noTaskContent,
        invalidTaskNumber,
        currentTaskAdded,
        currentTask,
        noCurrentTask,
        allTasks,
        taskAlreadyCurrent,
        singleTaskDeleted,
        multipleTasksDeleted,
        taskEdited,
        noTaskButEdited,
        editTaskInvalidNumber,
        singleTaskFinished,
        multipleTasksFinished,
        taskCheck,
        noTask,
        noTaskA,
        notMod,
        help,
        modDeletedTasks,
        adminClear,
        invalidTaskIds,
        noTaskNumber,
        allTasksDeleted,
        noTasksToDelete,
        cannotSetCurrent,
        currentTaskRemoved,
        adminUserTasksCleared,
        adminUserTasksClearFailed,
        adminTaskListCleared,
        allIncompleteTasks,
        taskAlreadyCompleted,
        allTasksCompleted,
        taskHelp
    };

    // Return the module object containing user information and commands
    return {
        user, styles, commands, responses, testingMode
    };
})();