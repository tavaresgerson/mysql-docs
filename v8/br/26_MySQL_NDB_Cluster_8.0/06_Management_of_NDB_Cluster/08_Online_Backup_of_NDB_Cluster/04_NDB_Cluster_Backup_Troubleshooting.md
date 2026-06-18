#### 25.6.8.4 Solução de problemas de backup do cluster NDB

Se um código de erro for retornado ao solicitar um backup, a causa mais provável é a memória ou espaço em disco insuficiente. Você deve verificar se há memória suficiente alocada para o backup.

Importante

Se você definiu `BackupDataBufferSize` e `BackupLogBufferSize` e a soma deles for maior que 4 MB, então você também deve definir `BackupMemory`.

Você também deve garantir que haja espaço suficiente na partição do disco rígido do destino do backup.

`NDB` não suporta leituras repetidas, o que pode causar problemas com o processo de restauração. Embora o processo de backup seja "quente", restaurar um NDB Cluster a partir do backup não é um processo "quente" de 100%. Isso ocorre porque, durante o processo de restauração, as transações em execução obtêm leituras não repetidas dos dados restaurados. Isso significa que o estado dos dados é inconsistente enquanto a restauração está em andamento.
