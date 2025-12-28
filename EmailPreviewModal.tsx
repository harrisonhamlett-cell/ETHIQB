import { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { X, Mail, Edit2, Eye } from 'lucide-react';

interface EmailPreviewModalProps {
  recipientName: string;
  recipientEmail: string;
  companyRelationship: string;
  userType: string;
  temporaryPassword: string;
  onSend: (customizedEmail: EmailContent) => void;
  onCancel: () => void;
}

export interface EmailContent {
  subject: string;
  body: string;
}

export function EmailPreviewModal({
  recipientName,
  recipientEmail,
  companyRelationship,
  userType,
  temporaryPassword,
  onSend,
  onCancel,
}: EmailPreviewModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Default email template
  const defaultSubject = `You've been invited to join ${companyRelationship} on EthIQ Board`;
  const defaultBody = `Hello ${recipientName},

You're receiving this message because ${companyRelationship} is now using EthIQ Board to manage, engage, and support its advisors.

EthIQ Board is a purpose-built platform designed to bring clarity and structure to advisory relationships. It helps companies and advisors stay aligned on expectations, engagement, and outcomes so that advisors can contribute meaningfully, and leadership teams can make better use of their guidance.

Through the platform, you'll be able to:

- View your advisory role, scope, and terms in one place

- Engage with the company more clearly and consistently

- Track requests, contributions, and outcomes over time

Your account has been created with the following details:

Email: ${recipientEmail}
Role: ${userType.charAt(0).toUpperCase() + userType.slice(1)}
Temporary Password: ${temporaryPassword}

To get started:
1. Visit the EthIQ login page
2. Enter your email and temporary password
3. You'll be prompted to set a new password
4. Complete your profile setup

Best regards,
The EthIQ Board Team`;

  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);

  const handleSend = () => {
    onSend({ subject, body });
  };

  const handleReset = () => {
    setSubject(defaultSubject);
    setBody(defaultBody);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#163BB5] to-[#4A90E2] rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900">Preview Invitation Email</h2>
              <p className="text-sm text-gray-500">Review and customize before sending</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-3 border-b border-gray-200 flex gap-2">
          <button
            onClick={() => setIsEditing(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !isEditing
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Preview
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isEditing
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Edit2 className="w-4 h-4 inline mr-2" />
            Edit
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isEditing ? (
            // Edit Mode
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                  placeholder="Email subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Body
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={16}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent font-mono text-sm resize-none"
                  placeholder="Email message"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Reset to default
                </button>
              </div>
            </div>
          ) : (
            // Preview Mode
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Email Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="text-gray-500 w-16">To:</span>
                    <span className="text-gray-900">{recipientEmail}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-16">From:</span>
                    <span className="text-gray-900">EthIQ &lt;noreply@ethiq.com&gt;</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-16">Subject:</span>
                    <span className="text-gray-900 font-medium">{subject}</span>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="px-6 py-6">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-900 leading-relaxed">
                    {body}
                  </pre>
                </div>
              </div>

              {/* Email Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  This is an automated invitation from EthIQ Board
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Recipient:</span> {recipientName} ({recipientEmail})
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              className="bg-gradient-to-r from-[#163BB5] to-[#4A90E2]"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
