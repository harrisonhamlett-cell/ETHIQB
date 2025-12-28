import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Plus, Trash2, Building2, User, Search, Shield, LogOut, Upload, Download, Mail } from 'lucide-react';
import { Logo } from './ui/Logo';
import { UserStore, User as UserType } from '../utils/userStoreProduction';
import { CSVParser } from '../utils/csvParser';
import { EmailService } from '../utils/emailService';
import { EmailPreviewModal, EmailContent } from './EmailPreviewModal';

interface AdminPanelProps {
  onLogout: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    type: 'advisor' as 'company' | 'advisor' | 'admin',
    companyRelationship: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'company' | 'advisor' | 'admin'>('all');
  const [formError, setFormError] = useState<React.ReactNode>('');
  const [formSuccess, setFormSuccess] = useState('');
  const [csvError, setCSVError] = useState<string[]>([]);
  const [csvSuccess, setCSVSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [counts, setCounts] = useState({ total: 0, companies: 0, advisors: 0, admins: 0 });
  
  // Email preview modal state
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [pendingInvite, setPendingInvite] = useState<{
    recipientName: string;
    recipientEmail: string;
    companyRelationship: string;
    userType: string;
    temporaryPassword: string;
  } | null>(null);

  // Duplicate user handling
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateUserData, setDuplicateUserData] = useState<{
    email: string;
    name: string;
    type: 'company' | 'advisor' | 'admin';
    companyRelationship: string;
    existingUserId?: string;
  } | null>(null);

  // Load users from UserStore on mount
  useEffect(() => {
    loadUsers();
    initDB();
  }, []);

  const initDB = async () => {
    const result = await UserStore.initDatabase();
    if (!result.success) {
      console.error('Failed to initialize database:', result.error);
    }
  };

  const loadUsers = async () => {
    const allUsers = await UserStore.getUsers();
    setUsers(allUsers);
    const userCounts = await UserStore.getCounts();
    setCounts(userCounts);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setIsProcessing(true);

    // Validation
    if (!newUser.email || !newUser.name) {
      setFormError('Please fill in all required fields');
      setIsProcessing(false);
      return;
    }

    if (!newUser.email.includes('@')) {
      setFormError('Please enter a valid email address');
      setIsProcessing(false);
      return;
    }

    if (newUser.type !== 'admin' && !newUser.companyRelationship) {
      setFormError('Company Relationship is required for Advisors and Companies');
      setIsProcessing(false);
      return;
    }

    // Check if email already exists
    const emailExists = await UserStore.emailExists(newUser.email);
    if (emailExists) {
      // Find the existing user
      const existingUser = users.find(u => u.email.toLowerCase() === newUser.email.toLowerCase());
      
      setDuplicateUserData({
        email: newUser.email,
        name: newUser.name,
        type: newUser.type,
        companyRelationship: newUser.companyRelationship,
        existingUserId: existingUser?.id,
      });
      setShowDuplicateModal(true);
      setIsProcessing(false);
      return;
    }

    // Generate temporary password
    const tempPassword = EmailService.generateTemporaryPassword();

    // Add user to store
    const result = await UserStore.addUser({
      email: newUser.email,
      name: newUser.name,
      type: newUser.type,
      password: tempPassword,
      companyRelationship: newUser.companyRelationship || undefined,
      inviteStatus: 'pending',
    });

    if (!result.success) {
      setFormError(`Failed to add user: ${result.error}`);
      setIsProcessing(false);
      return;
    }

    // Show email preview modal instead of sending directly
    setPendingInvite({
      recipientEmail: newUser.email,
      recipientName: newUser.name,
      companyRelationship: newUser.companyRelationship || 'EthIQ',
      userType: newUser.type,
      temporaryPassword: result.temporaryPassword || tempPassword,
    });
    setShowEmailPreview(true);
    setIsProcessing(false);
  };

