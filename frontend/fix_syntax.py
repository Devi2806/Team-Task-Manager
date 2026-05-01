import sys

def fix_syntax(file_path):
    with open(file_path, "r") as f:
        content = f.read()

    # The issue in ProjectDetail: `<button <ThemeToggle />`
    # Let's cleanly fix it
    
    content = content.replace('<button <ThemeToggle />\n                <button', '<ThemeToggle />\n                <button')
    content = content.replace('<button <ThemeToggle />\n              <button', '<ThemeToggle />\n              <button')
    
    # Dashboard issue:
    #                 <ThemeToggle />
    #                <button
    #                  <ThemeToggle />
    #                <button \n onClick={logout}
    
    # Just to be extremely robust, I will use regex to find `<button <ThemeToggle />`
    import re
    content = re.sub(r'<button\s*<ThemeToggle />\s*<button', r'<ThemeToggle />\n<button', content)
    content = re.sub(r'<ThemeToggle />\s*<button\s*<ThemeToggle />\s*<button', r'<ThemeToggle />\n<button', content)
    content = re.sub(r'<button\s*<ThemeToggle />\s*<button', r'<ThemeToggle />\n<button', content)

    with open(file_path, "w") as f:
        f.write(content)

for p in ["src/pages/Dashboard.jsx", "src/pages/Projects.jsx", "src/pages/ProjectDetail.jsx"]:
    fix_syntax(p)

