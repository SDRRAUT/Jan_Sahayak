import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  X, 
  AlertTriangle, 
  RefreshCw, 
  Minimize2, 
  Maximize2,
  Database,
  Shield,
  User,
  Building2,
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// ============================================================================
// Markdown Content Formatter (Light, Modern, High Contrast)
// ============================================================================

function renderFormattedInline(str) {
  if (!str) return null;
  const parts = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIdx = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIdx) {
      parts.push(str.substring(lastIdx, match.index));
    }
    parts.push(
      <strong key={`b-${key++}`} style={{ fontWeight: 700, color: '#0F172A' }}>
        {match[1]}
      </strong>
    );
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < str.length) {
    parts.push(str.substring(lastIdx));
  }

  return parts;
}

function FormattedMarkdown({ content }) {
  if (!content || typeof content !== 'string') return null;

  const lines = content.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} style={{ height: '4px' }} />;
        }

        // Heading 3: ### ...
        if (trimmed.startsWith('### ')) {
          return (
            <div key={lineIdx} style={{ fontSize: '14px', fontWeight: 800, color: '#0284C7', marginTop: '4px', letterSpacing: '-0.01em' }}>
              {renderFormattedInline(trimmed.replace('### ', ''))}
            </div>
          );
        }

        // Heading 2: ## ...
        if (trimmed.startsWith('## ')) {
          return (
            <div key={lineIdx} style={{ fontSize: '15px', fontWeight: 800, color: '#0369A1', marginTop: '6px', letterSpacing: '-0.01em' }}>
              {renderFormattedInline(trimmed.replace('## ', ''))}
            </div>
          );
        }

        // Bullet points: • or * or -
        if (trimmed.startsWith('• ') || trimmed.startsWith('* ') || (trimmed.startsWith('- ') && !trimmed.startsWith('---'))) {
          const bulletText = trimmed.replace(/^([•\*\-]\s*)/, '');
          return (
            <div key={lineIdx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', paddingLeft: '2px' }}>
              <span style={{ color: '#059669', fontSize: '14px', lineHeight: '1.5', flexShrink: 0, fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, fontSize: '13.5px', lineHeight: '1.55', color: '#334155' }}>
                {renderFormattedInline(bulletText)}
              </span>
            </div>
          );
        }

        // Numbered list: 1. 2. 3.
        const numMatch = trimmed.match(/^(\d+)\.\s*(.*)/);
        if (numMatch) {
          return (
            <div key={lineIdx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', paddingLeft: '2px' }}>
              <span style={{ color: '#0284C7', fontSize: '13px', fontWeight: 700, lineHeight: '1.5', flexShrink: 0 }}>{numMatch[1]}.</span>
              <span style={{ flex: 1, fontSize: '13.5px', lineHeight: '1.55', color: '#334155' }}>
                {renderFormattedInline(numMatch[2])}
              </span>
            </div>
          );
        }

        // Divider
        if (trimmed === '---') {
          return <div key={lineIdx} style={{ height: '1px', background: '#E2E8F0', margin: '6px 0' }} />;
        }

        // Standard Paragraph
        return (
          <p key={lineIdx} style={{ margin: 0, fontSize: '13.5px', lineHeight: '1.55', color: '#1E293B' }}>
            {renderFormattedInline(line)}
          </p>
        );
      })}
    </div>
  );
}

// ============================================================================
// Modern JanSahayak Assistant Component (Light & Interactive Theme)
// ============================================================================

