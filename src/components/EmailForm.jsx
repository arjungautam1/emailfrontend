import { useState } from 'react';
import './EmailForm.css';

function EmailForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validateEmails = (emails) => {
    if (!emails) return true; // Optional fields
    const emailList = emails.split(',').map(e => e.trim()).filter(e => e);
    return emailList.every(email => validateEmail(email));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    
    // Clear success message when user types
    if (success) {
      setSuccess(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.to || !validateEmail(formData.to)) {
      newErrors.to = 'Please enter a valid email address';
    }

    if (formData.cc && !validateEmails(formData.cc)) {
      newErrors.cc = 'Please enter valid email addresses (comma-separated)';
    }

    if (formData.bcc && !validateEmails(formData.bcc)) {
      newErrors.bcc = 'Please enter valid email addresses (comma-separated)';
    }

    if (!formData.subject || formData.subject.trim().length === 0) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.body || formData.body.trim().length === 0) {
      newErrors.body = 'Email body is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setSuccess(false);

    // Use configured email from backend (will be set by backend)
    const success = await onSubmit({ ...formData, from: '', action: 'send' });
    if (success) {
      setFormData({
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setSubmitting(false);
  };

  const handleSaveDraft = async () => {
    if (!formData.to || !formData.subject || !formData.body) {
      setErrors({ general: 'Please fill in all required fields before saving' });
      return;
    }

    setSubmitting(true);
    const success = await onSubmit({ ...formData, from: '', action: 'save' });
    if (success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSubmitting(false);
  };

  const handleClear = () => {
    setFormData({
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      body: '',
    });
    setErrors({});
    setSuccess(false);
  };

  return (
    <div className="email-form">
      <div className="form-header">
        <h2>✉️ Compose Email</h2>
        {success && (
          <div className="success-message">
            ✓ Email sent successfully!
          </div>
        )}
      </div>

      {errors.general && (
        <div className="error-banner">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="sender-info">
          <small>📤 Sending from: <strong>arjun@codewitharjun.com</strong></small>
        </div>
        
        <div className="form-group">
          <label htmlFor="to">
            To: <span className="required">*</span>
          </label>
          <input
            type="email"
            id="to"
            name="to"
            value={formData.to}
            onChange={handleChange}
            className={errors.to ? 'error' : ''}
            placeholder="recipient@example.com"
          />
          {errors.to && <span className="error-text">{errors.to}</span>}
        </div>

        <div className="advanced-toggle">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="toggle-btn"
          >
            {showAdvanced ? '▼' : '▶'} CC / BCC
          </button>
        </div>

        {showAdvanced && (
          <>
            <div className="form-group">
              <label htmlFor="cc">CC:</label>
              <input
                type="text"
                id="cc"
                name="cc"
                value={formData.cc}
                onChange={handleChange}
                className={errors.cc ? 'error' : ''}
                placeholder="cc1@example.com, cc2@example.com"
              />
              {errors.cc && <span className="error-text">{errors.cc}</span>}
              <small className="help-text">Separate multiple emails with commas</small>
            </div>

            <div className="form-group">
              <label htmlFor="bcc">BCC:</label>
              <input
                type="text"
                id="bcc"
                name="bcc"
                value={formData.bcc}
                onChange={handleChange}
                className={errors.bcc ? 'error' : ''}
                placeholder="bcc@example.com"
              />
              {errors.bcc && <span className="error-text">{errors.bcc}</span>}
              <small className="help-text">Separate multiple emails with commas</small>
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="subject">
            Subject: <span className="required">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={errors.subject ? 'error' : ''}
            placeholder="Enter email subject"
            maxLength={200}
          />
          <div className="char-count">
            {formData.subject.length}/200
          </div>
          {errors.subject && <span className="error-text">{errors.subject}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="body">
            Message: <span className="required">*</span>
          </label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            className={errors.body ? 'error' : ''}
            rows="10"
            placeholder="Write your message here..."
          />
          {errors.body && <span className="error-text">{errors.body}</span>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleClear}
            disabled={submitting}
            className="clear-btn"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={submitting}
            className="save-btn"
          >
            💾 Save Draft
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="submit-btn"
          >
            {submitting ? (
              <>
                <span className="spinner"></span> Sending...
              </>
            ) : (
              <>
                📧 Send Email
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmailForm;

