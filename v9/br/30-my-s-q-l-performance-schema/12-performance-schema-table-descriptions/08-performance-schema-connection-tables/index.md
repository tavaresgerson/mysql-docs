### 29.12.8 Tabelas de Conexão do Schema de Desempenho

29.12.8.1 A Tabela `accounts`

29.12.8.2 A Tabela `hosts`

29.12.8.3 A Tabela `users`

Quando um cliente se conecta ao servidor MySQL, ele faz isso sob um nome de usuário específico e de um host específico. O Schema de Desempenho fornece estatísticas sobre essas conexões, rastreando-as por conta (combinação de usuário e host) e separadamente por nome de usuário e nome de host, usando essas tabelas:

* `accounts`: Estatísticas de conexão por conta do cliente

* `hosts`: Estatísticas de conexão por nome de host do cliente

* `users`: Estatísticas de conexão por nome de usuário do cliente

O significado de “conta” nas tabelas de conexão é semelhante ao seu significado nas tabelas de concessão de permissões do MySQL no banco de dados do sistema `mysql`, no sentido de que o termo se refere a uma combinação de valores de usuário e host. Eles diferem na medida em que, para as tabelas de concessão de permissões, a parte do host de uma conta pode ser um padrão, enquanto para as tabelas do Schema de Desempenho, o valor do host é sempre um nome de host não padrão específico.

Cada tabela de conexão tem as colunas `CURRENT_CONNECTIONS` e `TOTAL_CONNECTIONS` para rastrear o número atual e total de conexões por “valor de rastreamento” sobre o qual suas estatísticas são baseadas. As tabelas diferem no que elas usam para o valor de rastreamento. A tabela `accounts` tem as colunas `USER` e `HOST` para rastrear conexões por combinação de usuário e host. As tabelas `users` e `hosts` têm uma coluna `USER` e `HOST`, respectivamente, para rastrear conexões por nome de usuário e nome de host.

O Schema de Desempenho também conta threads internos e threads para sessões de usuário que não conseguiram se autenticar, usando linhas com valores nas colunas `USER` e `HOST` de `NULL`.

Suponha que os clientes `user1` e `user2` se conectem uma vez a partir de `hosta` e `hostb`. O Schema de Desempenho rastreia as conexões da seguinte forma:

* A tabela `accounts` tem quatro linhas, para os valores das contas `user1`/`hosta`, `user1`/`hostb`, `user2`/`hosta` e `user2`/`hostb`, cada linha contendo uma conexão por conta.

* A tabela `hosts` tem duas linhas, para `hosta` e `hostb`, cada linha contendo duas conexões por nome de host.

* A tabela `users` tem duas linhas, para `user1` e `user2`, cada linha contendo duas conexões por nome de usuário.

Quando um cliente se conecta, o Schema de Desempenho determina qual linha de cada tabela de conexão se aplica, usando o valor de rastreamento apropriado para cada tabela. Se não houver tal linha, uma é adicionada. Então, o Schema de Desempenho incrementa em um as colunas `CURRENT_CONNECTIONS` e `TOTAL_CONNECTIONS` naquela linha.

Quando um cliente se desconecta, o Schema de Desempenho decrementa em um a coluna `CURRENT_CONNECTIONS` na linha e deixa a coluna `TOTAL_CONNECTIONS` inalterada.

O `TRUNCATE TABLE` é permitido para tabelas de conexão. Ele tem esses efeitos:

* Linhas são removidas para contas, hosts ou usuários que não têm conexões atuais (linhas com `CURRENT_CONNECTIONS = 0`).

* Linhas não removidas são resetadas para contar apenas conexões atuais: Para linhas com `CURRENT_CONNECTIONS > 0`, `TOTAL_CONNECTIONS` é resetada para `CURRENT_CONNECTIONS`.

* Tabelas de resumo que dependem da tabela de conexão são implicitamente truncadas, conforme descrito mais adiante nesta seção.

