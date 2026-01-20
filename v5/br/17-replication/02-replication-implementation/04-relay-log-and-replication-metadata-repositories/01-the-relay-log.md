#### 16.2.4.1 O Log de Relé

O log de retransmissão, assim como o log binário, é composto por um conjunto de arquivos numerados que contêm eventos que descrevem as alterações no banco de dados, e um arquivo de índice que contém os nomes de todos os arquivos de log de retransmissão usados.

O termo "arquivo de registro de retransmissão" geralmente denota um arquivo numerado individual contendo eventos do banco de dados. O termo "registro de retransmissão" denota coletivamente o conjunto de arquivos de registro de retransmissão numerados, mais o arquivo de índice.

Os arquivos de registro de retransmissão têm o mesmo formato que os arquivos de registro binários e podem ser lidos usando **mysqlbinlog** (veja Seção 4.6.7, “mysqlbinlog — Ferramenta para Processamento de Arquivos de Registro Binários”).

Por padrão, os nomes dos arquivos de registro de retransmissão têm a forma `nome_do_servidor_replica-bin.nnnnnn`, no diretório de dados, onde *`nome_do_servidor_replica`* é o nome do host do servidor replica e *`nnnnnn`* é um número de sequência. Os arquivos de registro de retransmissão sucessivos são criados usando números de sequência sucessivos, começando com `000001`. A replica usa um arquivo de índice para rastrear os arquivos de registro de retransmissão atualmente em uso. O nome padrão do arquivo de índice de registro de retransmissão é `nome_do_servidor_replica-bin.index`, no diretório de dados.

Os nomes dos arquivos de registro de retransmissão padrão e do índice de registro de retransmissão podem ser substituídos, respectivamente, pelas variáveis de sistema `relay_log` e `relay_log_index` (consulte Seção 16.1.6, “Opções e variáveis de registro binário de replicação”).

Se uma réplica usar os nomes padrão de arquivo de log de retransmissão baseados no host, alterar o nome do host de uma réplica após a replicação ter sido configurada pode causar o falhanço da replicação com os erros "Falha ao abrir o log de retransmissão" e "Não foi possível encontrar o log de destino durante a inicialização do log de retransmissão". Esse é um problema conhecido (veja o Bug #2122). Se você antecipar que o nome do host de uma réplica pode mudar no futuro (por exemplo, se a rede for configurada na réplica de forma que seu nome de host possa ser modificado usando DHCP), você pode evitar esse problema completamente usando as variáveis de sistema `relay_log` e `relay_log_index` para especificar explicitamente os nomes dos arquivos de log de retransmissão quando você configura a réplica inicialmente. Isso torna os nomes independentes das mudanças no nome do host do servidor.

Se você encontrar o problema depois que a replicação já tiver começado, uma maneira de contorná-lo é parar o servidor de replicação, prependendo o conteúdo do antigo arquivo de índice do log do retransmissor ao novo, e depois reiniciar a replicação. Em um sistema Unix, isso pode ser feito conforme mostrado aqui:

```sql
$> cat new_relay_log_name.index >> old_relay_log_name.index
$> mv old_relay_log_name.index new_relay_log_name.index
```

Um servidor de replicação cria um novo arquivo de log de retransmissão nas seguintes condições:

- Cada vez que a thread de I/O de replicação é iniciada.

- Quando os logs são limpos (por exemplo, com `FLUSH LOGS` ou **mysqladmin flush-logs**).

- Quando o tamanho do arquivo de registro do relay atual se torna muito grande, isso é determinado da seguinte forma:

  - Se o valor de `max_relay_log_size` for maior que 0, isso é o tamanho máximo do arquivo de log do retransmissor.

  - Se o valor de `max_relay_log_size` for 0, o `max_binlog_size` determina o tamanho máximo do arquivo de log de retransmissão.

O thread de replicação SQL exclui automaticamente cada arquivo de log de relevo após ele ter executado todos os eventos no arquivo e não precisar mais dele. Não há um mecanismo explícito para excluir logs de relevo, pois o thread de replicação SQL cuida disso. No entanto, o `FLUSH LOGS` roda logs de relevo, o que influencia quando o thread de replicação SQL os exclui.
