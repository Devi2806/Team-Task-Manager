import sys

def convert_responsive(file_path):
    with open(file_path, "r") as f:
        content = f.read()
    
    replacements = {
        'bg-slate-950 text-white': 'bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-white',
        'bg-slate-900/50 text-white': 'bg-gray-100/50 dark:bg-slate-900/50 text-gray-900 dark:text-white',
        'bg-slate-950 text-white': 'bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white',
        'bg-slate-900 border border-slate-800': 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800',
        'border-slate-800': 'border-gray-100 dark:border-slate-800',
        'border-slate-700': 'border-gray-200 dark:border-slate-700',
        'text-slate-200': 'text-gray-800 dark:text-slate-200',
        'text-slate-300': 'text-gray-700 dark:text-slate-300',
        'text-slate-400': 'text-gray-600 dark:text-slate-400',
        'text-slate-500': 'text-gray-500 dark:text-slate-500',
        'bg-slate-800/50': 'bg-gray-50 dark:bg-slate-800/50',
        'hover:bg-slate-800': 'hover:bg-gray-50 dark:hover:bg-slate-800',
        'hover:text-white': 'hover:text-gray-900 dark:hover:text-white',
        
        'bg-blue-900/40 text-blue-300': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
        'bg-orange-900/40 text-orange-300': 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
        'bg-green-900/40 text-green-300': 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
        'bg-red-900/40 text-red-300': 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
        'bg-purple-900/40 text-purple-300': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
        'bg-yellow-900/40 text-yellow-300': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
        'bg-indigo-900/40 text-indigo-300': 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
        
        'bg-yellow-950/30': 'bg-yellow-50 dark:bg-yellow-950/30',
        'bg-blue-950/30': 'bg-blue-50 dark:bg-blue-950/30',
        'bg-green-950/30': 'bg-green-50 dark:bg-green-950/30',
        'bg-red-950/30': 'bg-red-50 dark:bg-red-950/30',
        'bg-orange-950/30': 'bg-orange-50 dark:bg-orange-950/30',
        
        'border-yellow-700': 'border-yellow-400 dark:border-yellow-700',
        'border-blue-700': 'border-blue-400 dark:border-blue-700',
        'border-green-700': 'border-green-400 dark:border-green-700',
        'bg-slate-950': 'bg-slate-50 dark:bg-slate-950',
    }

    for old, new in replacements.items():
        content = content.replace(old, new)

    # Some manual cleanup of redundant classes
    content = content.replace('bg-slate-50 dark:bg-slate-50 dark:bg-slate-950', 'bg-slate-50 dark:bg-slate-950')
    content = content.replace('text-white text-gray-900 dark:text-white', 'text-gray-900 dark:text-white')

    with open(file_path, "w") as f:
        f.write(content)

for p in ["src/pages/Dashboard.jsx", "src/pages/Projects.jsx", "src/pages/ProjectDetail.jsx", "src/pages/Login.jsx", "src/pages/Signup.jsx"]:
    convert_responsive(p)
