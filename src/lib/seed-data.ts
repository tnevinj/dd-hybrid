import { 
  OperationalAssessmentService, 
  OperationalProcessService, 
  OperationalMetricsService,
  OperationalBenchmarkService,
  ManagementAssessmentService,
  ManagementTeamMemberService,
  QualificationAssessmentService,
  SkillValidationService,
  ReferenceCheckService,
  PerformanceValidationService,
  CompetencyValidationService
} from './services/database';

export function seedOperationalData(projectId: string) {
  // Get or create operational assessment
  let assessment = OperationalAssessmentService.getByProjectId(projectId);
  
  if (!assessment) {
    assessment = OperationalAssessmentService.create({
      project_id: projectId,
      workspace_id: null,
      assessor_name: 'Seed Data System',
      notes: 'Demo operational assessment with comprehensive data',
      recommendations: [
        {
          title: 'Automate Order Processing Workflow',
          description: 'Implement automated order routing and approval workflows to reduce manual intervention',
          category: 'process',
          priority: 'high',
          estimated_impact: 85,
          estimated_cost: 250000,
          estimated_timeframe: 6,
          expected_roi: 3.2,
          implementation_complexity: 'medium',
          ai_generated: true,
          confidence_level: 0.89
        },
        {
          title: 'Supply Chain Optimization Platform',
          description: 'Deploy AI-powered supply chain management system for demand forecasting and inventory optimization',
          category: 'technology',
          priority: 'high',
          estimated_impact: 92,
          estimated_cost: 400000,
          estimated_timeframe: 8,
          expected_roi: 4.1,
          implementation_complexity: 'high',
          ai_generated: true,
          confidence_level: 0.94
        },
        {
          title: 'Quality Assurance Automation',
          description: 'Implement automated quality testing and reporting systems',
          category: 'technology',
          priority: 'medium',
          estimated_impact: 75,
          estimated_cost: 180000,
          estimated_timeframe: 4,
          expected_roi: 2.8,
          implementation_complexity: 'medium',
          ai_generated: true,
          confidence_level: 0.82
        }
      ]
    });
  }

  // Add operational processes
  const processesToAdd = [
    {
      process_name: 'Order Management',
      description: 'End-to-end order processing and fulfillment',
      category: 'core',
      maturity_level: 'defined',
      efficiency_score: 75,
      automation_potential: 85,
      criticality_level: 'critical',
      current_state: 'Partially automated with manual intervention points',
      target_state: 'Fully automated with exception handling'
    },
    {
      process_name: 'Quality Assurance',
      description: 'Product and service quality control processes',
      category: 'core',
      maturity_level: 'managed',
      efficiency_score: 88,
      automation_potential: 70,
      criticality_level: 'high',
      current_state: 'Well-defined QA processes with regular monitoring',
      target_state: 'AI-enhanced quality prediction and automated testing'
    },
    {
      process_name: 'Supply Chain Management',
      description: 'Vendor management and inventory optimization',
      category: 'support',
      maturity_level: 'developing',
      efficiency_score: 62,
      automation_potential: 90,
      criticality_level: 'high',
      current_state: 'Manual processes with spreadsheet tracking',
      target_state: 'Automated forecasting and vendor management'
    },
    {
      process_name: 'Customer Service',
      description: 'Customer support and relationship management',
      category: 'support',
      maturity_level: 'managed',
      efficiency_score: 78,
      automation_potential: 65,
      criticality_level: 'medium',
      current_state: 'Ticketing system with manual resolution',
      target_state: 'AI-powered support with automated issue routing'
    }
  ];

  for (const process of processesToAdd) {
    OperationalProcessService.create(assessment.id, process);
  }

  // Add operational benchmarks
  const benchmarksToAdd = [
    {
      benchmark_category: 'industry',
      metric_name: 'Process Efficiency',
      benchmark_value: 85,
      percentile_ranking: 65,
      benchmark_source: 'Industry Report 2024',
      industry_sector: 'Software',
      company_size_category: 'medium',
      geographic_region: 'Global',
      data_vintage: '2024'
    },
    {
      benchmark_category: 'industry',
      metric_name: 'Cost Optimization',
      benchmark_value: 78,
      percentile_ranking: 45,
      benchmark_source: 'McKinsey Study',
      industry_sector: 'Software',
      company_size_category: 'medium',
      geographic_region: 'Global',
      data_vintage: '2024'
    },
    {
      benchmark_category: 'industry',
      metric_name: 'Automation Level',
      benchmark_value: 72,
      percentile_ranking: 55,
      benchmark_source: 'Deloitte Analysis',
      industry_sector: 'Software',
      company_size_category: 'medium',
      geographic_region: 'Global',
      data_vintage: '2024'
    },
    {
      benchmark_category: 'industry',
      metric_name: 'Digital Maturity',
      benchmark_value: 68,
      percentile_ranking: 60,
      benchmark_source: 'Digital Transformation Index 2024',
      industry_sector: 'Software',
      company_size_category: 'medium',
      geographic_region: 'Global',
      data_vintage: '2024'
    }
  ];

  for (const benchmark of benchmarksToAdd) {
    OperationalBenchmarkService.create(assessment.id, benchmark);
  }

  // Update assessment scores
  OperationalAssessmentService.update(assessment.id, {
    overall_score: 76,
    process_efficiency_score: 75,
    digital_maturity_score: 72,
    quality_management_score: 88,
    supply_chain_score: 62,
    automation_readiness_score: 68,
    cost_efficiency_score: 74,
    scalability_score: 70,
    status: 'in_progress'
  });

  return assessment;
}

