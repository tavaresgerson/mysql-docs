
with open('/home/tavares/Development/Traduções/mysql-docs/v5/br/13-functions-and-operators/08-string-functions-and-operators/02-regular-expressions.md', 'rb') as f:
    content = f.read()

print(f"File length: {len(content)}")

# Check line 1
line1_end = content.find(b'\n')
line1 = content[:line1_end]
print(f"Line 1 bytes: {line1}")
print(f"Line 1 string: {line1.decode('utf-8')}")

# Check line 3
lines = content.split(b'\n')
if len(lines) >= 3:
    print(f"Line 3 bytes: {lines[2]}")

# Check line 36
if len(lines) >= 36:
    print(f"Line 36 bytes: {lines[35]}")

# Check line 166
if len(lines) >= 166:
    print(f"Line 166 bytes: {lines[165]}")

# Check headers
for i, line in enumerate(lines):
    s_line = line.decode('utf-8', errors='ignore')
    if s_line.strip().startswith('#'):
        print(f"Header at line {i+1}: '{s_line}'")
