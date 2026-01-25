### 9.2.5 Análise e Resolução de Nomes de Funções

O MySQL suporta Funções built-in (nativas), Funções loadable (carregáveis) e Funções stored (armazenadas). Esta seção descreve como o servidor reconhece se o nome de uma Função built-in está sendo usado como uma chamada de Função ou como um Identifier (Identificador), e como o servidor determina qual Função usar nos casos em que Funções de diferentes tipos existem com um determinado nome.

* Análise de Nomes de Funções Built-In
* Resolução de Nomes de Funções

#### Análise de Nomes de Funções Built-In

O Parser usa regras padrão para a análise (parsing) de nomes de Funções built-in. Estas regras podem ser alteradas ativando o SQL mode `IGNORE_SPACE`.

Quando o Parser encontra uma palavra que é o nome de uma Função built-in, ele deve determinar se o nome significa uma chamada de Função ou se é, em vez disso, uma referência sem expressão (nonexpression reference) a um Identifier, como um nome de tabela ou coluna. Por exemplo, nas seguintes statements, a primeira referência a `count` é uma chamada de Função, enquanto a segunda referência é um nome de tabela:

```sql
SELECT COUNT(*) FROM mytable;
CREATE TABLE count (i INT);
```

O Parser deve reconhecer o nome de uma Função built-in como indicando uma chamada de Função apenas ao analisar o que se espera ser uma expression. Ou seja, em um Contexto sem expressão (nonexpression context), nomes de Funções são permitidos como Identifiers.

No entanto, algumas Funções built-in têm considerações especiais de análise ou implementação, então o Parser usa as seguintes regras por padrão para distinguir se seus nomes estão sendo usados como chamadas de Função ou como Identifiers em Contexto sem expressão:

* Para usar o nome como uma chamada de Função em uma expression, não deve haver espaço em branco entre o nome e o caractere de parêntese `(` seguinte.

* Inversamente, para usar o nome da Função como um Identifier, ele não deve ser seguido imediatamente por um parêntese.

A exigência de que as chamadas de Função sejam escritas sem espaço em branco entre o nome e o parêntese aplica-se apenas às Funções built-in que têm considerações especiais. `COUNT` é um desses nomes. O arquivo fonte `sql/lex.h` lista os nomes dessas Funções especiais para as quais o espaço em branco subsequente determina sua interpretação: nomes definidos pela macro `SYM_FN()` no array `symbols[]`.

A lista a seguir nomeia as Funções no MySQL 5.7 que são afetadas pela configuração `IGNORE_SPACE` e listadas como especiais no arquivo fonte `sql/lex.h`. Você pode achar mais fácil tratar a exigência de não haver espaço em branco como aplicável a todas as chamadas de Função.

* `ADDDATE`
* `BIT_AND`
* `BIT_OR`
* `BIT_XOR`
* `CAST`
* `COUNT`
* `CURDATE`
* `CURTIME`
* `DATE_ADD`
* `DATE_SUB`
* `EXTRACT`
* `GROUP_CONCAT`
* `MAX`
* `MID`
* `MIN`
* `NOW`
* `POSITION`
* `SESSION_USER`
* `STD`
* `STDDEV`
* `STDDEV_POP`
* `STDDEV_SAMP`
* `SUBDATE`
* `SUBSTR`
* `SUBSTRING`
* `SUM`
* `SYSDATE`
* `SYSTEM_USER`
* `TRIM`
* `VARIANCE`
* `VAR_POP`
* `VAR_SAMP`

Para Funções não listadas como especiais em `sql/lex.h`, o espaço em branco não importa. Elas são interpretadas como chamadas de Função apenas quando usadas em Contexto de expression e podem ser usadas livremente como Identifiers em outros casos. `ASCII` é um desses nomes. No entanto, para esses nomes de Funções não afetadas, a interpretação pode variar no Contexto de expression: `func_name ()` é interpretado como uma Função built-in se houver uma com o nome fornecido; caso contrário, `func_name ()` é interpretado como uma Função loadable ou stored se uma existir com esse nome.

O SQL mode `IGNORE_SPACE` pode ser usado para modificar como o Parser trata nomes de Funções que são sensíveis a espaço em branco:

* Com `IGNORE_SPACE` desabilitado, o Parser interpreta o nome como uma chamada de Função quando não há espaço em branco entre o nome e o parêntese seguinte. Isso ocorre mesmo quando o nome da Função é usado em Contexto sem expressão (nonexpression context):

  ```sql
  mysql> CREATE TABLE count(i INT);
  ERROR 1064 (42000): You have an error in your SQL syntax ...
  near 'count(i INT)'
  ```

  Para eliminar o erro e fazer com que o nome seja tratado como um Identifier, use espaço em branco após o nome ou escreva-o como um Identifier entre aspas (quoted identifier) (ou ambos):

  ```sql
  CREATE TABLE count (i INT);
  CREATE TABLE `count`(i INT);
  CREATE TABLE `count` (i INT);
  ```

