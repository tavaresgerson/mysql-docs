### 12.3.6 Conjunto de Caracteres Literal de String e Cotação

Cada literal de string de caracteres tem um conjunto de caracteres e uma cotação.

Para a declaração simples `SELECT 'string'`, a string tem o conjunto de caracteres padrão de conexão e a cotação definidos pelas variáveis de sistema `character_set_connection` e `collation_connection`.

Um literal de string de caracteres pode ter um introduzir opcional de conjunto de caracteres e a cláusula `COLLATE`, para designá-lo como uma string que usa um conjunto de caracteres e uma cotação particulares:

```
[_charset_name]'string' [COLLATE collation_name]
```

A expressão `_charset_name` é formalmente chamada de *introduzir*. Ela diz ao analisador: “a string que segue usa o conjunto de caracteres *`charset_name`*”. Um introduzir não altera a string para o conjunto de caracteres do introduzir como faria o `CONVERT()`. Não altera o valor da string, embora possa ocorrer preenchimento. O introduzir é apenas um sinal. Veja a Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

Exemplos:

```
SELECT 'abc';
SELECT _latin1'abc';
SELECT _binary'abc';
SELECT _utf8mb4'abc' COLLATE utf8mb4_danish_ci;
```

Os introdutores de conjunto de caracteres e a cláusula `COLLATE` são implementados de acordo com as especificações padrão do SQL.

O MySQL determina o conjunto de caracteres e a cotação de uma literal de string de caracteres da seguinte maneira:

* Se ambos *`_charset_name`* e `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a collation *`collation_name`* serão usados. *`collation_name`* deve ser uma collation permitida para *`charset_name`*.
* Se *`_charset_name`* for especificado, mas `COLLATE` não for especificado, o conjunto de caracteres *`charset_name`* e sua collation padrão serão usados. Para ver a collation padrão para cada conjunto de caracteres, use a instrução `SHOW CHARACTER SET` ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.
* Se *`_charset_name`* não for especificado, mas `COLLATE collation_name` for especificado, o conjunto de caracteres padrão da conexão fornecido pela variável de sistema `character_set_connection` e a collation *`collation_name`* serão usados. *`collation_name`* deve ser uma collation permitida para o conjunto de caracteres padrão da conexão.
* Caso contrário (nem *`_charset_name`* nem `COLLATE collation_name` forem especificados), o conjunto de caracteres padrão da conexão e a collation fornecidas pelas variáveis de sistema `character_set_connection` e `collation_connection` serão usadas.

Exemplos:

* Uma string não binária com o conjunto de caracteres `latin1` e a collation `latin1_german1_ci`:

  ```
  SELECT _latin1'Müller' COLLATE latin1_german1_ci;
  ```
* Uma string não binária com o conjunto de caracteres `utf8mb4` e sua collation padrão (ou seja, `utf8mb4_0900_ai_ci`):

  ```
  SELECT _utf8mb4'Müller';
  ```
* Uma string binária com o conjunto de caracteres `binary` e sua collation padrão (ou seja, `binary`):

  ```
  SELECT _binary'Müller';
  ```
* Uma string não binária com o conjunto de caracteres padrão da conexão e a collation `utf8mb4_0900_ai_ci` (falha se o conjunto de caracteres da conexão não for `utf8mb4`):

  ```
  SELECT 'Müller' COLLATE utf8mb4_0900_ai_ci;
  ```
* Uma string com o conjunto de caracteres padrão da conexão e a collation:

  ```
  SELECT 'Müller';
  ```

Um introduzir indica o conjunto de caracteres para a string seguinte, mas não altera a forma como o analisador processa escapamentos dentro da string. Os escapamentos são sempre interpretados pelo analisador de acordo com o conjunto de caracteres fornecido por `character_set_connection`.

Os exemplos seguintes mostram que o processamento de escape ocorre usando `character_set_connection`, mesmo na presença de um introduzir. Os exemplos usam `SET NAMES` (que altera `character_set_connection`, conforme discutido na Seção 12.4, “Conjunto de caracteres de conexão e colagens”), e exibem as strings resultantes usando a função `HEX()`, para que o conteúdo exato das strings possa ser visto.

Exemplo 1:

```
mysql> SET NAMES latin1;
mysql> SELECT HEX('à\n'), HEX(_sjis'à\n');
+------------+-----------------+
| HEX('à\n')  | HEX(_sjis'à\n')  |
+------------+-----------------+
| E00A       | E00A            |
+------------+-----------------+
```

Aqui, `à` (valor hexadecimal `E0`) é seguido por `\n`, a sequência de escape para nova linha. A sequência de escape é interpretada usando o valor de `character_set_connection` de `latin1` para produzir uma nova linha literal (valor hexadecimal `0A`). Isso acontece mesmo para a segunda string. Ou seja, o introduzir `_sjis` não afeta o processamento de escape do analisador.

Exemplo 2:

```
mysql> SET NAMES sjis;
mysql> SELECT HEX('à\n'), HEX(_latin1'à\n');
+------------+-------------------+
| HEX('à\n')  | HEX(_latin1'à\n')  |
+------------+-------------------+
| E05C6E     | E05C6E            |
+------------+-------------------+
```

Aqui, `character_set_connection` é `sjis`, um conjunto de caracteres no qual a sequência de `à` seguida de `\` (valores hexadecimais `05` e `5C`) é um caractere multibyte válido. Portanto, os dois primeiros bytes da string são interpretados como um único caractere `sjis`, e o `\` não é interpretado como um caractere de escape. O `n` seguinte (valor hexadecimal `6E`) não é interpretado como parte de uma sequência de escape. Isso é verdade mesmo para a segunda string; o introduzir `_latin1` não afeta o processamento de escape.