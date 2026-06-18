### 19.2.5 Como os servidores avaliam as regras de filtragem de replicação

19.2.5.1 Avaliação das opções de replicação e registro binário de nível de banco de dados

19.2.5.2 Avaliação das Opções de Replicação de Nível de Tabela

19.2.5.3 Interações entre as opções de filtragem de replicação

19.2.5.4 Filtros baseados em canais de replicação

Se um servidor de fonte de replicação não escrever uma declaração em seu log binário, a declaração não será replicada. Se o servidor registrar a declaração, a declaração será enviada para todas as réplicas e cada réplica determinará se deve executá-la ou ignorá-la.

No recurso de origem, você pode controlar quais bancos de dados devem registrar as alterações usando as opções `--binlog-do-db` e `--binlog-ignore-db` para controlar o registro binário. Para uma descrição das regras que os servidores usam para avaliar essas opções, consulte a Seção 19.2.5.1, “Avaliação das opções de replicação e registro binário em nível de banco de dados”. Você não deve usar essas opções para controlar quais bancos de dados e tabelas são replicados. Em vez disso, use o filtro na replica para controlar os eventos que são executados na replica.

Quanto à replica, as decisões sobre a execução ou ignorar declarações recebidas da fonte são tomadas de acordo com as opções `--replicate-*` com as quais a replica foi iniciada. (Veja a Seção 19.1.6, “Opções e Variáveis de Registro Binário e Replicação”.) Os filtros regidos por essas opções também podem ser definidos dinamicamente usando a declaração `CHANGE REPLICATION FILTER`. As regras que regem esses filtros são as mesmas, seja criadas no início usando as opções `--replicate-*` ou enquanto o servidor da replica estiver em execução por `CHANGE REPLICATION FILTER`. Observe que os filtros de replicação não podem ser usados em canais específicos da Replicação de Grupo em uma instância do servidor MySQL configurada para a Replicação de Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

No caso mais simples, quando não há opções `--replicate-*`, a replica executa todas as instruções que recebe da fonte. Caso contrário, o resultado depende das opções específicas fornecidas.

As opções de nível de banco de dados (`--replicate-do-db`, `--replicate-ignore-db`) são verificadas primeiro; consulte a Seção 19.2.5.1, “Avaliação das Opções de Replicação e Registro Binário de Nível de Banco de Dados”, para uma descrição desse processo. Se nenhuma opção de nível de banco de dados for usada, a verificação das opções prossegue para quaisquer opções de nível de tabela que possam estar em uso (consulte a Seção 19.2.5.2, “Avaliação das Opções de Replicação de Nível de Tabela”, para uma discussão sobre essas opções). Se uma ou mais opções de nível de banco de dados forem usadas, mas nenhuma delas corresponder, a declaração não será replicada.

Para declarações que afetam apenas bancos de dados (ou seja, `CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`), as opções de nível de banco de dados sempre têm precedência sobre quaisquer opções de `--replicate-wild-do-table`. Em outras palavras, para tais declarações, as opções de `--replicate-wild-do-table` são verificadas se e somente se não houver opções de nível de banco de dados aplicáveis.

Para facilitar a determinação do efeito de um conjunto específico de opções, recomenda-se que você evite misturar as opções `do-*` e `ignore-*` ou opções que contenham caracteres especiais com opções que não os contenham.

Se quaisquer opções `--replicate-rewrite-db` forem especificadas, elas serão aplicadas antes que as regras de filtragem `--replicate-*` sejam testadas.

Nota

Todas as opções de filtragem de replicação seguem as mesmas regras de sensibilidade de maiúsculas e minúsculas que se aplicam aos nomes de bancos de dados e tabelas em outros lugares do servidor MySQL, incluindo os efeitos da variável de sistema `lower_case_table_names`.

A partir do MySQL 8.0.31, as regras de filtragem são aplicadas antes de realizar qualquer verificação de privilégios; se uma transação for filtrada, nenhuma verificação de privilégios é realizada para essa transação, e, portanto, nenhum erro pode ser gerado por ela. Consulte a Seção 19.5.1.29, “Erros de Replicação Durante a Replicação”, para obter mais informações.