* Com `IGNORE_SPACE` ativado, o Parser flexibiliza a exigência de que não haja espaço em branco entre o nome da Função e o parêntese seguinte. Isso proporciona mais flexibilidade na escrita de chamadas de Função. Por exemplo, qualquer uma das seguintes chamadas de Função é legal:

  ```sql
  SELECT COUNT(*) FROM mytable;
  SELECT COUNT (*) FROM mytable;
  ```

  No entanto, ativar `IGNORE_SPACE` também tem o efeito colateral de que o Parser trata os nomes de Funções afetadas como reserved words (palavras reservadas) (consulte Seção 9.3, “Keywords e Reserved Words”). Isso significa que um espaço após o nome não sinaliza mais seu uso como um Identifier. O nome pode ser usado em chamadas de Função com ou sem espaço em branco subsequente, mas causa um erro de syntax em Contexto sem expressão, a menos que seja colocado entre aspas (quoted). Por exemplo, com `IGNORE_SPACE` ativado, ambas as seguintes statements falham com um erro de syntax porque o Parser interpreta `count` como uma reserved word:

  ```sql
  CREATE TABLE count(i INT);
  CREATE TABLE count (i INT);
  ```

  Para usar o nome da Função em Contexto sem expressão, escreva-o como um Identifier entre aspas (quoted identifier):

  ```sql
  CREATE TABLE `count`(i INT);
  CREATE TABLE `count` (i INT);
  ```

Para ativar o SQL mode `IGNORE_SPACE`, use esta statement:

```sql
SET sql_mode = 'IGNORE_SPACE';
```

O `IGNORE_SPACE` também é ativado por outros modos compostos, como `ANSI`, que o incluem em seu valor:

```sql
SET sql_mode = 'ANSI';
```

Verifique a Seção 5.1.10, “Server SQL Modes”, para ver quais modos compostos ativam o `IGNORE_SPACE`.

Para minimizar a dependência do código SQL na configuração `IGNORE_SPACE`, use estas diretrizes:

* Evite criar Funções loadable ou Funções stored que tenham o mesmo nome de uma Função built-in.

* Evite usar nomes de Funções em Contexto sem expressão. Por exemplo, estas statements usam `count` (um dos nomes de Funções afetadas pelo `IGNORE_SPACE`), portanto, elas falham com ou sem espaço em branco após o nome se `IGNORE_SPACE` estiver ativado:

  ```sql
  CREATE TABLE count(i INT);
  CREATE TABLE count (i INT);
  ```

  Se você precisar usar um nome de Função em Contexto sem expressão, escreva-o como um Identifier entre aspas (quoted identifier):

  ```sql
  CREATE TABLE `count`(i INT);
  CREATE TABLE `count` (i INT);
  ```

#### Resolução de Nomes de Funções

As seguintes regras descrevem como o servidor resolve referências a nomes de Funções para a criação e invocação de Funções:

* Funções built-in e Funções loadable

  Um erro ocorre se você tentar criar uma Função loadable com o mesmo nome de uma Função built-in.

* Funções built-in e Funções stored

  É possível criar uma Função stored com o mesmo nome de uma Função built-in, mas para invocar a Função stored é necessário qualificá-la com um nome de schema. Por exemplo, se você criar uma Função stored chamada `PI` no schema `test`, invoque-a como `test.PI()` porque o servidor resolve `PI()` sem um qualificador como uma referência à Função built-in. O servidor gera um warning se o nome da Função stored colidir com um nome de Função built-in. O warning pode ser exibido com `SHOW WARNINGS`.

* Funções loadable e Funções stored

  Funções loadable e Funções stored compartilham o mesmo namespace, portanto, você não pode criar uma Função loadable e uma Função stored com o mesmo nome.

As regras de resolução de nome de Função anteriores têm implicações para o upgrade para versões do MySQL que implementam novas Funções built-in:

* Se você já criou uma Função loadable com um determinado nome e fizer upgrade do MySQL para uma versão que implemente uma nova Função built-in com o mesmo nome, a Função loadable se tornará inacessível. Para corrigir isso, use `DROP FUNCTION` para descartar a Função loadable e `CREATE FUNCTION` para recriá-la com um nome diferente e não conflitante. Em seguida, modifique qualquer código afetado para usar o novo nome.

* Se uma nova versão do MySQL implementar uma Função built-in com o mesmo nome de uma Função stored existente, você tem duas opções: Renomear a Função stored para usar um nome não conflitante ou alterar as chamadas para a Função para que usem um qualificador de schema (ou seja, use a syntax `schema_name.func_name()`). Em ambos os casos, modifique o código afetado de acordo.