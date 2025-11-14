import React, { useState } from 'react';

const TestEmail: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({
        type: '',
        text: '',
    });

    const handleSendTestEmail = async () => {
        if (!email) {
            setMessage({ type: 'error', text: 'Please enter an email address' });
            return;
        }

        // Validacija email formata
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(
                `http://localhost:5000/api/Test/send-test-email?toEmail=${encodeURIComponent(email)}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: 'Test email sent successfully! Check your inbox (and spam folder).',
                });
                setEmail('');
            } else {
                const error = await response.text();
                setMessage({
                    type: 'error',
                    text: error || 'Failed to send email. Check backend configuration.',
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Failed to connect to backend. Make sure the API is running on port 5000.',
            });
            console.error('Error sending test email:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendTestEmail();
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>📧 Test Email Service</h2>
                <p style={styles.description}>
                    Test your email configuration by sending a test email
                </p>

                <div style={styles.formGroup}>
                    <label htmlFor="test-email" style={styles.label}>
                        Email Address
                    </label>
                    <input
                        id="test-email"
                        type="email"
                        placeholder="your-email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={styles.input}
                        disabled={loading}
                    />
                </div>

                <button
                    onClick={handleSendTestEmail}
                    disabled={loading}
                    style={{
                        ...styles.button,
                        ...(loading ? styles.buttonDisabled : {}),
                    }}
                >
                    {loading ? 'Sending...' : 'Send Test Email'}
                </button>

                {message.text && (
                    <div
                        style={{
                            ...styles.message,
                            ...(message.type === 'success' ? styles.messageSuccess : styles.messageError),
                        }}
                    >
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f7fafc',
        padding: '20px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '32px',
        width: '100%',
        maxWidth: '500px',
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: '8px',
        textAlign: 'center',
    },
    description: {
        fontSize: '14px',
        color: '#718096',
        marginBottom: '24px',
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: '#4a5568',
        marginBottom: '8px',
    },
    input: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        backgroundColor: '#4299e1',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    buttonDisabled: {
        backgroundColor: '#a0aec0',
        cursor: 'not-allowed',
    },
    message: {
        marginTop: '16px',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px',
    },
    messageSuccess: {
        backgroundColor: '#c6f6d5',
        color: '#2f855a',
        border: '1px solid #9ae6b4',
    },
    messageError: {
        backgroundColor: '#fed7d7',
        color: '#c53030',
        border: '1px solid #fc8181',
    },
};

export default TestEmail;