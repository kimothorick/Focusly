import { useEffect, useState } from 'react';
import Header from './components/Header';
import TaskList from './components/TaskList';
import { TasksProvider } from './context/TasksContext';
import { useTwitchClient } from './hooks/useTwitchClient';

import WebFont from 'webfontloader';

function AppContent({ configs }) {
  // Initialize Twitch Client
  useTwitchClient();

  const [layoutClass, setLayoutClass] = useState('layout-multi');
  // const [configs, setConfigs] = useState(window.configs || {}); // Moved to App

  const applyStyles = (newConfigs) => {
    if (!newConfigs?.styles) return;

    const { styles } = newConfigs;

    if (styles.preferredLayout?.singleView) {
      setLayoutClass('layout-single');
    } else {
      setLayoutClass('layout-multi');
    }

    // Load Google Font
    if (styles.fontFamily) {
      WebFont.load({
        google: {
          families: [`${styles.fontFamily}:100,200,300,400,500,600,700,800,900`]
        }
      });
    }

    // Apply dynamic colors and fonts from config
    const root = document.documentElement;
    const styleMap = {
      '--font-family': styles.fontFamily || 'inherit', // Apply font family
      '--header-background-color': styles.headerBackgroundColor,
      '--header-title-color': styles.headerTitleColor,
      '--divider-color': styles.dividerColor,
      '--user-tasks-background-color': styles.userTasksBackgroundColor,
      '--main-text-color': styles.mainTextColor,
      '--username-color': styles.usernameColor,
      '--task-complete-main': styles.taskCompleteMain,
      '--check-symbol-color': styles.checkSymbolColor,
      '--completed-task-text-color': styles.completedTaskTextColor,
      '--header-details-text-color': styles.headerDetailsTextColor,
      '--header-icon-color': styles.headerIconColor,

      // Font Sizes
      '--header-title-size': `${styles.headerTitleFontSize}px`,
      '--header-desc-size': `${styles.headerDescriptionFontSize}px`,
      '--header-stats-size': `${styles.headerStatsFontSize}px`,
      '--header-icon-size': `${styles.headerDetailsIconSize}px`,
      '--task-font-size': `${styles.taskFontSize}px`,
      '--username-font-size': `${styles.usernameFontSize}px`,
      '--completed-task-font-style': styles.italicsOnCompletedTask ? 'italic' : 'normal',

      // Font Weights
      '--header-title-font-weight': styles.headerTitleFontWeight || 700,
      '--header-desc-font-weight': styles.headerDescriptionFontWeight || 400,
      '--header-stats-font-weight': styles.headerStatsFontWeight || 500,
      '--task-font-weight': styles.taskFontWeight || 500,
      '--username-font-weight': styles.usernameFontWeight || 600,

      // Completion Progress
      '--completion-progress-font-size': `${styles.completionProgressFontSize || 12}px`,
      '--completion-progress-font-weight': styles.completionProgressFontWeight || 500,
      '--completion-progress-main': styles.completionProgressMainColor || styles.taskCompleteMain,
      '--completion-progress-background': styles.completionProgressBackgroundColor || styles.dividerColor,
      '--completion-progress-text': styles.completionProgressTextColor || styles.headerTitleColor,
    };

    Object.entries(styleMap).forEach(([key, value]) => {
      if (value) root.style.setProperty(key, value);
    });
  };

  useEffect(() => {
    // Apply styles whenever configs change
    if (configs) {
      applyStyles(configs);
    }
  }, [configs]);

  return (
    <div className={`main-container ${layoutClass}`}>
      <Header configs={configs} />
      <TaskList configs={configs} />
      <div className="footer"></div>
    </div>
  );
}

function App() {
  // We need to move the state up to App so we can pass it to TasksProvider
  const [configs, setConfigs] = useState(window.configs || {});

  useEffect(() => {
    // Initial load from global window.configs
    if (window.configs) {
      setConfigs(window.configs);
    }

    // Listen for updates from Settings Page
    const handleMessage = (event) => {
      if (event.data?.type === 'update-configs') {
        const updatedConfigs = event.data.configs;
        setConfigs(updatedConfigs);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <TasksProvider configs={configs}>
      <AppContent configs={configs} />
    </TasksProvider>
  )
}

export default App
