### 11.2.5 Análise e Resolução de Nomes de Funções

O MySQL suporta funções integradas (nativas), funções carregáveis e funções armazenadas. Esta seção descreve como o servidor reconhece se o nome de uma função integrada é usado como chamada de função ou como um identificador, e como o servidor determina qual função usar em casos em que existem funções de diferentes tipos com um nome dado.

* Análise de Nomes de Funções Integradas
* Resolução de Nomes de Funções

#### Análise de Nomes de Funções Integradas

O analisador usa regras padrão para a análise de nomes de funções integradas. Essas regras podem ser alteradas ao habilitar o modo SQL `IGNORE_SPACE`.

Quando o analisador encontra uma palavra que é o nome de uma função integrada, ele deve determinar se o nome significa uma chamada de função ou se é, na verdade, uma referência não-expressão a um identificador, como o nome de uma tabela ou coluna. Por exemplo, nas seguintes instruções, a primeira referência a `count` é uma chamada de função, enquanto a segunda referência é o nome de uma tabela:

```
SELECT COUNT(*) FROM mytable;
CREATE TABLE count (i INT);
```

O analisador deve reconhecer o nome de uma função integrada como indicando uma chamada de função apenas ao analisar o que é esperado ser uma expressão. Ou seja, em contexto não-expressão, os nomes de funções são permitidos como identificadores.

No entanto, algumas funções integradas têm considerações de análise ou implementação especiais, então o analisador usa as seguintes regras por padrão para distinguir se seus nomes estão sendo usados como chamadas de função ou como identificadores em contexto não-expressão:

* Para usar o nome como uma chamada de função em uma expressão, não deve haver espaço em branco entre o nome e o caractere seguinte `(`.

* Por outro lado, para usar o nome da função como um identificador, ele não deve ser seguido imediatamente por um parêntese.

O requisito de que as chamadas de função sejam escritas sem espaços em branco entre o nome e o parêntese aplica-se apenas às funções embutidas que têm considerações especiais. `COUNT` é um desses nomes. O arquivo fonte `sql/lex.h` lista os nomes dessas funções especiais para as quais o espaço em branco após determina sua interpretação: nomes definidos pela macro `SYM_FN()` no array `symbols[]`.

A lista a seguir lista os nomes das funções no MySQL 9.5 que são afetadas pelo ajuste `IGNORE_SPACE` e listadas como especiais no arquivo fonte `sql/lex.h`. Você pode achar mais fácil tratar o requisito sem espaços em branco como aplicável a todas as chamadas de função.

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

Para funções não listadas como especiais em `sql/lex.h`, o espaço em branco não importa. Elas são interpretadas como chamadas de função apenas quando usadas em contexto de expressão e podem ser usadas livremente como identificadores caso contrário. `ASCII` é um desses nomes. No entanto, para esses nomes de funções não afetados, a interpretação pode variar em contexto de expressão: `func_name ()` é interpretado como uma função embutida se houver uma com o nome dado; se não houver, `func_name ()` é interpretado como uma função carregável ou armazenada se existir com esse nome.

O modo SQL `IGNORE_SPACE` pode ser usado para modificar como o analisador trata nomes de funções que são sensíveis ao espaço em branco:

* Com `IGNORE_SPACE` desativado, o analisador interpreta o nome como uma chamada de função quando não há espaços em branco entre o nome e o parêntese seguinte. Isso ocorre mesmo quando o nome da função é usado em um contexto não expresso:

  ```
  mysql> CREATE TABLE count(i INT);
  ERROR 1064 (42000): You have an error in your SQL syntax ...
  near 'count(i INT)'
  ```

  Para eliminar o erro e fazer com que o nome seja tratado como um identificador, use espaços em branco após o nome ou escreva-o como um identificador citado (ou ambos):

  ```
  CREATE TABLE count (i INT);
  CREATE TABLE `count`(i INT);
  CREATE TABLE `count` (i INT);
  ```

* Com `IGNORE_SPACE` ativado, o analisador relaxa a exigência de que não haja espaços em branco entre o nome da função e o parêntese seguinte. Isso oferece mais flexibilidade na escrita de chamadas de função. Por exemplo, qualquer uma das seguintes chamadas de função é legal:

  ```
  SELECT COUNT(*) FROM mytable;
  SELECT COUNT (*) FROM mytable;
  ```

