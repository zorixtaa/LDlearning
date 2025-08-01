import React, { useState, useEffect } from 'react';
import { Bot, TestTube, CheckCircle, XCircle, AlertTriangle, Save, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIProvider {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  requiresApiKey: boolean;
  models: string[];
  maxTokens: number;
  supportedFeatures: string[];
}

interface AIConfiguration {
  provider: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  enabled: boolean;
}

export const AIConfigurationPanel: React.FC = () => {
  const [config, setConfig] = useState<AIConfiguration>({
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: `Eres Diego, un experto tutor de IA especializado en logística y transporte para LÍNEA EDUCATRACK. 

Tu misión es ayudar a los candidatos con:
- Procedimientos de transporte (Tautliner vs Frigorífico)
- Gestión de cargas directas y ferry
- Procesos de "romper un pedido" y segmentación de tramos
- Documentación aduanera y cumplimiento OJO
- Tiempos de conducción y pausas obligatorias
- Intercambio de pallets (CHEP vs Europeos)
- Registro de incidencias (Reclamaciones vs No Conformidades)
- Creación y gestión de órdenes

Responde siempre en español, de manera clara y profesional, basándote en los estándares ISO 9001:2015. Proporciona ejemplos prácticos cuando sea posible.`,
    enabled: false
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message?: string }>({ status: 'idle' });
  const [isSaving, setIsSaving] = useState(false);

  const aiProviders: AIProvider[] = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT-4, GPT-3.5 Turbo models with advanced reasoning capabilities',
      baseUrl: 'https://api.openai.com/v1',
      requiresApiKey: true,
      models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      maxTokens: 4000,
      supportedFeatures: ['Chat', 'Contextual Help', 'Document Analysis', 'Simulation Guidance']
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      description: 'Claude 3 models with excellent instruction following and safety',
      baseUrl: 'https://api.anthropic.com/v1',
      requiresApiKey: true,
      models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
      maxTokens: 4000,
      supportedFeatures: ['Chat', 'Contextual Help', 'Document Analysis', 'Safety Compliance']
    },
    {
      id: 'azure',
      name: 'Azure OpenAI',
      description: 'Enterprise-grade OpenAI models with enhanced security and compliance',
      baseUrl: 'https://your-resource.openai.azure.com',
      requiresApiKey: true,
      models: ['gpt-4', 'gpt-35-turbo'],
      maxTokens: 4000,
      supportedFeatures: ['Chat', 'Enterprise Security', 'GDPR Compliance', 'Audit Logs']
    },
    {
      id: 'local',
      name: 'Local/Self-Hosted',
      description: 'Connect to your own AI model deployment (Ollama, LocalAI, etc.)',
      baseUrl: 'http://localhost:11434',
      requiresApiKey: false,
      models: ['llama2', 'mistral', 'codellama', 'custom'],
      maxTokens: 2000,
      supportedFeatures: ['Privacy', 'Custom Models', 'No API Costs', 'Full Control']
    }
  ];

  useEffect(() => {
    // Load saved configuration
    const savedConfig = localStorage.getItem('educatrack_ai_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const fetchAIResponse = async (message: string, cfg: AIConfiguration): Promise<string> => {
    try {
      let url = '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      let body: Record<string, unknown> = {};

      if (cfg.provider === 'openai') {
        url = `${cfg.baseUrl}/chat/completions`;
        headers['Authorization'] = `Bearer ${cfg.apiKey}`;
        body = {
          model: cfg.model,
          messages: [
            { role: 'system', content: cfg.systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: cfg.temperature,
          max_tokens: cfg.maxTokens
        };
      } else if (cfg.provider === 'anthropic') {
        url = `${cfg.baseUrl}/messages`;
        headers['x-api-key'] = cfg.apiKey;
        body = {
          model: cfg.model,
          max_tokens: cfg.maxTokens,
          messages: [{ role: 'user', content: `${cfg.systemPrompt}\n\n${message}` }],
          temperature: cfg.temperature
        };
      } else if (cfg.provider === 'azure') {
        url = `${cfg.baseUrl}/openai/deployments/${cfg.model}/chat/completions?api-version=2024-02-15-preview`;
        headers['api-key'] = cfg.apiKey;
        body = {
          messages: [
            { role: 'system', content: cfg.systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: cfg.temperature,
          max_tokens: cfg.maxTokens
        };
      } else {
        url = `${cfg.baseUrl}/chat`;
        if (cfg.apiKey) headers['Authorization'] = `Bearer ${cfg.apiKey}`;
        body = {
          model: cfg.model,
          messages: [
            { role: 'system', content: cfg.systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: cfg.temperature,
          max_tokens: cfg.maxTokens
        };
      }

      const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
      const data = await res.json();
      return (
        data.choices?.[0]?.message?.content ||
        data.content ||
        ''
      ).trim();
    } catch {
      return '';
    }
  };

  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage (in production, this would be saved to backend)
      localStorage.setItem('educatrack_ai_config', JSON.stringify(config));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSaving(false);
      alert('Configuración guardada exitosamente');
    } catch (_error) {
      setIsSaving(false);
      alert('Error al guardar la configuración');
    }
  };

  const handleTestConnection = async () => {
    setTestResult({ status: 'testing' });

    try {
      if (!config.apiKey && aiProviders.find(p => p.id === config.provider)?.requiresApiKey) {
        setTestResult({ status: 'error', message: 'API Key requerida para este proveedor' });
        return;
      }

      const response = await fetchAIResponse('Hola', config);
      if (response) {
        setTestResult({ status: 'success', message: 'Conexión exitosa. El tutor IA está listo para usar.' });
      } else {
        setTestResult({ status: 'error', message: 'No se recibió respuesta del servicio' });
      }
    } catch (_error) {
      setTestResult({ status: 'error', message: 'Error de conexión. Verifica tu API Key y configuración.' });
    }
  };

  const selectedProvider = aiProviders.find(p => p.id === config.provider);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración del Tutor IA</h1>
          <p className="text-gray-600">Configura la integración con servicios de IA para el tutor Diego</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            config.enabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {config.enabled ? 'Activo' : 'Inactivo'}
          </div>
        </div>
      </div>

      {/* Provider Selection */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Proveedor de IA</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiProviders.map((provider) => (
            <div
              key={provider.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                config.provider === provider.id
                  ? 'border-blue-500 bg-blue-900/30'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setConfig(prev => ({ ...prev, provider: provider.id }))}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-100">{provider.name}</h3>
                {config.provider === provider.id && (
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-gray-400 mb-3">{provider.description}</p>
              <div className="flex flex-wrap gap-1">
                {provider.supportedFeatures.map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Details */}
      {selectedProvider && (
        <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Configuración de {selectedProvider.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* API Configuration */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-100">Configuración de API</h3>
              
              {selectedProvider.requiresApiKey && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Key *
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={config.apiKey}
                      onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="sk-..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Base URL
                </label>
                <input
                  type="text"
                  value={selectedProvider.baseUrl}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-300"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Modelo
                </label>
                <select
                  value={config.model}
                  onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {selectedProvider.models.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Model Parameters */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-100">Parámetros del Modelo</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Temperatura: {config.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.temperature}
                  onChange={(e) => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Más preciso</span>
                  <span>Más creativo</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Máximo de Tokens
                </label>
                <input
                  type="number"
                  min="100"
                  max={selectedProvider.maxTokens}
                  value={config.maxTokens}
                  onChange={(e) => setConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={config.enabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="enabled" className="text-sm font-medium text-gray-300">
                  Habilitar tutor IA
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Prompt */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Prompt del Sistema</h2>
        <p className="text-sm text-gray-400 mb-4">
          Define la personalidad y conocimientos del tutor IA Diego. Este prompt establece el contexto y comportamiento del asistente.
        </p>
        <textarea
          value={config.systemPrompt}
          onChange={(e) => setConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
          className="w-full h-40 px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder="Eres Diego, un experto tutor de IA..."
        />
      </div>

      {/* Test Connection */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-100">Probar Conexión</h2>
          <button
            onClick={handleTestConnection}
            disabled={testResult.status === 'testing'}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {testResult.status === 'testing' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Probando...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4" />
                Probar Conexión
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {testResult.status !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-4 rounded-lg border-l-4 ${
                testResult.status === 'success' 
                  ? 'bg-green-900/30 border-green-500' 
                  : testResult.status === 'error'
                  ? 'bg-red-900/30 border-red-500'
                  : 'bg-blue-900/30 border-blue-500'
              }`}
            >
              <div className="flex items-center gap-2">
                {testResult.status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                {testResult.status === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
                {testResult.status === 'testing' && <AlertTriangle className="h-5 w-5 text-blue-600" />}
                <p className="text-sm font-medium">
                  {testResult.message || 'Probando conexión...'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Save Configuration */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveConfiguration}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar Configuración
            </>
          )}
        </button>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-900/30 p-6 rounded-xl border border-blue-700">
        <div className="flex items-start gap-3">
          <Bot className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-medium text-blue-300 mb-2">Instrucciones de Uso</h3>
            <div className="text-sm text-blue-400 space-y-2">
              <p><strong>OpenAI:</strong> Obtén tu API key en platform.openai.com</p>
              <p><strong>Anthropic:</strong> Regístrate en console.anthropic.com para obtener acceso</p>
              <p><strong>Azure OpenAI:</strong> Configura tu recurso en Azure Portal</p>
              <p><strong>Local:</strong> Instala Ollama o LocalAI en tu servidor</p>
              <p className="mt-3 font-medium">Una vez configurado, el tutor Diego estará disponible en todos los módulos de entrenamiento.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};