export function seedManagementData(projectId: string) {
  // Get or create management assessment
  let assessment = ManagementAssessmentService.getByProjectId(projectId);
  
  if (!assessment) {
    assessment = ManagementAssessmentService.create({
      project_id: projectId,
      workspace_id: null,
      assessor_name: 'Seed Data System',
      key_strengths: [
        'Strong leadership team with complementary skills',
        'Deep industry expertise and network',
        'Proven track record of scaling businesses',
        'Clear strategic vision and execution capability'
      ],
      key_concerns: [
        'Succession planning gaps for critical roles',
        'Retention risk for key technical talent',
        'Limited international expansion experience'
      ],
      succession_gaps: [
        'CTO role - no clear successor identified',
        'Head of Sales - requires additional training',
        'CFO backup - need to develop internal candidate'
      ],
      retention_strategies: [
        'Enhanced equity packages for key personnel',
        'Professional development programs',
        'Flexible work arrangements',
        'Performance-based bonuses and recognition'
      ]
    });
  }

  // Add team members
  const teamMembersToAdd = [
    {
      name: 'Sarah Chen',
      position: 'CEO & Founder',
      tenure_years: 8,
      leadership_score: 92,
      strategic_thinking_score: 88,
      execution_score: 94,
      financial_acumen_score: 82,
      industry_expertise_score: 95,
      team_collaboration_score: 89,
      previous_experience: ['TechCorp Asia - VP Operations (5 years)', 'StartupX - Head of Product (3 years)'],
      education_background: 'Stanford MBA, MIT BS Computer Science',
      key_achievements: ['Led Series B fundraising', 'Expanded to 3 new markets', 'Grew team from 12 to 85'],
      development_areas: ['International market expansion', 'M&A strategy'],
      retention_risk: 'low',
      succession_readiness: 85,
      flight_risk_factors: ['High market demand for founder CEOs', 'Potential for board conflicts']
    },
    {
      name: 'Michael Rodriguez',
      position: 'CTO',
      tenure_years: 6,
      leadership_score: 85,
      strategic_thinking_score: 90,
      execution_score: 96,
      financial_acumen_score: 75,
      industry_expertise_score: 98,
      team_collaboration_score: 88,
      previous_experience: ['Google - Senior Staff Engineer (7 years)', 'Facebook - Tech Lead (4 years)'],
      education_background: 'Carnegie Mellon MS Computer Science',
      key_achievements: ['Architected platform reducing costs by 40%', 'Built engineering team from 8 to 45', 'Achieved 99.99% system uptime'],
      development_areas: ['Business strategy understanding', 'Cross-functional leadership'],
      retention_risk: 'medium',
      succession_readiness: 45,
      flight_risk_factors: ['High market demand for CTOs', 'Significant equity offers from competitors']
    },
    {
      name: 'Lisa Wong',
      position: 'CFO',
      tenure_years: 4,
      leadership_score: 88,
      strategic_thinking_score: 92,
      execution_score: 85,
      financial_acumen_score: 98,
      industry_expertise_score: 82,
      team_collaboration_score: 90,
      previous_experience: ['PwC - Senior Manager (6 years)', 'Goldman Sachs - Analyst (3 years)'],
      education_background: 'Wharton MBA Finance, UC Berkeley BS Economics',
      key_achievements: ['Secured $25M Series B funding', 'Improved gross margins by 15%', 'Implemented robust financial controls'],
      development_areas: ['Technology understanding', 'International finance'],
      retention_risk: 'low',
      succession_readiness: 75,
      flight_risk_factors: ['Family relocation considerations']
    },
    {
      name: 'David Kim',
      position: 'Head of Sales',
      tenure_years: 3,
      leadership_score: 82,
      strategic_thinking_score: 78,
      execution_score: 88,
      financial_acumen_score: 76,
      industry_expertise_score: 85,
      team_collaboration_score: 92,
      previous_experience: ['Salesforce - Enterprise AE (5 years)', 'HubSpot - SMB Manager (3 years)'],
      education_background: 'Northwestern Kellogg MBA, University of Michigan BS',
      key_achievements: ['Grew revenue 300% in 3 years', 'Built sales team from 3 to 18', 'Established enterprise sales process'],
      development_areas: ['International sales strategy', 'Product marketing alignment'],
      retention_risk: 'medium',
      succession_readiness: 60,
      flight_risk_factors: ['Strong performance attracts headhunters', 'Equity vesting schedule']
    }
  ];

  const createdMembers = [];
  for (const member of teamMembersToAdd) {
    const createdMember = ManagementTeamMemberService.create(assessment.id, member);
    createdMembers.push(createdMember);
  }

  // Add qualification assessments for each team member
  for (const member of createdMembers) {
    try {
      seedQualificationAssessments(member.id);
      console.log(`Seeded qualification assessments for ${member.name}`);
    } catch (error) {
      console.error(`Failed to seed qualification assessments for ${member.name}:`, error);
    }
  }

  // Update assessment scores
  ManagementAssessmentService.update(assessment.id, {
    overall_team_score: 86,
    leadership_score: 87,
    strategic_thinking_score: 87,
    execution_capability_score: 91,
    financial_acumen_score: 83,
    industry_expertise_score: 90,
    team_dynamics_score: 90,
    succession_readiness_score: 66,
    retention_risk_score: 25,
    status: 'in_progress'
  });

  return assessment;
}

