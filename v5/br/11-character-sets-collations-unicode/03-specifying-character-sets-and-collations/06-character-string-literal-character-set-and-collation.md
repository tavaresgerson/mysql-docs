### 10.3.6 Character Set e Collation de Literals de String de Caracteres

Todo literal de string de caracteres tem um character set e uma collation.

Para o comando simples `SELECT 'string'`, a string tem o character set e a collation padrão da conexão, definidos pelas variáveis de sistema `character_set_connection` e `collation_connection`.

Um literal de string de caracteres pode ter um *introducer* opcional de character set e uma cláusula `COLLATE`, para designá-lo como uma string que usa um character set e uma collation específicos:

```sql
[_charset_name]'string' [COLLATE collation_name]
```

A expressão `_charset_name` é formalmente chamada de *introducer*. Ela informa ao parser: “a string que se segue usa o character set *`charset_name`*.” Um introducer não altera a string para o character set do introducer, como `CONVERT()` faria. Ele não altera o valor da string, embora possa ocorrer padding. O introducer é apenas um sinal. Consulte a Seção 10.3.8, “Character Set Introducers”.

Exemplos:

```sql
SELECT 'abc';
SELECT _latin1'abc';
SELECT _binary'abc';
SELECT _utf8'abc' COLLATE utf8_danish_ci;
```

Character set introducers e a cláusula `COLLATE` são implementados de acordo com as especificações SQL padrão.

O MySQL determina o character set e a collation de um literal de string de caracteres da seguinte maneira:

* Se ambos, *`_charset_name`* e `COLLATE collation_name`, forem especificados, o character set *`charset_name`* e a collation *`collation_name`* são usados. *`collation_name`* deve ser uma collation permitida para *`charset_name`*.

* Se *`_charset_name`* for especificado, mas `COLLATE` não for, o character set *`charset_name`* e sua collation padrão são usados. Para ver a collation padrão de cada character set, use o comando `SHOW CHARACTER SET` ou faça uma Query na tabela `CHARACTER_SETS` do `INFORMATION_SCHEMA`.

* Se *`_charset_name`* não for especificado, mas `COLLATE collation_name` for especificado, o character set padrão da conexão fornecido pela variável de sistema `character_set_connection` e a collation *`collation_name`* são usados. *`collation_name`* deve ser uma collation permitida para o character set padrão da conexão.

* Caso contrário (nem *`_charset_name`* nem `COLLATE collation_name` é especificado), o character set e a collation padrão da conexão fornecidos pelas variáveis de sistema `character_set_connection` e `collation_connection` são usados.

Exemplos:

* Uma string não binária com character set `latin1` e collation `latin1_german1_ci`:

  ```sql
  SELECT _latin1'Müller' COLLATE latin1_german1_ci;
  ```

* Uma string não binária com character set `utf8` e sua collation padrão (ou seja, `utf8_general_ci`):

  ```sql
  SELECT _utf8'Müller';
  ```

* Uma string binária com character set `binary` e sua collation padrão (ou seja, `binary`):

  ```sql
  SELECT _binary'Müller';
  ```

* Uma string não binária com o character set padrão da conexão e collation `utf8_general_ci` (falha se o character set da conexão não for `utf8`):

  ```sql
  SELECT 'Müller' COLLATE utf8_general_ci;
  ```

* Uma string com o character set e a collation padrão da conexão:

  ```sql
  SELECT 'Müller';
  ```

Um introducer indica o character set para a string seguinte, mas não altera a forma como o parser executa o processamento de escape dentro da string. Os escapes são sempre interpretados pelo parser de acordo com o character set fornecido por `character_set_connection`.

Os exemplos a seguir mostram que o processamento de escape ocorre usando `character_set_connection` mesmo na presença de um introducer. Os exemplos usam `SET NAMES` (que altera `character_set_connection`, conforme discutido na Seção 10.4, “Connection Character Sets e Collations”), e exibem as strings resultantes usando a função `HEX()` para que o conteúdo exato da string possa ser visualizado.

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

Aqui, `à` (valor hexadecimal `E0`) é seguido por `\n`, a sequência de escape para newline. A sequência de escape é interpretada usando o valor `latin1` de `character_set_connection` para produzir um newline literal (valor hexadecimal `0A`). Isso ocorre mesmo para a segunda string. Ou seja, o introducer `_sjis` não afeta o processamento de escape do parser.

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

Aqui, `character_set_connection` é `sjis`, um character set no qual a sequência de `à` seguida por `\` (valores hexadecimais `05` e `5C`) é um caractere multibyte válido. Consequentemente, os dois primeiros bytes da string são interpretados como um único caractere `sjis`, e o `\` não é interpretado como um caractere de escape. O `n` seguinte (valor hexadecimal `6E`) não é interpretado como parte de uma sequência de escape. Isso é verdade mesmo para a segunda string; o introducer `_latin1` não afeta o processamento de escape.