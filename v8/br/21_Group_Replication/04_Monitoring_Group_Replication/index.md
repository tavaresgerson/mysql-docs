## 20.4 Replicação do Grupo de Monitoramento

20.4.1 GTIDs e Replicação de Grupo

20.4.2 Estados do servidor de replicação em grupo

20.4.3 A tabela replication\_group\_members

20.4.4 A tabela replication\_group\_member\_stats

Você pode usar o Schema de Desempenho do MySQL para monitorar a Replicação por Grupo. Essas tabelas do Schema de Desempenho exibem informações específicas para a Replicação por Grupo:

- `replication_group_member_stats`: Veja a Seção 20.4.4, “A tabela replication\_group\_member\_stats”.

- `replication_group_members`: Veja a Seção 20.4.3, “A tabela replication\_group\_members”.

- `replication_group_communication_information`: Veja a Seção 29.12.11.12, “A tabela replication\_group\_communication\_information”.

Essas tabelas de replicação do Schema de Desempenho também mostram informações relacionadas à Replicação por Grupo:

- `replication_connection_status` mostra informações sobre a Replicação em Grupo, como as transações recebidas do grupo e colocadas na fila do aplicável (registro do retransmissor).

- `replication_applier_status` mostra os estados dos canais e threads relacionados à Replicação por Grupo. Esses também podem ser usados para monitorar o que as threads individuais dos trabalhadores estão fazendo.

Os canais de replicação criados pelo plugin de replicação em grupo estão listados aqui:

- `group_replication_recovery`: Usado para alterações de replicação relacionadas à recuperação distribuída.

- `group_replication_applier`: Usado para as alterações recebidas do grupo, para aplicar transações que vêm diretamente do grupo.

Para obter informações sobre as variáveis do sistema que afetam a Replicação em Grupo, consulte a Seção 20.9.1, “Variáveis do Sistema de Replicação em Grupo”. Consulte a Seção 20.9.2, “Variáveis de Status da Replicação em Grupo”, para obter variáveis de status que fornecem informações sobre a Replicação em Grupo.

A partir do MySQL 8.0.21, as mensagens relacionadas a eventos do ciclo de vida da Replicação por Grupo, exceto erros, são classificadas como mensagens de sistema; essas mensagens são sempre escritas no log de erro do membro do grupo de replicação. Você pode usar essas informações para revisar o histórico da associação de um servidor específico a um grupo de replicação. (Anteriormente, esses eventos eram classificados como mensagens de informação; para um servidor MySQL de uma versão anterior ao 8.0.21, essas mensagens podem ser adicionadas ao log de erro ao definir `log_error_verbosity` para `3`.)

Alguns eventos do ciclo de vida que afetam todo o grupo são registrados em cada membro do grupo, como um novo membro entrar no status `ONLINE` no grupo ou uma eleição primária. Outros eventos são registrados apenas no membro onde ocorrem, como o modo de leitura exclusiva de super ser habilitado ou desabilitado no membro ou o membro sair do grupo. Vários eventos do ciclo de vida que podem indicar um problema se ocorrerem com frequência são registrados como mensagens de alerta, incluindo um membro se tornar inatingível e depois novamente atingível e um membro iniciar a recuperação distribuída por transferência de estado do log binário ou por uma operação de clonagem remota.

Nota

Se você está monitorando uma ou mais instâncias secundárias usando o **mysqladmin**, você deve estar ciente de que uma declaração `FLUSH STATUS` executada por esse utilitário cria um evento GTID na instância local, o que pode afetar operações futuras do grupo.