export function seedQualificationAssessments(teamMemberId: string) {
  console.log(`Starting qualification assessments for team member: ${teamMemberId}`);
  
  // Create skills validation assessment
  const skillsAssessment = QualificationAssessmentService.create(teamMemberId, {
    assessment_type: 'skills',
    overall_qualification_score: 82,
    verification_status: 'completed',
    assessed_by: 'Qualification Team',
    methodology: 'Multi-modal skills validation including interviews, tests, and portfolio review',
    confidence_level: 0.87,
    findings: [
      'Strong technical competencies validated through portfolio review',
      'Leadership skills confirmed through behavioral interviews',
      'Financial acumen verified through case study analysis',
      'Strategic thinking demonstrated in scenario-based assessments'
    ],
    recommendations: [
      'Continue professional development in emerging technologies',
      'Consider executive coaching for enhanced leadership presence',
      'Develop international market expertise'
    ],
    red_flags: [],
    validation_evidence: [
      'Portfolio of completed projects',
      'Behavioral interview scores',
      'Peer and subordinate feedback',
      'External certification verification'
    ],
    external_validation_required: false
  });

  // Add skill validations
  const skillsToValidate = [
    {
      skill_category: 'leadership',
      skill_name: 'Team Management',
      claimed_proficiency: 85,
      validated_proficiency: 88,
      validation_method: 'behavioral_interview',
      evidence_type: 'testimonial',
      evidence_quality: 92,
      industry_relevance: 95,
      assessor_notes: 'Demonstrated strong team management through specific examples and peer feedback'
    },
    {
      skill_category: 'strategic',
      skill_name: 'Strategic Planning',
      claimed_proficiency: 80,
      validated_proficiency: 83,
      validation_method: 'case_study',
      evidence_type: 'demonstration',
      evidence_quality: 89,
      industry_relevance: 90,
      assessor_notes: 'Strong analytical framework and long-term thinking validated through case studies'
    },
    {
      skill_category: 'financial',
      skill_name: 'Financial Analysis',
      claimed_proficiency: 75,
      validated_proficiency: 78,
      validation_method: 'test',
      evidence_type: 'certification',
      evidence_quality: 95,
      industry_relevance: 85,
      assessor_notes: 'CFA certification and practical application in previous roles'
    },
    {
      skill_category: 'technical',
      skill_name: 'Technology Strategy',
      claimed_proficiency: 90,
      validated_proficiency: 92,
      validation_method: 'portfolio',
      evidence_type: 'project',
      evidence_quality: 94,
      industry_relevance: 98,
      assessor_notes: 'Extensive portfolio demonstrating successful technology transformations'
    },
    {
      skill_category: 'operational',
      skill_name: 'Operations Management',
      claimed_proficiency: 82,
      validated_proficiency: 85,
      validation_method: 'reference',
      evidence_type: 'testimonial',
      evidence_quality: 88,
      industry_relevance: 92,
      assessor_notes: 'Strong operational track record confirmed by multiple references'
    }
  ];

  // Add skill validations
  for (const skill of skillsToValidate) {
    SkillValidationService.create(skillsAssessment.id, skill);
  }

  // Create reference check assessment
  const referencesAssessment = QualificationAssessmentService.create(teamMemberId, {
    assessment_type: 'references',
    overall_qualification_score: 89,
    verification_status: 'completed',
    assessed_by: 'Reference Check Team',
    methodology: 'Comprehensive reference checks with former colleagues, supervisors, and clients',
    confidence_level: 0.92,
    findings: [
      'Consistently positive feedback from former supervisors',
      'Strong peer recommendations highlighting collaboration',
      'Client testimonials praising delivery and relationship management',
      'No negative references or concerning feedback'
    ],
    recommendations: [
      'Leverage strong references for board presentations',
      'Consider references as mentors for strategic decisions'
    ],
    red_flags: [],
    validation_evidence: [
      'Completed reference check forms',
      'Recorded reference interviews',
      'Background verification documents'
    ],
    external_validation_required: false
  });

  // Add reference checks
  const referencesToCheck = [
    {
      reference_name: 'Jennifer Martinez',
      reference_position: 'Former CEO',
      reference_company: 'TechCorp Industries',
      relationship_to_candidate: 'direct_manager',
      reference_type: 'professional',
      contact_method: 'phone',
      response_status: 'completed',
      overall_rating: 92,
      would_rehire: true,
      leadership_rating: 94,
      performance_rating: 90,
      integrity_rating: 98,
      collaboration_rating: 88,
      specific_feedback: 'Exceptional leader with strong strategic vision. Consistently delivered results and built high-performing teams.',
      strengths_mentioned: ['Strategic thinking', 'Team building', 'Results delivery', 'Stakeholder management'],
      concerns_mentioned: ['Sometimes perfectionist', 'Can be demanding on timelines'],
      verification_items: ['Employment dates verified', 'Title confirmed', 'Salary range validated'],
      red_flags: [],
      follow_up_required: false
    },
    {
      reference_name: 'Robert Chen',
      reference_position: 'Board Member',
      reference_company: 'Innovation Ventures',
      relationship_to_candidate: 'board_member',
      reference_type: 'professional',
      contact_method: 'video',
      response_status: 'completed',
      overall_rating: 87,
      would_rehire: true,
      leadership_rating: 89,
      performance_rating: 88,
      integrity_rating: 95,
      collaboration_rating: 85,
      specific_feedback: 'Strong business acumen and excellent communication with board. Transparent in reporting and proactive in addressing challenges.',
      strengths_mentioned: ['Business acumen', 'Communication', 'Transparency', 'Problem solving'],
      concerns_mentioned: ['Limited international experience'],
      verification_items: ['Board relationship confirmed', 'Meeting attendance verified'],
      red_flags: [],
      follow_up_required: false
    },
    {
      reference_name: 'Sarah Thompson',
      reference_position: 'VP Engineering',
      reference_company: 'TechCorp Industries',
      relationship_to_candidate: 'peer',
      reference_type: 'professional',
      contact_method: 'phone',
      response_status: 'completed',
      overall_rating: 85,
      would_rehire: true,
      leadership_rating: 83,
      performance_rating: 87,
      integrity_rating: 92,
      collaboration_rating: 88,
      specific_feedback: 'Great cross-functional partner. Always willing to help and share knowledge. Strong technical understanding despite non-technical background.',
      strengths_mentioned: ['Collaboration', 'Technical understanding', 'Knowledge sharing', 'Support'],
      concerns_mentioned: [],
      verification_items: ['Peer relationship confirmed', 'Project collaboration verified'],
      red_flags: [],
      follow_up_required: false
    }
  ];

  for (const reference of referencesToCheck) {
    ReferenceCheckService.create(referencesAssessment.id, reference);
  }

  // Create performance validation assessment
  const performanceAssessment = QualificationAssessmentService.create(teamMemberId, {
    assessment_type: 'performance',
    overall_qualification_score: 88,
    verification_status: 'completed',
    assessed_by: 'Performance Validation Team',
    methodology: 'Historical performance analysis with quantitative metrics validation',
    confidence_level: 0.91,
    findings: [
      'Consistent track record of exceeding performance targets',
      'Strong revenue growth and margin improvement achievements',
      'Successful team scaling and talent development',
      'Effective cost management and operational efficiency gains'
    ],
    recommendations: [
      'Continue focus on scalable processes',
      'Develop succession planning for key direct reports'
    ],
    red_flags: [],
    validation_evidence: [
      'Audited financial statements',
      'Performance review documents',
      'Team feedback surveys',
      'Customer satisfaction scores'
    ],
    external_validation_required: false
  });

  // Add performance validation
  const performanceData = {
    performance_period_start: '2020-01-01',
    performance_period_end: '2023-12-31',
    company_name: 'TechCorp Industries',
    role_title: 'VP Operations',
    claimed_achievements: [
      'Increased revenue by 300% over 3 years',
      'Improved operational efficiency by 40%',
      'Scaled team from 12 to 85 employees',
      'Achieved 99.9% customer satisfaction',
      'Reduced operational costs by 25%'
    ],
    validated_achievements: [
      'Revenue growth of 285% validated through audited financials',
      'Operational efficiency improved by 38% confirmed',
      'Team growth to 82 employees verified',
      'Customer satisfaction at 98.7% confirmed',
      'Cost reduction of 23% validated'
    ],
    quantitative_metrics: [
      { metric: 'Revenue Growth', claimed: 300, validated: 285, unit: 'percentage' },
      { metric: 'Team Size Growth', claimed: 85, validated: 82, unit: 'count' },
      { metric: 'Customer Satisfaction', claimed: 99.9, validated: 98.7, unit: 'percentage' },
      { metric: 'Cost Reduction', claimed: 25, validated: 23, unit: 'percentage' }
    ],
    revenue_impact: 1250000000, // $12.5M in cents
    cost_savings: 75000000, // $750K in cents
    team_size_managed: 82,
    budget_responsibility: 500000000, // $5M in cents
    stakeholder_feedback_score: 91,
    peer_review_score: 87,
    subordinate_feedback_score: 89,
    client_satisfaction_score: 93,
    awards_recognition: [
      'Employee of the Year 2022',
      'Innovation Award 2021',
      'Leadership Excellence 2023'
    ],
    performance_improvement_areas: [
      'International market expansion',
      'Cross-functional collaboration',
      'Digital transformation leadership'
    ],
    validation_sources: [
      'Audited financial statements',
      'HR performance records',
      '360-degree feedback surveys',
      'Customer satisfaction surveys'
    ],
    validation_confidence: 0.93,
    discrepancies_found: [
      'Revenue growth slightly lower than claimed (285% vs 300%)',
      'Team size marginally different (82 vs 85)',
      'Customer satisfaction within acceptable variance'
    ]
  };

  PerformanceValidationService.create(performanceAssessment.id, performanceData);

  // Create competency validation assessment
  const competencyAssessment = QualificationAssessmentService.create(teamMemberId, {
    assessment_type: 'competency',
    overall_qualification_score: 86,
    verification_status: 'completed',
    assessed_by: 'Competency Assessment Team',
    methodology: 'Behavioral interviews and situational judgment assessments using leadership competency framework',
    confidence_level: 0.89,
    findings: [
      'Strong demonstration of core leadership competencies',
      'Excellent strategic thinking and execution capabilities',
      'Proven ability to develop and motivate teams',
      'Strong business acumen and financial understanding'
    ],
    recommendations: [
      'Continue developing international business expertise',
      'Focus on digital transformation leadership',
      'Consider board readiness development program'
    ],
    red_flags: [],
    validation_evidence: [
      'Behavioral interview transcripts',
      'Situational judgment test results',
      'Leadership assessment center outcomes',
      '360-degree feedback results'
    ],
    external_validation_required: false
  });

  // Add competency validations
  const competenciesToValidate = [
    {
      competency_framework: 'Leadership Pipeline',
      competency_category: 'Leadership',
      competency_name: 'Team Leadership',
      required_level: 80,
      demonstrated_level: 87,
      assessment_method: 'behavioral_interview',
      behavioral_indicators: [
        'Delegates effectively while maintaining accountability',
        'Provides clear direction and expectations',
        'Develops team members through coaching',
        'Builds high-performing team culture'
      ],
      situational_examples: [
        'Successfully led team through major reorganization',
        'Developed succession planning for all direct reports',
        'Implemented performance management system'
      ],
      assessment_scenarios: [
        'Team conflict resolution scenario',
        'Performance management situation',
        'Change management challenge'
      ],
      competency_gaps: [],
      development_recommendations: [
        'Advanced coaching certification',
        'Cross-cultural leadership development'
      ],
      assessor_confidence: 0.91,
      external_validation: ['MBA Leadership coursework', 'Leadership certification'],
      industry_benchmarks: [
        { benchmark: 'Industry average', value: 75 },
        { benchmark: 'Top quartile', value: 85 }
      ],
      future_potential_score: 92
    },
    {
      competency_framework: 'Leadership Pipeline',
      competency_category: 'Strategic',
      competency_name: 'Strategic Thinking',
      required_level: 85,
      demonstrated_level: 89,
      assessment_method: 'case_study',
      behavioral_indicators: [
        'Thinks beyond immediate tactical needs',
        'Identifies long-term trends and implications',
        'Connects disparate pieces of information',
        'Develops comprehensive strategic frameworks'
      ],
      situational_examples: [
        'Developed 5-year strategic plan resulting in market expansion',
        'Identified emerging technology trends and pivoted strategy',
        'Led strategic partnership development'
      ],
      assessment_scenarios: [
        'Market expansion strategy development',
        'Competitive response planning',
        'Technology disruption response'
      ],
      competency_gaps: ['International market strategy'],
      development_recommendations: [
        'International business strategy course',
        'Cross-industry strategic thinking exposure'
      ],
      assessor_confidence: 0.88,
      external_validation: ['Strategic planning certification', 'MBA strategic management'],
      industry_benchmarks: [
        { benchmark: 'Industry average', value: 78 },
        { benchmark: 'Top quartile', value: 87 }
      ],
      future_potential_score: 94
    }
  ];

  for (const competency of competenciesToValidate) {
    CompetencyValidationService.create(competencyAssessment.id, competency);
  }

  return {
    skillsAssessment,
    referencesAssessment,
    performanceAssessment,
    competencyAssessment
  };
}

