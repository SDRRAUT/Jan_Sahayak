import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, User, Mail, Phone, MapPin, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoadingAuth } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [ward, setWard] = useState('Wagholi Ward 29 (Ivy Estate & Kesnand Road)');
  const [pincode, setPincode] = useState('412207');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ name, email, phone, ward, pincode, password });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="section-spacing" style={{ paddingTop: '32px' }}>
      <div className="container" style={{ maxWidth: '560px' }}>
        <div className="section-header center" style={{ marginBottom: '28px' }}>
          <img 
            src="/logo.png" 
            alt="JanSahayak Official Logo" 
            style={{ 
              height: '72px', 
              width: 'auto', 
              margin: '0 auto 16px auto', 
              display: 'block',
              filter: 'drop-shadow(0 4px 14px rgba(14, 94, 58, 0.18))' 
            }} 
          />
          <div className="category-pill">CITIZEN ENROLLMENT</div>
          <h2>Register for JanSahayak</h2>
          <p>Direct citizen grievance submission and transparent municipal tracking.</p>
        </div>

        <form onSubmit={handleRegister} className="card register-form-card">
          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <AlertCircle style={{ width: '14px', height: '14px' }} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="register-input"
              style={{ width: '100%', height: '46px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-medium)', padding: '0 14px', fontSize: '14px' }}
              required
            />
          </div>

          <div className="register-field-grid" style={{ marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@gmail.com"
                className="register-input"
                style={{ width: '100%', height: '46px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-medium)', padding: '0 14px', fontSize: '14px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Mobile Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98111-XXXXX"
                className="register-input"
                style={{ width: '100%', height: '46px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-medium)', padding: '0 14px', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          <div className="register-field-grid ward-grid" style={{ marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Municipal Ward
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="register-input"
                style={{ width: '100%', height: '46px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-medium)', padding: '0 10px', fontSize: '14px', background: '#FFFFFF' }}
              >
                <option value="Wagholi Ward 27 (Nagar Road Highway & Raisoni Chowk)">Wagholi Ward 27 (Nagar Road Highway & Raisoni Chowk)</option>
                <option value="Wagholi Ward 28 (Baif Road & Market Yard)">Wagholi Ward 28 (Baif Road & Market Yard)</option>
                <option value="Wagholi Ward 29 (Ivy Estate & Kesnand Road)">Wagholi Ward 29 (Ivy Estate & Kesnand Road)</option>
                <option value="Wagholi Ward 30 (Domkhel & Ubale Nagar)">Wagholi Ward 30 (Domkhel & Ubale Nagar)</option>
                <option value="Wagholi Ward 31 (Bakori Road & Wagheshwar)">Wagholi Ward 31 (Bakori Road & Wagheshwar)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Pin Code
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="412207"
                className="register-input"
                style={{ width: '100%', height: '46px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-medium)', padding: '0 12px', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              Create Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="register-input"
              style={{ width: '100%', height: '46px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-medium)', padding: '0 14px', fontSize: '14px' }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoadingAuth}
            className="btn-primary"
            style={{ width: '100%', height: '48px', minHeight: '48px', fontSize: '15px', fontWeight: 700 }}
          >
            {isLoadingAuth ? 'Registering Citizen Account...' : 'Complete Registration & Open Dashboard'}
          </button>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </form>

        <style>{`
          .register-form-card {
            padding: 32px;
          }
          .register-field-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }
          .register-field-grid.ward-grid {
            grid-template-columns: 1.4fr 0.6fr;
          }
          @media (max-width: 640px) {
            .register-form-card {
              padding: 20px 16px !important;
            }
            .register-field-grid,
            .register-field-grid.ward-grid {
              grid-template-columns: 1fr !important;
              gap: 14px !important;
            }
            .register-input {
              font-size: 16px !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
