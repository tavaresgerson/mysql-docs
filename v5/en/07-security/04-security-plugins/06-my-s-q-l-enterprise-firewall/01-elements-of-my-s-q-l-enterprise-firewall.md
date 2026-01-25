#### 6.4.6.1 Elementos do MySQL Enterprise Firewall

O MySQL Enterprise Firewall é baseado em uma biblioteca de *plugins* que inclui estes elementos:

*   Um *plugin server-side* chamado `MYSQL_FIREWALL` examina as *SQL statements* antes de sua execução e, com base nos *profiles* de *firewall* registrados, toma a decisão de executar ou rejeitar cada *statement*.

*   *Plugins server-side* chamados `MYSQL_FIREWALL_USERS` e `MYSQL_FIREWALL_WHITELIST` implementam as *INFORMATION_SCHEMA tables* que fornecem *views* dos *profiles* registrados.

*   Os *Profiles* são armazenados em *cache* na memória para melhor *performance*. As *tables* no *system database* `mysql` fornecem o *storage* persistente de suporte para os dados do *firewall*.

*   *Stored procedures* executam tarefas como registrar *profiles* de *firewall*, estabelecer seu modo operacional e gerenciar a transferência de dados do *firewall* entre o *cache* em memória e o *storage* persistente.

*   Funções administrativas fornecem uma *API* para tarefas de nível inferior, como sincronizar o *cache* com o *storage* persistente.

*   *System variables* habilitam a configuração do *firewall*, e *status variables* fornecem informações operacionais em tempo de execução (*runtime*).