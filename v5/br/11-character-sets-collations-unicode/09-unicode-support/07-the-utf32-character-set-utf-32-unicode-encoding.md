### 10.9.7 O conjunto de caracteres utf32 (codificação Unicode UTF-32)

O conjunto de caracteres `utf32` tem comprimento fixo (como `ucs2` e diferente de `utf16`). `utf32` usa 32 bits para cada caractere, diferente de `ucs2` (que usa 16 bits para cada caractere) e diferente de `utf16` (que usa 16 bits para alguns caracteres e 32 bits para outros).

`utf32` ocupa o dobro do espaço que `ucs2` e mais espaço que `utf16`, mas `utf32` tem a mesma vantagem que `ucs2`, que é previsível para armazenamento: o número de bytes necessários para `utf32` é igual ao número de caracteres vezes

4. Além disso, ao contrário do `utf16`, não há truques para codificação no `utf32`, então o valor armazenado é igual ao valor do código.

Para demonstrar como essa vantagem é útil, aqui está um exemplo que mostra como determinar um valor `utf8mb4` dado o valor do código `utf32`:

```sql
/* Assume code value = 100cc LINEAR B WHEELED CHARIOT */
CREATE TABLE tmp (utf32_col CHAR(1) CHARACTER SET utf32,
                  utf8mb4_col CHAR(1) CHARACTER SET utf8mb4);
INSERT INTO tmp VALUES (0x000100cc,NULL);
UPDATE tmp SET utf8mb4_col = utf32_col;
SELECT HEX(utf32_col),HEX(utf8mb4_col) FROM tmp;
```

O MySQL é muito tolerante em relação à adição de caracteres Unicode não atribuídos ou caracteres da área de uso privado. Na verdade, há apenas uma verificação de validade para `utf32`: nenhum valor de código pode ser maior que `0x10ffff`. Por exemplo, isso é ilegal:

```sql
INSERT INTO t (utf32_column) VALUES (0x110000); /* illegal */
```
