### 25.12.6 Tabelas de Eventos da Declaração do Schema de Desempenho

25.12.6.1 Tabela events_statements_current

Tabela de histórico de declarações de eventos _events_statements_history

Tabela de histórico de declarações de eventos_events_statements_history_long

25.12.6.4 A tabela prepared_statements_instances

A execução da declaração do Instrumento do Schema de Desempenho. Os eventos de declaração ocorrem em um nível elevado da hierarquia de eventos. Dentro da hierarquia de eventos, os eventos de espera estão dentro dos eventos de estágio, que estão dentro dos eventos de declaração, que estão dentro dos eventos de transação.

Essas tabelas armazenam eventos de declaração:

- `eventos_estatuto_atual`: O evento de estatuto atual para cada thread.

- `eventos_estatuto_histórico`: Os eventos de estatuto mais recentes que terminaram por thread.

- `eventos_estatuto_histórico_longo`: Os eventos de estatuto mais recentes que terminaram globalmente (em todas as threads).

- `prepared_statements_instances`: Instâncias e estatísticas de instruções preparadas

As seções a seguir descrevem as tabelas de eventos de declaração. Há também tabelas resumidas que agregam informações sobre eventos de declaração; consulte Seção 25.12.15.3, “Tabelas de Resumo de Declaração”.

Para obter mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

- Configuração da coleta de eventos de declaração
- Monitoramento de declarações

#### Configurando a Coleta de Eventos de Declaração

Para controlar se os eventos de declaração devem ser coletados, defina o estado dos instrumentos e dos consumidores relevantes:

- A tabela `setup_instruments` contém instrumentos com nomes que começam com `statement`. Use esses instrumentos para habilitar ou desabilitar a coleta de classes de eventos de declaração individuais.

- A tabela `setup_consumers` contém valores de consumidores com nomes correspondentes aos nomes atuais e históricos das tabelas de eventos de declarações, além do consumidor de digestão de declarações. Use esses consumidores para filtrar a coleção de eventos de declarações e a digestão de declarações.

Os instrumentos de declaração estão habilitados por padrão, e os consumidores de declaração `events_statements_current`, `events_statements_history` e `statements_digest` estão habilitados por padrão:

```sql
mysql> SELECT *
       FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'statement/%';
+---------------------------------------------+---------+-------+
| NAME                                        | ENABLED | TIMED |
+---------------------------------------------+---------+-------+
| statement/sql/select                        | YES     | YES   |
| statement/sql/create_table                  | YES     | YES   |
| statement/sql/create_index                  | YES     | YES   |
...
| statement/sp/stmt                           | YES     | YES   |
| statement/sp/set                            | YES     | YES   |
| statement/sp/set_trigger_field              | YES     | YES   |
| statement/scheduler/event                   | YES     | YES   |
| statement/com/Sleep                         | YES     | YES   |
| statement/com/Quit                          | YES     | YES   |
| statement/com/Init DB                       | YES     | YES   |
...
| statement/abstract/Query                    | YES     | YES   |
| statement/abstract/new_packet               | YES     | YES   |
| statement/abstract/relay_log                | YES     | YES   |
+---------------------------------------------+---------+-------+
```

```sql
mysql> SELECT *
       FROM performance_schema.setup_consumers
       WHERE NAME LIKE '%statements%';
+--------------------------------+---------+
| NAME                           | ENABLED |
+--------------------------------+---------+
| events_statements_current      | YES     |
| events_statements_history      | YES     |
| events_statements_history_long | NO      |
| statements_digest              | YES     |
+--------------------------------+---------+
```

Para controlar a coleta de eventos de declaração na inicialização do servidor, use linhas como estas no seu arquivo `my.cnf`:

- Ativar:

  ```sql
  [mysqld]
  performance-schema-instrument='statement/%=ON'
  performance-schema-consumer-events-statements-current=ON
  performance-schema-consumer-events-statements-history=ON
  performance-schema-consumer-events-statements-history-long=ON
  performance-schema-consumer-statements-digest=ON
  ```

- Desativar:

  ```sql
  [mysqld]
  performance-schema-instrument='statement/%=OFF'
  performance-schema-consumer-events-statements-current=OFF
  performance-schema-consumer-events-statements-history=OFF
  performance-schema-consumer-events-statements-history-long=OFF
  performance-schema-consumer-statements-digest=OFF
  ```

