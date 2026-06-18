#### 19.4.10.3 Monitoramento da Replicação Semisincronizada

Os plugins para replicação semi-sincronizada exibem várias variáveis de status que permitem monitorar sua operação. Para verificar os valores atuais das variáveis de status, use `SHOW STATUS`:

```
mysql> SHOW STATUS LIKE 'Rpl_semi_sync%';
```

A partir do MySQL 8.0.26, novas versões dos plugins de fonte e replica são fornecidas, que substituem os termos “master” e “slave” por “fonte” e “replica” nas variáveis de sistema e variáveis de status. Se você instalar os novos plugins `rpl_semi_sync_source` e `rpl_semi_sync_replica`, as novas variáveis de sistema e variáveis de status estarão disponíveis, mas as antigas não. Se você instalar os antigos plugins `rpl_semi_sync_master` e `rpl_semi_sync_slave`, as antigas variáveis de sistema e variáveis de status estarão disponíveis, mas as novas não. Você não pode ter ambas as versões nova e antiga do plugin relevante instalado em uma instância.

Todas as variáveis de status `Rpl_semi_sync_xxx` são descritas na Seção 7.1.10, “Variáveis de Status do Servidor”. Alguns exemplos são:

- `Rpl_semi_sync_source_clients` ou `Rpl_semi_sync_master_clients`

  O número de réplicas semissíncronas conectadas ao servidor de origem.

- `Rpl_semi_sync_source_status` ou `Rpl_semi_sync_master_status`

  Se a replicação semi-sincronizada está atualmente operacional no servidor de origem. O valor é 1 se o plugin tiver sido habilitado e um reconhecimento de commit não ocorrer. É 0 se o plugin não estiver habilitado ou se o servidor tiver retornado para a replicação assíncrona devido ao tempo limite de reconhecimento de commit.

- `Rpl_semi_sync_source_no_tx` ou `Rpl_semi_sync_master_no_tx`

  O número de commits que não foram reconhecidos com sucesso por uma réplica.

- `Rpl_semi_sync_source_yes_tx` ou `Rpl_semi_sync_master_yes_tx`

  O número de commits que foram reconhecidos com sucesso por uma réplica.

- `Rpl_semi_sync_replica_status` ou `Rpl_semi_sync_slave_status`

  Se a replicação semi-sincronizada está atualmente em operação na replica. É 1 se o plugin tiver sido habilitado e o thread de I/O de replicação (receptor) estiver em execução, 0 caso contrário.

Quando a fonte troca entre replicação assíncrona ou semi-síncrona devido ao tempo limite de bloqueio do commit ou quando uma réplica está recuperando, ela define o valor da variável de status `Rpl_semi_sync_source_status` ou `Rpl_semi_sync_master_status` de forma apropriada. A transição automática da replicação semi-síncrona para a replicação assíncrona na fonte significa que é possível que a variável de sistema `rpl_semi_sync_source_enabled` ou `rpl_semi_sync_master_enabled` tenha um valor de 1 no lado da fonte, mesmo quando a replicação semi-síncrona não está operacional no momento. Você pode monitorar a variável de status `Rpl_semi_sync_source_status` ou `Rpl_semi_sync_master_status` para determinar se a fonte está atualmente usando replicação assíncrona ou semi-síncrona.
