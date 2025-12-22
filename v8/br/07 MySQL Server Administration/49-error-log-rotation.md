#### 7.4.2.10 Arquivo de registo de erros

Se você limpar o registro de erros usando uma instrução `FLUSH ERROR LOGS` ou `FLUSH LOGS`, ou um comando **mysqladmin flush-logs**, o servidor fecha e reabre qualquer arquivo de registro de erros para o qual está escrevendo. Para renomear um arquivo de registro de erros, faça isso manualmente antes de limpar. Limpar os registros abre um novo arquivo com o nome original do arquivo. Por exemplo, assumindo um nome de arquivo de registro de `host_name.err`, use os seguintes comandos para renomear o arquivo e criar um novo:

```
mv host_name.err host_name.err-old
mysqladmin flush-logs error
mv host_name.err-old backup-directory
```

No Windows, use **rename** em vez de **mv**.

Se a localização do arquivo de log de erro não for escrevível pelo servidor, a operação de lavagem de log não consegue criar um novo arquivo de log. Por exemplo, no Linux, o servidor pode escrever o log de erro no arquivo `/var/log/mysqld.log`, onde o diretório `/var/log` é de propriedade do `root` e não é escrevível pelo `mysqld`. Para informações sobre como lidar com este caso, consulte a Seção 7.4.6, Manutenção do Log do Servidor.

Se o servidor não estiver escrevendo para um arquivo de log de erro nomeado, nenhum arquivo de log de erro será renomeado quando o log de erro for limpo.
