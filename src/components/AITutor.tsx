import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, X, Minimize2, Maximize2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  moduleContext?: string;
}

export const AITutor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [aiConfig, setAiConfig] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '¡Hola! Soy Diego, tu tutor de IA para LÍNEA EDUCATRACK. Estoy aquí para ayudarte con cualquier duda sobre los procedimientos logísticos. ¿En qué puedo asistirte hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load AI configuration
    const savedConfig = localStorage.getItem('educatrack_ai_config');
    if (savedConfig) {
      setAiConfig(JSON.parse(savedConfig));
    }
  }, []);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const diegoResponses = {
    'romper': [
      'Recuerda que en el módulo "Romper un Pedido", es crucial verificar que cada tramo tenga la documentación correcta antes de proceder.',
      'Para segmentar correctamente un pedido, primero identifica los puertos CLDN/DFDS y asigna los tramos según la ruta óptima.',
      'El sistema de tramos 1-2-3 debe seguir la lógica geográfica. ¿Necesitas que te explique algún tramo específico?'
    ],
    'ferry': [
      'En los procedimientos de ferry, siempre confirma la reserva antes de generar la documentación de despacho.',
      'La documentación OJO es fundamental para el cumplimiento. Asegúrate de que todos los campos estén completos.',
      'Para las aduanas, cada documento debe estar validado antes del embarque. ¿Tienes dudas sobre algún documento específico?'
    ],
    'transport': [
      'La diferencia entre Tautliner y Frigorífico es clave: el termógrafo solo se usa en transportes refrigerados.',
      'Las dimensiones del tráiler y el Kingpin deben verificarse antes de la carga. ¿Necesitas ayuda con las especificaciones?',
      'Las patas del tráiler deben ajustarse correctamente para evitar daños durante la carga/descarga.'
    ],
    'incident': [
      'Una Reclamación se refiere a quejas de clientes, mientras que una No Conformidad es un incumplimiento interno.',
      'Para el análisis de causa raíz, usa la metodología de los 5 porqués. ¿Quieres que te guíe en un ejemplo?',
      'La resolución debe documentarse completamente para cumplir con ISO 9001:2015.'
    ],
    'time': [
      'Los tiempos de conducción están regulados: máximo 9h diarias y 56h semanales.',
      'Las pausas obligatorias son: 45 minutos después de 4.5 horas de conducción.',
      'Si detectas una violación, debes reportarla inmediatamente y programar el descanso necesario.'
    ],
    'pallet': [
      'Los pallets CHEP se distinguen por su color azul y requieren documentación específica.',
      'Los pallets europeos son de madera natural y siguen el estándar EUR.',
      'Para el intercambio, siempre documenta el estado y cantidad exacta de pallets.'
    ],
    'order': [
      'Al crear una orden, verifica: tipo de vehículo, número de bultos, estado del ferry y observaciones.',
      'Los datos maestros deben estar completos antes de confirmar la orden.',
      'Las observaciones son críticas para operaciones especiales. ¿Necesitas ejemplos?'
    ],
    'general': [
      'Como especialista en logística, puedo ayudarte con cualquier aspecto de los 8 módulos de EDUCATRACK.',
      'Si tienes dudas específicas sobre un procedimiento, compárteme el contexto y te daré la mejor guía.',
      '¿En qué módulo estás trabajando actualmente? Puedo darte consejos específicos.',
      'Recuerda que todos nuestros procedimientos siguen los estándares ISO 9001:2015.'
    ]
  };

  const getResponseCategory = (message: string): keyof typeof diegoResponses => {
    const lower = message.toLowerCase();
    if (lower.includes('romper') || lower.includes('pedido') || lower.includes('tramo')) return 'romper';
    if (lower.includes('ferry') || lower.includes('aduana') || lower.includes('customs')) return 'ferry';
    if (lower.includes('transport') || lower.includes('trailer') || lower.includes('frigorifico')) return 'transport';
    if (lower.includes('incident') || lower.includes('reclamacion') || lower.includes('conformidad')) return 'incident';
    if (lower.includes('tiempo') || lower.includes('pausa') || lower.includes('conduccion')) return 'time';
    if (lower.includes('pallet') || lower.includes('chep') || lower.includes('europeo')) return 'pallet';
    if (lower.includes('orden') || lower.includes('order') || lower.includes('bulto')) return 'order';
    return 'general';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Check if AI is configured and enabled
    if (aiConfig?.enabled && aiConfig?.apiKey) {
      try {
        // In a real implementation, this would call the configured AI API
        // For now, we'll simulate an enhanced AI response
        setTimeout(() => {
          const enhancedResponse = getEnhancedAIResponse(inputMessage, aiConfig);
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: enhancedResponse,
            timestamp: new Date(),
            moduleContext: getResponseCategory(inputMessage)
          };
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 2000);
      } catch (error) {
        // Fallback to default responses
        setTimeout(() => {
          const category = getResponseCategory(inputMessage);
          const responses = diegoResponses[category];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: randomResponse,
            timestamp: new Date(),
            moduleContext: category
          };
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 1500);
      }
    } else {
      // Use default responses when AI is not configured
      setTimeout(() => {
      const category = getResponseCategory(inputMessage);
      const responses = diegoResponses[category];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: randomResponse,
        timestamp: new Date(),
        moduleContext: category
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      }, 1500);
    }
  };

  const getEnhancedAIResponse = (message: string, config: any): string => {
    // This would integrate with the configured AI service
    // For demo purposes, we'll return enhanced responses based on the configuration
    const category = getResponseCategory(message);
    const baseResponses = diegoResponses[category];
    const baseResponse = baseResponses[Math.floor(Math.random() * baseResponses.length)];
    
    // Simulate AI enhancement based on model configuration
    if (config.model.includes('gpt-4')) {
      return `${baseResponse}\n\n💡 **Consejo avanzado**: Basándome en mi análisis con ${config.model}, te recomiendo también revisar la documentación relacionada y practicar con el simulador para reforzar este concepto.`;
    } else if (config.model.includes('claude')) {
      return `${baseResponse}\n\n🎯 **Análisis detallado**: Según los estándares ISO 9001:2015, este procedimiento requiere especial atención a la trazabilidad y documentación completa.`;
    } else {
      return `${baseResponse}\n\n🚀 **Tip personalizado**: Con tu modelo ${config.model}, puedo ayudarte con análisis más específicos si compartes más detalles sobre tu situación particular.`;
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    '¿Cómo romper un pedido?',
    '¿Diferencia entre CHEP y EUR?',
    '¿Qué es una No Conformidad?',
    '¿Tiempos de conducción?'
  ];

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50 transition-colors"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className={`fixed bottom-6 right-6 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 z-50 ${
              isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
            } transition-all duration-300`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium">Diego - AI Tutor</h3>
                  <p className="text-xs text-blue-100">
                    {aiConfig?.enabled ? `Powered by ${aiConfig.model}` : 'Especialista en Logística'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-blue-500 rounded transition-colors"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-blue-500 rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-2 ${
                        message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        message.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Bot className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-100'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-start gap-2">
                      <div className="p-2 rounded-full bg-gray-700">
                        <Bot className="h-4 w-4 text-gray-300" />
                      </div>
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                <div className="px-4 py-2 border-t border-gray-700">
                  <div className="flex items-center gap-1 mb-2">
                    <HelpCircle className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-400">Preguntas frecuentes:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(question)}
                        className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu pregunta sobre logística..."
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};