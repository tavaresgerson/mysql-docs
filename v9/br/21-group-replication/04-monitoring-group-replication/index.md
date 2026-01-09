## 20.4 Replicação do Grupo

20.4.1 GTIDs e Replicação do Grupo

20.4.2 Estados do Servidor de Replicação do Grupo

20.4.3 A Tabela replication_group_members

20.4.4 A Tabela replication_group_member_stats

Você pode usar o Schema de Desempenho do MySQL para monitorar a Replicação do Grupo. Essas tabelas do Schema de Desempenho exibem informações específicas para a Replicação do Grupo:

* `replication_group_member_stats`: Veja a Seção 20.4.4, “A Tabela replication_group_member_stats”.

* `replication_group_members`: Veja a Seção 20.4.3, “A Tabela replication_group_members”.

* `replication_group_communication_information`: Veja a Seção 29.12.11.14, “A Tabela replication_group_communication_information”.

Essas tabelas de replicação do Schema de Desempenho também mostram informações relacionadas à Replicação do Grupo:

* `replication_connection_status` exibe informações sobre a Replicação do Grupo, como transações recebidas do grupo e colocadas na fila da aplicação (registro do remetente).

* `replication_applier_status` exibe os estados dos canais e threads relacionados à Replicação do Grupo. Esses também podem ser usados para monitorar o que os threads de trabalhador individuais estão fazendo.

Os canais de replicação criados pelo plugin de Replicação do Grupo estão listados aqui:

* `group_replication_recovery`: Usado para alterações de replicação relacionadas à recuperação distribuída.

* `group_replication_applier`: Usado para as alterações recebidas do grupo, para aplicar transações que vêm diretamente do grupo.

Para informações sobre variáveis do sistema que afetam a Replicação do Grupo, veja a Seção 20.9.1, “Variáveis de Sistema de Replicação do Grupo”. Veja a Seção 20.9.2, “Variáveis de Status de Replicação do Grupo”, para variáveis de status que fornecem informações sobre a Replicação do Grupo.

Mensagens relacionadas a eventos do ciclo de vida da replicação em grupo, exceto erros, são classificadas como mensagens de sistema; essas são sempre escritas no log de erro do membro do grupo de replicação. Você pode usar essas informações para revisar o histórico da associação de um servidor específico em um grupo de replicação.

Alguns eventos do ciclo de vida que afetam todo o grupo são registrados em cada membro do grupo, como um novo membro entrar no status `ONLINE` no grupo ou uma eleição primária. Outros eventos são registrados apenas no membro onde ocorrem, como o modo de leitura exclusiva de super ser habilitado ou desabilitado no membro, ou o membro sair do grupo. Vários eventos do ciclo de vida que podem indicar um problema se ocorrerem com frequência são registrados como mensagens de alerta, incluindo um membro tornar-se inatingível e depois novamente atingível, e um membro iniciar a recuperação distribuída por transferência de estado do log binário ou por uma operação de clonagem remota.

Nota

Se você está monitorando uma ou mais instâncias secundárias usando **mysqladmin**, você deve estar ciente de que uma declaração `FLUSH STATUS` executada por esse utilitário cria um evento GTID na instância local, o que pode impactar futuras operações do grupo.

O usuário da Edição Empresarial do MySQL também pode usar as capacidades avançadas de monitoramento integradas aos componentes MySQL listados aqui:

* *Metricas do Aplicador de Replicação*: Adiciona tabelas ao Schema de Desempenho do MySQL (`replication_applier_metrics` e `replication_applier_progress_by_worker`) que contêm informações detalhadas sobre o desempenho do aplicador e do trabalhador. Consulte a Seção 7.5.6.1, “Componente de Metricas do Aplicador de Replicação”, além das descrições das tabelas do Schema de Desempenho, para obter mais informações.

* *Estatísticas de Controle de Fluxo de Replicação em Grupo*: Fornece variáveis de status globais adicionais que fornecem informações sobre a execução do controle de fluxo de replicação em grupo, ou seja, informações sobre o controle de transações. Consulte a Seção 7.5.6.2, “Componente de Estatísticas de Controle de Fluxo de Replicação em Grupo”.

* *Gerador de Recursos de Replicação em Grupo*: Monitora o canal de aplicação, o canal de recuperação e o uso da memória do sistema em cada membro do grupo; expulsa membros do grupo que experimentam um atraso excessivo no canal ou uso excessivo de memória (e permite que eles retornem mais tarde). Consulte a Seção 7.5.6.3, “Componente Gerador de Recursos de Replicação em Grupo”, para obter mais informações.