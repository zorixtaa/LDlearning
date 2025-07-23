import type { Module } from '../types';

export const modules: Module[] = [
  {
    id: 'basic-transport',
    title: '1. Basic Transport Guide',
    description: 'Fundamentals of Tautliner vs Frigorífico, trailer dimensions, Kingpin, patas, termógrafo',
    topics: ['Tautliner Operations', 'Frigorífico Systems', 'Trailer Specifications', 'Kingpin Procedures', 'Temperature Monitoring'],
    duration: 45,
    difficulty: 'Beginner',
    badge: 'Transport Basics',
    documentUrl: '01-GUIA-BASICA-DE-TRANS.pdf',
    version: '1.2',
    lastUpdated: new Date('2024-12-01'),
    isActive: true,
    requiredScore: 70,
    maxAttempts: 3
  },
  {
    id: 'direct-loads',
    title: '2. Direct Loads (Cargas Directas)',
    description: 'Managing assignments, ferry names, and cost screens for direct loading operations',
    topics: ['Assignment Management', 'Ferry Operations', 'Cost Analysis', 'Direct Load Procedures'],
    duration: 60,
    difficulty: 'Intermediate',
    prerequisites: ['basic-transport'],
    badge: 'Direct Load Master',
    documentUrl: '03-CARGAS-DIRECTAS.pdf',
    version: '1.1',
    lastUpdated: new Date('2024-11-15'),
    isActive: true,
    requiredScore: 75,
    maxAttempts: 3
  },
  {
    id: 'trucking-romper',
    title: '3. Trucking & Romper un Pedido',
    description: 'Segment splitting, tramo 1-2-3 logic, CLDN/DFDS ports, future assignment tagging',
    topics: ['Order Segmentation', 'Tramo Logic', 'Port Operations', 'Assignment Tagging'],
    duration: 90,
    difficulty: 'Advanced',
    prerequisites: ['direct-loads'],
    badge: 'Romper Pro',
    documentUrl: '04-01-PROCEDIMIENTO-TRU.pdf',
    version: '2.0',
    lastUpdated: new Date('2024-12-10'),
    isActive: true,
    requiredScore: 80,
    maxAttempts: 2
  },
  {
    id: 'ferry-customs',
    title: '4. Ferry & Customs Procedures',
    description: 'Booking confirmation, dispatch documentation, OJO documentation compliance',
    topics: ['Ferry Booking', 'Customs Documentation', 'Dispatch Procedures', 'Compliance Requirements'],
    duration: 75,
    difficulty: 'Intermediate',
    prerequisites: ['basic-transport'],
    badge: 'Customs Expert',
    documentUrl: 'DOCUMENTOS-PROCEDIMIENTOS.pdf',
    version: '1.3',
    lastUpdated: new Date('2024-11-20'),
    isActive: true,
    requiredScore: 75,
    maxAttempts: 3
  },
  {
    id: 'driving-times',
    title: '5. Pauses and Driving Times',
    description: 'Mandatory pause intervals, max driving hours, violation management',
    topics: ['Driving Time Regulations', 'Mandatory Pauses', 'Violation Prevention', 'Compliance Monitoring'],
    duration: 30,
    difficulty: 'Beginner',
    badge: 'Time Master',
    documentUrl: '05-PAUSAS-Y-TIEMPOS.pdf',
    version: '1.0',
    lastUpdated: new Date('2024-10-01'),
    isActive: true,
    requiredScore: 70,
    maxAttempts: 3
  },
  {
    id: 'pallet-exchange',
    title: '6. Pallet Exchange Protocols',
    description: 'CHEP vs European pallets, documentation, warehouse returns',
    topics: ['CHEP Procedures', 'European Pallet Standards', 'Exchange Documentation', 'Warehouse Returns'],
    duration: 40,
    difficulty: 'Intermediate',
    badge: 'Pallet Pro',
    documentUrl: '07-INTERCAMBIO-DE-PALLETS.pdf',
    version: '1.1',
    lastUpdated: new Date('2024-11-05'),
    isActive: true,
    requiredScore: 75,
    maxAttempts: 3
  },
  {
    id: 'incident-registration',
    title: '7. Incident Registration',
    description: 'Difference between Reclamaciones vs No Conformidades, root cause, resolution process',
    topics: ['Incident Classification', 'Root Cause Analysis', 'Resolution Procedures', 'Documentation Standards'],
    duration: 50,
    difficulty: 'Intermediate',
    badge: 'Incident Handler',
    documentUrl: '08-02-REGISTRO-INCIDENCIAS.pdf',
    version: '1.2',
    lastUpdated: new Date('2024-12-05'),
    isActive: true,
    requiredScore: 75,
    maxAttempts: 3
  },
  {
    id: 'order-management',
    title: '8. Creating and Managing Orders',
    description: 'Master data entry: vehicle types, bultos, ferry status, observations',
    topics: ['Order Creation', 'Vehicle Classification', 'Status Management', 'Data Entry Procedures'],
    duration: 65,
    difficulty: 'Advanced',
    prerequisites: ['direct-loads', 'ferry-customs'],
    badge: 'Order Master',
    documentUrl: 'PROCEDIMIENTOS-A-SEGUIR.pdf',
    version: '1.4',
    lastUpdated: new Date('2024-12-12'),
    isActive: true,
    requiredScore: 80,
    maxAttempts: 2
  }
];

