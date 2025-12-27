#### 19.4.10.3 Monitoramento da Replicação Semisíncrona

Os plugins para replicação semisíncrona exibem várias variáveis de status que permitem monitorar sua operação. Para verificar os valores atuais das variáveis de status, use `SHOW STATUS`:

```
mysql> SHOW STATUS LIKE 'Rpl_semi_sync%';
```

Todas as variáveis de status `Rpl_semi_sync_xxx` são descritas na Seção 7.1.10, “Variáveis de Status do Servidor”. Alguns exemplos são:

* `Rpl_semi_sync_source_clients`

  O número de réplicas semisíncronas conectadas ao servidor de origem.

* `Rpl_semi_sync_source_status`

  Se a replicação semisíncrona está atualmente operacional no servidor de origem. O valor é 1 se o plugin foi habilitado e um reconhecimento de commit não ocorreu. É 0 se o plugin não estiver habilitado ou o servidor tiver retornado à replicação assíncrona devido ao tempo limite de timeout do reconhecimento de commit.

* `Rpl_semi_sync_source_no_tx`

  O número de commits que não foram reconhecidos com sucesso por uma réplica.

* `Rpl_semi_sync_source_yes_tx`

  O número de commits que foram reconhecidos com sucesso por uma réplica.

* `Rpl_semi_sync_replica_status`

  Se a replicação semisíncrona está atualmente operacional na réplica. É 1 se o plugin foi habilitado e o thread de I/O de replicação (receptor) está em execução, 0 caso contrário.

Quando a fonte troca entre a replicação assíncrona ou semi-síncrona devido ao tempo limite de bloqueio do commit ou à replicação que está recuperando, ela define o valor da variável de status `Rpl_semi_sync_source_status` de forma apropriada. A transição automática da replicação semi-síncrona para a replicação assíncrona na fonte significa que é possível que a variável de sistema `rpl_semi_sync_source_enabled` tenha o valor 1 no lado da fonte, mesmo quando a replicação semi-síncrona não está operacional no momento. Você pode monitorar a variável de status `Rpl_semi_sync_source_status` para determinar se a fonte está atualmente usando a replicação assíncrona ou semi-síncrona.