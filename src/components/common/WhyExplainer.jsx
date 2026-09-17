import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Signature Explainable AI UX Pattern ("Why?")
 * Allows any AI inference (Priority, Routing, Recommendations, Clustering)
 * to be instantly verified with structured, transparent reasoning.
 */
export default function WhyExplainer({
  label = 'Why?',
  title = 'Why this determination?',
  reasons = [],
  align = 'left'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const defaultReasons = [
    '14-day unresolved duration reported by citizens',
    'High-traffic public transit corridor within 200m',
    '12 duplicate/related reports logged in 72 hours',
    'Biohazard & safety keywords detected in verbatim text',
    'Historical precedent matching DJB Emergency SOP #14'
  ];

  const list = reasons && reasons.length > 0 ? reasons : defaultReasons;

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="why-trigger"
        aria-expanded={isOpen}
        title="View explainable AI reasoning"
      >
        <HelpCircle style={{ width: '12px', height: '12px' }} />
        <span>{label}</span>
        {isOpen ? (
          <ChevronUp style={{ width: '10px', height: '10px' }} />
        ) : (
          <ChevronDown style={{ width: '10px', height: '10px' }} />
        )}
      </button>

      {isOpen && (
        <div
          className="why-panel"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            [align === 'right' ? 'right' : 'left']: 0,
            width: '320px',
            maxWidth: '90vw',
            zIndex: 50,
            background: '#FFFFFF',
            border: '1px solid var(--color-ai-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid rgba(15,23,42,0.06)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-ai-text)' }}>
              {title}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{ color: 'var(--color-text-muted)', padding: '2px', display: 'flex' }}
            >
              <X style={{ width: '13px', height: '13px' }} />
            </button>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {list.map((reason, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'var(--color-ai-tint)',
                  color: 'var(--color-ai-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}>
                  <Check style={{ width: '10px', height: '10px', strokeWidth: 3 }} />
                </div>
                <span>{reason}</span>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(15,23,42,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
              Transparent Deterministic Criteria
            </span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-primary)' }}>
              Explainable AI
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
