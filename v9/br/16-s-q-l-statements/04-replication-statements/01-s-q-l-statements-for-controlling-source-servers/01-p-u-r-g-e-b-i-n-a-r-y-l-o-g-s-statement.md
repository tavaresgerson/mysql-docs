#### 15.4.1.1 Declaração de PURGE BINARY LOGS

```
PURGE BINARY LOGS {
    TO 'log_name'
  | BEFORE datetime_expr
}
```

O log binário é um conjunto de arquivos que contêm informações sobre as modificações de dados feitas pelo servidor MySQL. O log consiste em um conjunto de arquivos de log binário, além de um arquivo de índice (veja a Seção 7.4.4, “O Log Binário”).

A declaração `PURGE BINARY LOGS` exclui todos os arquivos de log binário listados no arquivo de índice de log antes do nome ou da data do arquivo de log especificado. Os arquivos de log excluídos também são removidos da lista registrada no arquivo de índice, para que o arquivo de log fornecido se torne o primeiro na lista.

`PURGE BINARY LOGS` requer o privilégio `BINLOG_ADMIN`. Esta declaração não tem efeito se o servidor não foi iniciado com a opção `--log-bin` para habilitar o registro binário.

Exemplos:

```
PURGE BINARY LOGS TO 'mysql-bin.010';
PURGE BINARY LOGS BEFORE '2019-04-02 22:46:26';
```

O argumento *`datetime_expr`* da variante `BEFORE` deve avaliar-se a um valor `DATETIME` (um valor no formato `'YYYY-MM-DD hh:mm:ss'`).

`PURGE BINARY LOGS` é seguro para ser executado enquanto as réplicas estão replicando. Você não precisa interromper o processo. Se você tiver uma replica ativa que atualmente está lendo um dos arquivos de log que você está tentando excluir, esta declaração não exclui o arquivo de log que está em uso ou quaisquer arquivos de log posteriores a esse, mas exclui quaisquer arquivos de log anteriores. Uma mensagem de aviso é emitida nesta situação. No entanto, se uma replica não estiver conectada e você excluir um dos arquivos de log que ela ainda precisa ler, a replica não pode replicar após se reconectar.

`PURGE BINARY LOGS` não pode ser emitido enquanto uma declaração `LOCK INSTANCE FOR BACKUP` estiver em vigor para a instância, porque viola as regras do bloqueio de backup ao remover arquivos do servidor.

Para excluir com segurança os arquivos de log binário, siga este procedimento:

1. Em cada replica, use `SHOW REPLICA STATUS` para verificar qual arquivo de log ela está lendo.

2. Obtenha uma lista dos arquivos de log binário na fonte com `SHOW BINARY LOGS`.

3. Determine o arquivo de log mais antigo entre todas as réplicas. Este é o arquivo alvo. Se todas as réplicas estiverem atualizadas, este é o último arquivo de log na lista.

4. Faça um backup de todos os arquivos de log que você está prestes a excluir. (Este passo é opcional, mas sempre aconselhável.)

5. Limpe todos os arquivos de log até, mas não incluindo, o arquivo alvo.

`PURGE BINARY LOGS TO` e `PURGE BINARY LOGS BEFORE` falham com um erro quando os arquivos de log binário listados no arquivo `.index` foram removidos do sistema por outros meios (como usar **rm** no Linux). (Bug #18199, Bug #18453). Para lidar com tais erros, edite o arquivo `.index` (que é um arquivo de texto simples) manualmente para garantir que ele liste apenas os arquivos de log binário que estão realmente presentes, em seguida, execute novamente a declaração `PURGE BINARY LOGS` que falhou.

Os arquivos de log binário são removidos automaticamente após o período de validade do log binário do servidor. A remoção dos arquivos pode ocorrer durante o inicialização e quando o log binário é esvaziado. O período de validade padrão do log binário é de 30 dias. Você pode especificar um período de validade alternativo usando a variável de sistema `binlog_expire_logs_seconds`. Se você estiver usando replicação, você deve especificar um período de validade que não seja menor que o tempo máximo em que suas réplicas podem ficar atrasadas em relação à fonte.