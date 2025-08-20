import { NextResponse } from 'next/server';
import {
  LPGPRelationshipResponse,
  LPOrganization,
  LPContact,
  LPInvestment,
  Communication,
  Meeting,
  Task,
  LPReport,
  RelationshipPlan,
  CRMActivity,
  RelationshipSummary,
  RecentActivity,
  UpcomingActivity,
  FundraisingOpportunity,
  LPGPRelationshipStats,
  ContactPreferences,
  InvestmentStrategy,
  Participant,
  Attachment
} from '@/types/lpgp-relationship';

// Mock data generation
const generateMockLPOrganizations = (): LPOrganization[] => {
  const organizations: LPOrganization[] = [
    {
      id: 'lp-001',
      name: 'CalPERS',
      legalName: 'California Public Employees\' Retirement System',
      organizationType: 'PENSION_FUND',
      description: 'The largest public pension fund in the United States, serving California public employees with comprehensive retirement and health benefits.',
      website: 'https://www.calpers.ca.gov',
      headquarters: 'Sacramento, CA, USA',
      aum: 469000000000, // $469B AUM
      currency: 'USD',
      investmentStrategy: {
        allocationTargets: [
          { assetClass: 'Private Equity', targetPercentage: 8, currentPercentage: 7.2 },
          { assetClass: 'Public Equity', targetPercentage: 50, currentPercentage: 52.1 },
          { assetClass: 'Fixed Income', targetPercentage: 28, currentPercentage: 26.8 },
          { assetClass: 'Real Assets', targetPercentage: 14, currentPercentage: 13.9 }
        ],
        geographicPreferences: ['North America', 'Europe', 'Asia'],
        sectorPreferences: ['Technology', 'Healthcare', 'Infrastructure'],
        investmentSize: { minimum: 50000000, maximum: 500000000, typical: 150000000 },
        dueDiligenceFocus: ['ESG', 'Risk Management', 'Track Record', 'Team Stability']
      },
      riskProfile: 'MODERATE',
      investmentHorizon: 10,
      liquidityNeeds: 'MEDIUM',
      relationshipStatus: 'ACTIVE_LP',
      relationshipTier: 'TIER_1',
      onboardingDate: new Date('2019-03-15'),
      lastInvestment: new Date('2024-02-20'),
      totalCommitments: 750000000,
      totalInvested: 520000000,
      totalDistributions: 280000000,
      numberOfFunds: 5,
      jurisdiction: 'California, USA',
      regulatoryConstraints: ['ERISA compliance', 'California state investment restrictions'],
      taxConsiderations: ['Tax-exempt status', 'UBIT considerations'],
      dueDiligenceRequirements: ['Third-party background checks', 'ESG assessment', 'Risk management review'],
      reportingRequirements: ['Quarterly performance reports', 'Annual ESG reporting', 'Portfolio company updates'],
      meetingPreferences: ['Quarterly updates', 'Annual meetings', 'On-site visits'],
      isActive: true,
      notes: 'Tier 1 LP with strong relationship. Focus on ESG and sustainable investing. Prefers larger fund sizes.',
      tags: ['tier-1', 'esg-focused', 'pension-fund', 'california'],
      createdBy: 'system',
      createdAt: new Date('2019-01-01'),
      updatedBy: 'user-rm-001',
      updatedAt: new Date('2024-07-15'),
    },
    {
      id: 'lp-002',
      name: 'Ontario Teachers\' Pension Plan',
      legalName: 'Ontario Teachers\' Pension Plan Board',
      organizationType: 'PENSION_FUND',
      description: 'One of Canada\'s largest single-profession pension plans, serving Ontario\'s teachers with innovative investment strategies.',
      website: 'https://www.otpp.com',
      headquarters: 'Toronto, ON, Canada',
      aum: 247000000000, // $247B CAD
      currency: 'CAD',
      investmentStrategy: {
        allocationTargets: [
          { assetClass: 'Private Equity', targetPercentage: 12, currentPercentage: 11.8 },
          { assetClass: 'Public Equity', targetPercentage: 45, currentPercentage: 46.2 },
          { assetClass: 'Fixed Income', targetPercentage: 25, currentPercentage: 24.1 },
          { assetClass: 'Real Assets', targetPercentage: 18, currentPercentage: 17.9 }
        ],
        geographicPreferences: ['North America', 'Europe'],
        sectorPreferences: ['Education Technology', 'Healthcare', 'Financial Services'],
        investmentSize: { minimum: 75000000, maximum: 300000000, typical: 125000000 },
        dueDiligenceFocus: ['Innovation', 'Management Quality', 'Market Position']
      },
      riskProfile: 'MODERATE',
      investmentHorizon: 12,
      liquidityNeeds: 'LOW',
      relationshipStatus: 'ACTIVE_LP',
      relationshipTier: 'TIER_1',
      onboardingDate: new Date('2020-06-01'),
      lastInvestment: new Date('2024-01-15'),
      totalCommitments: 485000000,
      totalInvested: 320000000,
      totalDistributions: 145000000,
      numberOfFunds: 4,
      jurisdiction: 'Ontario, Canada',
      isActive: true,
      notes: 'Strong relationship with Teachers\' focus on education technology investments.',
      tags: ['tier-1', 'canadian', 'education-focused'],
      createdBy: 'system',
      createdAt: new Date('2020-01-01'),
      updatedBy: 'user-rm-002',
      updatedAt: new Date('2024-06-20'),
    },
    {
      id: 'lp-003',
      name: 'Abu Dhabi Investment Authority',
      legalName: 'Abu Dhabi Investment Authority',
      organizationType: 'SOVEREIGN_WEALTH',
      description: 'One of the world\'s largest sovereign wealth funds, managing the emirate\'s excess oil revenues.',
      website: 'https://www.adia.ae',
      headquarters: 'Abu Dhabi, UAE',
      aum: 853000000000, // $853B estimated
      currency: 'USD',
      investmentStrategy: {
        allocationTargets: [
          { assetClass: 'Private Equity', targetPercentage: 15, currentPercentage: 14.5 },
          { assetClass: 'Public Equity', targetPercentage: 35, currentPercentage: 36.1 },
          { assetClass: 'Fixed Income', targetPercentage: 20, currentPercentage: 19.8 },
          { assetClass: 'Real Assets', targetPercentage: 30, currentPercentage: 29.6 }
        ],
        geographicPreferences: ['Global', 'Emerging Markets', 'Asia'],
        sectorPreferences: ['Energy', 'Infrastructure', 'Technology'],
        investmentSize: { minimum: 100000000, maximum: 1000000000, typical: 250000000 },
        dueDiligenceFocus: ['Long-term Value', 'Global Diversification', 'Risk-Return Profile']
      },
      riskProfile: 'MODERATE',
      investmentHorizon: 20,
      liquidityNeeds: 'LOW',
      relationshipStatus: 'ACTIVE_LP',
      relationshipTier: 'TIER_1',
      onboardingDate: new Date('2018-09-12'),
      lastInvestment: new Date('2024-03-08'),
      totalCommitments: 1250000000,
      totalInvested: 890000000,
      totalDistributions: 420000000,
      numberOfFunds: 7,
      jurisdiction: 'UAE',
      isActive: true,
      notes: 'Strategic sovereign wealth fund relationship. Focus on large-scale, diversified investments.',
      tags: ['tier-1', 'sovereign-wealth', 'middle-east', 'large-scale'],
      createdBy: 'system',
      createdAt: new Date('2018-01-01'),
      updatedBy: 'user-rm-003',
      updatedAt: new Date('2024-07-01'),
    },
    {
      id: 'lp-004',
      name: 'Yale University Endowment',
      legalName: 'Yale University',
      organizationType: 'ENDOWMENT',
      description: 'Prestigious university endowment known for pioneering alternative investment strategies and the Yale Model.',
      website: 'https://investments.yale.edu',
      headquarters: 'New Haven, CT, USA',
      aum: 41400000000, // $41.4B
      currency: 'USD',
      investmentStrategy: {
        allocationTargets: [
          { assetClass: 'Private Equity', targetPercentage: 25, currentPercentage: 24.8 },
          { assetClass: 'Hedge Funds', targetPercentage: 20, currentPercentage: 19.5 },
          { assetClass: 'Real Assets', targetPercentage: 25, currentPercentage: 25.2 },
          { assetClass: 'Public Equity', targetPercentage: 15, currentPercentage: 15.8 },
          { assetClass: 'Fixed Income', targetPercentage: 15, currentPercentage: 14.7 }
        ],
        geographicPreferences: ['Global', 'Emerging Markets'],
        sectorPreferences: ['Innovation', 'Sustainability', 'Education'],
        investmentSize: { minimum: 25000000, maximum: 150000000, typical: 75000000 },
        dueDiligenceFocus: ['Innovation', 'Long-term Thinking', 'Sustainable Returns']
      },
      riskProfile: 'AGGRESSIVE',
      investmentHorizon: 15,
      liquidityNeeds: 'LOW',
      relationshipStatus: 'ACTIVE_LP',
      relationshipTier: 'TIER_2',
      onboardingDate: new Date('2021-01-20'),
      lastInvestment: new Date('2024-04-10'),
      totalCommitments: 325000000,
      totalInvested: 180000000,
      totalDistributions: 95000000,
      numberOfFunds: 3,
      jurisdiction: 'Connecticut, USA',
      isActive: true,
      notes: 'Innovation-focused endowment. Strong preference for pioneering investment strategies.',
      tags: ['tier-2', 'endowment', 'innovation-focused', 'yale-model'],
      createdBy: 'system',
      createdAt: new Date('2021-01-01'),
      updatedBy: 'user-rm-001',
      updatedAt: new Date('2024-05-15'),
    },
    {
      id: 'lp-005',
      name: 'Singapore GIC',
      legalName: 'GIC Private Limited',
      organizationType: 'SOVEREIGN_WEALTH',
      description: 'Singapore\'s sovereign wealth fund focused on long-term value creation and global diversification.',
      website: 'https://www.gic.com.sg',
      headquarters: 'Singapore',
      aum: 690000000000, // $690B estimated
      currency: 'USD',
      investmentStrategy: {
        allocationTargets: [
          { assetClass: 'Private Equity', targetPercentage: 12, currentPercentage: 11.7 },
          { assetClass: 'Public Equity', targetPercentage: 40, currentPercentage: 41.2 },
          { assetClass: 'Fixed Income', targetPercentage: 25, currentPercentage: 24.6 },
          { assetClass: 'Real Assets', targetPercentage: 23, currentPercentage: 22.5 }
        ],
        geographicPreferences: ['Asia', 'North America', 'Europe'],
        sectorPreferences: ['Technology', 'Financial Services', 'Real Estate'],
        investmentSize: { minimum: 50000000, maximum: 500000000, typical: 200000000 },
        dueDiligenceFocus: ['Risk Management', 'Governance', 'Sustainability']
      },
      riskProfile: 'MODERATE',
      investmentHorizon: 25,
      liquidityNeeds: 'LOW',
      relationshipStatus: 'PROSPECT',
      relationshipTier: 'PROSPECT',
      totalCommitments: 0,
      totalInvested: 0,
      totalDistributions: 0,
      numberOfFunds: 0,
      jurisdiction: 'Singapore',
      isActive: true,
      notes: 'High-potential prospect. Recently expressed interest in our sustainability-focused strategies.',
      tags: ['prospect', 'sovereign-wealth', 'singapore', 'asia-focus'],
      createdBy: 'user-rm-004',
      createdAt: new Date('2024-06-01'),
      updatedBy: 'user-rm-004',
      updatedAt: new Date('2024-07-10'),
    }
  ];

  return organizations;
};

