### 12.9.7 O Conjunto de Caracteres utf32 (Codificação Unicode UTF-32)

O conjunto de caracteres `utf32` tem comprimento fixo (como o `ucs2` e diferente do `utf16`). O `utf32` usa 32 bits para cada caractere, diferente do `ucs2` (que usa 16 bits para cada caractere) e diferente do `utf16` (que usa 16 bits para alguns caracteres e 32 bits para outros).

O `utf32` ocupa o dobro do espaço do `ucs2` e mais espaço do que o `utf16`, mas o `utf32` tem a mesma vantagem do `ucs2` de ser previsível para armazenamento: O número de bytes necessários para `utf32` é igual ao número de caracteres multiplicado por

4. Além disso, diferente do `utf16`, não há truques para codificação no `utf32`, então o valor armazenado é igual ao valor do código.

Para demonstrar como a última vantagem é útil, aqui está um exemplo que mostra como determinar um valor `utf8mb4` dado o valor do código `utf32`:

```
/* Assume code value = 100cc LINEAR B WHEELED CHARIOT */
CREATE TABLE tmp (utf32_col CHAR(1) CHARACTER SET utf32,
                  utf8mb4_col CHAR(1) CHARACTER SET utf8mb4);
INSERT INTO tmp VALUES (0x000100cc,NULL);
UPDATE tmp SET utf8mb4_col = utf32_col;
SELECT HEX(utf32_col),HEX(utf8mb4_col) FROM tmp;
```

O MySQL é muito indulgente com a adição de caracteres Unicode não atribuídos ou caracteres da área de uso privado. Na verdade, há apenas uma verificação de validade para `utf32`: Nenhum valor de código pode ser maior que `0x10ffff`. Por exemplo, isso é ilegal:

```
INSERT INTO t (utf32_column) VALUES (0x110000); /* illegal */
```