import sys

def convert_to_dark(file_path):
    with open(file_path, "r") as f:
        content = f.read()
    
    replacements = {
        'bg-slate-50': 'bg-slate-950 text-white',
        'bg-gray-100/50': 'bg-slate-900/50 text-white',
        'bg-slate-100/50': 'bg-slate-900/50 text-white',
        'bg-gray-100': 'bg-slate-950 text-white',
        'bg-white': 'bg-slate-900 border border-slate-800',
        'border-gray-200': 'border-slate-700',
        'border-gray-100': 'border-slate-800',
        'text-gray-900': 'text-white',
        'text-gray-800': 'text-slate-200',
        'text-gray-700': 'text-slate-300',
        'text-gray-600': 'text-slate-400',
        'text-gray-500': 'text-slate-500',
        'text-gray-400': 'text-slate-500',
        'bg-gray-50': 'bg-slate-800/50',
        'hover:bg-gray-50': 'hover:bg-slate-800',
        'hover:text-gray-900': 'hover:text-white',
        'bg-blue-100': 'bg-blue-900/40 text-blue-300',
        'bg-orange-100': 'bg-orange-900/40 text-orange-300',
        'bg-green-100': 'bg-green-900/40 text-green-300',
        'bg-red-100': 'bg-red-900/40 text-red-300',
        'bg-purple-100': 'bg-purple-900/40 text-purple-300',
        'bg-yellow-100': 'bg-yellow-900/40 text-yellow-300',
        'bg-indigo-100': 'bg-indigo-900/40 text-indigo-300',
        'bg-yellow-50': 'bg-yellow-950/30',
        'bg-blue-50': 'bg-blue-950/30',
        'bg-green-50': 'bg-green-950/30',
        'bg-red-50': 'bg-red-950/30',
        'bg-orange-50': 'bg-orange-950/30',
        'border-yellow-400': 'border-yellow-700',
        'border-blue-400': 'border-blue-700',
        'border-green-400': 'border-green-700',
        'focus:ring-blue-500/50': 'focus:ring-blue-500/50',
        'border-l-4': 'border-l-4'
    }

    for old, new in replacements.items():
        content = content.replace(old, new)

    with open(file_path, "w") as f:
        f.write(content)

for p in ["src/pages/Dashboard.jsx", "src/pages/Projects.jsx", "src/pages/ProjectDetail.jsx"]:
    convert_to_dark(p)