const generateMockLPContacts = (organizations: LPOrganization[]): LPContact[] => {
  const contacts: LPContact[] = [
    {
      id: 'contact-001',
      lpOrganizationId: 'lp-001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      title: 'Senior Investment Director',
      department: 'Private Markets',
      email: 'sarah.johnson@calpers.ca.gov',
      phoneOffice: '+1-916-555-7000',
      phoneMobile: '+1-916-555-7001',
      linkedIn: 'https://linkedin.com/in/sarah-johnson-calpers',
      role: 'PRIMARY_CONTACT',
      seniority: 'SENIOR',
      decisionMaking: 'DECISION_MAKER',
      relationshipTier: 'TIER_1',
      trustLevel: 'HIGH',
      communicationStyle: 'TECHNICAL',
      preferences: {
        preferredCommunication: ['EMAIL', 'MEETING'],
        bestTimeToContact: '9AM-5PM PST',
        timeZone: 'PST',
        languagePreference: 'English',
        communicationFrequency: 'MONTHLY',
        interests: ['ESG Investing', 'Risk Management', 'Innovation'],
        personalNotes: ['Prefers detailed analysis', 'Values transparency', 'Stanford MBA']
      },
      notes: 'Key decision maker for private equity allocations. Strong advocate for ESG investing.',
      tags: ['decision-maker', 'esg-advocate', 'analytical'],
      lastContact: new Date('2024-07-10'),
      nextFollowUp: new Date('2024-08-15'),
      meetingFrequency: 'QUARTERLY',
      isActive: true,
      createdBy: 'system',
      createdAt: new Date('2019-03-15'),
      updatedBy: 'user-rm-001',
      updatedAt: new Date('2024-07-10'),
    },
    {
      id: 'contact-002',
      lpOrganizationId: 'lp-002',
      firstName: 'Michael',
      lastName: 'Chen',
      title: 'Managing Director',
      department: 'Private Capital',
      email: 'michael.chen@otpp.com',
      phoneOffice: '+1-416-555-8000',
      linkedIn: 'https://linkedin.com/in/michael-chen-otpp',
      role: 'PRIMARY_CONTACT',
      seniority: 'EXECUTIVE',
      decisionMaking: 'DECISION_MAKER',
      relationshipTier: 'TIER_1',
      trustLevel: 'VERY_HIGH',
      communicationStyle: 'EXECUTIVE',
      preferences: {
        preferredCommunication: ['EMAIL', 'PHONE'],
        bestTimeToContact: '8AM-6PM EST',
        timeZone: 'EST',
        languagePreference: 'English',
        communicationFrequency: 'MONTHLY',
        interests: ['Education Technology', 'Innovation', 'Canadian Markets'],
        personalNotes: ['Former McKinsey consultant', 'Hockey enthusiast', 'University of Toronto alumnus']
      },
      notes: 'Long-standing relationship. Focus on education technology and innovation investments.',
      tags: ['decision-maker', 'innovation-focused', 'canadian'],
      lastContact: new Date('2024-06-25'),
      nextFollowUp: new Date('2024-08-01'),
      meetingFrequency: 'MONTHLY',
      isActive: true,
      createdBy: 'system',
      createdAt: new Date('2020-06-01'),
      updatedBy: 'user-rm-002',
      updatedAt: new Date('2024-06-25'),
    },
    {
      id: 'contact-003',
      lpOrganizationId: 'lp-003',
      firstName: 'Ahmed',
      lastName: 'Al-Mansouri',
      title: 'Head of Private Equity',
      department: 'Alternative Investments',
      email: 'ahmed.almansouri@adia.ae',
      phoneOffice: '+971-2-555-9000',
      role: 'PRIMARY_CONTACT',
      seniority: 'SENIOR',
      decisionMaking: 'INFLUENCER',
      relationshipTier: 'TIER_1',
      trustLevel: 'HIGH',
      communicationStyle: 'FORMAL',
      preferences: {
        preferredCommunication: ['EMAIL', 'MEETING'],
        bestTimeToContact: '9AM-5PM GST',
        timeZone: 'GST',
        languagePreference: 'English',
        communicationFrequency: 'QUARTERLY',
        interests: ['Infrastructure', 'Energy Transition', 'Global Markets'],
        personalNotes: ['London Business School MBA', 'Former Goldman Sachs', 'Multilingual']
      },
      notes: 'Influential contact for ADIA allocations. Strong focus on infrastructure and energy investments.',
      tags: ['influencer', 'infrastructure-focused', 'middle-east'],
      lastContact: new Date('2024-07-01'),
      nextFollowUp: new Date('2024-09-01'),
      meetingFrequency: 'QUARTERLY',
      isActive: true,
      createdBy: 'system',
      createdAt: new Date('2018-09-12'),
      updatedBy: 'user-rm-003',
      updatedAt: new Date('2024-07-01'),
    },
    {
      id: 'contact-004',
      lpOrganizationId: 'lp-004',
      firstName: 'Jennifer',
      lastName: 'Rodriguez',
      title: 'Investment Associate',
      department: 'Alternative Investments',
      email: 'jennifer.rodriguez@yale.edu',
      phoneOffice: '+1-203-555-4000',
      role: 'INVESTMENT_COMMITTEE',
      seniority: 'JUNIOR',
      decisionMaking: 'GATEKEEPER',
      relationshipTier: 'TIER_2',
      trustLevel: 'MEDIUM',
      communicationStyle: 'TECHNICAL',
      preferences: {
        preferredCommunication: ['EMAIL'],
        bestTimeToContact: '10AM-4PM EST',
        timeZone: 'EST',
        languagePreference: 'English',
        communicationFrequency: 'MONTHLY',
        interests: ['Impact Investing', 'Data Analytics', 'Behavioral Finance'],
        personalNotes: ['Yale PhD Economics', 'Data-driven approach', 'Rising star']
      },
      notes: 'Junior but influential contact. Strong analytical skills and focus on impact investing.',
      tags: ['gatekeeper', 'analytical', 'impact-investing'],
      lastContact: new Date('2024-06-15'),
      nextFollowUp: new Date('2024-07-30'),
      meetingFrequency: 'MONTHLY',
      isActive: true,
      createdBy: 'system',
      createdAt: new Date('2021-01-20'),
      updatedBy: 'user-rm-001',
      updatedAt: new Date('2024-06-15'),
    },
    {
      id: 'contact-005',
      lpOrganizationId: 'lp-005',
      firstName: 'David',
      lastName: 'Tan',
      title: 'Vice President',
      department: 'Private Equity',
      email: 'david.tan@gic.com.sg',
      phoneOffice: '+65-6555-8000',
      role: 'PRIMARY_CONTACT',
      seniority: 'SENIOR',
      decisionMaking: 'INFLUENCER',
      relationshipTier: 'PROSPECT',
      trustLevel: 'MEDIUM',
      communicationStyle: 'TECHNICAL',
      preferences: {
        preferredCommunication: ['EMAIL', 'VIDEO_CALL'],
        bestTimeToContact: '9AM-6PM SGT',
        timeZone: 'SGT',
        languagePreference: 'English',
        communicationFrequency: 'MONTHLY',
        interests: ['Technology', 'Asia Markets', 'Sustainability'],
        personalNotes: ['NUS alumnus', 'Tech background', 'Sustainability advocate']
      },
      notes: 'New prospect contact. Showed strong interest in our ESG-focused strategy during initial meeting.',
      tags: ['prospect', 'tech-background', 'sustainability'],
      lastContact: new Date('2024-07-08'),
      nextFollowUp: new Date('2024-08-05'),
      isActive: true,
      createdBy: 'user-rm-004',
      createdAt: new Date('2024-06-01'),
      updatedBy: 'user-rm-004',
      updatedAt: new Date('2024-07-08'),
    }
  ];

  return contacts;
};

