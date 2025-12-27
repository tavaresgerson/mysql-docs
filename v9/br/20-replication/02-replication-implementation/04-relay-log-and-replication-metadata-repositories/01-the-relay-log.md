#### 19.2.4.1 O Log de Relé

O log de réeis, assim como o log binário, consiste em um conjunto de arquivos numerados que contêm eventos que descrevem as alterações no banco de dados, e um arquivo de índice que contém os nomes de todos os arquivos de log de réeis usados. A localização padrão dos arquivos de log de réeis é o diretório de dados.

O termo “arquivo de log de réeis” geralmente denota um arquivo numerado individual que contém eventos do banco de dados. O termo “log de réeis” denota coletivamente o conjunto de arquivos de log de réeis numerados, mais o arquivo de índice.

Os arquivos de log de réeis têm o mesmo formato que os arquivos de log binário e podem ser lidos usando **mysqlbinlog** (veja a Seção 6.6.9, “mysqlbinlog — Ferramenta para Processamento de Arquivos de Log Binário”). Se a compressão de transações de log binário estiver em uso, as cargas de trabalho de transações escritas no log de réeis são comprimidas da mesma maneira que no log binário. Para mais informações sobre a compressão de transações de log binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

Para o canal de replicação padrão, os nomes dos arquivos de log de réeis têm a forma padrão `nome_do_servidor_replica-bin.nnnnnn`, onde *`nome_do_servidor_replica`* é o nome do host do servidor replica e *`nnnnnn`* é um número de sequência. Arquivos de log de réeis consecutivos são criados usando números de sequência consecutivos, começando com `000001`. Para canais de replicação não padrão, o nome padrão de base é `nome_do_servidor_replica-bin-canal`, onde *`canal`* é o nome do canal de replicação registrado no log de réeis.

A replica usa um arquivo de índice para rastrear os arquivos de log de réeis atualmente em uso. O nome padrão do arquivo de índice de log de réeis é `nome_do_servidor_replica-bin.index` para o canal padrão, e `nome_do_servidor_replica-bin-canal.index` para canais de replicação não padrão.

Os nomes e locais padrão dos arquivos de log de retransmissão e dos arquivos de índice de log de retransmissão podem ser substituídos, respectivamente, pelas variáveis de sistema `relay_log` e `relay_log_index` (consulte a Seção 19.1.6, “Opções e variáveis de registro binário de replicação”).

Se uma replica usar os nomes padrão dos arquivos de log de retransmissão baseados no host, alterar o nome do host de uma replica após a replicação ter sido configurada pode causar o falhanço da replicação com os erros “Falha ao abrir o log de retransmissão” e “Não foi possível encontrar o log de destino durante a inicialização do log de retransmissão”. Esse é um problema conhecido (consulte o Bug #2122). Se você antecipar que o nome do host de uma replica pode mudar no futuro (por exemplo, se a rede for configurada na replica de forma que seu nome de host possa ser modificado usando DHCP), você pode evitar esse problema completamente usando as variáveis de sistema `relay_log` e `relay_log_index` para especificar explicitamente os nomes dos arquivos de log de retransmissão quando configurar a replica inicialmente. Isso faz com que os nomes sejam independentes das mudanças no nome do host do servidor.

Se você encontrar o problema após a replicação já ter começado, uma maneira de contorná-lo é parar o servidor da replica, prependendo o conteúdo do antigo arquivo de índice de log de retransmissão ao novo, e depois reiniciar a replica. Em um sistema Unix, isso pode ser feito como mostrado aqui:

```
$> cat new_relay_log_name.index >> old_relay_log_name.index
$> mv old_relay_log_name.index new_relay_log_name.index
```

Uma replicação cria um novo arquivo de log de retransmissão nas seguintes condições:

* Toda vez que o thread de I/O de replicação (receptor) começa.
* Quando os logs são descarregados (por exemplo, com `FLUSH LOGS` ou **mysqladmin flush-logs**).

* Quando o tamanho do arquivo de log de retransmissão atual se torna muito grande, o que é determinado da seguinte forma:

  + Se o valor de `max_relay_log_size` for maior que 0, isso é o tamanho máximo do arquivo de log de retransmissão.

+ Se o valor de `max_relay_log_size` for 0, `max_binlog_size` determina o tamanho máximo do arquivo de log de retransmissão.

O thread de SQL de replicação (aplicador) exclui automaticamente cada arquivo de log de retransmissão após executar todos os eventos no arquivo e não precisar mais dele. Não há um mecanismo explícito para excluir logs de retransmissão, pois o thread de SQL de replicação cuida disso. No entanto, o `FLUSH LOGS` rotação logs de retransmissão, o que influencia quando o thread de SQL de replicação os exclui.