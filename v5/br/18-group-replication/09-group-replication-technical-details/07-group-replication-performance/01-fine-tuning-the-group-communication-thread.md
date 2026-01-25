#### 17.9.7.1 Ajuste Fino da Thread de Comunicação do Grupo

A Thread de comunicação do grupo (GCT) executa em um loop enquanto o Plugin Group Replication está carregado. A GCT recebe mensagens do grupo e do plugin, gerencia tarefas relacionadas a quorum e detecção de falhas, envia algumas mensagens de *keep alive* e também gerencia as transactions de entrada e saída de/para o server/grupo. A GCT aguarda por mensagens de entrada em uma Queue. Quando não há mensagens, a GCT espera. Configurar essa espera para ser um pouco mais longa (realizando um *active wait*) antes de efetivamente entrar em estado de espera (*sleep*) pode ser benéfico em alguns casos. Isso ocorre porque a alternativa é o sistema operacional tirar a GCT do processador e realizar um *context switch*.

Para forçar a GCT a realizar um *active wait*, use a opção [`group_replication_poll_spin_loops`](group-replication-system-variables.html#sysvar_group_replication_poll_spin_loops), que faz com que a GCT execute em um loop, sem realizar nenhuma tarefa relevante pelo número configurado de loops, antes de efetivamente fazer o *poll* na Queue para a próxima mensagem.

Por exemplo:

```sql
mysql> SET GLOBAL group_replication_poll_spin_loops= 10000;
```