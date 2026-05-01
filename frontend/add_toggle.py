import sys

def inject_toggle(file_path):
    with open(file_path, "r") as f:
        lines = f.readlines()
    
    # Needs: `import ThemeToggle from '../ThemeToggle'`
    if not any('import ThemeToggle' in line for line in lines):
        # Find last import
        last_import = 0
        for i, line in enumerate(lines):
            if line.startswith('import '):
                last_import = i
        
        lines.insert(last_import + 1, "import ThemeToggle from '../ThemeToggle'\n")
    
    content = "".join(lines)
    
    # Find exact logout button to insert before it
    # logout button usually matches: <button \n onClick={logout}
    
    if '<ThemeToggle />' not in content:
        content = content.replace('onClick={logout}', '<ThemeToggle />\n                <button \n                  onClick={logout}', 1)
        # some files have it on same line: `<button onClick={logout}`
        content = content.replace('<button onClick={logout}', '<ThemeToggle />\n              <button onClick={logout}')

    with open(file_path, "w") as f:
        f.write(content)

for p in ["src/pages/Dashboard.jsx", "src/pages/Projects.jsx", "src/pages/ProjectDetail.jsx"]:
    inject_toggle(p)
