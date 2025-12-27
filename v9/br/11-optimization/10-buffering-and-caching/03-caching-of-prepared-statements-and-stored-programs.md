### 10.10.3 Caching de Declarações Preparadas e Programas Armazenados

Para certas declarações que um cliente pode executar várias vezes durante uma sessão, o servidor converte a declaração em uma estrutura interna e cacheia essa estrutura para ser usada durante a execução. O caching permite que o servidor realize a execução de forma mais eficiente, pois evita o overhead de reconverter a declaração caso seja necessário novamente durante a sessão. A conversão e o caching ocorrem para essas declarações:

* Declarações preparadas, tanto aquelas processadas no nível SQL (usando a declaração `PREPARE`) quanto aquelas processadas usando o protocolo binário cliente/servidor (usando a função `mysql_stmt_prepare()` da API C). A variável de sistema `max_prepared_stmt_count` controla o número total de declarações que o servidor cacheia. (A soma do número de declarações preparadas em todas as sessões.)

* Programas armazenados (procedimentos e funções armazenados, gatilhos e eventos). Neste caso, o servidor converte e cacheia todo o corpo do programa. A variável de sistema `stored_program_cache` indica o número aproximado de programas armazenados que o servidor cacheia por sessão.

O servidor mantém caches para declarações preparadas e programas armazenados em uma base por sessão. Declarações cacheadas para uma sessão não são acessíveis a outras sessões. Quando uma sessão termina, o servidor descarta quaisquer declarações cacheadas para ela.

Quando o servidor usa uma estrutura de declaração interna armazenada em cache, ele deve garantir que essa estrutura não fique desatualizada. Alterações de metadados podem ocorrer para um objeto usado pela declaração, causando um desajuste entre a definição atual do objeto e a definição representada na estrutura interna da declaração. Alterações de metadados ocorrem para declarações DDL, como aquelas que criam, excluem, alteram, renomeiam ou truncam tabelas, ou que analisam, otimizam ou reparam tabelas. Alterações no conteúdo da tabela (por exemplo, com `INSERT` ou `UPDATE`) não alteram os metadados, nem as declarações `SELECT`.

Aqui está uma ilustração do problema. Suponha que um cliente prepare esta declaração:

```
PREPARE s1 FROM 'SELECT * FROM t1';
```

O `SELECT *` se expande na estrutura interna para a lista de colunas da tabela. Se o conjunto de colunas da tabela for modificado com `ALTER TABLE`, a declaração preparada fica desatualizada. Se o servidor não detectar essa mudança na próxima vez que o cliente executar `s1`, a declaração preparada retornará resultados incorretos.

Para evitar problemas causados por alterações de metadados em tabelas ou visualizações referenciadas pela declaração preparada, o servidor detecta essas alterações e refaz a declaração automaticamente quando ela é executada novamente. Ou seja, o servidor repara a declaração e reconstrui a estrutura interna. A reparação também ocorre após as tabelas ou visualizações referenciadas serem descartadas do cache de definição de tabela, seja implicitamente para fazer espaço para novas entradas no cache, seja explicitamente devido a `FLUSH TABLES`.

Da mesma forma, se ocorrerem alterações em objetos usados por um programa armazenado, o servidor repara as declarações afetadas dentro do programa.

O servidor também detecta alterações de metadados para objetos em expressões. Essas podem ser usadas em declarações específicas de programas armazenados, como `DECLARE CURSOR` ou declarações de controle de fluxo, como `IF`, `CASE` e `RETURN`.

Para evitar a análise de programas armazenados inteiros, o servidor analisa apenas as declarações ou expressões afetadas dentro de um programa conforme necessário. Exemplos:

* Suponha que os metadados de uma tabela ou visualização sejam alterados. A análise ocorre para um `SELECT *` dentro do programa que acessa a tabela ou visualização, mas não para um `SELECT *` que não acessa a tabela ou visualização.

* Quando uma declaração é afetada, o servidor a analisa apenas parcialmente, se possível. Considere esta declaração `CASE`:

  ```
  CASE case_expr
    WHEN when_expr1 ...
    WHEN when_expr2 ...
    WHEN when_expr3 ...
    ...
  END CASE
  ```

  Se uma alteração de metadados afeta apenas `WHEN when_expr3`, essa expressão é analisada. *`case_expr`* e as outras expressões `WHEN` não são analisadas.

A análise usa o banco de dados padrão e o modo SQL que estavam em vigor para a conversão original para a forma interna.

O servidor tenta analisar até três vezes. Um erro ocorre se todas as tentativas falharem.

A análise é automática, mas, na medida em que ocorre, diminui o desempenho de declarações preparadas e programas armazenados.

Para declarações preparadas, a variável de status `Com_stmt_reprepare` rastreia o número de repreparações.