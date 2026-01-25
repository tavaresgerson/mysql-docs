### 10.10.8 O Conjunto de Caracteres Binary

O `binary` character set é o conjunto de caracteres para binary strings, que são sequências de bytes. O `binary` character set possui um único collation, também chamado `binary`. A comparação e a ordenação são baseadas em valores numéricos de byte, em vez de valores numéricos de código de caractere (os quais, para caracteres multibyte, diferem dos valores numéricos de byte). Para informações sobre as diferenças entre o collation `binary` do character set `binary` e os collations `_bin` de character sets não binários, consulte a Seção 10.8.5, “O Collation binary Comparado aos Collations _bin”.

Para o `binary` character set, os conceitos de equivalência de maiúsculas/minúsculas (lettercase) e acentuação (accent) não se aplicam:

* Para caracteres de byte único armazenados como binary strings, os limites de caractere e byte são os mesmos, portanto, as diferenças de maiúsculas/minúsculas e acentuação são significativas nas comparações. Ou seja, o collation `binary` é case-sensitive e accent-sensitive.

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

* Para caracteres multibyte armazenados como binary strings, os limites de caractere e byte diferem. Os limites de caractere são perdidos, de modo que as comparações que dependem deles não são significativas.

Para realizar a conversão de maiúsculas/minúsculas (lettercase) de uma binary string, primeiro converta-a para uma string não binária usando um character set apropriado para os dados armazenados na string:

```sql
mysql> SET @str = BINARY 'New York';
mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING utf8mb4));
+-------------+------------------------------------+
| LOWER(@str) | LOWER(CONVERT(@str USING utf8mb4)) |
+-------------+------------------------------------+
| New York    | new york                           |
+-------------+------------------------------------+
```

Para converter uma string expression em uma binary string, estas construções são equivalentes:

```sql
BINARY expr
CAST(expr AS BINARY)
CONVERT(expr USING BINARY)
```

Se um valor for um literal de string de caractere, o introducer `_binary` pode ser usado para designá-lo como uma binary string. Por exemplo:

```sql
_binary 'a'
```

O introducer `_binary` também é permitido para literais hexadecimais e literais de valor de bit, mas é desnecessário; tais literais são binary strings por padrão.

Para mais informações sobre introducers, consulte a Seção 10.3.8, “Character Set Introducers”.

Nota

Dentro do cliente **mysql**, binary strings são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O Cliente de Linha de Comando MySQL”.