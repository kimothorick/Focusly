let themes = (function () {
    'use strict';

    // Light theme colors
    const lightThemeColors = {
        backgroundColor: '#ffffff', // Background color of the app
        mainColorVariant: '#3F3F3F', // Main color variant for text and elements
        taskCompleteMain: '#329B57', // Color for completed tasks
        taskTextColor: '#000000', // Text color for tasks
        headerBackgroundColor: '#ffffff', // Background color for the header
        userTasksBackgroundColor: '#ffffff', // Background color for user tasks
        headerDescriptionTextColor: '#3F3F3F', // Header description text color
        headerIconColor: '#f8f8f8', // Header icons color
        usernameColor: '#000000', // Username text color
        completedTextColor: '#3F3F3F', // Text color for completed tasks
        checkBoxColor: '#3F3F3F', // Color for checkboxes
        checkSymbolColor: '#ffffff', // Color for check symbol
        tickColor: '#ffffff', // Tick color
        completedCheckboxColor: '#329B57', // Checkbox color when completed
        completionProgressTextColor: '#4270C3', // Progress text color
        completionProgressBackgroundColor: '#D1DEF9', // Progress background color
        dividerColor: '#E4E4E4', // Divider color between sections
    };

    // Pink theme colors
    const pinkThemeColors = {
        backgroundColor: '#F9CACB', // Background color of the app
        mainColorVariant: '#DC7274', // Main pink color
        taskCompleteMain: '#DC7274', // Color for completed tasks
        taskTextColor: '#DC7274', // Text color for tasks
        usernameColor: '#DC7274', // Username text color
        headerBackgroundColor: '#F9CACB', // Background color for header
        userTasksBackgroundColor: '#F9CACB', // Background color for user tasks
        headerDescriptionTextColor: '#DC7274', // Header description text color
        headerIconColor: '#DC7274', // Header icons color
        dividerColor: '#F3BCBD', // Divider color for sections
        completedTextColor: '#DC7274', // Text color for completed tasks
        checkBoxColor: '#DC7274', // Color for checkboxes
        checkSymbolColor: '#ffffff', // Color for checkbox tick symbol
        completedCheckboxColor: '#DC7274', // Checkbox color when completed
        completionProgressBackgroundColor: '#ffffff', // Progress background color
        completionProgressTextColor: '#DC7274', // Progress text color
    };

    // Black translucent theme colors
    const blackTranslucentThemeColors = {
        backgroundColor: 'rgba(0,0,0,0.8)', // Background color of the app
        mainColorVariant: '#E4E4E4', // Main color variant
        taskCompleteMain: '#329B57', // Color for completed tasks
        taskTextColor: '#ffffff', // Text color for tasks
        usernameColor: '#ffffff', // Username text color
        headerBackgroundColor: 'rgba(0,0,0,0.8)', // Background color for header with transparency
        userTasksBackgroundColor: 'rgba(0,0,0,0.8)', // Background color for user tasks with transparency
        headerDescriptionTextColor: '#E4E4E4', // Header description text color
        headerDetailsTextColor: '#E4E4E4', // Header details text color
        headerIconColor: '#E4E4E4', // Header icon color
        dividerColor: 'rgba(162,162,162,0.25)', // Divider color with transparency
        completedTextColor: '#DADADA', // Text color for completed tasks
        checkBoxColor: '#ffffff', // Color for checkboxes
        checkSymbolColor: '#ffffff', // Color for checkbox tick symbol
        completedCheckboxColor: '#329B57', // Checkbox color when completed
        completionProgressBackgroundColor: '#ffffff', // Progress background color
        completionProgressTextColor: '#000000', // Progress text color
    };

    // Custom theme colors
    const customThemeColors = {
        backgroundColor: '#ffffff', // Background color of the app
        mainColorVariant: '#3F3F3F', // Main color variant for text and elements
        taskCompleteMain: '#329B57', // Color for completed tasks
        taskTextColor: '#000000', // Text color for tasks
        headerBackgroundColor: '#ffffff', // Background color for the header
        userTasksBackgroundColor: '#ffffff', // Background color for user tasks
        headerDescriptionTextColor: '#3F3F3F', // Header description text color
        headerIconColor: '#f8f8f8', // Header icon color
        usernameColor: '#000000', // Username text color
        completedTextColor: '#3F3F3F', // Text color for completed tasks
        checkBoxColor: '#3F3F3F', // Color for checkboxes
        checkSymbolColor: '#ffffff', // Color for checkbox tick symbol
        completedCheckboxColor: '#329B57', // Checkbox color when completed
        completionProgressTextColor: '#4270C3', // Progress text color
        completionProgressBackgroundColor: '#D1DEF9', // Progress background color
        dividerColor: '#E4E4E4', // Divider color between sections
    };

    // Set the preferred theme colors (default to light theme)
    const preferredThemeColors = lightThemeColors;

    const modules = {
        preferredThemeColors
    };

    // Return the module object containing the preferred theme
    return {
        modules
    };

})();