const generateRelationshipSummaries = (organizations: LPOrganization[], contacts: LPContact[]): RelationshipSummary[] => {
  return organizations.map(org => {
    const primaryContact = contacts.find(c => c.lpOrganizationId === org.id && c.role === 'PRIMARY_CONTACT');
    const baseScore = org.relationshipTier === 'TIER_1' ? 85 : org.relationshipTier === 'TIER_2' ? 70 : 55;
    const relationshipScore = baseScore + Math.floor(Math.random() * 15);
    
    return {
      lpOrganization: org,
      primaryContact,
      lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      nextActivity: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
      relationshipScore,
      commitmentPotential: org.aum ? org.aum * 0.001 : 100000000, // Rough estimate
      riskLevel: org.relationshipTier === 'TIER_1' ? 'LOW' : org.relationshipTier === 'TIER_2' ? 'MEDIUM' : 'HIGH',
      healthStatus: relationshipScore > 80 ? 'EXCELLENT' : relationshipScore > 65 ? 'GOOD' : relationshipScore > 50 ? 'FAIR' : 'POOR'
    };
  });
};

const generateRecentActivities = (): RecentActivity[] => {
  return [
    {
      id: 'activity-001',
      type: 'COMMUNICATION',
      description: 'Quarterly update call discussing fund performance and ESG initiatives',
      lpOrganizationName: 'CalPERS',
      contactName: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      priority: 'HIGH'
    },
    {
      id: 'activity-002',
      type: 'MEETING',
      description: 'Investment committee presentation for Fund IV opportunity',
      lpOrganizationName: 'Ontario Teachers\' Pension Plan',
      contactName: 'Michael Chen',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      priority: 'HIGH'
    },
    {
      id: 'activity-003',
      type: 'TASK',
      description: 'Completed due diligence materials review for sustainability framework',
      lpOrganizationName: 'Yale University Endowment',
      contactName: 'Jennifer Rodriguez',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      priority: 'MEDIUM'
    },
    {
      id: 'activity-004',
      type: 'COMMUNICATION',
      description: 'Follow-up email regarding infrastructure investment opportunities',
      lpOrganizationName: 'Abu Dhabi Investment Authority',
      contactName: 'Ahmed Al-Mansouri',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      priority: 'MEDIUM'
    },
    {
      id: 'activity-005',
      type: 'MEETING',
      description: 'Initial introduction meeting to discuss investment philosophy',
      lpOrganizationName: 'Singapore GIC',
      contactName: 'David Tan',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      priority: 'HIGH'
    }
  ];
};

