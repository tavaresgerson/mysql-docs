### 7.4.6 Manutenção do registo do servidor

Como descrito na Seção 7.4, "Logos do Servidor MySQL", o MySQL Server pode criar vários arquivos de log diferentes para ajudá-lo a ver qual atividade está ocorrendo. No entanto, você deve limpar esses arquivos regularmente para garantir que os logs não ocupem muito espaço em disco.

Ao usar o MySQL com o registro ativado, você pode querer fazer backup e remover arquivos de registro antigos de tempos em tempos e dizer ao MySQL para iniciar o registro de novos arquivos.

Em uma instalação do Linux (Red Hat), você pode usar o script `mysql-log-rotate` para manutenção de logs. Se você instalou o MySQL a partir de uma distribuição RPM, este script deveria ter sido instalado automaticamente. Tenha cuidado com este script se você estiver usando o log binário para replicação. Você não deve remover logs binários até ter certeza de que seu conteúdo foi processado por todas as réplicas.

Em outros sistemas, você deve instalar um script curto que você inicia a partir de **cron** (ou seu equivalente) para lidar com arquivos de log.

Os arquivos de log binário são automaticamente removidos após o período de expiração do log binário do servidor. A remoção dos arquivos pode ocorrer no início e quando o log binário é limpo. O período de expiração do log binário padrão é de 30 dias. Para especificar um período de expiração alternativo, use a variável de sistema `binlog_expire_logs_seconds`. Se você estiver usando a replicação, você deve especificar um período de expiração que não seja menor do que a quantidade máxima de tempo que suas réplicas podem ficar para trás da fonte. Para remover logs binários sob demanda, use a instrução `PURGE BINARY LOGS` (ver Seção 15.4.1.1, PURGE BINARY LOGS Statement).

Para forçar o MySQL a começar a usar novos arquivos de log, limpe os logs. O limpeza de logs ocorre quando você executa uma instrução `FLUSH LOGS` ou um comando **mysqladmin flush-logs**, **mysqladmin refresh**, `mysqldump` `--flush-logs`, ou `mysqldump` `--source-data`. Veja Seção 15.7.8.3, FLUSH Statement, Seção 6.5.2, mysqladmin  A MySQL Server Administration Program, e Seção 6.5.4, mysqldump  A Database Backup Program. Além disso, o servidor limpa o log binário automaticamente quando o tamanho atual do arquivo de log binário atinge o valor da variável do sistema `max_binlog_size`.

`FLUSH LOGS` suporta modificadores opcionais para permitir o enxaguamento seletivo de registros individuais (por exemplo, `FLUSH BINARY LOGS`).

Uma operação de lavagem de troncos tem os seguintes efeitos:

- Se o registro binário estiver habilitado, o servidor fecha o arquivo de registro binário atual e abre um novo arquivo de registro com o próximo número de sequência.
- Se o registro de consultas gerais ou o registro lento de consultas para um arquivo de log estiver ativado, o servidor fecha e reabre o arquivo de log.
- Se o servidor foi iniciado com a opção `--log-error` para fazer com que o log de erros seja escrito em um arquivo, o servidor fecha e reabre o arquivo de log.

A execução de instruções ou comandos de lavagem de logs requer a conexão com o servidor usando uma conta que tenha o privilégio `RELOAD`. Em sistemas Unix e Unix-like, outra maneira de limpar os logs é enviar um sinal para o servidor, o que pode ser feito pelo `root` ou pela conta que possui o processo do servidor.

- Um sinal de `SIGHUP` limpa todos os logs. No entanto, `SIGHUP` tem efeitos adicionais que podem ser indesejáveis.
- `SIGUSR1` faz com que o servidor limpe o registro de erros, o registro de consultas gerais e o registro de consultas lentas. Se você estiver interessado em limpar apenas esses registros, `SIGUSR1` pode ser usado como um sinal mais "leve" que não tem os efeitos `SIGHUP` que não estão relacionados aos registros.

Como mencionado anteriormente, limpar o log binário cria um novo arquivo de log binário, enquanto limpar o log de consulta geral, o log de consulta lenta ou o log de erro apenas fecha e reabre o arquivo de log. Para os últimos registros, para causar um novo arquivo de log ser criado no Unix, renomeie o arquivo de log atual primeiro antes de limpá-lo. No momento do flush, o servidor abre o novo arquivo de log com o nome original. Por exemplo, se o arquivo de log de consulta geral, o log de consulta lenta e os arquivos de log de erro são nomeados `mysql.log`, `mysql-slow.log`, e `err.log`, você pode usar uma série de comandos como este da linha de comando:

```
cd mysql-data-directory
mv mysql.log mysql.log.old
mv mysql-slow.log mysql-slow.log.old
mv err.log err.log.old
mysqladmin flush-logs
```

No Windows, use **rename** em vez de **mv**.

Neste ponto, você pode fazer um backup de `mysql.log.old`, `mysql-slow.log.old`, e `err.log.old`, em seguida, removê-los do disco.

Para renomear o log de consulta geral ou o log de consulta lenta no tempo de execução, primeiro conecte-se ao servidor e desative o log:

```
SET GLOBAL general_log = 'OFF';
SET GLOBAL slow_query_log = 'OFF';
```

Com os logs desativados, renomeie os arquivos de log externamente (por exemplo, a partir da linha de comando).

```
SET GLOBAL general_log = 'ON';
SET GLOBAL slow_query_log = 'ON';
```

Este método funciona em qualquer plataforma e não requer um reinicio do servidor.

::: info Note

Para que o servidor recrie um determinado arquivo de log depois que você renomeou o arquivo externamente, o local do arquivo deve ser escrevível pelo servidor. Isso pode nem sempre ser o caso. Por exemplo, no Linux, o servidor pode escrever o log de erro como `/var/log/mysqld.log`, onde `/var/log` é de propriedade de `root` e não escrevível por `mysqld`. Neste caso, as operações de lavagem de log falham em criar um novo arquivo de log.

Para lidar com esta situação, você deve criar manualmente o novo arquivo de log com a propriedade apropriada depois de renomear o arquivo de log original. Por exemplo, execute estes comandos como `root`:

```
mv /var/log/mysqld.log /var/log/mysqld.log.old
install -omysql -gmysql -m0644 /dev/null /var/log/mysqld.log
```

:::
