#### 15.4.1.1 Declaração de PURGE BINARY LOGS

```
PURGE { BINARY | MASTER } LOGS {
    TO 'log_name'
  | BEFORE datetime_expr
}
```

O log binário é um conjunto de arquivos que contêm informações sobre as modificações de dados feitas pelo servidor MySQL. O log consiste em um conjunto de arquivos de log binário, além de um arquivo de índice (consulte a Seção 7.4.4, “O Log Binário”).

A declaração `PURGE BINARY LOGS` exclui todos os arquivos de log binários listados no arquivo de índice de log antes do nome ou da data do arquivo de log especificado. `BINARY` e `MASTER` são sinônimos. Os arquivos de log excluídos também são removidos da lista registrada no arquivo de índice, para que o arquivo de log especificado se torne o primeiro na lista.

`PURGE BINARY LOGS` requer o privilégio `BINLOG_ADMIN`. Esta declaração não tem efeito se o servidor não foi iniciado com a opção `--log-bin` para habilitar o registro binário.

Exemplos:

```
PURGE BINARY LOGS TO 'mysql-bin.010';
PURGE BINARY LOGS BEFORE '2019-04-02 22:46:26';
```

O argumento `datetime_expr` da variante `BEFORE` deve avaliar para um valor `DATETIME` (um valor no formato `'YYYY-MM-DD hh:mm:ss'`).

`PURGE BINARY LOGS` é seguro para ser executado enquanto as réplicas estão replicando. Você não precisa interromper o processo. Se você tiver uma replica ativa que está lendo atualmente um dos arquivos de log que você está tentando excluir, essa declaração não exclui o arquivo de log que está em uso ou quaisquer arquivos de log posteriores a esse, mas exclui quaisquer arquivos de log anteriores. Uma mensagem de aviso é emitida nessa situação. No entanto, se uma replica não estiver conectada e você limpar um dos arquivos de log que ela ainda não leu, a replica não poderá replicar após se reconectar.

`PURGE BINARY LOGS` não deve ser emitido enquanto uma declaração `LOCK INSTANCE FOR BACKUP` estiver em vigor para a instância, porque isso viola as regras do bloqueio de backup ao remover arquivos do servidor. A partir do MySQL 8.0.28, isso é desaconselhado.

Para limpar os arquivos de log binários com segurança, siga este procedimento:

1. Em cada réplica, use `SHOW REPLICA STATUS` para verificar qual arquivo de log ele está lendo.

2. Obtenha uma lista dos arquivos de log binário na fonte com `SHOW BINARY LOGS`.

3. Determine o arquivo de registro mais antigo entre todas as réplicas. Este é o arquivo de destino. Se todas as réplicas estiverem atualizadas, este é o último arquivo de registro na lista.

4. Faça um backup de todos os arquivos de registro que você está prestes a excluir. (Essa etapa é opcional, mas sempre aconselhável.)

5. Limpe todos os arquivos de registro até, mas não incluindo, o arquivo de destino.

`PURGE BINARY LOGS TO` e `PURGE BINARY LOGS BEFORE` falham com um erro quando os arquivos de log binários listados no arquivo `.index` foram removidos do sistema por outros meios (como o uso do **rm** no Linux). (Bug #18199, Bug #18453) Para lidar com esses erros, edite o arquivo `.index` (que é um arquivo de texto simples) manualmente para garantir que ele liste apenas os arquivos de log binários que estão realmente presentes, em seguida, execute novamente a instrução `PURGE BINARY LOGS` que falhou.

Os arquivos de log binários são removidos automaticamente após o período de validade do log binário do servidor. A remoção dos arquivos pode ocorrer ao iniciar o servidor e quando o log binário é esvaziado. O período padrão de validade do log binário é de 30 dias. Você pode especificar um período de validade alternativo usando a variável de sistema `binlog_expire_logs_seconds`. Se você estiver usando replicação, você deve especificar um período de validade que não seja menor que o tempo máximo em que suas réplicas podem ficar atrasadas em relação à fonte.
