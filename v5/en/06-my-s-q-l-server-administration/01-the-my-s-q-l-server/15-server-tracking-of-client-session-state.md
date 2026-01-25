### 5.1.15 Rastreamento do Estado da Sessão do Cliente pelo Servidor

O servidor MySQL implementa vários rastreadores (*trackers*) de estado de sessão. Um cliente pode habilitar esses rastreadores para receber notificação de alterações no estado de sua sessão.

* [Usos para Rastreamento de Estado de Sessão](session-state-tracking.html#session-state-tracking-uses "Usos para Rastreamento de Estado de Sessão")
* [Rastreadores de Estado de Sessão Disponíveis](session-state-tracking.html#session-state-tracking-notifications "Rastreadores de Estado de Sessão Disponíveis")
* [Suporte a Rastreador de Estado de Sessão na API C](session-state-tracking.html#session-state-tracking-capi-support "Suporte a Rastreador de Estado de Sessão na API C")
* [Suporte a Rastreador de Estado de Sessão no Test Suite](session-state-tracking.html#session-state-tracking-test-suite-support "Suporte a Rastreador de Estado de Sessão no Test Suite")

#### Usos para Rastreamento de Estado de Sessão

Os rastreadores de estado de sessão têm usos como estes:

* Para facilitar a migração de sessão.
* Para facilitar a troca (*switching*) de transaction.

Um uso para o mecanismo de rastreamento é fornecer um meio para que conectores MySQL e aplicações cliente determinem se algum contexto de sessão está disponível para permitir a migração de sessão de um servidor para outro. (Para trocar sessões em um ambiente com balanceamento de carga, é necessário detectar se existe um estado de sessão a ser levado em consideração ao decidir se uma troca pode ser feita.)

Outro uso para o mecanismo de rastreamento é permitir que aplicações saibam quando transactions podem ser movidas de uma sessão para outra. O rastreamento do estado de Transaction permite isso, o que é útil para aplicações que desejam mover transactions de um servidor ocupado para um com menos carga. Por exemplo, um conector de balanceamento de carga gerenciando um *connection pool* de clientes poderia mover transactions entre sessões disponíveis no *pool*.

No entanto, a troca de sessão não pode ser feita em momentos arbitrários. Se uma sessão estiver no meio de uma transaction para a qual leituras ou escritas foram realizadas, a troca para uma sessão diferente implica um *rollback* da transaction na sessão original. Uma troca de sessão deve ser feita apenas quando uma transaction ainda não tiver nenhuma leitura ou escrita executada dentro dela.

Exemplos de quando transactions podem ser razoavelmente trocadas:

* Imediatamente após [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")

* Após [`COMMIT AND CHAIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")

Além de conhecer o estado da transaction, é útil saber as características da transaction, para usar as mesmas características caso a transaction seja movida para uma sessão diferente. As seguintes características são relevantes para este propósito:

```sql
READ ONLY
READ WRITE
ISOLATION LEVEL
WITH CONSISTENT SNAPSHOT
```

#### Rastreadores de Estado de Sessão Disponíveis

Para suportar as atividades de rastreamento de sessão, a notificação está disponível para estes tipos de informações de estado de sessão do cliente:

* Alterações nestes atributos do estado da sessão do cliente:

  + O *schema* (Database) padrão.
  + Valores específicos da sessão para *system variables*.
  + *User-defined variables*.
  + Tabelas temporárias.
  + *Prepared statements*.

  A *system variable* [`session_track_state_change`](server-system-variables.html#sysvar_session_track_state_change) controla este rastreador.

* Alterações no nome do *schema* padrão. A *system variable* [`session_track_schema`](server-system-variables.html#sysvar_session_track_schema) controla este rastreador.

* Alterações nos valores de sessão de *system variables*. A *system variable* [`session_track_system_variables`](server-system-variables.html#sysvar_session_track_system_variables) controla este rastreador.

* GTIDs disponíveis. A *system variable* [`session_track_gtids`](server-system-variables.html#sysvar_session_track_gtids) controla este rastreador.

* Informações sobre o estado e características da transaction. A *system variable* [`session_track_transaction_info`](server-system-variables.html#sysvar_session_track_transaction_info) controla este rastreador.

Para descrições das *system variables* relacionadas ao rastreador, consulte [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"). Essas *system variables* permitem o controle sobre quais notificações de alteração ocorrem, mas não fornecem uma maneira de acessar as informações de notificação. A notificação ocorre no protocolo cliente/servidor MySQL, que inclui informações do rastreador em *OK packets* para que as mudanças de estado da sessão possam ser detectadas.

#### Suporte a Rastreador de Estado de Sessão na API C

Para permitir que as aplicações cliente extraiam informações de mudança de estado dos *OK packets* retornados pelo servidor, a API C do MySQL fornece um par de funções:

* [`mysql_session_track_get_first()`](/doc/c-api/5.7/en/mysql-session-track-get-first.html) busca a primeira parte da informação de mudança de estado recebida do servidor. Consulte [mysql_session_track_get_first()](/doc/c-api/5.7/en/mysql-session-track-get-first.html).

* [`mysql_session_track_get_next()`](/doc/c-api/5.7/en/mysql-session-track-get-next.html) busca qualquer informação de mudança de estado restante recebida do servidor. Após uma chamada bem-sucedida a [`mysql_session_track_get_first()`](/doc/c-api/5.7/en/mysql-session-track-get-first.html), chame esta função repetidamente enquanto ela retornar sucesso. Consulte [mysql_session_track_get_next()](/doc/c-api/5.7/en/mysql-session-track-get-next.html).

#### Suporte a Rastreador de Estado de Sessão no Test Suite

O programa **mysqltest** possui os comandos `disable_session_track_info` e `enable_session_track_info` que controlam se as notificações do rastreador de sessão ocorrem. Você pode usar esses comandos para ver na linha de comando quais notificações as *SQL statements* produzem. Suponha que um arquivo `testscript` contenha o seguinte script **mysqltest**:

```sql
DROP TABLE IF EXISTS test.t1;
CREATE TABLE test.t1 (i INT, f FLOAT);
--enable_session_track_info
SET @@SESSION.session_track_schema=ON;
SET @@SESSION.session_track_system_variables='*';
SET @@SESSION.session_track_state_change=ON;
USE information_schema;
SET NAMES 'utf8mb4';
SET @@SESSION.session_track_transaction_info='CHARACTERISTICS';
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET TRANSACTION READ WRITE;
START TRANSACTION;
SELECT 1;
INSERT INTO test.t1 () VALUES();
INSERT INTO test.t1 () VALUES(1, RAND());
COMMIT;
```

Execute o script da seguinte forma para ver as informações fornecidas pelos rastreadores habilitados. Para uma descrição da informação `Tracker:` exibida pelo **mysqltest** para os vários rastreadores, consulte [mysql_session_track_get_first()](/doc/c-api/5.7/en/mysql-session-track-get-first.html).

```sql
$> mysqltest < testscript
DROP TABLE IF EXISTS test.t1;
CREATE TABLE test.t1 (i INT, f FLOAT);
SET @@SESSION.session_track_schema=ON;
SET @@SESSION.session_track_system_variables='*';
-- Tracker : SESSION_TRACK_SYSTEM_VARIABLES
-- session_track_system_variables
-- *

SET @@SESSION.session_track_state_change=ON;
-- Tracker : SESSION_TRACK_SYSTEM_VARIABLES
-- session_track_state_change
-- ON

USE information_schema;
-- Tracker : SESSION_TRACK_SCHEMA
-- information_schema

-- Tracker : SESSION_TRACK_STATE_CHANGE
-- 1

SET NAMES 'utf8mb4';
-- Tracker : SESSION_TRACK_SYSTEM_VARIABLES
-- character_set_client
-- utf8mb4
-- character_set_connection
-- utf8mb4
-- character_set_results
-- utf8mb4

-- Tracker : SESSION_TRACK_STATE_CHANGE
-- 1

SET @@SESSION.session_track_transaction_info='CHARACTERISTICS';
-- Tracker : SESSION_TRACK_SYSTEM_VARIABLES
-- session_track_transaction_info
-- CHARACTERISTICS

-- Tracker : SESSION_TRACK_STATE_CHANGE
-- 1

-- Tracker : SESSION_TRACK_TRANSACTION_CHARACTERISTICS
--

-- Tracker : SESSION_TRACK_TRANSACTION_STATE
-- ________

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- Tracker : SESSION_TRACK_TRANSACTION_CHARACTERISTICS
-- SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET TRANSACTION READ WRITE;
-- Tracker : SESSION_TRACK_TRANSACTION_CHARACTERISTICS
-- SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; SET TRANSACTION READ WRITE;

START TRANSACTION;
-- Tracker : SESSION_TRACK_TRANSACTION_CHARACTERISTICS
-- SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; START TRANSACTION READ WRITE;

-- Tracker : SESSION_TRACK_TRANSACTION_STATE
-- T_______

SELECT 1;
1
1
-- Tracker : SESSION_TRACK_TRANSACTION_STATE
-- T_____S_

INSERT INTO test.t1 () VALUES();
-- Tracker : SESSION_TRACK_TRANSACTION_STATE
-- T___W_S_

INSERT INTO test.t1 () VALUES(1, RAND());
-- Tracker : SESSION_TRACK_TRANSACTION_STATE
-- T___WsS_

COMMIT;
-- Tracker : SESSION_TRACK_TRANSACTION_CHARACTERISTICS
--

-- Tracker : SESSION_TRACK_TRANSACTION_STATE
-- ________

ok
```

Precedendo a *statement* [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), duas *statements* [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") são executadas que definem o nível de *isolation* e as características do modo de acesso para a próxima transaction. O valor `SESSION_TRACK_TRANSACTION_CHARACTERISTICS` indica os valores de próxima-transaction que foram definidos.

Após a *statement* [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") que encerra a transaction, o valor `SESSION_TRACK_TRANSACTION_CHARACTERISTICS` é reportado como vazio. Isso indica que as características de próxima-transaction que foram definidas antes do início da transaction foram redefinidas e que os *defaults* da sessão se aplicam. Para rastrear alterações nesses *defaults* de sessão, rastreie os valores de sessão das *system variables* [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) e [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only).

Para ver informações sobre GTIDs, habilite o rastreador `SESSION_TRACK_GTIDS` usando a *system variable* [`session_track_gtids`](server-system-variables.html#sysvar_session_track_gtids).