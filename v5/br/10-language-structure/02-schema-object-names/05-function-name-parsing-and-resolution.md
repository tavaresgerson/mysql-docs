### 9.2.5 Análise e resolução do nome da função

O MySQL suporta funções integradas (nativas), funções carregáveis e funções armazenadas. Esta seção descreve como o servidor reconhece se o nome de uma função integrada é usado como uma chamada de função ou como um identificador, e como o servidor determina qual função usar em casos em que existem funções de diferentes tipos com um nome dado.

- Análise de nomes de funções embutidos
- Resolução do Nome da Função

#### Análise de nomes de funções embutidos

O analisador usa regras padrão para a análise de nomes de funções embutidas. Essas regras podem ser alteradas ao habilitar o modo SQL `IGNORE_SPACE`.

Quando o analisador encontra uma palavra que é o nome de uma função embutida, ele deve determinar se o nome significa uma chamada de função ou se é, na verdade, uma referência não-expressão a um identificador, como o nome de uma tabela ou coluna. Por exemplo, nas seguintes declarações, a primeira referência a `count` é uma chamada de função, enquanto a segunda referência é o nome de uma tabela:

```sql
SELECT COUNT(*) FROM mytable;
CREATE TABLE count (i INT);
```

O analisador deve reconhecer o nome de uma função embutida como indicando uma chamada de função apenas ao analisar o que é esperado ser uma expressão. Ou seja, em contextos que não são expressões, os nomes de funções são permitidos como identificadores.

No entanto, algumas funções integradas têm considerações especiais de análise ou implementação, então o analisador usa as seguintes regras por padrão para distinguir se seus nomes estão sendo usados como chamadas de função ou como identificadores em contextos não expressivos:

- Para usar o nome como uma chamada de função em uma expressão, não deve haver espaços em branco entre o nome e o caractere de parênteses `(` seguinte.

- Por outro lado, para usar o nome da função como identificador, ele não deve ser seguido imediatamente por uma vírgula.

O requisito de que as chamadas de função sejam escritas sem espaços em branco entre o nome e o parêntese se aplica apenas às funções internas que têm considerações especiais. `COUNT` é um desses nomes. O arquivo fonte `sql/lex.h` lista os nomes dessas funções especiais para as quais o espaço em branco seguinte determina sua interpretação: nomes definidos pela macro `SYM_FN()` no array `symbols[]`.

A lista a seguir indica as funções no MySQL 5.7 que são afetadas pelo ajuste `IGNORE_SPACE` e listadas como especiais no arquivo fonte `sql/lex.h`. Você pode achar mais fácil tratar a exigência de ausência de espaços em branco como aplicável a todas as chamadas de função.

- `ADDDATE`
- `BIT_AND`
- `BIT_OR`
- `BIT_XOR`
- `CAST`
- `CONTAR`
- `CURDATE`
- `CURTIME`
- `DATE_ADD`
- `DATE_SUB`
- `EXTRIR`
- `GROUP_CONCAT`
- `MAX`
- `MID`
- `MIN`
- `Agora`
- `POSIÇÃO`
- `SESSION_USER`
- `STD`
- `STDDEV`
- `STDDEV_POP`
- `STDDEV_SAMP`
- `SUBDATE`
- `SUBSTR`
- `SUBSTRING`
- `SOMAR`
- `SYSDATE`
- `SISTEMA_USUARIO`
- `TRIM`
- VARIAÇÃO
- `VAR_POP`
- `VAR_SAMP`

Para funções não listadas como especiais em `sql/lex.h`, o espaço em branco não importa. Elas são interpretadas como chamadas de função apenas quando usadas em contexto de expressão e podem ser usadas livremente como identificadores caso contrário. `ASCII` é um desses nomes. No entanto, para esses nomes de funções não afetados, a interpretação pode variar em contexto de expressão: `func_name ()` é interpretado como uma função embutida se houver uma com o nome dado; se não houver, `func_name ()` é interpretado como uma função carregável ou armazenada se existir com esse nome.

O modo SQL `IGNORE_SPACE` pode ser usado para modificar a forma como o analisador trata os nomes de funções que são sensíveis a espaços em branco:

- Com `IGNORE_SPACE` desativado, o analisador interpreta o nome como uma chamada de função quando não há espaços em branco entre o nome e o parêntese seguinte. Isso ocorre mesmo quando o nome da função é usado em um contexto não expresso:

  ```sql
  mysql> CREATE TABLE count(i INT);
  ERROR 1064 (42000): You have an error in your SQL syntax ...
  near 'count(i INT)'
  ```

  Para eliminar o erro e fazer com que o nome seja tratado como um identificador, use espaços em branco após o nome ou escreva-o como um identificador citado (ou ambos):

  ```sql
  CREATE TABLE count (i INT);
  CREATE TABLE `count`(i INT);
  CREATE TABLE `count` (i INT);
  ```

