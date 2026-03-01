import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Layout from '../components/Layout';
import './Profile.css';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    socialLinks: { instagram: '', linkedin: '', twitter: '' }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        socialLinks: {
          instagram: user.socialLinks?.instagram || '',
          linkedin: user.socialLinks?.linkedin || '',
          twitter: user.socialLinks?.twitter || ''
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const key = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/profile', form);
      updateUser(data.user);
      addToast('Profile updated!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h1>Edit Profile</h1>
      </header>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-photo-section">
          <div className="profile-photo">
            <span>{(form.name || form.email || '?')[0].toUpperCase()}</span>
            <span className="photo-edit-icon">📷</span>
          </div>
          <button type="button" className="change-photo-link">Change Profile Photo</button>
        </div>

        <section className="form-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />
            <span className="verified-badge">VERIFIED</span>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </section>

        <section className="form-section">
          <h2>Social Media Links</h2>
          <div className="social-input-group">
            <span className="social-icon instagram">📷</span>
            <input
              type="url"
              name="social.instagram"
              value={form.socialLinks.instagram}
              onChange={handleChange}
              placeholder="Instagram URL"
            />
          </div>
          <div className="social-input-group">
            <span className="social-icon linkedin">💼</span>
            <input
              type="url"
              name="social.linkedin"
              value={form.socialLinks.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn URL"
            />
          </div>
          <div className="social-input-group">
            <span className="social-icon twitter">𝕏</span>
            <input
              type="url"
              name="social.twitter"
              value={form.socialLinks.twitter}
              onChange={handleChange}
              placeholder="X (Twitter) URL"
            />
          </div>
          <button type="button" className="add-link-btn">
            <span>+</span> Add Another Link
          </button>
        </section>

        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          📄 Update Profile
        </button>

        <button
          type="button"
          className="btn btn-secondary btn-full"
          style={{ marginTop: 16 }}
          onClick={async () => {
            await api.post('/auth/logout');
            logout();
            navigate('/');
          }}
        >
          Sign Out
        </button>
      </form>
    </Layout>
  );
}