// Manufacturing Industry Templates
export function seedManufacturingOperationalData(projectId: string) {
  let assessment = OperationalAssessmentService.getByProjectId(projectId);
  
  if (!assessment) {
    assessment = OperationalAssessmentService.create({
      project_id: projectId,
      workspace_id: null,
      assessor_name: 'Manufacturing Operations Team',
      notes: 'Comprehensive manufacturing operational assessment',
      recommendations: [
        {
          title: 'Implement Lean Manufacturing Principles',
          description: 'Deploy lean methodologies to reduce waste and improve efficiency in production lines',
          category: 'process',
          priority: 'high',
          estimated_impact: 92,
          estimated_cost: 350000,
          estimated_timeframe: 9,
          expected_roi: 4.8,
          implementation_complexity: 'high',
          ai_generated: true,
          confidence_level: 0.91
        },
        {
          title: 'Predictive Maintenance System',
          description: 'Deploy IoT sensors and AI-powered predictive maintenance to reduce downtime',
          category: 'technology',
          priority: 'high',
          estimated_impact: 88,
          estimated_cost: 280000,
          estimated_timeframe: 6,
          expected_roi: 3.9,
          implementation_complexity: 'medium',
          ai_generated: true,
          confidence_level: 0.87
        }
      ]
    });
  }

  // Manufacturing-specific processes
  const processesToAdd = [
    {
      process_name: 'Production Planning',
      description: 'Material requirements planning and production scheduling',
      category: 'core',
      maturity_level: 'managed',
      efficiency_score: 82,
      automation_potential: 90,
      criticality_level: 'critical',
      current_state: 'ERP-based planning with manual adjustments',
      target_state: 'AI-driven demand forecasting and automated scheduling'
    },
    {
      process_name: 'Quality Control',
      description: 'In-line quality inspection and batch testing',
      category: 'core',
      maturity_level: 'optimized',
      efficiency_score: 94,
      automation_potential: 85,
      criticality_level: 'critical',
      current_state: 'Statistical process control with automated testing',
      target_state: 'Real-time quality monitoring with AI defect detection'
    },
    {
      process_name: 'Equipment Maintenance',
      description: 'Preventive and corrective maintenance of production equipment',
      category: 'support',
      maturity_level: 'defined',
      efficiency_score: 68,
      automation_potential: 95,
      criticality_level: 'high',
      current_state: 'Scheduled maintenance with reactive repairs',
      target_state: 'Predictive maintenance with IoT monitoring'
    },
    {
      process_name: 'Inventory Management',
      description: 'Raw materials and finished goods inventory control',
      category: 'support',
      maturity_level: 'managed',
      efficiency_score: 76,
      automation_potential: 88,
      criticality_level: 'medium',
      current_state: 'JIT principles with manual tracking',
      target_state: 'Automated inventory optimization with demand sensing'
    }
  ];

  for (const process of processesToAdd) {
    OperationalProcessService.create(assessment.id, process);
  }

  // Manufacturing-specific benchmarks
  const benchmarksToAdd = [
    {
      benchmark_category: 'industry',
      metric_name: 'Overall Equipment Effectiveness',
      benchmark_value: 82,
      percentile_ranking: 70,
      benchmark_source: 'Manufacturing Excellence Index 2024',
      industry_sector: 'Manufacturing',
      company_size_category: 'medium',
      geographic_region: 'Global',
      data_vintage: '2024'
    },
    {
      benchmark_category: 'industry',
      metric_name: 'First Pass Yield',
      benchmark_value: 88,
      percentile_ranking: 65,
      benchmark_source: 'Quality Manufacturing Report',
      industry_sector: 'Manufacturing',
      company_size_category: 'medium',
      geographic_region: 'Global',
      data_vintage: '2024'
    }
  ];

  for (const benchmark of benchmarksToAdd) {
    OperationalBenchmarkService.create(assessment.id, benchmark);
  }

  // Update with manufacturing-specific scores
  OperationalAssessmentService.update(assessment.id, {
    overall_score: 82,
    process_efficiency_score: 84,
    digital_maturity_score: 71,
    quality_management_score: 94,
    supply_chain_score: 78,
    automation_readiness_score: 85,
    cost_efficiency_score: 79,
    scalability_score: 76,
    status: 'in_progress'
  });

  return assessment;
}

