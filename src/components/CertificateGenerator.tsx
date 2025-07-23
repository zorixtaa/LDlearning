import React from 'react';
import { Download, Award, CheckCircle, Calendar, User, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Certificate, Module, User as UserType } from '../types';

interface CertificateGeneratorProps {
  certificate: Certificate;
  module: Module;
  user: UserType;
  onDownload: () => void;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  certificate,
  module,
  user,
  onDownload
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Certificate Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4"
          >
            <Award className="h-8 w-8" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">CERTIFICADO DE FINALIZACIÓN</h1>
          <p className="text-blue-100">LÍNEA EDUCATRACK - Plataforma de Formación Logística</p>
          <p className="text-blue-100 text-sm">Conforme a ISO 9001:2015</p>
        </div>

        {/* Certificate Body */}
        <div className="p-8" id="certificate-content">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Se certifica que
            </h2>
            <div className="border-b-2 border-blue-600 pb-2 mb-6 max-w-md mx-auto">
              <p className="text-3xl font-bold text-blue-600">{user.name}</p>
            </div>
            <p className="text-lg text-gray-700 mb-2">
              ha completado satisfactoriamente el módulo
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {module.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {module.description}
            </p>
          </div>

          {/* Certificate Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Candidato</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.department}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Puntuación</p>
                  <p className="font-bold text-green-600 text-xl">{certificate.score}%</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Fecha de Emisión</p>
                  <p className="font-medium text-gray-900">{formatDate(certificate.issuedAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Código de Verificación</p>
                  <p className="font-mono text-sm text-blue-600">{certificate.verificationCode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Module Topics */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Temas Cubiertos</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {module.topics.map((topic, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="border-b border-gray-300 mb-2 pb-8"></div>
              <p className="font-medium text-gray-900">Director de Formación</p>
              <p className="text-sm text-gray-600">LÍNEA EDUCATRACK</p>
            </div>
            
            <div className="text-center">
              <div className="border-b border-gray-300 mb-2 pb-8"></div>
              <p className="font-medium text-gray-900">Certificación ISO</p>
              <p className="text-sm text-gray-600">9001:2015 Compliant</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Este certificado es válido y puede ser verificado en línea usando el código de verificación.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Emitido por LÍNEA EDUCATRACK - Sistema de Gestión de Calidad ISO 9001:2015
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-8 py-4 flex justify-center">
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Descargar Certificado PDF
          </button>
        </div>
      </div>
    </div>
  );
};