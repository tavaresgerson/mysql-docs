#### 29.12.13.4 A tabela `table_handles`

O Schema de Desempenho expõe informações sobre os bloqueios de tabela por meio da tabela `table_handles` para mostrar os bloqueios de tabela atualmente em vigor para cada handle de tabela aberto. O `table_handles` relata o que é registrado pelo instrumentação de bloqueio de tabela. Esta informação mostra quais handles de tabela o servidor tem abertos, como eles estão bloqueados e por quais sessões.

A tabela `table_handles` é somente de leitura e não pode ser atualizada. Ela é dimensionada automaticamente por padrão; para configurar o tamanho da tabela, defina a variável de sistema `performance_schema_max_table_handles` no início do servidor.

A instrumentação de bloqueio de tabela usa o instrumento `wait/lock/table/sql/handler`, que está habilitado por padrão.

Para controlar o estado da instrumentação de bloqueio de tabela no início do servidor, use linhas como estas no seu arquivo `my.cnf`:

* Habilitar:

  ```
  [mysqld]
  performance-schema-instrument='wait/lock/table/sql/handler=ON'
  ```

* Desabilitar:

  ```
  [mysqld]
  performance-schema-instrument='wait/lock/table/sql/handler=OFF'
  ```

Para controlar o estado da instrumentação de bloqueio de tabela no tempo de execução, atualize a tabela `setup_instruments`:

* Habilitar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'wait/lock/table/sql/handler';
  ```

* Desabilitar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'wait/lock/table/sql/handler';
  ```

A tabela `table_handles` tem estas colunas:

* `OBJECT_TYPE`

  A tabela aberta por um handle de tabela.

* `OBJECT_SCHEMA`

  O esquema que contém o objeto.

* `OBJECT_NAME`

  O nome do objeto instrumentado.

* `OBJECT_INSTANCE_BEGIN`

  O endereço do handle de tabela na memória.

* `OWNER_THREAD_ID`

  O ID de thread que possui o handle de tabela.

* `OWNER_EVENT_ID`

  O evento que causou o handle de tabela ser aberto.

* `INTERNAL_LOCK`

  O bloqueio de tabela usado no nível SQL. O valor é um dos `READ`, `READ WITH SHARED LOCKS`, `READ HIGH PRIORITY`, `READ NO INSERT`, `WRITE ALLOW WRITE`, `WRITE CONCURRENT INSERT`, `WRITE LOW PRIORITY` ou `WRITE`. Para informações sobre esses tipos de bloqueio, consulte o arquivo fonte `include/thr_lock.h`.

* `EXTERNAL_LOCK`

O bloqueio de tabela utilizado no nível do motor de armazenamento. O valor é `READ EXTERNAL` ou `WRITE EXTERNAL`.

A tabela `table_handles` tem esses índices:

* Chave primária em (`OBJECT_INSTANCE_BEGIN`)
* Índice em (`OBJECT_TYPE`, `OBJECT_SCHEMA`, `OBJECT_NAME`)

* Índice em (`OWNER_THREAD_ID`, `OWNER_EVENT_ID`)

O `TRUNCATE TABLE` não é permitido para a tabela `table_handles`.