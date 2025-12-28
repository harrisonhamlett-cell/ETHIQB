// Centralized user store with localStorage persistence

export interface User {
  id: string;
  email: string;
  type: 'company' | 'advisor' | 'admin';
  name: string;
  password: string;
  createdAt: string;
  companyRelationship?: string; // The company that invited this user
  inviteStatus?: 'pending' | 'accepted'; // Track if user has accepted invite
}

const STORAGE_KEY = 'ethiq_users';

// Initialize with Harrison as the first admin
const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    email: 'Harrison@Absurd.Consulting',
    type: 'admin',
    name: 'Harrison Hamlett',
    password: 'Ethiqisabsurd2025!',
    createdAt: new Date().toISOString(),
  },
];

export class UserStore {
  // Get all users from localStorage
  static getUsers(): User[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // If no users exist, initialize with Harrison
      this.saveUsers(INITIAL_USERS);
      return INITIAL_USERS;
    } catch (error) {
      console.error('Error loading users:', error);
      return INITIAL_USERS;
    }
  }

  // Save users to localStorage
  static saveUsers(users: User[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  // Add a new user
  static addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  // Delete a user
  static deleteUser(userId: string): void {
    const users = this.getUsers();
    const filtered = users.filter((u) => u.id !== userId);
    this.saveUsers(filtered);
  }

  // Authenticate user by email and password
  static authenticate(email: string, password: string): User | null {
    const users = this.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    return user || null;
  }

  // Check if email exists
  static emailExists(email: string): boolean {
    const users = this.getUsers();
    return users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  // Get user by email
  static getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  // Update user password
  static updatePassword(email: string, newPassword: string): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      this.saveUsers(users);
      return true;
    }
    return false;
  }

  // Update user
  static updateUser(userId: string, updates: Partial<User>): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      this.saveUsers(users);
      return true;
    }
    return false;
  }

  // Get counts by type
  static getCounts() {
    const users = this.getUsers();
    return {
      total: users.length,
      companies: users.filter((u) => u.type === 'company').length,
      advisors: users.filter((u) => u.type === 'advisor').length,
      admins: users.filter((u) => u.type === 'admin').length,
    };
  }
}