export default function JanSahayakAssistant() {
  const location = useLocation();
  const { user, token } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeActionProposal, setActiveActionProposal] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const role = (user?.role || 'citizen').toLowerCase();

  // Page context extraction
  const getPageContext = () => {
    const path = location.pathname;
    let entityType = null;
    let entityId = null;
    let pageLabel = 'JanSahayak Gateway';

    if (path.startsWith('/citizen/complaints/')) {
      entityType = 'complaint';
      entityId = path.replace('/citizen/complaints/', '');
      pageLabel = `Complaint #${entityId}`;
    } else if (path.startsWith('/intelligence/incidents/')) {
      entityType = 'incident';
      entityId = path.replace('/intelligence/incidents/', '');
      pageLabel = `Incident #${entityId}`;
    } else if (path === '/citizen' || path === '/citizen/submit') {
      pageLabel = 'Citizen Portal & Grievance Filing';
    } else if (path === '/officer') {
      pageLabel = 'Officer Workspace';
    } else if (path === '/intelligence') {
      pageLabel = 'Civic Intelligence';
    } else if (path === '/admin/super') {
      pageLabel = 'Super Admin Console';
    }

    return {
      current_route: path,
      current_page: pageLabel,
      current_entity_type: entityType,
      current_entity_id: entityId
    };
  };

  const pageContext = getPageContext();

  const roleConfig = {
    citizen: {
      label: 'Citizen Sahayak',
      icon: User,
      badgeColor: '#059669',
      badgeBg: '#ECFDF5',
      glow: 'rgba(5, 150, 105, 0.15)',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      welcome: `Namaste **${user?.name || 'Citizen'}**! Main aapka JanSahayak AI Assistant hoon.\n\nAap mujhse **kuch bhi** pooch sakte hain — apni complaints ka status, timeline, Grievance DNA™ analysis, ya koi bhi general sawaal.`
    },
    civic_officer: {
      label: 'Officer Co-Pilot',
      icon: Building2,
      badgeColor: '#0284C7',
      badgeBg: '#F0F9FF',
      glow: 'rgba(2, 132, 199, 0.15)',
      gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
      welcome: `Hello Officer **${user?.name || 'In-Charge'}**! I am your operational Co-Pilot.\n\nAsk for structured operational briefs, root-cause forensics, contractor SOP guidance, or general engineering queries.`
    },
    officer: {
      label: 'Officer Co-Pilot',
      icon: Building2,
      badgeColor: '#0284C7',
      badgeBg: '#F0F9FF',
      glow: 'rgba(2, 132, 199, 0.15)',
      gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
      welcome: `Hello Officer **${user?.name || 'In-Charge'}**! I am your operational Co-Pilot.\n\nAsk for structured operational briefs, root-cause forensics, contractor SOP guidance, or general engineering queries.`
    },
    super_admin: {
      label: 'Executive Intelligence',
      icon: Shield,
      badgeColor: '#7C3AED',
      badgeBg: '#F5F3FF',
      glow: 'rgba(124, 58, 237, 0.15)',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
      welcome: `JanSahayak Executive Intelligence active.\n\nQuery citywide SLA compliance, emerging problem clusters, cross-department bottlenecks, or municipal ward hotspot analytics.`
    }
  };

  const activeRoleConfig = roleConfig[role] || roleConfig.citizen;
  const RoleIcon = activeRoleConfig.icon;

  // Initialize welcome
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-01',
          sender: 'assistant',
          text: activeRoleConfig.welcome,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tools: []
        }
      ]);
    }
  }, [role]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Contextual Prompt Chips
  const getSuggestionChips = () => {
    if (role === 'citizen') {
      if (pageContext.current_entity_type === 'complaint') {
        return [
          'Meri complaint ka status kya hai?',
          'Ye 23 reports se kaise connect hui?',
          'Ab iska aage kya hoga?',
          'Is problem ko reopen kar do',
          'What is GitHub?'
        ];
      }
      return [
        'Meri complaints ka status kya hai?',
        'Complaint DNA kya hota hai?',
        'What is GitHub?',
        'How does JanSahayak work?'
      ];
    }

    if (['civic_officer', 'officer', 'dept_admin'].includes(role)) {
      if (pageContext.current_entity_type === 'incident') {
        return [
          'Is incident ka short summary do',
          'Possible root cause analysis batao',
          'Recommended operational step kya hai?',
          'Pending field verifications dikhao'
        ];
      }
      return [
        'Mere pending critical incidents dikhao',
        'Department ka SLA compliance rate kya hai?',
        'What is GitHub?'
      ];
    }

    return [
      'Aaj emerging problems kya hain?',
      'Kitne critical incidents hain?',
      'Citywide SLA compliance summary',
      'Top 3 problem hotspots kaunse hain?'
    ];
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setInputMessage('');
    setActiveActionProposal(null);

    const userMsgObj = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsgObj]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: query,
          conversationId: `conv_${user?.id || 'demo'}_${role}`,
          history: messages.slice(-8),
          user: user || { id: 'USR-CITIZEN-01', name: 'Citizen', role },
          context: pageContext
        })
      });

      const data = await response.json();

      const assistantMsgObj = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Mujhe is vishay par verified jaankari prapt nahi hui.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tools: data.toolsCalled || [],
        actionProposal: data.actionProposal || null
      };

      setMessages(prev => [...prev, assistantMsgObj]);

      if (data.actionProposal) {
        setActiveActionProposal(data.actionProposal);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'AI Assistant temporarily unavailable hai. Aap Jan_Sahayak ke normal features use kar sakte hain.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleConfirmAction = async (proposal) => {
    if (!proposal || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant/action/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          actionType: proposal.actionType,
          entityId: proposal.entityId,
          entityType: proposal.entityType,
          reason: 'Confirmed by user via JanSahayak AI Assistant',
          user: user || { id: 'USR-CITIZEN-01', name: 'Citizen', role }
        })
      });

      const resData = await res.json();
      if (resData.success) {
        setActiveActionProposal(null);
        setMessages(prev => [
          ...prev,
          {
            id: `act-done-${Date.now()}`,
            sender: 'assistant',
            text: `✅ **Action Confirmed**: ${resData.message}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        alert(resData.error || 'Action confirmation failed.');
      }
    } catch (err) {
      alert('Error confirming action: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: activeRoleConfig.welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tools: []
      }
    ]);
    setActiveActionProposal(null);
  };

  return (
    <>
      {/* Light & Modern Floating Trigger Button */}
      {!isOpen && (
        <button
          id="jansahayak-ai-launcher"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9990,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
            backdropFilter: 'blur(16px)',
            color: '#0F172A',
            border: '1.5px solid rgba(226, 232, 240, 0.9)',
            borderRadius: '999px',
            boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 700,
            fontSize: '14px',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 18px 36px -4px rgba(15, 23, 42, 0.2), 0 6px 16px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.borderColor = activeRoleConfig.badgeColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 12px 30px -4px rgba(15, 23, 42, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
          }}
        >
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: activeRoleConfig.gradient,
            color: '#FFFFFF',
            boxShadow: `0 4px 12px ${activeRoleConfig.glow}`
          }}>
            <Sparkles size={18} />
            <span style={{
              position: 'absolute',
              top: '-1px',
              right: '-1px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              border: '2px solid #FFFFFF',
              boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)'
            }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>JanSahayak AI</div>
            <div style={{ fontSize: '11px', color: activeRoleConfig.badgeColor, fontWeight: 700 }}>
              {activeRoleConfig.label}
            </div>
          </div>
        </button>
      )}

      {/* Modern Light Glassmorphic Window */}
      {isOpen && (
        <div
          id="jansahayak-ai-window"
          style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            width: isMinimized ? '320px' : '440px',
            maxWidth: 'calc(100vw - 24px)',
            height: isMinimized ? '56px' : 'min(560px, calc(100dvh - 32px))',
            maxHeight: 'calc(100dvh - 32px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
            color: '#0F172A',
            borderRadius: '22px',
            border: '1.5px solid rgba(226, 232, 240, 0.95)',
            boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(15, 23, 42, 0.04)',
            overflow: 'hidden',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'height 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Header Bar */}
          <div style={{
            padding: '12px 16px',
            background: activeRoleConfig.gradient,
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            userSelect: 'none',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                position: 'relative',
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <RoleIcon size={20} />
                <span style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#34D399',
                  border: '2px solid #FFFFFF'
                }} />
              </div>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, letterSpacing: '-0.01em', color: '#FFFFFF' }}>
                  JanSahayak AI
                </div>
                <div style={{ fontSize: '11px', color: '#E0F2FE', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 600 }}>{activeRoleConfig.label}</span>
                  <span style={{ opacity: 0.6 }}>•</span>
                  <span style={{
                    color: '#FFFFFF',
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '10.5px',
                    fontWeight: 600
                  }}>
                    {pageContext.current_page}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <button
                onClick={handleClearChat}
                title="Clear Conversation"
                style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setIsMinimized(prev => !prev)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Messages Viewport */}
          {!isMinimized && (
            <div style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '16px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              background: '#F8FAFC',
              minHeight: 0
            }}>
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                      gap: '4px',
                      width: '100%'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      flexDirection: isUser ? 'row-reverse' : 'row',
                      maxWidth: '96%'
                    }}>
                      {!isUser && (
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: activeRoleConfig.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          flexShrink: 0,
                          marginTop: '2px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}>
                          <Bot size={16} />
                        </div>
                      )}

                      <div
                        style={{
                          padding: '11px 14px',
                          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          background: isUser 
                            ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' 
                            : '#FFFFFF',
                          color: isUser ? '#FFFFFF' : '#1E293B',
                          boxShadow: isUser 
                            ? '0 4px 14px rgba(2, 132, 199, 0.25)' 
                            : '0 2px 8px -2px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04)',
                          border: isUser ? 'none' : '1px solid #E2E8F0',
                          wordBreak: 'break-word',
                          overflowWrap: 'anywhere',
                          maxWidth: '100%'
                        }}
                      >
                        {isUser ? (
                          <span style={{ fontSize: '13.5px', lineHeight: 1.5, color: '#FFFFFF', fontWeight: 500 }}>{msg.text}</span>
                        ) : (
                          <FormattedMarkdown content={msg.text} />
                        )}
                      </div>
                    </div>

                    {/* Tools Grounding Badge */}
                    {!isUser && msg.tools && msg.tools.length > 0 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginLeft: '36px',
                        padding: '3px 10px',
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#1D4ED8',
                        width: 'fit-content'
                      }}>
                        <Database size={12} />
                        <span>Grounded via {msg.tools.map(t => t.name).join(', ')}</span>
                      </div>
                    )}

                    <span style={{
                      fontSize: '10.5px',
                      color: '#94A3B8',
                      fontWeight: 500,
                      padding: isUser ? '0 4px 0 0' : '0 0 0 38px'
                    }}>
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Action Proposal Card (Sensitive Operations Gate) */}
              {activeActionProposal && (
                <div style={{
                  background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                  border: '1.5px solid #F59E0B',
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: '0 8px 24px -4px rgba(245, 158, 11, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontWeight: 800, fontSize: '13.5px', marginBottom: '8px' }}>
                    <AlertTriangle size={18} />
                    <span>{activeActionProposal.title}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#78350F', margin: '0 0 14px 0', lineHeight: 1.45 }}>
                    {activeActionProposal.promptQuestion}
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleConfirmAction(activeActionProposal)}
                      disabled={isLoading}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
                      }}
                    >
                      {isLoading ? 'Confirming...' : 'Yes, Confirm Action'}
                    </button>
                    <button
                      onClick={() => setActiveActionProposal(null)}
                      style={{
                        background: '#FFFFFF',
                        color: '#4B5563',
                        border: '1px solid #D1D5DB',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Modern Reasoning Spinner */}
              {isLoading && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  marginLeft: '4px',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  width: 'fit-content',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: '#E0F2FE',
                    border: '1px solid #BAE6FD',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0284C7'
                  }}>
                    <Sparkles size={14} className="animate-spin" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#475569', fontSize: '12.5px', fontWeight: 600 }}>JanSahayak thinking</span>
                    <span style={{ display: 'inline-flex', gap: '3px' }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#0284C7', display: 'inline-block' }} />
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#059669', display: 'inline-block' }} />
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#7C3AED', display: 'inline-block' }} />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Contextual Suggestion Pills */}
          {!isMinimized && (
            <div style={{
              padding: '10px 12px',
              background: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              display: 'flex',
              gap: '8px',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              flexShrink: 0
            }}>
              {getSuggestionChips().map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  disabled={isLoading}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    color: '#334155',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '6px 14px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#EFF6FF';
                    e.currentTarget.style.color = '#0284C7';
                    e.currentTarget.style.borderColor = '#93C5FD';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F1F5F9';
                    e.currentTarget.style.color = '#334155';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Modern Light Input Bar */}
          {!isMinimized && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{
                padding: '10px 12px',
                background: '#FFFFFF',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                flexShrink: 0
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  role === 'citizen'
                    ? 'Poochiye: "Meri complaint ka status?" ya koi bhi sawaal...'
                    : role === 'civic_officer'
                    ? 'Ask: "Is incident ka short summary do" or any question...'
                    : 'Ask: "Aaj emerging problems kya hain?" or any question...'
                }
                disabled={isLoading}
                style={{
                  flex: 1,
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '12px',
                  color: '#0F172A',
                  padding: '11px 16px',
                  fontSize: '13.5px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#0284C7';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                style={{
                  background: inputMessage.trim() 
                    ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' 
                    : '#F1F5F9',
                  color: inputMessage.trim() ? '#FFFFFF' : '#94A3B8',
                  border: 'none',
                  borderRadius: '12px',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputMessage.trim() ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  boxShadow: inputMessage.trim() ? '0 4px 14px rgba(2, 132, 199, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (inputMessage.trim()) e.currentTarget.style.transform = 'scale(1.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Send size={17} />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}

