### 10.3.8 Introducers de Conjunto de Caracteres

Um literal de string de caracteres, literal hexadecimal ou literal de valor de bit pode ter um *introducer* de conjunto de caracteres opcional e uma cláusula `COLLATE`, para designá-lo como uma string que usa um *character set* e um *collation* específicos:

```sql
[_charset_name] literal [COLLATE collation_name]
```

A expressão `_charset_name` é formalmente chamada de *introducer*. Ela informa ao *parser*: "a string que se segue usa o *character set* *`charset_name`*." Um *introducer* não altera a string para o *character set* do *introducer*, como a função `CONVERT()` faria. Ele não altera o valor da string, embora possa ocorrer *padding*. O *introducer* é apenas um sinal.

Para literais de string de caracteres, o espaço entre o *introducer* e a string é permitido, mas opcional.

Para literais de conjunto de caracteres, um *introducer* indica o *character set* para a string seguinte, mas não altera a forma como o *parser* realiza o processamento de *escape* dentro da string. Os *escapes* são sempre interpretados pelo *parser* de acordo com o *character set* fornecido pela variável de sistema `character_set_connection`. Para discussões e exemplos adicionais, consulte a Seção 10.3.6, “Character String Literal Character Set and Collation”.

Exemplos:

```sql
SELECT 'abc';
SELECT _latin1'abc';
SELECT _binary'abc';
SELECT _utf8'abc' COLLATE utf8_danish_ci;

SELECT _latin1 X'4D7953514C';
SELECT _utf8 0x4D7953514C COLLATE utf8_danish_ci;

SELECT _latin1 b'1000001';
SELECT _utf8 0b1000001 COLLATE utf8_danish_ci;
```

Os *introducers* de *character set* e a cláusula `COLLATE` são implementados de acordo com as especificações padrão do SQL.

Literais de string de caracteres podem ser designados como strings binárias usando o *introducer* `_binary`. Literais hexadecimais e literais de valor de bit são strings binárias por padrão, então `_binary` é permitido, mas desnecessário.

O MySQL determina o *character set* e o *collation* de um literal de string de caracteres, literal hexadecimal ou literal de valor de bit da seguinte maneira:

* Se ambos *`_charset_name`* e `COLLATE collation_name` forem especificados, o *character set* *`charset_name`* e o *collation* *`collation_name`* são usados. *`collation_name`* deve ser um *collation* permitido para *`charset_name`*.

* Se *`_charset_name`* for especificado, mas `COLLATE` não for especificado, o *character set* *`charset_name`* e seu *collation* padrão são usados. Para ver o *collation* padrão para cada *character set*, use a instrução `SHOW CHARACTER SET` ou consulte a tabela `CHARACTER_SETS` do `INFORMATION_SCHEMA`.

* Se *`_charset_name`* não for especificado, mas `COLLATE collation_name` for especificado:

  + Para um literal de string de caracteres, são usados o *character set* padrão da conexão fornecido pela variável de sistema `character_set_connection` e o *collation* *`collation_name`*. *`collation_name`* deve ser um *collation* permitido para o *character set* padrão da conexão.

  + Para um literal hexadecimal ou literal de valor de bit, o único *collation* permitido é `binary`, pois esses tipos de literais são strings binárias por padrão.

* Caso contrário (nem *`_charset_name`* nem `COLLATE collation_name` é especificado):

  + Para um literal de string de caracteres, são usados o *character set* e o *collation* padrão da conexão, fornecidos pelas variáveis de sistema `character_set_connection` e `collation_connection`.

  + Para um literal hexadecimal ou literal de valor de bit, o *character set* e o *collation* são `binary`.

Exemplos:

* Strings não binárias com *character set* `latin1` e *collation* `latin1_german1_ci`:

  ```sql
  SELECT _latin1'Müller' COLLATE latin1_german1_ci;
  SELECT _latin1 X'0A0D' COLLATE latin1_german1_ci;
  SELECT _latin1 b'0110' COLLATE latin1_german1_ci;
  ```

* Strings não binárias com *character set* `utf8` e seu *collation* padrão (ou seja, `utf8_general_ci`):

  ```sql
  SELECT _utf8'Müller';
  SELECT _utf8 X'0A0D';
  SELECT _utf8 b'0110';
  ```

* Strings binárias com *character set* `binary` e seu *collation* padrão (ou seja, `binary`):

  ```sql
  SELECT _binary'Müller';
  SELECT X'0A0D';
  SELECT b'0110';
  ```

  O literal hexadecimal e o literal de valor de bit não precisam de um *introducer* porque são strings binárias por padrão.

* Uma string não binária com o *character set* padrão da conexão e *collation* `utf8_general_ci` (falha se o *character set* da conexão não for `utf8`):

  ```sql
  SELECT 'Müller' COLLATE utf8_general_ci;
  ```

  Essa construção (somente `COLLATE`) não funciona para literais hexadecimais ou literais de bit, pois o *character set* deles é `binary` independentemente do *character set* da conexão, e `binary` não é compatível com o *collation* `utf8_general_ci`. A única cláusula `COLLATE` permitida na ausência de um *introducer* é `COLLATE binary`.

* Uma string com o *character set* e *collation* padrão da conexão:

  ```sql
  SELECT 'Müller';
  ```