const generateUpcomingActivities = (): UpcomingActivity[] => {
  return [
    {
      id: 'upcoming-001',
      type: 'MEETING',
      title: 'Annual LP Meeting - Fund III Performance Review',
      description: 'Comprehensive annual review of Fund III performance and portfolio updates',
      lpOrganizationName: 'CalPERS',
      contactName: 'Sarah Johnson',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      priority: 'HIGH',
      status: 'SCHEDULED'
    },
    {
      id: 'upcoming-002',
      type: 'TASK',
      title: 'Prepare ESG Impact Report',
      description: 'Quarterly ESG impact assessment for portfolio companies',
      lpOrganizationName: 'Yale University Endowment',
      contactName: 'Jennifer Rodriguez',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      priority: 'MEDIUM',
      status: 'IN_PROGRESS'
    },
    {
      id: 'upcoming-003',
      type: 'FOLLOW_UP',
      title: 'Fund IV Investment Decision Follow-up',
      lpOrganizationName: 'Ontario Teachers\' Pension Plan',
      contactName: 'Michael Chen',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: 'HIGH',
      status: 'PENDING'
    },
    {
      id: 'upcoming-004',
      type: 'MEETING',
      title: 'Infrastructure Strategy Discussion',
      description: 'Deep dive into infrastructure investment opportunities and strategy alignment',
      lpOrganizationName: 'Abu Dhabi Investment Authority',
      contactName: 'Ahmed Al-Mansouri',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      priority: 'MEDIUM',
      status: 'SCHEDULED'
    },
    {
      id: 'upcoming-005',
      type: 'REPORT_DUE',
      title: 'Q2 Performance Report Distribution',
      lpOrganizationName: 'Singapore GIC',
      contactName: 'David Tan',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      priority: 'MEDIUM',
      status: 'DRAFT'
    }
  ];
};