Para controlar a coleta de eventos de declaração em tempo de execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

- Ativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'statement/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE '%statements%';
  ```

- Desativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'statement/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE '%statements%';
  ```

Para coletar apenas eventos de declaração específicos, habilite apenas os instrumentos de declaração correspondentes. Para coletar eventos de declaração apenas para tabelas específicas de eventos de declaração, habilite os instrumentos de declaração, mas apenas os consumidores de declaração correspondentes às tabelas desejadas.

A tabela `setup_timers` contém uma linha com o valor `NAME` de `statement`, que indica a unidade para o cronometramento de eventos de declaração. A unidade padrão é `NANOSECOND`:

```sql
mysql> SELECT *
       FROM performance_schema.setup_timers
       WHERE NAME = 'statement';
+-----------+------------+
| NAME      | TIMER_NAME |
+-----------+------------+
| statement | NANOSECOND |
+-----------+------------+
```

Para alterar a unidade de temporização, modifique o valor `TIMER_NAME`:

```sql
UPDATE performance_schema.setup_timers
SET TIMER_NAME = 'MICROSECOND'
WHERE NAME = 'statement';
```

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte Seção 25.3, “Configuração de Inicialização do Schema de Desempenho” e Seção 25.4, “Configuração de Execução em Tempo Real do Schema de Desempenho”.

#### Monitoramento de declarações

O monitoramento das declarações começa no momento em que o servidor percebe que uma atividade é solicitada em um thread, até o momento em que toda a atividade cessa. Normalmente, isso significa desde o momento em que o servidor recebe o primeiro pacote do cliente até o momento em que o servidor concluiu a transmissão da resposta. As declarações dentro dos programas armazenados são monitoradas como outras declarações.

Quando o Schema de Desempenho instrumenta uma solicitação (comando do servidor ou instrução SQL), ele usa nomes de instrumentos que progridem em etapas, de mais gerais (ou "abstratos") para mais específicos, até chegar a um nome de instrumento final.

Os nomes dos instrumentos finais correspondem a comandos do servidor e instruções SQL:

- Os comandos do servidor correspondem aos códigos `COM_xxx` definidos no arquivo de cabeçalho `mysql_com.h` e processados em `sql/sql_parse.cc`. Exemplos são `COM_PING` e `COM_QUIT`. Os instrumentos para comandos têm nomes que começam com `statement/com`, como `statement/com/Ping` e `statement/com/Quit`.

- As instruções SQL são expressas como texto, como `DELETE FROM t1` ou `SELECT * FROM t2`. Os instrumentos para instruções SQL têm nomes que começam com `statement/sql`, como `statement/sql/delete` e `statement/sql/select`.

Alguns nomes de instrumentos finais são específicos para o tratamento de erros:

- As mensagens recebidas pelo servidor que estão fora da banda são registradas na seção `statement/com/Error`. Elas podem ser usadas para detectar comandos enviados por clientes que o servidor não entende. Isso pode ser útil para identificar clientes mal configurados ou que estão usando uma versão do MySQL mais recente do que a do servidor, ou clientes que estão tentando atacar o servidor.

- `statement/sql/error` lida com instruções SQL que não conseguem ser parseadas. Pode ser usado para detectar consultas malformadas enviadas pelos clientes. Uma consulta que não consegue ser parseada difere de uma consulta que é parseada, mas falha devido a um erro durante a execução. Por exemplo, `SELECT * FROM` é malformado, e o instrumento `statement/sql/error` é usado. Em contraste, `SELECT *` é parseado, mas falha com um erro `No tables used` (Tabelas não usadas). Neste caso, é usado `statement/sql/select` e o evento da instrução contém informações para indicar a natureza do erro.

Um pedido pode ser obtido em qualquer uma dessas fontes:

- Como um pedido de comando ou declaração de um cliente, que envia o pedido como pacotes

- Como uma string de declaração lida do log do relay em uma réplica

- Como um evento do Agendamento de Eventos

