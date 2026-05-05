import React, { useRef, useState, useEffect } from 'react';
import { WebRTCClient } from '@vanira/sdk';
import { Mic, Phone, PhoneOff, Loader2, Volume2, AlertCircle } from 'lucide-react';

interface VoiceAgentProps {
  onTrackOrder?: (trackingNumber: string) => void;
  currentTrackingNumber?: string;
  currentTrackingStatus?: string;
  
  onOpenFaq?: () => void;
  onHighlightElement?: (elementId: string) => void;
  onShowOptions?: (prompt: string, options: string[]) => void;
  onRequestOrderDetails?: (prompt: string) => void;
  onNavigate?: (page: string) => void;
  
  registerActionTrigger?: (trigger: (actionName: string, data: any) => void) => void;
}

export function VoiceAgent({ 
  onTrackOrder, 
  currentTrackingNumber, 
  currentTrackingStatus,
  onOpenFaq,
  onHighlightElement,
  onShowOptions,
  onRequestOrderDetails,
  onNavigate,
  registerActionTrigger
}: VoiceAgentProps) {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'live' | 'error'>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const clientRef = useRef<WebRTCClient | null>(null);

  // Send context updates when tracking info changes
  useEffect(() => {
    if (clientRef.current && status === 'live') {
      clientRef.current.sendContextUpdate({
        active_tracking_number: currentTrackingNumber || 'none',
        tracking_status: currentTrackingStatus || 'idle'
      });
    }
  }, [currentTrackingNumber, currentTrackingStatus, status]);

  useEffect(() => {
    if (registerActionTrigger) {
      registerActionTrigger((name, data) => {
        if (clientRef.current && status === 'live') {
          clientRef.current.triggerActionInterrupt();
          clientRef.current.sendActionTrigger(name, data);
        }
      });
    }
  }, [registerActionTrigger, status]);

  const startCall = async () => {
    setStatus('connecting');
    setTranscript('');
    try {
      clientRef.current = new WebRTCClient({
        // Using provided real IDs
        agentId: '0222f134-a780-4346-b260-1d6a64e39987', 
        apiKey: import.meta.env.VITE_VANIRA_API_KEY,

        onConnected: () => setStatus('live'),
        onDisconnected: () => { 
          setStatus('idle'); 
          clientRef.current = null; 
        },
        onError: (err) => {
          console.error('Vanira SDK Error:', err);
          setStatus('error');
        },
        onTranscription: (text, isFinal) => {
          setTranscript(text);
        },
        onClientToolCall: (toolCall) => {
          if (toolCall.name === 'track_order' && onTrackOrder) {
            onTrackOrder(toolCall.arguments.tracking_number);
            
            if (toolCall.execution_mode === 'blocking') {
              // Simulate order fetch and return
              setTimeout(() => {
                clientRef.current?.sendToolResult(toolCall.tool_call_id, { 
                  success: true, 
                  status: 'In Transit',
                  expected_delivery: 'Tomorrow'
                });
              }, 1500);
            }
          }

          if (toolCall.name === 'open_faq_article' && onOpenFaq) {
            onOpenFaq();
          }

          if (toolCall.name === 'highlight_ui_element' && onHighlightElement) {
            onHighlightElement(toolCall.arguments.element_id || 'email');
          }

          if (toolCall.name === 'show_dynamic_options' && onShowOptions) {
            onShowOptions(
              toolCall.arguments.prompt || 'Please select an option', 
              toolCall.arguments.options || []
            );
          }

          if (toolCall.name === 'request_order_details' && onRequestOrderDetails) {
            onRequestOrderDetails(
              toolCall.arguments.prompt || 'Please enter your order details below:'
            );
          }

          if (toolCall.name === 'navigate_to_page' && onNavigate) {
            onNavigate(toolCall.arguments.page_name || 'home');
          }
        },
      });
      
      await clientRef.current.connect();
    } catch (err) {
      console.error('Failed to start call:', err);
      setStatus('error');
    }
  };

  const endCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    clientRef.current?.disconnect();
    clientRef.current = null;
    setStatus('idle');
  };

  return (
    <div 
      className={`paper-card category-card ${status !== 'idle' ? 'agent-active' : ''}`}
      onClick={status === 'idle' ? startCall : undefined}
      style={status !== 'idle' ? { borderColor: 'var(--paper-accent)', cursor: 'default' } : {}}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Phone className="category-icon" size={32} />
        {status === 'live' && (
          <span className="status-badge" style={{ backgroundColor: 'rgba(184, 76, 61, 0.1)', color: 'var(--paper-accent)', border: 'none' }}>
            <Volume2 size={14} className="pulse-animation" /> Live
          </span>
        )}
      </div>
      
      <h3 className="category-title">AI Voice Support</h3>
      
      {status === 'idle' && (
        <>
          <p className="category-desc">Speak directly with our AI assistant for instant help.</p>
          <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--paper-accent)', fontWeight: 500, fontSize: '0.9rem' }}>
            Start Call <Phone size={16} />
          </div>
        </>
      )}

      {status === 'connecting' && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px 0' }}>
          <Loader2 className="spin-animation" size={24} color="var(--paper-subtle)" />
          <p style={{ color: 'var(--paper-subtle)', fontSize: '0.9rem' }}>Connecting to agent...</p>
        </div>
      )}

      {status === 'live' && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ 
            background: 'rgba(0,0,0,0.02)', 
            padding: '16px', 
            borderRadius: '4px', 
            border: '1px solid var(--paper-border)',
            minHeight: '80px',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            color: 'var(--paper-fg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            {transcript ? `"${transcript}"` : "Listening..."}
          </div>
          
          <button 
            onClick={endCall}
            className="paper-btn" 
            style={{ width: '100%', padding: '12px', fontSize: '0.9rem', backgroundColor: '#e0e0e0', color: 'var(--paper-fg)' }}
          >
            <PhoneOff size={16} /> End Call
          </button>
        </div>
      )}

      {status === 'error' && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--paper-accent)' }}>
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.9rem' }}>Connection failed. Check console or try again.</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); startCall(); }}
            className="paper-btn paper-btn-outline" 
            style={{ padding: '8px', fontSize: '0.9rem' }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
