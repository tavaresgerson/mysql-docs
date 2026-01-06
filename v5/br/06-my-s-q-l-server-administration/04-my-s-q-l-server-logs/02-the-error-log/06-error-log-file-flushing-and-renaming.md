#### 5.4.2.6 Limpeza e renomeação do arquivo de registro de erros

Se você limpar o log de erros usando uma declaração `FLUSH ERROR LOGS` ou `FLUSH LOGS`, ou um comando **mysqladmin flush-logs**, o servidor fecha e reabre qualquer arquivo de log de erro ao qual está escrevendo. Para renomear um arquivo de log de erro, faça isso manualmente antes de limpar. A limpeza dos logs então abre um novo arquivo com o nome do arquivo original. Por exemplo, assumindo um nome de arquivo de log de `host_name.err`, use os seguintes comandos para renomear o arquivo e criar um novo:

```sql
mv host_name.err host_name.err-old
mysqladmin flush-logs error
mv host_name.err-old backup-directory
```

No Windows, use **rename** em vez de **mv**.

Se o local do arquivo de log de erro não for legível pelo servidor, a operação de esvaziamento do log não consegue criar um novo arquivo de log. Por exemplo, no Linux, o servidor pode gravar o log de erro no arquivo `/var/log/mysqld.log`, onde o diretório `/var/log` pertence a `root` e não é legível por **mysqld**. Para obter informações sobre como lidar com esse caso, consulte Seção 5.4.7, “Manutenção do Log do Servidor”.

Se o servidor não estiver escrevendo em um arquivo de log de erro nomeado, nenhum renomeamento de arquivo de log de erro ocorrerá quando o log de erro for esvaziado.
