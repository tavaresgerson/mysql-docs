### 11.2.5 Análise e resolução do nome da função

O MySQL suporta funções integradas (nativas), funções carregáveis e funções armazenadas. Esta seção descreve como o servidor reconhece se o nome de uma função integrada é usado como uma chamada de função ou como um identificador, e como o servidor determina qual função usar em casos em que existem funções de diferentes tipos com um nome dado.

- Análise de nomes de funções embutidos
- Resolução do Nome da Função

#### Análise de nomes de funções embutidos

O analisador usa regras padrão para a análise de nomes de funções embutidas. Essas regras podem ser alteradas ao habilitar o modo `IGNORE_SPACE` SQL.

Quando o analisador encontra uma palavra que é o nome de uma função embutida, ele deve determinar se o nome significa uma chamada de função ou se é, na verdade, uma referência não-expressão a um identificador, como o nome de uma tabela ou coluna. Por exemplo, nas seguintes declarações, a primeira referência a `count` é uma chamada de função, enquanto a segunda referência é o nome de uma tabela:

```
SELECT COUNT(*) FROM mytable;
CREATE TABLE count (i INT);
```

O analisador deve reconhecer o nome de uma função embutida como indicando uma chamada de função apenas ao analisar o que é esperado ser uma expressão. Ou seja, em contextos que não são expressões, os nomes de funções são permitidos como identificadores.

No entanto, algumas funções integradas têm considerações especiais de análise ou implementação, então o analisador usa as seguintes regras por padrão para distinguir se seus nomes estão sendo usados como chamadas de função ou como identificadores em contextos não expressivos:

- Para usar o nome como uma chamada de função em uma expressão, não deve haver espaços em branco entre o nome e o caractere de parênteses `(` seguinte.

- Por outro lado, para usar o nome da função como identificador, ele não deve ser seguido imediatamente por uma vírgula.

O requisito de que as chamadas de função sejam escritas sem espaços em branco entre o nome e o parêntese se aplica apenas às funções internas que têm considerações especiais. `COUNT` é um desses nomes. O arquivo de código `sql/lex.h` lista os nomes dessas funções especiais para as quais o espaço em branco seguinte determina sua interpretação: nomes definidos pela macro `SYM_FN()` na matriz `symbols[]`.

A lista a seguir lista as funções no MySQL 8.0 que são afetadas pelo ajuste `IGNORE_SPACE` e listadas como especiais no arquivo fonte `sql/lex.h`. Você pode achar mais fácil tratar a exigência de ausência de espaços em branco como aplicável a todas as chamadas de função.

- `ADDDATE`
- `BIT_AND`
- `BIT_OR`
- `BIT_XOR`
- `CAST`
- `COUNT`
- `CURDATE`
- `CURTIME`
- `DATE_ADD`
- `DATE_SUB`
- `EXTRACT`
- `GROUP_CONCAT`
- `MAX`
- `MID`
- `MIN`
- `NOW`
- `POSITION`
- `SESSION_USER`
- `STD`
- `STDDEV`
- `STDDEV_POP`
- `STDDEV_SAMP`
- `SUBDATE`
- `SUBSTR`
- `SUBSTRING`
- `SUM`
- `SYSDATE`
- `SYSTEM_USER`
- `TRIM`
- `VARIANCE`
- `VAR_POP`
- `VAR_SAMP`

Para funções não listadas como especiais em `sql/lex.h`, o espaço em branco não importa. Elas são interpretadas como chamadas de função apenas quando usadas em contexto de expressão e podem ser usadas livremente como identificadores caso contrário. `ASCII` é um desses nomes. No entanto, para esses nomes de funções não afetados, a interpretação pode variar em contexto de expressão: `func_name ()` é interpretado como uma função embutida se houver uma com o nome dado; se não houver, `func_name ()` é interpretado como uma função carregável ou armazenada se existir com esse nome.

O modo SQL `IGNORE_SPACE` pode ser usado para modificar a forma como o analisador trata os nomes de funções que são sensíveis a espaços em branco:

- Com `IGNORE_SPACE` desativado, o analisador interpreta o nome como uma chamada de função quando não há espaço em branco entre o nome e o parêntese seguinte. Isso ocorre mesmo quando o nome da função é usado em um contexto não expresso:

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

- Com o `IGNORE_SPACE` ativado, o analisador relaxa a exigência de que não haja espaços em branco entre o nome da função e os parênteses seguintes. Isso oferece mais flexibilidade na escrita de chamadas de função. Por exemplo, qualquer uma das seguintes chamadas de função é válida:

  ```
  SELECT COUNT(*) FROM mytable;
  SELECT COUNT (*) FROM mytable;
  ```

  No entanto, habilitar `IGNORE_SPACE` também tem o efeito colateral de que o analisador trata os nomes de funções afetados como palavras reservadas (veja a Seção 11.3, “Palavras-chave e Palavras Reservadas”). Isso significa que um espaço após o nome não mais significa seu uso como um identificador. O nome pode ser usado em chamadas de função com ou sem espaços em branco, mas causa um erro de sintaxe em contextos não expressivos, a menos que seja citado. Por exemplo, com `IGNORE_SPACE` habilitado, ambas as seguintes declarações falham com um erro de sintaxe porque o analisador interpreta `count` como uma palavra reservada:

  ```
  CREATE TABLE count(i INT);
  CREATE TABLE count (i INT);
  ```

  Para usar o nome da função em um contexto não expressivo, escreva-o como um identificador entre aspas:

  ```
  CREATE TABLE `count`(i INT);
  CREATE TABLE `count` (i INT);
  ```

