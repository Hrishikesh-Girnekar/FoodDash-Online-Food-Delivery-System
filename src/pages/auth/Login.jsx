import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'

import Button from '../../components/common/Button'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }


const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validate()) return

  setLoading(true)

  try {
    await login(form)

    navigate("/", { replace: true })

  } catch (err) {
    toast.error(err.message || "Invalid credentials")
  } finally {
    setLoading(false)
  }
}



  return (
    <div className="min-h-screen bg-hero-gradient dark:bg-none dark:bg-surface-dark flex items-center justify-center px-4 py-16">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card */}
        <div className="card p-8 shadow-hover">
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-5xl block mb-3">🍜</span>
            <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
              Welcome back
            </h1>
            <p className="text-stone-400 text-sm mt-1">Sign in to your FoodDash account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  className={`input pl-11 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-500 hover:text-brand-600">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className={`input pl-11 pr-11 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600"
                >
                  {showPwd ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 font-semibold hover:text-brand-600">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
