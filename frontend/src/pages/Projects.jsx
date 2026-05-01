import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, LogOut, CheckCircle2, Plus, X, Users, LayoutList } from 'lucide-react'
import API from '../api'
import ThemeToggle from '../ThemeToggle'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects/')
      setProjects(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (e) => {
    e.preventDefault()
    try {
      await API.post('/projects/', form)
      setForm({ name: '', description: '' })
      setShowForm(false)
      fetchProjects()
    } catch (err) {
      console.error('Error creating project:', err)
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to create project'
      alert(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg))
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white flex flex-col relative">
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
            <p className="text-gray-500 dark:text-slate-500 mt-1">Manage your team's projects and workspaces.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> New Project
          </button>
        </div>

        {/* Create Project Modal Layer */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="border-b border-gray-100 dark:border-slate-800 p-6 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50/50">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <LayoutList className="w-5 h-5 text-blue-600" /> Create New Project
                </h3>
                <button onClick={() => setShowForm(false)} className="text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:text-slate-300 transition">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={createProject} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Project Name</label>
                  <input
                    type="text"
                    placeholder="E.g., Website Redesign"
                    className="w-full border border-gray-200 dark:border-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-400 font-medium"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Description (Optional)</label>
                  <textarea
                    placeholder="Briefly describe the project's goal..."
                    className="w-full border border-gray-200 dark:border-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-400 resize-none"
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-semibold px-4 py-3 rounded-xl hover:bg-gray-50 dark:bg-slate-800/50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 bg-blue-600 text-white font-semibold px-4 py-3 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all">
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Project Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-full mb-4">
              <FolderKanban className="w-16 h-16 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No projects yet</h3>
            <p className="text-gray-500 dark:text-slate-500 max-w-sm mb-6">Create your first project to start organizing tasks and collaborating with your team.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 border-2 border-dashed border-gray-300 text-gray-600 dark:text-slate-400 px-6 py-3 rounded-xl font-medium hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              + Create a Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl group-hover:bg-indigo-600 group-hover:text-gray-900 dark:hover:text-white transition-colors">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">{project.name}</h3>
                <p className="text-gray-500 dark:text-slate-500 text-sm mb-6 flex-1 line-clamp-3">
                  {project.description || 'No description provided.'}
                </p>
                <div className="flex items-center gap-4 border-t border-gray-50 pt-4 mt-auto">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-slate-500 bg-gray-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                    <Users className="w-3.5 h-3.5" />
                    <span>{project.members?.length || 0} Members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
