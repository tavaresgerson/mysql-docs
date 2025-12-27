### 19.2.5 Como os Servidores Avaliam as Regras de Filtragem de Replicação

19.2.5.1 Avaliação das Opções de Replicação em Nível de Banco de Dados e Registro Binário

19.2.5.2 Avaliação das Opções de Replicação em Nível de Tabela

19.2.5.3 Interações entre as Opções de Filtragem de Replicação

19.2.5.4 Filtros Baseados no Canal de Replicação

Se um servidor de origem de replicação não escrever uma instrução em seu log binário, a instrução não é replicada. Se o servidor registrar a instrução, a instrução é enviada para todas as réplicas e cada réplica determina se deve executá-la ou ignorá-la.

No servidor de origem, você pode controlar quais bancos de dados devem ser registrados para alterações usando as opções `--binlog-do-db` e `--binlog-ignore-db` para controlar o registro binário. Para uma descrição das regras que os servidores usam para avaliar essas opções, consulte a Seção 19.2.5.1, “Avaliação das Opções de Replicação em Nível de Banco de Dados e Registro Binário”. Você não deve usar essas opções para controlar quais bancos de dados e tabelas são replicados. Em vez disso, use o filtro na réplica para controlar os eventos que são executados na réplica.

No caso das réplicas, as decisões sobre a execução ou ignorância de declarações recebidas da fonte são tomadas de acordo com as opções `--replicate-*` com as quais a réplica foi iniciada. (Veja a Seção 19.1.6, “Opções e Variáveis de Registro Binário e Replicação”). Os filtros regidos por essas opções também podem ser definidos dinamicamente usando a declaração `CHANGE REPLICATION FILTER`. As regras que regem esses filtros são as mesmas, seja criadas no início usando as opções `--replicate-*` ou enquanto o servidor da réplica estiver em execução por `CHANGE REPLICATION FILTER`. Note que os filtros de replicação não podem ser usados em canais específicos da Replicação de Grupo em uma instância do servidor MySQL configurada para a Replicação de Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

No caso mais simples, quando não há opções `--replicate-*`, a réplica executa todas as declarações que recebe da fonte. Caso contrário, o resultado depende das opções específicas dadas.

As opções de nível de banco de dados (`--replicate-do-db`, `--replicate-ignore-db`) são verificadas primeiro; veja a Seção 19.2.5.1, “Avaliação das Opções de Replicação e Registro Binário de Nível de Banco de Dados”, para uma descrição desse processo. Se nenhuma opção de nível de banco de dados for usada, a verificação de opções prossegue para quaisquer opções de nível de tabela que possam estar em uso (veja a Seção 19.2.5.2, “Avaliação das Opções de Replicação de Nível de Tabela”, para uma discussão sobre essas). Se uma ou mais opções de nível de banco de dados forem usadas, mas nenhuma for correspondida, a declaração não será replicada.

Para declarações que afetam apenas bancos de dados (ou seja, `CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`), as opções de nível de banco de dados sempre têm precedência sobre quaisquer opções `--replicate-wild-do-table`. Em outras palavras, para essas declarações, as opções `--replicate-wild-do-table` são verificadas se e somente se não houver opções de nível de banco de dados aplicáveis.

Para facilitar a determinação do efeito de um determinado conjunto de opções, recomenda-se evitar misturar opções `do-*` e `ignore-*`, ou opções que contenham caracteres curinga com opções que não os contenham.

Se quaisquer opções `--replicate-rewrite-db` forem especificadas, elas são aplicadas antes que as regras de filtragem `--replicate-*` sejam testadas.

Nota

Todas as opções de filtragem de replicação seguem as mesmas regras de sensibilidade de caso que se aplicam aos nomes de bancos de dados e tabelas em outros lugares do servidor MySQL, incluindo os efeitos da variável de sistema `lower_case_table_names`.

As regras de filtragem são aplicadas antes de realizar quaisquer verificações de privilégio; se uma transação for filtrada, nenhuma verificação de privilégio é realizada para essa transação, e, portanto, nenhum erro pode ser gerado por ela. Veja a Seção 19.5.1.30, “Erros de replicação durante a replicação”, para mais informações.