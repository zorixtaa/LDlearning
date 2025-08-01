import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { LoginForm } from './components/LoginForm';
import { Navigation } from './components/Navigation';
import { AdminDashboard } from './components/AdminDashboard';
import { LearnerDashboard } from './components/LearnerDashboard';
import { TrainerDashboard } from './components/TrainerDashboard';
import { CourseBuilder } from './components/CourseBuilder';
import { ModulesView } from './components/ModulesView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { UserManagement } from './components/UserManagement';
import { AITutor } from './components/AITutor';
import { QuizSystem } from './components/QuizSystem';
import { CertificateGenerator } from './components/CertificateGenerator';
import { AIConfigurationPanel } from './components/AIConfigurationPanel';
import { useAuth } from './hooks/useAuth';
import { modules as staticModules } from './data/modules';
import { useTheme } from './hooks/useTheme';
import { useModules } from './hooks/useModules';

const AppContent: React.FC = () => {
  useTheme();
  const { user, isLoading } = useAuth();
  const { modules } = useModules();
  const allModules = modules.length > 0 ? modules : staticModules;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuiz, setShowQuiz] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-900 dark:text-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando LÍNEA EDUCATRACK...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  if (showQuiz) {
    return (
      <QuizSystem
        moduleId={showQuiz}
        onComplete={(score, timeSpent) => {
          console.log('Quiz completed:', { score, timeSpent });
          // Generate certificate if score is passing
          if (score >= 70) {
            const module = allModules.find(m => m.id === showQuiz);
            if (module) {
              const certificate = {
                id: Date.now().toString(),
                userId: user.id,
                moduleId: showQuiz,
                issuedAt: new Date(),
                verificationCode: `EDU-${Date.now().toString(36).toUpperCase()}`,
                score,
                status: 'active' as const
              };
              setShowCertificate({ certificate, module, user });
            }
          }
          setShowQuiz(null);
        }}
        onExit={() => setShowQuiz(null)}
      />
    );
  }

  if (showCertificate) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-gray-900 dark:text-gray-100">
        <CertificateGenerator
          certificate={showCertificate.certificate}
          module={showCertificate.module}
          user={showCertificate.user}
          onDownload={() => {
            console.log('Downloading certificate...');
            // In a real app, this would generate and download a PDF
          }}
        />
        <div className="text-center mt-6">
          <button
            onClick={() => setShowCertificate(null)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (user.role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'users':
          return <UserManagement />;
        case 'modules':
          return <ModulesView />;
        case 'analytics':
          return <AnalyticsDashboard />;
        case 'ai-config':
          return <AIConfigurationPanel />;
        case 'builder':
          return <CourseBuilder />;
        case 'settings':
          return (
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Configuración del Sistema</h2>
              <p className="text-gray-400">Panel de configuración en desarrollo...</p>
            </div>
          );
        default:
          return <AdminDashboard />;
      }
    } else if (user.role === 'trainer') {
      switch (activeTab) {
        case 'dashboard':
          return <TrainerDashboard />;
        case 'modules':
          return <ModulesView />;
        case 'builder':
          return <CourseBuilder />;
        default:
          return <TrainerDashboard />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
          return <LearnerDashboard />;
        case 'modules':
          return <ModulesView />;
        case 'certificates':
          return (
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Mis Certificados</h2>
              <p className="text-gray-400">Gestión de certificados en desarrollo...</p>
            </div>
          );
        case 'profile':
          return (
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Mi Perfil</h2>
              <p className="text-gray-400">Configuración de perfil en desarrollo...</p>
            </div>
          );
        default:
          return <LearnerDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      <AITutor />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;