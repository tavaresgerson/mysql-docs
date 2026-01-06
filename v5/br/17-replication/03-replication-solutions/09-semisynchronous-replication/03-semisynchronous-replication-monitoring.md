#### 16.3.9.3 Monitoramento da Replicação Semisincronizada

Os plugins para a capacidade de replicação semi-sincronizada exibem várias variáveis de sistema e status que você pode examinar para determinar sua configuração e estado operacional.

A variável do sistema reflete como a replicação semiesincronizada está configurada. Para verificar seus valores, use `SHOW VARIABLES`:

```sql
mysql> SHOW VARIABLES LIKE 'rpl_semi_sync%';
```

As variáveis de status permitem que você monitore o funcionamento da replicação semiesincronizada. Para verificar seus valores, use `SHOW STATUS`:

```sql
mysql> SHOW STATUS LIKE 'Rpl_semi_sync%';
```

Quando a fonte troca entre replicação assíncrona ou semi-síncrona devido ao tempo limite de bloqueio do commit ou à replica que está recuperando, ela define o valor da variável de status `Rpl_semi_sync_master_status` de forma apropriada. A transição automática da replicação semi-síncrona para a assíncrona na fonte significa que é possível que a variável de sistema `rpl_semi_sync_master_enabled` tenha o valor 1 no lado da fonte, mesmo quando a replicação semi-síncrona não está operacional no momento. Você pode monitorar a variável de status `Rpl_semi_sync_master_status` para determinar se a fonte está atualmente usando replicação assíncrona ou semi-síncrona.

Para ver quantos replicados semissíncronos estão conectados, verifique `Rpl_semi_sync_master_clients`.

O número de commits que foram reconhecidos com sucesso ou não pelas réplicas é indicado pelas variáveis `Rpl_semi_sync_master_yes_tx` e `Rpl_semi_sync_master_no_tx`.

No lado da replicação, `Rpl_semi_sync_slave_status` indica se a replicação semi-sincronizada está atualmente operacional.
