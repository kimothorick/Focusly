import React, { useMemo } from 'react';

const replaceStrings = (text, replacements) => {
    let result = text || "";
    for (const [key, value] of Object.entries(replacements)) {
        result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return result;
};

// Dummy Data for Previews
const PREVIEW_DATA = {
    user: "User",
    mod: "Moderator",
    adminTarget: "TargetUser",
    command: "command",
    task: "[1] \"Sample Task\"",
    tasks: "[1] \"Task One\" • [2] \"Task Two\" • [3] \"Task Three\"",
    taskNumber: "1",
    invalidIds: "99, 100"
};

const MessagePreview = ({ configs }) => {
    const responses = configs?.responses || {};

    const previewList = useMemo(() => {
        return Object.entries(responses).map(([key, template]) => {
            const previewText = replaceStrings(template, PREVIEW_DATA);
            return { key, template, previewText };
        });
    }, [responses]);

    return (
        <div className="settings-section active">
            <div className="settings-section active">
                <div className="card">
                    <div className="card-header">
                        <div className="card-icon">
                            <span className="material-symbols-rounded">chat</span>
                        </div>
                        <div className="card-title">Message Previews</div>
                    </div>

                    <div style={{ padding: '20px' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                            These are previews of how the bot will respond to various commands, using current configuration and dummy data.
                        </p>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '15px'
                        }}>
                            {previewList.map(({ key, template, previewText }) => (
                                <div key={key} style={{
                                    padding: '12px',
                                    background: 'var(--bg-panel-hover)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-light)',
                                    minWidth: 0
                                }}>
                                    <div style={{
                                        fontSize: '12px',
                                        color: 'var(--text-muted)',
                                        fontWeight: 600,
                                        marginBottom: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </div>
                                    <div style={{
                                        color: 'var(--text-main)',
                                        fontSize: '14px',
                                        wordBreak: 'break-word'
                                    }}>
                                        {previewText}
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        color: 'var(--text-muted)',
                                        marginTop: '4px',
                                        fontStyle: 'italic',
                                        opacity: 0.7,
                                        wordBreak: 'break-word'
                                    }}>
                                        Template: {template}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagePreview;
