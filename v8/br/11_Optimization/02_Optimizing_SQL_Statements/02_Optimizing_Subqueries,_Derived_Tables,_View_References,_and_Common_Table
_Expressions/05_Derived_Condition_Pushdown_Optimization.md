#### 10.2.2.5 Otimização de empilhamento de condição derivada

O MySQL 8.0.22 e versões posteriores suportam a empilhamento de condições derivadas para subconsultas elegíveis. Para uma consulta como `SELECT * FROM (SELECT i, j FROM t1) AS dt WHERE i > constant`, em muitos casos é possível empilhar a condição externa `WHERE` na tabela derivada, resultando, neste caso, em `SELECT * FROM (SELECT i, j FROM t1 WHERE i > constant) AS dt`. Quando uma tabela derivada não pode ser integrada à consulta externa (por exemplo, se a tabela derivada usa agregação), empilhar a condição externa `WHERE` na tabela derivada deve diminuir o número de linhas que precisam ser processadas e, assim, acelerar a execução da consulta.

Nota

Antes do MySQL 8.0.22, se uma tabela derivada era materializada, mas não unificada, o MySQL materializava toda a tabela e, em seguida, qualificava todas as linhas resultantes com a condição `WHERE`. Isso ainda é o caso se a empilhamento de condições derivadas não estiver habilitado ou não puder ser empregado por algum outro motivo.

As condições externas `WHERE` podem ser empurradas para tabelas materializadas derivadas nas seguintes circunstâncias:

- Quando a tabela derivada não utiliza funções agregadas ou de janela, a condição externa `WHERE` pode ser aplicada diretamente nela. Isso inclui condições `WHERE` com múltiplos predicados unidos com `AND`, `OR` ou ambos.

  Por exemplo, a consulta `SELECT * FROM (SELECT f1, f2 FROM t1) AS dt WHERE f1 < 3 AND f2 > 11` é reescrita como `SELECT f1, f2 FROM (SELECT f1, f2 FROM t1 WHERE f1 < 3 AND f2 > 11) AS dt`.

- Quando a tabela derivada possui um `GROUP BY` e não utiliza funções de janela, uma condição externa `WHERE` que faça referência a uma ou mais colunas que não fazem parte do `GROUP BY` pode ser empurrada para a tabela derivada como uma condição `HAVING`.

  Por exemplo, `SELECT * FROM (SELECT i, j, SUM(k) AS sum FROM t1 GROUP BY i, j) AS dt WHERE sum > 100` é reescrito seguindo a condição derivada de empilhamento como `SELECT * FROM (SELECT i, j, SUM(k) AS sum FROM t1 GROUP BY i, j HAVING sum > 100) AS dt`.

- Quando a tabela derivada usa um `GROUP BY` e as colunas na condição externa `WHERE` são colunas `GROUP BY`, as condições `WHERE` que fazem referência a essas colunas podem ser empurradas diretamente para a tabela derivada.

  Por exemplo, a consulta `SELECT * FROM (SELECT i,j, SUM(k) AS sum FROM t1 GROUP BY i,j) AS dt WHERE i > 10` é reescrita como `SELECT * FROM (SELECT i,j, SUM(k) AS sum FROM t1 WHERE i > 10 GROUP BY i,j) AS dt`.

  No caso de a condição externa `WHERE` ter predicados que fazem referência a colunas que fazem parte do `GROUP BY`, bem como predicados que não fazem referência a nenhuma coluna do `GROUP BY`, os predicados do primeiro tipo são empurrados para baixo como condições `WHERE`, enquanto os do segundo tipo são empurrados para baixo como condições `HAVING`. Por exemplo, na consulta `SELECT * FROM (SELECT i, j, SUM(k) AS sum FROM t1 GROUP BY i,j) AS dt WHERE i > 10 AND sum > 100`, o predicado `i > 10` na cláusula externa `WHERE` faz referência a uma coluna `GROUP BY`, enquanto o predicado `sum > 100` não faz referência a nenhuma coluna `GROUP BY`. Assim, a otimização de empurrão de tabela derivada faz com que a consulta seja reescrita de uma maneira semelhante à mostrada aqui:

  ```
  SELECT * FROM (
      SELECT i, j, SUM(k) AS sum FROM t1
          WHERE i > 10
          GROUP BY i, j
          HAVING sum > 100
      ) AS dt;
  ```

