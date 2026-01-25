### 10.3.8 Introducers de Character Set

Um literal de string de caractere, literal hexadecimal ou literal de valor de bit pode ter um introducer de character set opcional e uma cláusula `COLLATE`, para designá-lo como uma string que utiliza um character set e collation específicos:

```sql
[_charset_name] literal [COLLATE collation_name]
```

A expressão `_charset_name` é formalmente chamada de *introducer*. Ela informa ao parser: “a string que se segue usa o character set *`charset_name`*.” Um introducer não altera a string para o character set do introducer como `CONVERT()` faria. Ele não altera o valor da string, embora possa ocorrer padding. O introducer é apenas um sinal.

Para literais de string de caractere, o espaço entre o introducer e a string é permitido, mas opcional.

Para literais de character set, um introducer indica o character set para a string subsequente, mas não altera como o parser executa o processamento de escape dentro da string. Os escapes são sempre interpretados pelo parser de acordo com o character set fornecido por `character_set_connection`. Para discussões e exemplos adicionais, consulte a Seção 10.3.6, “Character String Literal Character Set and Collation”.

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

Os introducers de character set e a cláusula `COLLATE` são implementados de acordo com as especificações padrão do SQL.

Literais de string de caractere podem ser designados como binary strings usando o introducer `_binary`. Literais hexadecimais e literais de valor de bit são binary strings por padrão, portanto, `_binary` é permitido, mas desnecessário.

O MySQL determina o character set e a collation de um literal de string de caractere, literal hexadecimal ou literal de valor de bit da seguinte maneira:

* Se ambos *`_charset_name`* e `COLLATE collation_name` forem especificados, o character set *`charset_name`* e a collation *`collation_name`* serão usados. *`collation_name`* deve ser uma collation permitida para *`charset_name`*.

* Se *`_charset_name`* for especificado, mas `COLLATE` não for especificado, o character set *`charset_name`* e sua collation padrão serão usados. Para ver a collation padrão de cada character set, use a instrução `SHOW CHARACTER SET` ou faça uma Query na tabela `CHARACTER_SETS` do `INFORMATION_SCHEMA`.

* Se *`_charset_name`* não for especificado, mas `COLLATE collation_name` for especificado:

  + Para um literal de string de caractere, são usados o character set padrão da conexão fornecido pela variável de sistema `character_set_connection` e a collation *`collation_name`*. *`collation_name`* deve ser uma collation permitida para o character set padrão da conexão.

  + Para um literal hexadecimal ou literal de valor de bit, a única collation permitida é `binary` porque esses tipos de literais são binary strings por padrão.

* Caso contrário (nem *`_charset_name`* nem `COLLATE collation_name` são especificados):

  + Para um literal de string de caractere, são usados o character set e a collation padrão da conexão fornecidos pelas variáveis de sistema `character_set_connection` e `collation_connection`.

  + Para um literal hexadecimal ou literal de valor de bit, o character set e a collation são `binary`.

Exemplos:

* Strings não-binary com character set `latin1` e collation `latin1_german1_ci`:

  ```sql
  SELECT _latin1'Müller' COLLATE latin1_german1_ci;
  SELECT _latin1 X'0A0D' COLLATE latin1_german1_ci;
  SELECT _latin1 b'0110' COLLATE latin1_german1_ci;
  ```

* Strings não-binary com character set `utf8` e sua collation padrão (ou seja, `utf8_general_ci`):

  ```sql
  SELECT _utf8'Müller';
  SELECT _utf8 X'0A0D';
  SELECT _utf8 b'0110';
  ```

* Binary strings com character set `binary` e sua collation padrão (ou seja, `binary`):

  ```sql
  SELECT _binary'Müller';
  SELECT X'0A0D';
  SELECT b'0110';
  ```

  O literal hexadecimal e o literal de valor de bit não precisam de introducer porque são binary strings por padrão.

* Uma string não-binary com o character set padrão da conexão e collation `utf8_general_ci` (falha se o character set da conexão não for `utf8`):

  ```sql
  SELECT 'Müller' COLLATE utf8_general_ci;
  ```

  Esta construção (somente `COLLATE`) não funciona para literais hexadecimais ou literais de bit porque seu character set é `binary`, independentemente do character set da conexão, e `binary` não é compatível com a collation `utf8_general_ci`. A única cláusula `COLLATE` permitida na ausência de um introducer é `COLLATE binary`.

* Uma string com o character set e a collation padrão da conexão:

  ```sql
  SELECT 'Müller';
  ```