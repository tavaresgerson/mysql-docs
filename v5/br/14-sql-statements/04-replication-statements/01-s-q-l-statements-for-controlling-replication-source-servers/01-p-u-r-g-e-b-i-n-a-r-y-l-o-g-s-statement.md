#### 13.4.1.1 Instrução PURGE BINARY LOGS

```sql
PURGE { BINARY | MASTER } LOGS {
    TO 'log_name'
  | BEFORE datetime_expr
}
```

O Binary Log é um conjunto de arquivos que contém informações sobre modificações de dados feitas pelo servidor MySQL. O log consiste em um conjunto de arquivos de Binary Log, mais um arquivo Index (consulte [Seção 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log")).

A instrução [`PURGE BINARY LOGS`](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement") exclui todos os arquivos de Binary Log listados no arquivo Index do log anteriores ao nome de arquivo de log ou data especificados. `BINARY` e `MASTER` são sinônimos. Os arquivos de log excluídos também são removidos da lista registrada no arquivo Index, de modo que o arquivo de log fornecido se torna o primeiro na lista.

[`PURGE BINARY LOGS`](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement") requer o privilégio [`BINLOG_ADMIN`](/doc/refman/8.0/en/privileges-provided.html#priv_binlog-admin). Esta instrução não tem efeito se o servidor não foi iniciado com a opção [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) para habilitar o binary logging.

Exemplos:

```sql
PURGE BINARY LOGS TO 'mysql-bin.010';
PURGE BINARY LOGS BEFORE '2019-04-02 22:46:26';
```

O argumento *`datetime_expr`* da variante `BEFORE` deve ser avaliado como um valor [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") (um valor no formato `'YYYY-MM-DD hh:mm:ss'`).

Esta instrução é segura para executar enquanto as Replicas estão replicando. Não é necessário pará-las. Se você tiver uma Replica ativa que está lendo atualmente um dos Log Files que você está tentando excluir, esta instrução não exclui o Log File que está em uso ou quaisquer Log Files posteriores a esse, mas exclui quaisquer Log Files anteriores. Uma mensagem de aviso é emitida nesta situação. No entanto, se uma Replica não estiver conectada e você por acaso fizer o Purge de um dos Log Files que ela ainda precisa ler, a Replica não poderá replicar depois que se reconectar.

Para fazer o Purge de Log Files de Binary Log com segurança, siga este procedimento:

1. Em cada Replica, use [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") para verificar qual Log File ela está lendo.

2. Obtenha uma listagem dos Log Files de Binary Log no servidor Source de Replication com [`SHOW BINARY LOGS`](show-binary-logs.html "13.7.5.1 SHOW BINARY LOGS Statement").

3. Determine o Log File mais antigo entre todas as Replicas. Este é o arquivo Target. Se todas as Replicas estiverem atualizadas (up to date), este é o último Log File da lista.

4. Faça um backup de todos os Log Files que você está prestes a excluir. (Esta etapa é opcional, mas sempre aconselhável.)

5. Faça o Purge de todos os Log Files até, mas não incluindo, o arquivo Target.

Você também pode definir a variável de sistema [`expire_logs_days`](replication-options-binary-log.html#sysvar_expire_logs_days) para expirar automaticamente os Log Files de Binary Log após um determinado número de dias (consulte [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables")). Se você estiver usando Replication, você deve definir a variável não abaixo do número máximo de dias que suas Replicas podem atrasar em relação ao Source.

[`PURGE BINARY LOGS TO`] e [`PURGE BINARY LOGS BEFORE`] falham com um erro quando os Log Files de Binary Log listados no arquivo `.index` foram removidos do sistema por outros meios (como usar **rm** no Linux). (Bug #18199, Bug #18453) Para lidar com tais erros, edite o arquivo `.index` (que é um arquivo de texto simples) manualmente para garantir que ele liste apenas os Log Files de Binary Log que estão realmente presentes, e então execute novamente a instrução [`PURGE BINARY LOGS`](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement") que falhou.