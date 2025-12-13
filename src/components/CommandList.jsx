import React from 'react';

const COMMAND_DEFINITIONS = [
    // User Commands
    {
        key: 'addTaskCommands',
        label: 'Add Task',
        type: 'User',
        description: 'Add a new task to your list.',
        examples: [
            { usage: 'Play Minecraft', desc: 'Single Task' },
            { usage: 'Task A; Task B; Task C', desc: 'Add Multiple (Split by ;)' },
            { usage: 'Do laundry', desc: 'Using Task Alias', customTrigger: '!task' }
        ]
    },

    {
        key: 'finishTaskCommands',
        label: 'Finish Task',
        type: 'User',
        description: 'Mark a task as completed.',
        examples: [
            { usage: '1', desc: 'Single Task' },
            { usage: '1; 2; 3', desc: 'Finish Multiple' }
        ]
    },
    {
        key: 'deleteTaskCommands',
        label: 'Delete Task',
        type: 'User',
        description: 'Remove specific tasks from your list.',
        examples: [
            { usage: '1', desc: 'Single Task' },
            { usage: '1; 2', desc: 'Delete Multiple' }
        ]
    },
    {
        key: 'editTaskCommands',
        label: 'Edit Task',
        type: 'User',
        description: 'Update the content of an existing task.',
        examples: [{ usage: '1 New Task Name', desc: 'Update Task #1' }]
    },
    {
        key: 'setCurrentTaskCommands',
        label: 'Set Focus',
        type: 'User',
        description: 'Set a specific task as your current focus.',
        examples: [{ usage: '1', desc: 'Focus on Task #1' }]
    },
    {
        key: 'checkCurrentTaskCommands',
        label: 'Check Focus',
        type: 'User',
        description: 'Check what your current focus task is.',
        examples: [{ usage: '', desc: 'Check Current' }]
    },
    {
        key: 'removeCurrentTaskCommands',
        label: 'Unfocus',
        type: 'User',
        description: 'Remove your current focus task.',
        examples: [{ usage: '', desc: 'Clear Current' }]
    },
    {
        key: 'checkIncompleteTasksCommands',
        label: 'Check Pending',
        type: 'User',
        description: 'View all your incomplete tasks.',
        examples: [{ usage: '', desc: 'List Pending' }]
    },
    {
        key: 'checkAllTasksCommands',
        label: 'Check All',
        type: 'User',
        description: 'View all tasks on your list.',
        examples: [{ usage: '', desc: 'List All' }]
    },
    {
        key: 'deleteAllTasksCommands',
        label: 'Clear List',
        type: 'User',
        description: 'Delete all your tasks.',
        examples: [{ usage: '', desc: 'Delete All' }]
    },
    {
        key: 'helpCommands',
        label: 'Help',
        type: 'User',
        description: 'View help message.',
        examples: [{ usage: '', desc: 'Show Help' }]
    },

    // Admin Commands
    {
        key: 'adminDeleteCommands',
        label: 'Admin Delete',
        type: 'Admin',
        description: 'Delete tasks for a specific user.',
        examples: [{ usage: '@username', desc: 'Delete User Tasks' }]
    },
    {
        key: 'adminClearTaskListCommands',
        label: 'Clear All',
        type: 'Admin',
        description: 'Clear the entire task board.',
        examples: [{ usage: '', desc: 'Clear Board' }]
    },
    {
        key: 'adminClearDoneCommands',
        label: 'Clear Completed',
        type: 'Admin',
        description: 'Clear all completed tasks from the board.',
        examples: [{ usage: '', desc: 'Clear Done' }]
    },
    {
        key: 'adminResetCounterCommands',
        label: 'Reset All',
        type: 'Admin',
        description: 'Reset all counters and wipe data.',
        examples: [{ usage: '', desc: 'Full Reset' }]
    },
];

const CommandList = ({ configs }) => {
    const commands = configs?.commands || {};

    const renderCommandGroup = (type) => {
        const groupCommands = COMMAND_DEFINITIONS.filter(cmd => cmd.type === type);

        return (
            <div style={{ marginBottom: '30px' }}>
                <h3 style={{
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: '15px',
                    paddingLeft: '5px',
                    borderLeft: `3px solid ${type === 'Admin' ? 'var(--danger)' : 'var(--primary)'}`
                }}>
                    {type} Commands
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '15px',
                    alignItems: 'start'
                }}>
                    {groupCommands.map(({ key, label, description, examples }) => {
                        const triggers = commands[key] || [];
                        const primaryTrigger = triggers[0] || 'command';

                        return (
                            <div key={key} style={{
                                padding: '15px',
                                background: 'var(--bg-panel-hover)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-light)',
                                display: 'flex',
                                flexDirection: 'column',
                                minWidth: 0 // Prevent grid blowout
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{label}</span>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                    {description}
                                </p>

                                {/* Triggers List */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '15px' }}>
                                    {triggers.map(trigger => (
                                        <span key={trigger} style={{
                                            fontSize: '11px',
                                            padding: '2px 6px',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '4px',
                                            fontFamily: 'monospace',
                                            color: 'var(--text-muted)'
                                        }}>
                                            !{trigger}
                                        </span>
                                    ))}
                                </div>

                                {/* Dynamic Usage Examples */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {examples.map((ex, idx) => (
                                        <div key={idx} style={{
                                            fontSize: '12px',
                                            background: 'rgba(145, 70, 255, 0.08)',
                                            padding: '8px 10px',
                                            borderRadius: '4px',
                                            borderLeft: '2px solid var(--primary)'
                                        }}>
                                            <div style={{
                                                fontSize: '10px',
                                                textTransform: 'uppercase',
                                                color: 'var(--primary)',
                                                marginBottom: '2px',
                                                fontWeight: 600
                                            }}>
                                                {ex.desc}
                                            </div>
                                            <div style={{
                                                fontFamily: 'monospace',
                                                color: 'var(--text-main)',
                                                wordBreak: 'break-word' // Ensure long commands wrap
                                            }}>
                                                {ex.customTrigger ? ex.customTrigger : `!${primaryTrigger}`} {ex.usage}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="settings-section active">
            <div className="card">
                <div className="card-header">
                    <div className="card-icon">
                        <span className="material-symbols-rounded">terminal</span>
                    </div>
                    <div className="card-title">Available Commands</div>
                </div>

                <div style={{ padding: '20px' }}>
                    {renderCommandGroup('User')}
                    <div style={{ margin: '20px 0', height: '1px', background: 'var(--border-light)' }}></div>
                    {renderCommandGroup('Admin')}
                </div>
            </div>
        </div>
    );
};

export default CommandList;
