#### 25.12.12.1 Tabela metadata_locks

O MySQL utiliza o bloqueio de metadados para gerenciar o acesso concorrente a objetos de banco de dados e garantir a consistência dos dados; veja Seção 8.11.4, “Bloqueio de Metadados”. O bloqueio de metadados não se aplica apenas a tabelas, mas também a esquemas, programas armazenados (procedimentos, funções, gatilhos, eventos agendados), espaços de tabelas, bloqueios de usuário adquiridos com a função `GET_LOCK()` (veja Seção 12.14, “Funções de Bloqueio”), e bloqueios adquiridos com o serviço de bloqueio descrito em Seção 5.5.6.1, “O Serviço de Bloqueio”.

O Schema de Desempenho expõe informações de bloqueio de metadados através da tabela `metadata_locks`:

- Lås que foram concedidos (mostra quais sessões possuem quais blocos de metadados atuais).

- Lås que foram solicitados, mas ainda não concedidos (mostra quais sessões estão aguardando quais bloqueios de metadados).

- Solicitações de bloqueio que foram eliminadas pelo detector de travamento.

- Pedidos de bloqueio que expiraram e estão aguardando que o pedido de bloqueio da sessão solicitante seja descartado.

Essas informações permitem que você entenda as dependências de bloqueio de metadados entre as sessões. Você pode ver não apenas qual bloqueio uma sessão está esperando, mas também qual sessão atualmente detém esse bloqueio.

A tabela `metadata_locks` é de leitura somente e não pode ser atualizada. Ela é dimensionada automaticamente por padrão; para configurar o tamanho da tabela, defina a variável de sistema `performance_schema_max_metadata_locks` na inicialização do servidor.

A instrumentação de bloqueio de metadados usa a ferramenta `wait/lock/metadata/sql/mdl`, que está desativada por padrão.

Para controlar o estado de instrumentação de bloqueio de metadados ao iniciar o servidor, use linhas como estas no seu arquivo `my.cnf`:

- Ativar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/lock/metadata/sql/mdl=ON'
  ```

- Desativar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/lock/metadata/sql/mdl=OFF'
  ```

Para controlar o estado de instrumentação de bloqueio de metadados em tempo de execução, atualize a tabela `setup_instruments`:

- Ativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'wait/lock/metadata/sql/mdl';
  ```

- Desativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'wait/lock/metadata/sql/mdl';
  ```

O Schema de Desempenho mantém o conteúdo da tabela `metadata_locks` (performance-schema-metadata-locks-table.html) da seguinte forma, usando a coluna `LOCK_STATUS` para indicar o status de cada bloqueio:

- Quando uma solicitação de bloqueio de metadados é solicitada e obtida imediatamente, uma linha com um status de `GRANTED` é inserida.

- Quando uma solicitação de bloqueio de metadados é feita e não é obtida imediatamente, uma linha com o status `PENDING` é inserida.

- Quando uma restrição de metadados solicitada anteriormente é concedida, seu status de linha é atualizado para `CONCEDIDA`.

- Quando uma restrição de metadados é liberada, sua linha é excluída.

- Quando um pedido de bloqueio pendente é cancelado pelo detector de impasses para quebrar um impasse (`ER_LOCK_DEADLOCK`), seu status de linha é atualizado de `PENDING` para `VICTIM`.

- Quando um pedido de bloqueio pendente expira (`ER_LOCK_WAIT_TIMEOUT`), o status da linha é atualizado de `PENDING` para `TIMEOUT`.

- Quando o pedido de bloqueio ou bloqueio pendente é cancelado, o status da linha é atualizado de `GRANTED` ou `PENDING` para `KILLED`.

- Os valores de status `VICTIM`, `TIMEOUT` e `KILLED` são breves e indicam que a linha de bloqueio está prestes a ser excluída.

- Os valores de status `PRE_ACQUIRE_NOTIFY` e `POST_RELEASE_NOTIFY` são breves e indicam que o subsistema de notificação de bloqueio de metadados está notificando os motores de armazenamento interessados enquanto executa operações de aquisição de bloqueio ou deixa operações de liberação de bloqueio. Esses valores de status foram adicionados no MySQL 5.7.11.

A tabela `metadata_locks` tem as seguintes colunas:

- `OBJETO_TIPO`

  O tipo de bloqueio utilizado no subsistema de bloqueio de metadados. O valor é um dos `GLOBAL`, `SCHEMA`, `TABLE`, `FUNCTION`, `PROCEDURE`, `TRIGGER` (atualmente não utilizado), `EVENT`, `COMMIT`, `USER LEVEL LOCK`, `TABLESPACE` ou `LOCKING SERVICE`.

  Um valor de `USER LEVEL LOCK` indica uma trava adquirida com `GET_LOCK()`. Um valor de `LOCKING SERVICE` indica uma trava adquirida com o serviço de bloqueio descrito na Seção 5.5.6.1, “O Serviço de Bloqueio”.

- `OBJECT_SCHEMA`

  O esquema que contém o objeto.

- `NOME_OBJETO`

  O nome do objeto instrumentado.

- `OBJECT_INSTANCE_BEGIN`

  O endereço na memória do objeto instrumentado.

- `LOCK_TYPE`

  O tipo de bloqueio do subsistema de bloqueio de metadados. O valor é `INTENTION_EXCLUSIVE`, `SHARED`, `SHARED_HIGH_PRIO`, `SHARED_READ`, `SHARED_WRITE`, `SHARED_UPGRADABLE`, `SHARED_NO_WRITE`, `SHARED_NO_READ_WRITE` ou `EXCLUSIVE`.

- `LOCK_DURATION`

  A duração do bloqueio do subsistema de bloqueio de metadados. O valor é `STATEMENT`, `TRANSACTION` ou `EXPLICIT`. Os valores `STATEMENT` e `TRANSACTION` indicam blocos que são liberados implicitamente no final da declaração ou da transação, respectivamente. O valor `EXPLICIT` indica blocos que sobrevivem ao final da declaração ou da transação e são liberados por ação explícita, como blocos globais adquiridos com `FLUSH TABLES WITH READ LOCK` (flush.html#flush-tables-with-read-lock).

- `LOCK_STATUS`

  O status do bloqueio do subsistema de bloqueio de metadados. O valor é um dos `PENDING`, `GRANTED`, `VICTIM`, `TIMEOUT`, `KILLED`, `PRE_ACQUIRE_NOTIFY` ou `POST_RELEASE_NOTIFY`. O Schema de Desempenho atribui esses valores conforme descrito anteriormente.

- `FONTE`

  O nome do arquivo fonte que contém o código instrumentado que produziu o evento e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido.

- `OWNER_THREAD_ID`

  O thread que solicita uma bloqueio de metadados.

- `OWNER_EVENT_ID`

  O evento que solicita uma bloqueio de metadados.

A operação `TRUNCATE TABLE` não é permitida para a tabela `metadata_locks`.
