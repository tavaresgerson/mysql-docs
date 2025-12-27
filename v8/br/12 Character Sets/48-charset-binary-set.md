### 12.10.8 O Conjunto de Caracteres Binário

O conjunto de caracteres `binary` é o conjunto de caracteres para strings binárias, que são sequências de bytes. O conjunto de caracteres `binary` tem uma ordenação, também chamada `binary`. A comparação e ordenação são baseadas em valores numéricos de bytes, em vez de em valores de código de caracteres numéricos (que, para caracteres multibytes, diferem dos valores de byte numéricos). Para informações sobre as diferenças entre a ordenação `binary` do conjunto de caracteres `binary` e as ordenações `_bin` dos conjuntos de caracteres não binários, consulte  Seção 12.8.5, “A ordenação binária comparada às ordenações \_bin”.

Para o conjunto de caracteres `binary`, os conceitos de maiúscula e equivalência de acentos não se aplicam:

* Para caracteres de um byte armazenados como strings binárias, os limites de caracteres e bytes são os mesmos, então as diferenças de maiúscula e acentos são significativas nas comparações. Ou seja, a ordenação `binary` é sensível à maiúscula e ao acento.

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
* Para caracteres multibyte armazenados como strings binárias, os limites de caracteres e bytes diferem. Os limites de caracteres são perdidos, então as comparações que dependem deles não são significativas.

Para realizar a conversão de maiúscula de uma string binária, primeiro converta-a em uma string não binária usando um conjunto de caracteres apropriado para os dados armazenados na string:

```
mysql> SET @str = BINARY 'New York';
mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING utf8mb4));
+-------------+------------------------------------+
| LOWER(@str) | LOWER(CONVERT(@str USING utf8mb4)) |
+-------------+------------------------------------+
| New York    | new york                           |
+-------------+------------------------------------+
```

Para converter uma expressão de string em uma string binária, esses construtores são equivalentes:

```
BINARY expr
CAST(expr AS BINARY)
CONVERT(expr USING BINARY)
```

Se um valor for uma literal de string de caracteres, o introduzir `_binary` pode ser usado para designá-lo como uma string binária. Por exemplo:

```
_binary 'a'
```

O introduzir `_binary` também é permitido para literais hexadecimais e literais de valor de bits, mas é desnecessário; tais literais são strings binárias por padrão.

Para mais informações sobre introdutores, consulte Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

::: info Nota
Português (Brasil):

No cliente `mysql`, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando do MySQL”.