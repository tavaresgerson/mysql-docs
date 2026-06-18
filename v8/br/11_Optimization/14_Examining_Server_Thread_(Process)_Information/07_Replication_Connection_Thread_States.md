### 10.14.7 Estados de conexão de replicação de threads

Estes estados de fio ocorrem em um servidor de replicação, mas estão associados a threads de conexão, e não a threads de E/S ou SQL.

No MySQL 8.0.26, foram feitas alterações incompatíveis nos nomes das instrumentações, incluindo os nomes das etapas do thread, que contêm os termos “master”, que foi alterado para “source”, “slave”, que foi alterado para “replica” e “mts” (para “multithreaded slave”), que foi alterado para “mta” (para “multithreaded applier”). Ferramentas de monitoramento que trabalham com esses nomes de instrumentação podem ser afetadas. Se as alterações incompatíveis tiverem um impacto para você, defina a variável de sistema `terminology_use_previous` para `BEFORE_8_0_26` para fazer o MySQL Server usar as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que as ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar funções individuais ou escopo global para ser o padrão para todas as novas sessões. Quando o escopo global é usado, o log de consultas lentas contém as versões antigas dos nomes.

- `Changing master`

  A partir do MySQL 8.0.26: `Changing replication source`

  O fio está processando uma declaração `CHANGE REPLICATION SOURCE TO` (do MySQL 8.0.23) ou uma declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23).

- `Killing slave`

  O fio está processando uma declaração `STOP REPLICA`.

- `Opening master dump table`

  Esse estado ocorre após `Creating table from master dump`.

- `Reading master dump table data`

  Esse estado ocorre após `Opening master dump table`.

- `Rebuilding the index on master dump table`

  Esse estado ocorre após `Reading master dump table data`.
