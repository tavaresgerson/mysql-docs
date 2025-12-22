### 7.1.18 Rastreamento do servidor do estado da sessão do cliente

O servidor MySQL implementa vários rastreadores de estado de sessão. Um cliente pode ativar esses rastreadores para receber notificações de alterações em seu estado de sessão.

- Utilizações para rastreadores de estado de sessão
- Rastreadores de estado de sessão disponíveis
- Suporte de rastreador de estado de sessão C API
- Suporte ao rastreador de estado de sessão da suite de testes

#### Utilizações para rastreadores de estado de sessão

Os rastreadores de estado de sessão têm usos como estes:

- Para facilitar a migração de sessões.
- Para facilitar a troca de transacções.

O mecanismo de rastreamento fornece um meio para conectores MySQL e aplicativos cliente para determinar se qualquer contexto de sessão está disponível para permitir a migração de sessão de um servidor para outro.

O mecanismo de rastreamento permite que os aplicativos saibam quando as transações podem ser movidas de uma sessão para outra. O rastreamento do estado da transação permite isso, o que é útil para aplicativos que desejam mover transações de um servidor ocupado para um que esteja menos carregado. Por exemplo, um conector de balanceamento de carga gerenciando um pool de conexões de cliente poderia mover transações entre as sessões disponíveis no pool.

No entanto, a troca de sessão não pode ser feita em horários arbitrários. Se uma sessão está no meio de uma transação para a qual leituras ou gravações foram feitas, mudar para uma sessão diferente implica um rollback de transação na sessão original. Uma troca de sessão deve ser feita apenas quando uma transação ainda não tem leituras ou gravações executadas dentro dela.

Exemplos de situações em que a troca de operações pode ser razoavelmente efetuada:

- Imediatamente após `START TRANSACTION`
- Depois de `COMMIT AND CHAIN`

Para além de conhecer o estado da transacção, é útil conhecer as características da transacção, de modo a utilizar as mesmas características se a transacção for transferida para uma sessão diferente.

```
READ ONLY
READ WRITE
ISOLATION LEVEL
WITH CONSISTENT SNAPSHOT
```

#### Rastreadores de estado de sessão disponíveis

Para apoiar as atividades de acompanhamento de sessões, está disponível uma notificação para os seguintes tipos de informações sobre o estado da sessão do cliente:

- Alterações destes atributos do estado da sessão do cliente:

  - O esquema padrão (base de dados).
  - Valores específicos da sessão para as variáveis do sistema.
  - Variáveis definidas pelo utilizador.
  - Mesas temporárias.
  - Declarações preparadas.

  A variável do sistema `session_track_state_change` controla este rastreador.
- Alterações no nome do esquema padrão. A variável do sistema `session_track_schema` controla este rastreador.
- Mudanças nos valores de sessão das variáveis do sistema. A variável do sistema `session_track_system_variables` controla este rastreador. O privilégio `SENSITIVE_VARIABLES_OBSERVER` é necessário para rastrear mudanças nos valores das variáveis sensíveis do sistema.
- GTIDs disponíveis. A variável do sistema `session_track_gtids` controla este rastreador.
- Informações sobre o estado e as características da transação. A variável do sistema `session_track_transaction_info` controla este rastreador.

Para descrições das variáveis de sistema relacionadas ao rastreador, consulte a Seção 7.1.8, "Variáveis do Sistema do Servidor". Essas variáveis do sistema permitem o controle sobre quais notificações de mudança ocorrem, mas não fornecem uma maneira de acessar informações de notificação. A notificação ocorre no protocolo cliente / servidor MySQL, que inclui informações de rastreador em pacotes OK para que as mudanças de estado de sessão possam ser detectadas.

#### Suporte de rastreador de estado de sessão C API

Para permitir que os aplicativos do cliente extraiam informações de mudança de estado dos pacotes OK retornados pelo servidor, a API do MySQL C fornece um par de funções:

- `mysql_session_track_get_first()` obtém a primeira parte da informação de mudança de estado recebida do servidor. Veja mysql\_session\_track\_get\_first (().
- `mysql_session_track_get_next()` retira qualquer informação de mudança de estado restante recebida do servidor. Após uma chamada bem-sucedida para `mysql_session_track_get_first()`, chame esta função repetidamente desde que retorne sucesso. Veja mysql\_session\_track\_get\_next ().

#### Suporte ao rastreador de estado de sessão da suite de testes

O programa **mysqltest** tem comandos `disable_session_track_info` e `enable_session_track_info` que controlam se ocorrem notificações de rastreador de sessão. Você pode usar esses comandos para ver a partir da linha de comando quais notificações as instruções SQL produzem. Suponha que um arquivo `testscript` contenha o seguinte script **mysqltest**:

```
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

Execute o script da seguinte forma para ver as informações fornecidas pelos rastreadores habilitados. Para uma descrição das informações `Tracker:` exibidas pelo **mysqltest** para os vários rastreadores, consulte mysql\_session\_track\_get\_first (().

```
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

Antes da instrução `START TRANSACTION`, duas instruções `SET TRANSACTION` são executadas que definem o nível de isolamento e as características do modo de acesso para a próxima transação. O valor `SESSION_TRACK_TRANSACTION_CHARACTERISTICS` indica os valores da próxima transação que foram definidos.

Após a instrução `COMMIT` que encerra a transação, o valor `SESSION_TRACK_TRANSACTION_CHARACTERISTICS` é reportado como vazio. Isso indica que as características da próxima transação que foram definidas antes do início da transação foram redefinidas e que os padrões de sessão se aplicam. Para rastrear mudanças nesses padrões de sessão, rastreie os valores de sessão das variáveis de sistema `transaction_isolation` e `transaction_read_only`.

Para ver informações sobre GTIDs, habilite o rastreador `SESSION_TRACK_GTIDS` usando a variável de sistema `session_track_gtids`.
