#### 29.12.13.4 A tabela\_handles

O Schema de Desempenho expõe informações sobre bloqueios de tabela através da tabela `table_handles` para mostrar os bloqueios de tabela atualmente em vigor para cada handle de tabela aberto. `table_handles` relata o que é registrado pela instrumentação de bloqueio de tabela. Essas informações mostram quais handles de tabela o servidor tem abertos, como eles estão bloqueados e por quais sessões.

A tabela `table_handles` é de leitura somente e não pode ser atualizada. Ela é dimensionada automaticamente por padrão; para configurar o tamanho da tabela, defina a variável de sistema `performance_schema_max_table_handles` durante a inicialização do servidor.

A instrumentação de bloqueio de mesa utiliza o instrumento `wait/lock/table/sql/handler`, que está habilitado por padrão.

Para controlar o estado da instrumentação de bloqueio de tabela no início do servidor, use linhas como estas no seu arquivo `my.cnf`:

- Ativar:

  ```
  [mysqld]
  performance-schema-instrument='wait/lock/table/sql/handler=ON'
  ```

- Desativar:

  ```
  [mysqld]
  performance-schema-instrument='wait/lock/table/sql/handler=OFF'
  ```

Para controlar o estado da instrumentação de bloqueio de tabela em tempo de execução, atualize a tabela `setup_instruments`:

- Ativar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'wait/lock/table/sql/handler';
  ```

- Desativar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'wait/lock/table/sql/handler';
  ```

A tabela `table_handles` tem essas colunas:

- `OBJECT_TYPE`

  A mesa foi aberta com a alça da mesa.

- `OBJECT_SCHEMA`

  O esquema que contém o objeto.

- `OBJECT_NAME`

  O nome do objeto instrumentado.

- `OBJECT_INSTANCE_BEGIN`

  Endereço do cabo da mesa na memória.

- `OWNER_THREAD_ID`

  O fio que possui o manipulador da tabela.

- `OWNER_EVENT_ID`

  O evento que causou a abertura da alça da mesa.

- `INTERNAL_LOCK`

  O bloqueio da tabela utilizado no nível SQL. O valor é um dos `READ`, `READ WITH SHARED LOCKS`, `READ HIGH PRIORITY`, `READ NO INSERT`, `WRITE ALLOW WRITE`, `WRITE CONCURRENT INSERT`, `WRITE LOW PRIORITY` ou `WRITE`. Para obter informações sobre esses tipos de bloqueio, consulte o arquivo fonte `include/thr_lock.h`.

- `EXTERNAL_LOCK`

  O bloqueio da tabela utilizado no nível do motor de armazenamento. O valor é um dos `READ EXTERNAL` ou `WRITE EXTERNAL`.

A tabela `table_handles` tem esses índices:

- Chave primária em (`OBJECT_INSTANCE_BEGIN`)

- Índice sobre (`OBJECT_TYPE`, `OBJECT_SCHEMA`, `OBJECT_NAME`)

- Índice sobre (`OWNER_THREAD_ID`, `OWNER_EVENT_ID`)

`TRUNCATE TABLE` não é permitido para a tabela `table_handles`.
