import { useState } from 'react';
import { Layout } from './Layout';
import { Sidebar } from './Sidebar';
import { CompanyHome } from './company/CompanyHome';
import { Directory } from './company/Directory';
import { Relationships } from './company/Relationships';
import { SendContact } from './company/SendContact';
import { AdvisorProfile } from './company/AdvisorProfile';
import { CompanyHandshakes } from './company/CompanyHandshakes';
import { ProposeHandshake } from './company/ProposeHandshake';
import { CreateNudge } from './company/CreateNudge';
import { CompanyNudges } from './company/CompanyNudges';
import { useToast } from './ui/Toast';
import { User } from '../utils/userStoreProduction';
import {
  mockNudges,
  mockRelationships,
  mockContacts,
  mockHandshakes,
  Nudge,
  Relationship,
  Contact,
  Handshake,
  Advisor,
} from '../data/mockData';

interface CompanyAppProps {
  currentUser: User;
}

export function CompanyApp({ currentUser }: CompanyAppProps) {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [nudges, setNudges] = useState<Nudge[]>(mockNudges);
  const [relationships, setRelationships] = useState<Relationship[]>(mockRelationships);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [handshakes, setHandshakes] = useState<Handshake[]>(mockHandshakes);
  const { showToast, ToastComponent } = useToast();

  // Get the company name from currentUser
  const companyName = currentUser.name;

  const handleSendContact = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setCurrentPage('send-contact');
  };

  const handleSubmitContact = (message: string, advisor: Advisor, cadence: string, compensation: string) => {
    const newContact: Contact = {
      id: `kn${Date.now()}`,
      company_id: 'comp1',
      advisor_id: advisor.id,
      company_relationship: companyName, // NEW: Store company name
      message,
      status: 'Sent',
      created_at: new Date().toISOString(),
      cadence,
      compensation,
    };

    setContacts([newContact, ...contacts]);
    showToast('Contact sent successfully');
    setCurrentPage('directory');
    setSelectedAdvisor(null);
  };

  const handleViewProfile = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setCurrentPage('advisor-profile');
  };

  const handleProposeHandshake = (advisor?: Advisor) => {
    if (advisor) {
      setSelectedAdvisor(advisor);
    }
    setCurrentPage('propose-handshake');
  };

  const handleSubmitHandshake = (
    advisor: Advisor,
    capacityHours: number,
    cadence: string,
    responseExpectation: string,
    channels: string[],
    focusAreas: string[],
    startDate: string,
    reviewDate: string,
    notes: string
  ) => {
    const newHandshake: Handshake = {
      id: `hs${Date.now()}`,
      company_id: 'comp1',
      advisor_id: advisor.id,
      company_relationship: companyName, // NEW: Store company name
      engagement_style: cadence as any,
      channels: channels as any,
      response_expectation: responseExpectation as any,
      capacity_hours_per_month: capacityHours,
      focus_areas: focusAreas,
      start_date: startDate || undefined,
      review_date: reviewDate || undefined,
      status: 'Proposed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: notes || undefined,
    };

    setHandshakes([newHandshake, ...handshakes]);
    showToast('Handshake sent');
    setCurrentPage('handshakes');
    setSelectedAdvisor(null);
  };

  const handleCreateNudge = (details: string, nudgeTag: string, maxTime: string, advisor: Advisor) => {
    const newNudge: Nudge = {
      id: `n${Date.now()}`,
      company_id: 'comp1',
      advisor_id: advisor.id,
      company_relationship: companyName, // NEW: Store company name
      details,
      nudge_tag: nudgeTag as any,
      max_time_requested: maxTime,
      status: 'Sent',
      advisor_completed: false,
      company_confirmed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setNudges([newNudge, ...nudges]);

    // Update relationship interaction count
    setRelationships(
      relationships.map((rel) =>
        rel.advisor_id === advisor.id
          ? { ...rel, interaction_count: rel.interaction_count + 1 }
          : rel
      )
    );

    showToast('Nudge sent successfully');
    setCurrentPage('nudges');
    setSelectedAdvisor(null);
  };

  const handleConfirmComplete = (nudgeId: string) => {
    setNudges(
      nudges.map((n) =>
        n.id === nudgeId
          ? { ...n, company_confirmed: true, status: 'Completed', updated_at: new Date().toISOString() }
          : n
      )
    );
    showToast('Nudge marked as completed');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <CompanyHome nudges={nudges} onNavigate={setCurrentPage} />;
      case 'directory':
        return (
          <Directory
            companyName={companyName}
            knocks={contacts}
            onSendKnock={handleSendContact}
            onViewProfile={handleViewProfile}
          />
        );
      case 'relationships':
        return (
          <Relationships
            relationships={relationships}
            handshakes={handshakes}
            onViewProfile={handleViewProfile}
            onSendNudge={(advisor) => {
              setSelectedAdvisor(advisor);
              setCurrentPage('create-nudge');
            }}
            onProposeHandshake={handleProposeHandshake}
            onBrowseDirectory={() => setCurrentPage('directory')}
          />
        );
      case 'send-contact':
        return (
          <SendContact
            selectedAdvisor={selectedAdvisor}
            onSubmit={handleSubmitContact}
            onCancel={() => {
              setCurrentPage('directory');
              setSelectedAdvisor(null);
            }}
          />
        );
      case 'advisor-profile':
        if (!selectedAdvisor) {
          setCurrentPage('directory');
          return null;
        }
        const relationship = relationships.find((r) => r.advisor_id === selectedAdvisor.id);
        const knock = contacts.find((k) => k.advisor_id === selectedAdvisor.id);
        const advisorHandshakes = handshakes.filter((h) => h.advisor_id === selectedAdvisor.id);
        const advisorNudges = nudges.filter((n) => n.advisor_id === selectedAdvisor.id);

        return (
          <AdvisorProfile
            advisor={selectedAdvisor}
            relationship={relationship || null}
            knock={knock || null}
            handshakes={advisorHandshakes}
            nudges={advisorNudges}
            onBack={() => {
              setCurrentPage('directory');
              setSelectedAdvisor(null);
            }}
            onSendKnock={() => handleSendContact(selectedAdvisor)}
            onProposeHandshake={() => handleProposeHandshake(selectedAdvisor)}
            onSendNudge={() => {
              setCurrentPage('create-nudge');
            }}
          />
        );
      case 'handshakes':
        return (
          <CompanyHandshakes
            handshakes={handshakes}
            onProposeHandshake={() => handleProposeHandshake()}
            onViewHandshake={(h) => {
              // Could implement a handshake detail view
              showToast('Handshake details view coming soon');
            }}
          />
        );
      case 'propose-handshake':
        return (
          <ProposeHandshake
            companyName={companyName}
            selectedAdvisor={selectedAdvisor}
            relationships={relationships}
            knocks={contacts}
            onSubmit={handleSubmitHandshake}
            onCancel={() => {
              setCurrentPage('handshakes');
              setSelectedAdvisor(null);
            }}
          />
        );
      case 'create-nudge':
        return (
          <CreateNudge
            companyName={companyName}
            selectedAdvisor={selectedAdvisor}
            handshakes={handshakes}
            onSubmit={handleCreateNudge}
            onCancel={() => {
              setCurrentPage(selectedAdvisor ? 'advisor-profile' : 'nudges');
              setSelectedAdvisor(null);
            }}
            onProposeHandshake={() => handleProposeHandshake(selectedAdvisor || undefined)}
          />
        );
      case 'nudges':
        return <CompanyNudges nudges={nudges} onConfirmComplete={handleConfirmComplete} />;
      default:
        return <CompanyHome nudges={nudges} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <Layout
        sidebar={
          <Sidebar
            userType="company"
            currentPage={currentPage}
            onNavigate={(page) => {
              setCurrentPage(page);
              setSelectedAdvisor(null);
            }}
          />
        }
      >
        {renderPage()}
      </Layout>
      <ToastComponent />
    </>
  );
}