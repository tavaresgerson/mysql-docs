### 12.3.8 Introdutores de Conjunto de Caracteres

Uma literal de cadeia de caracteres, literal hexadecimal ou literal de valor de bits pode ter um introduto opcional de conjunto de caracteres e a cláusula `COLLATE`, para designá-la como uma cadeia de caracteres que usa um conjunto de caracteres específico e uma ordenação:

```
[_charset_name] literal [COLLATE collation_name]
```

A expressão `_charset_name` é formalmente chamada de *introduto*. Ela diz ao analisador, “a cadeia de caracteres que segue usa o conjunto de caracteres *`charset_name`*.” Um introduto não altera a cadeia de caracteres para o conjunto de caracteres do introduto, como o `CONVERT()` faria. Ele não altera o valor da cadeia de caracteres, embora possa ocorrer preenchimento. O introduto é apenas um sinal.

Para literais de cadeia de caracteres, o espaço entre o introduto e a cadeia de caracteres é permitido, mas opcional.

Para literais de conjunto de caracteres, um introduto indica o conjunto de caracteres para a cadeia de caracteres seguinte, mas não altera como o analisador realiza o processamento de escape dentro da cadeia de caracteres. Escape são sempre interpretados pelo analisador de acordo com o conjunto de caracteres dado por `character_set_connection`. Para discussões adicionais e exemplos, consulte a Seção 12.3.6, “Conjunto de Caracteres e Ordenação de Literais de Cadeia de Caracteres”.

Exemplos:

```
SELECT 'abc';
SELECT _latin1'abc';
SELECT _binary'abc';
SELECT _utf8mb4'abc' COLLATE utf8mb4_danish_ci;

SELECT _latin1 X'4D7953514C';
SELECT _utf8mb4 0x4D7953514C COLLATE utf8mb4_danish_ci;

SELECT _latin1 b'1000001';
SELECT _utf8mb4 0b1000001 COLLATE utf8mb4_danish_ci;
```

Os introdutos de conjunto de caracteres e a cláusula `COLLATE` são implementados de acordo com as especificações padrão do SQL.

Literais de cadeia de caracteres podem ser designados como strings binárias usando o introduto `_binary`. Literais hexadecimais e de valor de bits são strings binárias por padrão, então `_binary` é permitido, mas normalmente desnecessário. `_binary` pode ser útil para preservar um literal hexadecimal ou de bits como uma string binária em contextos para os quais o literal é tratado como um número. Por exemplo, operações de bits permitem argumentos de string numéricos ou binários no MySQL 8.4 e versões posteriores, mas tratam literais hexadecimais e de bits como números por padrão. Para especificar explicitamente o contexto de string binária para tais literais, use um introduto `_binary` para pelo menos um dos argumentos:

```
mysql> SET @v1 = X'000D' | X'0BC0';
mysql> SET @v2 = _binary X'000D' | X'0BC0';
mysql> SELECT HEX(@v1), HEX(@v2);
+----------+----------+
| HEX(@v1) | HEX(@v2) |
+----------+----------+
| BCD      | 0BCD     |
+----------+----------+
```

O resultado exibido parece semelhante para ambas as operações de bits, mas o resultado sem `_binary` é um valor `BIGINT`, enquanto o resultado com `_binary` é uma string binária. Devido à diferença nos tipos de resultado, os valores exibidos diferem: os dígitos de ordem superior 0 não são exibidos para o resultado numérico.

O MySQL determina o conjunto de caracteres e a collation de uma literal de string de caracteres, literal hexadecimal ou literal de valor de bit da seguinte maneira:

* Se ambos *`_charset_name`* e `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a collation *`collation_name`* serão usados. *`collation_name`* deve ser uma collation permitida para *`charset_name`*.
* Se *`_charset_name`* for especificado, mas `COLLATE` não for especificado, o conjunto de caracteres *`charset_name`* e sua collation padrão serão usados. Para ver a collation padrão para cada conjunto de caracteres, use a declaração `SHOW CHARACTER SET` ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.
* Se *`_charset_name`* não for especificado, mas `COLLATE collation_name` for especificado:

  + Para uma literal de string de caracteres, o conjunto de caracteres padrão da conexão fornecido pela variável de sistema `character_set_connection` e a collation *`collation_name`* serão usados. *`collation_name`* deve ser uma collation permitida para o conjunto de caracteres padrão da conexão.
  + Para uma literal hexadecimal ou literal de valor de bit, a única collation permitida é `binary`, porque esses tipos de literais são strings binárias por padrão.
* Caso contrário (nem *`_charset_name`* nem `COLLATE collation_name` forem especificados):

  + Para uma literal de string de caracteres, o conjunto de caracteres padrão da conexão e a collation fornecidos pelas variáveis de sistema `character_set_connection` e `collation_connection` serão usados.
  + Para uma literal hexadecimal ou literal de valor de bit, o conjunto de caracteres e a collation são `binary`.

Exemplos:

* Strings não binárias com conjunto de caracteres `latin1` e collation `latin1_german1_ci`:

* Strings não binárias com o conjunto de caracteres `utf8mb4` e sua collation padrão (ou seja, `utf8mb4_0900_ai_ci`):

  ```
  SELECT _latin1'Müller' COLLATE latin1_german1_ci;
  SELECT _latin1 X'0A0D' COLLATE latin1_german1_ci;
  SELECT _latin1 b'0110' COLLATE latin1_german1_ci;
  ```
* Strings binárias com o conjunto de caracteres `binary` e sua collation padrão (ou seja, `binary`):

  ```
  SELECT _utf8mb4'Müller';
  SELECT _utf8mb4 X'0A0D';
  SELECT _utf8mb4 b'0110';
  ```

  Os literais hexadecimais e de valor de bit não precisam de introdução porque são strings binárias por padrão.
* Uma string não binária com o conjunto de caracteres padrão de conexão e a collation `utf8mb4_0900_ai_ci` (falha se o conjunto de caracteres de conexão não for `utf8mb4`):

  ```
  SELECT _binary'Müller';
  SELECT X'0A0D';
  SELECT b'0110';
  ```

  Esta construção (`COLLATE` apenas) não funciona para literais hexadecimais ou literais de bit porque seu conjunto de caracteres é `binary` independentemente do conjunto de caracteres de conexão, e `binary` não é compatível com a collation `utf8mb4_0900_ai_ci`. A única cláusula `COLLATE` permitida na ausência de uma introdução é `COLLATE binary`.
* Uma string com o conjunto de caracteres padrão de conexão e collation:

  ```
  SELECT 'Müller' COLLATE utf8mb4_0900_ai_ci;
  ```