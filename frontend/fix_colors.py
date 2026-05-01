import sys
import glob
import re

def fix(file):
    with open(file, 'r') as f:
        c = f.read()

    # Text white issues inside headings, paras and divs
    c = c.replace('font-bold text-white', 'font-bold text-gray-900 dark:text-white')
    c = c.replace('text-center text-white mb-2', 'text-center text-gray-900 dark:text-white mb-2')
    
    # Input text 
    c = c.replace('font-medium text-white placeholder-slate-500', 'font-medium text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500')

    # Double classes from previous iterations
    c = c.replace('dark:border-gray-100 dark:border-slate-800', 'dark:border-slate-800')
    c = c.replace('dark:bg-slate-50 dark:bg-slate-950', 'dark:bg-slate-950')
    c = c.replace('dark:bg-slate-950 text-white', 'dark:bg-slate-950 text-gray-900 dark:text-white')

    with open(file, 'w') as f:
        f.write(c)

for f in glob.glob('src/pages/*.jsx'):
    fix(f)
