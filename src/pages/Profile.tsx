import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { User, Mail, Bell, BellOff, Send } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    emailNotificationsEnabled: user?.emailNotificationsEnabled || false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Test Email state
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailMessage, setTestEmailMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({
    type: '',
    text: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const updatedUser = await authApi.updateProfile({
        id: user!.id,
        ...formData,
      });
      updateUser(updatedUser);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Test Email Handler
  const handleSendTestEmail = async () => {
    if (!formData.email) {
      setTestEmailMessage({ type: 'error', text: 'Email address is required' });
      return;
    }

    setTestEmailLoading(true);
    setTestEmailMessage({ type: '', text: '' });

    try {
      const response = await fetch(
        `http://localhost:5000/api/Test/send-test-email?toEmail=${encodeURIComponent(formData.email)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setTestEmailMessage({
          type: 'success',
          text: 'Test email sent successfully! Check your inbox (and spam folder).',
        });
      } else {
        const error = await response.text();
        setTestEmailMessage({
          type: 'error',
          text: error || 'Failed to send email. Check backend configuration.',
        });
      }
    } catch (error) {
      setTestEmailMessage({
        type: 'error',
        text: 'Failed to connect to backend. Make sure the API is running.',
      });
      console.error('Error sending test email:', error);
    } finally {
      setTestEmailLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg ${message.includes('success')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
              }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-10 bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-3">
                {formData.emailNotificationsEnabled ? (
                  <Bell className="w-5 h-5 text-primary-600 mt-0.5" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-400 mt-0.5" />
                )}
                <div>
                  <label htmlFor="emailNotificationsEnabled" className="font-medium text-gray-900">
                    Email Notifications
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Receive weekly skill summaries and reminders to update your skills
                  </p>
                </div>
              </div>
              <input
                id="emailNotificationsEnabled"
                name="emailNotificationsEnabled"
                type="checkbox"
                checked={formData.emailNotificationsEnabled}
                onChange={handleChange}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Test Email Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Test Email Configuration</h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3 mb-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">Send Test Email</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Verify your email configuration by sending a test email to your address
                  </p>
                </div>
              </div>

              {testEmailMessage.text && (
                <div
                  className={`mb-3 p-3 rounded-lg text-sm ${testEmailMessage.type === 'success'
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                >
                  {testEmailMessage.text}
                </div>
              )}

              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={testEmailLoading || !formData.email}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{testEmailLoading ? 'Sending...' : 'Send Test Email'}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;