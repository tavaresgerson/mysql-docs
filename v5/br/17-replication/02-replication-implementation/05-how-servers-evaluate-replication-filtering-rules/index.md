### 16.2.5 Como os servidores avaliam as regras de filtragem de replicação

16.2.5.1 Avaliação das opções de replicação e registro binário de nível de banco de dados

16.2.5.2 Avaliação das Opções de Replicação de Nível de Tabela

16.2.5.3 Interações entre as opções de filtragem de replicação

Se um servidor de fonte de replicação não escrever uma declaração em seu log binário, a declaração não será replicada. Se o servidor registrar a declaração, a declaração será enviada para todas as réplicas e cada réplica determinará se deve executá-la ou ignorá-la.

Na fonte, você pode controlar quais bancos de dados registrar alterações usando as opções [`--binlog-do-db`](https://pt.wikipedia.org/wiki/Binlog) e [`--binlog-ignore-db`](https://pt.wikipedia.org/wiki/Binlog) para controlar o registro binário. Para uma descrição das regras que os servidores usam para avaliar essas opções, consulte [Seção 16.2.5.1, “Avaliação das opções de replicação e registro binário em nível de banco de dados”](https://pt.wikipedia.org/wiki/Binlog). Você não deve usar essas opções para controlar quais bancos de dados e tabelas são replicados. Em vez disso, use o filtro na replica para controlar os eventos executados na replica.

No lado da replica, as decisões sobre a execução ou ignorar declarações recebidas da fonte são feitas de acordo com as opções `--replicate-*` com as quais a replica foi iniciada. (Veja Seção 16.1.6, “Opções e variáveis de registro binário de replicação”). Os filtros regidos por essas opções também podem ser definidos dinamicamente usando a declaração `CHANGE REPLICATION FILTER`. As regras que regem esses filtros são as mesmas, seja criadas no início usando as opções `--replicate-*` ou enquanto o servidor de replica está em execução por `CHANGE REPLICATION FILTER`. Note que os filtros de replicação não podem ser usados em uma instância do servidor MySQL configurada para a replicação por grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

No caso mais simples, quando não há opções `--replicate-*`, a replica executa todas as instruções que recebe da fonte. Caso contrário, o resultado depende das opções específicas fornecidas.

As opções de nível de banco de dados (`--replicate-do-db`, `--replicate-ignore-db`) são verificadas primeiro; consulte Seção 16.2.5.1, “Avaliação das Opções de Replicação e Registro Binário de Nível de Banco de Dados” para uma descrição desse processo. Se nenhuma opção de nível de banco de dados for usada, a verificação das opções prossegue para quaisquer opções de nível de tabela que possam estar em uso (consulte Seção 16.2.5.2, “Avaliação das Opções de Replicação de Nível de Tabela” para uma discussão sobre essas opções). Se uma ou mais opções de nível de banco de dados forem usadas, mas nenhuma delas for correspondida, a declaração não será replicada.

Para declarações que afetam apenas bancos de dados (ou seja, `CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`), as opções de nível de banco de dados sempre têm precedência sobre quaisquer opções de `--replicate-wild-do-table`. Em outras palavras, para tais declarações, as opções de `--replicate-wild-do-table` são verificadas se e somente se não houver opções de nível de banco de dados aplicáveis. Essa é uma mudança de comportamento em relação às versões anteriores do MySQL, onde a declaração `CREATE DATABASE dbx` não era replicada se a replica tivesse sido iniciada com `--replicate-do-db=dbx` e `--replicate-wild-do-table=db%.t1`. (Bug #46110)

Para facilitar a determinação do efeito de um conjunto de opções, recomenda-se que você evite misturar opções "do" e "ignorar" ou opções com asterisco e sem asterisco.

Se alguma das opções `--replicate-rewrite-db` tiver sido especificada, elas serão aplicadas antes que as regras de filtragem `--replicate-*` sejam testadas.

Nota

Todas as opções de filtragem de replicação seguem as mesmas regras de sensibilidade de maiúsculas e minúsculas que se aplicam aos nomes de bancos de dados e tabelas em outros lugares do servidor MySQL, incluindo os efeitos da variável de sistema `lower_case_table_names`.
