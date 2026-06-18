### 12.3.8 Introdutores de Conjunto de Caracteres

Uma literal de cadeia de caracteres, literal hexadecimal ou literal de valor de bit pode ter um introducer de conjunto de caracteres opcional e a cláusula `COLLATE` para designá-la como uma cadeia de caracteres que usa um conjunto de caracteres e uma ordenação específicos:

```
[_charset_name] literal [COLLATE collation_name]
```

A expressão `_charset_name` é formalmente chamada de *introduzir*. Ela informa ao analisador: “a string que segue usa o conjunto de caracteres `charset_name`”. Um introduzir não altera a string para o conjunto de caracteres do introduzir, como o `CONVERT()` faria. Não altera o valor da string, embora possa ocorrer preenchimento. O introduzir é apenas um sinal.

Para as cadeias de caracteres literais, o espaço entre o introduzir e a string é permitido, mas opcional.

Para literais de conjuntos de caracteres, um introduzir indica o conjunto de caracteres para a string seguinte, mas não altera a forma como o analisador processa as escapas dentro da string. As escapas são sempre interpretadas pelo analisador de acordo com o conjunto de caracteres fornecido por `character_set_connection`. Para discussões e exemplos adicionais, consulte a Seção 12.3.6, “Conjunto de caracteres de literais de strings de caracteres e cotação”.

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

Os introdutores de conjuntos de caracteres e a cláusula `COLLATE` são implementados de acordo com as especificações padrão do SQL.

As cadeias de caracteres literais podem ser designadas como strings binárias usando o introduzir `_binary`. As literais hexadecimais e de valor de bit são strings binárias por padrão, então `_binary` é permitido, mas normalmente desnecessário. `_binary` pode ser útil para preservar uma literal hexadecimal ou de bit como uma string binária em contextos para os quais a literal é tratada como um número. Por exemplo, as operações de bit permitem argumentos de string numérica ou binária no MySQL 8.0 e versões posteriores, mas tratam literais hexadecimais e de bit como números por padrão. Para especificar explicitamente o contexto de string binária para tais literais, use um introduzir `_binary` para pelo menos um dos argumentos:

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

O resultado exibido parece semelhante para ambas as operações de bits, mas o resultado sem `_binary` é um valor `BIGINT`, enquanto o resultado com `_binary` é uma string binária. Devido à diferença nos tipos de resultados, os valores exibidos diferem: os dígitos de ordem superior 0 não são exibidos para o resultado numérico.

O MySQL determina o conjunto de caracteres e a ordenação de uma literal de string de caracteres, uma literal hexadecimal ou uma literal de valor de bit da seguinte maneira:

- Se ambos `_charset_name` e `COLLATE collation_name` forem especificados, o conjunto de caracteres `charset_name` e a ordenação `collation_name` serão utilizados. `collation_name` deve ser uma ordenação permitida para `charset_name`.

- Se `_charset_name` for especificado, mas `COLLATE` não for especificado, o conjunto de caracteres `charset_name` e sua collation padrão serão usados. Para ver a collation padrão para cada conjunto de caracteres, use a instrução `SHOW CHARACTER SET` ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.

- Se `_charset_name` não for especificado, mas `COLLATE collation_name` for especificado:

  - Para uma literal de cadeia de caracteres, o conjunto de caracteres padrão de conexão fornecido pela variável de sistema `character_set_connection` e a collation `collation_name` são usados. `collation_name` deve ser uma collation permitida para o conjunto de caracteres padrão de conexão.

  - Para uma literal hexadecimal ou literal de valor de bit, a única collation permitida é `binary`, pois esses tipos de literais são strings binárias por padrão.

- Caso contrário (não seja especificado nem o `_charset_name` nem o `COLLATE collation_name`):

  - Para uma literal de cadeia de caracteres, o conjunto de caracteres padrão de conexão e a ordenação fornecidos pelas variáveis de sistema `character_set_connection` e `collation_connection` são usados.

  - Para um literal hexadecimal ou literal de valor de bit, o conjunto de caracteres e a ordenação são `binary`.

Exemplos:

- Cadeias não binárias com conjunto de caracteres `latin1` e ordenação `latin1_german1_ci`:

  ```
  SELECT _latin1'Müller' COLLATE latin1_german1_ci;
  SELECT _latin1 X'0A0D' COLLATE latin1_german1_ci;
  SELECT _latin1 b'0110' COLLATE latin1_german1_ci;
  ```

- Cadeias não binárias com o conjunto de caracteres `utf8mb4` e sua collation padrão (ou seja, `utf8mb4_0900_ai_ci`):

  ```
  SELECT _utf8mb4'Müller';
  SELECT _utf8mb4 X'0A0D';
  SELECT _utf8mb4 b'0110';
  ```

- Cadeias binárias com o conjunto de caracteres `binary` e sua collation padrão (ou seja, `binary`):

  ```
  SELECT _binary'Müller';
  SELECT X'0A0D';
  SELECT b'0110';
  ```

  Os literais hexadecimais e os literais de valor de bit não precisam de introdução, pois são cadeias binárias por padrão.

- Uma cadeia não binária com o conjunto de caracteres padrão de conexão e a collation `utf8mb4_0900_ai_ci` (falha se o conjunto de caracteres de conexão não for `utf8mb4`):

  ```
  SELECT 'Müller' COLLATE utf8mb4_0900_ai_ci;
  ```

  Esta construção (apenas `COLLATE`) não funciona para literais hexadecimais ou literais de bits porque seu conjunto de caracteres é `binary`, independentemente do conjunto de caracteres de conexão, e `binary` não é compatível com a ordenação `utf8mb4_0900_ai_ci`. A única cláusula `COLLATE` permitida na ausência de um introduzir é `COLLATE binary`.

- Uma cadeia com o conjunto de caracteres padrão de conexão e a concordância:

  ```
  SELECT 'Müller';
  ```
