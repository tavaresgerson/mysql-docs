### 12.9.1 O Conjunto de Caracteres utf8mb4 (Codificação Unicode UTF-8 de 4 Bytes)

O conjunto de caracteres `utf8mb4` tem essas características:

* Suporta caracteres BMP e caracteres suplementares.
* Requer um máximo de quatro bytes por caractere multibyte.

`utf8mb4` contrasta com o conjunto de caracteres `utf8mb3`, que suporta apenas caracteres BMP e usa um máximo de três bytes por caractere:

* Para um caractere BMP, `utf8mb4` e `utf8mb3` têm características de armazenamento idênticas: mesmos valores de código, mesma codificação, mesma comprimento.

* Para um caractere suplementar, `utf8mb4` requer quatro bytes para armazená-lo, enquanto `utf8mb3` não pode armazenar o caractere de forma alguma. Ao converter colunas `utf8mb3` para `utf8mb4`, você não precisa se preocupar em converter caracteres suplementares, pois não há nenhum.

`utf8mb4` é um superconjunto de `utf8mb3`, então para uma operação como a concatenação a seguir, o resultado tem o conjunto de caracteres `utf8mb4` e a collation de `utf8mb4_col`:

```
SELECT CONCAT(utf8mb3_col, utf8mb4_col);
```

Da mesma forma, a seguinte comparação na cláusula `WHERE` funciona de acordo com a collation de `utf8mb4_col`:

```
SELECT * FROM utf8mb3_tbl, utf8mb4_tbl
WHERE utf8mb3_tbl.utf8mb3_col = utf8mb4_tbl.utf8mb4_col;
```

Para informações sobre o armazenamento do tipo de dados em relação aos conjuntos de caracteres multibyte, consulte Requisitos de Armazenamento do Tipo de Dados.