Para habilitar a otimização de empilhamento de condições derivadas, a bandeira `derived_condition_pushdown` da variável de sistema `optimizer_switch` (adicionada nesta versão) deve ser definida como `on`, que é a configuração padrão. Se essa otimização for desativada por `optimizer_switch`, você pode ativá-la para uma consulta específica usando a dica de otimizador `DERIVED_CONDITION_PUSHDOWN`. Para desativar a otimização para uma consulta específica, use a dica de otimizador `NO_DERIVED_CONDITION_PUSHDOWN`.

As seguintes restrições e limitações se aplicam à otimização de empilhamento da condição de tabela derivada:

- A otimização não pode ser usada se a tabela derivada contiver `UNION`. Essa restrição é removida no MySQL 8.0.29. Considere duas tabelas `t1` e `t2` e uma visão `v` que contém a união delas, criada conforme mostrado aqui:

  ```
  CREATE TABLE t1 (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    c1 INT,
    KEY i1 (c1)
  );

  CREATE TABLE t2 (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    c1 INT,
    KEY i1 (c1)
  );

  CREATE OR REPLACE VIEW v AS
       SELECT id, c1 FROM t1
       UNION ALL
       SELECT id, c1 FROM t2;
  ```

  Como pode ser visto na saída de `EXPLAIN`, uma condição presente no nível superior de uma consulta, como `SELECT * FROM v WHERE c1 = 12`, agora pode ser empurrada para ambos os blocos de consulta na tabela derivada:

  ```
  mysql> EXPLAIN FORMAT=TREE SELECT * FROM v WHERE c1 = 12\G
  *************************** 1. row ***************************
  EXPLAIN: -> Table scan on v  (cost=1.26..2.52 rows=2)
      -> Union materialize  (cost=2.16..3.42 rows=2)
          -> Covering index lookup on t1 using i1 (c1=12)  (cost=0.35 rows=1)
          -> Covering index lookup on t2 using i1 (c1=12)  (cost=0.35 rows=1)

  1 row in set (0.00 sec)
  ```

  No MySQL 8.0.29 e versões posteriores, a otimização de empurrar a condição da tabela derivada pode ser empregada com consultas `UNION`, com as seguintes exceções:

  - A função de empurrar condições não pode ser usada com uma consulta `UNION` se qualquer tabela derivada materializada que faça parte do `UNION` for uma expressão comum de tabela recursiva (consulte Expressões Comuns de Tabela Recursivas).

  - Condições que contêm expressões não determinísticas não podem ser empurradas para uma tabela derivada.

- A tabela derivada não pode usar uma cláusula `LIMIT`.

- As condições que contêm subconsultas não podem ser empurradas para baixo.

- A otimização não pode ser usada se a tabela derivada for uma tabela interna de uma junção externa.

- Se uma tabela derivada materializada for uma expressão de tabela comum, as condições não são aplicadas a ela se ela for referenciada várias vezes.

- As condições que utilizam parâmetros podem ser empurradas para baixo se a condição for do tipo `derived_column > ?`. Se uma coluna derivada em uma condição externa `WHERE` for uma expressão que contém um `?` na tabela derivada subjacente, essa condição não pode ser empurrada para baixo.

- Para uma consulta em que a condição está nas tabelas de uma vista criada usando `ALGORITHM=TEMPTABLE` em vez da própria vista, a igualdade múltipla não é reconhecida na resolução, e, portanto, a condição não pode ser empurrada para baixo. Isso ocorre porque, ao otimizar uma consulta, a empurrada de condição ocorre durante a fase de resolução, enquanto a propagação da igualdade múltipla ocorre durante a otimização.

  Isso não é um problema em tais casos para uma vista que usa `ALGORITHM=MERGE`, onde a igualdade pode ser propagada e a condição pode ser empurrada para baixo.

- A partir do MySQL 8.0.28, uma condição não pode ser empurrada para baixo se a lista `SELECT` da tabela derivada contiver quaisquer atribuições a variáveis de usuário. (Bug #104918)
