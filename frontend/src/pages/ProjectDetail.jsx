import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, FolderKanban, LogOut, CheckCircle2, Plus, 
  Trash2, X, MoreVertical, Calendar, Flag, User, Users, AlignLeft, ShieldAlert
} from 'lucide-react'
import { format } from 'date-fns'
import API from '../api'
import ThemeToggle from '../ThemeToggle'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showMemberForm, setShowMemberForm] = useState(false)
  
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium', status: 'todo', due_date: '', assigned_to: '' })
  const [memberEmail, setMemberEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInitData()
  }, [id])

  const fetchInitData = async () => {
    try {
      const [projRes, tasksRes, userRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/tasks/${id}/tasks`),
        API.get('/auth/current')
      ])
      setProject(projRes.data)
      setTasks(tasksRes.data)
      setCurrentUser(userRes.data)
    } catch {
      navigate('/projects')
    } finally {
      setLoading(false)
    }
  }

  const fetchProjectAndTasks = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/tasks/${id}/tasks`)
      ])
      setProject(projRes.data)
      setTasks(tasksRes.data)
    } catch {
      // ignore
    }
  }

  const myRole = project?.members?.find(m => m.user_id === currentUser?.id)?.role
  const isAdmin = myRole === 'admin'

  const createTask = async (e) => {
    e.preventDefault()
    try {
      const data = { ...taskForm }
      if (!data.due_date) delete data.due_date
      if (!data.assigned_to) delete data.assigned_to
      else data.assigned_to = parseInt(data.assigned_to)

      await API.post(`/tasks/${id}/tasks`, data)
      setTaskForm({ title: '', description: '', priority: 'medium', status: 'todo', due_date: '', assigned_to: '' })
      setShowTaskForm(false)
      fetchProjectAndTasks()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create task')
    }
  }

  const updateTaskStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${id}/tasks/${taskId}`, { status })
      fetchProjectAndTasks()
    } catch (err) {
      alert('Failed to update task')
    }
  }

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await API.delete(`/tasks/${id}/tasks/${taskId}`)
      fetchProjectAndTasks()
    } catch {
      alert('Failed to delete task')
    }
  }

  const deleteProject = async () => {
    if (!window.confirm(`Are you sure you want to delete ${project.name}? This cannot be undone.`)) return
    try {
      await API.delete(`/projects/${id}`)
      navigate('/projects')
    } catch {
      alert('Failed to delete project')
    }
  }

  const addMember = async (e) => {
    e.preventDefault()
    try {
      await API.post(`/projects/${id}/members`, { email: memberEmail, role: 'member' })
      setMemberEmail('')
      setShowMemberForm(false)
      fetchProjectAndTasks()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add member')
    }
  }

  const removeMember = async (memberUserId) => {
    if (!window.confirm('Remove this member from the project?')) return
    try {
      await API.delete(`/projects/${id}/members/${memberUserId}`)
      fetchProjectAndTasks()
    } catch {
      alert('Failed to remove member')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const priorityStyles = {
    low: 'bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700',
    medium: 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 border-orange-200',
    high: 'bg-red-50 dark:bg-red-950/30 text-red-700 border-red-200'
  }

  const columnConfig = [
    { id: 'todo', label: 'To Do', color: 'border-yellow-400 dark:border-yellow-700', bg: 'bg-yellow-50 dark:bg-yellow-950/30' },
    { id: 'in_progress', label: 'In Progress', color: 'border-blue-400 dark:border-blue-700', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { id: 'done', label: 'Done', color: 'border-green-400 dark:border-green-700', bg: 'bg-green-50 dark:bg-green-950/30' }
  ]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white flex flex-col relative text-white">
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
              <Link to="/" className="flex items-center gap-1.5 font-medium text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link to="/projects" className="flex items-center gap-1.5 font-medium text-blue-600 transition-colors">
                <FolderKanban className="w-4 h-4" /> Projects
              </Link>
              <ThemeToggle />
                <button 
                  onClick={logout} className="flex items-center gap-1.5 text-gray-500 dark:text-slate-500 hover:text-red-600 font-medium transition-colors border-l pl-6 border-gray-200 dark:border-slate-700">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-0">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-950/30 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
          
          <div className="relative flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">{project?.name}</h2>
                {isAdmin && <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-purple-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Admin</span>}
              </div>
              <p className="text-gray-500 dark:text-slate-500 text-lg max-w-2xl">{project?.description || 'No description provided.'}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {isAdmin && (
                <button 
                  onClick={() => setShowMemberForm(true)} 
                  className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 px-4 py-2 rounded-xl font-semibold shadow-sm hover:bg-gray-50 dark:bg-slate-800/50 flex items-center gap-2 transition"
                >
                  <Users className="w-4 h-4" /> Add Member
                </button>
              )}
              {isAdmin && (
                <button 
                  onClick={() => setShowTaskForm(true)} 
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-700 flex items-center gap-2 transition"
                >
                  <Plus className="w-5 h-5" /> New Task
                </button>
              )}
              {isAdmin && (
                <button 
                  onClick={deleteProject} 
                  className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 border border-red-200 text-red-600 px-4 py-2 rounded-xl font-semibold shadow-sm hover:bg-red-50 dark:bg-red-950/30 flex items-center gap-2 transition"
                >
                  <Trash2 className="w-4 h-4" /> Delete Project
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {showMemberForm && isAdmin && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="border-b border-gray-100 dark:border-slate-800 p-6 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50/50">
                <h3 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5 text-purple-600" /> Invite Team Member</h3>
                <button onClick={() => setShowMemberForm(false)} className="text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:text-slate-300 transition"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={addMember} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">User Email</label>
                  <input
                    type="email"
                    placeholder="colleague@example.com"
                    className="w-full border border-gray-200 dark:border-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium"
                    value={memberEmail}
                    onChange={e => setMemberEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setShowMemberForm(false)} className="flex-1 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:bg-slate-800/50 transition">Cancel</button>
                  <button type="submit" className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:bg-purple-700 transition">Send Invite</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showTaskForm && isAdmin && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="border-b border-gray-100 dark:border-slate-800 p-6 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50/50">
                <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600" /> Create Task</h3>
                <button onClick={() => setShowTaskForm(false)} className="text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:text-slate-300 transition"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={createTask} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="E.g., Design the landing page"
                    className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-medium"
                    value={taskForm.title}
                    onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea
                    placeholder="Details about the task..."
                    className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-medium resize-none"
                    value={taskForm.description}
                    onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Priority</label>
                    <select
                      className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                      value={taskForm.priority}
                      onChange={e => setTaskForm({...taskForm, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Status</label>
                    <select
                      className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                      value={taskForm.status}
                      onChange={e => setTaskForm({...taskForm, status: e.target.value})}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Due Date</label>
                    <input
                      type="datetime-local"
                      className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm"
                      value={taskForm.due_date}
                      onChange={e => setTaskForm({...taskForm, due_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Assignee</label>
                    <select
                      className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                      value={taskForm.assigned_to}
                      onChange={e => setTaskForm({...taskForm, assigned_to: e.target.value})}
                    >
                      <option value="">Unassigned</option>
                      {project?.members?.map(m => (
                        <option key={m.user_id} value={m.user_id}>User ID {m.user_id} ({m.role})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowTaskForm(false)} className="flex-1 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:bg-slate-800/50 transition">Cancel</button>
                  <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition">Create Task</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Kanban Board Container */}
        <div className="flex-1 min-h-[500px] border-t border-gray-200 dark:border-slate-700 pt-8 mt-2 overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max h-full items-start">
            {columnConfig.map(col => {
              const colTasks = tasks.filter(t => t.status === col.id)
              return (
                <div key={col.id} className="w-80 flex flex-col bg-gray-100/50 dark:bg-slate-900/50 text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-slate-700 max-h-full">
                  <div className={`p-4 border-t-4 ${col.color} rounded-t-2xl font-bold flex items-center justify-between`}>
                    <h3 className="text-gray-800 dark:text-slate-200">{col.label}</h3>
                    <span className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-500 text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm">
                      {colTasks.length}
                    </span>
                  </div>
                  <div className="p-3 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
                    {colTasks.map(task => (
                      <div key={task.id} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow group flex flex-col">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-white leading-snug">{task.title}</h4>
                          {isAdmin && (
                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="text-gray-500 dark:text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        {task.description && (
                          <div className="flex gap-1.5 items-start mt-1 mb-3 text-gray-500 dark:text-slate-500">
                            <AlignLeft className="w-4 h-4 mt-0.5 shrink-0" />
                            <p className="text-sm line-clamp-3 leading-relaxed">{task.description}</p>
                          </div>
                        )}
                        
                        <div className="mt-auto pt-4 space-y-3 border-t border-gray-50">
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className={`text-xs font-bold px-2 py-1 flex items-center gap-1 border rounded-md ${priorityStyles[task.priority]}`}>
                              <Flag className="w-3 h-3" /> {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                            {task.due_date && (
                              <span className="text-xs font-semibold px-2 py-1 flex items-center gap-1 border border-gray-200 dark:border-slate-700 rounded-md text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-800/50">
                                <Calendar className="w-3 h-3" /> {format(new Date(task.due_date), 'MMM d, yyyy')}
                              </span>
                            )}
                            {task.assigned_to && (
                              <span className="text-xs font-semibold px-2 py-1 flex items-center gap-1 border border-blue-200 rounded-md text-blue-700 bg-blue-50 dark:bg-blue-950/30 ml-auto">
                                <User className="w-3 h-3" /> ID: {task.assigned_to}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex gap-2 w-full pt-1">
                            {col.id !== 'todo' && (
                              <button 
                                onClick={() => updateTaskStatus(task.id, col.id === 'in_progress' ? 'todo' : 'in_progress')}
                                className="flex-1 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:bg-slate-800/50 text-gray-600 dark:text-slate-400 text-xs font-bold py-2 rounded-lg transition-colors"
                              >
                                ← Prev
                              </button>
                            )}
                            {col.id !== 'done' && (
                              <button 
                                onClick={() => updateTaskStatus(task.id, col.id === 'todo' ? 'in_progress' : 'done')}
                                className="flex-1 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-blue-50 dark:bg-blue-950/30 hover:text-blue-600 hover:border-blue-200 text-gray-600 dark:text-slate-400 text-xs font-bold py-2 rounded-lg transition-colors"
                              >
                                Next →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {colTasks.length === 0 && (
                      <div className="py-8 px-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl text-center flex flex-col items-center justify-center opacity-70">
                        <ListTodo className="w-8 h-8 text-gray-300 mb-2" />
                        <p className="text-sm font-medium text-gray-500 dark:text-slate-500">No tasks here</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            
            {/* Members Panel */}
            <div className="w-80 flex flex-col bg-gray-100/50 dark:bg-slate-900/50 text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-slate-700/60 p-5 ml-4 shadow-inner min-h-full">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" /> 
                Team Members <span className="bg-gray-200 text-xs rounded-full px-2 py-0.5 ml-auto">{project?.members?.length || 0}</span>
              </h3>
              <div className="space-y-3">
                {project?.members?.map(member => (
                  <div key={member.id} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${member.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-purple-700' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-blue-700'}`}>
                        {member.user_id}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">User ID {member.user_id}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-500 capitalize">{member.role}</p>
                      </div>
                    </div>
                    {isAdmin && member.user_id !== currentUser?.id && (
                      <button 
                        onClick={() => removeMember(member.user_id)}
                        className="text-red-400 hover:text-red-600 bg-red-50 dark:bg-red-950/30 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition"
                        title="Remove Member"
                      >
                       <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}