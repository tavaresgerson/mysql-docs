### 7.4.6 Manutenção dos Registros do Servidor

Como descrito na Seção 7.4, “Registros do Servidor MySQL”, o Servidor MySQL pode criar vários arquivos de registro diferentes para ajudá-lo a ver quais atividades estão ocorrendo. No entanto, você deve limpar esses arquivos regularmente para garantir que os logs não ocupem muito espaço no disco.

Ao usar o MySQL com o registro habilitado, você pode querer fazer backup e remover arquivos de log antigos de tempos em tempos e dizer ao MySQL para começar a registrar em novos arquivos. Veja a Seção 9.2, “Métodos de Backup de Banco de Dados”.

Em uma instalação Linux (Red Hat), você pode usar o script `mysql-log-rotate` para a manutenção dos logs. Se você instalou o MySQL a partir de uma distribuição RPM, este script deve ter sido instalado automaticamente. Tenha cuidado com este script se você estiver usando o log binário para replicação. Você não deve remover logs binários até ter certeza de que seu conteúdo foi processado por todas as réplicas.

Em outros sistemas, você deve instalar um script curto você mesmo que você inicia a partir do `cron` (ou seu equivalente) para lidar com os arquivos de log.

Os arquivos de log binários são removidos automaticamente após o período de validade do log binário do servidor. A remoção dos arquivos pode ocorrer ao inicializar e quando o log binário é esvaziado. O período de validade padrão do log binário é de 30 dias. Para especificar um período de validade alternativo, use a variável de sistema `binlog_expire_logs_seconds`. Se você estiver usando replicação, você deve especificar um período de validade que não seja menor que o tempo máximo em que suas réplicas podem ficar atrasadas em relação à fonte. Para remover logs binários sob demanda, use a declaração `PURGE BINARY LOGS` (veja a Seção 15.4.1.1, “Declaração PURGE BINARY LOGS”).

Para forçar o MySQL a começar a usar novos arquivos de log, limpe os logs. O esvaziamento dos logs ocorre quando você executa uma instrução `FLUSH LOGS` ou um comando `mysqladmin flush-logs`, `mysqladmin refresh`, `mysqldump` `--flush-logs` ou `mysqldump` `--source-data`. Veja a Seção 15.7.8.3, “Instrução FLUSH”, a Seção 6.5.2, “mysqladmin — Um Programa de Administração do Servidor MySQL” e a Seção 6.5.4, “mysqldump — Um Programa de Backup de Bancos de Dados”. Além disso, o servidor esvazia o log binário automaticamente quando o tamanho atual do arquivo de log binário atinge o valor da variável de sistema `max_binlog_size`.

A instrução `FLUSH LOGS` suporta modificadores opcionais para permitir o esvaziamento seletivo de logs individuais (por exemplo, `FLUSH BINARY LOGS`). Veja a Seção 15.7.8.3, “Instrução FLUSH”.

A operação de esvaziamento dos logs tem os seguintes efeitos:

* Se o registro binário estiver habilitado, o servidor fecha o arquivo de log binário atual e abre um novo arquivo de log com o próximo número de sequência.
* Se o registro de consultas gerais ou o registro de consultas lentas para um arquivo de log estiverem habilitados, o servidor fecha e reabre o arquivo de log.
* Se o servidor foi iniciado com a opção `--log-error` para fazer com que o log de erros seja escrito em um arquivo, o servidor fecha e reabre o arquivo de log.

A execução de instruções ou comandos de esvaziamento dos logs requer a conexão com o servidor usando uma conta que tenha o privilégio `RELOAD`. Em sistemas Unix e Unix-like, outra maneira de esvaziar os logs é enviar um sinal para o servidor, o que pode ser feito por `root` ou a conta que possui o processo do servidor. (Veja a Seção 6.10, “Manipulação de Sinais Unix no MySQL”.) Os sinais permitem que o esvaziamento dos logs seja realizado sem a necessidade de se conectar ao servidor:

* O sinal `SIGHUP` esvazia todos os logs. No entanto, `SIGHUP` tem efeitos adicionais além da esvaziamento de logs que podem ser indesejáveis.
* `SIGUSR1` faz o servidor esvaziar o log de erros, o log de consultas gerais e o log de consultas lentas. Se você estiver interessado em esvaziar apenas esses logs, `SIGUSR1` pode ser usado como um sinal mais "leve" que não tem os efeitos de `SIGHUP` que não estão relacionados aos logs.

Como mencionado anteriormente, o esvaziamento do log binário cria um novo arquivo de log binário, enquanto o esvaziamento do log de consultas gerais, do log de consultas lentas ou do log de erros apenas fecha e reabre o arquivo de log. Para esses últimos logs, para causar a criação de um novo arquivo de log no Unix, renomeie primeiro o arquivo de log atual antes de esvaziá-lo. No momento do esvaziamento, o servidor abre o novo arquivo de log com o nome original. Por exemplo, se os arquivos de log de consultas gerais, log de consultas lentas e log de erros forem chamados de `mysql.log`, `mysql-slow.log` e `err.log`, você pode usar uma série de comandos como este a partir da linha de comando:

```
cd mysql-data-directory
mv mysql.log mysql.log.old
mv mysql-slow.log mysql-slow.log.old
mv err.log err.log.old
mysqladmin flush-logs
```

No Windows, use `rename` em vez de `mv`.

Neste ponto, você pode fazer um backup de `mysql.log.old`, `mysql-slow.log.old` e `err.log.old`, depois removê-los do disco.

Para renomear o log de consultas gerais ou o log de consultas lentas em tempo de execução, conecte-se primeiro ao servidor e desabilite o log:

```
SET GLOBAL general_log = 'OFF';
SET GLOBAL slow_query_log = 'OFF';
```

Com os logs desativados, renomeie os arquivos de log externamente (por exemplo, a partir da linha de comando). Em seguida, habilite os logs novamente:

```
SET GLOBAL general_log = 'ON';
SET GLOBAL slow_query_log = 'ON';
```

Este método funciona em qualquer plataforma e não requer o reinício do servidor.

::: info Nota

Para que o servidor recree um arquivo de log específico após você ter renomeado o arquivo externamente, a localização do arquivo deve ser legível pelo servidor. Isso nem sempre é o caso. Por exemplo, no Linux, o servidor pode escrever o log de erros como `/var/log/mysqld.log`, onde `/var/log` é de propriedade de `root` e não é legível pelo `mysqld`. Nesse caso, as operações de esvaziamento de logs não conseguem criar um novo arquivo de log.

Para lidar com essa situação, você deve criar manualmente o novo arquivo de log com a propriedade correta após renomear o arquivo de log original. Por exemplo, execute esses comandos como `root`:

```
mv /var/log/mysqld.log /var/log/mysqld.log.old
install -omysql -gmysql -m0644 /dev/null /var/log/mysqld.log
```