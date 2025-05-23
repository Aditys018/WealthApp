import { useEffect, useState } from 'react';

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
    logo: null as File | null,
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

  // State for logo preview URL
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (form.logo) {
      const url = URL.createObjectURL(form.logo);
      setLogoPreview(url);

      // Cleanup URL object when logo changes or component unmounts
      return () => URL.revokeObjectURL(url);
    } else {
      setLogoPreview(null);
    }
  }, [form.logo]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const target = e.target;
    const { name, value, type } = target;

    if (name === 'logo' && target instanceof HTMLInputElement && target.files) {
      setForm((f) => ({ ...f, logo: target.files![0] }));
    } else if (name.startsWith('address.')) {
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

      const formData = new FormData();

      formData.append('name', form.name);
      formData.append('sector', form.sector);
      formData.append('email', form.email);
      formData.append('otp', form.otp);
      formData.append('otpId', form.otpId);
      formData.append('password', form.password);
      formData.append('confirmPassword', form.confirmPassword);
      formData.append('phone', form.phone);
      formData.append('address', JSON.stringify(form.address));
      formData.append('dataAccessPreferences', JSON.stringify(form.dataAccessPreferences));

      if (form.logo) {
        formData.append('logo', form.logo);
      }

      const res = await fetch('http://localhost:8080/companies/register', {
        method: 'POST',
        body: formData,
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
        logo: null,
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
        <div className="grid grid-cols-3 gap-6 items-end">
          {/* Company Name */}
          <div className="col-span-2">
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

            {/* Sector below Company Name */}
            <div className="mt-4">
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

          {/* Logo Upload on RHS */}
<div>
  <div>
  <label className={labelClass} htmlFor="logo">Upload Logo</label>

  <div className="relative border border-gray-600 rounded-md p-4 w-48 h-40 flex items-center justify-center cursor-pointer">
    <input
      id="logo"
      name="logo"
      type="file"
      accept="image/*"
      onChange={handleChange}
      className="absolute w-full h-full opacity-0 cursor-pointer"
    />
    
    {/* Show preview inside the box if available */}
    {logoPreview ? (
      <img
        src={logoPreview}
        alt="Logo Preview"
        className="max-w-full max-h-full object-contain rounded-md"
      />
    ) : (
      <span className="text-gray-500 text-center select-none">
        Click to select an image
      </span>
    )}
  </div>

  {/* Show filename below the box only if preview is not shown */}
  {form.logo && !logoPreview && (
    <p className="mt-1 text-sm text-gray-300">{form.logo.name}</p>
  )}
</div>
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
className="px-4 py-2 rounded-md bg-[#ff9500] text-black font-semibold hover:bg-[#e28500]">Send OTP</button>
</div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
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
      <button
        type="button"
        onClick={verifyOtp}
        disabled={loading}
        className="px-4 py-2 rounded-md bg-[#ff9500] text-black font-semibold hover:bg-[#e28500]"
      >
        Verify OTP
      </button>
    </div>

    {/* Password and Confirm Password */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className={labelClass} htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          required
          className={inputClass}
        />
      </div>
    </div>

    {/* Phone */}
    <div>
      <label className={labelClass} htmlFor="phone">Phone Number</label>
      <input
        id="phone"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={handleChange}
        placeholder="Enter phone number"
        required
        className={inputClass}
      />
    </div>

    {/* Address */}
    <fieldset className="border border-gray-600 rounded-md p-4 space-y-4">
      <legend className="text-[#ff9500] font-semibold">Address</legend>

      <div>
        <label className={labelClass} htmlFor="address.street">Street</label>
        <input
          id="address.street"
          name="address.street"
          value={form.address.street}
          onChange={handleChange}
          placeholder="Street"
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClass} htmlFor="address.city">City</label>
          <input
            id="address.city"
            name="address.city"
            value={form.address.city}
            onChange={handleChange}
            placeholder="City"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="address.state">State</label>
          <input
            id="address.state"
            name="address.state"
            value={form.address.state}
            onChange={handleChange}
            placeholder="State"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="address.country">Country</label>
          <input
            id="address.country"
            name="address.country"
            value={form.address.country}
            onChange={handleChange}
            placeholder="Country"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="address.pincode">Pincode</label>
        <input
          id="address.pincode"
          name="address.pincode"
          value={form.address.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          required
          className={inputClass}
        />
      </div>
    </fieldset>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-md bg-[#ff9500] text-black font-bold text-lg hover:bg-[#e28500]"
    >
      {loading ? 'Submitting...' : 'Register Company'}
    </button>
  </form>
</div>
);
}