export function seedManufacturingManagementData(projectId: string) {
  let assessment = ManagementAssessmentService.getByProjectId(projectId);
  
  if (!assessment) {
    assessment = ManagementAssessmentService.create({
      project_id: projectId,
      workspace_id: null,
      assessor_name: 'Manufacturing Leadership Team',
      key_strengths: [
        'Deep manufacturing expertise and operational excellence',
        'Strong safety culture and regulatory compliance',
        'Proven track record in lean manufacturing implementation',
        'Excellent relationships with suppliers and distributors'
      ],
      key_concerns: [
        'Limited digital transformation experience',
        'Aging workforce with succession challenges',
        'Dependency on key technical experts'
      ],
      succession_gaps: [
        'VP Manufacturing - limited internal candidates',
        'Chief Quality Officer - knowledge transfer needed',
        'Plant Manager roles - development pipeline required'
      ],
      retention_strategies: [
        'Knowledge transfer programs for senior experts',
        'Manufacturing leadership development track',
        'Competitive compensation for technical roles'
      ]
    });
  }

  // Manufacturing leadership team
  const teamMembersToAdd = [
    {
      name: 'Robert Steel',
      position: 'CEO & President',
      tenure_years: 12,
      leadership_score: 89,
      strategic_thinking_score: 85,
      execution_score: 95,
      financial_acumen_score: 84,
      industry_expertise_score: 98,
      team_collaboration_score: 87,
      previous_experience: ['Boeing - VP Operations (8 years)', 'GE Manufacturing - Plant Manager (6 years)'],
      education_background: 'Northwestern Kellogg MBA, Purdue BS Industrial Engineering',
      key_achievements: ['Implemented lean across 15 plants', 'Reduced manufacturing costs by 22%', 'Achieved zero safety incidents for 3 years'],
      development_areas: ['Digital manufacturing', 'International expansion'],
      retention_risk: 'low',
      succession_readiness: 78,
      flight_risk_factors: ['Retirement consideration within 5 years']
    },
    {
      name: 'Maria Gonzalez',
      position: 'VP Manufacturing',
      tenure_years: 8,
      leadership_score: 91,
      strategic_thinking_score: 83,
      execution_score: 96,
      financial_acumen_score: 79,
      industry_expertise_score: 94,
      team_collaboration_score: 92,
      previous_experience: ['Toyota - Production Manager (10 years)', 'Ford - Manufacturing Engineer (5 years)'],
      education_background: 'University of Michigan MS Manufacturing Engineering',
      key_achievements: ['Led $50M plant modernization', 'Improved OEE from 65% to 85%', 'Reduced lead times by 40%'],
      development_areas: ['P&L responsibility', 'Board readiness'],
      retention_risk: 'medium',
      succession_readiness: 82,
      flight_risk_factors: ['High demand for manufacturing leaders', 'Family considerations for relocation']
    }
  ];

  const createdMembers = [];
  for (const member of teamMembersToAdd) {
    const createdMember = ManagementTeamMemberService.create(assessment.id, member);
    createdMembers.push(createdMember);
  }

  // Update assessment scores
  ManagementAssessmentService.update(assessment.id, {
    overall_team_score: 88,
    leadership_score: 90,
    strategic_thinking_score: 84,
    execution_capability_score: 95,
    financial_acumen_score: 82,
    industry_expertise_score: 96,
    team_dynamics_score: 89,
    succession_readiness_score: 80,
    retention_risk_score: 30,
    status: 'in_progress'
  });

  return assessment;
}

export function seedFinancialOperationalData(projectId: string) {
  let assessment = OperationalAssessmentService.getByProjectId(projectId);
  
  if (!assessment) {
    assessment = OperationalAssessmentService.create({
      project_id: projectId,
      workspace_id: null,
      assessor_name: 'Financial Services Operations Team',
      notes: 'Comprehensive financial services operational assessment',
      recommendations: [
        {
          title: 'Digital Banking Platform Modernization',
          description: 'Upgrade core banking systems to cloud-native architecture for improved scalability and customer experience',
          category: 'technology',
          priority: 'high',
          estimated_impact: 95,
          estimated_cost: 1200000,
          estimated_timeframe: 18,
          expected_roi: 3.8,
          implementation_complexity: 'high',
          ai_generated: true,
          confidence_level: 0.92
        },
        {
          title: 'Regulatory Compliance Automation',
          description: 'Implement automated compliance monitoring and reporting systems for regulatory requirements',
          category: 'process',
          priority: 'high',
          estimated_impact: 89,
          estimated_cost: 450000,
          estimated_timeframe: 12,
          expected_roi: 4.2,
          implementation_complexity: 'medium',
          ai_generated: true,
          confidence_level: 0.88
        },
        {
          title: 'Risk Management Enhancement',
          description: 'Deploy advanced analytics for credit risk assessment and fraud detection',
          category: 'technology',
          priority: 'medium',
          estimated_impact: 92,
          estimated_cost: 680000,
          estimated_timeframe: 10,
          expected_roi: 5.1,
          implementation_complexity: 'high',
          ai_generated: true,
          confidence_level: 0.85
        }
      ]
    });
  }

  // Financial services specific processes
  const processesToAdd = [
    {
      process_name: 'Loan Origination',
      description: 'End-to-end loan application, underwriting, and approval process',
      category: 'core',
      maturity_level: 'managed',
      efficiency_score: 78,
      automation_potential: 92,
      criticality_level: 'critical',
      current_state: 'Partially automated with manual underwriting decisions',
      target_state: 'AI-driven risk assessment with automated decisioning'
    },
    {
      process_name: 'Regulatory Reporting',
      description: 'Compliance reporting to regulatory bodies and internal risk management',
      category: 'core',
      maturity_level: 'defined',
      efficiency_score: 65,
      automation_potential: 95,
      criticality_level: 'critical',
      current_state: 'Manual report compilation with regulatory oversight',
      target_state: 'Real-time automated compliance monitoring and reporting'
    },
    {
      process_name: 'Customer Onboarding',
      description: 'KYC/AML verification and account opening processes',
      category: 'core',
      maturity_level: 'managed',
      efficiency_score: 82,
      automation_potential: 88,
      criticality_level: 'high',
      current_state: 'Digital forms with manual verification steps',
      target_state: 'Fully automated identity verification and risk scoring'
    },
    {
      process_name: 'Investment Management',
      description: 'Portfolio management and investment advisory services',
      category: 'core',
      maturity_level: 'optimized',
      efficiency_score: 89,
      automation_potential: 75,
      criticality_level: 'medium',
      current_state: 'Systematic investment processes with advisor oversight',
      target_state: 'AI-enhanced portfolio optimization and rebalancing'
    }
  ];

  for (const process of processesToAdd) {
    OperationalProcessService.create(assessment.id, process);
  }

  // Financial services specific benchmarks
  const benchmarksToAdd = [
    {
      benchmark_category: 'industry',
      metric_name: 'Cost-to-Income Ratio',
      benchmark_value: 58,
      percentile_ranking: 75,
      benchmark_source: 'Banking Industry Performance Report 2024',
      industry_sector: 'Financial Services',
      company_size_category: 'medium',
      geographic_region: 'Global',
      data_vintage: '2024'
    },
    {
      benchmark_category: 'industry',
      metric_name: 'Digital Channel Adoption',
      benchmark_value: 84,
      percentile_ranking: 68,
      benchmark_source: 'Fintech Digital Transformation Study',
      industry_sector: 'Financial Services',
      company_size_category: 'medium',
      geographic_region: 'Global',
      data_vintage: '2024'
    },
    {
      benchmark_category: 'industry',
      metric_name: 'Regulatory Compliance Score',
      benchmark_value: 92,
      percentile_ranking: 80,
      benchmark_source: 'Financial Regulatory Excellence Index',
      industry_sector: 'Financial Services',
      company_size_category: 'medium',
      geographic_region: 'Global',
      data_vintage: '2024'
    },
    {
      benchmark_category: 'industry',
      metric_name: 'Risk-Adjusted Return',
      benchmark_value: 78,
      percentile_ranking: 72,
      benchmark_source: 'Investment Performance Analytics 2024',
      industry_sector: 'Financial Services',
      company_size_category: 'medium',
      geographic_region: 'Global',
      data_vintage: '2024'
    }
  ];

  for (const benchmark of benchmarksToAdd) {
    OperationalBenchmarkService.create(assessment.id, benchmark);
  }

  // Update with financial services specific scores
  OperationalAssessmentService.update(assessment.id, {
    overall_score: 81,
    process_efficiency_score: 78,
    digital_maturity_score: 85,
    quality_management_score: 87,
    supply_chain_score: 74, // Less relevant for financial services
    automation_readiness_score: 89,
    cost_efficiency_score: 83,
    scalability_score: 86,
    status: 'in_progress'
  });

  return assessment;
}

