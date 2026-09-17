import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Bot, 
  Send, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Minimize2, 
  Maximize2,
  Database,
  ArrowRight,
  Shield,
  User,
  Building2,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function JanSahayakAssistant() {
  const location = useLocation();
  const { user, token } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [toolsCalledTrace, setToolsCalledTrace] = useState([]);
  const [activeActionProposal, setActiveActionProposal] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const role = (user?.role || 'citizen').toLowerCase();

  // Determine current page & entity context based on location.pathname
  const getPageContext = () => {
    const path = location.pathname;
    let entityType = null;
    let entityId = null;
    let pageLabel = 'Overview';

    if (path.startsWith('/citizen/complaints/')) {
      entityType = 'complaint';
      entityId = path.replace('/citizen/complaints/', '');
      pageLabel = `Complaint #${entityId}`;
    } else if (path.startsWith('/intelligence/incidents/')) {
      entityType = 'incident';
      entityId = path.replace('/intelligence/incidents/', '');
      pageLabel = `Civic Incident #${entityId}`;
    } else if (path === '/citizen') {
      pageLabel = 'Citizen Portal';
    } else if (path === '/citizen/submit') {
      pageLabel = 'New Grievance Filing';
    } else if (path === '/officer') {
      pageLabel = 'Officer Field Workspace';
    } else if (path === '/intelligence') {
      pageLabel = 'Civic Intelligence Suite';
    } else if (path === '/admin/super') {
      pageLabel = 'Super Admin Oversight';
    } else if (path === '/overview' || path === '/') {
      pageLabel = 'JanSahayak Public Gateway';
    }

    return {
      current_route: path,
      current_page: pageLabel,
      current_entity_type: entityType,
      current_entity_id: entityId
    };
  };

  const pageContext = getPageContext();

  // Role badges & themes
  const roleConfig = {
    citizen: {
      label: 'Citizen Sahayak',
      icon: User,
      badgeColor: '#10B981',
      bgGradient: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)',
      welcome: `Namaste ${user?.name || 'Citizen'}! Main aapka JanSahayak AI Assistant hoon. Aap apni complaint ka status, timeline, AI diagnosis ya resolution verification ke baare mein pooch sakte hain.`
    },
    civic_officer: {
      label: 'Officer Co-Pilot',
      icon: Building2,
      badgeColor: '#3B82F6',
      bgGradient: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
      welcome: `Hello Officer ${user?.name || 'In-Charge'}. I can provide structured operational briefs, root cause diagnosis, contractor SOP recommendations, or pending verification audits.`
    },
    officer: {
      label: 'Officer Co-Pilot',
      icon: Building2,
      badgeColor: '#3B82F6',
      bgGradient: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
      welcome: `Hello Officer ${user?.name || 'In-Charge'}. I can provide structured operational briefs, root cause diagnosis, contractor SOP recommendations, or pending verification audits.`
    },
    super_admin: {
      label: 'Executive Intelligence',
      icon: Shield,
      badgeColor: '#8B5CF6',
      bgGradient: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)',
      welcome: `JanSahayak Executive Intelligence active. Query citywide SLA compliance, emerging problem clusters, cross-department bottlenecks, or municipal ward hotspot analytics.`
    }
  };

  const activeRoleConfig = roleConfig[role] || roleConfig.citizen;
  const RoleIcon = activeRoleConfig.icon;

  // Initialize welcome message on mount
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

  // Scroll to bottom of chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Dynamic Suggestion Chips tailored to role and page context
  const getSuggestionChips = () => {
    if (role === 'citizen') {
      if (pageContext.current_entity_type === 'complaint') {
        return [
          'Meri complaint ka status kya hai?',
          'Ye 23 reports se kaise connect hui?',
          'AI ne waterlogging kyu identify kiya?',
          'Ab iska aage kya hoga?',
          'Is problem ko reopen kar do'
        ];
      }
      return [
        'Meri complaints ka status kya hai?',
        'Complaint DNA kya hota hai?',
        'Field verification kaise kaam karti hai?'
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
        'Verification queue audit'
      ];
    }

    if (role === 'super_admin' || role === 'admin') {
      return [
        'Aaj emerging problems kya hain?',
        'Kitne critical incidents hain?',
        'Citywide SLA compliance summary',
        'Top 3 problem hotspots kaunse hain?',
        'Cross-department bottlenecks'
      ];
    }

    return ['Help with municipal services', 'Check status'];
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setInputMessage('');
    setActiveActionProposal(null);
    setActionSuccessMsg(null);

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

      if (data.toolsCalled && data.toolsCalled.length > 0) {
        setToolsCalledTrace(data.toolsCalled);
      }

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
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // High-Impact Action Confirmation Handler
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
        setActionSuccessMsg(resData.message);
        setActiveActionProposal(null);

        // Add confirmed status message to chat
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
    setActionSuccessMsg(null);
    setToolsCalledTrace([]);
  };

  return (
    <>
      {/* Docked Floating Trigger Button */}
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
            gap: '10px',
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#FFFFFF',
            border: `1.5px solid ${activeRoleConfig.badgeColor}`,
            borderRadius: '999px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45), 0 0 20px rgba(16, 185, 129, 0.25)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 700,
            fontSize: '14px',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
        >
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: activeRoleConfig.badgeColor,
            color: '#FFFFFF'
          }}>
            <Sparkles size={18} />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#22C55E',
              border: '2px solid #0F172A'
            }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13.5px', lineHeight: 1.2 }}>JanSahayak AI</div>
            <div style={{ fontSize: '11px', color: activeRoleConfig.badgeColor, fontWeight: 600 }}>
              {activeRoleConfig.label}
            </div>
          </div>
        </button>
      )}

      {/* Expandable Assistant Window */}
      {isOpen && (
        <div
          id="jansahayak-ai-window"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: isMinimized ? '340px' : '440px',
            maxWidth: 'calc(100vw - 32px)',
            height: isMinimized ? '60px' : '620px',
            maxHeight: 'calc(100vh - 48px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0F172A',
            color: '#F8FAFC',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'height 0.25s ease, width 0.25s ease'
          }}
        >
          {/* Header Bar */}
          <div style={{
            padding: '14px 18px',
            background: activeRoleConfig.bgGradient,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            userSelect: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <RoleIcon size={18} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '-0.01em' }}>
                  JanSahayak AI
                </div>
                <div style={{ fontSize: '11px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{activeRoleConfig.label}</span>
                  <span>•</span>
                  <span style={{ color: '#A7F3D0' }}>{pageContext.current_page}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handleClearChat}
                title="Clear Conversation"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px'
                }}
              >
                <RefreshCw size={15} />
              </button>
              <button
                onClick={() => setIsMinimized(prev => !prev)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px'
                }}
              >
                {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px'
                }}
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Active Context Banner */}
          {!isMinimized && pageContext.current_entity_id && (
            <div style={{
              padding: '6px 14px',
              background: 'rgba(30, 41, 59, 0.8)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '11.5px',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>Active Scope: <strong style={{ color: '#E2E8F0' }}>{pageContext.current_page}</strong></span>
              <span style={{ fontSize: '10.5px', color: activeRoleConfig.badgeColor, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                Grounded
              </span>
            </div>
          )}

          {/* Chat Messages Viewport */}
          {!isMinimized && (
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#0B1120'
            }}>
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '86%',
                        padding: '12px 14px',
                        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        backgroundColor: isUser ? '#2563EB' : '#1E293B',
                        color: isUser ? '#FFFFFF' : '#F1F5F9',
                        fontSize: '13.5px',
                        lineHeight: 1.5,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {msg.text}
                    </div>

                    {/* Tools Grounding Badge */}
                    {!isUser && msg.tools && msg.tools.length > 0 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '4px',
                        fontSize: '10.5px',
                        color: '#64748B'
                      }}>
                        <Database size={11} />
                        <span>Grounded via {msg.tools.map(t => t.name).join(', ')}</span>
                      </div>
                    )}

                    <span style={{
                      fontSize: '10px',
                      color: '#64748B',
                      marginTop: '2px',
                      padding: '0 4px'
                    }}>
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Action Proposal Card (Sensitive Operations Gate) */}
              {activeActionProposal && (
                <div style={{
                  background: '#1E293B',
                  border: '1.5px solid #F59E0B',
                  borderRadius: '12px',
                  padding: '14px',
                  marginTop: '8px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
                    <AlertTriangle size={16} />
                    <span>{activeActionProposal.title}</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#E2E8F0', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                    {activeActionProposal.promptQuestion}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleConfirmAction(activeActionProposal)}
                      disabled={isLoading}
                      style={{
                        flex: 1,
                        background: '#F59E0B',
                        color: '#000000',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {isLoading ? 'Confirming...' : 'Yes, Confirm Action'}
                    </button>
                    <button
                      onClick={() => setActiveActionProposal(null)}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: '#94A3B8',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Loading Indicator */}
              {isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', color: '#94A3B8', fontSize: '12.5px' }}>
                  <Sparkles size={16} className="animate-spin" color={activeRoleConfig.badgeColor} />
                  <span>JanSahayak reasoning with Supabase tools...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Contextual Suggestion Chips */}
          {!isMinimized && (
            <div style={{
              padding: '8px 14px',
              background: '#0F172A',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              display: 'flex',
              gap: '6px'
            }}>
              {getSuggestionChips().map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  disabled={isLoading}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#CBD5E1',
                    fontSize: '11.5px',
                    padding: '5px 10px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Bar */}
          {!isMinimized && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{
                padding: '12px 14px',
                background: '#0F172A',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  role === 'citizen'
                    ? 'Poochiye: "Meri complaint ka status kya hai?"'
                    : role === 'civic_officer'
                    ? 'Ask: "Is incident ka short summary do"'
                    : 'Ask: "Aaj emerging problems kya hain?"'
                }
                disabled={isLoading}
                style={{
                  flex: 1,
                  background: '#1E293B',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  padding: '10px 14px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                style={{
                  background: inputMessage.trim() ? activeRoleConfig.badgeColor : '#334155',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputMessage.trim() ? 'pointer' : 'default',
                  transition: 'background 0.2s ease'
                }}
              >
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
