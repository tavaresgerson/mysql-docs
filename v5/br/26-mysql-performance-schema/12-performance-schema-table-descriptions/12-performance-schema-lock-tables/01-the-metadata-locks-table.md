#### 25.12.12.1 A Tabela metadata_locks

O MySQL usa *metadata locking* para gerenciar o acesso concorrente a objetos de *Database* e garantir a consistência dos dados; consulte [Seção 8.11.4, “Metadata Locking”](metadata-locking.html "8.11.4 Metadata Locking"). O *metadata locking* aplica-se não apenas a tabelas, mas também a *schemas*, programas armazenados (*procedures*, *functions*, *triggers*, eventos agendados), *tablespaces*, *user locks* adquiridos com a função [`GET_LOCK()`](locking-functions.html#function_get-lock) (consulte [Seção 12.14, “Funções de Locking”](locking-functions.html "12.14 Funções de Locking")), e *locks* adquiridos com o serviço de *locking* descrito em [Seção 5.5.6.1, “O Serviço de Locking”](locking-service.html "5.5.6.1 O Serviço de Locking").

O Performance Schema expõe informações de *metadata lock* através da tabela [`metadata_locks`]:

* *Locks* que foram concedidos (mostra quais sessões possuem quais *metadata locks* atuais).

* *Locks* que foram solicitados, mas ainda não concedidos (mostra quais sessões estão esperando por quais *metadata locks*).

* Solicitações de *Lock* que foram interrompidas (*killed*) pelo detector de *deadlock*.

* Solicitações de *Lock* que expiraram (*timed out*) e estão esperando que a solicitação de *lock* da sessão solicitante seja descartada.

Essa informação permite que você entenda as dependências de *metadata lock* entre sessões. Você pode ver não apenas qual *lock* uma sessão está esperando, mas também qual sessão atualmente detém esse *lock*.

A tabela [`metadata_locks`] é somente leitura (*read only*) e não pode ser atualizada. Ela tem tamanho automático (*autosized*) por padrão; para configurar o tamanho da tabela, defina a variável de sistema [`performance_schema_max_metadata_locks`] na inicialização do servidor.

A instrumentação de *metadata lock* usa o instrumento `wait/lock/metadata/sql/mdl`, que é desabilitado por padrão.

Para controlar o estado da instrumentação de *metadata lock* na inicialização do servidor, use linhas como estas no seu arquivo `my.cnf`:

* Habilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/lock/metadata/sql/mdl=ON'
  ```

* Desabilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/lock/metadata/sql/mdl=OFF'
  ```

Para controlar o estado da instrumentação de *metadata lock* em tempo de execução (*runtime*), atualize a tabela [`setup_instruments`]:

* Habilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'wait/lock/metadata/sql/mdl';
  ```

* Desabilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'wait/lock/metadata/sql/mdl';
  ```

O Performance Schema mantém o conteúdo da tabela [`metadata_locks`] da seguinte forma, usando a coluna `LOCK_STATUS` para indicar o status de cada *lock*:

* Quando um *metadata lock* é solicitado e obtido imediatamente, uma linha com status `GRANTED` é inserida.

* Quando um *metadata lock* é solicitado e não é obtido imediatamente, uma linha com status `PENDING` é inserida.

* Quando um *metadata lock* solicitado anteriormente é concedido, o status de sua linha é atualizado para `GRANTED`.

* Quando um *metadata lock* é liberado, sua linha é excluída.
* Quando uma solicitação de *lock* pendente é cancelada pelo detector de *deadlock* para interromper um *deadlock* ([`ER_LOCK_DEADLOCK`]), o status de sua linha é atualizado de `PENDING` para `VICTIM`.

* Quando uma solicitação de *lock* pendente expira ([`ER_LOCK_WAIT_TIMEOUT`]), o status de sua linha é atualizado de `PENDING` para `TIMEOUT`.

* Quando um *lock* concedido ou uma solicitação de *lock* pendente é interrompida (*killed*), o status de sua linha é atualizado de `GRANTED` ou `PENDING` para `KILLED`.

* Os valores de status `VICTIM`, `TIMEOUT` e `KILLED` são breves e significam que a linha do *lock* está prestes a ser excluída.

* Os valores de status `PRE_ACQUIRE_NOTIFY` e `POST_RELEASE_NOTIFY` são breves e significam que o subsistema de *metadata locking* está notificando os *storage engines* interessados ao entrar em operações de aquisição de *lock* ou ao sair de operações de liberação de *lock*. Esses valores de status foram adicionados no MySQL 5.7.11.

A tabela [`metadata_locks`] possui as seguintes colunas:

* `OBJECT_TYPE`

  O tipo de *lock* usado no subsistema de *metadata lock*. O valor é um de `GLOBAL`, `SCHEMA`, `TABLE`, `FUNCTION`, `PROCEDURE`, `TRIGGER` (atualmente não utilizado), `EVENT`, `COMMIT`, `USER LEVEL LOCK`, `TABLESPACE`, ou `LOCKING SERVICE`.

  Um valor de `USER LEVEL LOCK` indica um *lock* adquirido com [`GET_LOCK()`]. Um valor de `LOCKING SERVICE` indica um *lock* adquirido com o serviço de *locking* descrito em [Seção 5.5.6.1, “O Serviço de Locking”].

* `OBJECT_SCHEMA`

  O *Schema* que contém o objeto.

* `OBJECT_NAME`

  O nome do objeto instrumentado.

* `OBJECT_INSTANCE_BEGIN`

  O endereço na memória do objeto instrumentado.

* `LOCK_TYPE`

  O tipo de *lock* do subsistema de *metadata lock*. O valor é um de `INTENTION_EXCLUSIVE`, `SHARED`, `SHARED_HIGH_PRIO`, `SHARED_READ`, `SHARED_WRITE`, `SHARED_UPGRADABLE`, `SHARED_NO_WRITE`, `SHARED_NO_READ_WRITE`, ou `EXCLUSIVE`.

* `LOCK_DURATION`

  A duração do *lock* do subsistema de *metadata lock*. O valor é um de `STATEMENT`, `TRANSACTION`, ou `EXPLICIT`. Os valores `STATEMENT` e `TRANSACTION` significam *locks* que são liberados implicitamente ao final da *statement* ou da *transaction*, respectivamente. O valor `EXPLICIT` significa *locks* que sobrevivem ao final da *statement* ou da *transaction* e são liberados por ação explícita, como *global locks* adquiridos com [`FLUSH TABLES WITH READ LOCK`].

* `LOCK_STATUS`

  O status do *lock* do subsistema de *metadata lock*. O valor é um de `PENDING`, `GRANTED`, `VICTIM`, `TIMEOUT`, `KILLED`, `PRE_ACQUIRE_NOTIFY`, ou `POST_RELEASE_NOTIFY`. O Performance Schema atribui esses valores conforme descrito anteriormente.

* `SOURCE`

  O nome do arquivo fonte contendo o código instrumentado que produziu o evento e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique o código fonte para determinar exatamente qual código está envolvido.

* `OWNER_THREAD_ID`

  A *Thread* solicitando um *metadata lock*.

* `OWNER_EVENT_ID`

  O evento solicitando um *metadata lock*.

O comando [`TRUNCATE TABLE`] não é permitido para a tabela [`metadata_locks`].