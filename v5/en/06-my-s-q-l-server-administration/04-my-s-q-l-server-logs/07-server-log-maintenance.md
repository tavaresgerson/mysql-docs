### 5.4.7 Manutenção de Logs do Servidor

Conforme descrito na [Seção 5.4, “Logs do Servidor MySQL”](server-logs.html "5.4 Logs do Servidor MySQL"), o MySQL Server pode criar vários arquivos de Log diferentes para ajudar a visualizar qual atividade está ocorrendo. No entanto, você deve limpar esses arquivos regularmente para garantir que os Logs não ocupem muito espaço em disco.

Ao usar o MySQL com o *logging* ativado, você pode querer fazer backup e remover arquivos de Log antigos de tempos em tempos e instruir o MySQL a começar a registrar em novos arquivos. Consulte a [Seção 7.2, “Métodos de Backup de Database”](backup-methods.html "7.2 Métodos de Backup de Database").

Em uma instalação Linux (Red Hat), você pode usar o script `mysql-log-rotate` para a manutenção de Logs. Se você instalou o MySQL a partir de uma distribuição RPM, este script deve ter sido instalado automaticamente. Tenha cuidado com este script se estiver usando o Binary Log para Replication. Você não deve remover os Binary Logs até ter certeza de que seu conteúdo foi processado por todas as replicas.

Em outros sistemas, você deve instalar um script curto que você mesmo inicia via **cron** (ou seu equivalente) para o gerenciamento de arquivos de Log.

