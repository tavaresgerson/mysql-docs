### 7.3.3 Resumo da Estratégia de Backup

Em caso de falha do sistema operacional ou falta de energia, o próprio `InnoDB` realiza todo o trabalho de recuperação de dados. Mas para garantir que você possa dormir tranquilo, observe as seguintes diretrizes:

*   Sempre execute o `MySQL server` com a opção `--log-bin`, ou até mesmo `--log-bin=log_name`, onde o nome do `log file` esteja localizado em alguma mídia segura diferente do `drive` onde o `data directory` está. Se você tiver essa mídia segura, esta técnica também pode ser boa para o `disk load balancing` (o que resulta em um `performance improvement`).

*   Faça `full backups` periódicos, usando o comando **mysqldump** mostrado anteriormente na Seção 7.3.1, “Estabelecendo uma Política de Backup”, que faz um `backup online` e `nonblocking` (sem bloqueio).

*   Faça `incremental backups` periódicos fazendo o `flushing dos logs` com `FLUSH LOGS` ou `mysqladmin flush-logs`.