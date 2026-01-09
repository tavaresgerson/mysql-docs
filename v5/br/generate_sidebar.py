import os
import json

def get_title(filepath):
    title = os.path.basename(filepath)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line.startswith('# '):
                    title = line[2:].strip()
                    break
    except Exception as e:
        pass
    return title

def scan_directory(current_path, relative_path):
    items = []

    try:
        entries = sorted(os.listdir(current_path))
    except OSError:
        return []

    files = []
    dirs = []

    for entry in entries:
        if entry.startswith('.') or entry == 'generate_sidebar.py':
            continue

        full_path = os.path.join(current_path, entry)

        if os.path.isdir(full_path):
            dirs.append(entry)
        elif entry.endswith('.md'):
            files.append(entry)

    # Process files
    for f in files:
        if f.lower() == 'index.md':
            continue

        file_path = os.path.join(current_path, f)
        title = get_title(file_path)
        link = os.path.join(relative_path, f).replace(os.sep, '/')
        items.append({
            "text": title,
            "link": "/" + link
        })

    # Process directories
    for d in dirs:
        dir_path = os.path.join(current_path, d)
        dir_relative_path = os.path.join(relative_path, d)

        sub_items = scan_directory(dir_path, dir_relative_path)

        index_file = os.path.join(dir_path, 'index.md')
        group_title = d
        group_link = None

        if os.path.exists(index_file):
            group_title = get_title(index_file)
            group_link = "/" + os.path.join(dir_relative_path, 'index.md').replace(os.sep, '/')

        if sub_items:
            group = {
                "text": group_title,
                "collapsed": True,
                "items": sub_items
            }
            if group_link:
                group["link"] = group_link
            items.append(group)
        elif group_link:
            items.append({
                "text": group_title,
                "link": group_link
            })

    return items

def generate_sidebar():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    sidebar_items = scan_directory(base_dir, "")

    js_content = "export default " + json.dumps(sidebar_items, indent=4)

    output_path = os.path.join(base_dir, '.vitepress', 'sidebar.js')
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"Sidebar generated at {output_path}")
    except Exception as e:
        print(f"Error writing sidebar: {e}")

if __name__ == "__main__":
    generate_sidebar()
