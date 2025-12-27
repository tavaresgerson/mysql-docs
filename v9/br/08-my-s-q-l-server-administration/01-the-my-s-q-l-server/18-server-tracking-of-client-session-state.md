### 7.1.18 Rastreamento do Estado da Sessão do Cliente

O servidor MySQL implementa vários rastreadores de estado de sessão. Um cliente pode habilitar esses rastreadores para receber notificações sobre alterações no estado de sua sessão.

* Usos dos Rastreadores de Estado de Sessão
* Rastreadores de Estado de Sessão Disponíveis
* Suporte ao Rastreador de Estado de Sessão da API C
* Suporte ao Rastreador de Estado de Sessão da Suíte de Testes

#### Usos dos Rastreadores de Estado de Sessão

Os rastreadores de estado de sessão têm usos como estes:

* Facilitar a migração de sessões.
* Facilitar a alternância de transações.

O mecanismo de rastreador fornece uma maneira para os conectores do MySQL e aplicativos cliente determinarem se há algum contexto de sessão disponível para permitir a migração de sessões de um servidor para outro. (Para alterar sessões em um ambiente balanceado, é necessário detectar se há estado de sessão para considerar ao decidir se uma alternância pode ser feita.)

O mecanismo de rastreador permite que os aplicativos saibam quando as transações podem ser movidas de uma sessão para outra. O rastreamento do estado da transação permite isso, o que é útil para aplicativos que podem desejar mover transações de um servidor ocupado para um que está menos carregado. Por exemplo, um conector de balanceamento de carga gerenciando um pool de conexões de cliente poderia mover transações entre sessões disponíveis no pool.

No entanto, a alternância de sessões não pode ser feita em momentos arbitrários. Se uma sessão estiver no meio de uma transação para a qual leituras ou escritas foram feitas, a alternância para uma sessão diferente implica um rollback da transação na sessão original. Uma alternância de sessão deve ser feita apenas quando uma transação ainda não tiver nenhuma leitura ou escrita realizada dentro dela.

Exemplos de quando as transações podem ser razoavelmente alternadas:

* Imediatamente após `START TRANSACTION`
* Após `COMMIT AND CHAIN`

Além de conhecer o estado da transação, é útil saber as características da transação, para que as mesmas características possam ser usadas se a transação for movida para uma sessão diferente. As seguintes características são relevantes para esse propósito:

```
READ ONLY
READ WRITE
ISOLATION LEVEL
WITH CONSISTENT SNAPSHOT
```

#### Rastreadores de Estado de Sessão Disponíveis

Para suportar as atividades de rastreamento de sessão, a notificação está disponível para esses tipos de informações de estado de sessão do cliente:

* Alterações nesses atributos do estado de sessão do cliente:

  + O esquema padrão (banco de dados).
  + Valores específicos da sessão para variáveis do sistema.
  + Variáveis definidas pelo usuário.
  + Tabelas temporárias.
  + Instruções preparadas.

A variável de sistema `session_track_state_change` controla este rastreador.

* Alterações no nome do nome do esquema padrão. A variável de sistema `session_track_schema` controla este rastreador.

* Alterações nos valores das variáveis do sistema da sessão. A variável de sistema `session_track_system_variables` controla este rastreador. O privilégio `SENSITIVE_VARIABLES_OBSERVER` é necessário para rastrear alterações nos valores das variáveis de sistema sensíveis.

* GTIDs disponíveis. A variável de sistema `session_track_gtids` controla este rastreador.

* Informações sobre o estado e as características da transação. A variável de sistema `session_track_transaction_info` controla este rastreador.

Para descrições das variáveis de sistema relacionadas ao rastreador, consulte a Seção 7.1.8, “Variáveis de Sistema do Servidor”. Essas variáveis de sistema permitem controlar quais notificações de mudança ocorrem, mas não fornecem uma maneira de acessar as informações da notificação. A notificação ocorre no protocolo cliente/servidor do MySQL, que inclui informações do rastreador em pacotes OK para que as mudanças no estado da sessão possam ser detectadas.

#### Suporte ao Rastreador de Estado de Sessão da API C
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

Para permitir que os aplicativos do cliente extraiam informações sobre mudanças de estado dos pacotes OK retornados pelo servidor, a API C do MySQL fornece um par de funções:

* `mysql_session_track_get_first()` recupera a primeira parte das informações sobre mudanças de estado recebidas do servidor. Veja mysql\_session\_track\_get\_first().

* `mysql_session_track_get_next()` recupera quaisquer informações sobre mudanças de estado restantes recebidas do servidor. Após uma chamada bem-sucedida a `mysql_session_track_get_first()`, chame essa função repetidamente enquanto ela retornar sucesso. Veja mysql\_session\_track\_get\_next().

#### Suporte ao Rastreador de Estado de Sessão do Conjunto de Testes

O programa **mysqltest** tem os comandos `disable_session_track_info` e `enable_session_track_info` que controlam se as notificações do rastreador de sessão ocorrem. Você pode usar esses comandos para ver na linha de comando quais são as notificações que as instruções SQL produzem. Suponha que um arquivo `testscript` contenha o seguinte script **mysqltest**:

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

Execute o script da seguinte forma para ver as informações fornecidas pelos rastreadores habilitados. Para uma descrição das informações `Tracker:` exibidas pelo **mysqltest** para os vários rastreadores, veja mysql\_session\_track\_get\_first().



Anunciando a declaração `START TRANSACTION`, duas declarações `SET TRANSACTION` são executadas que definem o nível de isolamento e as características do modo de acesso para a próxima transação. O valor `SESSION_TRACK_TRANSACTION_CHARACTERISTICS` indica esses valores da próxima transação que foram definidos.

Após a declaração `COMMIT` que encerra a transação, o valor `SESSION_TRACK_TRANSACTION_CHARACTERISTICS` é reportado como vazio. Isso indica que as características da próxima transação que foram definidas antes do início da transação foram redefinidas e que os padrões de sessão se aplicam. Para acompanhar as alterações nesses padrões de sessão, acompanhe os valores da sessão das variáveis de sistema `transaction_isolation` e `transaction_read_only`.

Para ver informações sobre GTIDs, habilite o rastreador `SESSION_TRACK_GTIDS` usando a variável de sistema `session_track_gtids`.