const generateFundraisingOpportunities = (): FundraisingOpportunity[] => {
  return [
    {
      id: 'opp-001',
      lpOrganizationName: 'Singapore GIC',
      contactName: 'David Tan',
      fundName: 'Sustainability Fund I',
      potentialCommitment: 200000000,
      probability: 0.75,
      stage: 'Due Diligence',
      expectedClose: new Date('2024-09-30'),
      lastActivity: new Date('2024-07-08'),
      relationshipTier: 'PROSPECT'
    },
    {
      id: 'opp-002',
      lpOrganizationName: 'CalPERS',
      contactName: 'Sarah Johnson',
      fundName: 'Growth Fund IV',
      potentialCommitment: 300000000,
      probability: 0.85,
      stage: 'Legal Review',
      expectedClose: new Date('2024-08-15'),
      lastActivity: new Date('2024-07-10'),
      relationshipTier: 'TIER_1'
    },
    {
      id: 'opp-003',
      lpOrganizationName: 'Yale University Endowment',
      contactName: 'Jennifer Rodriguez',
      fundName: 'Innovation Fund II',
      potentialCommitment: 75000000,
      probability: 0.60,
      stage: 'Investment Committee',
      expectedClose: new Date('2024-10-15'),
      lastActivity: new Date('2024-06-15'),
      relationshipTier: 'TIER_2'
    },
    {
      id: 'opp-004',
      lpOrganizationName: 'Abu Dhabi Investment Authority',
      contactName: 'Ahmed Al-Mansouri',
      fundName: 'Infrastructure Fund III',
      potentialCommitment: 500000000,
      probability: 0.45,
      stage: 'Initial Interest',
      expectedClose: new Date('2024-12-31'),
      lastActivity: new Date('2024-07-01'),
      relationshipTier: 'TIER_1'
    },
    {
      id: 'opp-005',
      lpOrganizationName: 'Ontario Teachers\' Pension Plan',
      contactName: 'Michael Chen',
      fundName: 'Technology Fund V',
      potentialCommitment: 150000000,
      probability: 0.90,
      stage: 'Commitment Signed',
      expectedClose: new Date('2024-07-30'),
      lastActivity: new Date('2024-06-25'),
      relationshipTier: 'TIER_1'
    }
  ];
};

