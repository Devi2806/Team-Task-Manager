import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, LogOut, CheckCircle2, Clock, AlertCircle, ListTodo, ClipboardList, Briefcase } from 'lucide-react'
import API from '../api'
import ThemeToggle from '../ThemeToggle'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    API.get('/tasks/dashboard')
      .then(res => setStats(res.data))
      .catch(() => setStats({ total_tasks: 0, todo: 0, in_progress: 0, done: 0, overdue: 0, total_projects: 0 }))
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const statCards = stats ? [
    { label: 'Total Tasks', value: stats.total_tasks, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
    { label: 'To Do', value: stats.todo, icon: ListTodo, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' },
    { label: 'In Progress', value: stats.in_progress, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' },
    { label: 'Completed', value: stats.done, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' },
    { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' },
    { label: 'Projects', value: stats.total_projects, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' },
  ] : []

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white flex flex-col">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                Team Task Manager
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <Link 
                to="/" 
                className={`flex items-center gap-1.5 font-medium transition-colors ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link 
                to="/projects" 
                className={`flex items-center gap-1.5 font-medium transition-colors ${location.pathname.startsWith('/projects') ? 'text-blue-600' : 'text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <FolderKanban className="w-4 h-4" /> Projects
              </Link>
              <ThemeToggle />
<button 
                  onClick={logout} 
                className="flex items-center gap-1.5 text-gray-500 dark:text-slate-500 hover:text-red-600 font-medium transition-colors border-l pl-6 border-gray-200 dark:border-slate-700"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
          <p className="text-gray-500 dark:text-slate-500 mt-1">Track your progress and monitor your tasks across all projects.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className={`${stat.bg} p-4 rounded-xl group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-slate-500 font-medium text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}