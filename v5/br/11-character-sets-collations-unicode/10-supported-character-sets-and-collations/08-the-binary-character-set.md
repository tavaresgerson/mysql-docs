### 10.10.8 O Conjunto de Caracteres `binary`

O conjunto de caracteres `binary` é o conjunto de caracteres para *strings* binárias, que são sequências de *bytes*. O conjunto de caracteres `binary` possui uma única *collation*, também denominada `binary`. A comparação e a ordenação são baseadas em valores numéricos de *byte*, em vez de valores numéricos de código de caractere (que, para caracteres *multibyte*, diferem dos valores numéricos de *byte*). Para obter informações sobre as diferenças entre a *collation* `binary` do conjunto de caracteres `binary` e as *collations* `_bin` de conjuntos de caracteres não binários, consulte a Seção 10.8.5, “A Collation `binary` Comparada às Collations `_bin`”.

Para o conjunto de caracteres `binary`, os conceitos de equivalência de maiúsculas/minúsculas (*lettercase*) e acentuação não se aplicam:

* Para caracteres de *single-byte* armazenados como *strings* binárias, os limites de caractere e de *byte* são os mesmos, portanto, as diferenças de maiúsculas/minúsculas e acentuação são significativas nas comparações. Ou seja, a *collation* `binary` é *case-sensitive* (sensível a maiúsculas/minúsculas) e *accent-sensitive* (sensível a acentuação).

  ```sql
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

* Para caracteres *multibyte* armazenados como *strings* binárias, os limites de caractere e de *byte* diferem. Os limites de caractere são perdidos, de modo que as comparações que dependem deles não são significativas.

Para realizar a conversão de maiúsculas/minúsculas (*lettercase*) de uma *string* binária, primeiro converta-a para uma *string* não binária usando um conjunto de caracteres apropriado para os dados armazenados na *string*:

```sql
mysql> SET @str = BINARY 'New York';
mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING utf8mb4));
+-------------+------------------------------------+
| LOWER(@str) | LOWER(CONVERT(@str USING utf8mb4)) |
+-------------+------------------------------------+
| New York    | new york                           |
+-------------+------------------------------------+
```

Para converter uma expressão de *string* para uma *string* binária, estas construções são equivalentes:

```sql
BINARY expr
CAST(expr AS BINARY)
CONVERT(expr USING BINARY)
```

Se um valor for um literal de *string* de caracteres, o introdutor `_binary` pode ser usado para designá-lo como uma *string* binária. Por exemplo:

```sql
_binary 'a'
```

O introdutor `_binary` é permitido para literais hexadecimais e literais de valor de *bit* também, mas é desnecessário; esses literais são *strings* binárias por padrão.

Para mais informações sobre introdutores, consulte a Seção 10.3.8, “Introdutores de Conjunto de Caracteres”.

Note

Dentro do cliente **mysql**, *strings* binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O Cliente de Linha de Comando MySQL”.