Para o Binary Log, você pode definir a variável de sistema [`expire_logs_days`](replication-options-binary-log.html#sysvar_expire_logs_days) para que os arquivos de Binary Log expirem automaticamente após um determinado número de dias (consulte a [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html "5.1.7 Variáveis de Sistema do Servidor")). Se você estiver usando Replication, você deve definir a variável para um valor não inferior ao número máximo de dias que suas replicas podem estar atrasadas em relação à source. Para remover Binary Logs sob demanda, use a instrução [`PURGE BINARY LOGS`](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement") (consulte a [Seção 13.4.1.1, “Instrução PURGE BINARY LOGS”](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement")).

Para forçar o MySQL a começar a usar novos arquivos de Log, faça o Flush dos Logs. O *Log flushing* ocorre quando você executa a instrução [`FLUSH LOGS`](flush.html#flush-logs) ou um comando [**mysqladmin flush-logs**](mysqladmin.html "4.5.2 mysqladmin — Um Programa de Administração do MySQL Server"), [**mysqladmin refresh**](mysqladmin.html "4.5.2 mysqladmin — Um Programa de Administração do MySQL Server"), [**mysqldump --flush-logs**](mysqldump.html "4.5.4 mysqldump — Um Programa de Backup de Database"), ou [**mysqldump --master-data**](mysqldump.html "4.5.4 mysqldump — Um Programa de Backup de Database"). Consulte a [Seção 13.7.6.3, “Instrução FLUSH”](flush.html "13.7.6.3 Instrução FLUSH"), [Seção 4.5.2, “mysqladmin — Um Programa de Administração do MySQL Server”](mysqladmin.html "4.5.2 mysqladmin — Um Programa de Administração do MySQL Server") e [Seção 4.5.4, “mysqldump — Um Programa de Backup de Database”](mysqldump.html "4.5.4 mysqldump — Um Programa de Backup de Database"). Além disso, o servidor faz o Flush do Binary Log automaticamente quando o tamanho atual do arquivo de Binary Log atinge o valor da variável de sistema [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size).

[`FLUSH LOGS`](flush.html#flush-logs) suporta modificadores opcionais para permitir o *flushing* seletivo de Logs individuais (por exemplo, [`FLUSH BINARY LOGS`](flush.html#flush-binary-logs)). Consulte a [Seção 13.7.6.3, “Instrução FLUSH”](flush.html "13.7.6.3 Instrução FLUSH").

Uma operação de *log-flushing* tem os seguintes efeitos:

*   Se o *binary logging* estiver ativado, o servidor fecha o arquivo de Binary Log atual e abre um novo arquivo de Log com o próximo número de sequência.
*   Se o *general query logging* ou o *slow query logging* para um arquivo de Log estiver ativado, o servidor fecha e reabre o arquivo de Log.
*   Se o servidor foi iniciado com a opção [`--log-error`](server-options.html#option_mysqld_log-error) para que o *error log* seja escrito em um arquivo, o servidor fecha e reabre o arquivo de Log.

A execução de instruções ou comandos de *log-flushing* requer a conexão ao servidor usando uma conta que tenha o privilégio [`RELOAD`](privileges-provided.html#priv_reload). Em sistemas Unix e Unix-like, outra forma de fazer o Flush dos Logs é enviar um sinal `SIGHUP` para o servidor, o que pode ser feito por `root` ou pela conta proprietária do processo do servidor. Os sinais permitem que o *log flushing* seja realizado sem a necessidade de conectar-se ao servidor. No entanto, `SIGHUP` tem efeitos adicionais além do *log flushing* que podem ser indesejáveis. Para detalhes, consulte a [Seção 4.10, “Tratamento de Sinais Unix no MySQL”](unix-signal-response.html "4.10 Tratamento de Sinais Unix no MySQL").

Conforme mencionado anteriormente, fazer o Flush do Binary Log cria um novo arquivo de Binary Log, enquanto fazer o Flush do *general query log*, *slow query log* ou *error log* apenas fecha e reabre o arquivo de Log. Para estes últimos Logs, para fazer com que um novo arquivo de Log seja criado no Unix, renomeie primeiro o arquivo de Log atual antes de fazer o Flush. No momento do Flush, o servidor abre o novo arquivo de Log com o nome original. Por exemplo, se os arquivos *general query log*, *slow query log* e *error log* forem nomeados `mysql.log`, `mysql-slow.log` e `err.log`, você pode usar uma série de comandos como esta a partir da linha de comando:

```sql
cd mysql-data-directory
mv mysql.log mysql.log.old
mv mysql-slow.log mysql-slow.log.old
mv err.log err.log.old
mysqladmin flush-logs
```

No Windows, use **rename** em vez de **mv**.

Neste ponto, você pode fazer um backup de `mysql.log.old`, `mysql-slow.log.old` e `err.log.old`, e então removê-los do disco.

Para renomear o *general query log* ou o *slow query log* em tempo de execução (*runtime*), primeiro conecte-se ao servidor e desabilite o Log:

```sql
SET GLOBAL general_log = 'OFF';
SET GLOBAL slow_query_log = 'OFF';
```

Com os Logs desabilitados, renomeie os arquivos de Log externamente (por exemplo, a partir da linha de comando). Em seguida, habilite os Logs novamente:

```sql
SET GLOBAL general_log = 'ON';
SET GLOBAL slow_query_log = 'ON';
```

Este método funciona em qualquer plataforma e não requer um restart do servidor.

Note

Para que o servidor recrie um determinado arquivo de Log depois que você o renomeou externamente, o local do arquivo deve ser gravável (*writable*) pelo servidor. Isso pode nem sempre ser o caso. Por exemplo, no Linux, o servidor pode escrever o *error log* como `/var/log/mysqld.log`, onde `/var/log` pertence ao `root` e não é gravável pelo [**mysqld**](mysqld.html "4.3.1 mysqld — O MySQL Server"). Neste caso, as operações de *log-flushing* falham ao criar um novo arquivo de Log.

Para lidar com esta situação, você deve criar manualmente o novo arquivo de Log com a propriedade (*ownership*) correta após renomear o arquivo de Log original. Por exemplo, execute estes comandos como `root`:

```sql
mv /var/log/mysqld.log /var/log/mysqld.log.old
install -omysql -gmysql -m0644 /dev/null /var/log/mysqld.log
```