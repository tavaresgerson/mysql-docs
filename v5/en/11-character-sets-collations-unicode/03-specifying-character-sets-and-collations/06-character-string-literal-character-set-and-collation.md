### 10.3.6 Character Set e Collation de String Literal de Caracteres

Todo literal de string de caracteres tem um Character Set e uma Collation.

Para a instrução simples `SELECT 'string'`, a string tem o Character Set padrão da conexão e a Collation definidos pelas System Variables `character_set_connection` e `collation_connection`.

Um literal de string de caracteres pode ter um *introducer* opcional de Character Set e uma cláusula `COLLATE`, para designá-lo como uma string que utiliza um Character Set e uma Collation específicos:

```sql
[_charset_name]'string' [COLLATE collation_name]
```

A expressão `_charset_name` é formalmente chamada de *introducer*. Ele informa ao Parser: “a string que segue usa o Character Set *`charset_name`*.” Um introducer não altera a string para o Character Set do introducer como faria a função `CONVERT()`. Ele não altera o valor da string, embora possa ocorrer padding. O introducer é apenas um sinal. Veja a Seção 10.3.8, “Character Set Introducers”.

Exemplos:

```sql
SELECT 'abc';
SELECT _latin1'abc';
SELECT _binary'abc';
SELECT _utf8'abc' COLLATE utf8_danish_ci;
```

Os *introducers* de Character Set e a cláusula `COLLATE` são implementados de acordo com as especificações SQL padrão.

O MySQL determina o Character Set e a Collation de um literal de string de caracteres da seguinte maneira:

* Se ambos *`_charset_name`* e `COLLATE collation_name` forem especificados, o Character Set *`charset_name`* e a Collation *`collation_name`* são usados. *`collation_name`* deve ser uma Collation permitida para *`charset_name`*.

* Se *`_charset_name`* for especificado, mas `COLLATE` não for especificado, o Character Set *`charset_name`* e sua Collation padrão são usados. Para ver a Collation padrão para cada Character Set, use a instrução `SHOW CHARACTER SET` ou faça uma Query na tabela `CHARACTER_SETS` do `INFORMATION_SCHEMA`.

* Se *`_charset_name`* não for especificado, mas `COLLATE collation_name` for especificado, são usados o Character Set padrão da conexão fornecido pela System Variable `character_set_connection` e a Collation *`collation_name`*. *`collation_name`* deve ser uma Collation permitida para o Character Set padrão da conexão.

* Caso contrário (nem *`_charset_name`* nem `COLLATE collation_name` é especificado), o Character Set e a Collation padrão da conexão fornecidos pelas System Variables `character_set_connection` e `collation_connection` são usados.

Exemplos:

* Uma string não binária com Character Set `latin1` e Collation `latin1_german1_ci`:

  ```sql
  SELECT _latin1'Müller' COLLATE latin1_german1_ci;
  ```

* Uma string não binária com Character Set `utf8` e sua Collation padrão (ou seja, `utf8_general_ci`):

  ```sql
  SELECT _utf8'Müller';
  ```

* Uma string binária com Character Set `binary` e sua Collation padrão (ou seja, `binary`):

  ```sql
  SELECT _binary'Müller';
  ```

* Uma string não binária com o Character Set padrão da conexão e Collation `utf8_general_ci` (falha se o Character Set da conexão não for `utf8`):

  ```sql
  SELECT 'Müller' COLLATE utf8_general_ci;
  ```

* Uma string com o Character Set e a Collation padrão da conexão:

  ```sql
  SELECT 'Müller';
  ```

Um introducer indica o Character Set para a string seguinte, mas não altera a forma como o Parser executa o *escape processing* dentro da string. Os escapes são sempre interpretados pelo Parser de acordo com o Character Set fornecido por `character_set_connection`.

Os exemplos a seguir mostram que o *escape processing* ocorre usando `character_set_connection` mesmo na presença de um introducer. Os exemplos usam `SET NAMES` (que altera `character_set_connection`, conforme discutido na Seção 10.4, “Character Sets e Collations de Conexão”), e exibem as strings resultantes usando a função `HEX()` para que o conteúdo exato da string possa ser visto.

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

Aqui, `à` (valor hexadecimal `E0`) é seguido por `\n`, a sequência de escape para nova linha (newline). A sequência de escape é interpretada usando o valor `latin1` de `character_set_connection` para produzir uma nova linha literal (valor hexadecimal `0A`). Isso acontece mesmo para a segunda string. Ou seja, o introducer `_sjis` não afeta o *escape processing* do Parser.

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

Aqui, `character_set_connection` é `sjis`, um Character Set no qual a sequência de `à` seguida por `\` (valores hexadecimais `05` e `5C`) é um caractere multibyte válido. Portanto, os primeiros dois bytes da string são interpretados como um único caractere `sjis`, e o `\` não é interpretado como um caractere de escape. O `n` seguinte (valor hexadecimal `6E`) não é interpretado como parte de uma sequência de escape. Isso é verdade mesmo para a segunda string; o introducer `_latin1` não afeta o *escape processing*.