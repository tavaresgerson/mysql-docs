#### 25.12.12.2 A Tabela table_handles

O Performance Schema expõe informações de `table lock` (bloqueio de tabela) através da tabela [`table_handles`](performance-schema-table-handles-table.html "25.12.12.2 The table_handles Table") para mostrar os `table locks` atualmente em vigor para cada `table handle` (manipulador de tabela) aberto. [`table_handles`](performance-schema-table-handles-table.html "25.12.12.2 The table_handles Table") relata o que é registrado pela instrumentação de `table lock`. Esta informação mostra quais `table handles` o servidor tem abertos, como eles estão bloqueados e por quais sessões.

A tabela [`table_handles`](performance-schema-table-handles-table.html "25.12.12.2 The table_handles Table") é somente leitura e não pode ser atualizada. Ela possui dimensionamento automático por padrão; para configurar o tamanho da tabela, defina a variável de sistema [`performance_schema_max_table_handles`](performance-schema-system-variables.html#sysvar_performance_schema_max_table_handles) na inicialização do servidor.

A instrumentação de `table lock` usa o instrumento `wait/lock/table/sql/handler`, que é habilitado por padrão.

Para controlar o estado da instrumentação de `table lock` na inicialização do servidor, use linhas como estas no seu arquivo `my.cnf`:

* Habilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/lock/table/sql/handler=ON'
  ```

* Desabilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/lock/table/sql/handler=OFF'
  ```

Para controlar o estado da instrumentação de `table lock` em tempo de execução (`runtime`), atualize a tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"):

* Habilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'wait/lock/table/sql/handler';
  ```

* Desabilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'wait/lock/table/sql/handler';
  ```

A tabela [`table_handles`](performance-schema-table-handles-table.html "25.12.12.2 The table_handles Table") possui as seguintes colunas:

* `OBJECT_TYPE`

  A tabela aberta por um `table handle`.

* `OBJECT_SCHEMA`

  O `schema` que contém o objeto.

* `OBJECT_NAME`

  O nome do objeto instrumentado.

* `OBJECT_INSTANCE_BEGIN`

  O endereço do `table handle` na memória.

* `OWNER_THREAD_ID`

  O `Thread` (linha de execução) que possui o `table handle`.

* `OWNER_EVENT_ID`

  O evento que causou a abertura do `table handle`.

* `INTERNAL_LOCK`

  O `table lock` usado no nível SQL. O valor é um dos seguintes: `READ`, `READ WITH SHARED LOCKS`, `READ HIGH PRIORITY`, `READ NO INSERT`, `WRITE ALLOW WRITE`, `WRITE CONCURRENT INSERT`, `WRITE LOW PRIORITY`, ou `WRITE`. Para obter informações sobre esses tipos de `lock`, consulte o arquivo fonte `include/thr_lock.h`.

* `EXTERNAL_LOCK`

  O `table lock` usado no nível do `storage engine` (motor de armazenamento). O valor é um dos seguintes: `READ EXTERNAL` ou `WRITE EXTERNAL`.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitido para a tabela [`table_handles`](performance-schema-table-handles-table.html "25.12.12.2 The table_handles Table").