export function seedFinancialManagementData(projectId: string) {
  let assessment = ManagementAssessmentService.getByProjectId(projectId);
  
  if (!assessment) {
    assessment = ManagementAssessmentService.create({
      project_id: projectId,
      workspace_id: null,
      assessor_name: 'Financial Services Leadership Team',
      key_strengths: [
        'Deep financial services industry expertise and regulatory knowledge',
        'Strong risk management culture and compliance framework',
        'Proven track record in financial product innovation',
        'Established relationships with regulators and institutional clients'
      ],
      key_concerns: [
        'Regulatory change management and adaptation speed',
        'Digital transformation lag compared to fintech competitors',
        'Talent retention in competitive financial services market'
      ],
      succession_gaps: [
        'Chief Risk Officer - regulatory expertise gap',
        'Head of Digital Banking - fintech experience needed',
        'Compliance Director - next generation leadership development'
      ],
      retention_strategies: [
        'Competitive compensation packages aligned with market standards',
        'Professional development in emerging financial technologies',
        'Regulatory training and certification programs',
        'Flexible work arrangements for work-life balance'
      ]
    });
  }

  // Financial services leadership team
  const teamMembersToAdd = [
    {
      name: 'Patricia Williams',
      position: 'CEO & President',
      tenure_years: 15,
      leadership_score: 94,
      strategic_thinking_score: 92,
      execution_score: 89,
      financial_acumen_score: 98,
      industry_expertise_score: 96,
      team_collaboration_score: 91,
      previous_experience: ['JPMorgan Chase - Regional President (8 years)', 'Wells Fargo - VP Commercial Banking (6 years)'],
      education_background: 'Wharton MBA Finance, CFA Charter, Georgetown BS Economics',
      key_achievements: ['Led $2B asset growth over 5 years', 'Successfully navigated Dodd-Frank implementation', 'Launched digital banking platform', 'Maintained top-tier regulatory ratings'],
      development_areas: ['Fintech innovation', 'Digital customer experience'],
      retention_risk: 'low',
      succession_readiness: 88,
      flight_risk_factors: ['Regulatory demands and stress', 'Industry consolidation pressures']
    },
    {
      name: 'James Martinez',
      position: 'Chief Risk Officer',
      tenure_years: 10,
      leadership_score: 87,
      strategic_thinking_score: 94,
      execution_score: 92,
      financial_acumen_score: 95,
      industry_expertise_score: 98,
      team_collaboration_score: 84,
      previous_experience: ['Bank of America - VP Risk Management (12 years)', 'Federal Reserve - Risk Examiner (5 years)'],
      education_background: 'Chicago Booth MBA, FRM Certification, MIT BS Mathematics',
      key_achievements: ['Implemented Basel III capital framework', 'Reduced credit losses by 35%', 'Built comprehensive risk analytics platform', 'Achieved zero regulatory findings for 3 years'],
      development_areas: ['Technology risk management', 'Cyber security expertise'],
      retention_risk: 'medium',
      succession_readiness: 75,
      flight_risk_factors: ['High demand for experienced CROs', 'Regulatory pressure and liability']
    },
    {
      name: 'Angela Chen',
      position: 'CFO',
      tenure_years: 7,
      leadership_score: 89,
      strategic_thinking_score: 91,
      execution_score: 94,
      financial_acumen_score: 97,
      industry_expertise_score: 88,
      team_collaboration_score: 92,
      previous_experience: ['Goldman Sachs - VP Investment Banking (9 years)', 'EY - Senior Manager (4 years)'],
      education_background: 'Stanford MBA, CPA License, UC Berkeley BS Accounting',
      key_achievements: ['Led successful IPO preparation', 'Improved cost-to-income ratio by 12%', 'Implemented advanced financial analytics', 'Secured $500M credit facility'],
      development_areas: ['Regulatory capital management', 'ESG reporting'],
      retention_risk: 'low',
      succession_readiness: 82,
      flight_risk_factors: ['Investment banking opportunities', 'Work-life balance considerations']
    },
    {
      name: 'Michael Thompson',
      position: 'Head of Digital Banking',
      tenure_years: 4,
      leadership_score: 85,
      strategic_thinking_score: 88,
      execution_score: 91,
      financial_acumen_score: 81,
      industry_expertise_score: 84,
      team_collaboration_score: 89,
      previous_experience: ['Fintech Startup - CTO (6 years)', 'Capital One - Senior Product Manager (5 years)'],
      education_background: 'Stanford MS Computer Science, Northwestern Kellogg MBA',
      key_achievements: ['Launched mobile banking app with 4.8 rating', 'Increased digital adoption by 150%', 'Reduced digital onboarding time by 75%', 'Built API banking platform'],
      development_areas: ['Traditional banking operations', 'Regulatory compliance'],
      retention_risk: 'high',
      succession_readiness: 65,
      flight_risk_factors: ['Fintech startup opportunities', 'Equity compensation gaps', 'Fast-paced innovation demands']
    }
  ];

  const createdMembers = [];
  for (const member of teamMembersToAdd) {
    const createdMember = ManagementTeamMemberService.create(assessment.id, member);
    createdMembers.push(createdMember);
  }

  // Add qualification assessments for each team member
  for (const member of createdMembers) {
    try {
      seedQualificationAssessments(member.id);
      console.log(`Seeded qualification assessments for ${member.name}`);
    } catch (error) {
      console.error(`Failed to seed qualification assessments for ${member.name}:`, error);
    }
  }

  // Update assessment scores
  ManagementAssessmentService.update(assessment.id, {
    overall_team_score: 89,
    leadership_score: 89,
    strategic_thinking_score: 91,
    execution_capability_score: 91,
    financial_acumen_score: 93,
    industry_expertise_score: 91,
    team_dynamics_score: 89,
    succession_readiness_score: 78,
    retention_risk_score: 40, // Higher risk due to competitive market
    status: 'in_progress'
  });

  return assessment;
}

