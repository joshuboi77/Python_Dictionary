#!/usr/bin/env python3

import argparse
import json
import os
import re
from typing import Dict, List, Optional, Tuple


HEADING_ITEM_RE = re.compile(r"^###\s+(.*)\s*$")
BACKTICKED_TOKEN_RE = re.compile(r"^`([^`]+)`$")


def read_file(path: str) -> str:
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def normalize_token(raw: str) -> str:
    m = BACKTICKED_TOKEN_RE.match(raw.strip())
    if m:
        return m.group(1)
    return raw.strip()


def js_escape(s: str) -> str:
    if s is None:
        return ''
    # Escape backslashes and single quotes for safe JS string literals
    s = s.replace('\\', '\\\\').replace("'", "\\'")
    # Normalize CRLF and handle newlines in descriptions
    s = s.replace('\r\n', '\n').replace('\n', '\\n')
    return s


class SectionType:
    NONE = 'none'
    KEYWORD = 'keyword'
    BUILTIN = 'builtin'
    OPERATOR = 'operator'


def detect_section_type(line: str, state: Dict[str, str]) -> None:
    text = line.strip().lower()
    # Detect major sections by their headings in the markdown
    if text.startswith('#') and 'python language reference' in text:
        # ignore top title
        return
    if text.startswith('##') and 'python builtins' in text:
        state['current_type'] = SectionType.BUILTIN
        return
    if text.startswith('#') and 'python keywords' in text:
        state['current_type'] = SectionType.KEYWORD
        return
    if text.startswith('#') and 'python operators' in text:
        state['current_type'] = SectionType.OPERATOR
        return
    # Sub-headers inside builtins are categories; we keep type as builtin


def parse_items(md_text: str) -> List[Dict[str, Optional[str]]]:
    lines = md_text.splitlines()
    state = { 'current_type': SectionType.NONE }
    items: List[Dict[str, Optional[str]]] = []

    i = 0
    n = len(lines)
    while i < n:
        line = lines[i]
        detect_section_type(line, state)

        m = HEADING_ITEM_RE.match(line)
        if m and state['current_type'] in (SectionType.KEYWORD, SectionType.BUILTIN, SectionType.OPERATOR):
            token_name_raw = m.group(1)
            token_name = normalize_token(token_name_raw)

            # Parse description
            description = ''
            example = ''
            found_description = False

            j = i + 1
            # Find a line starting with **Description**:
            while j < n and not lines[j].lstrip().startswith('**Description**:'):
                # Stop early if next heading encountered
                if HEADING_ITEM_RE.match(lines[j]):
                    break
                detect_section_type(lines[j], state)  # allow section changes between headings
                j += 1

            if j < n and lines[j].lstrip().startswith('**Description**:'):
                desc_line = lines[j].strip()
                description = desc_line.split('**Description**:', 1)[1].strip()
                found_description = True
                j += 1
                # Capture subsequent description lines until blank line or Example header or next heading
                while j < n:
                    s = lines[j]
                    if s.strip() == '' or s.lstrip().startswith('**Example**:') or HEADING_ITEM_RE.match(s):
                        break
                    description += ('\n' + s.rstrip())
                    j += 1

            # Find example block
            while j < n and not lines[j].lstrip().startswith('**Example**:'):
                if HEADING_ITEM_RE.match(lines[j]):
                    break
                j += 1

            if j < n and lines[j].lstrip().startswith('**Example**:'):
                j += 1
                # Skip blank lines before looking for fenced code block
                while j < n and lines[j].strip() == '':
                    j += 1
                # Expect fenced code block starting with ```
                if j < n and lines[j].strip().startswith('```'):
                    # Extract the fence type (e.g., "```" or "```python")
                    fence_line = lines[j].strip()
                    # For closing fence, we just need to match ```
                    fence = '```'
                    j += 1
                    code_lines = []
                    while j < n and not lines[j].strip().startswith('```'):
                        code_lines.append(lines[j].rstrip())
                        j += 1
                    # Skip closing fence
                    if j < n and lines[j].strip().startswith('```'):
                        j += 1
                    example = '\n'.join(code_lines).rstrip()

            # Only add entries that have a Description section. This filters out category headings like
            # "Mechanical", "Iteration", etc., which are organizational but not tokens.
            if found_description:
                # Set preferred type precedence: keyword > operator > builtin
                item_type = state['current_type']

                items.append({
                    'token': token_name,
                    'type': item_type,
                    'description': description.strip(),
                    'example': example.strip() if example else ''
                })

            # continue scanning from j (avoid re-parsing same content)
            i = j
            continue

        i += 1

    return items


