### 16.2.5 Como Servidores Avaliam as Regras de Filtering de Replication

[16.2.5.1 Avaliação das Options de Replication e Binary Logging em Nível de Database](replication-rules-db-options.html)

[16.2.5.2 Avaliação das Options de Replication em Nível de Table](replication-rules-table-options.html)

[16.2.5.3 Interações entre Options de Replication Filtering](replication-rules-examples.html)

Se um servidor *source* de *replication* não escrever um *statement* em seu *binary log*, o *statement* não é replicado. Se o servidor registrar o *statement*, ele é enviado a todas as *replicas* e cada *replica* determina se deve executá-lo ou ignorá-lo.

No *source*, você pode controlar para quais *databases* registrar as alterações usando as *options* [`--binlog-do-db`] e [`--binlog-ignore-db`] para controlar o *binary logging*. Para uma descrição das regras que os servidores usam ao avaliar essas *options*, consulte [Section 16.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”]. Você não deve usar essas *options* para controlar quais *databases* e *tables* são replicadas. Em vez disso, use *filtering* na *replica* para controlar os *events* que são executados na *replica*.

No lado da *replica*, as decisões sobre se devem executar ou ignorar *statements* recebidos do *source* são tomadas de acordo com as *options* `--replicate-*` com as quais a *replica* foi iniciada. (Consulte [Section 16.1.6, “Replication and Binary Logging Options and Variables”].) Os *filters* regidos por essas *options* também podem ser definidos dinamicamente usando o *statement* `CHANGE REPLICATION FILTER`. As regras que governam tais *filters* são as mesmas, quer sejam criados na inicialização usando *options* `--replicate-*` ou enquanto o servidor *replica* está em execução por `CHANGE REPLICATION FILTER`. Observe que os *replication filters* não podem ser usados em uma instância de servidor MySQL configurada para *Group Replication*, pois *filtering* *transactions* em alguns servidores tornaria o *group* incapaz de chegar a um acordo sobre um estado consistente.

No caso mais simples, quando não há *options* `--replicate-*`, a *replica* executa todos os *statements* que recebe do *source*. Caso contrário, o resultado depende das *options* específicas fornecidas.

As *options* de nível de *database* ([`--replicate-do-db`], [`--replicate-ignore-db`]) são verificadas primeiro; consulte [Section 16.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”], para uma descrição deste processo. Se nenhuma *option* de nível de *database* for usada, a verificação das *options* prossegue para quaisquer *options* de nível de *table* que possam estar em uso (consulte [Section 16.2.5.2, “Evaluation of Table-Level Replication Options”], para uma discussão sobre elas). Se uma ou mais *options* de nível de *database* forem usadas, mas nenhuma corresponder, o *statement* não será replicado.

Para *statements* que afetam apenas *databases* (ou seja, [`CREATE DATABASE`], [`DROP DATABASE`] e [`ALTER DATABASE`]), as *options* de nível de *database* sempre têm precedência sobre quaisquer *options* [`--replicate-wild-do-table`]. Em outras palavras, para tais *statements*, as *options* [`--replicate-wild-do-table`] são verificadas se, e somente se, não houver *options* de nível de *database* aplicáveis. Esta é uma mudança de comportamento em relação a versões anteriores do MySQL, onde o *statement* [`CREATE DATABASE dbx`] não era replicado se a *replica* tivesse sido iniciada com [`--replicate-do-db=dbx`] [`--replicate-wild-do-table=db%.t1`]. (Bug #46110)

Para tornar mais fácil determinar o efeito de um conjunto de *options*, é recomendável evitar misturar *options* “do” e “ignore”, ou *options* *wildcard* e não-*wildcard*.

Se quaisquer *options* [`--replicate-rewrite-db`] forem especificadas, elas serão aplicadas antes que as regras de *filtering* `--replicate-*` sejam testadas.

Note

Todas as *options* de *replication filtering* seguem as mesmas regras de *case sensitivity* que se aplicam a nomes de *databases* e *tables* em outras partes do servidor MySQL, incluindo os efeitos da *system variable* [`lower_case_table_names`].