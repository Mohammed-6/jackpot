"use client";
import { useState } from "react";
import { useCommon } from "../../context/CommonContext";
import { X, LogIn, UserPlus, Lock, User, Gift, Phone } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const AuthModal = () => {
  const {
    showAuthModal,
    authType,
    closeAuthModal,
    openAuthModal,
    customerLogin,
  } = useCommon();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    referredBy: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
    const endpoint =
      authType === "login" ? "/api/customers/login" : "/api/customers/register";

    const { name, phone, password, referredBy } = formData;

    // ✅ Validate inputs
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    if (authType === "register") {
      if (!password || password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }
    }

    if (authType === "register" && (!name || !/^[a-zA-Z ]{2,30}$/.test(name))) {
      toast.error("Please enter a valid name (letters only)");
      return;
    }

    const payload =
      authType === "login"
        ? { phone, password }
        : { name, phone, password, referredBy };
    setLoading(true);
    try {
      const res = await axios.post(BASE_URL + endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (authType === "login") customerLogin(res.data);
      toast.success(res.data.message);
      closeAuthModal();
      setLoading(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md bg-gradient-to-br from-black via-red-900 to-yellow-800 border border-yellow-500 text-white rounded-2xl shadow-2xl p-6">
        <button
          onClick={closeAuthModal}
          className="absolute top-2 right-2 text-yellow-400 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2 text-yellow-300 tracking-wide drop-shadow">
          {authType === "login" ? <LogIn size={22} /> : <UserPlus size={22} />}
          {authType === "login" ? "Login to Play" : "Register & Win"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {authType === "register" && (
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Username"
                className="w-full bg-black border border-yellow-400 rounded-md px-4 py-2 pl-10 text-sm text-yellow-100 placeholder-yellow-400"
                required
              />
              <User
                className="absolute left-3 top-2.5 text-yellow-400"
                size={16}
              />
            </div>
          )}

          <div className="relative">
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full bg-black border border-yellow-400 rounded-md px-4 py-2 pl-10 text-sm text-yellow-100 placeholder-yellow-400"
              required
            />
            <Phone
              className="absolute left-3 top-2.5 text-yellow-400"
              size={16}
            />
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-black border border-yellow-400 rounded-md px-4 py-2 pl-10 text-sm text-yellow-100 placeholder-yellow-400"
              required
            />
            <Lock
              className="absolute left-3 top-2.5 text-yellow-400"
              size={16}
            />
          </div>

          {authType === "register" && (
            <div className="relative">
              <input
                type="text"
                name="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
                placeholder="Referral Code (optional)"
                className="w-full bg-black border border-yellow-400 rounded-md px-4 py-2 pl-10 text-sm text-yellow-100 placeholder-yellow-400"
              />
              <Gift
                className="absolute left-3 top-2.5 text-yellow-400"
                size={16}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-bold py-2 rounded-md hover:bg-yellow-300 transition uppercase tracking-wide shadow-md"
          >
            {authType === "login" ? "Login Now" : "Register Now"}
          </button>
        </form>

        <p className="text-center text-sm text-yellow-300 mt-4">
          {authType === "login"
            ? "Don’t have an account?"
            : "Already registered?"}{" "}
          <button
            disabled={loading}
            onClick={() =>
              openAuthModal(authType === "login" ? "register" : "login")
            }
            className="text-white font-semibold hover:underline ml-1"
          >
            {loading
              ? "Submitting..."
              : authType === "login"
              ? "Register"
              : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
