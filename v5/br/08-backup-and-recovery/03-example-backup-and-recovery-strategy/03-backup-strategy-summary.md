### 7.3.3 Resumo da Estratégia de Backup

Em caso de falha do sistema operacional ou queda de energia, o próprio `InnoDB` faz todo o trabalho de recuperação de dados. Mas para garantir que você possa dormir tranquilo, observe as seguintes diretrizes:

- Sempre execute o servidor MySQL com a opção `--log-bin`, ou até mesmo `--log-bin=log_name`, onde o nome do arquivo de log está localizado em algum meio seguro diferente do disco em que o diretório de dados está localizado. Se você tiver esse meio seguro, essa técnica também pode ser útil para o equilíbrio de carga do disco (o que resulta em uma melhoria do desempenho).

- Faça backups completos periódicos, usando o comando **mysqldump** mostrado anteriormente na Seção 7.3.1, “Estabelecendo uma Política de Backup”, que faz um backup online, sem bloqueio.

- Faça backups incrementais periódicos, limpando os logs com `FLUSH LOGS` ou **mysqladmin flush-logs**.
