#### 29.12.13.3 A tabela de bloqueios de metadados

O MySQL utiliza o bloqueio de metadados para gerenciar o acesso concorrente a objetos do banco de dados e garantir a consistência dos dados; veja a Seção 10.11.4, “Bloqueio de Metadados”. O bloqueio de metadados aplica-se não apenas a tabelas, mas também a esquemas, programas armazenados (procedimentos, funções, gatilhos, eventos agendados), espaços de tabelas, bloqueios de usuário adquiridos com a função `GET_LOCK()` (veja a Seção 14.14, “Funções de Bloqueio”) e bloqueios adquiridos com o serviço de bloqueio descrito na Seção 7.6.8.1, “O Serviço de Bloqueio”.

O Schema de Desempenho expõe informações de bloqueio de metadados através da tabela `metadata_locks`:

* Bloqueios que foram concedidos (mostra quais sessões possuem quais bloqueios de metadados atuais).

* Bloqueios que foram solicitados, mas ainda não concedidos (mostra quais sessões estão aguardando quais bloqueios de metadados).

* Solicitações de bloqueio que foram eliminadas pelo detector de impasses.

* Solicitações de bloqueio que expiraram e estão aguardando que a solicitação de bloqueio da sessão solicitante seja descartada.

Essas informações permitem que você entenda as dependências de bloqueio de metadados entre as sessões. Você pode ver não apenas qual bloqueio uma sessão está aguardando, mas também qual sessão atualmente detém esse bloqueio.

A tabela `metadata_locks` é somente de leitura e não pode ser atualizada. Ela é autodimensionada por padrão; para configurar o tamanho da tabela, defina a variável de sistema `performance_schema_max_metadata_locks` no início do servidor.

A instrumentação de bloqueio de metadados usa o instrumento `wait/lock/metadata/sql/mdl`, que está habilitado por padrão.

Para controlar o estado da instrumentação de bloqueio de metadados no início do servidor, use linhas como estas no seu arquivo `my.cnf`:

* Habilitar:

  ```
  [mysqld]
  performance-schema-instrument='wait/lock/metadata/sql/mdl=ON'
  ```

* Desabilitar:

  ```
  [mysqld]
  performance-schema-instrument='wait/lock/metadata/sql/mdl=OFF'
  ```

Para controlar o estado da instrumentação de bloqueio de metadados no tempo de execução, atualize a tabela `setup_instruments`:

* Habilitar:
```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'wait/lock/metadata/sql/mdl';
  ```
```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'wait/lock/metadata/sql/mdl';
  ```


O Schema de Desempenho mantém o conteúdo da tabela `metadata_locks` da seguinte forma, usando a coluna `LOCK_STATUS` para indicar o status de cada bloqueio:

* Quando um bloqueio de metadados é solicitado e obtido imediatamente, uma linha com um status de `GRANTED` é inserida.

* Quando um bloqueio de metadados é solicitado e não obtido imediatamente, uma linha com um status de `PENDING` é inserida.

* Quando um bloqueio de metadados solicitado anteriormente é concedido, seu status de linha é atualizado para `GRANTED`.

* Quando um bloqueio de metadados é liberado, sua linha é excluída.
* Quando um pedido de bloqueio pendente é cancelado pelo detector de deadlock para quebrar um deadlock (`ER_LOCK_DEADLOCK`), seu status de linha é atualizado de `PENDING` para `VICTIM`.

* Quando um pedido de bloqueio pendente expira (`ER_LOCK_WAIT_TIMEOUT`), seu status de linha é atualizado de `PENDING` para `TIMEOUT`.

* Quando um bloqueio concedido ou pedido de bloqueio pendente é interrompido, seu status de linha é atualizado de `GRANTED` ou `PENDING` para `KILLED`.

* Os valores de status `VICTIM`, `TIMEOUT` e `KILLED` são breves e significam que a linha de bloqueio está prestes a ser excluída.

* Os valores de status `PRE_ACQUIRE_NOTIFY` e `POST_RELEASE_NOTIFY` são breves e significam que o subsistema de bloqueio de metadados está notificando os motores de armazenamento interessados enquanto entra em operações de aquisição de bloqueio ou sai de operações de liberação de bloqueio.

A tabela `metadata_locks` tem essas colunas:

* `OBJECT_TYPE`

  O tipo de bloqueio usado no subsistema de bloqueio de metadados. O valor é um dos `GLOBAL`, `SCHEMA`, `TABLE`, `FUNCTION`, `PROCEDURE`, `TRIGGER` (atualmente inutilizado), `EVENT`, `COMMIT`, `USER LEVEL LOCK`, `TABLESPACE`, `BACKUP LOCK` ou `LOCKING SERVICE`.

Um valor de `USER LEVEL LOCK` indica uma bloqueador adquirido com `GET_LOCK()`. Um valor de `LOCKING SERVICE` indica um bloqueador adquirido com o serviço de bloqueio descrito na Seção 7.6.8.1, “O Serviço de Bloqueio”.

* `OBJECT_SCHEMA`

  O esquema que contém o objeto.

* `OBJECT_NAME`

  O nome do objeto instrumentado.

* `OBJECT_INSTANCE_BEGIN`

  O endereço na memória do objeto instrumentado.

* `LOCK_TYPE`

  O tipo de bloqueio do subsistema de bloqueio de metadados. O valor é um dos `INTENTION_EXCLUSIVE`, `SHARED`, `SHARED_HIGH_PRIO`, `SHARED_READ`, `SHARED_WRITE`, `SHARED_UPGRADABLE`, `SHARED_NO_WRITE`, `SHARED_NO_READ_WRITE` ou `EXCLUSIVE`.

* `LOCK_DURATION`

  A duração do bloqueio do subsistema de bloqueio de metadados. O valor é um dos `STATEMENT`, `TRANSACTION` ou `EXPLICIT`. Os valores `STATEMENT` e `TRANSACTION` significam bloqueadores que são liberados implicitamente no final da declaração ou transação, respectivamente. O valor `EXPLICIT` significa bloqueadores que sobrevivem ao final da declaração ou transação e são liberados por ação explícita, como bloqueadores globais adquiridos com `FLUSH TABLES WITH READ LOCK`.

* `LOCK_STATUS`

  O status do bloqueio do subsistema de bloqueio de metadados. O valor é um dos `PENDING`, `GRANTED`, `VICTIM`, `TIMEOUT`, `KILLED`, `PRE_ACQUIRE_NOTIFY` ou `POST_RELEASE_NOTIFY`. O Schema de Desempenho atribui esses valores conforme descrito anteriormente.

* `SOURCE`

  O nome do arquivo fonte que contém o código instrumentado que produziu o evento e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido.

* `OWNER_THREAD_ID`

  O thread solicitando um bloqueio de metadados.

* `OWNER_EVENT_ID`

  O evento solicitando um bloqueio de metadados.

A tabela `metadata_locks` tem esses índices:

* Chave primária em (`OBJECT_INSTANCE_BEGIN`)
* Índice em (`OBJECT_TYPE`, `OBJECT_SCHEMA`, `OBJECT_NAME`)
* Índice em (`OWNER_THREAD_ID`, `OWNER_EVENT_ID`)

A operação `TRUNCATE TABLE` não é permitida para a tabela `metadata_locks`.