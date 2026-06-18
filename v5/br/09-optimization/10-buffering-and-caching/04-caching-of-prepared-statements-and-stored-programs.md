### 8.10.4 Caching de Declarações Preparadas e Programas Armazenados

Para certas instruções que um cliente pode executar várias vezes durante uma sessão, o servidor converte a instrução em uma estrutura interna e armazena essa estrutura para ser usada durante a execução. O armazenamento em cache permite que o servidor realize a execução de forma mais eficiente, pois evita o overhead de reconverter a instrução caso ela seja necessária novamente durante a sessão. A conversão e o armazenamento em cache ocorrem para essas instruções:

- Declarações preparadas, tanto aquelas processadas no nível SQL (usando a instrução `PREPARE`) quanto aquelas processadas usando o protocolo binário cliente/servidor (usando a função C `mysql_stmt_prepare()`). A variável de sistema `max_prepared_stmt_count` controla o número total de declarações que o servidor armazena em cache. (A soma do número de declarações preparadas em todas as sessões.)

- Programas armazenados (procedimentos e funções armazenados, gatilhos e eventos). Nesse caso, o servidor converte e armazena o corpo inteiro do programa. A variável de sistema `stored_program_cache` indica o número aproximado de programas armazenados que o servidor armazena por sessão.

O servidor mantém caches para instruções preparadas e programas armazenados por sessão. As instruções cacheadas para uma sessão não são acessíveis para outras sessões. Quando uma sessão termina, o servidor descarta quaisquer instruções cacheadas para ela.

Quando o servidor usa uma estrutura de declaração interna cacheada, ele deve garantir que essa estrutura não fique desatualizada. Alterações de metadados podem ocorrer para um objeto usado pela declaração, causando uma incompatibilidade entre a definição atual do objeto e a definição representada na estrutura de declaração interna. Alterações de metadados ocorrem para declarações DDL, como aquelas que criam, excluem, alteram, renomeiam ou truncam tabelas, ou que analisam, otimizam ou reparam tabelas. Alterações no conteúdo da tabela (por exemplo, com `INSERT` ou `UPDATE`) não alteram os metadados, nem as declarações `SELECT`.

Aqui está uma ilustração do problema. Suponha que um cliente prepare esta declaração:

```sql
PREPARE s1 FROM 'SELECT * FROM t1';
```

A instrução `SELECT *` se expande na estrutura interna para a lista de colunas da tabela. Se o conjunto de colunas na tabela for modificado com `ALTER TABLE`, a instrução preparada fica desatualizada. Se o servidor não detectar essa mudança na próxima vez que o cliente executar `s1`, a instrução preparada retornará resultados incorretos.

Para evitar problemas causados por alterações nos metadados das tabelas ou visualizações referenciadas pelo comando preparado, o servidor detecta essas alterações e refaz o comando automaticamente quando ele é executado novamente. Isso significa que o servidor reanalisa o comando e reconstrui a estrutura interna. A reanálise também ocorre após as tabelas ou visualizações referenciadas serem descartadas do cache de definição de tabela, seja implicitamente para dar espaço para novas entradas no cache, seja explicitamente devido ao `FLUSH TABLES`.

Da mesma forma, se houver alterações em objetos usados por um programa armazenado, o servidor reanalisa as instruções afetadas dentro do programa.

O servidor também detecta alterações de metadados para objetos em expressões. Essas alterações podem ser usadas em declarações específicas de programas armazenados, como `DECLARE CURSOR` ou declarações de controle de fluxo, como `IF`, `CASE` e `RETURN`.

Para evitar a análise de programas armazenados inteiros, o servidor analisa apenas as declarações ou expressões afetadas dentro de um programa conforme necessário. Exemplos:

- Suponha que os metadados de uma tabela ou visualização sejam alterados. A reparação ocorre para um `SELECT *` dentro do programa que acessa a tabela ou visualização, mas não para um `SELECT *` que não acessa a tabela ou visualização.

- Quando uma declaração é afetada, o servidor a repara apenas parcialmente, se possível. Considere esta declaração `CASE`:

  ```sql
  CASE case_expr
    WHEN when_expr1 ...
    WHEN when_expr2 ...
    WHEN when_expr3 ...
    ...
  END CASE
  ```

  Se uma alteração de metadados afeta apenas `WHEN when_expr3`, essa expressão é reinterpretada. *`case_expr`* e as outras expressões `WHEN` não são reinterpretadas.

A Reparsing usa o banco de dados padrão e o modo SQL que estavam em vigor na conversão original para o formato interno.

O servidor tenta reparsear até três vezes. Um erro ocorre se todas as tentativas falharem.

A reparação é automática, mas, na medida em que ocorre, diminui o desempenho da declaração preparada e do programa armazenado.

Para declarações preparadas, a variável de status `Com_stmt_reprepare` acompanha o número de repreparações.
