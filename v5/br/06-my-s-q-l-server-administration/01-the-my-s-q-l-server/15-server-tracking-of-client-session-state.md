### 5.1.15 Rastreamento do servidor do estado da sessão do cliente

O servidor MySQL implementa vários rastreadores de estado de sessão. Um cliente pode habilitar esses rastreadores para receber notificações sobre as alterações no estado de sua sessão.

- Usos dos rastreadores de estado de sessão
- Rastreadores de estado de sessão disponíveis (session-state-tracking.html#session-state-tracking-notifications)
- Suporte ao Rastreador de Estado de Sessão da API C (session-state-tracking.html#session-state-tracking-capi-support)
- Suporte ao Rastreador de Estado de Sessão da Unidade de Testes (session-state-tracking.html#session-state-tracking-test-suite-support)

#### Usos dos rastreadores de estado de sessão

Os rastreadores de estado de sessão têm usos como esses:

- Para facilitar a migração de sessões.
- Para facilitar a troca de transações.

Um uso do mecanismo de rastreador é fornecer uma maneira para os conectores do MySQL e aplicativos cliente determinarem se há algum contexto de sessão disponível para permitir a migração de sessão de um servidor para outro. (Para alterar sessões em um ambiente balanceado, é necessário detectar se há estado de sessão a ser considerado ao decidir se pode ser feito um switch.)

Outro uso do mecanismo de rastreador é permitir que as aplicações saibam quando as transações podem ser movidas de uma sessão para outra. O rastreamento do estado das transações permite isso, o que é útil para aplicações que podem querer mover transações de um servidor ocupado para um que está menos carregado. Por exemplo, um conector de balanceamento de carga que gerencia um conjunto de conexões de cliente pode mover transações entre sessões disponíveis no conjunto.

No entanto, a troca de sessão não pode ser feita em momentos arbitrários. Se uma sessão estiver no meio de uma transação para a qual leituras ou escritas foram realizadas, a troca para uma sessão diferente implica em um rollback da transação na sessão original. Uma troca de sessão deve ser feita apenas quando uma transação ainda não tiver nenhuma leitura ou escrita realizada nela.

Exemplos de quando as transações podem ser razoavelmente interrompidas:

- Imediatamente após `START TRANSACTION`

- Após `COMMIT E CÍRCULO`

Além de conhecer o estado da transação, é útil conhecer as características da transação, para que as mesmas características sejam usadas se a transação for movida para uma sessão diferente. As seguintes características são relevantes para esse propósito:

```sql
READ ONLY
READ WRITE
ISOLATION LEVEL
WITH CONSISTENT SNAPSHOT
```

#### Rastreadores de estado de sessão disponíveis

Para suportar as atividades de rastreamento de sessões, a notificação está disponível para esses tipos de informações do estado de sessão do cliente:

- Alterações nestes atributos do estado da sessão do cliente:

  - O esquema padrão (banco de dados).
  - Valores específicos para sessão de variáveis do sistema.
  - Variáveis definidas pelo usuário.
  - Tabelas temporárias.
  - Declarações preparadas.

  A variável de sistema `session_track_state_change` controla este rastreador.

- Alterações no nome do esquema padrão. A variável de sistema `session_track_schema` controla este rastreador.

- Alterações nos valores de sessão das variáveis do sistema. A variável de sistema `session_track_system_variables` controla este rastreador.

- GTIDs disponíveis. A variável de sistema `session_track_gtids` controla este rastreador.

- Informações sobre o estado e as características da transação. A variável de sistema `session_track_transaction_info` controla este rastreador.

Para descrições das variáveis de sistema relacionadas ao rastreador, consulte Seção 5.1.7, “Variáveis de Sistema do Servidor”. Essas variáveis de sistema permitem controlar quais notificações de alterações ocorrem, mas não fornecem uma maneira de acessar as informações das notificações. A notificação ocorre no protocolo cliente/servidor do MySQL, que inclui informações do rastreador nos pacotes OK para que as alterações no estado da sessão possam ser detectadas.

#### Suporte ao rastreador de estado de sessão da API C

Para permitir que os aplicativos do cliente extraiam informações sobre mudanças de estado dos pacotes OK retornados pelo servidor, a API C do MySQL fornece um par de funções:

- `mysql_session_track_get_first()` recupera a primeira parte das informações de mudança de estado recebidas do servidor. Veja mysql\_session\_track\_get\_first().

- `mysql_session_track_get_next()` recupera qualquer informação de mudança de estado restante recebida do servidor. Após uma chamada bem-sucedida a `mysql_session_track_get_first()`, chame essa função repetidamente enquanto ela retornar sucesso. Veja mysql\_session\_track\_get\_next().

#### Suporte ao Rastreador de Estado de Sessão da Unidade de Testes

O programa **mysqltest** possui os comandos `disable_session_track_info` e `enable_session_track_info` que controlam se as notificações do rastreador de sessão ocorrem. Você pode usar esses comandos para ver, na linha de comando, quais são as notificações geradas por instruções SQL. Suponha que um arquivo `testscript` contenha o seguinte script do **mysqltest**:

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

Execute o script da seguinte forma para ver as informações fornecidas pelos rastreadores habilitados. Para uma descrição das informações `Tracker:` exibidas pelo **mysqltest** para os vários rastreadores, consulte mysql\_session\_track\_get\_first().

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

Antes da declaração `START TRANSACTION`, duas declarações `SET TRANSACTION` são executadas, definindo o nível de isolamento e as características do modo de acesso para a próxima transação. O valor `SESSION_TRACK_TRANSACTION_CHARACTERISTICS` indica esses valores para a próxima transação que foram definidos.

Após a declaração `COMMIT` que encerra a transação, o valor `SESSION_TRACK_TRANSACTION_CHARACTERISTICS` é relatado como vazio. Isso indica que as características da próxima transação que foram definidas antes do início da transação foram redefinidas e que os padrões da sessão se aplicam. Para acompanhar as alterações nesses padrões da sessão, acompanhe os valores da sessão das variáveis de sistema `[transaction_isolation]` (server-system-variables.html#sysvar\_transaction\_isolation) e `transaction_read_only` (server-system-variables.html#sysvar\_transaction\_read\_only).

Para ver informações sobre GTIDs, habilite o rastreador `SESSION_TRACK_GTIDS` usando a variável de sistema `session_track_gtids` (server-system-variables.html#sysvar\_session\_track\_gtids).