export function seedHealthcareOperationalData(projectId: string) {
  let assessment = OperationalAssessmentService.getByProjectId(projectId);
  
  if (!assessment) {
    assessment = OperationalAssessmentService.create({
      project_id: projectId,
      workspace_id: null,
      assessor_name: 'Healthcare Operations Team',
      notes: 'Comprehensive healthcare operational assessment',
      recommendations: [
        {
          title: 'Electronic Health Records Integration',
          description: 'Implement comprehensive EHR system with interoperability standards for seamless patient data exchange',
          category: 'technology',
          priority: 'high',
          estimated_impact: 94,
          estimated_cost: 850000,
          estimated_timeframe: 15,
          expected_roi: 4.5,
          implementation_complexity: 'high',
          ai_generated: true,
          confidence_level: 0.89
        },
        {
          title: 'Patient Care Workflow Optimization',
          description: 'Streamline patient flow and reduce wait times through lean healthcare methodologies',
          category: 'process',
          priority: 'high',
          estimated_impact: 91,
          estimated_cost: 320000,
          estimated_timeframe: 8,
          expected_roi: 3.7,
          implementation_complexity: 'medium',
          ai_generated: true,
          confidence_level: 0.92
        },
        {
          title: 'Telemedicine Platform Expansion',
          description: 'Expand telehealth capabilities to improve patient access and reduce facility costs',
          category: 'technology',
          priority: 'medium',
          estimated_impact: 87,
          estimated_cost: 450000,
          estimated_timeframe: 6,
          expected_roi: 3.2,
          implementation_complexity: 'medium',
          ai_generated: true,
          confidence_level: 0.86
        }
      ]
    });
  }

  // Healthcare specific processes
  const processesToAdd = [
    {
      process_name: 'Patient Admission',
      description: 'Patient intake, registration, and bed assignment processes',
      category: 'core',
      maturity_level: 'managed',
      efficiency_score: 79,
      automation_potential: 85,
      criticality_level: 'critical',
      current_state: 'Electronic registration with manual verification and bed management',
      target_state: 'Automated patient flow with predictive bed assignment'
    },
    {
      process_name: 'Clinical Documentation',
      description: 'Medical record creation, maintenance, and compliance documentation',
      category: 'core',
      maturity_level: 'defined',
      efficiency_score: 72,
      automation_potential: 88,
      criticality_level: 'critical',
      current_state: 'EHR-based documentation with manual quality checks',
      target_state: 'AI-assisted clinical documentation with automated compliance'
    },
    {
      process_name: 'Medication Management',
      description: 'Prescription, dispensing, and administration of medications',
      category: 'core',
      maturity_level: 'optimized',
      efficiency_score: 91,
      automation_potential: 92,
      criticality_level: 'critical',
      current_state: 'Automated dispensing with electronic verification',
      target_state: 'AI-powered medication optimization and interaction monitoring'
    },
    {
      process_name: 'Quality Assurance',
      description: 'Patient safety monitoring and clinical quality improvement',
      category: 'support',
      maturity_level: 'managed',
      efficiency_score: 84,
      automation_potential: 75,
      criticality_level: 'high',
      current_state: 'Manual quality audits with dashboard reporting',
      target_state: 'Real-time quality monitoring with predictive alerts'
    }
  ];

  for (const process of processesToAdd) {
    OperationalProcessService.create(assessment.id, process);
  }

  // Healthcare specific benchmarks
  const benchmarksToAdd = [
    {
      benchmark_category: 'industry',
      metric_name: 'Patient Satisfaction Score',
      benchmark_value: 87,
      percentile_ranking: 72,
      benchmark_source: 'Healthcare Quality Report 2024',
      industry_sector: 'Healthcare',
      company_size_category: 'medium',
      geographic_region: 'Global',
      data_vintage: '2024'
    },
    {
      benchmark_category: 'industry',
      metric_name: 'Clinical Quality Index',
      benchmark_value: 91,
      percentile_ranking: 78,
      benchmark_source: 'Medical Excellence Benchmarking Study',
      industry_sector: 'Healthcare',
      company_size_category: 'medium',
      geographic_region: 'Global',
      data_vintage: '2024'
    },
    {
      benchmark_category: 'industry',
      metric_name: 'Operational Efficiency',
      benchmark_value: 82,
      percentile_ranking: 65,
      benchmark_source: 'Healthcare Operations Analysis 2024',
      industry_sector: 'Healthcare',
      company_size_category: 'medium',
      geographic_region: 'Global',
      data_vintage: '2024'
    },
    {
      benchmark_category: 'industry',
      metric_name: 'Digital Health Adoption',
      benchmark_value: 76,
      percentile_ranking: 58,
      benchmark_source: 'Digital Health Transformation Index',
      industry_sector: 'Healthcare',
      company_size_category: 'medium',
      geographic_region: 'Global',
      data_vintage: '2024'
    }
  ];

  for (const benchmark of benchmarksToAdd) {
    OperationalBenchmarkService.create(assessment.id, benchmark);
  }

  // Update with healthcare specific scores
  OperationalAssessmentService.update(assessment.id, {
    overall_score: 83,
    process_efficiency_score: 82,
    digital_maturity_score: 76,
    quality_management_score: 91,
    supply_chain_score: 85, // Medical supply chain
    automation_readiness_score: 85,
    cost_efficiency_score: 78,
    scalability_score: 80,
    status: 'in_progress'
  });

  return assessment;
}

