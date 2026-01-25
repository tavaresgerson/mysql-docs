### 10.9.1 O Character Set utf8mb4 (Codificação UTF-8 Unicode de 4 Bytes)

O character set `utf8mb4` possui estas características:

* Suporta caracteres BMP e suplementares.
* Requer um máximo de quatro bytes por caractere multibyte.

`utf8mb4` contrasta com o character set `utf8mb3`, que suporta apenas caracteres BMP e usa um máximo de três bytes por caractere:

* Para um caractere BMP, `utf8mb4` e `utf8mb3` têm características de armazenamento idênticas: mesmos valores de código, mesma Encoding, mesmo comprimento.

* Para um caractere suplementar, `utf8mb4` requer quatro bytes para armazená-lo, enquanto `utf8mb3` não consegue armazenar o caractere. Ao converter colunas `utf8mb3` para `utf8mb4`, você não precisa se preocupar em converter caracteres suplementares, pois não há nenhum.

`utf8mb4` é um superset de `utf8mb3`, então para uma operação como a seguinte concatenação, o resultado terá o character set `utf8mb4` e a Collation de `utf8mb4_col`:

```sql
SELECT CONCAT(utf8mb3_col, utf8mb4_col);
```

Da mesma forma, a seguinte comparação na cláusula `WHERE` funciona de acordo com a Collation de `utf8mb4_col`:

```sql
SELECT * FROM utf8mb3_tbl, utf8mb4_tbl
WHERE utf8mb3_tbl.utf8mb3_col = utf8mb4_tbl.utf8mb4_col;
```

Para obter informações sobre o armazenamento de tipos de dados conforme ele se relaciona a character sets multibyte, consulte String Type Storage Requirements.