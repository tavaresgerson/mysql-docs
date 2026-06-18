### 12.10.8 O Conjunto de Caracteres Binário

O conjunto de caracteres `binary` é o conjunto de caracteres para strings binárias, que são sequências de bytes. O conjunto de caracteres `binary` tem uma collation, também chamada de `binary`. A comparação e ordenação são baseadas em valores numéricos de bytes, em vez de em valores de código de caracteres numéricos (que, para caracteres multibyte, diferem dos valores de bytes numéricos). Para obter informações sobre as diferenças entre a collation `binary` do conjunto de caracteres `binary` e as collation `_bin` dos conjuntos de caracteres não binários, consulte a Seção 12.8.5, “A collation binária comparada às collation \_bin”.

Para o conjunto de caracteres `binary`, os conceitos de maiúsculas e equivalência de acentos não se aplicam:

- Para caracteres de único byte armazenados como strings binárias, os limites de caracteres e bytes são os mesmos, portanto, as diferenças de maiúsculas e acentos são significativas em comparações. Isso significa que a ordenação `binary` é sensível à maiúscula e ao acento.

  ```
  mysql> SET NAMES 'binary';
  mysql> SELECT CHARSET('abc'), COLLATION('abc');
  +----------------+------------------+
  | CHARSET('abc') | COLLATION('abc') |
  +----------------+------------------+
  | binary         | binary           |
  +----------------+------------------+
  mysql> SELECT 'abc' = 'ABC', 'a' = 'ä';
  +---------------+------------+
  | 'abc' = 'ABC' | 'a' = 'ä'  |
  +---------------+------------+
  |             0 |          0 |
  +---------------+------------+
  ```

- Para caracteres multibyte armazenados como strings binárias, os limites de caracteres e bytes diferem. Os limites de caracteres são perdidos, portanto, as comparações que dependem deles não têm significado.

Para realizar a conversão de maiúsculas e minúsculas de uma string binária, primeiro converta-a em uma string não binária usando um conjunto de caracteres apropriado para os dados armazenados na string:

```
mysql> SET @str = BINARY 'New York';
mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING utf8mb4));
+-------------+------------------------------------+
| LOWER(@str) | LOWER(CONVERT(@str USING utf8mb4)) |
+-------------+------------------------------------+
| New York    | new york                           |
+-------------+------------------------------------+
```

Para converter uma expressão de cadeia em uma string binária, esses construtores são equivalentes:

```
BINARY expr
CAST(expr AS BINARY)
CONVERT(expr USING BINARY)
```

Se um valor for uma literal de string de caracteres, o `_binary` introducer pode ser usado para designá-lo como uma string binária. Por exemplo:

```
_binary 'a'
```

O introducer `_binary` é permitido para literais hexadecimais e literais de valor de bit também, mas é desnecessário; tais literais são cadeias binárias por padrão.

Para obter mais informações sobre introdutores, consulte a Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

Nota

No cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando do MySQL”.
