import { useState, useEffect } from 'react';
import EmailList from './components/EmailList';
import EmailForm from './components/EmailForm';
import config from './config';
import './App.css';

function App() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const url = config.API_BASE_URL 
        ? `${config.API_BASE_URL}/api/emails`
        : '/api/emails'; // Use proxy when API_BASE_URL is empty
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch emails: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      setEmails(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError(err.message || 'Failed to fetch emails. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (emailData) => {
    try {
      const { action, ...emailFields } = emailData;
      
      if (action === 'send') {
        // Send email endpoint
        const url = config.API_BASE_URL 
          ? `${config.API_BASE_URL}/api/emails/send`
          : '/api/emails/send';
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailFields),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send email');
        }
        
        const result = await response.json();
        setEmails([result.email || result, ...emails]);
        setError(null);
        return true;
      } else {
        // Save as draft
        const url = config.API_BASE_URL 
          ? `${config.API_BASE_URL}/api/emails`
          : '/api/emails';
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...emailFields, status: 'draft' }),
        });
        
        if (!response.ok) throw new Error('Failed to save email');
        const newEmail = await response.json();
        setEmails([newEmail, ...emails]);
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleDeleteEmail = async (id) => {
    try {
      const url = config.API_BASE_URL 
        ? `${config.API_BASE_URL}/api/emails/${id}`
        : `/api/emails/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete email');
      setEmails(emails.filter((email) => email._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendEmail = async (id) => {
    try {
      setError(null);
      const url = config.API_BASE_URL 
        ? `${config.API_BASE_URL}/api/emails/${id}/send`
        : `/api/emails/${id}/send`;
      const response = await fetch(url, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }
      
      const result = await response.json();
      // Update the email in the list
      setEmails(emails.map(email => 
        email._id === id ? result.email || result : email
      ));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>📧 Email Demo</h1>
          <p>Manage your emails with React, Node.js, and MongoDB</p>
        </header>

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        <div className="content">
          <div className="form-section">
            <EmailForm onSubmit={handleEmailSubmit} />
          </div>

          <div className="list-section">
            {loading ? (
              <div className="loading">Loading emails...</div>
            ) : (
              <EmailList 
                emails={emails} 
                onDelete={handleDeleteEmail}
                onSend={handleSendEmail}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