export async function GET() {
  try {
    const lpOrganizations = generateMockLPOrganizations();
    const contacts = generateMockLPContacts(lpOrganizations);
    const relationshipSummaries = generateRelationshipSummaries(lpOrganizations, contacts);
    const recentActivities = generateRecentActivities();
    const upcomingActivities = generateUpcomingActivities();
    const fundraisingOpportunities = generateFundraisingOpportunities();

    const stats: LPGPRelationshipStats = {
      totalLPs: lpOrganizations.length,
      activeLPs: lpOrganizations.filter(lp => lp.relationshipStatus === 'ACTIVE_LP').length,
      prospectLPs: lpOrganizations.filter(lp => lp.relationshipStatus === 'PROSPECT').length,
      totalCommitments: lpOrganizations.reduce((sum, lp) => sum + lp.totalCommitments, 0),
      totalContacts: contacts.length,
      pendingTasks: upcomingActivities.filter(a => a.type === 'TASK').length,
      upcomingMeetings: upcomingActivities.filter(a => a.type === 'MEETING').length,
      overdueFollowUps: upcomingActivities.filter(a => 
        a.type === 'FOLLOW_UP' && new Date(a.dueDate) < new Date()
      ).length,
    };

    const response: LPGPRelationshipResponse = {
      stats,
      lpOrganizations,
      relationshipSummaries,
      recentActivities,
      upcomingActivities,
      fundraisingOpportunities,
      contacts,
      communications: [], // Would be populated with communication data
      meetings: [], // Would be populated with meeting data
      tasks: [], // Would be populated with task data
      reports: [], // Would be populated with report data
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in LPGP relationship API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch LPGP relationship data' },
      { status: 500 }
    );
  }
}