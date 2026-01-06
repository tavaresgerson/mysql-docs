#### 14.21.5.6 Executando declarações DML e DDL na tabela subjacente InnoDB

Você pode acessar a tabela subjacente `InnoDB` (que é `test.demo_test` por padrão) por meio de interfaces SQL padrão. No entanto, há algumas restrições:

- Ao consultar uma tabela que também é acessada através da interface **memcached**, lembre-se de que as operações **memcached** podem ser configuradas para serem realizadas periodicamente, em vez de após cada operação de escrita. Esse comportamento é controlado pela opção `daemon_memcached_w_batch_size`. Se essa opção for definida para um valor maior que `1`, use consultas `READ UNCOMMITTED` para encontrar linhas que foram inseridas recentemente.

  ```sql
  mysql> SET SESSSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

  mysql> SELECT * FROM demo_test;
  +------+------+------+------+-----------+------+------+------+------+------+------+
  | cx   | cy   | c1   | cz   | c2        | ca   | CB   | c3   | cu   | c4   | C5   |
  +------+------+------+------+-----------+------+------+------+------+------+------+
  | NULL | NULL | a11  | NULL | 123456789 | NULL | NULL |   10 | NULL |    3 | NULL |
  +------+------+------+------+-----------+------+------+------+------+------+------+
  ```

- Ao modificar uma tabela usando SQL que também é acessado através da interface **memcached**, você pode configurar as operações **memcached** para iniciar uma nova transação periodicamente, em vez de para cada operação de leitura. Esse comportamento é controlado pela opção `daemon_memcached_r_batch_size`. Se essa opção for definida para um valor maior que `1`, as alterações feitas na tabela usando SQL não serão imediatamente visíveis para as operações **memcached**.

- A tabela `InnoDB` é bloqueada de forma IS (intenção compartilhada) ou IX (intenção exclusiva) para todas as operações em uma transação. Se você aumentar `daemon_memcached_r_batch_size` e `daemon_memcached_w_batch_size` substancialmente do seu valor padrão de `1`, a tabela provavelmente será bloqueada entre cada operação, impedindo os comandos DDL na tabela.
