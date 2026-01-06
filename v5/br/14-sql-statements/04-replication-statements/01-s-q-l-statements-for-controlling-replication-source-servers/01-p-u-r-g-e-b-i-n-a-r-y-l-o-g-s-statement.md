#### 13.4.1.1 Declaração de PURGE BINARY LOGS

```sql
PURGE { BINARY | MASTER } LOGS {
    TO 'log_name'
  | BEFORE datetime_expr
}
```

O log binário é um conjunto de arquivos que contêm informações sobre as modificações de dados feitas pelo servidor MySQL. O log consiste em um conjunto de arquivos de log binário, além de um arquivo de índice (consulte Seção 5.4.4, “O Log Binário”).

A instrução `PURGE BINARY LOGS` exclui todos os arquivos de log binários listados no arquivo de índice de log antes do nome ou da data do arquivo de log especificado. `BINARY` e `MASTER` são sinônimos. Os arquivos de log excluídos também são removidos da lista registrada no arquivo de índice, para que o arquivo de log especificado se torne o primeiro na lista.

A opção `PURGE BINARY LOGS` requer o privilégio `BINLOG_ADMIN`. Esta declaração não tem efeito se o servidor não foi iniciado com a opção `--log-bin` para habilitar o registro binário.

Exemplos:

```sql
PURGE BINARY LOGS TO 'mysql-bin.010';
PURGE BINARY LOGS BEFORE '2019-04-02 22:46:26';
```

O argumento *`datetime_expr`* da variante `BEFORE` deve avaliar-se a um valor de `[DATETIME]` (um valor no formato `'YYYY-MM-DD hh:mm:ss'`).

Esta declaração é segura para ser executada enquanto as réplicas estão replicando. Você não precisa interromper o processo. Se você tiver uma replica ativa que está lendo atualmente um dos arquivos de log que você está tentando excluir, esta declaração não exclui o arquivo de log que está em uso ou quaisquer arquivos de log posteriores a esse, mas exclui quaisquer arquivos de log anteriores. Uma mensagem de aviso é emitida nesta situação. No entanto, se uma replica não estiver conectada e você excluir um dos arquivos de log que ela ainda não leu, a replica não poderá replicar após se reconectar.

Para limpar os arquivos de log binários com segurança, siga este procedimento:

1. Em cada réplica, use `SHOW SLAVE STATUS` para verificar qual arquivo de log ele está lendo.

2. Obtenha uma lista dos arquivos de log binário no servidor de origem da replicação com `SHOW BINARY LOGS`.

3. Determine o arquivo de registro mais antigo entre todas as réplicas. Este é o arquivo de destino. Se todas as réplicas estiverem atualizadas, este é o último arquivo de registro na lista.

4. Faça um backup de todos os arquivos de registro que você está prestes a excluir. (Essa etapa é opcional, mas sempre aconselhável.)

5. Limpe todos os arquivos de registro até, mas não incluindo, o arquivo de destino.

Você também pode definir a variável de sistema `expire_logs_days` para expirar os arquivos de log binários automaticamente após um número determinado de dias (consulte Seção 5.1.7, “Variáveis de Sistema do Servidor”). Se você estiver usando a replicação, você deve definir a variável não menor que o número máximo de dias em que suas réplicas podem ficar atrasadas em relação à fonte.

`PURGE BINARY LOGS TO` e `PURGE BINARY LOGS BEFORE` falham com um erro quando os arquivos de log binários listados no arquivo `.index` foram removidos do sistema por outros meios (como o uso do **rm** no Linux). (Bug #18199, Bug #18453) Para lidar com esses erros, edite manualmente o arquivo `.index` (que é um arquivo de texto simples) para garantir que ele liste apenas os arquivos de log binários que estão realmente presentes, em seguida, execute novamente a declaração `PURGE BINARY LOGS` que falhou.
