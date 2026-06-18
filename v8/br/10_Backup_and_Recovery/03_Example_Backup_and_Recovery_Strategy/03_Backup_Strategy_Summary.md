### 9.3.3 Resumo da estratégia de backup

Em caso de falha do sistema operacional ou queda de energia, o próprio `InnoDB` faz todo o trabalho de recuperação de dados. Mas para garantir que você possa dormir tranquilo, observe as seguintes diretrizes:

- Sempre ative o servidor MySQL com o registro binário habilitado (que é a configuração padrão do MySQL 8.0). Se você tiver esse tipo de mídia segura, essa técnica também pode ser útil para o equilíbrio de carga do disco (o que resulta em uma melhoria do desempenho).

- Faça backups completos periódicos, usando o comando **mysqldump** mostrado anteriormente na Seção 9.3.1, “Estabelecendo uma Política de Backup”, que faz um backup online, sem bloqueio.

- Faça backups incrementais periódicos, limpando os logs com `FLUSH LOGS` ou **mysqladmin flush-logs**.