export const badges = [
  {
    id: 'transport-basics',
    name: 'Transport Basics',
    description: 'Mastered fundamental transport operations',
    icon: '🚛',
    color: 'bg-blue-500',
    requirements: ['Complete Basic Transport Guide with 70%+'],
    category: 'completion' as const
  },
  {
    id: 'direct-load-master',
    name: 'Direct Load Master',
    description: 'Expert in direct loading operations',
    icon: '📦',
    color: 'bg-green-500',
    requirements: ['Complete Direct Loads with 75%+'],
    category: 'completion' as const
  },
  {
    id: 'romper-pro',
    name: 'Romper Pro',
    description: 'Advanced order segmentation specialist',
    icon: '⚡',
    color: 'bg-purple-500',
    requirements: ['Complete Trucking & Romper with 80%+', 'Use simulator successfully'],
    category: 'specialty' as const
  },
  {
    id: 'customs-expert',
    name: 'Customs Expert',
    description: 'Ferry and customs procedures specialist',
    icon: '🛳️',
    color: 'bg-indigo-500',
    requirements: ['Complete Ferry & Customs with 75%+'],
    category: 'completion' as const
  },
  {
    id: 'time-master',
    name: 'Time Master',
    description: 'Driving time and pause regulation expert',
    icon: '⏰',
    color: 'bg-yellow-500',
    requirements: ['Complete Driving Times with 70%+'],
    category: 'completion' as const
  },
  {
    id: 'pallet-pro',
    name: 'Pallet Pro',
    description: 'Pallet exchange protocol specialist',
    icon: '📐',
    color: 'bg-orange-500',
    requirements: ['Complete Pallet Exchange with 75%+'],
    category: 'completion' as const
  },
  {
    id: 'incident-handler',
    name: 'Incident Handler',
    description: 'Expert in incident registration and resolution',
    icon: '🚨',
    color: 'bg-red-500',
    requirements: ['Complete Incident Registration with 75%+'],
    category: 'specialty' as const
  },
  {
    id: 'order-master',
    name: 'Order Master',
    description: 'Advanced order creation and management specialist',
    icon: '📋',
    color: 'bg-teal-500',
    requirements: ['Complete Order Management with 80%+'],
    category: 'specialty' as const
  },
  {
    id: 'cmr-master',
    name: 'CMR Master',
    description: 'Documentation compliance expert',
    icon: '📄',
    color: 'bg-gray-500',
    requirements: ['Perfect documentation upload score', 'Zero compliance violations'],
    category: 'performance' as const
  },
  {
    id: 'trucking-tactician',
    name: 'Trucking Tactician',
    description: 'Complete trucking operations specialist',
    icon: '🎯',
    color: 'bg-emerald-500',
    requirements: ['Complete all trucking modules', 'Maintain 85%+ average'],
    category: 'performance' as const
  }
];