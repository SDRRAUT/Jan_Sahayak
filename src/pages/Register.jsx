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
  const [ward, setWard] = useState('Ward 14 (Rohini Sector 14)');
  const [pincode, setPincode] = useState('110085');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ name, email, phone, ward, pincode, password });
      navigate('/citizen');
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

        <form onSubmit={handleRegister} className="card" style={{ padding: '32px' }}>
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
              style={{ width: '100%', height: '44px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-medium)', padding: '0 14px', fontSize: '13px' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@gmail.com"
                style={{ width: '100%', height: '44px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-medium)', padding: '0 14px', fontSize: '13px' }}
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
                style={{ width: '100%', height: '44px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-medium)', padding: '0 14px', fontSize: '13px' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Municipal Ward
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                style={{ width: '100%', height: '44px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-medium)', padding: '0 10px', fontSize: '13px', background: '#FFFFFF' }}
              >
                <option value="Ward 14 (Rohini Sector 14)">Ward 14 (Rohini Sector 14)</option>
                <option value="Ward 8 (Lajpat Nagar / Moolchand)">Ward 8 (Lajpat Nagar / Moolchand)</option>
                <option value="Ward 22 (Mayur Vihar Ph-1)">Ward 22 (Mayur Vihar Ph-1)</option>
                <option value="Ward 5 (Kalkaji / South)">Ward 5 (Kalkaji / South)</option>
                <option value="Ward 19 (Karol Bagh)">Ward 19 (Karol Bagh)</option>
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
                placeholder="110085"
                style={{ width: '100%', height: '44px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-medium)', padding: '0 12px', fontSize: '13px' }}
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
              style={{ width: '100%', height: '44px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-medium)', padding: '0 14px', fontSize: '13px' }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoadingAuth}
            className="btn-primary"
            style={{ width: '100%', height: '48px', fontSize: '14px' }}
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
      </div>
    </div>
  );
}
