import { Home, Users, User, Send, Inbox, Handshake, Globe, Zap } from 'lucide-react';
import { Logo } from './ui/Logo';

interface SidebarProps {
  userType: 'company' | 'advisor';
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ userType, currentPage, onNavigate }: SidebarProps) {
  const companyNavItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'relationships', label: 'Advisors', icon: Users },
    { id: 'directory', label: 'Directory', icon: Globe },
    { id: 'handshakes', label: 'Handshakes', icon: Handshake },
    { id: 'nudges', label: 'Nudges', icon: Zap },
  ];

  const advisorMenuItems = [
    { id: 'home', label: 'Dashboard', icon: Inbox },
    { id: 'nudges', label: 'Nudges', icon: Zap },
    { id: 'companies', label: 'Company Relationships', icon: Users },
    { id: 'contacts', label: 'New Opportunities', icon: Send },
    { id: 'handshakes', label: 'Handshakes', icon: Handshake },
  ];

  const navItems = userType === 'company' ? companyNavItems : advisorMenuItems;

  return (
    <div className="px-6 py-4 flex items-center gap-8">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm whitespace-nowrap ${
                isActive
                  ? 'bg-[#163BB5] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}