### 10.9.1 O Conjunto de Caracteres utf8mb4 (Codificação Unicode UTF-8 de 4 Bytes)

O conjunto de caracteres `utf8mb4` possui estas características:

* Suporta caracteres BMP e suplementares.
* Requer um máximo de quatro bytes por caractere multibyte.

O `utf8mb4` contrasta com o conjunto de caracteres `utf8mb3`, que suporta apenas caracteres BMP e usa um máximo de três bytes por caractere:

* Para um caractere BMP, `utf8mb4` e `utf8mb3` têm características de armazenamento idênticas: mesmos valores de código, mesma *encoding*, mesmo comprimento.

* Para um caractere suplementar, `utf8mb4` requer quatro bytes para armazená-lo, enquanto `utf8mb3` não pode armazenar o caractere. Ao converter colunas `utf8mb3` para `utf8mb4`, não é necessário preocupar-se com a conversão de caracteres suplementares, pois eles não existem.

O `utf8mb4` é um superconjunto do `utf8mb3`, portanto, para uma operação como a concatenação a seguir, o resultado tem o conjunto de caracteres `utf8mb4` e o *collation* de `utf8mb4_col`:

```sql
SELECT CONCAT(utf8mb3_col, utf8mb4_col);
```

Da mesma forma, a seguinte comparação na cláusula `WHERE` funciona de acordo com o *collation* de `utf8mb4_col`:

```sql
SELECT * FROM utf8mb3_tbl, utf8mb4_tbl
WHERE utf8mb3_tbl.utf8mb3_col = utf8mb4_tbl.utf8mb4_col;
```

Para obter informações sobre o armazenamento de tipos de dados conforme se relaciona com conjuntos de caracteres multibyte, consulte String Type Storage Requirements.