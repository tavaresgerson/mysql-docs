### 9.3.3 Resumo da Estratégia de Backup

Em caso de falha do sistema operacional ou falha de energia, o próprio `InnoDB` realiza toda a tarefa de recuperação de dados. No entanto, para garantir que você possa dormir tranquilo, observe as seguintes diretrizes:

* Sempre configure o servidor MySQL com o registro binário habilitado (que é o ajuste padrão para o MySQL 8.4). Se você tiver meios de segurança, essa técnica também pode ser útil para o equilíbrio de carga do disco (o que resulta em uma melhoria de desempenho).
* Faça backups completos periódicos, usando o comando `mysqldump` mostrado anteriormente na Seção 9.3.1, “Estabelecimento de uma Política de Backup”, que realiza um backup online e não bloqueia.
* Faça backups incrementais periódicos, limpando os logs com `FLUSH LOGS` ou `mysqladmin flush-logs`.