def merge_items_with_precedence(items: List[Dict[str, Optional[str]]]) -> Dict[str, Dict[str, Optional[str]]]:
    precedence = { 'keyword': 3, 'operator': 2, 'builtin': 1 }
    merged: Dict[str, Dict[str, Optional[str]]] = {}
    for it in items:
        tok = it['token'] or ''
        if not tok:
            continue
        if tok not in merged:
            merged[tok] = it
            continue
        # Special case: False, None, True should be both keyword AND builtin
        # Keep them as keywords but also add builtin versions
        if tok in ('False', 'None', 'True') and it['type'] == 'builtin' and merged[tok]['type'] == 'keyword':
            # Keep the keyword version, but we'll add a separate builtin entry later
            continue
        elif tok in ('False', 'None', 'True') and it['type'] == 'keyword' and merged[tok]['type'] == 'builtin':
            # Replace builtin with keyword (higher precedence)
            merged[tok] = it
            continue
        # Choose by precedence; keep richer description/example if replacing with same precedence
        if precedence.get(it['type'], 0) > precedence.get(merged[tok]['type'], 0):
            merged[tok] = it
        elif precedence.get(it['type'], 0) == precedence.get(merged[tok]['type'], 0):
            # Prefer longer description / example
            if len((it.get('description') or '')) > len((merged[tok].get('description') or '')):
                merged[tok]['description'] = it.get('description')
            if len((it.get('example') or '')) > len((merged[tok].get('example') or '')):
                merged[tok]['example'] = it.get('example')
    
    # Add builtin versions of False, None, True if they exist as keywords
    builtin_versions = []
    for it in items:
        tok = it['token'] or ''
        if tok in ('False', 'None', 'True') and it['type'] == 'builtin':
            builtin_versions.append(it)
    
    # Add separate builtin entries with modified token names to avoid conflicts
    for builtin_item in builtin_versions:
        tok = builtin_item['token']
        if tok in merged and merged[tok]['type'] == 'keyword':
            # Add as separate builtin entry
            builtin_key = f"{tok}_builtin"
            merged[builtin_key] = {
                'token': tok,  # Keep original token name
                'type': 'builtin',
                'description': builtin_item.get('description', ''),
                'example': builtin_item.get('example', '')
            }
    
    return merged


def to_built_in_definitions_js(merged: Dict[str, Dict[str, Optional[str]]]) -> str:
    # Create a flat list suitable for module.exports = [ ... ]
    arr = []
    for token in sorted(merged.keys(), key=lambda s: s.lower()):
        it = merged[token]
        arr.append({
            'token': token,
            'type': it.get('type') or '',
            'description': it.get('description') or '',
            'example': it.get('example') or ''
        })

    # Build JS with proper escaping
    lines: List[str] = []
    lines.append("// Auto-generated from Python_Dictionary.md. Do not edit manually.")
    lines.append("module.exports = [")
    for i, obj in enumerate(arr):
        comma = ',' if i < len(arr) - 1 else ''
        lines.append(
            "  { token: '%s', type: '%s', description: '%s'%s }%s" % (
                js_escape(obj['token']),
                js_escape(obj['type']),
                js_escape(obj['description']),
                (", example: '%s'" % js_escape(obj['example'])) if obj['example'] else '',
                comma)
        )
    lines.append("];")
    lines.append("")
    return '\n'.join(lines)


def to_python_dictionary_js(merged_items: Dict[str, Dict[str, Optional[str]]]) -> str:
    # Group by type for sections
    sections: List[Tuple[str, str]] = [
        ('Keywords', 'keyword'),
        ('Builtins', 'builtin'),
        ('Operators & Delimiters', 'operator')
    ]
    lines: List[str] = []
    lines.append("// Auto-generated from Python_Dictionary.md. Do not edit manually.")
    lines.append("module.exports = {")
    lines.append("  title: 'Python Language Reference',")
    lines.append("  sections: [")

    for si, (title, typ) in enumerate(sections):
        lines.append("    {")
        lines.append("      title: '%s'," % js_escape(title))
        lines.append("      items: [")
        section_items = [it for it in merged_items.values() if (it.get('type') == typ)]
        section_items.sort(key=lambda x: (x.get('token') or '').lower())
        for ii, it in enumerate(section_items):
            comma = ',' if ii < len(section_items) - 1 else ''
            lines.append(
                "        { token: '%s', type: '%s', description: '%s'%s }%s" % (
                    js_escape(it.get('token') or ''),
                    js_escape(it.get('type') or ''),
                    js_escape(it.get('description') or ''),
                    (", example: '%s'" % js_escape(it.get('example') or '')) if (it.get('example')) else '',
                    comma)
            )
        lines.append("      ]")
        lines.append("    }%s" % (',' if si < len(sections) - 1 else ''))

    lines.append("  ]")
    lines.append("};")
    lines.append("")
    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(description='Generate JS dictionary files from Python_Dictionary.md')
    parser.add_argument('--source', default='Python_Dictionary.md', help='Path to Python_Dictionary.md')
    parser.add_argument('--out-dir', default='Example_Folder/python-token-analyzer', help='Directory to write JS outputs')
    parser.add_argument('--builtins-out', default='built-in-definitions.js', help='Output filename for built-in definitions')
    parser.add_argument('--dictionary-out', default='python-dictionary.js', help='Output filename for dictionary index')
    args = parser.parse_args()

    md = read_file(args.source)
    raw_items = parse_items(md)
    merged_map = merge_items_with_precedence(raw_items)

    # Prepare outputs
    os.makedirs(args.out_dir, exist_ok=True)
    builtins_path = os.path.join(args.out_dir, args.builtins_out)
    dictionary_path = os.path.join(args.out_dir, args.dictionary_out)

    builtins_js = to_built_in_definitions_js(merged_map)
    dictionary_js = to_python_dictionary_js(merged_map)

    with open(builtins_path, 'w', encoding='utf-8') as f:
        f.write(builtins_js)
    with open(dictionary_path, 'w', encoding='utf-8') as f:
        f.write(dictionary_js)

    print(f"Wrote {builtins_path}")
    print(f"Wrote {dictionary_path}")


if __name__ == '__main__':
    main()


