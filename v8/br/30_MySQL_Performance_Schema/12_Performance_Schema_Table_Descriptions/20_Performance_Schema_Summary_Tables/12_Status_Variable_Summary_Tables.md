#### 29.12.20.12 Tabelas de Resumo de Estatísticas Variáveis

O Schema de Desempenho disponibiliza informações sobre variáveis de status nas tabelas descritas na Seção 29.12.15, “Tabelas de Variáveis de Status do Schema de Desempenho”. Ele também disponibiliza informações agregadas sobre variáveis de status em tabelas resumidas, descritas aqui. Cada tabela de resumo de variáveis de status tem uma ou mais colunas de agrupamento para indicar como a tabela agrega os valores de status:

- A coluna `status_by_account` tem as colunas `USER`, `HOST` e `VARIABLE_NAME` para resumir as variáveis de status por conta.

- As colunas `status_by_host` têm `HOST` e `VARIABLE_NAME` para resumir as variáveis de status por meio do host a partir do qual os clientes se conectaram.

- As colunas `status_by_user`, `USER` e `VARIABLE_NAME` do `status_by_user` são usadas para resumir as variáveis de status por nome do usuário do cliente.

Cada tabela de resumo das variáveis de status tem essa coluna de resumo contendo valores agregados:

- `VARIABLE_VALUE`

  O valor da variável de status agregado para sessões ativas e encerradas.

As tabelas de resumo das variáveis de status têm esses índices:

- `status_by_account`:

  - Chave primária em (`USER`, `HOST`, `VARIABLE_NAME`)

- `status_by_host`:

  - Chave primária em (`HOST`, `VARIABLE_NAME`)

- `status_by_user`:

  - Chave primária em (`USER`, `VARIABLE_NAME`)

O significado de "conta" nessas tabelas é semelhante ao seu significado nas tabelas de concessão de acesso do banco de dados do sistema `mysql` do MySQL, no sentido de que o termo se refere a uma combinação de valores de usuário e host. Eles diferem na medida em que, para as tabelas de concessão de acesso, a parte do host de uma conta pode ser um padrão, enquanto para as tabelas do Schema de Desempenho, o valor do host é sempre um nome de host específico e não padrão.

O status da conta é coletado quando as sessões terminam. Os contadores de status de sessão são adicionados aos contadores globais de status e aos contadores de status da conta correspondentes. Se as estatísticas da conta não forem coletadas, o status da sessão é adicionado ao status do host e do usuário, se o status do host e do usuário forem coletados.

As estatísticas da conta, do anfitrião e do usuário não são coletadas se as variáveis de sistema `performance_schema_accounts_size`, `performance_schema_hosts_size` e `performance_schema_users_size`, respectivamente, forem definidas como 0.

O Schema de Desempenho suporta `TRUNCATE TABLE` para tabelas de resumo das variáveis de status da seguinte forma; em todos os casos, o status das sessões ativas não é afetado:

- `status_by_account`: Agrupa o status da conta a partir de sessões encerradas para o status do usuário e do host, e depois redefini o status da conta.

- `status_by_host`: Redefine o status agregado do host a partir de sessões terminadas.

- `status_by_user`: Redefine o status do usuário agregado a partir de sessões encerradas.

`FLUSH STATUS` adiciona o status da sessão de todas as sessões ativas às variáveis de status globais, redefini o status de todas as sessões ativas e redefini os valores de status de conta, host e usuário agregados de sessões desconectadas.
