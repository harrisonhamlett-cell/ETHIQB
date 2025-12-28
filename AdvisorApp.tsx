import { useState } from 'react';
import { CompanySelection } from './advisor/CompanySelection';
import { Layout } from './Layout';
import { Sidebar } from './Sidebar';
import { AdvisorHome } from './advisor/AdvisorHome';
import { AdvisorContacts } from './advisor/AdvisorContacts';
import { AdvisorHandshakes } from './advisor/AdvisorHandshakes';
import { AdvisorNudges } from './advisor/AdvisorNudges';
import { AdvisorCompanies } from './advisor/AdvisorCompanies';
import { AdvisorOnboarding } from './advisor/AdvisorOnboarding';
import { AdvisorProfileEdit } from './advisor/AdvisorProfileEdit';
import { AdvisorEngagement } from './advisor/AdvisorEngagement';
import { useToast } from './ui/Toast';
import { User } from '../utils/userStoreProduction';
import { mockNudges, mockContacts, mockHandshakes, mockAdvisors, Nudge, Contact, Handshake, Advisor } from '../data/mockData';

interface AdvisorAppProps {
  currentUser: User;
}

export function AdvisorApp({ currentUser }: AdvisorAppProps) {
  const [isOnboarded, setIsOnboarded] = useState(true); // Changed to true for demo/design purposes
  const [selectedCompanyId, setSelectedCompanyId] = useState('comp1');
  const [currentPage, setCurrentPage] = useState('home');
  const [nudges, setNudges] = useState<Nudge[]>(mockNudges);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [handshakes, setHandshakes] = useState<Handshake[]>(mockHandshakes);
  // Mock logged-in advisor (in real app, this would come from auth)
  const [currentAdvisor, setCurrentAdvisor] = useState<Advisor>(mockAdvisors[0]);
  const { showToast, ToastComponent } = useToast();

  // Get advisor's company relationships from currentUser
  const companyRelationships = currentUser.companyRelationships || [];

  const handleOnboardingComplete = (data: any) => {
    console.log('Onboarding data:', data);
    console.log('New advisor registered with email:', data.email);
    // In a real app, this would make an API call to register the user
    // For now, we'll update the current advisor with the onboarding data
    setCurrentAdvisor((prev) => ({
      ...prev,
      email: data.email,
      name: data.name,
      bio: data.bio,
      open_to_new_advisory_boards: data.open_to_new_advisory_boards,
      special_domains: data.special_domains,
      interests: data.interests,
      executive_type: data.executive_type,
    }));
    setIsOnboarded(true);
    showToast('Welcome to Ethiq! Your profile has been created.');
  };

  const handleAcceptNudge = (nudgeId: string) => {
    setNudges(
      nudges.map((n) =>
        n.id === nudgeId ? { ...n, status: 'Accepted', updated_at: new Date().toISOString() } : n
      )
    );
    showToast('Nudge accepted');
  };

  const handleDeclineNudge = (nudgeId: string) => {
    setNudges(
      nudges.map((n) =>
        n.id === nudgeId ? { ...n, status: 'Declined', updated_at: new Date().toISOString() } : n
      )
    );
    showToast('Nudge declined');
  };

  const handleMarkComplete = (nudgeId: string) => {
    setNudges(
      nudges.map((n) =>
        n.id === nudgeId
          ? { ...n, advisor_completed: true, updated_at: new Date().toISOString() }
          : n
      )
    );
    showToast('Nudge marked as complete');
  };

  const handleAcceptContact = (contactId: string) => {
    setContacts(
      contacts.map((k) =>
        k.id === contactId
          ? { ...k, status: 'Accepted', responded_at: new Date().toISOString() }
          : k
      )
    );
    showToast('Contact accepted');
  };

  const handleDeclineContact = (contactId: string) => {
    setContacts(
      contacts.map((k) =>
        k.id === contactId
          ? { ...k, status: 'Declined', responded_at: new Date().toISOString() }
          : k
      )
    );
    showToast('Contact declined');
  };

  const handleAcceptHandshake = (handshakeId: string) => {
    setHandshakes(
      handshakes.map((h) =>
        h.id === handshakeId
          ? { ...h, status: 'Active', updated_at: new Date().toISOString() }
          : h
      )
    );
    showToast('Handshake accepted');
  };

  const handleDismissHandshake = (handshakeId: string) => {
    setHandshakes(
      handshakes.map((h) =>
        h.id === handshakeId
          ? { ...h, status: 'Dismissed', updated_at: new Date().toISOString() }
          : h
      )
    );
    showToast('Handshake dismissed');
  };

  const handleProfileUpdate = (updatedData: Partial<Advisor>) => {
    setCurrentAdvisor((prev) => ({ ...prev, ...updatedData }));
    setCurrentPage('home');
    showToast('Profile updated successfully');
  };

  if (!isOnboarded) {
    return (
      <>
        <AdvisorOnboarding onComplete={handleOnboardingComplete} />
        <ToastComponent />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <AdvisorHome
            nudges={nudges}
            advisor={currentAdvisor}
            onNavigate={setCurrentPage}
          />
        );
      case 'contacts':
        return (
          <AdvisorContacts
            contacts={contacts}
            advisor={currentAdvisor}
            onAccept={handleAcceptContact}
            onDecline={handleDeclineContact}
          />
        );
      case 'handshakes':
        return (
          <AdvisorHandshakes
            handshakes={handshakes}
            onAccept={handleAcceptHandshake}
            onDismiss={handleDismissHandshake}
          />
        );
      case 'nudges':
        return (
          <AdvisorNudges
            nudges={nudges}
            onAccept={handleAcceptNudge}
            onDecline={handleDeclineNudge}
            onMarkComplete={handleMarkComplete}
          />
        );
      case 'companies':
        return <AdvisorCompanies handshakes={handshakes} />;
      case 'profile':
        return (
          <AdvisorProfileEdit
            advisor={currentAdvisor}
            onSave={handleProfileUpdate}
            onCancel={() => setCurrentPage('home')}
          />
        );
      case 'profile-edit':
        return (
          <AdvisorProfileEdit
            advisor={currentAdvisor}
            onSave={handleProfileUpdate}
            onCancel={() => setCurrentPage('home')}
          />
        );
      case 'engagement':
        return (
          <AdvisorEngagement
            nudges={nudges}
            handshakes={handshakes}
            contacts={contacts}
            onNavigate={setCurrentPage}
          />
        );
      default:
        return (
          <AdvisorHome
            nudges={nudges}
            advisor={currentAdvisor}
            onNavigate={setCurrentPage}
          />
        );
    }
  };

  return (
    <>
      <Layout
        sidebar={<Sidebar userType="advisor" currentPage={currentPage} onNavigate={setCurrentPage} />}
      >
        {renderPage()}
      </Layout>
      <ToastComponent />
    </>
  );
}