- Com `IGNORE_SPACE` ativado, o analisador relaxa a exigência de que não haja espaços em branco entre o nome da função e os parênteses seguintes. Isso oferece mais flexibilidade na escrita de chamadas de função. Por exemplo, qualquer uma das seguintes chamadas de função é válida:

  ```sql
  SELECT COUNT(*) FROM mytable;
  SELECT COUNT (*) FROM mytable;
  ```

  No entanto, habilitar `IGNORE_SPACE` também tem o efeito colateral de que o analisador trata os nomes de funções afetados como palavras reservadas (veja a Seção 9.3, “Palavras-chave e Palavras Reservadas”). Isso significa que um espaço após o nome não mais significa seu uso como um identificador. O nome pode ser usado em chamadas de função com ou sem espaços em branco, mas causa um erro de sintaxe em contextos não expressivos, a menos que seja citado. Por exemplo, com `IGNORE_SPACE` habilitado, ambas as seguintes declarações falham com um erro de sintaxe porque o analisador interpreta `count` como uma palavra reservada:

  ```sql
  CREATE TABLE count(i INT);
  CREATE TABLE count (i INT);
  ```

  Para usar o nome da função em um contexto não expressivo, escreva-o como um identificador entre aspas:

  ```sql
  CREATE TABLE `count`(i INT);
  CREATE TABLE `count` (i INT);
  ```

Para habilitar o modo SQL `IGNORE_SPACE`, use esta instrução:

```sql
SET sql_mode = 'IGNORE_SPACE';
```

O `IGNORE_SPACE` também é ativado por outros modos compostos, como `ANSI`, que o incluem em seu valor:

```sql
SET sql_mode = 'ANSI';
```

Consulte a Seção 5.1.10, “Modos SQL do Servidor”, para ver quais modos compostos permitem o uso de `IGNORE_SPACE`.

Para minimizar a dependência do código SQL do ajuste `IGNORE_SPACE`, use essas diretrizes:

- Evite criar funções carregáveis ou armazenadas que tenham o mesmo nome que uma função embutida.

- Evite usar nomes de funções em contextos não expressivos. Por exemplo, essas declarações usam `count` (um dos nomes de funções afetados pela `IGNORE_SPACE`), então elas falham com ou sem espaços em branco após o nome se `IGNORE_SPACE` estiver habilitado:

  ```sql
  CREATE TABLE count(i INT);
  CREATE TABLE count (i INT);
  ```

  Se você precisar usar um nome de função em um contexto não expressivo, escreva-o como um identificador entre aspas:

  ```sql
  CREATE TABLE `count`(i INT);
  CREATE TABLE `count` (i INT);
  ```

#### Resolução do Nome da Função

As regras a seguir descrevem como o servidor resolve referências a nomes de funções para a criação e invocação de funções:

- Funções integradas e funções carregáveis

  Um erro ocorre se você tentar criar uma função carregável com o mesmo nome de uma função embutida.

- Funções integradas e funções armazenadas

  É possível criar uma função armazenada com o mesmo nome de uma função embutida, mas para invocá-la, é necessário qualificá-la com o nome do esquema. Por exemplo, se você criar uma função armazenada chamada `PI` no esquema `test`, invocá-la como `test.PI()` porque o servidor resolve `PI()` sem um qualificador como uma referência à função embutida. O servidor gera uma mensagem de aviso se o nome da função armazenada colidir com o nome de uma função embutida. A mensagem de aviso pode ser exibida com `SHOW WARNINGS`.

- Funções carregáveis e funções armazenadas

  As funções carregáveis e as funções armazenadas compartilham o mesmo namespace, portanto, você não pode criar uma função carregável e uma função armazenada com o mesmo nome.

As regras de resolução de nomes de funções anteriores têm implicações para a atualização para versões do MySQL que implementam novas funções integradas:

- Se você já criou uma função carregável com um nome específico e atualizou o MySQL para uma versão que implementa uma nova função integrada com o mesmo nome, a função carregável se torna inacessível. Para corrigir isso, use `DROP FUNCTION` para excluir a função carregável e `CREATE FUNCTION` para recriar a função carregável com um nome diferente e não conflitante. Em seguida, modifique qualquer código afetado para usar o novo nome.

- Se uma nova versão do MySQL implementar uma função embutida com o mesmo nome de uma função armazenada existente, você tem duas opções: Renomeie a função armazenada para usar um nome não conflitante ou altere as chamadas à função para que usem um qualificador de esquema (ou seja, use a sintaxe `schema_name.func_name()`). Em qualquer caso, modifique o código afetado conforme necessário.
