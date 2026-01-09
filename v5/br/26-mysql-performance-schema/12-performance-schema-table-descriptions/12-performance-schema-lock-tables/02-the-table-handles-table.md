#### 25.12.12.2 A tabela_handles

O Schema de Desempenho expõe informações sobre bloqueios de tabela através da tabela `table_handles` para mostrar os bloqueios de tabela atualmente em vigor para cada handle de tabela aberto. O `table_handles` relata o que é registrado pela instrumentação de bloqueio de tabela. Essas informações mostram quais handles de tabela o servidor tem abertos, como eles estão bloqueados e por quais sessões.

A tabela `table_handles` é de leitura somente e não pode ser atualizada. Ela é dimensionada automaticamente por padrão; para configurar o tamanho da tabela, defina a variável de sistema `performance_schema_max_table_handles` na inicialização do servidor.

A instrumentação de bloqueio de tabela usa a ferramenta `wait/lock/table/sql/handler`, que está habilitada por padrão.

Para controlar o estado da instrumentação de bloqueio de tabela no início do servidor, use linhas como estas no seu arquivo `my.cnf`:

- Ativar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/lock/table/sql/handler=ON'
  ```

- Desativar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/lock/table/sql/handler=OFF'
  ```

Para controlar o estado do instrumento de bloqueio da tabela no tempo de execução, atualize a tabela `setup_instruments`:

- Ativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'wait/lock/table/sql/handler';
  ```

- Desativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'wait/lock/table/sql/handler';
  ```

A tabela `table_handles` tem as seguintes colunas:

- `OBJETO_TIPO`

  A mesa foi aberta com a alça da mesa.

- `OBJECT_SCHEMA`

  O esquema que contém o objeto.

- `NOME_OBJETO`

  O nome do objeto instrumentado.

- `OBJECT_INSTANCE_BEGIN`

  Endereço do cabo da mesa na memória.

- `OWNER_THREAD_ID`

  O fio que possui o manipulador da tabela.

- `OWNER_EVENT_ID`

  O evento que causou a abertura da alça da mesa.

- `INTERNAL_LOCK`

  O bloqueio de tabela usado no nível SQL. O valor é um dos `READ`, `READ WITH SHARED LOCKS`, `READ HIGH PRIORITY`, `READ NO INSERT`, `WRITE ALLOW WRITE`, `WRITE CONCURRENT INSERT`, `WRITE LOW PRIORITY` ou `WRITE`. Para obter informações sobre esses tipos de bloqueio, consulte o arquivo fonte `include/thr_lock.h`.

- `EXTERNAL_LOCK`

  O bloqueio de tabela utilizado no nível do motor de armazenamento. O valor é `READ EXTERNAL` ou `WRITE EXTERNAL`.

A operação `TRUNCATE TABLE` não é permitida para a tabela `table_handles`.