O Schema de Desempenho mantém tabelas de resumo que agregam estatísticas de conexão para vários tipos de evento por conta, host ou usuário. Essas tabelas têm `_summary_by_account`, `_summary_by_host` ou `_summary_by_user` no nome. Para identificá-las, use esta consulta:

```
mysql> SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = 'performance_schema'
       AND TABLE_NAME REGEXP '_summary_by_(account|host|user)'
       ORDER BY TABLE_NAME;
+------------------------------------------------------+
| TABLE_NAME                                           |
+------------------------------------------------------+
| events_errors_summary_by_account_by_error            |
| events_errors_summary_by_host_by_error               |
| events_errors_summary_by_user_by_error               |
| events_stages_summary_by_account_by_event_name       |
| events_stages_summary_by_host_by_event_name          |
| events_stages_summary_by_user_by_event_name          |
| events_statements_summary_by_account_by_event_name   |
| events_statements_summary_by_host_by_event_name      |
| events_statements_summary_by_user_by_event_name      |
| events_transactions_summary_by_account_by_event_name |
| events_transactions_summary_by_host_by_event_name    |
| events_transactions_summary_by_user_by_event_name    |
| events_waits_summary_by_account_by_event_name        |
| events_waits_summary_by_host_by_event_name           |
| events_waits_summary_by_user_by_event_name           |
| memory_summary_by_account_by_event_name              |
| memory_summary_by_host_by_event_name                 |
| memory_summary_by_user_by_event_name                 |
+------------------------------------------------------+
```

Para obter detalhes sobre as tabelas de resumo de conexão individual, consulte a seção que descreve as tabelas para o tipo de evento resumido:

* Resumos de eventos de espera: Seção 29.12.20.1, “Tabelas de Resumo de Eventos de Espera”

* Resumos de eventos de estágio: Seção 29.12.20.2, “Tabelas de Resumo de Estágio”

* Resumos de eventos de declaração: Seção 29.12.20.3, “Tabelas de Resumo de Declaração”

* Resumos de eventos de transação: Seção 29.12.20.5, “Tabelas de Resumo de Transação”

* Resumos de eventos de memória: Seção 29.12.20.10, “Tabelas de Resumo de Memória”

* Resumos de eventos de erro: Seção 29.12.20.11, “Tabelas de Resumo de Erro”

O `TRUNCATE TABLE` é permitido para as tabelas de resumo de conexão. Ele remove linhas para contas, hosts ou usuários sem conexões e redefreia as colunas de resumo para zero para as linhas restantes. Além disso, cada tabela de resumo que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual depende. A tabela a seguir descreve a relação entre a truncagem da tabela de conexão e as tabelas implicitamente truncadas.

**Tabela 29.2 Efeitos Implícitos da Truncagem da Tabela de Conexão**

<table summary="Quais tabelas de resumo do Schema de Desempenho são implicitamente truncadas pela truncagem da tabela de conexão."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Tabela de Conexão Truncada</th> <th>Tabelas de Resumo Truncadas Implicitamente</th> </tr></thead><tbody><tr> <td><code>accounts</code></td> <td>Tabelas com nomes contendo <code>_summary_by_account</code>, <code>_summary_by_thread</code></td> </tr><tr> <td><code>hosts</code></td> <td>Tabelas com nomes contendo <code>_summary_by_account</code>, <code>_summary_by_host</code>, <code>_summary_by_thread</code></td> </tr><tr> <td><code>users</code></td> <td>Tabelas com nomes contendo <code>_summary_by_account</code>, <code>_summary_by_user</code>, <code>_summary_by_thread</code></td> </tr></tbody></table>

A truncagem de uma tabela de resumo global `<code>_summary_global</code> também trunca implicitamente suas tabelas de resumo de conexão e de thread correspondentes. Por exemplo, a truncagem de `events_waits_summary_global_by_event_name` trunca implicitamente as tabelas de resumo de espera que são agregadas por conta, host, usuário ou thread.