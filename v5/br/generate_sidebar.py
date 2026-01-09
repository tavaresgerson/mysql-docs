import os

def get_title(filepath):
    # Default to filename if reading fails or file is empty
    title = os.path.basename(filepath)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line:
                    # Use the first non-empty line, removing leading markdown headers (#)
                    title = line.lstrip('#').strip()
                    break
    except Exception:
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

def format_js_value(value, indent_level=0):
    indent = "\t" * indent_level
    if isinstance(value, list):
        if not value:
            return "[]"
        lines = ["[\n"]
        for item in value:
            lines.append(f"{indent}\t{format_js_value(item, indent_level + 1)},\n")
        lines.append(f"{indent}]")
        return "".join(lines)
    elif isinstance(value, dict):
        if not value:
            return "{}"
        lines = ["{\n"]
        for k, v in value.items():
            # Keys are unquoted
            lines.append(f"{indent}\t{k}: {format_js_value(v, indent_level + 1)},\n")
        lines.append(f"{indent}}}")
        return "".join(lines)
    elif isinstance(value, str):
        # Use single quotes and escape existing single quotes
        safe_str = value.replace("'", "\\'")
        return f"'{safe_str}'"
    elif isinstance(value, bool):
        return "true" if value else "false"
    else:
        return str(value)

def generate_sidebar():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    sidebar_items = scan_directory(base_dir, "")

    # Format as JS object export
    js_content = "export default " + format_js_value(sidebar_items)

    output_path = os.path.join(base_dir, '.vitepress', 'sidebar.js')
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"Sidebar generated at {output_path}")
    except Exception as e:
        print(f"Error writing sidebar: {e}")

if __name__ == "__main__":
    generate_sidebar()
