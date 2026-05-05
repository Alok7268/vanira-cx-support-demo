import React, { useState, useCallback } from 'react';
import { Package, Search, Mail, Phone, MessageSquare, HelpCircle, ArrowRight, Truck, CheckCircle2, Clock, X } from 'lucide-react';
import { VoiceAgent } from './components/VoiceAgent';
import './App.css';

function App() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [status, setStatus] = useState<'idle' | 'searching' | 'found'>('idle');
  
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [dynamicOptions, setDynamicOptions] = useState<{prompt: string, options: string[]} | null>(null);
  const [triggerAction, setTriggerAction] = useState<((name: string, data: any) => void) | null>(null);

  const handleRegisterActionTrigger = useCallback((fn: (name: string, data: any) => void) => {
    setTriggerAction(() => fn);
  }, []);

  const handleOpenFaq = () => setShowFaqModal(true);

  const handleHighlight = (el: string) => {
    setHighlightedElement(el);
    setTimeout(() => setHighlightedElement(null), 5000);
  };

  const handleShowOptions = (prompt: string, options: string[]) => {
    setDynamicOptions({ prompt, options });
  };

  const handleOptionClick = (opt: string) => {
    if (triggerAction) {
      triggerAction('option_clicked', { selected_option: opt });
    }
    setDynamicOptions(null);
  };

  const doTrack = (num: string) => {
    setTrackingNumber(num);
    setStatus('searching');
    setTimeout(() => {
      setStatus('found');
    }, 1500);
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber) return;
    doTrack(trackingNumber);
  };

  return (
    <div className="app-wrapper">
      <header>
        <div className="paper-container header-content">
          <a href="/" className="logo">
            <Package className="logo-icon" size={28} />
            Poste
          </a>
          <nav className="nav-links">
            <a href="#">Track Order</a>
            <a href="#">Support</a>
            <a href="#">Returns</a>
            <a href="#">FAQ</a>
          </nav>
        </div>
      </header>

      <main className="paper-container">
        <section className="hero-section animate-slide-up">
          <h1 className="hero-title">How can we help you today?</h1>
          <p className="hero-subtitle">Check your delivery status or find answers to your questions.</p>
        </section>

        <div className="grid-layout">
          {/* Tracking Widget */}
          <div className="paper-card tracking-widget animate-slide-up delay-100">
            <h2>Track Your Delivery</h2>
            <p style={{ color: 'var(--paper-subtle)', marginBottom: '24px' }}>
              Enter your tracking number, order ID, or email address to find your package.
            </p>
            
            <form onSubmit={handleTrack}>
              <div className="input-group">
                <input
                  type="text"
                  className="paper-input"
                  placeholder="e.g. PST-8829-1102"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
                <button type="submit" className="paper-btn paper-btn-accent" disabled={status === 'searching'}>
                  {status === 'searching' ? 'Searching...' : 'Track'}
                </button>
              </div>
            </form>

            {status === 'found' && (
              <div className="tracking-result animate-slide-up" style={{ marginTop: '32px' }}>
                <div className="divider"></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Order {trackingNumber}</h3>
                    <p style={{ color: 'var(--paper-subtle)' }}>Expected Delivery: Tomorrow, 10:00 AM</p>
                  </div>
                  <span className="status-badge status-transit">
                    <Truck size={14} /> In Transit
                  </span>
                </div>

                <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid var(--paper-border)' }}>
                  <div style={{ position: 'relative', marginBottom: '24px' }}>
                    <div style={{ position: 'absolute', left: '-33px', top: '2px', background: 'var(--paper-white)', padding: '2px' }}>
                      <Truck size={16} color="var(--paper-blue)" />
                    </div>
                    <p style={{ fontWeight: 500 }}>Out for Delivery</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--paper-subtle)' }}>Local Distribution Center</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--paper-subtle)', fontFamily: 'var(--font-mono)' }}>Today, 08:42 AM</p>
                  </div>
                  <div style={{ position: 'relative', marginBottom: '24px' }}>
                    <div style={{ position: 'absolute', left: '-33px', top: '2px', background: 'var(--paper-white)', padding: '2px' }}>
                      <CheckCircle2 size={16} color="var(--paper-green)" />
                    </div>
                    <p style={{ fontWeight: 500 }}>Arrived at Hub</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--paper-subtle)' }}>Regional Sorting Facility</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--paper-subtle)', fontFamily: 'var(--font-mono)' }}>Yesterday, 11:20 PM</p>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-33px', top: '2px', background: 'var(--paper-white)', padding: '2px' }}>
                      <Clock size={16} color="var(--paper-subtle)" />
                    </div>
                    <p style={{ fontWeight: 500 }}>Order Placed</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--paper-subtle)' }}>Merchant: Artisan Coffee Co.</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--paper-subtle)', fontFamily: 'var(--font-mono)' }}>May 2, 09:15 AM</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Support Categories */}
          <div className="support-section animate-slide-up delay-200">
            <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Quick Support</h2>
            <div className="support-categories">
              {dynamicOptions && (
                <div className="paper-card animate-slide-up" style={{ gridColumn: '1 / -1', border: '2px solid var(--paper-accent)' }}>
                  <h3 style={{ marginBottom: '16px' }}>{dynamicOptions.prompt}</h3>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {dynamicOptions.options.map(opt => (
                      <button 
                        key={opt}
                        onClick={() => handleOptionClick(opt)}
                        className="paper-btn paper-btn-outline"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className={`paper-card category-card ${highlightedElement === 'faq' ? 'agent-active pulse-animation' : ''}`}>
                <HelpCircle className="category-icon" size={32} />
                <h3 className="category-title">FAQ</h3>
                <p className="category-desc">Answers to common questions about shipping and returns.</p>
                <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--paper-accent)', fontWeight: 500, fontSize: '0.9rem' }}>
                  Read Articles <ArrowRight size={16} />
                </div>
              </div>
              <div className={`paper-card category-card ${highlightedElement === 'email' ? 'agent-active pulse-animation' : ''}`}>
                <Mail className="category-icon" size={32} />
                <h3 className="category-title">Email Us</h3>
                <p className="category-desc">Expect a reply within 24 hours from our team.</p>
                <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--paper-accent)', fontWeight: 500, fontSize: '0.9rem' }}>
                  Send Email <ArrowRight size={16} />
                </div>
              </div>
              <div className={`paper-card category-card ${highlightedElement === 'chat' ? 'agent-active pulse-animation' : ''}`}>
                <MessageSquare className="category-icon" size={32} />
                <h3 className="category-title">Live Chat</h3>
                <p className="category-desc">Available Mon-Fri, 9am - 5pm EST.</p>
                <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--paper-accent)', fontWeight: 500, fontSize: '0.9rem' }}>
                  Start Chat <ArrowRight size={16} />
                </div>
              </div>
              <VoiceAgent 
                onTrackOrder={(num) => doTrack(num)}
                currentTrackingNumber={trackingNumber}
                currentTrackingStatus={status}
                onOpenFaq={handleOpenFaq}
                onHighlightElement={handleHighlight}
                onShowOptions={handleShowOptions}
                registerActionTrigger={handleRegisterActionTrigger}
              />
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="paper-container">
          <p>&copy; {new Date().getFullYear()} Poste Support. All rights reserved.</p>
        </div>
      </footer>

      {showFaqModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="paper-card animate-slide-up" style={{ maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.8rem' }}>Return Policy</h2>
              <button onClick={() => setShowFaqModal(false)} style={{ background: 'transparent', color: 'var(--paper-subtle)' }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ color: 'var(--paper-fg)' }}>
              <p style={{ marginBottom: '16px' }}>We want you to be completely satisfied with your purchase. If you are not entirely happy, we offer a hassle-free return policy.</p>
              <ul style={{ paddingLeft: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>30-Day Window:</strong> Returns must be initiated within 30 days of the delivery date.</li>
                <li><strong>Condition:</strong> Items must be unused, unwashed, and in original packaging with tags attached.</li>
                <li><strong>Refund Options:</strong> Choose between a refund to your original payment method or store credit (with a 10% bonus).</li>
                <li><strong>Return Shipping:</strong> A flat $5.99 fee will be deducted from refunds to original payment methods. Return shipping is FREE if you choose store credit.</li>
              </ul>
              <p>For damaged or defective items, please contact support immediately.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
