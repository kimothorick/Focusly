let themes = (function () {
    'use strict';

    // Light theme colors
    const lightThemeColors = {
        taskTextColor: '#000000', // Text color for tasks
        headerBackgroundColor: '#ffffff', // Background color for the header
        userTasksBackgroundColor: '#ffffff', // Background color for user tasks
        headerDescriptionTextColor: '#3F3F3F', // Header description text color
        headerTitleColor: '#000000', //Text color for the header
        headerIconColor: '#3F3F3F', // Header icons color
        usernameColor: '#000000', // Username text color
        completedTaskTextColor: '#3F3F3F', // Text color for completed tasks
        checkBoxColor: '#3F3F3F', // Color for checkboxes
        checkSymbolColor: '#ffffff', // Color for check symbol
        completedCheckboxColor: '#329B57', // Checkbox color when completed
        completionProgressTextColor: '#4270C3', // Progress text color
        completionProgressBackgroundColor: '#D1DEF9', // Progress background color
        dividerColor: '#E4E4E4', // Divider color between sections
    };

    // Pink theme colors
    const pinkThemeColors = {
        taskTextColor: '#DC7274', // Text color for tasks
        usernameColor: '#DC7274', // Username text color
        headerBackgroundColor: '#F9CACB', // Background color for header
        userTasksBackgroundColor: '#F9CACB', // Background color for user tasks
        headerTitleColor: '#DC7274', //Text color for the header
        headerDescriptionTextColor: '#DC7274', // Header description text color
        headerDetailsTextColor: '#DC7274', // Header details text color
        headerIconColor: '#DC7274', // Header icons color
        dividerColor: '#F3BCBD', // Divider color for sections
        completedTaskTextColor: '#E18687', // Text color for completed tasks
        checkBoxColor: '#DC7274', // Color for checkboxes
        checkSymbolColor: '#ffffff', // Color for checkbox tick symbol
        completedCheckboxColor: '#DC7274', // Checkbox color when completed
        completionProgressBackgroundColor: '#ffffff', // Progress background color
        completionProgressTextColor: '#DC7274', // Progress text color
    };

    // Purple theme colors
    const purpleThemeColors = {
        taskTextColor: '#4E3395', // Text color for tasks
        usernameColor: '#4E3395', // Username text color
        headerBackgroundColor: '#D0CAF9', // Background color for header
        userTasksBackgroundColor: '#D0CAF9', // Background color for user tasks
        headerTitleColor: '#4E3395', //Text color for the header
        headerDescriptionTextColor: '#4E3395', // Header description text color
        headerDetailsTextColor: '#4E3395', // Header details text color
        headerIconColor: '#4E3395', // Header icons color
        dividerColor: '#CEC6E9', // Divider color for sections
        completedTaskTextColor:'#6750A4', // Text color for completed tasks
        checkBoxColor: '#4E3395', // Color for checkboxes
        checkSymbolColor: '#ffffff', // Color for checkbox tick symbol
        completedCheckboxColor: '#4E3395', // Checkbox color when completed
        completionProgressBackgroundColor: '#ffffff', // Progress background color
        completionProgressTextColor: '#4E3395', // Progress text color
    };

    // Orange theme colors
    const orangeThemeColors = {
        taskTextColor: '#CD7014', // Text color for tasks
        usernameColor: '#CD7014', // Username text color
        headerBackgroundColor: '#F9E3CB', // Background color for header
        userTasksBackgroundColor: '#F9E3CB', // Background color for user tasks
        headerTitleColor: '#CD7014', //Text color for the header
        headerDescriptionTextColor: '#CD7014', // Header description text color
        headerDetailsTextColor: '#CD7014', // Header details text color
        headerIconColor: '#CD7014', // Header icons color
        dividerColor: '#F3D9BD', // Divider color for sections
        completedTaskTextColor: '#D48435', // Text color for completed tasks
        checkBoxColor: '#CD7014', // Color for checkboxes
        checkSymbolColor: '#ffffff', // Color for checkbox tick symbol
        completedCheckboxColor: '#CD7014', // Checkbox color when completed
        completionProgressBackgroundColor: '#ffffff', // Progress background color
        completionProgressTextColor: '#CD7014', // Progress text color
    };

    // Black translucent theme colors
    const blackTranslucentThemeColors = {
        taskTextColor: '#ffffff', // Text color for tasks
        usernameColor: '#ffffff', // Username text color
        headerBackgroundColor: 'rgba(0,0,0,0.8)', // Background color for header with transparency
        userTasksBackgroundColor: 'rgba(0,0,0,0.8)', // Background color for user tasks with transparency
        headerTitleColor: '#ffffff', //Text color for the header
        headerDescriptionTextColor: '#E4E4E4', // Header description text color
        headerDetailsTextColor: '#E4E4E4', // Header details text color
        headerIconColor: '#E4E4E4', // Header icon color
        dividerColor: 'rgba(162,162,162,0.25)', // Divider color with transparency
        completedTaskTextColor: '#DADADA', // Text color for completed tasks
        checkBoxColor: '#ffffff', // Color for checkboxes
        checkSymbolColor: '#ffffff', // Color for checkbox tick symbol
        completedCheckboxColor: '#329B57', // Checkbox color when completed
        completionProgressBackgroundColor: '#ffffff', // Progress background color
        completionProgressTextColor: '#000000', // Progress text color
    };

    // Custom theme colors
    const customThemeColors = {
        taskTextColor: '#000000', // Text color for tasks
        headerBackgroundColor: '#ffffff', // Background color for the header
        userTasksBackgroundColor: '#ffffff', // Background color for user tasks
        headerDescriptionTextColor: '#3F3F3F', // Header description text color
        headerTitleColor: '#000000', //Text color for the header
        headerIconColor: '#3F3F3F', // Header icons color
        usernameColor: '#000000', // Username text color
        completedTaskTextColor: '#3F3F3F', // Text color for completed tasks
        checkBoxColor: '#3F3F3F', // Color for checkboxes
        checkSymbolColor: '#ffffff', // Color for check symbol
        completedCheckboxColor: '#329B57', // Checkbox color when completed
        completionProgressTextColor: '#4270C3', // Progress text color
        completionProgressBackgroundColor: '#D1DEF9', // Progress background color
        dividerColor: '#E4E4E4', // Divider color between sections
    };

    // Set the preferred theme colors (default to light theme)
    const preferredThemeColors = lightThemeColors ;

    const modules = {
        preferredThemeColors
    };

    // Return the module object containing the preferred theme
    return {
        modules
    };

})();
