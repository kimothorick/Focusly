import { useState, useEffect, useRef } from 'react';
import '../styles/settings.css';
import { HexAlphaColorPicker } from 'react-colorful';
import MessagePreview from './MessagePreview';
import CommandList from './CommandList';

// Helper to escape special regex chars in values when generating new content
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Custom Color Picker
const GradientColorPicker = ({ label, value = '#000000', onChange, helperText }) => {
    const [isOpen, setIsOpen] = useState(false);

    const close = () => setIsOpen(false);

    const handleColorChange = (newColor) => {
        onChange({ target: { value: newColor } });
    };

    const handleInputChange = (e) => {
        onChange({ target: { value: e.target.value } });
    };

    return (
        <div className="form-group color-picker-item" style={{ position: 'relative' }}>
            <label className="picker-label">{label}</label>
            <div className={`picker-wrapper ${isOpen ? 'active' : ''}`}>
                <div
                    className="swatch-button"
                    style={{ backgroundColor: value || '#000000' }}
                    onClick={() => setIsOpen(true)}
                />
                <input
                    type="text"
                    className="color-value-input"
                    value={value || ''}
                    onChange={handleInputChange}
                    spellCheck="false"
                />

                {isOpen && (
                    <div className="picker-popover">
                        <div className="picker-cover" onClick={close} />
                        <HexAlphaColorPicker color={value} onChange={handleColorChange} />
                    </div>
                )}
            </div>
            {helperText && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.2' }}>
                    {helperText}
                </div>
            )}
        </div>
    );
};

