#### 16.2.4.1 O Relay Log

O relay log, assim como o binary log, consiste em um conjunto de arquivos numerados contendo eventos que descrevem as alterações no Database, e um arquivo Index que contém os nomes de todos os arquivos de relay log utilizados.

O termo “relay log file” geralmente denota um arquivo numerado individual contendo eventos do Database. O termo “relay log” denota coletivamente o conjunto de arquivos de relay log numerados mais o arquivo Index.

Arquivos de relay log têm o mesmo formato que arquivos de binary log e podem ser lidos usando [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") (consulte [Seção 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files")).

Por padrão, os nomes dos arquivos de relay log têm a forma `host_name-relay-bin.nnnnnn` no diretório de dados, onde *`host_name`* é o nome do host do servidor replica e *`nnnnnn`* é um número de sequência. Arquivos de relay log sucessivos são criados usando números de sequência sucessivos, começando com `000001`. A replica usa um arquivo Index para rastrear os arquivos de relay log atualmente em uso. O nome padrão do arquivo Index do relay log é `host_name-relay-bin.index` no diretório de dados.

Os nomes padrão do arquivo de relay log e do arquivo Index do relay log podem ser substituídos, respectivamente, pelas variáveis de sistema [`relay_log`](replication-options-replica.html#sysvar_relay_log) e [`relay_log_index`](replication-options-replica.html#sysvar_relay_log_index) (consulte [Seção 16.1.6, “Replication and Binary Logging Options and Variables”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables")).

Se uma replica usar os nomes de arquivos de relay log padrão baseados no Host, a alteração do Host Name de uma replica após a configuração da Replication pode causar falha na Replication com os erros *Failed to open the relay log* e *Could not find target log during relay log initialization*. Este é um problema conhecido (consulte Bug #2122). Se você antecipar que o Host Name de uma replica pode mudar no futuro (por exemplo, se o networking estiver configurado na replica de forma que seu Host Name possa ser modificado usando DHCP), você pode evitar esse problema inteiramente usando as variáveis de sistema [`relay_log`](replication-options-replica.html#sysvar_relay_log) e [`relay_log_index`](replication-options-replica.html#sysvar_relay_log_index) para especificar os nomes dos arquivos de relay log explicitamente quando você configurar a replica inicialmente. Isso torna os nomes independentes de alterações no Host Name do Server.

Se você encontrar o problema depois que a Replication já tiver começado, uma maneira de contorná-lo é parar o servidor replica, adicionar o conteúdo do arquivo Index de relay log antigo no início do novo, e então reiniciar a replica. Em um sistema Unix, isso pode ser feito conforme mostrado aqui:

```sql
$> cat new_relay_log_name.index >> old_relay_log_name.index
$> mv old_relay_log_name.index new_relay_log_name.index
```

Um servidor replica cria um novo arquivo de relay log sob as seguintes condições:

* Cada vez que a I/O thread de Replication inicia.
* Quando os Logs são *flushed* (por exemplo, com [`FLUSH LOGS`](flush.html#flush-logs) ou [**mysqladmin flush-logs**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program")).

* Quando o tamanho do arquivo de relay log atual se torna muito grande, determinado da seguinte forma:

  + Se o valor de [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size) for maior que 0, esse é o tamanho máximo do arquivo de relay log.

  + Se o valor de [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size) for 0, [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size) determina o tamanho máximo do arquivo de relay log.

A SQL thread de Replication exclui automaticamente cada arquivo de relay log depois de executar todos os eventos no arquivo e não precisar mais dele. Não há um mecanismo explícito para excluir relay logs porque a SQL thread de Replication se encarrega disso. No entanto, [`FLUSH LOGS`](flush.html#flush-logs) rotaciona os relay logs, o que influencia quando a SQL thread de Replication os exclui.