Os detalhes de um pedido não são conhecidos inicialmente e o Schema de Desempenho segue de nomes de instrumentos abstratos para específicos em uma sequência que depende da fonte do pedido.

Para um pedido recebido de um cliente:

1. Quando o servidor detecta um novo pacote no nível de soquete, uma nova instrução é iniciada com o nome do instrumento abstrato `statement/abstract/new_packet`.

2. Quando o servidor lê o número do pacote, ele sabe mais sobre o tipo de solicitação recebida, e o Schema de Desempenho refina o nome do instrumento. Por exemplo, se a solicitação for um pacote `COM_PING`, o nome do instrumento se torna `statement/com/Ping` e esse é o nome final. Se a solicitação for um pacote `COM_QUERY`, sabe-se que ele corresponde a uma instrução SQL, mas não ao tipo específico da instrução. Neste caso, o instrumento muda de um nome abstrato para um nome mais específico, mas ainda abstrato, `statement/abstract/Query`, e a solicitação requer uma classificação adicional.

3. Se o pedido for uma declaração, o texto da declaração é lido e fornecido ao analisador. Após a análise, o tipo exato da declaração é conhecido. Se o pedido for, por exemplo, uma declaração `INSERT`, o Schema de Desempenho refina o nome do instrumento de `statement/abstract/Query` para `statement/sql/insert`, que é o nome final.

Para um pedido lido como uma declaração do log de retransmissão em uma réplica:

1. As declarações no log de retransmissão são armazenadas como texto e são lidas como tal. Não há protocolo de rede, portanto, o instrumento `statement/abstract/new_packet` não é usado. Em vez disso, o instrumento inicial é `statement/abstract/relay_log`.

2. Quando a declaração é analisada, o tipo exato da declaração é conhecido. Se o pedido for, por exemplo, uma declaração `INSERT`, o Schema de Desempenho refina o nome do instrumento de `statement/abstract/Query` para `statement/sql/insert`, que é o nome final.

A descrição anterior se aplica apenas à replicação baseada em declarações. Para a replicação baseada em linhas, o I/O de tabela realizado na replica enquanto processa alterações de linha pode ser instrumentado, mas os eventos de linha no log de retransmissão não aparecem como declarações discretas.

Para um pedido recebido do Agendamento de Eventos:

A execução do evento é instrumentada usando o nome `statement/scheduler/event`. Este é o nome final.

As declarações executadas dentro do corpo do evento são instrumentadas usando nomes `statement/sql/*`, sem o uso de nenhum instrumento abstrato anterior. Um evento é um programa armazenado, e os programas armazenados são pré-compilados na memória antes da execução. Consequentemente, não há análise em tempo de execução e o tipo de cada declaração é conhecido no momento em que ela é executada.

As declarações executadas dentro do corpo do evento são declarações filhas. Por exemplo, se um evento executa uma declaração `INSERT`, a execução do próprio evento é a raiz, instrumentada usando `statement/scheduler/event`, e a `INSERT` é a filha, instrumentada usando `statement/sql/insert`. A relação pai/filha ocorre *entre* operações instrumentadas separadas. Isso difere da sequência de refinamento que ocorre *dentro* de uma única operação instrumentada, de nomes de instrumentos abstratos para finais.

Para que as estatísticas sejam coletadas para declarações, não é suficiente habilitar apenas os instrumentos finais `statement/sql/*` usados para tipos de declaração individuais. Os instrumentos abstratos `statement/abstract/*` também devem ser habilitados. Isso normalmente não deve ser um problema, pois todos os instrumentos de declaração são habilitados por padrão. No entanto, uma aplicação que habilita ou desabilita seletivamente os instrumentos de declaração deve levar em consideração que desabilitar os instrumentos abstratos também desabilita a coleta de estatísticas para os instrumentos de declaração individuais. Por exemplo, para coletar estatísticas para declarações de `INSERT`, `statement/sql/insert` deve ser habilitado, mas também `statement/abstract/new_packet` e `statement/abstract/Query`. Da mesma forma, para que as declarações replicadas sejam instrumentadas, `statement/abstract/relay_log` deve ser habilitado.

Não são agregadas estatísticas para instrumentos abstratos, como `statement/abstract/Query`, porque nenhum instrumento é classificado como o nome final da declaração.
