### 10.3.6 Conjunto de caracteres literais de strings de caracteres e comparação

Cada literal de cadeia de caracteres tem um conjunto de caracteres e uma ordenação.

Para a simples declaração `SELECT 'string'`, a string tem o conjunto de caracteres padrão de conexão e a concordância definidos pelas variáveis de sistema `character_set_connection` e `collation_connection`.

Uma literal de cadeia de caracteres pode ter um introduzir de conjunto de caracteres opcional e uma cláusula `COLLATE`, para designá-la como uma cadeia de caracteres que usa um conjunto de caracteres e uma ordenação específicas:

```sql
[_charset_name]'string' [COLLATE collation_name]
```

A expressão `_charset_name` é formalmente chamada de *introduzir*. Ela informa ao analisador: “a string que segue usa o conjunto de caracteres *`charset_name`*”. Um introduzir não altera a string para o conjunto de caracteres do introduzir, como faria o `CONVERT()`. Ele não altera o valor da string, embora possa ocorrer preenchimento. O introduzir é apenas um sinal. Veja a Seção 10.3.8, “Introdutores de Conjunto de Caracteres”.

Exemplos:

```sql
SELECT 'abc';
SELECT _latin1'abc';
SELECT _binary'abc';
SELECT _utf8'abc' COLLATE utf8_danish_ci;
```

Os introdutores de conjuntos de caracteres e a cláusula `COLLATE` são implementados de acordo com as especificações padrão do SQL.

O MySQL determina o conjunto de caracteres e a ordenação de uma literal de string de caracteres da seguinte maneira:

- Se ambos os valores de *`_charset_name`* e `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a collation *`collation_name`* serão usados. *`collation_name`* deve ser uma collation permitida para *`charset_name`*.

- Se *`_charset_name`* for especificado, mas `COLLATE` não for especificado, o conjunto de caracteres *`charset_name`* e sua collation padrão serão usados. Para ver a collation padrão para cada conjunto de caracteres, use a instrução `SHOW CHARACTER SET` ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.

- Se o nome da *`_charset_name`* não for especificado, mas o nome da *`collation_name`* for especificado, o conjunto de caracteres padrão da conexão fornecido pela variável de sistema *`character_set_connection`* e a *`collation_name`* são usados. *`collation_name`* deve ser uma *collation* permitida para o conjunto de caracteres padrão da conexão.

- Caso contrário (nem `_charset_name` nem `COLLATE collation_name` sejam especificados), o conjunto de caracteres padrão da conexão e a collation padrão fornecidos pelas variáveis de sistema `character_set_connection` e `collation_connection` serão usados.

Exemplos:

- Uma cadeia não binária com o conjunto de caracteres `latin1` e a collation `latin1_german1_ci`:

  ```sql
  SELECT _latin1'Müller' COLLATE latin1_german1_ci;
  ```

- Uma cadeia não binária com o conjunto de caracteres `utf8` e sua collation padrão (ou seja, `utf8_general_ci`):

  ```sql
  SELECT _utf8'Müller';
  ```

- Uma string binária com o conjunto de caracteres `binary` e sua ordenação padrão (ou seja, `binary`):

  ```sql
  SELECT _binary'Müller';
  ```

- Uma cadeia não binária com o conjunto de caracteres padrão de conexão e a collation `utf8_general_ci` (falha se o conjunto de caracteres de conexão não for `utf8`):

  ```sql
  SELECT 'Müller' COLLATE utf8_general_ci;
  ```

- Uma cadeia com o conjunto de caracteres padrão de conexão e a concordância:

  ```sql
  SELECT 'Müller';
  ```

Um introducer indica o conjunto de caracteres para a string seguinte, mas não altera a forma como o analisador processa as escapamentos dentro da string. As escapamentos são sempre interpretados pelo analisador de acordo com o conjunto de caracteres fornecido por `character_set_connection`.

Os exemplos a seguir mostram que o processamento de escape ocorre usando `character_set_connection`, mesmo na presença de um introducer. Os exemplos usam `SET NAMES` (que altera `character_set_connection`, conforme discutido na Seção 10.4, “Character Sets e Colagens de Conexão”), e exibem as strings resultantes usando a função `HEX()`, para que o conteúdo exato das strings possa ser visto.

Exemplo 1:

```sql
mysql> SET NAMES latin1;
mysql> SELECT HEX('à\n'), HEX(_sjis'à\n');
+------------+-----------------+
| HEX('à\n')  | HEX(_sjis'à\n')  |
+------------+-----------------+
| E00A       | E00A            |
+------------+-----------------+
```

Aqui, `à` (valor hexadecimal `E0`) é seguido por `\n`, a sequência de escape para nova linha. A sequência de escape é interpretada usando o valor `character_set_connection` de `latin1` para produzir uma nova linha literal (valor hexadecimal `0A`). Isso acontece mesmo para a segunda string. Ou seja, o introducer `_sjis` não afeta o processamento de escape do analisador.

Exemplo 2:

```sql
mysql> SET NAMES sjis;
mysql> SELECT HEX('à\n'), HEX(_latin1'à\n');
+------------+-------------------+
| HEX('à\n')  | HEX(_latin1'à\n')  |
+------------+-------------------+
| E05C6E     | E05C6E            |
+------------+-------------------+
```

Aqui, `character_set_connection` é `sjis`, um conjunto de caracteres no qual a sequência de `à` seguida de `\` (valores hexadecimais `05` e `5C`) é um caractere multibyte válido. Portanto, os dois primeiros bytes da string são interpretados como um único caractere `sjis`, e o `\` não é interpretado como um caractere de escape. O `n` seguinte (valor hexadecimal `6E`) não é interpretado como parte de uma sequência de escape. Isso é verdade mesmo para a segunda string; o operador `_latin1` não afeta o processamento de escape.
