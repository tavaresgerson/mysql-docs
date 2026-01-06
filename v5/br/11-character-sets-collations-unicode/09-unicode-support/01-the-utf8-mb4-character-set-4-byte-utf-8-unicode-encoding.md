### 10.9.1 Conjunto de Caracteres utf8mb4 (Codificação Unicode UTF-8 de 4 bytes)

O conjunto de caracteres `utf8mb4` tem essas características:

- Suporta BMP e caracteres suplementares.
- Requer no máximo quatro bytes por caractere multibyte.

O conjunto de caracteres `utf8mb4` contrasta com o conjunto de caracteres `utf8mb3`, que suporta apenas caracteres BMP e utiliza no máximo três bytes por caractere:

- Para um caractere BMP, `utf8mb4` e `utf8mb3` têm características de armazenamento idênticas: os mesmos valores de código, mesma codificação, mesma extensão.

- Para um caractere suplementar, o `utf8mb4` requer quatro bytes para armazená-lo, enquanto o `utf8mb3` não consegue armazenar o caractere de forma alguma. Ao converter colunas `utf8mb3` para `utf8mb4`, você não precisa se preocupar em converter caracteres suplementares, pois não há nenhum.

`utf8mb4` é um superconjunto de `utf8mb3`, então, para uma operação como a concatenação a seguir, o resultado tem o conjunto de caracteres `utf8mb4` e a ordenação `utf8mb4_col`:

```sql
SELECT CONCAT(utf8mb3_col, utf8mb4_col);
```

Da mesma forma, a seguinte comparação na cláusula `WHERE` funciona de acordo com a collation de `utf8mb4_col`:

```sql
SELECT * FROM utf8mb3_tbl, utf8mb4_tbl
WHERE utf8mb3_tbl.utf8mb3_col = utf8mb4_tbl.utf8mb4_col;
```

Para obter informações sobre o armazenamento de tipos de dados relacionados a conjuntos de caracteres multibytes, consulte os requisitos de armazenamento do tipo de string.