* No entanto, habilitar `IGNORE_SPACE` também tem o efeito colateral de que o analisador trata os nomes das funções afetados como palavras reservadas (veja a Seção 11.3, “Palavras-chave e Palavras Reservadas”). Isso significa que um espaço após o nome não mais significa seu uso como um identificador. O nome pode ser usado em chamadas de função com ou sem espaços em branco seguintes, mas causa um erro de sintaxe em um contexto não expresso, a menos que seja citado. Por exemplo, com `IGNORE_SPACE` ativado, ambas as seguintes declarações falham com um erro de sintaxe porque o analisador interpreta `count` como uma palavra reservada:

  ```
  CREATE TABLE count(i INT);
  CREATE TABLE count (i INT);
  ```

* Para usar o nome da função em um contexto não expresso, escreva-o como um identificador citado:

  ```
  CREATE TABLE `count`(i INT);
  CREATE TABLE `count` (i INT);
  ```

Para habilitar o modo SQL `IGNORE_SPACE`, use esta declaração:

```
SET sql_mode = 'IGNORE_SPACE';
```

`IGNORE_SPACE` também é habilitado por certos outros modos compostos, como `ANSI`, que o incluem em seu valor:

```
SET sql_mode = 'ANSI';
```

Verifique a Seção 7.1.11, “Modos SQL do Servidor”, para ver quais modos compostos habilitam `IGNORE_SPACE`.

Para minimizar a dependência do código SQL da configuração `IGNORE_SPACE`, use essas diretrizes:

* Evite criar funções carregáveis ou armazenadas que tenham o mesmo nome que uma função embutida.

* Evite usar nomes de funções em contextos não expressivos. Por exemplo, essas instruções usam `count` (um dos nomes de funções afetados pela `IGNORE_SPACE`), então elas falham com ou sem espaços em branco após o nome se `IGNORE_SPACE` estiver habilitado:

  ```
  CREATE TABLE count(i INT);
  CREATE TABLE count (i INT);
  ```

  Se você deve usar um nome de função em um contexto não expressivo, escreva-o como um identificador citado:

  ```
  CREATE TABLE `count`(i INT);
  CREATE TABLE `count` (i INT);
  ```

#### Resolução de Nomes de Função

As seguintes regras descrevem como o servidor resolve referências a nomes de funções para criação e invocação de funções:

* Funções embutidas e funções carregáveis

  Um erro ocorre se você tentar criar uma função carregável com o mesmo nome que uma função embutida.

  `IF NOT EXISTS` não tem efeito nessas situações. Consulte a Seção 15.7.4.1, “Instrução CREATE FUNCTION para Funções Carregáveis”, para mais informações.

* Funções embutidas e funções armazenadas

  É possível criar uma função armazenada com o mesmo nome que uma função embutida, mas para invocar a função armazenada é necessário qualificá-la com um nome de esquema. Por exemplo, se você criar uma função armazenada chamada `PI` no esquema `test`, invocá-la como `test.PI()` porque o servidor resolve `PI()` sem um qualificador como uma referência à função embutida. O servidor gera uma mensagem de aviso se o nome da função armazenada colidir com o nome de uma função embutida. A mensagem de aviso pode ser exibida com `SHOW WARNINGS`.

  `IF NOT EXISTS` não tem efeito nessas situações; consulte a Seção 15.1.21, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.

* Funções carregáveis e funções armazenadas

É possível criar uma função armazenada com o mesmo nome de uma função carregável existente, ou vice-versa. O servidor gera uma mensagem de aviso se um nome de função armazenada proposto colidir com o nome de uma função carregável existente, ou se um nome de função carregável proposto for o mesmo de uma função armazenada existente. Em ambos os casos, uma vez que ambas as funções existem, é necessário, posteriormente, qualificar a função armazenada com um nome de esquema ao invocá-la; o servidor assume, nesses casos, que o nome não qualificado se refere à função carregável.

O MySQL 9.5 suporta `IF NOT EXISTS` com instruções `CREATE FUNCTION`, mas não tem efeito nesses casos.

As regras de resolução de nomes de funções anteriores têm implicações para a atualização para versões do MySQL que implementam novas funções integradas:

* Se você já criou uma função carregável com um nome dado e atualizou o MySQL para uma versão que implementa uma nova função integrada com o mesmo nome, a função carregável torna-se inacessível. Para corrigir isso, use `DROP FUNCTION` para descartar a função carregável e `CREATE FUNCTION` para recriar a função carregável com um nome não conflituante diferente. Em seguida, modifique qualquer código afetado para usar o novo nome.

* Se uma nova versão do MySQL implementar uma função integrada ou uma função carregável com o mesmo nome de uma função armazenada existente, você tem duas opções: Renomeie a função armazenada para usar um nome não conflituante ou modifique quaisquer chamadas à função que ainda não o fazem para usar um qualificador de esquema (`schema_name.func_name()`). Em ambos os casos, modifique qualquer código afetado conforme necessário.