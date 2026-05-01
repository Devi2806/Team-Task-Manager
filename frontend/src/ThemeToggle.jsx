import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center mr-2"
      title="Toggle Theme"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? <Moon className="w-5 h-5 text-slate-800" /> : <Sun className="w-5 h-5 text-yellow-400" />}
    </button>
  )
}
