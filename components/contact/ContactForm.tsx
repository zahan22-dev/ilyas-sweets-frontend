'use client';

import { FormEvent, useMemo, useState } from 'react';

type ContactFormState = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

const initialForm: ContactFormState = {
  firstName: '',
  lastName: '',
  email: '',
  message: '',
};

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const endpoint = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    return `${base.replace(/\/$/, '')}/contact`;
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || 'Unable to send your message right now.');
      }

      setForm(initialForm);
      setStatus({
        type: 'success',
        message: 'Your message has been sent successfully. Our team will get back to you soon.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      setStatus({
        type: 'error',
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-gray-50 h-full">
      <h3 className="text-3xl font-black font-heading uppercase tracking-tighter mb-10 text-[#111111]">Send a Message</h3>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-gray-500">First Name</label>
            <input
              required
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-5 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300"
              placeholder="Ali"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-gray-500">Last Name</label>
            <input
              required
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-5 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300"
              placeholder="Khan"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-black uppercase tracking-widest text-gray-500">Email Address</label>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-5 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300"
            placeholder="ali@example.com"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-black uppercase tracking-widest text-gray-500">Message</label>
          <textarea
            required
            rows={6}
            name="message"
            value={form.message}
            onChange={handleChange}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl px-6 py-5 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300 resize-none custom-scrollbar"
            placeholder="How can we help you?"
          ></textarea>
        </div>

        {status && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
              status.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-6 rounded-full font-black uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group/btn bg-[#FFC702] text-[#111111] hover:bg-[#e6b300] shadow-[0_10px_20px_rgba(255,199,2,0.3)] hover:shadow-[0_15px_30px_rgba(255,199,2,0.4)] hover:scale-[1.02] mt-4 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span className="relative z-10 flex items-center gap-2 text-[17px]">
            {loading ? 'Sending...' : 'Send Message'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover/btn:translate-x-2 transition-transform"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </span>
        </button>
      </form>
    </div>
  );
}