Para habilitar o modo SQL `IGNORE_SPACE`, use esta instrução:

```
SET sql_mode = 'IGNORE_SPACE';
```

`IGNORE_SPACE` também é habilitado por outros modos compostos, como `ANSI`, que o incluem em seu valor:

```
SET sql_mode = 'ANSI';
```

Consulte a Seção 7.1.11, “Modos SQL do Servidor”, para ver quais modos compostos permitem `IGNORE_SPACE`.

Para minimizar a dependência do código SQL da configuração `IGNORE_SPACE`, use essas diretrizes:

- Evite criar funções carregáveis ou armazenadas que tenham o mesmo nome que uma função embutida.

- Evite usar nomes de funções em contextos não expressivos. Por exemplo, essas declarações usam `count` (um dos nomes de funções afetados pela `IGNORE_SPACE`), então elas falham com ou sem espaços após o nome se `IGNORE_SPACE` estiver ativado:

  ```
  CREATE TABLE count(i INT);
  CREATE TABLE count (i INT);
  ```

  Se você precisar usar um nome de função em um contexto não expressivo, escreva-o como um identificador entre aspas:

  ```
  CREATE TABLE `count`(i INT);
  CREATE TABLE `count` (i INT);
  ```

#### Resolução do Nome da Função

As regras a seguir descrevem como o servidor resolve referências a nomes de funções para a criação e invocação de funções:

- Funções integradas e funções carregáveis

  Um erro ocorre se você tentar criar uma função carregável com o mesmo nome de uma função embutida.

  `IF NOT EXISTS` (disponível a partir do MySQL 8.0.29) não tem efeito em tais casos. Consulte a Seção 15.7.4.1, “Instrução CREATE FUNCTION para Funções Carregáveis”, para obter mais informações.

- Funções integradas e funções armazenadas

  É possível criar uma função armazenada com o mesmo nome de uma função embutida, mas para invocá-la, é necessário qualificá-la com o nome do esquema. Por exemplo, se você criar uma função armazenada chamada `PI` no esquema `test`, invocá-la como `test.PI()`, porque o servidor resolve `PI()` sem um qualificador como referência à função embutida. O servidor gera uma mensagem de aviso se o nome da função armazenada colidir com o nome de uma função embutida. A mensagem de aviso pode ser exibida com `SHOW WARNINGS`.

  `IF NOT EXISTS` (MySQL 8.0.29 e versões posteriores) não tem efeito em tais casos; veja a Seção 15.1.17, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.

- Funções carregáveis e funções armazenadas

  É possível criar uma função armazenada com o mesmo nome de uma função carregável existente, ou vice-versa. O servidor gera uma mensagem de aviso se um nome de função armazenada proposto colidir com o nome de uma função carregável existente, ou se um nome de função carregável proposto for o mesmo de uma função armazenada existente. Em ambos os casos, uma vez que ambas as funções existam, é necessário, a partir daí, qualificar a função armazenada com o nome do esquema ao invocá-la; o servidor assume, nesses casos, que o nome não qualificado se refere à função carregável.

  A partir do MySQL 8.0.29, o `IF NOT EXISTS` é suportado com instruções `CREATE FUNCTION`, mas não tem efeito nesses casos.

  Antes do MySQL 8.0.28, era possível criar uma função armazenada com o mesmo nome de uma função carregável existente, mas não o contrário (Bug #33301931).

As regras de resolução de nomes de funções anteriores têm implicações para a atualização para versões do MySQL que implementam novas funções integradas:

- Se você já criou uma função carregável com um nome específico e atualizou o MySQL para uma versão que implementa uma nova função embutida com o mesmo nome, a função carregável se torna inacessível. Para corrigir isso, use `DROP FUNCTION` para descartar a função carregável e `CREATE FUNCTION` para recré-la com um nome diferente e não conflitante. Em seguida, modifique qualquer código afetado para usar o novo nome.

- Se uma nova versão do MySQL implementar uma função embutida ou uma função carregável com o mesmo nome de uma função armazenada existente, você tem duas opções: Renomeie a função armazenada para usar um nome não conflitante ou mude quaisquer chamadas à função que ainda não o fazem para usar um qualificador de esquema (sintaxe `schema_name.func_name()`). Em qualquer caso, modifique o código afetado conforme necessário.
