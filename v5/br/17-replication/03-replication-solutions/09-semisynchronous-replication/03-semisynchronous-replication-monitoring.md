#### 16.3.9.3 Monitoramento da Replicação Semissíncrona

Os plugins para o recurso de replicação semissíncrona expõem diversas variáveis de sistema (system variables) e de status (status variables) que podem ser examinadas para determinar sua configuração e estado operacional.

As system variables refletem como a replicação semissíncrona está configurada. Para verificar seus valores, use [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement"):

```sql
mysql> SHOW VARIABLES LIKE 'rpl_semi_sync%';
```

As status variables permitem monitorar a operação da replicação semissíncrona. Para verificar seus valores, use [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"):

```sql
mysql> SHOW STATUS LIKE 'Rpl_semi_sync%';
```

Quando o source alterna entre replicação assíncrona ou semissíncrona devido a um timeout de bloqueio de Commit (commit-blocking timeout) ou porque uma replica está alcançando o source (catching up), ele define o valor da status variable [`Rpl_semi_sync_master_status`](server-status-variables.html#statvar_Rpl_semi_sync_master_status) apropriadamente. O fallback automático de replicação semissíncrona para assíncrona no source significa que é possível que a system variable [`rpl_semi_sync_master_enabled`](replication-options-source.html#sysvar_rpl_semi_sync_master_enabled) tenha o valor 1 no lado do source, mesmo quando a replicação semissíncrona não está operacional no momento. Você pode monitorar a status variable [`Rpl_semi_sync_master_status`](server-status-variables.html#statvar_Rpl_semi_sync_master_status) para determinar se o source está usando replicação assíncrona ou semissíncrona atualmente.

Para ver quantas replicas semissíncronas estão conectadas, verifique [`Rpl_semi_sync_master_clients`](server-status-variables.html#statvar_Rpl_semi_sync_master_clients).

O número de Commits que foram reconhecidos com sucesso ou sem sucesso pelas replicas são indicados pelas variáveis [`Rpl_semi_sync_master_yes_tx`](server-status-variables.html#statvar_Rpl_semi_sync_master_yes_tx) e [`Rpl_semi_sync_master_no_tx`](server-status-variables.html#statvar_Rpl_semi_sync_master_no_tx).

No lado da replica, [`Rpl_semi_sync_slave_status`](server-status-variables.html#statvar_Rpl_semi_sync_slave_status) indica se a replicação semissíncrona está operacional atualmente.