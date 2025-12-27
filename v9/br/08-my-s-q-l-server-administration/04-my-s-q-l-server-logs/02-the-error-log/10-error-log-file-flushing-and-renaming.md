#### 7.4.2.10 Limpeza e Renomeação do Arquivo de Registro de Erros

Se você limpar o registro de erros usando uma instrução `FLUSH ERROR LOGS` ou `FLUSH LOGS`, ou um comando **mysqladmin flush-logs**, o servidor fecha e reabre qualquer arquivo de registro de erros ao qual está escrevendo. Para renomear um arquivo de registro de erros, faça isso manualmente antes de limpar. A limpeza dos logs então abre um novo arquivo com o nome original do arquivo. Por exemplo, assumindo um nome de arquivo de log de `host_name.err`, use os seguintes comandos para renomear o arquivo e criar um novo:

```
mv host_name.err host_name.err-old
mysqladmin flush-logs error
mv host_name.err-old backup-directory
```

No Windows, use **rename** em vez de **mv**.

Se a localização do arquivo de registro de erros não for legível pelo servidor, a operação de limpeza de logs falha ao criar um novo arquivo de log. Por exemplo, no Linux, o servidor pode escrever o registro de erros no arquivo `/var/log/mysqld.log`, onde o diretório `/var/log` é de propriedade de `root` e não é legível pelo **mysqld**. Para obter informações sobre como lidar com esse caso, consulte a Seção 7.4.6, “Manutenção do Log do Servidor”.

Se o servidor não estiver escrevendo em um arquivo de log de erro nomeado, não ocorre renomeação de arquivo de log de erro quando o log de erros é limpo.