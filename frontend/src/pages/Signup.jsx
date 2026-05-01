import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, UserPlus, Lock, Mail, User } from 'lucide-react'
import API from '../api'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      await API.post('/auth/signup', { name, email, password })
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.detail || 'Signup failed')
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Dark modern background blooms */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-900/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/30 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md p-8 md:p-10 bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-900/50">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Create Account</h2>
        <p className="text-center text-gray-600 dark:text-slate-400 mb-8 font-medium">Join us and manage your team efficiently.</p>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Full name"
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-500 w-5 h-5" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-500 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-900/50 transition-all flex items-center justify-center gap-2">
            Sign Up <UserPlus className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600 dark:text-slate-400 font-medium">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-bold">Log in here</Link>
        </p>
      </div>
    </div>
  )
}