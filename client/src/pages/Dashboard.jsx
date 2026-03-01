import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };
  const recentContacts = (user?.contacts || []).slice(0, 3);

  return (
    <Layout>
      <header className="dashboard-header">
        <div>
          <p className="greeting">{greeting()},</p>
          <h1 className="user-name">{user?.name || 'User'}</h1>
        </div>
        <button className="icon-btn" aria-label="Notifications">🔔</button>
      </header>

      <div className="qr-cards">
        <Link to="/my-qr" className="qr-card qr-card-primary">
          <span className="qr-card-icon">▣</span>
          <span>Show My QR</span>
        </Link>
        <Link to="/scan" className="qr-card qr-card-secondary">
          <span className="qr-card-icon">📷</span>
          <span>Scan QR</span>
        </Link>
      </div>

      <section className="recent-contacts">
        <div className="section-header">
          <h2>Recent Contacts</h2>
          <Link to="/contacts" className="see-all">See all</Link>
        </div>
        {recentContacts.length > 0 ? (
          <div className="contact-list">
            {recentContacts.map(c => (
              <Link
                key={c._id}
                to={`/user/${c.userId}`}
                className="contact-item"
              >
                <div className="contact-avatar">
                  {(c.name || c.email || '?')[0].toUpperCase()}
                </div>
                <div className="contact-info">
                  <span className="contact-name">{c.name || c.email}</span>
                  <span className="contact-role">
                    {c.name ? c.email : ''}
                  </span>
                </div>
                <span className="contact-arrow">→</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No contacts yet. Scan a QR code to add someone!</p>
          </div>
        )}
      </section>

      <div className="tip-card">
        <h3>Networking Tip</h3>
        <p>Always follow up within 24 hours of scanning a new contact.</p>
        <span className="tip-icon">💡</span>
      </div>
    </Layout>
  );
}
