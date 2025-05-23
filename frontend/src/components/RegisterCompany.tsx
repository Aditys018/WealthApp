import { useState } from 'react';

export default function RegisterCompany() {
  const [form, setForm] = useState({
    name: '',
    sector: '',
    email: '',
    otp: '',
    otpId: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
    },
    dataAccessPreferences: {
      allowEmail: false,
      allowPhone: false,
      allowLocation: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const target = e.target;
    const { name, value, type } = target;

    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm((f) => ({ ...f, address: { ...f.address, [key]: value } }));
    } else if (name.startsWith('dataAccessPreferences.')) {
      const key = name.split('.')[1];
      setForm((f) => ({
        ...f,
        dataAccessPreferences: {
          ...f.dataAccessPreferences,
          [key]: type === 'checkbox' ? (target as HTMLInputElement).checked : value,
        },
      }));
    } else if (type === 'checkbox') {
      setForm((f) => ({ ...f, [name]: (target as HTMLInputElement).checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  async function sendOtpToEmail() {
    if (!form.email) {
      return setError('Please enter an email before sending OTP.');
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      if (!res.ok) {
        throw new Error('Failed to send OTP.');
      }

      const data = await res.json();
      setForm((f) => ({ ...f, otpId: data.otpId }));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'OTP sending failed');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (!form.email || !form.otp || !form.otpId) {
      return setError('Please fill in email, OTP, and make sure OTP is sent.');
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp: form.otp, otpId: form.otpId }),
      });

      if (!res.ok) {
        throw new Error('OTP verification failed.');
      }

      const data = await res.json();
      if (data.verified) {
        alert('OTP Verified Successfully!');
        setError(null);
      } else {
        throw new Error('Invalid OTP.');
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/companies/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error('Company registration failed.');
      }

      alert('Company registered successfully!');
      setForm({
        name: '',
        sector: '',
        email: '',
        otp: '',
        otpId: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          country: '',
          pincode: '',
        },
        dataAccessPreferences: {
          allowEmail: false,
          allowPhone: false,
          allowLocation: false,
        },
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9500] bg-[#2c2c2c] text-white placeholder-gray-400';

  const labelClass = 'block mb-2 font-semibold text-[#ff9500]';

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-[#1d1d1d] rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#ff9500]">
        Register Your Company
      </h2>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-700 rounded-md text-center font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass} htmlFor="name">Company Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter company name"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="sector">Sector</label>
            <input
              id="sector"
              name="sector"
              value={form.sector}
              onChange={handleChange}
              placeholder="Enter sector"
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Email & OTP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              type="email"
              required
              className={inputClass}
            />
          </div>
          <button
            type="button"
            onClick={sendOtpToEmail}
            disabled={loading}
            className="w-full md:w-auto px-6 py-2 bg-[#ff9500] text-black rounded-md font-semibold hover:bg-[#e08500] transition"
          >
            Send OTP
          </button>
        </div>

        {/* OTP, Verify button, Password and Confirm Password */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center">
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="otp">OTP</label>
            <input
              id="otp"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              required
              className={inputClass}
            />
          </div>
          <div className="md:col-span-1 flex justify-center md:justify-start">
            <button
              type="button"
              onClick={verifyOtp}
              disabled={loading}
              className="w-full mt-9 md:w-auto px-4 py-2 mt-0 bg-[#ff9500] text-black rounded-md font-semibold hover:bg-[#e08500] transition"
            >
              Verify
            </button>
          </div>
          {/* Password & Confirm Password side by side */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass} htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                type="password"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                type="password"
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass} htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
            className={inputClass}
          />
        </div>

        {/* Address */}
        <div>
          <label className={labelClass}>Address</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {['street', 'city', 'state', 'country', 'pincode'].map((field) => (
              <div key={field} className="flex flex-col">
                <input
                  id={`address.${field}`}
                  name={`address.${field}`}
                  value={(form.address as any)[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>


        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#ff9500] text-black font-bold rounded-md hover:bg-[#e08500] transition"
        >
          {loading ? 'Registering...' : 'Register Company'}
        </button>
      </form>
    </div>
  );
}
