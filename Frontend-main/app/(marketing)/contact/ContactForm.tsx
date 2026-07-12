"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (form.name && form.email && form.message) setSent(true);
  };

  if (sent) {
    return (
      <div className="form-success">
        <span>✅</span>
        <h3>Message Sent!</h3>
        <p>Thank you for reaching out. We&apos;ll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <>
      <div className="form-row">
        <input
          className="form-input"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="form-input"
          placeholder="Your Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <input
        className="form-input"
        placeholder="Subject"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
      />
      <textarea
        className="form-textarea"
        placeholder="Message"
        rows={5}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      <button className="btn-primary" type="button" onClick={handleSubmit}>
        Get a Quote →
      </button>
    </>
  );
}
