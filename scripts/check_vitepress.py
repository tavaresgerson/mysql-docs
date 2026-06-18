import os
import re

# Lista de tags HTML5 válidas.
VALID_HTML_TAGS = {
    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br',
    'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn',
    'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3',
    'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label',
    'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol',
    'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp',
    'script', 'section', 'select', 'slot', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup',
    'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul',
    'var', 'video', 'wbr'
}

def check_strict_syntax(file_path):
    errors = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        return [f"Erro ao ler arquivo: {e}"]

    in_code_block = False

    for line_num, original_line in enumerate(lines, 1):
        line = original_line.strip()

        # 1. Gerir blocos de código multi-linha (```)
        if line.startswith('```'):
            in_code_block = not in_code_block
            continue

        if in_code_block or not line:
            continue

        # 2. REMOVER CÓDIGO INLINE (crases simples ` `) antes de validar
        # Isso evita que `col < 10` seja detectado se estiver formatado como código.
        clean_line = re.sub(r'`[^`]*`', '', original_line)

        # 3. Validar se restou algum '<' que o Vue possa confundir com uma tag
        # Procuramos por '<' seguido de texto que não tem espaço (ex: <max_con)
        potential_tags = re.findall(r'<([a-zA-Z0-9-]+)', clean_line)

        for tag in potential_tags:
            tag_lower = tag.lower()
            if tag_lower not in VALID_HTML_TAGS and not tag.startswith('!'):
                # Alerta apenas se não for uma tag HTML conhecida
                errors.append(f"Linha {line_num}: Possível tag/componente inválido '<{tag}>'. "
                               f"Se for operador SQL, use crases ou escape para '&lt;'.")

        # 4. Verificar especificamente operadores colados a letras fora de blocos de código
        # Exemplo: col<10 (O Vue tentará abrir uma tag <10)
        if re.search(r'[a-zA-Z0-9]<[a-zA-Z0-9]', clean_line):
            errors.append(f"Linha {line_num}: Operador '<' colado a texto. Risco de quebra no VitePress.")

        # 5. Interpolação Vue
        if '{{' in clean_line and '@{{' not in clean_line:
            errors.append(f"Linha {line_num}: Interpolação '{{{{' detectada. Use '@{{{{' para escapar.")

    return errors

def scan_directory(path):
    print(f"🔍 Varredura otimizada (ignorando código inline) em: {path}\n")
    found_any = False
    for root, _, files in os.walk(path):
        for file in files:
            if file.endswith(".md"):
                full_path = os.path.join(root, file)
                errs = check_strict_syntax(full_path)
                if errs:
                    found_any = True
                    print(f"📄 Arquivo: {full_path}")
                    for e in errs:
                        print(f"   {e}")
                    print("-" * 40)

    if not found_any:
        print("✅ Tudo limpo! O build do VitePress deve funcionar.")

if __name__ == "__main__":
    scan_directory("./v5/br")
