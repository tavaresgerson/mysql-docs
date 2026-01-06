### 5.4.7 Manutenção do Log do Servidor

Como descrito na Seção 5.4, "Logs do Servidor MySQL", o MySQL Server pode criar vários arquivos de log diferentes para ajudá-lo a ver quais atividades estão ocorrendo. No entanto, você deve limpar esses arquivos regularmente para garantir que os logs não ocupem muito espaço no disco.

Ao usar o MySQL com o registro habilitado, você pode querer fazer backup e remover arquivos de log antigos de tempos em tempos e dizer ao MySQL para começar a registrar em novos arquivos. Veja Seção 7.2, “Métodos de Backup de Banco de Dados”.

Em uma instalação Linux (Red Hat), você pode usar o script `mysql-log-rotate` para a manutenção dos logs. Se você instalou o MySQL a partir de uma distribuição RPM, este script deve ter sido instalado automaticamente. Tenha cuidado com este script se você estiver usando o log binário para replicação. Você não deve remover logs binários até ter certeza de que seus conteúdos foram processados por todas as réplicas.

Em outros sistemas, você deve instalar um pequeno script que você inicia a partir do **cron** (ou seu equivalente) para lidar com os arquivos de log.

Para o log binário, você pode definir a variável de sistema `expire_logs_days` para expirar os arquivos de log binário automaticamente após um número determinado de dias (consulte Seção 5.1.7, “Variáveis de Sistema do Servidor”). Se você estiver usando a replicação, deve definir a variável não menor que o número máximo de dias em que suas réplicas podem ficar atrasadas em relação à fonte. Para remover logs binários sob demanda, use a instrução `PURGE BINARY LOGS` (consulte Seção 13.4.1.1, “Instrução PURGE BINARY LOGS”).

Para forçar o MySQL a começar a usar novos arquivos de log, limpe os logs. O esvaziamento dos logs ocorre quando você executa uma instrução `FLUSH LOGS`, o comando **mysqladmin flush-logs**, **mysqladmin refresh**, **mysqldump --flush-logs** ou **mysqldump --master-data**. Veja Seção 13.7.6.3, “Instrução FLUSH”, Seção 4.5.2, “mysqladmin — Um Programa de Administração do Servidor MySQL” e Seção 4.5.4, “mysqldump — Um Programa de Backup de Bancos de Dados”. Além disso, o servidor esvazia o log binário automaticamente quando o tamanho atual do arquivo de log binário atinge o valor da variável de sistema `max_binlog_size`.

`FLUSH LOGS` suporta modificadores opcionais para permitir o esvaziamento seletivo de logs individuais (por exemplo, `FLUSH BINARY LOGS`). Veja Seção 13.7.6.3, “Instrução FLUSH”.

Uma operação de limpeza de logs tem os seguintes efeitos:

- Se o registro binário estiver habilitado, o servidor fecha o arquivo de registro binário atual e abre um novo arquivo de registro com o próximo número de sequência.

- Se o registro de consultas gerais ou o registro de consultas lentas em um arquivo de log estiverem habilitados, o servidor fecha e reabre o arquivo de log.

- Se o servidor foi iniciado com a opção `--log-error` para gravar o log de erros em um arquivo, o servidor fecha e reabre o arquivo de log.

A execução de declarações ou comandos de esvaziamento de logs requer a conexão com o servidor usando uma conta que tenha o privilégio `RELOAD`. Em sistemas Unix e similares, outra maneira de esvaziar os logs é enviar um sinal `SIGHUP` para o servidor, o que pode ser feito pelo `root` ou pela conta que possui o processo do servidor. Os sinais permitem que o esvaziamento de logs seja realizado sem a necessidade de se conectar ao servidor. No entanto, o `SIGHUP` tem efeitos adicionais além do esvaziamento de logs que podem ser indesejáveis. Para obter detalhes, consulte Seção 4.10, “Tratamento de Sinais Unix no MySQL”.

Como mencionado anteriormente, o esvaziamento do log binário cria um novo arquivo de log binário, enquanto o esvaziamento do log de consultas gerais, do log de consultas lentas ou do log de erros apenas fecha e reabre o arquivo de log. Para esses últimos logs, para criar um novo arquivo de log no Unix, renomeie primeiro o arquivo de log atual antes de esvaziá-lo. No momento do esvaziamento, o servidor abre o novo arquivo de log com o nome original. Por exemplo, se os arquivos de log de consultas gerais, consultas lentas e erros forem chamados de `mysql.log`, `mysql-slow.log` e `err.log`, você pode usar uma série de comandos como este na linha de comando:

```sql
cd mysql-data-directory
mv mysql.log mysql.log.old
mv mysql-slow.log mysql-slow.log.old
mv err.log err.log.old
mysqladmin flush-logs
```

No Windows, use **rename** em vez de **mv**.

Neste ponto, você pode fazer um backup de `mysql.log.old`, `mysql-slow.log.old` e `err.log.old`, e depois removê-los do disco.

Para renomear o log de consulta geral ou o log de consulta lenta durante a execução, conecte-se primeiro ao servidor e desabilite o log:

```sql
SET GLOBAL general_log = 'OFF';
SET GLOBAL slow_query_log = 'OFF';
```

Com os registros desativados, renomeie os arquivos de registro externamente (por exemplo, a partir da linha de comando). Em seguida, reative os registros:

```sql
SET GLOBAL general_log = 'ON';
SET GLOBAL slow_query_log = 'ON';
```

Esse método funciona em qualquer plataforma e não requer reinício do servidor.

Nota

Para que o servidor recree um arquivo de registro específico após você ter renomeado o arquivo externamente, a localização do arquivo deve ser legível pelo servidor. Isso nem sempre é o caso. Por exemplo, no Linux, o servidor pode escrever o log de erro como `/var/log/mysqld.log`, onde `/var/log` pertence a `root` e não é legível por **mysqld**. Nesse caso, as operações de varredura de log não conseguem criar um novo arquivo de log.

Para lidar com essa situação, você deve criar manualmente o novo arquivo de log com a propriedade correta após renomear o arquivo de log original. Por exemplo, execute esses comandos como `root`:

```sql
mv /var/log/mysqld.log /var/log/mysqld.log.old
install -omysql -gmysql -m0644 /dev/null /var/log/mysqld.log
```
