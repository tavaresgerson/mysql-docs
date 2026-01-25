#### 14.21.5.6 Executando DML e DDL Statements na InnoDB Table Subjacente

Você pode acessar a InnoDB table subjacente (que é `test.demo_test` por padrão) através de interfaces SQL padrão. No entanto, há algumas restrições:

* Ao executar um Query em uma tabela que também é acessada através da interface **memcached**, lembre-se de que as operações **memcached** podem ser configuradas para serem *committed* (confirmadas) periodicamente, em vez de após cada *write operation* (operação de escrita). Esse comportamento é controlado pela opção `daemon_memcached_w_batch_size`. Se essa opção for definida com um valor maior que `1`, use Queries `READ UNCOMMITTED` para encontrar linhas que acabaram de ser inseridas.

  ```sql
  mysql> SET SESSSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

  mysql> SELECT * FROM demo_test;
  +------+------+------+------+-----------+------+------+------+------+------+------+
  | cx   | cy   | c1   | cz   | c2        | ca   | CB   | c3   | cu   | c4   | C5   |
  +------+------+------+------+-----------+------+------+------+------+------+------+
  | NULL | NULL | a11  | NULL | 123456789 | NULL | NULL |   10 | NULL |    3 | NULL |
  +------+------+------+------+-----------+------+------+------+------+------+------+
  ```

* Ao modificar uma tabela usando SQL que também é acessada através da interface **memcached**, você pode configurar as operações **memcached** para iniciar uma nova *transaction* periodicamente, em vez de a cada *read operation* (operação de leitura). Esse comportamento é controlado pela opção `daemon_memcached_r_batch_size`. Se essa opção for definida com um valor maior que `1`, as alterações feitas na tabela usando SQL não são imediatamente visíveis para as operações **memcached**.

* A InnoDB table é submetida a um Lock IS (intention shared) ou IX (intention exclusive) para todas as operações em uma *transaction*. Se você aumentar substancialmente `daemon_memcached_r_batch_size` e `daemon_memcached_w_batch_size` a partir do valor padrão de `1`, a tabela provavelmente estará com Lock entre cada operação, impedindo DDL statements na tabela.