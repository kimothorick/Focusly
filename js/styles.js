(function () {
    'use strict';

    // Configuration constants for styling and theme preferences
    const styles = configs.styles
    const preferredThemeColors = themes.modules.preferredThemeColors;
    const preferredLayout = configs.styles.preferredLayout

    /**
     * Dynamically loads a CSS file by creating a <link> element
     * and appending it to the document's head.
     * @param {string} fileName - The path to the CSS file to be loaded.
     */
    function loadCSS(fileName) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = fileName;
        document.head.appendChild(link);
    }

    // Load the appropriate CSS file based on the preferred layout setting
    if (preferredLayout.singleView) {
        loadCSS('../css/singleView.css');
    } else {
        loadCSS('../css/multiView.css');
    }

    /**
     * Applies custom styles by setting CSS variables based on configuration values.
     * This function uses the configurations in `styles` and `preferredThemeColors`
     * to set global CSS variables.
     */
    function customStyles() {
        loadGoogleFont(styles.fontFamily) // Load Google font based on `fontFamily` setting

        // Set various CSS properties using `styles` and `preferredThemeColors`
        document.documentElement.style.setProperty('--height', styles.height);
        document.documentElement.style.setProperty('--width', styles.width);
        document.documentElement.style.setProperty('--font-family', styles.fontFamily);
        document.documentElement.style.setProperty('--username-font-size', pixelToRem(styles.usernameFontSize));
        document.documentElement.style.setProperty('--username-font-weight', styles.usernameFontWeight.toString());
        document.documentElement.style.setProperty('--check-box-size', pixelToRem(styles.checkBoxSize));
        document.documentElement.style.setProperty('--header-title-color' ,preferredThemeColors.headerTitleColor);
        document.documentElement.style.setProperty('--header-title-font-size', pixelToRem(styles.headerTitleFontSize));
        document.documentElement.style.setProperty('--header-title-font-weight', styles.headerTitleFontWeight.toString());
        document.documentElement.style.setProperty('--header-icon-color', preferredThemeColors.headerIconColor);
        document.documentElement.style.setProperty('--header-description-text-color', preferredThemeColors.headerDescriptionTextColor);
        document.documentElement.style.setProperty('--task-font-size', pixelToRem(styles.taskFontSize));
        document.documentElement.style.setProperty('--task-font-weight', styles.taskFontWeight.toString());
        document.documentElement.style.setProperty('--task-text-color', preferredThemeColors.taskTextColor);
        document.documentElement.style.setProperty('--main-color-variant', preferredThemeColors.mainColorVariant);
        document.documentElement.style.setProperty('--task-complete-main', preferredThemeColors.taskCompleteMain);
        document.documentElement.style.setProperty('--main-text-color', preferredThemeColors.taskTextColor);
        document.documentElement.style.setProperty('--completed-text-color', preferredThemeColors.completedTextColor);
        document.documentElement.style.setProperty('--check-box-color', preferredThemeColors.checkBoxColor);
        document.documentElement.style.setProperty('--check-symbol-color', preferredThemeColors.checkSymbolColor);
        document.documentElement.style.setProperty('--completed-checkbox-color', preferredThemeColors.completedCheckboxColor);
        document.documentElement.style.setProperty('--username-color', preferredThemeColors.usernameColor)
        document.documentElement.style.setProperty('--tick-color', preferredThemeColors.tickColor);
        document.documentElement.style.setProperty('--divider-color', preferredThemeColors.dividerColor);
        document.documentElement.style.setProperty('--completion-progress-background-color', preferredThemeColors.completionProgressBackgroundColor);
        document.documentElement.style.setProperty('--completion-progress-text-color', preferredThemeColors.completionProgressTextColor);
        document.documentElement.style.setProperty('--completion-progress-font-size', pixelToRem(styles.completionProgressFontSize));
        document.documentElement.style.setProperty('--completion-progress-font-weight', styles.completionProgressFontWeight.toString());
        document.documentElement.style.setProperty('--header-details-text-color', preferredThemeColors.headerDetailsTextColor);
        document.documentElement.style.setProperty('--header-description-font-size', pixelToRem(styles.headerDescriptionFontSize));
        document.documentElement.style.setProperty('--header-description-font-weight', styles.headerDescriptionFontWeight.toString());
        document.documentElement.style.setProperty('--header-details-font-size', pixelToRem(styles.headerDetailsFontSize));
        document.documentElement.style.setProperty('--header-details-font-weight', styles.headerDetailsFontWeight.toString());
        document.documentElement.style.setProperty('--header-details-icon-size', pixelToRem(styles.headerDetailsIconSize));
        document.documentElement.style.setProperty('--header-background-color', preferredThemeColors.headerBackgroundColor);
        document.documentElement.style.setProperty('--user-tasks-background-color', preferredThemeColors.userTasksBackgroundColor);


        // Toggle header description display based on the `showHeaderDescription` setting
        let headerDescriptionDisplay = styles.showHeaderDescription ? '-webkit-box' : 'none';
        document.documentElement.style.setProperty('--header-description-display', headerDescriptionDisplay);

        // Apply italics styling for completed tasks if enabled in the settings
        if (styles.italicsOnCompletedTask) {
            document.documentElement.style.setProperty('--completed-task-font-style', 'italic')
        }

        // Adjust border radius settings based on layout preference
        if (styles.preferredLayout.multiView) {
            document.documentElement.style.setProperty('--header-border-radius', pixelToRem(styles.headerCornerRadius));
            document.documentElement.style.setProperty('--task-container-border-radius', pixelToRem(styles.taskContainerCornerRadius));
        } else {
            document.documentElement.style.setProperty('--tasklist-border-radius', pixelToRem(styles.tasklistCornerRadius));
        }
    }

    /**
     * Dynamically loads a Google font specified in the `font` parameter.
     * @param {string} font - The font family to be loaded from Google Fonts.
     */
    function loadGoogleFont(font) {
        WebFont.load({
            google: {
                families: [`${font}:100,200,300,400,500,600,700,800,900`]
            }
        });
    }

    /**
     * Converts pixel values to rem units for responsive font sizing.
     * @param {number} pixelValue - The pixel value to convert.
     * @param {number} [rootFontSize=16] - The root font size (default is 16px).
     * @returns {string} The equivalent rem value as a string.
     */
    function pixelToRem(pixelValue, rootFontSize = 16) {
        return pixelValue / rootFontSize + 'rem';
    }

    // Apply custom styles on page load
    window.addEventListener('load', () => {
        customStyles();
    });
})();