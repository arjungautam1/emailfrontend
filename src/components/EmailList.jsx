import './EmailList.css';

function EmailList({ emails, onDelete, onSend }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return '#28a745';
      case 'failed':
        return '#dc3545';
      case 'draft':
      default:
        return '#ffc107';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (emails.length === 0) {
    return (
      <div className="email-list">
        <h2>Email Inbox</h2>
        <div className="empty-state">
          <p>No emails yet. Create your first email!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="email-list">
      <h2>Email Inbox ({emails.length})</h2>
      <div className="emails-container">
        {emails.map((email) => (
          <div key={email._id} className="email-card">
            <div className="email-header">
              <div className="email-meta">
                <span className="email-from">{email.from}</span>
                <span className="email-to">→ {email.to}</span>
                {email.cc && (
                  <span className="email-cc">CC: {email.cc}</span>
                )}
                {email.bcc && (
                  <span className="email-bcc">BCC: {email.bcc}</span>
                )}
              </div>
              <div className="email-actions">
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(email.status) }}
                >
                  {email.status}
                </span>
                {email.status === 'draft' && (
                  <button
                    className="send-btn"
                    onClick={() => onSend(email._id)}
                    title="Send email"
                  >
                    📤
                  </button>
                )}
                <button
                  className="delete-btn"
                  onClick={() => onDelete(email._id)}
                  title="Delete email"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="email-subject">{email.subject}</div>
            <div className="email-body">{email.body}</div>
            <div className="email-footer">
              <span className="email-date">{formatDate(email.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmailList;