export function seedHealthcareManagementData(projectId: string) {
  let assessment = ManagementAssessmentService.getByProjectId(projectId);
  
  if (!assessment) {
    assessment = ManagementAssessmentService.create({
      project_id: projectId,
      workspace_id: null,
      assessor_name: 'Healthcare Leadership Team',
      key_strengths: [
        'Deep clinical expertise and patient care focus',
        'Strong regulatory compliance and quality assurance culture',
        'Proven track record in healthcare operations and patient outcomes',
        'Established relationships with medical staff and healthcare networks'
      ],
      key_concerns: [
        'Healthcare technology adoption and digital transformation pace',
        'Physician burnout and staff retention challenges',
        'Regulatory complexity and evolving compliance requirements'
      ],
      succession_gaps: [
        'Chief Medical Officer - clinical leadership pipeline',
        'VP Patient Services - healthcare administration experience',
        'Quality Director - regulatory expertise development'
      ],
      retention_strategies: [
        'Competitive healthcare benefits and physician compensation',
        'Professional development in medical leadership and technology',
        'Work-life balance initiatives and burnout prevention programs',
        'Clinical research and continuing education opportunities'
      ]
    });
  }

  // Healthcare leadership team
  const teamMembersToAdd = [
    {
      name: 'Dr. Sarah Johnson',
      position: 'CEO & Chief Medical Officer',
      tenure_years: 12,
      leadership_score: 92,
      strategic_thinking_score: 89,
      execution_score: 91,
      financial_acumen_score: 85,
      industry_expertise_score: 98,
      team_collaboration_score: 94,
      previous_experience: ['Mayo Clinic - Department Head (10 years)', 'Johns Hopkins - Attending Physician (8 years)'],
      education_background: 'Harvard Medical School MD, Harvard Business School MBA, Yale BS Biology',
      key_achievements: ['Reduced patient readmission rates by 25%', 'Led $50M facility expansion', 'Achieved Magnet hospital designation', 'Implemented comprehensive EHR system'],
      development_areas: ['Healthcare technology innovation', 'Population health management'],
      retention_risk: 'low',
      succession_readiness: 85,
      flight_risk_factors: ['Academic medical center opportunities', 'Clinical practice considerations']
    },
    {
      name: 'Robert Martinez',
      position: 'Chief Operating Officer',
      tenure_years: 9,
      leadership_score: 88,
      strategic_thinking_score: 86,
      execution_score: 94,
      financial_acumen_score: 91,
      industry_expertise_score: 92,
      team_collaboration_score: 89,
      previous_experience: ['Cleveland Clinic - VP Operations (7 years)', 'Kaiser Permanente - Director Operations (6 years)'],
      education_background: 'Northwestern Kellogg MBA Healthcare Management, University of Michigan BS Industrial Engineering',
      key_achievements: ['Improved operational efficiency by 18%', 'Reduced average length of stay by 1.2 days', 'Led lean healthcare transformation', 'Achieved top patient satisfaction scores'],
      development_areas: ['Digital health strategy', 'Value-based care models'],
      retention_risk: 'medium',
      succession_readiness: 78,
      flight_risk_factors: ['Health system consolidation opportunities', 'Consultant role possibilities']
    },
    {
      name: 'Dr. Lisa Chen',
      position: 'Chief Quality Officer',
      tenure_years: 8,
      leadership_score: 90,
      strategic_thinking_score: 92,
      execution_score: 88,
      financial_acumen_score: 82,
      industry_expertise_score: 96,
      team_collaboration_score: 91,
      previous_experience: ['Mass General - Quality Director (6 years)', 'Stanford Hospital - Quality Manager (5 years)'],
      education_background: 'Stanford Medical School MD, MPH Public Health, UC Berkeley BS Chemistry',
      key_achievements: ['Achieved zero preventable hospital-acquired infections', 'Led Joint Commission accreditation', 'Implemented patient safety initiatives', 'Reduced medical errors by 40%'],
      development_areas: ['Healthcare analytics', 'Quality measurement systems'],
      retention_risk: 'low',
      succession_readiness: 82,
      flight_risk_factors: ['Regulatory agency opportunities', 'Academic research positions']
    },
    {
      name: 'Jennifer Thompson',
      position: 'Chief Financial Officer',
      tenure_years: 6,
      leadership_score: 86,
      strategic_thinking_score: 88,
      execution_score: 92,
      financial_acumen_score: 96,
      industry_expertise_score: 89,
      team_collaboration_score: 87,
      previous_experience: ['HCA Healthcare - VP Finance (8 years)', 'Deloitte - Senior Manager Healthcare (5 years)'],
      education_background: 'Wharton MBA Finance, CPA License, Duke BS Accounting',
      key_achievements: ['Improved operating margin by 15%', 'Led value-based care contracting', 'Secured $200M capital financing', 'Implemented cost accounting system'],
      development_areas: ['Healthcare technology ROI', 'Population health economics'],
      retention_risk: 'medium',
      succession_readiness: 75,
      flight_risk_factors: ['Healthcare consulting opportunities', 'Health tech company positions']
    }
  ];

  const createdMembers = [];
  for (const member of teamMembersToAdd) {
    const createdMember = ManagementTeamMemberService.create(assessment.id, member);
    createdMembers.push(createdMember);
  }

  // Add qualification assessments for each team member
  for (const member of createdMembers) {
    try {
      seedQualificationAssessments(member.id);
      console.log(`Seeded qualification assessments for ${member.name}`);
    } catch (error) {
      console.error(`Failed to seed qualification assessments for ${member.name}:`, error);
    }
  }

  // Update assessment scores
  ManagementAssessmentService.update(assessment.id, {
    overall_team_score: 90,
    leadership_score: 89,
    strategic_thinking_score: 89,
    execution_capability_score: 91,
    financial_acumen_score: 88,
    industry_expertise_score: 94,
    team_dynamics_score: 90,
    succession_readiness_score: 80,
    retention_risk_score: 35, // Moderate risk due to healthcare market dynamics
    status: 'in_progress'
  });

  return assessment;
}

export function seedProjectData(projectId: string, template: 'technology' | 'manufacturing' | 'financial' | 'healthcare' = 'technology') {
  console.log(`Seeding data for project: ${projectId} with ${template} template`);
  
  let opAssessment, mgmtAssessment;
  
  switch (template) {
    case 'manufacturing':
      opAssessment = seedManufacturingOperationalData(projectId);
      mgmtAssessment = seedManufacturingManagementData(projectId);
      break;
    case 'financial':
      opAssessment = seedFinancialOperationalData(projectId);
      mgmtAssessment = seedFinancialManagementData(projectId);
      break;
    case 'healthcare':
      opAssessment = seedHealthcareOperationalData(projectId);
      mgmtAssessment = seedHealthcareManagementData(projectId);
      break;
    default:
      opAssessment = seedOperationalData(projectId);
      mgmtAssessment = seedManagementData(projectId);
  }
  
  console.log(`Seeded operational assessment: ${opAssessment.id}`);
  console.log(`Seeded management assessment: ${mgmtAssessment.id}`);
  
  return {
    operational: opAssessment,
    management: mgmtAssessment
  };
}