// Custom Dropdown Component
const CustomDropdown = ({ label, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (key) => {
        onChange(key);
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.key === value) || { name: 'Select...' };

    return (
        <div className="form-group" style={{ marginBottom: '25px' }} ref={dropdownRef}>
            <label>{label}</label>
            <div className="dropdown-container">
                <div
                    className={`dropdown-trigger ${isOpen ? 'is-open' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>{selectedOption.name}</span>
                    <span className="material-symbols-rounded" style={{ fontSize: '20px', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                        keyboard_arrow_down
                    </span>
                </div>

                {isOpen && (
                    <div className="dropdown-menu">
                        {options.map((option) => (
                            <div
                                key={option.key}
                                className={`dropdown-item ${value === option.key ? 'selected' : ''}`}
                                onClick={() => handleSelect(option.key)}
                            >
                                {option.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Theme Presets
const THEME_PRESETS = {
    'custom': { name: 'Custom' },
    'light': {
        name: 'Light Theme (Default)',
        colors: {
            headerBackgroundColor: '#ffffff',
            headerTitleColor: '#000000',
            mainTextColor: '#000000',
            dividerColor: '#E4E4E4',
            userTasksBackgroundColor: '#ffffff',
            usernameColor: '#000000',
            taskCompleteMain: '#2879E4',
            completedTaskTextColor: '#3F3F3F',
            headerIconColor: '#3F3F3F',
            headerDetailsTextColor: '#3F3F3F',
            completionProgressMainColor: '#2879E4',
            completionProgressBackgroundColor: '#E4E4E4',
            completionProgressTextColor: '#000000',
            checkSymbolColor: '#ffffff',
            focusModeBackgroundColor: '#E4E4E4',
            focusModeTextColor: '#000000',
            focusModeCheckboxColor: '#000000'
        }
    },
    'pink': {
        name: 'Pink Theme',
        colors: {
            headerBackgroundColor: '#F9CACB',
            headerTitleColor: '#DC7274',
            mainTextColor: '#DC7274',
            dividerColor: '#F3BCBD',
            userTasksBackgroundColor: '#F9CACB',
            usernameColor: '#DC7274',
            taskCompleteMain: '#DC7274',
            completedTaskTextColor: '#E18687',
            headerIconColor: '#DC7274',
            headerDetailsTextColor: '#DC7274',
            completionProgressMainColor: '#DC7274',
            completionProgressBackgroundColor: '#F3BCBD',
            completionProgressTextColor: '#DC7274',
            checkSymbolColor: '#ffffff',
            focusModeBackgroundColor: '#DC7274',
            focusModeTextColor: '#F9D4D3',
            focusModeCheckboxColor: '#F9D4D3'
        }
    },
    'purple': {
        name: 'Purple Theme',
        colors: {
            headerBackgroundColor: '#D0CAF9',
            headerTitleColor: '#4E3395',
            mainTextColor: '#4E3395',
            dividerColor: '#CEC6E9',
            userTasksBackgroundColor: '#D0CAF9',
            usernameColor: '#4E3395',
            taskCompleteMain: '#4E3395',
            completedTaskTextColor: '#4E3395',
            headerIconColor: '#4E3395',
            headerDetailsTextColor: '#4E3395',
            completionProgressMainColor: '#4E3395',
            completionProgressBackgroundColor: '#CEC6E9',
            completionProgressTextColor: '#4E3395',
            checkSymbolColor: '#ffffff',
            focusModeBackgroundColor: '#4E3395',
            focusModeTextColor: '#D7D3F9',
            focusModeCheckboxColor: '#D7D3F9'
        }
    },
    'orange': {
        name: 'Orange Theme',
        colors: {
            headerBackgroundColor: '#F9E3CB',
            headerTitleColor: '#CD7014',
            mainTextColor: '#CD7014',
            dividerColor: '#F3D9BD',
            userTasksBackgroundColor: '#F9E3CB',
            usernameColor: '#CD7014',
            taskCompleteMain: '#CD7014',
            completedTaskTextColor: '#D48435',
            headerIconColor: '#CD7014',
            headerDetailsTextColor: '#CD7014',
            completionProgressMainColor: '#CD7014',
            completionProgressBackgroundColor: '#F3D9BD',
            completionProgressTextColor: '#CD7014',
            checkSymbolColor: '#ffffff',
            focusModeBackgroundColor: '#CD7014',
            focusModeTextColor: '#FAE9D6',
            focusModeCheckboxColor: '#FAE9D6'
        }
    },
    'dark': {
        name: 'Dark Theme',
        colors: {
            headerBackgroundColor: '#000000',
            headerTitleColor: '#ffffff',
            mainTextColor: '#ffffff',
            dividerColor: '#2b2b2b',
            userTasksBackgroundColor: '#000000',
            usernameColor: '#ffffff',
            taskCompleteMain: '#ffffff',
            completedTaskTextColor: '#c2c2c2',
            headerIconColor: '#8b8b9b',
            headerDetailsTextColor: '#8b8b9b',
            completionProgressMainColor: '#ffffff',
            completionProgressBackgroundColor: '#2b2b2b',
            completionProgressTextColor: '#ffffff',
            checkSymbolColor: '#000000',
            focusModeBackgroundColor: '#ffffff',
            focusModeTextColor: '#000000',
            focusModeCheckboxColor: '#000000'
        }
    }
};

export default function SettingsPage() {
    const [fileHandle, setFileHandle] = useState(null);
    const [saveStatus, setSaveStatus] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('section-appearance'); // Default to appearance for easier color editing
    const [themeDev, setThemeDev] = useState('light'); // UI theme state
    const [selectedPreset, setSelectedPreset] = useState('custom'); // Track selected preset
    const [showOauth, setShowOauth] = useState(false); // Toggle for OAuth visibility
    const [calculatedPath, setCalculatedPath] = useState('Calculating path...');
    const iframeRef = useRef(null);

    const [configs, setConfigs] = useState({
        user: { channel: '', username: '', oauth: '' },
        testingMode: false,
        styles: {
            width: '', height: '', fontFamily: '', theme: 'dark',
            preferredLayout: { singleView: false, multiView: true },
            preferredTaskOrdering: { numbered: false, checkbox: true },
            showHeaderDescription: false, taskHeaderDescription: '',
            headerTitleFontSize: 16, headerDescriptionFontSize: 14, headerStatsFontSize: 13, headerDetailsIconSize: 16, completionProgressFontSize: 12,
            headerTitleFontWeight: 700, headerDescriptionFontWeight: 400, headerStatsFontWeight: 500, completionProgressFontWeight: 500,
            useUserTwitchColor: false, italicsOnCompletedTask: false,
            taskFontSize: 14, usernameFontSize: 14,
            // Colors
            headerBackgroundColor: '#ffffff', headerTitleColor: '#000000',
            dividerColor: '#E0E0E0', userTasksBackgroundColor: '#ffffff',
            mainTextColor: '#000000', usernameColor: '#000000',
            taskCompleteMain: '#2879E4', checkSymbolColor: '#ffffff', completedTaskTextColor: '#3F3F3F',
            headerIconColor: '#3F3F3F', headerDetailsTextColor: '#3F3F3F',
            completionProgressMainColor: '#2879E4', completionProgressBackgroundColor: '#E0E0E0', completionProgressTextColor: '#000000',
            focusModeBackgroundColor: '#F0F0F0', focusModeTextColor: '#000000', focusModeCheckboxColor: '#000000'
        }
    });

    // Live Preview Update
    useEffect(() => {
        const sendUpdate = () => {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage({
                    type: 'update-configs',
                    configs: configs
                }, '*');
            }
        };
        // Small timeout to ensure iframe is loaded or simply fire it
        const timer = setTimeout(sendUpdate, 100);
        return () => clearTimeout(timer);
    }, [configs]);

    // Helper to calculate path
    useEffect(() => {
        try {
            const protocol = window.location.protocol;
            let path = '';

            if (protocol.startsWith('http')) {
                // Dev/Web mode: Show full URL
                path = window.location.href;
                // Strip query params/hashes if any
                path = path.split('?')[0].split('#')[0];

                // Replace settings.html or directory root with configs.js
                if (path.endsWith('settings.html')) {
                    path = path.replace('settings.html', 'configs.js');
                } else if (path.endsWith('/')) {
                    path += 'configs.js';
                } else {
                    path = path.replace(/\/[^/]*$/, '/configs.js');
                }
            } else {
                // File mode (Legacy/OBS): Show OS path
                path = window.location.pathname;
                if (path.match(/^\/[a-zA-Z]:\//)) path = path.substring(1);
                path = decodeURIComponent(path);

                path = path.replace(/settings\.html$/, 'configs.js');
                if (path.endsWith('index.html')) path = path.replace('index.html', 'configs.js');

                // Normalize slashes for Windows display
                path = path.replace(/\//g, '\\');
            }

            setCalculatedPath(path);
        } catch (e) {
            console.error(e);
            setCalculatedPath('Unable to calculate path');
        }
    }, []);

    const copyPath = () => {
        navigator.clipboard.writeText(calculatedPath).then(() => {
            const btn = document.getElementById('copyPathBtn');
            if (btn) btn.classList.add('btn-success');
            setTimeout(() => { if (btn) btn.classList.remove('btn-success'); }, 2000);
        });
    };

    // On mount, try to populate from window.configs if available (auto-load)
    useEffect(() => {
        if (window.configs) {
            setConfigs(prev => ({
                ...prev,
                ...window.configs,
                styles: {
                    ...prev.styles,
                    ...(window.configs.styles || {})
                }
            }));

            // Note: We deliberately do NOT sync themeDev with window.configs.styles.theme anymore.
            // But we must apply the default themeDev to the body.
            document.body.setAttribute('data-theme', themeDev);
        } else {
            document.body.setAttribute('data-theme', themeDev);
        }
    }, []);

    const handleChange = (section, key, value) => {
        setConfigs(prev => {
            if (section === 'root') return { ...prev, [key]: value };
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [key]: value
                }
            };
        });
    };

    const handleLayoutChange = (type) => {
        setConfigs(prev => ({
            ...prev,
            styles: {
                ...prev.styles,
                preferredLayout: {
                    singleView: type === 'singleView',
                    multiView: type === 'multiView'
                }
            }
        }));
    };

    const handleOrderingChange = (type) => {
        setConfigs(prev => ({
            ...prev,
            styles: {
                ...prev.styles,
                preferredTaskOrdering: {
                    numbered: type === 'numbered',
                    checkbox: type === 'checkbox'
                }
            }
        }));
    };

    const toggleTheme = () => {
        const newTheme = themeDev === 'dark' ? 'light' : 'dark';
        setThemeDev(newTheme);
        document.body.setAttribute('data-theme', newTheme);
    };

    const applyThemePreset = (presetKey) => {
        setSelectedPreset(presetKey);
        if (presetKey === 'custom') return;

        const preset = THEME_PRESETS[presetKey];
        if (preset && preset.colors) {
            setConfigs(prev => ({
                ...prev,
                styles: {
                    ...prev.styles,
                    ...preset.colors
                }
            }));
            // If preset has a 'theme' property (like light/dark mode switch), we could apply it too
            // For now we just stick to colors as requested.
        }
    };

    // Auto-detect theme preset based on current colors
    useEffect(() => {
        const currentStyles = configs.styles;
        let matchedPreset = 'custom';

        for (const [key, preset] of Object.entries(THEME_PRESETS)) {
            if (key === 'custom') continue;

            // Check if all colors in the preset match the current config
            const isMatch = Object.entries(preset.colors).every(([colorKey, colorValue]) => {
                const current = (currentStyles[colorKey] || '').toString().toLowerCase();
                const expected = (colorValue || '').toString().toLowerCase();
                return current === expected;
            });

            if (isMatch) {
                matchedPreset = key;
                break;
            }
        }

        setSelectedPreset(matchedPreset);
    }, [configs.styles]);

    // File System Access API - Load
    const handleLoad = async () => {
        try {
            const [handle] = await window.showOpenFilePicker({
                types: [{ description: 'JavaScript Config File', accept: { 'text/javascript': ['.js'] } }],
                multiple: false
            });
            setFileHandle(handle);
            const file = await handle.getFile();
            // In a real app we'd parse this text. For now, rely on refresh/window.configs or assume user knows.
            // Since we can't easily parse without 'eval' or a regex parser for *reading*, we'll stick to the write-only regex logic for now unless requested.
            setSaveStatus(`Selected: ${file.name}`);
        } catch (err) {
            console.error(err);
        }
    };

    // File System Access API - Save
    const handleSave = async () => {
        try {
            let handle = fileHandle;
            if (!handle) {
                [handle] = await window.showOpenFilePicker({
                    types: [{ description: 'JavaScript Config File', accept: { 'text/javascript': ['.js'] } }],
                    multiple: false
                });
                setFileHandle(handle);
            }

            const file = await handle.getFile();
            const originalContent = await file.text();

            let newContent = originalContent;
            const replaceVal = (regex, newVal) => { newContent = newContent.replace(regex, newVal); };
            const esc = (str) => String(str).replace(/'/g, "\\'");
            const escDouble = (str) => String(str).replace(/"/g, '\\"');

            const { user, styles, testingMode } = configs;

            // Auth
            replaceVal(/const channel = '.*?';/, `const channel = '${esc(user.channel)}';`);
            replaceVal(/const username = '.*?';/, `const username = '${esc(user.username)}';`);
            replaceVal(/const oauth = '.*?';/, `const oauth = '${esc(user.oauth)}';`);

            // General
            replaceVal(/const testingMode = (true|false);/, `const testingMode = ${testingMode};`);

            // Styles
            replaceVal(/const width = '.*?';/, `const width = '${esc(styles.width)}';`);
            replaceVal(/const height = '.*?';/, `const height = '${esc(styles.height)}';`);
            replaceVal(/const fontFamily = '.*?';/, `const fontFamily = '${esc(styles.fontFamily)}';`);

            // Theme setting (generic)
            if (newContent.includes('const theme =')) {
                replaceVal(/const theme = '.*?';/, `const theme = '${styles.theme}';`);
            }

            // Layout
            if (styles.preferredLayout.singleView) {
                replaceVal(/singleView:\s*(true|false)/, 'singleView: true');
                replaceVal(/multiView:\s*(true|false)/, 'multiView: false');
            } else {
                replaceVal(/singleView:\s*(true|false)/, 'singleView: false');
                replaceVal(/multiView:\s*(true|false)/, 'multiView: true');
            }

            // Ordering
            if (styles.preferredTaskOrdering.numbered) {
                replaceVal(/numbered:\s*(true|false)/, 'numbered: true');
                replaceVal(/checkbox:\s*(true|false)/, 'checkbox: false');
            } else {
                replaceVal(/numbered:\s*(true|false)/, 'numbered: false');
                replaceVal(/checkbox:\s*(true|false)/, 'checkbox: true');
            }

            // Header
            replaceVal(/const showHeaderDescription = (true|false);/, `const showHeaderDescription = ${styles.showHeaderDescription};`);
            replaceVal(/const taskHeaderDescription = ".*?";/, `const taskHeaderDescription = "${escDouble(styles.taskHeaderDescription)}";`);
            replaceVal(/const headerTitleFontSize = \d+;/, `const headerTitleFontSize = ${styles.headerTitleFontSize};`);
            replaceVal(/const headerDescriptionFontSize = \d+;/, `const headerDescriptionFontSize = ${styles.headerDescriptionFontSize};`);
            replaceVal(/const headerStatsFontSize = \d+;/, `const headerStatsFontSize = ${styles.headerStatsFontSize || 13};`);
            replaceVal(/const headerDetailsIconSize = \d+;/, `const headerDetailsIconSize = ${styles.headerDetailsIconSize || 16};`);

            replaceVal(/const headerTitleFontWeight = \d+;/, `const headerTitleFontWeight = ${styles.headerTitleFontWeight || 700};`);
            replaceVal(/const headerDescriptionFontWeight = \d+;/, `const headerDescriptionFontWeight = ${styles.headerDescriptionFontWeight || 400};`);
            replaceVal(/const headerStatsFontWeight = \d+;/, `const headerStatsFontWeight = ${styles.headerStatsFontWeight || 500};`);

            replaceVal(/const completionProgressFontSize = \d+;/, `const completionProgressFontSize = ${styles.completionProgressFontSize || 12};`);
            replaceVal(/const completionProgressFontWeight = \d+;/, `const completionProgressFontWeight = ${styles.completionProgressFontWeight || 500};`);

            // Colors - Fixed regex to handle both single and double quotes
            replaceVal(/const headerBackgroundColor = ['"].*?['"];/, `const headerBackgroundColor = '${esc(styles.headerBackgroundColor)}';`);
            replaceVal(/const headerTitleColor = ['"].*?['"];/, `const headerTitleColor = '${esc(styles.headerTitleColor)}';`);
            replaceVal(/const dividerColor = ['"].*?['"];/, `const dividerColor = '${esc(styles.dividerColor)}';`);
            replaceVal(/const userTasksBackgroundColor = ['"].*?['"];/, `const userTasksBackgroundColor = '${esc(styles.userTasksBackgroundColor)}';`);
            replaceVal(/const mainTextColor = ['"].*?['"];/, `const mainTextColor = '${esc(styles.mainTextColor)}';`);
            replaceVal(/const usernameColor = ['"].*?['"];/, `const usernameColor = '${esc(styles.usernameColor)}';`);
            replaceVal(/const taskCompleteMain = ['"].*?['"];/, `const taskCompleteMain = '${esc(styles.taskCompleteMain)}';`);
            replaceVal(/const checkSymbolColor = ['"].*?['"];/, `const checkSymbolColor = '${esc(styles.checkSymbolColor)}';`);
            replaceVal(/const completedTaskTextColor = ['"].*?['"];/, `const completedTaskTextColor = '${esc(styles.completedTaskTextColor)}';`);
            replaceVal(/const headerDetailsTextColor = ['"].*?['"];/, `const headerDetailsTextColor = '${esc(styles.headerDetailsTextColor)}';`);
            replaceVal(/const headerIconColor = ['"].*?['"];/, `const headerIconColor = '${esc(styles.headerIconColor)}';`);

            replaceVal(/const completionProgressMainColor = ['"].*?['"];/, `const completionProgressMainColor = '${esc(styles.completionProgressMainColor || styles.taskCompleteMain)}';`);
            replaceVal(/const completionProgressBackgroundColor = ['"].*?['"];/, `const completionProgressBackgroundColor = '${esc(styles.completionProgressBackgroundColor || styles.dividerColor)}';`);
            replaceVal(/const completionProgressTextColor = ['"].*?['"];/, `const completionProgressTextColor = '${esc(styles.completionProgressTextColor || styles.headerTitleColor)}';`);

            // Task Styling
            replaceVal(/const useUserTwitchColor = (true|false);/, `const useUserTwitchColor = ${styles.useUserTwitchColor};`);
            replaceVal(/const italicsOnCompletedTask = (true|false);/, `const italicsOnCompletedTask = ${styles.italicsOnCompletedTask};`);
            replaceVal(/const taskFontSize = \d+;/, `const taskFontSize = ${styles.taskFontSize};`);
            replaceVal(/const taskFontWeight = \d+;/, `const taskFontWeight = ${styles.taskFontWeight || 500};`);
            replaceVal(/const usernameFontSize = \d+;/, `const usernameFontSize = ${styles.usernameFontSize};`);
            replaceVal(/const usernameFontWeight = \d+;/, `const usernameFontWeight = ${styles.usernameFontWeight || 600};`);

            // Focus Mode
            replaceVal(/const focusMode = (true|false);/, `const focusMode = ${styles.focusMode || false};`);
            replaceVal(/const focusModeBackgroundColor = ['"].*?['"];/, `const focusModeBackgroundColor = '${esc(styles.focusModeBackgroundColor || '#ffffff')}';`);
            replaceVal(/const focusModeTextColor = ['"].*?['"];/, `const focusModeTextColor = '${esc(styles.focusModeTextColor || '#000000')}';`);
            replaceVal(/const focusModeCheckboxColor = ['"].*?['"];/, `const focusModeCheckboxColor = '${esc(styles.focusModeCheckboxColor || '#000000')}';`);

            const writable = await handle.createWritable();
            await writable.write(newContent);
            await writable.close();

            // Success feedback via button
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);

            // Clear any previous status text
            setSaveStatus('');

        } catch (err) {
            console.error(err);
            alert("Error saving: " + err.message);
        }
    };

    return (
        <div className="settings-page-wrapper">
            {/* Top Navigation Bar */}
            <nav className="navbar">
                <div className="navbar-left">
                    <div className="logo">
                        <span className="material-symbols-rounded" style={{ color: 'var(--primary)' }}>check_circle</span>
                        <span>Focusly</span>
                    </div>
                </div>

                <div className="navbar-center">
                    <div className="nav-links">
                        <div
                            className={`nav-link ${activeTab === 'section-auth' ? 'active' : ''}`}
                            onClick={() => setActiveTab('section-auth')}
                        >
                            Authentication
                        </div>
                        <div
                            className={`nav-link ${activeTab === 'section-appearance' ? 'active' : ''}`}
                            onClick={() => setActiveTab('section-appearance')}
                        >
                            Appearance
                        </div>
                        <div
                            className={`nav-link ${activeTab === 'section-commands' ? 'active' : ''}`}
                            onClick={() => setActiveTab('section-commands')}
                        >
                            Commands
                        </div>
                        <div
                            className={`nav-link ${activeTab === 'section-preview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('section-preview')}
                        >
                            Messages
                        </div>
                    </div>
                </div>

                <div className="navbar-right">
                    <a
                        href="https://github.com/kimothorick/Focusly"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'var(--text-muted)',
                            marginRight: '20px',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        title="View on GitHub"
                    >
                        <svg height="24" width="24" viewBox="0 0 16 16" version="1.1" style={{ fill: 'currentColor' }}>
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                        </svg>
                    </a>

                    <a
                        href="https://buymeacoffee.com/kimothorick"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'var(--text-muted)',
                            marginRight: '20px',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#FFDD00'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        title="Buy Me a Coffee"
                    >
                        <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>local_cafe</span>
                    </a>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <label className="test-mode-toggle safe-mode" title="Toggle Testing Mode">
                            <input
                                type="checkbox"
                                checked={configs.testingMode}
                                onChange={(e) => handleChange('root', 'testingMode', e.target.checked)}
                            />
                            <span className="slider"></span>
                            <span className="label-text" style={{ fontSize: '12px', fontWeight: 600 }}>Test Mode</span>
                        </label>

                        <button className="theme-toggle" aria-label="Toggle Theme" onClick={toggleTheme} style={{ width: '32px', height: '32px' }}>
                            <span className="material-symbols-rounded icon-sun" style={{ fontSize: '18px' }}>light_mode</span>
                            <span className="material-symbols-rounded icon-moon" style={{ fontSize: '18px' }}>dark_mode</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="settings-content-body">
                <main className="settings-scroll-area">
                    <div>
                        <div className="header-area">
                            <div className="page-title">
                                <div className="page-title">
                                    <h1>
                                        {activeTab === 'section-auth' ? 'Authentication' :
                                            activeTab === 'section-preview' ? 'Messages' :
                                                activeTab === 'section-commands' ? 'Commands Reference' :
                                                    'Appearance'}
                                    </h1>
                                    <p>
                                        {activeTab === 'section-auth' ? 'Manage your Twitch connection details' :
                                            activeTab === 'section-preview' ? 'Preview bot response messages' :
                                                activeTab === 'section-commands' ? 'List of all available bot commands' :
                                                    'Customize the look and feel of your overlay'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div id="settingsForm">
                            {/* Commands Section */}
                            {activeTab === 'section-commands' && <CommandList configs={configs} />}

                            {/* Message Preview Section */}
                            {activeTab === 'section-preview' && <MessagePreview configs={configs} />}

                            {/* Authentication Section */}
                            {activeTab === 'section-auth' && (
                                <div className="settings-section active">
                                    <div className="settings-grid settings-auth-wrapper">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="card-icon">
                                                    <span className="material-symbols-rounded">key</span>
                                                </div>
                                                <div className="card-title">Twitch Authentication</div>
                                            </div>
                                            <div className="form-group">
                                                <label>Channel Name</label>
                                                <input type="text" className="form-control" placeholder="e.g. rickphilip" value={configs.user.channel} onChange={(e) => handleChange('user', 'channel', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label>Bot Username</label>
                                                <input type="text" className="form-control" placeholder="e.g. focusly_bot" value={configs.user.username} onChange={(e) => handleChange('user', 'username', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label>OAuth Token</label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type={showOauth ? "text" : "password"}
                                                        className="form-control"
                                                        placeholder="oauth:xxxxxxxxxxxxx"
                                                        value={configs.user.oauth}
                                                        onChange={(e) => handleChange('user', 'oauth', e.target.value)}
                                                        style={{ paddingRight: '40px' }}
                                                    />
                                                    <span
                                                        className="material-symbols-rounded"
                                                        onClick={() => setShowOauth(!showOauth)}
                                                        style={{
                                                            position: 'absolute',
                                                            right: '10px',
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            cursor: 'pointer',
                                                            color: 'var(--text-muted)',
                                                            userSelect: 'none'
                                                        }}
                                                    >
                                                    </span>
                                                </div>
                                                <small style={{ display: 'block', marginTop: '5px', color: 'var(--text-muted)' }}>
                                                    Need a token? Get one here: <a href="https://twitchtokengenerator.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#4daafc', textDecoration: 'underline', cursor: 'pointer' }}>twitchtokengenerator.com</a>
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Appearance Section */}
                            {activeTab === 'section-appearance' && (
                                <div className="settings-section active">
                                    <div className="settings-grid">

                                        {/* Layout Card */}
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="card-icon">
                                                    <span className="material-symbols-rounded">style</span>
                                                </div>
                                                <div className="card-title">Layout & Dimensions</div>
                                            </div>

                                            <div className="form-group">
                                                <label>Layout Style</label>
                                                <div className="radio-grid">
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="layout"
                                                            checked={configs.styles.preferredLayout.singleView}
                                                            onChange={() => handleLayoutChange('singleView')}
                                                        />
                                                        <div className="radio-card">
                                                            <span className="material-symbols-rounded" style={{ fontSize: '24px', marginBottom: '8px' }}>crop_portrait</span>
                                                            <div>Single View</div>
                                                        </div>
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="layout"
                                                            checked={configs.styles.preferredLayout.multiView}
                                                            onChange={() => handleLayoutChange('multiView')}
                                                        />
                                                        <div className="radio-card">
                                                            <span className="material-symbols-rounded" style={{ fontSize: '24px', marginBottom: '8px' }}>grid_view</span>
                                                            <div>Multi View</div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Width</label>
                                                    <input type="text" className="form-control" value={configs.styles.width} onChange={(e) => handleChange('styles', 'width', e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Height</label>
                                                    <input type="text" className="form-control" value={configs.styles.height} onChange={(e) => handleChange('styles', 'height', e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Font Family (Google Fonts)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="e.g. Poppins, Roboto, Inter"
                                                    value={configs.styles.fontFamily}
                                                    onChange={(e) => handleChange('styles', 'fontFamily', e.target.value)}
                                                />
                                                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '5px' }}>
                                                    Name must match Google Fonts exactly. Ensure the font supports multiple styles/weights.
                                                </small>
                                            </div>
                                        </div>

                                        {/* Custom Colors Card (NEW) */}

                                        {/* Header Card */}
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="card-icon">
                                                    <span className="material-symbols-rounded">title</span>
                                                </div>
                                                <div className="card-title">Header Details</div>
                                            </div>

                                            <div className="form-group">
                                                <label className="checkbox-wrapper">
                                                    <input type="checkbox" checked={configs.styles.showHeaderDescription} onChange={(e) => handleChange('styles', 'showHeaderDescription', e.target.checked)} />
                                                    <div className="custom-checkbox">
                                                        <span className="material-symbols-rounded" style={{ fontSize: '16px', color: 'white' }}>check</span>
                                                    </div>
                                                    <span>Show Header Description</span>
                                                </label>
                                            </div>



                                            {/* Title Group */}
                                            <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--border-light)' }}>
                                                <label style={{ fontWeight: 600, display: 'block', marginBottom: '10px', color: 'var(--text-main)' }}>Title</label>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>Font Size</label>
                                                        <input type="number" className="form-control" value={configs.styles.headerTitleFontSize} onChange={(e) => handleChange('styles', 'headerTitleFontSize', e.target.value)} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>Font Weight</label>
                                                        <input type="number" step="100" min="100" max="900" className="form-control" value={configs.styles.headerTitleFontWeight || 700} onChange={(e) => handleChange('styles', 'headerTitleFontWeight', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description Group */}
                                            <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--border-light)' }}>
                                                <label style={{ fontWeight: 600, display: 'block', marginBottom: '10px', color: 'var(--text-main)' }}>Description</label>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>Font Size</label>
                                                        <input type="number" className="form-control" value={configs.styles.headerDescriptionFontSize} onChange={(e) => handleChange('styles', 'headerDescriptionFontSize', e.target.value)} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>Font Weight</label>
                                                        <input type="number" step="100" min="100" max="900" className="form-control" value={configs.styles.headerDescriptionFontWeight || 400} onChange={(e) => handleChange('styles', 'headerDescriptionFontWeight', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stats Group */}
                                            <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--border-light)' }}>
                                                <label style={{ fontWeight: 600, display: 'block', marginBottom: '10px', color: 'var(--text-main)' }}>Stats & Details</label>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>Font Size</label>
                                                        <input type="number" className="form-control" value={configs.styles.headerStatsFontSize} onChange={(e) => handleChange('styles', 'headerStatsFontSize', e.target.value)} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>Font Weight</label>
                                                        <input type="number" step="100" min="100" max="900" className="form-control" value={configs.styles.headerStatsFontWeight || 500} onChange={(e) => handleChange('styles', 'headerStatsFontWeight', e.target.value)} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>Icon Size</label>
                                                        <input type="number" className="form-control" value={configs.styles.headerDetailsIconSize} onChange={(e) => handleChange('styles', 'headerDetailsIconSize', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Completion Progress Group */}
                                            <div>
                                                <label style={{ fontWeight: 600, display: 'block', marginBottom: '10px', color: 'var(--text-main)' }}>Completion Progress</label>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>Font Size</label>
                                                        <input type="number" className="form-control" value={configs.styles.completionProgressFontSize} onChange={(e) => handleChange('styles', 'completionProgressFontSize', e.target.value)} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>Font Weight</label>
                                                        <input type="number" step="100" min="100" max="900" className="form-control" value={configs.styles.completionProgressFontWeight || 500} onChange={(e) => handleChange('styles', 'completionProgressFontWeight', e.target.value)} />
                                                    </div>
                                                </div>

                                                <div style={{ marginTop: '15px' }}>
                                                    <label style={{ fontSize: '0.9em', fontWeight: 600, display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Progress Colors</label>
                                                    <div className="form-row">
                                                        <GradientColorPicker
                                                            label="Progress Fill"
                                                            value={configs.styles.completionProgressMainColor || configs.styles.taskCompleteMain}
                                                            onChange={(e) => handleChange('styles', 'completionProgressMainColor', e.target.value)}
                                                        />
                                                        <GradientColorPicker
                                                            label="Progress Background"
                                                            value={configs.styles.completionProgressBackgroundColor || configs.styles.dividerColor}
                                                            onChange={(e) => handleChange('styles', 'completionProgressBackgroundColor', e.target.value)}
                                                        />
                                                        <GradientColorPicker
                                                            label="Progress Text"
                                                            value={configs.styles.completionProgressTextColor || configs.styles.headerTitleColor}
                                                            onChange={(e) => handleChange('styles', 'completionProgressTextColor', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Task Styling Card */}
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="card-icon">
                                                    <span className="material-symbols-rounded">edit_note</span>
                                                </div>
                                                <div className="card-title">Task Styling</div>
                                            </div>

                                            <div className="form-group">
                                                <label>Task Ordering</label>
                                                <div className="radio-grid">
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="ordering"
                                                            checked={configs.styles.preferredTaskOrdering.numbered}
                                                            onChange={() => handleOrderingChange('numbered')}
                                                        />
                                                        <div className="radio-card">
                                                            <span className="material-symbols-rounded" style={{ fontSize: '24px', marginBottom: '8px' }}>format_list_numbered</span>
                                                            <div>Numbered</div>
                                                        </div>
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="ordering"
                                                            checked={configs.styles.preferredTaskOrdering.checkbox}
                                                            onChange={() => handleOrderingChange('checkbox')}
                                                        />
                                                        <div className="radio-card">
                                                            <span className="material-symbols-rounded" style={{ fontSize: '24px', marginBottom: '8px' }}>check_box</span>
                                                            <div>Checkbox</div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>



                                            <div className="form-group">
                                                <label className="checkbox-wrapper">
                                                    <input type="checkbox" checked={configs.styles.italicsOnCompletedTask} onChange={(e) => handleChange('styles', 'italicsOnCompletedTask', e.target.checked)} />
                                                    <div className="custom-checkbox">
                                                        <span className="material-symbols-rounded" style={{ fontSize: '16px', color: 'white' }}>check</span>
                                                    </div>
                                                    <span>Italicize Completed Tasks</span>
                                                </label>
                                            </div>

                                            {/* Focus Mode Settings */}
                                            <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--border-light)' }}>
                                                <label style={{ fontWeight: 600, display: 'block', marginBottom: '10px', color: 'var(--text-main)' }}>Task Focus Mode</label>

                                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                                    <label className="checkbox-wrapper">
                                                        <input type="checkbox" checked={configs.styles.focusMode} onChange={(e) => handleChange('styles', 'focusMode', e.target.checked)} />
                                                        <div className="custom-checkbox">
                                                            <span className="material-symbols-rounded" style={{ fontSize: '16px', color: 'white' }}>check</span>
                                                        </div>
                                                        <span>Enable Focus Mode Style</span>
                                                    </label>
                                                    <small style={{ display: 'block', marginTop: '5px', color: 'var(--text-muted)' }}>
                                                        Highlights the current task with a distinctive pill background.
                                                    </small>
                                                </div>

                                                {configs.styles.focusMode && (
                                                    <div className="form-row">
                                                        <GradientColorPicker
                                                            label="Background"
                                                            value={configs.styles.focusModeBackgroundColor}
                                                            onChange={(e) => handleChange('styles', 'focusModeBackgroundColor', e.target.value)}
                                                        />
                                                        <GradientColorPicker
                                                            label="Text Color"
                                                            value={configs.styles.focusModeTextColor}
                                                            onChange={(e) => handleChange('styles', 'focusModeTextColor', e.target.value)}
                                                        />
                                                        <GradientColorPicker
                                                            label="Checkbox Color"
                                                            value={configs.styles.focusModeCheckboxColor}
                                                            onChange={(e) => handleChange('styles', 'focusModeCheckboxColor', e.target.value)}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Username Styling */}
                                            <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--border-light)' }}>
                                                <label style={{ fontWeight: 600, display: 'block', marginBottom: '10px', color: 'var(--text-main)' }}>Username Styling</label>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>Font Size</label>
                                                        <input type="number" className="form-control" value={configs.styles.usernameFontSize} onChange={(e) => handleChange('styles', 'usernameFontSize', e.target.value)} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>Font Weight</label>
                                                        <input type="number" step="100" min="100" max="900" className="form-control" value={configs.styles.usernameFontWeight || 600} onChange={(e) => handleChange('styles', 'usernameFontWeight', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Task Text Styling */}
                                            <div>
                                                <label style={{ fontWeight: 600, display: 'block', marginBottom: '10px', color: 'var(--text-main)' }}>Task Text Styling</label>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>Font Size</label>
                                                        <input type="number" className="form-control" value={configs.styles.taskFontSize} onChange={(e) => handleChange('styles', 'taskFontSize', e.target.value)} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>Font Weight</label>
                                                        <input type="number" step="100" min="100" max="900" className="form-control" value={configs.styles.taskFontWeight || 500} onChange={(e) => handleChange('styles', 'taskFontWeight', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        {/* Moved Custom Colors Card Here for Full Width */}
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="card-icon">
                                                    <span className="material-symbols-rounded">palette</span>
                                                </div>
                                                <div className="card-title">Custom Colors</div>
                                            </div>

                                            <CustomDropdown
                                                label="Theme Presets"
                                                value={selectedPreset}
                                                onChange={applyThemePreset}
                                                options={Object.entries(THEME_PRESETS).map(([key, preset]) => ({
                                                    key: key,
                                                    name: preset.name
                                                }))}
                                            />

                                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                                <label className="checkbox-wrapper">
                                                    <input type="checkbox" checked={configs.styles.useUserTwitchColor} onChange={(e) => handleChange('styles', 'useUserTwitchColor', e.target.checked)} />
                                                    <div className="custom-checkbox">
                                                        <span className="material-symbols-rounded" style={{ fontSize: '16px', color: 'white' }}>check</span>
                                                    </div>
                                                    <span>Use Twitch Username Chat Colors</span>
                                                </label>
                                            </div>

                                            {/* Header Colors */}
                                            <div style={{ marginBottom: '20px' }}>
                                                <label style={{ fontWeight: 600, display: 'block', marginBottom: '10px', color: 'var(--text-main)' }}>Header</label>
                                                <div className="form-row">
                                                    <GradientColorPicker
                                                        label="Background"
                                                        helperText="Main background in Single View"
                                                        value={configs.styles.headerBackgroundColor}
                                                        onChange={(e) => handleChange('styles', 'headerBackgroundColor', e.target.value)}
                                                    />
                                                    <GradientColorPicker
                                                        label="Title & Stats"
                                                        value={configs.styles.headerTitleColor}
                                                        onChange={(e) => handleChange('styles', 'headerTitleColor', e.target.value)}
                                                    />
                                                    <GradientColorPicker
                                                        label="Divider Line"
                                                        value={configs.styles.dividerColor}
                                                        onChange={(e) => handleChange('styles', 'dividerColor', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Task Colors */}
                                            <div style={{ marginBottom: '20px' }}>
                                                <label style={{ fontWeight: 600, display: 'block', marginBottom: '10px', color: 'var(--text-main)' }}>Tasks</label>
                                                <div className="form-row">
                                                    <GradientColorPicker
                                                        label="Incomplete Text"
                                                        value={configs.styles.mainTextColor}
                                                        onChange={(e) => handleChange('styles', 'mainTextColor', e.target.value)}
                                                    />
                                                    <GradientColorPicker
                                                        label="Completed Text"
                                                        value={configs.styles.completedTaskTextColor}
                                                        onChange={(e) => handleChange('styles', 'completedTaskTextColor', e.target.value)}
                                                    />
                                                    <GradientColorPicker
                                                        label="Row Background"
                                                        value={configs.styles.userTasksBackgroundColor}
                                                        onChange={(e) => handleChange('styles', 'userTasksBackgroundColor', e.target.value)}
                                                    />
                                                    <GradientColorPicker
                                                        label="Checkbox Fill"
                                                        value={configs.styles.taskCompleteMain}
                                                        onChange={(e) => handleChange('styles', 'taskCompleteMain', e.target.value)}
                                                    />
                                                    <GradientColorPicker
                                                        label="Checkbox Tick"
                                                        value={configs.styles.checkSymbolColor}
                                                        onChange={(e) => handleChange('styles', 'checkSymbolColor', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Username Colors */}
                                            <div>
                                                <label style={{ fontWeight: 600, display: 'block', marginBottom: '10px', color: 'var(--text-main)' }}>Username</label>
                                                <div className="form-row">
                                                    <GradientColorPicker
                                                        label="Text Color"
                                                        value={configs.styles.usernameColor}
                                                        onChange={(e) => handleChange('styles', 'usernameColor', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Floating Action Bar */}
                        <div className="action-bar">
                            <div className="path-helper">
                                <span className="material-symbols-rounded" style={{ color: 'var(--text-muted)' }}>folder_open</span>
                                <input type="text" className="path-input" readOnly value={calculatedPath} />
                                <button id="copyPathBtn" onClick={copyPath} className="btn btn-secondary" style={{ padding: '8px' }}>
                                    <span className="material-symbols-rounded">content_copy</span>
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <span id="fileStatus" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{saveStatus || 'Ready'}</span>
                                <button onClick={handleLoad} className="btn btn-secondary">
                                    <span className="material-symbols-rounded">upload_file</span>
                                    Load
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="btn btn-primary"
                                    style={{
                                        backgroundColor: saveSuccess ? '#22c55e' : '', // Green 500
                                        borderColor: saveSuccess ? '#22c55e' : '',
                                        transition: 'all 0.2s ease',
                                        minWidth: '90px'
                                    }}
                                >
                                    <span className="material-symbols-rounded">
                                        {saveSuccess ? 'check' : 'save'}
                                    </span>
                                    {saveSuccess ? 'Saved!' : 'Save'}
                                </button>
                            </div>
                        </div>

                        {/* Preview Pane (Right Side) */}

                    </div>
                </main>

                {/* Preview Pane (Right Side) */}
                <div className="preview-pane">
                    <div className="preview-label">Live Preview</div>
                    <iframe
                        ref={iframeRef}
                        src="index.html"
                        className="preview-frame"
                        title="Widget Preview"
                    />
                </div>
            </div >
        </div >
    );
}
