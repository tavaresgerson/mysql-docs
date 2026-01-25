### 16.2.1 Formatos de Replication

[16.2.1.1 Vantagens e Desvantagens da Replication Baseada em Statement e Baseada em Row](replication-sbr-rbr.html)

[16.2.1.2 Uso de Logging e Replication Baseados em Row](replication-rbr-usage.html)

[16.2.1.3 Determinação de Statements Seguros e Não Seguros no Binary Logging](replication-rbr-safe-unsafe.html)

A Replication funciona porque os eventos gravados no Binary Log são lidos do Source e processados no Replica. Os eventos são registrados dentro do Binary Log em diferentes formatos, de acordo com o tipo de evento. Os diferentes formatos de Replication utilizados correspondem ao formato de Binary Logging usado quando os eventos foram registrados no Binary Log do Source. A correlação entre os formatos de Binary Logging e os termos usados durante a Replication é:

*   Ao usar Binary Logging baseado em statement, o Source grava SQL statements no Binary Log. A Replication do Source para o Replica funciona executando os SQL statements no Replica. Isso é chamado de Statement-Based Replication (que pode ser abreviado como SBR), o que corresponde ao formato de Binary Logging baseado em statement do MySQL.

*   Ao usar logging baseado em row, o Source grava eventos no Binary Log que indicam como as rows (linhas) individuais da tabela são alteradas. A Replication do Source para o Replica funciona copiando os eventos que representam as alterações nas rows da tabela para o Replica. Isso é chamado de Row-Based Replication (que pode ser abreviado como RBR).

*   Você também pode configurar o MySQL para usar uma mistura de logging baseado em statement e baseado em row, dependendo de qual é mais apropriado para a alteração a ser registrada. Isso é chamado de mixed-format logging (logging de formato misto). Ao usar o mixed-format logging, um log baseado em statement é usado por padrão. Dependendo de certos statements, e também do Storage Engine em uso, o log é automaticamente alterado para baseado em row em casos específicos. A Replication que utiliza o formato misto é referida como mixed-based replication ou mixed-format replication. Para mais informações, consulte [Section 5.4.4.3, “Mixed Binary Logging Format”](binary-log-mixed.html "5.4.4.3 Mixed Binary Logging Format").

Antes do MySQL 5.7.7, o formato baseado em statement era o padrão. No MySQL 5.7.7 e posterior, o formato baseado em row é o padrão.

**NDB Cluster.** O formato de Binary Logging padrão no MySQL NDB Cluster 7.5 é `MIXED`. Você deve notar que o NDB Cluster Replication sempre usa Row-Based Replication, e que o Storage Engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") é incompatível com Statement-Based Replication. Consulte [Section 21.7.2, “General Requirements for NDB Cluster Replication”](mysql-cluster-replication-general.html "21.7.2 General Requirements for NDB Cluster Replication"), para mais informações.

Ao usar o formato `MIXED`, o formato do Binary Logging é determinado em parte pelo Storage Engine em uso e pelo statement sendo executado. Para mais informações sobre mixed-format logging e as regras que regem o suporte de diferentes formatos de logging, consulte [Section 5.4.4.3, “Mixed Binary Logging Format”](binary-log-mixed.html "5.4.4.3 Mixed Binary Logging Format").

O formato de logging em um MySQL Server em execução é controlado pela definição da System Variable de servidor [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format). Essa variável pode ser definida com escopo de Session ou Global. As regras que governam quando e como a nova configuração entra em vigor são as mesmas que para outras System Variables do MySQL Server. Definir a variável para a Session atual dura apenas até o final dessa Session, e a alteração não é visível para outras Sessions. Definir a variável globalmente entra em vigor para clientes que se conectam após a alteração, mas não para quaisquer Sessions de clientes atuais, incluindo a Session onde a configuração da variável foi alterada. Para tornar a configuração da System Variable Global permanente, de modo que se aplique em reinicializações do servidor, você deve defini-la em um arquivo de opção. Para mais informações, consulte [Section 13.7.4.1, “SET Syntax for Variable Assignment”](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").

Existem condições sob as quais você não pode alterar o formato do Binary Logging em tempo de execução, ou fazê-lo causa falha na Replication. Consulte [Section 5.4.4.2, “Setting The Binary Log Format”](binary-log-setting.html "5.4.4.2 Setting The Binary Log Format").

Alterar o valor Global de [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) requer privilégios suficientes para definir System Variables Globais. Alterar o valor de Session de [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) requer privilégios suficientes para definir System Variables de Session restritas. Consulte [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

Os formatos de Replication baseados em statement e baseados em row possuem diferentes problemas e limitações. Para uma comparação de suas respectivas vantagens e desvantagens, consulte [Section 16.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based Replication”](replication-sbr-rbr.html "16.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication").

Com a Statement-Based Replication, você pode encontrar problemas ao replicar Stored Routines ou Triggers. Você pode evitar esses problemas usando Row-Based Replication em seu lugar. Para mais informações, consulte [Section 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging").