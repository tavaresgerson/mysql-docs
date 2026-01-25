### 10.9.7 O Character Set utf32 (Codificação Unicode UTF-32)

O Character Set `utf32` tem comprimento fixo (como `ucs2` e diferente de `utf16`). `utf32` usa 32 bits para cada caractere, diferentemente de `ucs2` (que usa 16 bits para cada caractere), e diferentemente de `utf16` (que usa 16 bits para alguns caracteres e 32 bits para outros).

`utf32` ocupa o dobro do espaço de `ucs2` e mais espaço que `utf16`, mas `utf32` possui a mesma vantagem que `ucs2`: é previsível para armazenamento. O número necessário de bytes para `utf32` é igual ao número de caracteres multiplicado por 4. Além disso, diferentemente de `utf16`, não há "truques" (tricks) para codificação em `utf32`, então o valor armazenado é igual ao Code Value.

Para demonstrar como esta última vantagem é útil, aqui está um exemplo que mostra como determinar um valor `utf8mb4` dado o Code Value `utf32`:

```sql
/* Assume code value = 100cc LINEAR B WHEELED CHARIOT */
CREATE TABLE tmp (utf32_col CHAR(1) CHARACTER SET utf32,
                  utf8mb4_col CHAR(1) CHARACTER SET utf8mb4);
INSERT INTO tmp VALUES (0x000100cc,NULL);
UPDATE tmp SET utf8mb4_col = utf32_col;
SELECT HEX(utf32_col),HEX(utf8mb4_col) FROM tmp;
```

O MySQL é bastante tolerante em relação à adição de caracteres Unicode não atribuídos ou caracteres da área de uso privado (`private-use-area characters`). Na verdade, existe apenas uma verificação de validade para `utf32`: Nenhum Code Value pode ser maior que `0x10ffff`. Por exemplo, isto é ilegal:

```sql
INSERT INTO t (utf32_column) VALUES (0x110000); /* illegal */
```