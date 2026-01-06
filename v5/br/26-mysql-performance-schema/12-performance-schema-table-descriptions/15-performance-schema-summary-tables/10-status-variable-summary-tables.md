#### 25.12.15.10 Tabelas de Resumo de Estatísticas Variáveis do Status

Nota

O valor da variável de sistema `show_compatibility_56` afeta as informações disponíveis nas tabelas descritas aqui. Para obter detalhes, consulte a descrição dessa variável em Seção 5.1.7, "Variáveis de Sistema do Servidor".

O Schema de Desempenho disponibiliza informações sobre variáveis de status nas tabelas descritas em Seção 25.12.14, “Tabelas de Variáveis de Status do Schema de Desempenho”. Ele também disponibiliza informações agregadas sobre variáveis de status em tabelas resumidas, descritas aqui. Cada tabela de resumo de variáveis de status tem uma ou mais colunas de agrupamento para indicar como a tabela agrega os valores de status:

- O `status_by_account` possui as colunas `USER`, `HOST` e `VARIABLE_NAME` para resumir as variáveis de status por conta.

- O `status_by_host` possui as colunas `HOST` e `VARIABLE_NAME` para resumir as variáveis de status por meio do host a partir do qual os clientes se conectaram.

- O `status_by_user` possui as colunas `USER` e `VARIABLE_NAME` para resumir as variáveis de status por nome do usuário do cliente.

Cada tabela de resumo das variáveis de status tem essa coluna de resumo contendo valores agregados:

- `VARIABLE_VALUE`

  O valor da variável de status agregado para sessões ativas e encerradas.

O significado de "conta" nessas tabelas é semelhante ao seu significado nas tabelas de concessão de permissões do MySQL no banco de dados do sistema `mysql`, no sentido de que o termo se refere a uma combinação de valores de usuário e host. Eles diferem na medida em que, para as tabelas de concessão de permissões, a parte do host de uma conta pode ser um padrão, enquanto para as tabelas do Schema de Desempenho, o valor do host é sempre um nome de host específico e não padrão.

O status da conta é coletado quando as sessões terminam. Os contadores de status de sessão são adicionados aos contadores globais de status e aos contadores de status da conta correspondentes. Se as estatísticas da conta não forem coletadas, o status da sessão é adicionado ao status do host e do usuário, se o status do host e do usuário forem coletados.

As estatísticas da conta, do host e do usuário não são coletadas se as variáveis de sistema `performance_schema_accounts_size`, \[`performance_schema_hosts_size`]\(performance-schema-system-variables.html#sysvar\_performance\_schema\_hosts\_size] e `performance_schema_users_size`, respectivamente, forem definidas como 0.

O Schema de Desempenho suporta a opção `TRUNCATE TABLE` para tabelas de resumo de variáveis de status da seguinte forma; em todos os casos, o status das sessões ativas não é afetado:

- `status_by_account`: Agrupa o status da conta a partir de sessões encerradas para o status do usuário e do host, e depois redefiniu o status da conta.

- `status_by_host`: Redefine o status agregado do host a partir de sessões terminadas.

- `status_by_user`: Redefine o status agregado do usuário a partir de sessões encerradas.

`FLUSH STATUS` adiciona o status da sessão de todas as sessões ativas às variáveis de status globais, redefini o status de todas as sessões ativas e redefini os valores de status de conta, host e usuário agregados de sessões desconectadas.
