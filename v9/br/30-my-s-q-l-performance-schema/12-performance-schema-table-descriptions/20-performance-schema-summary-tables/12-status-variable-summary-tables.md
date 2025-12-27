#### 29.12.20.12 Tabelas de Resumo de Variáveis de Estado

O Schema de Desempenho disponibiliza informações sobre variáveis de estado nas tabelas descritas na Seção 29.12.15, “Tabelas de Variáveis de Estado do Schema de Desempenho”. Ele também disponibiliza informações agregadas sobre variáveis de estado em tabelas de resumo, descritas aqui. Cada tabela de resumo de variáveis de estado tem uma ou mais colunas de agrupamento para indicar como a tabela agrega valores de estado:

* `status_by_account` tem as colunas `USER`, `HOST` e `VARIABLE_NAME` para resumir variáveis de estado por conta.

* `status_by_host` tem as colunas `HOST` e `VARIABLE_NAME` para resumir variáveis de estado pelo host a partir do qual os clientes se conectaram.

* `status_by_user` tem as colunas `USER` e `VARIABLE_NAME` para resumir variáveis de estado pelo nome do usuário do cliente.

Cada tabela de resumo de variáveis de estado tem essa coluna de resumo contendo valores agregados:

* `VARIABLE_VALUE`

  O valor agregado da variável de estado para sessões ativas e encerradas.

As tabelas de resumo de variáveis de estado têm esses índices:

* `status_by_account`:

  + Chave primária em (`USER`, `HOST`, `VARIABLE_NAME`)

* `status_by_host`:

  + Chave primária em (`HOST`, `VARIABLE_NAME`)

* `status_by_user`:

  + Chave primária em (`USER`, `VARIABLE_NAME`)

O significado de “conta” nessas tabelas é semelhante ao seu significado nas tabelas de concessão de permissões do banco de dados do sistema `mysql`, no sentido de que o termo se refere a uma combinação de valores de usuário e host. Eles diferem na medida em que, para as tabelas de concessão de permissões, a parte do host de uma conta pode ser um padrão, enquanto para as tabelas do Schema de Desempenho, o valor do host é sempre um nome de host específico e não padrão.

O status da conta é coletado quando as sessões terminam. Os contadores de status de sessão são adicionados aos contadores globais de status e aos contadores de status da conta correspondente. Se as estatísticas da conta não forem coletadas, o status da sessão é adicionado ao status do host e do usuário, se o status do host e do usuário forem coletados.

As estatísticas da conta, do host e do usuário não são coletadas se as variáveis de sistema `performance_schema_accounts_size`, `performance_schema_hosts_size` e `performance_schema_users_size`, respectivamente, forem definidas como 0.

O Schema de Desempenho suporta `TRUNCATE TABLE` para as tabelas de resumo das variáveis de status da seguinte forma; em todos os casos, o status das sessões ativas não é afetado:

* `status_by_account`: Agrupa o status da conta de sessões terminadas para o status do usuário e do host, e depois redefere o status da conta.

* `status_by_host`: Redefine o status agregado do host de sessões terminadas.

* `status_by_user`: Redefine o status agregado do usuário de sessões terminadas.

`FLUSH STATUS` adiciona o status da sessão de todas as sessões ativas às variáveis de status globais, redefere o status de todas as sessões ativas e redefere os valores dos status da conta, do host e do usuário agregados de sessões desconectadas.