  const handleSendEmail = async (emailContent: EmailContent) => {
    if (!pendingInvite) return;

    setShowEmailPreview(false);
    setIsProcessing(true);

    // Send invitation email with customized content
    const emailResult = await UserStore.sendInviteEmail({
      ...pendingInvite,
      customSubject: emailContent.subject,
      customBody: emailContent.body,
    });

    if (!emailResult.success) {
      setFormError(`Failed to send email: ${emailResult.error}`);
    } else {
      setFormSuccess(`✓ User added and invitation sent to ${pendingInvite.recipientEmail}`);
      
      // Show temp password in console for demo
      console.log(`🔐 Temporary password for ${pendingInvite.recipientEmail}: ${pendingInvite.temporaryPassword}`);
    }

    // Reload users and reset form
    await loadUsers();
    setNewUser({ email: '', name: '', type: 'advisor', companyRelationship: '' });
    setPendingInvite(null);
    setIsProcessing(false);
    
    // Auto-close success message after 3 seconds
    if (emailResult.success) {
      setTimeout(() => {
        setFormSuccess('');
        setShowAddForm(false);
      }, 3000);
    }
  };

  const handleCancelEmail = () => {
    setShowEmailPreview(false);
    setPendingInvite(null);
    setFormSuccess(`✓ User added to database. You can send the invitation later.`);
    
    setTimeout(() => {
      setFormSuccess('');
      setShowAddForm(false);
    }, 3000);
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setCSVError([]);
    setCSVSuccess('');

    try {
      const result = await CSVParser.parseUserCSV(file);

      if (!result.success || !result.data) {
        setCSVError(result.errors || ['Failed to parse CSV file']);
        setIsProcessing(false);
        return;
      }

      let successCount = 0;
      let skipCount = 0;
      const errors: string[] = [];

      // Process each row
      for (const row of result.data) {
        // Check if email already exists
        const emailExists = await UserStore.emailExists(row.email);
        if (emailExists) {
          skipCount++;
          errors.push(`Skipped ${row.email} - already exists`);
          continue;
        }

        // Generate temporary password
        const tempPassword = EmailService.generateTemporaryPassword();

        // Add user
        const addResult = await UserStore.addUser({
          email: row.email,
          name: row.name,
          type: row.userType,
          password: tempPassword,
          companyRelationship: row.companyRelationship,
          inviteStatus: 'pending',
        });

        if (!addResult.success) {
          errors.push(`Failed to add ${row.email}: ${addResult.error}`);
          continue;
        }

        // Send invitation email
        await UserStore.sendInviteEmail({
          recipientEmail: row.email,
          recipientName: row.name,
          companyRelationship: row.companyRelationship,
          userType: row.userType,
          temporaryPassword: addResult.temporaryPassword || tempPassword,
        });

        successCount++;
      }

      // Show results
      setCSVSuccess(
        `Successfully added ${successCount} user(s). ${skipCount > 0 ? `Skipped ${skipCount} duplicate(s).` : ''}`
      );
      
      if (errors.length > 0) {
        setCSVError(errors);
      }

      // Reload users
      await loadUsers();

      // Auto-close after 5 seconds
      setTimeout(() => {
        setCSVSuccess('');
        setCSVError([]);
        setShowCSVUpload(false);
      }, 5000);
    } catch (error) {
      setCSVError([
        'Failed to process CSV file',
        error instanceof Error ? error.message : 'Unknown error',
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await UserStore.deleteUser(userId);
      if (result.success) {
        await loadUsers();
      } else {
        alert(`Failed to delete user: ${result.error}`);
      }
    }
  };

  const handleReplaceUser = async () => {
    if (!duplicateUserData || !duplicateUserData.existingUserId) return;

    setShowDuplicateModal(false);
    setIsProcessing(true);

    // Add the company relationship to the existing user
    const result = await UserStore.addCompanyRelationship(
      duplicateUserData.existingUserId,
      duplicateUserData.companyRelationship
    );

    if (!result.success) {
      setFormError(result.error || 'Failed to add company relationship');
      setIsProcessing(false);
      setDuplicateUserData(null);
      return;
    }

    // Reload users to show updated data
    await loadUsers();

    // Show success message
    setFormSuccess(`Successfully added ${duplicateUserData.companyRelationship} to ${duplicateUserData.name}'s company relationships!`);
    setShowAddForm(false);
    setNewUser({
      name: '',
      email: '',
      type: 'advisor',
      companyRelationship: '',
    });
    setDuplicateUserData(null);
    setIsProcessing(false);
  };

  const handleCancelReplace = () => {
    setShowDuplicateModal(false);
    setDuplicateUserData(null);
    setIsProcessing(false);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.companyRelationship?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || user.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo className="h-10 w-auto" />
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowAddForm(true)} variant="secondary">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
              <Button onClick={() => setShowCSVUpload(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload CSV
              </Button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#163BB5] to-[#2D5FE8] flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{counts.total}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4A90E2] to-[#5CA4F5] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Companies</p>
                <p className="text-2xl font-semibold text-gray-900">{counts.companies}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1E88E5] to-[#42A5F5] flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Advisors</p>
                <p className="text-2xl font-semibold text-gray-900">{counts.advisors}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF5722] to-[#FF9800] flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Admins</p>
                <p className="text-2xl font-semibold text-gray-900">{counts.admins}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* CSV Upload Modal */}
        {showCSVUpload && (
          <Card className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">Upload Users from CSV</h2>
              <button
                onClick={() => {
                  setShowCSVUpload(false);
                  setCSVError([]);
                  setCSVSuccess('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Instructions */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">CSV Format Requirements:</span>
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                  <li>Required columns: Company Relationship, Name, Email, User Type</li>
                  <li>User Type must be "Advisor" or "Company"</li>
                  <li>Email addresses must be valid and unique</li>
                  <li>Maximum file size: 5MB</li>
                </ul>
              </div>

              {/* Download Template */}
              <Button
                variant="secondary"
                onClick={() => CSVParser.downloadSampleCSV()}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV Template
              </Button>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  disabled={isProcessing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                />
              </div>

              {/* Processing indicator */}
              {isProcessing && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Processing CSV file and sending invitations...
                  </p>
                </div>
              )}

              {/* Success Message */}
              {csvSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">{csvSuccess}</p>
                </div>
              )}

              {/* Error Messages */}
              {csvError.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-semibold mb-2">Errors:</p>
                  <ul className="text-sm text-red-700 space-y-1 ml-4 list-disc">
                    {csvError.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Add User Form */}
        {showAddForm && (
          <Card className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">Add New User</h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewUser({ email: '', name: '', type: 'advisor', companyRelationship: '' });
                  setFormError('');
                  setFormSuccess('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-6">
              {/* User Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewUser({ ...newUser, type: 'company' })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      newUser.type === 'company'
                        ? 'border-[#163BB5] bg-blue-50 text-[#163BB5]'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1" />
                    Company
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewUser({ ...newUser, type: 'advisor' })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      newUser.type === 'advisor'
                        ? 'border-[#163BB5] bg-blue-50 text-[#163BB5]'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <User className="w-4 h-4 mx-auto mb-1" />
                    Advisor
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewUser({ ...newUser, type: 'admin' })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      newUser.type === 'admin'
                        ? 'border-[#FF5722] bg-red-50 text-[#FF5722]'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Shield className="w-4 h-4 mx-auto mb-1" />
                    Admin
                  </button>
                </div>
              </div>

              {/* Company Relationship (not for admin) */}
              {newUser.type !== 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Relationship
                  </label>
                  <input
                    type="text"
                    value={newUser.companyRelationship}
                    onChange={(e) => setNewUser({ ...newUser, companyRelationship: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                    placeholder="e.g., Acme Corp, TechStart Inc"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The company inviting this user to EthIQ
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {newUser.type === 'company' ? 'Company Name' : newUser.type === 'advisor' ? 'Advisor Name' : 'Admin Name'}
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                    placeholder={newUser.type === 'company' ? 'Acme Corp' : 'John Doe'}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                    placeholder="user@example.com"
                    required
                  />
                </div>
              </div>

              {/* Info about invitation */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#163BB5] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Invitation Email:</span> An invitation will be sent to the user's email with:
                  </p>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1 ml-4 list-disc">
                    <li>Welcome message from {newUser.companyRelationship || 'EthIQ'}</li>
                    <li>Link to learn more about EthIQ</li>
                    <li>Temporary login credentials</li>
                  </ul>
                </div>
              </div>

              {/* Form Error */}
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              )}

              {/* Form Success */}
              {formSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">{formSuccess}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <Button type="submit">
                  <Mail className="w-4 h-4 mr-2" />
                  Add User & Send Invite
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewUser({ email: '', name: '', type: 'advisor', companyRelationship: '' });
                    setFormError('');
                    setFormSuccess('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Search and Filter */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or company..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  filterType === 'all'
                    ? 'bg-[#163BB5] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('company')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  filterType === 'company'
                    ? 'bg-[#163BB5] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Companies
              </button>
              <button
                onClick={() => setFilterType('advisor')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  filterType === 'advisor'
                    ? 'bg-[#163BB5] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Advisors
              </button>
              <button
                onClick={() => setFilterType('admin')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  filterType === 'admin'
                    ? 'bg-[#FF5722] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admins
              </button>
            </div>
          </div>
        </Card>

        {/* Users List */}
        <Card>
          <h2 className="text-gray-900 mb-6">
            All Users ({filteredUsers.length})
          </h2>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
              <p className="text-sm text-gray-500 mt-2">
                Click "Add User" or "Upload CSV" to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Company</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                            user.type === 'company'
                              ? 'bg-blue-100 text-blue-700'
                              : user.type === 'advisor'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {user.type === 'company' ? (
                            <Building2 className="w-3 h-3" />
                          ) : user.type === 'admin' ? (
                            <Shield className="w-3 h-3" />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                          {user.type === 'company' ? 'Company' : user.type === 'advisor' ? 'Advisor' : 'Admin'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">{user.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {user.companyRelationships && user.companyRelationships.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.companyRelationships.map((company, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
                              >
                                {company}
                              </span>
                            ))}
                          </div>
                        ) : user.companyRelationship ? (
                          user.companyRelationship
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            user.inviteStatus === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : user.inviteStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {user.inviteStatus === 'accepted' ? 'Active' : user.inviteStatus === 'pending' ? 'Pending' : 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Email Preview Modal */}
      {showEmailPreview && pendingInvite && (
        <EmailPreviewModal
          recipientName={pendingInvite.recipientName}
          recipientEmail={pendingInvite.recipientEmail}
          companyRelationship={pendingInvite.companyRelationship}
          userType={pendingInvite.userType}
          temporaryPassword={pendingInvite.temporaryPassword}
          onSend={handleSendEmail}
          onCancel={handleCancelEmail}
        />
      )}

      {/* Duplicate User Modal */}
      {showDuplicateModal && duplicateUserData && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleCancelReplace} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-2xl z-50 max-w-md w-full mx-4">
            <h2 className="text-gray-900 mb-4">Add Company Relationship</h2>
            <p className="text-gray-600 mb-6">
              The advisor <strong>{duplicateUserData.name}</strong> ({duplicateUserData.email}) already exists in the system.
              <br /><br />
              Would you like to add <strong>{duplicateUserData.companyRelationship}</strong> to their list of company relationships?
              <br /><br />
              <span className="text-sm text-gray-500">This advisor will be able to see all their company relationships in one dashboard.</span>
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleReplaceUser}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? 'Adding...' : 'Add Company Relationship'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelReplace}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}