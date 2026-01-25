#### 5.4.2.6 Descarregamento e Renomeação do Arquivo de Error Log

Se você descarregar o Error Log usando uma instrução [`FLUSH ERROR LOGS`](flush.html#flush-error-logs) ou [`FLUSH LOGS`](flush.html#flush-logs), ou um comando [**mysqladmin flush-logs**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), o Server fecha e reabre qualquer arquivo de Error Log no qual esteja escrevendo. Para renomear um arquivo de Error Log, faça-o manualmente antes do descarregamento (flushing). Descarregar os Logs abre então um novo arquivo com o nome de arquivo original. Por exemplo, assumindo um nome de arquivo de Log como `host_name.err`, use os seguintes comandos para renomear o arquivo e criar um novo:

```sql
mv host_name.err host_name.err-old
mysqladmin flush-logs error
mv host_name.err-old backup-directory
```

No Windows, use **rename** em vez de **mv**.

Se o local do arquivo de Error Log não for gravável pelo Server, a operação de descarregamento de Log falhará ao criar um novo arquivo de Log. Por exemplo, no Linux, o Server pode escrever o Error Log no arquivo `/var/log/mysqld.log`, onde o diretório `/var/log` pertence ao `root` e não é gravável pelo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Para obter informações sobre como lidar com este caso, consulte [Seção 5.4.7, “Manutenção de Logs do Server”](log-file-maintenance.html "5.4.7 Server Log Maintenance").

Se o Server não estiver escrevendo em um arquivo de Error Log nomeado, nenhuma renomeação do arquivo de Error Log ocorrerá quando o Error Log for descarregado.