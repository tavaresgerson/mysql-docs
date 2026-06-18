#### 21.6.8.4 Solução de Problemas de Backup do NDB Cluster

Se um código de erro for retornado ao emitir uma solicitação de Backup, a causa mais provável é memória ou espaço em Disk insuficientes. Você deve verificar se há memória suficiente alocada para o Backup.

Importante

Se você definiu [`BackupDataBufferSize`] e [`BackupLogBufferSize`] e a soma deles for maior que 4MB, você também deve definir [`BackupMemory`].

Você também deve garantir que haja espaço suficiente na partição do hard drive do destino do Backup.

[`NDB`] não oferece suporte a *repeatable reads*, o que pode causar problemas no processo de restauração. Embora o processo de Backup seja “hot” (quente), restaurar um NDB Cluster a partir de um Backup não é um processo 100% “hot”. Isso ocorre devido ao fato de que, durante a duração do processo de restauração, as transações em execução obtêm *nonrepeatable reads* dos dados restaurados. Isso significa que o estado dos dados fica inconsistente enquanto a restauração está em andamento.