### 8.10.4 Cache de Prepared Statements e Stored Programs

Para certas instruções que um cliente pode executar múltiplas vezes durante uma sessão, o server converte a instrução em uma estrutura interna e armazena essa estrutura em cache para ser usada durante a execução. O Caching permite que o server tenha um desempenho mais eficiente porque evita a sobrecarga de reconverter a instrução caso ela seja necessária novamente durante a sessão. A conversão e o caching ocorrem para estas instruções:

* Prepared statements, tanto aqueles processados no nível SQL (usando a instrução `PREPARE`) quanto aqueles processados usando o protocolo binário cliente/server (usando a função C API `mysql_stmt_prepare()`). A variável de sistema `max_prepared_stmt_count` controla o número total de statements que o server armazena em cache. (A soma do número de prepared statements em todas as sessões.)

* Stored programs (stored procedures e functions, triggers e events). Neste caso, o server converte e armazena em cache o corpo completo do programa. A variável de sistema `stored_program_cache` indica o número aproximado de stored programs que o server armazena em cache por sessão.

O server mantém caches para prepared statements e stored programs por sessão. Statements armazenados em cache para uma sessão não são acessíveis a outras sessões. Quando uma sessão termina, o server descarta quaisquer statements armazenados em cache para ela.

Quando o server usa uma estrutura interna de statement em cache, ele deve tomar cuidado para que a estrutura não fique desatualizada (out of date). Alterações de Metadata podem ocorrer para um objeto usado pelo statement, causando uma incompatibilidade entre a definição atual do objeto e a definição representada na estrutura interna do statement. Alterações de Metadata ocorrem para instruções DDL, como aquelas que criam, drop, alteram, renomeiam (rename) ou truncam tables, ou que analisam (analyze), otimizam (optimize) ou reparam (repair) tables. Alterações no conteúdo da Table (por exemplo, com `INSERT` ou `UPDATE`) não alteram o metadata, nem as instruções `SELECT`.

Aqui está uma ilustração do problema. Suponha que um cliente prepare este statement:

```sql
PREPARE s1 FROM 'SELECT * FROM t1';
```

O `SELECT *` se expande na estrutura interna para a lista de colunas na table. Se o conjunto de colunas na table for modificado com `ALTER TABLE`, o prepared statement fica desatualizado (out of date). Se o server não detectar essa mudança na próxima vez que o cliente executar `s1`, o prepared statement retornará resultados incorretos.

Para evitar problemas causados por alterações de metadata em tables ou views referenciadas pelo prepared statement, o server detecta essas alterações e automaticamente "reprepara" (reprepares) o statement quando ele for executado em seguida. Ou seja, o server realiza o reparsing do statement e reconstrói a estrutura interna. O Reparsing também ocorre depois que as tables ou views referenciadas são removidas (flushed) do cache de definição de table, seja implicitamente para abrir espaço para novas entradas no cache, ou explicitamente devido a `FLUSH TABLES`.

Da mesma forma, se ocorrerem alterações em objetos usados por um stored program, o server realiza o reparsing dos statements afetados dentro do programa.

O server também detecta alterações de metadata para objetos em expressions. Estes podem ser usados em statements específicos para stored programs, como `DECLARE CURSOR` ou statements de controle de fluxo, como `IF`, `CASE` e `RETURN`.

Para evitar o reparsing de stored programs inteiros, o server realiza o reparsing apenas dos statements ou expressions afetadas dentro de um programa, conforme a necessidade. Exemplos:

* Suponha que o metadata para uma table ou view seja alterado. O Reparsing ocorre para um `SELECT *` dentro do programa que acessa a table ou view, mas não para um `SELECT *` que não acessa a table ou view.

* Quando um statement é afetado, o server realiza seu reparsing apenas parcialmente, se possível. Considere este statement `CASE`:

```sql
  CASE case_expr
    WHEN when_expr1 ...
    WHEN when_expr2 ...
    WHEN when_expr3 ...
    ...
  END CASE
  ```

Se uma alteração de metadata afetar apenas `WHEN when_expr3`, essa expression é submetida ao reparsing. *`case_expr`* e as outras expressions `WHEN` não são submetidas ao reparsing.

O Reparsing usa o default Database e o SQL mode que estavam em vigor para a conversão original para o formato interno.

O server tenta o reparsing até três vezes. Ocorre um error se todas as tentativas falharem.

O Reparsing é automático, mas na medida em que ocorre, diminui o desempenho do prepared statement e do stored program.

Para prepared statements, a variável de status `Com_stmt_reprepare` rastreia o número de "repreparations".