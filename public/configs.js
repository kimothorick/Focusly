window.configs = (function () {
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
    const theme = 'light';
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
        numbered: true, // true = ordered tasks
        checkbox: false // true = checkbox style
    };

    // Font
    const fontFamily = 'Poppins'; // Supports all google fonts - https://fonts.google.com/ - ensure it matches Google Fonts spelling

    // Header details for the bot overlay
    const headerTitleFontSize = 16;   // Font size for header title
    const headerTitleFontWeight = 600; // Font weight for header title
    const showHeaderDescription = true;  // Set to true to display a header description
    const taskHeaderDescription = "Progress isn’t about speed but consistency. Stay committed, and remember, small wins add up!"  // Customize header description text
    const headerDescriptionFontSize = 13; // Font size for header description
    const headerDescriptionFontWeight = 500; // Font weight for header description
    const headerDetailsFontSize = 14;  // Font size for header details
    const headerDetailsFontWeight = 500;  // Font weight for header details
    const headerStatsFontSize = 14; // Font size for header stats (date, users, tasks)

    const headerDetailsIconSize = 20; // Icon size for header details
    const completionProgressFontSize = 12; // Font size for completion progress
    const completionProgressFontWeight = 500; // Font weight for completion progress

    // Color Settings
    const headerBackgroundColor = '#ffffff';
    const headerTitleColor = '#000000';
    const dividerColor = '#E4E4E4';
    const userTasksBackgroundColor = '#ffffff';
    const mainTextColor = '#000000';
    const usernameColor = '#000000';
    const taskCompleteMain = '#2879E4';
    const checkSymbolColor = '#ffffff';
    const completedTaskTextColor = '#3F3F3F';
    const headerDetailsTextColor = '#3F3F3F';
    const headerIconColor = '#3F3F3F';
    const completionProgressMainColor = '#2879E4';
    const completionProgressBackgroundColor = '#E4E4E4';
    const completionProgressTextColor = '#000000';
    const focusModeBackgroundColor = '#E4E4E4';
    const focusModeTextColor = '#000000';
    const focusModeCheckboxColor = '#000000';

    // Tasks settings
    const usernameFontSize = 14; // Font size for usernames
    const usernameFontWeight = 600; // Font weight for usernames
    const useUserTwitchColor = true;  // Use user's Twitch color for username in the task list (true/false)
    const taskFontSize = 14; // Font size for tasks
    const taskFontWeight = 500; // Font weight for tasks
    const italicsOnCompletedTask = true; // Set to true to italicize completed tasks
    const checkBoxSize = 14;  // Size of checkboxes (applies if checkbox style is enabled)

    // Add task
    const addTaskCommands = ['add', 'task'];

    // Edit task
    const editTaskCommands = ['edit'];

    // Set current task
    const setCurrentTaskCommands = ['focus'];

    // Check current task
    const checkCurrentTaskCommands = ['current'];

    // Remove current task
    const removeCurrentTaskCommands = ['unfocus'];

    // Delete task
    const deleteTaskCommands = ['delete'];

    // Delete all tasks
    const deleteAllTasksCommands = ['clear'];

    // Finish task
    const finishTaskCommands = ['done'];

    // Check incomplete tasks
    const checkIncompleteTasksCommands = ['tasks'];

    // Check all tasks
    const checkAllTasksCommands = ['alltasks'];

    // Help commands
    const helpCommands = ['focusly'];

    // --- ADMIN COMMANDS ---

    // Admin delete task
    const adminDeleteCommands = ['admindel'];

    // Admin clear all tasks -> CHANGED
    const adminClearTaskListCommands = ['adminclear'];

    // Admin clear completed tasks only -> CHANGED
    const adminClearDoneCommands = ['admincleardone'];

    // Admin reset task counters
    const adminResetCounterCommands = ['adminreset'];

    // Responses to user actions
    const singleTaskAdded = '➕ Added: {task} to your list. All set, @{user}!';
    const multipleTasksAdded = '➕ Added: {tasks} to your list. All set, @{user}!';
    const noTaskContent = '@{user} Oops! You need to specify the task. Try using: !{command} your-task-here.';
    const noTaskButEdited = 'There was no task to edit, but I’ve added "Tasks {task}" for you, @{user}!';
    const invalidTaskNumber = 'Invalid task number! @{user}! Try using: !{command} task-number-here, @{user}.';
    const currentTaskAdded = `@{user} Your current task is now {task}`;
    const allTasks = `@{user}, here is a look at everything on your list: {tasks}`;
    const allIncompleteTasks = `@{user}, you have the following pending tasks: {tasks}`;
    const allTasksCompleted = `@{user} You currently have no incomplete tasks. Congrats on completing everything on your list!`;
    const currentTask = `@{user}, you are currently focused on {task}`;
    const noCurrentTask = "You haven't set a current task yet. Try using: !focus task-number-here, @{user}.";
    const taskAlreadyCurrent = `@{user}, {task} is already your current task.`;
    const taskEdited = '@{user} Task #{taskNumber} has been updated to: "{task}".';
    const editTaskInvalidNumber = `Invalid task number! Try using: !{command} task-number-here content-here, @{user}!.`
    const singleTaskDeleted = '@{user}, I have removed the following tasks: {task}';
    const multipleTasksDeleted = '@{user}, I have removed the following tasks: {task}';
    const modDeletedTasks = `All of @{user}'s tasks have been cleared.`;
    const singleTaskFinished = '@{user} ✅ Nice job! You finished: {task}';
    const multipleTasksFinished = '@{user} ✅ Nice job! You finished: {tasks}';
    const taskCheck = '@{user}, your current task is: {task}';
    const noTask = "It seems like you don't have a task listed yet, @{user}.";
    const noTaskA = "There's no task from that user, @{user}.";
    const notMod = "Sorry, @{user}, but you’re not a mod.";
    const adminClear = '@{mod} All completed tasks have been cleared 🧹';
    const help = `@{user}, here are the commands you can use: !add, !delete, !edit, !done. Mods can also use !adel @user or !adel user. Need more help? Feel free to ask a mod! 🤝`;
    const invalidTaskIds = `@{user} Task(s): {invalidIds} do not exist. Please enter valid task numbers.`;
    const noTaskNumber = `@{user} You need to specify a task!`;
    const allTasksDeleted = `Clean slate! I've deleted every task on your list, @{user}.`;
    const noTasksToDelete = `@{user} You currently have no tasks on the task board to delete.`;
    const cannotSetCurrent = `@{user} You cannot set that task as current. Please make sure it is not completed.`
    const currentTaskRemoved = `I've reset your current task, @{user}. Ready for the next one?`
    const adminUserTasksCleared = `@{mod} All @{adminTarget}'s tasks have been cleared.`;
    const adminUserTasksClearFailed = `@{mod} User has no tasks to be deleted. Please check their username and try again.`;
    const adminTaskListCleared = `@{mod} The task list has been cleared.`;
    const taskAlreadyCompleted = `@{user} Task {task} is already completed.`;
    const taskHelp = `@{user}, Add tasks: !add <task1;task;> | Edit task: !edit <#> <text> | Set current task: !focus <#> | Check current task: !current | Remove current task: !unfocus | Delete tasks: !delete <#, #, #> | Delete all tasks: !clear | Mark tasks as done: !done <#, #, #> | Show incomplete tasks: !tasks | Show all tasks: !alltasks | Help: !focusly`;

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
        headerStatsFontSize,
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
        italicsOnCompletedTask,
        // Focus Mode
        focusMode: true,
        focusModeBackgroundColor,
        focusModeTextColor,
        focusModeCheckboxColor,
        showHeaderDescription,
        // Colors
        headerBackgroundColor,
        headerTitleColor,
        dividerColor,
        userTasksBackgroundColor,
        mainTextColor,
        usernameColor,
        taskCompleteMain,
        checkSymbolColor,
        completedTaskTextColor,
        completedTaskTextColor,
        headerDetailsTextColor,
        headerIconColor,
        completionProgressMainColor,
        completionProgressBackgroundColor,
        completionProgressTextColor
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

    // Dummy data for testing mode
    const dummyData = [
        {
            id: "alicejohnson",
            tasks: [
                "Buy groceries",
                "Do laundry",
                "Walk the dog",
                "Pay bills",
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.\""
            ],
            color: "#7e0b4c",
            completedTasks: [1, 3, 4, 5], // IDs of tasks to mark as completed
            currentTask: 2
        },
        {
            id: "BobSmith",
            tasks: [
                "Finish the report",
                "Attend the meeting",
                "Review the code",
                "Test the new feature",
                "Deploy the update"
            ],
            color: "#856c33",
            completedTasks: [1, 3], // IDs of tasks to mark as completed
            currentTask: 4
        },
        {
            id: "charliebrown",
            tasks: [
                "Practice guitar",
                "Read a book",
                "Watch a movie",
                "Go for a run",
                "Meditate"
            ],
            color: "#2785c0",
            completedTasks: [2, 4], // IDs of tasks to mark as completed
            currentTask: 1
        },
        {
            id: "davidlee",
            tasks: [
                "Plan the vacation",
                "Book flights",
                "Pack the bags",
                "Confirm accommodations",
                "Notify colleagues"
            ],
            color: "#490a4b",
            completedTasks: [1, 5, 4], // IDs of tasks to mark as completed
            currentTask: 3
        },
        {
            id: "emilychen",
            tasks: [
                "Study for the exam",
                "Write the essay",
                "Review the notes",
                "Attend the lecture",
                "Participate in the discussion"
            ],
            color: "#8a0a57",
            completedTasks: [3, 4], // IDs of tasks to mark as completed
            currentTask: 2
        },
    ];

    // Return the module object containing user information and commands
    return {
        user, styles, commands, responses, testingMode, dummyData
    };
})();