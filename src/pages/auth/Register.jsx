import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'
import { ROLES as ROLE_CONST } from '../../utils/constants'
import axios from 'axios'

const ROLE_OPTIONS = [
  { value: ROLE_CONST.CUSTOMER,         label: 'Customer',           icon: '🧑‍🍳', desc: 'Order food from restaurants' },
  { value: ROLE_CONST.RESTAURANT_OWNER, label: 'Restaurant Owner',   icon: '🍳', desc: 'List & manage your restaurant' },
  { value: ROLE_CONST.DELIVERY_PARTNER, label: 'Delivery Partner',   icon: '🛵', desc: 'Deliver orders & earn money' },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', password: '',
    role: ROLE_CONST.CUSTOMER  
  })
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())          e.name            = 'Name is required'
    if (!form.email)                e.email           = 'Email is required'
    if (form.password.length < 4)   e.password        = 'Min 4 characters'
    
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validate()) return

  setLoading(true)

  const payload = {
    fullName: form.name,
    email: form.email,
    password: form.password,
    role: form.role.toUpperCase()
  }

  try {
    const res = await axios.post(
      "http://localhost:8080/api/v1/auth/register",
      payload
    )

    const { success, message } = res.data

    if (!success) {
      throw new Error(message || "Registration failed")
    }

    toast.success(message) // 🔥 "User registered successfully"
    navigate("/login", { replace: true })

  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      err.message ||
      "Registration failed"
    )
  } finally {
    setLoading(false)
  }
}




  return (
    <div className="min-h-screen bg-hero-gradient dark:bg-none dark:bg-surface-dark flex items-center justify-center px-4 py-16">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card p-8 shadow-hover">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-3">🚀</span>
            <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
              Create account
            </h1>
            <p className="text-stone-400 text-sm mt-1">Join FoodDash today — it's free!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="label">I want to join as</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`
                      p-3 rounded-xl border-2 text-center text-xs transition-all
                      ${form.role === r.value
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                      }
                    `}
                  >
                    <span className="text-2xl block mb-1">{r.icon}</span>
                    <span className={`font-semibold block ${form.role === r.value ? 'text-brand-600' : 'text-stone-700 dark:text-stone-300'}`}>
                      {r.label}
                    </span>
                    <span className="text-stone-400 text-[10px] mt-0.5 block leading-tight">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Full name */}
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                {/* <HiUser className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-400" /> */}
                <input
                  type="text"
                  className={`input pl-12 ${errors.name ? 'border-red-400' : ''} h-11`}
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                {/* <HiMail className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-400" /> */}
                <input
                  type="email"
                  className={`input pl-11 ${errors.email ? 'border-red-400' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  {/* <HiLockClosed className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-400" /> */}
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className={`input pl-11 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3 top-3.5 text-stone-400">
                    {showPwd ? <HiEyeOff className="w-4.5 h-4.5" /> : <HiEye className="w-4.5 h-4.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              {/* <div>
                <label className="label">Confirm password</label>
                <input
                  type="password"
                  className={`input ${errors.confirmPassword ? 'border-red-400' : ''}`}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div> */}
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 font-semibold hover:text-brand-600">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
