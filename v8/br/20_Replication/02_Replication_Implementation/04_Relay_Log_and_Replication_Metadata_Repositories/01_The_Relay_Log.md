#### 19.2.4.1 O Log de Retransmissão

O log de retransmissão, assim como o log binário, consiste em um conjunto de arquivos numerados que contêm eventos que descrevem as alterações no banco de dados, e um arquivo de índice que contém os nomes de todos os arquivos de log de retransmissão usados. O local padrão para os arquivos de log de retransmissão é o diretório de dados.

O termo "arquivo de registro de retransmissão" geralmente denota um arquivo numerado individual contendo eventos do banco de dados. O termo "registro de retransmissão" denota coletivamente o conjunto de arquivos de registro de retransmissão numerados, mais o arquivo de índice.

Os arquivos de registro de retransmissão têm o mesmo formato que os arquivos de registro binários e podem ser lidos usando o **mysqlbinlog** (consulte a Seção 6.6.9, “mysqlbinlog — Ferramenta para Processamento de Arquivos de Registro Binário”). Se a compressão de transações de registro binário (disponível a partir do MySQL 8.0.20) estiver em uso, os payloads das transações gravados no log de retransmissão serão comprimidos da mesma maneira que os do registro binário. Para mais informações sobre a compressão de transações de registro binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Registro Binário”.

Para o canal de replicação padrão, os nomes dos arquivos de registro de retransmissão têm a forma padrão `host_name-relay-bin.nnnnnn`, onde `host_name` é o nome do host do servidor replica e `nnnnnn` é um número de sequência. Os arquivos de registro de retransmissão sucessivos são criados usando números de sequência sucessivos, começando com `000001`. Para canais de replicação não padrão, o nome padrão da base é `host_name-relay-bin-channel`, onde `channel` é o nome do canal de replicação registrado no registro de retransmissão.

A réplica usa um arquivo de índice para rastrear os arquivos de log de retransmissão atualmente em uso. O nome padrão do arquivo de índice de log de retransmissão é `host_name-relay-bin.index` para o canal padrão e `host_name-relay-bin-channel.index` para os canais de replicação não padrão.

Os nomes e localizações dos arquivos de registro de retransmissão padrão e do índice de registro de retransmissão podem ser substituídos, respectivamente, pelas variáveis de sistema `relay_log` e `relay_log_index` (consulte a Seção 19.1.6, “Opções e variáveis de registro binário e replicação”).

Se uma réplica usar os nomes padrão de arquivo de log de retransmissão baseados no host, alterar o nome do host de uma réplica após a replicação ter sido configurada pode causar o fracasso da replicação com os erros "Não foi possível abrir o log de retransmissão" e "Não foi possível encontrar o log de destino durante a inicialização do log de retransmissão". Esse é um problema conhecido (veja o Bug #2122). Se você antecipar que o nome do host de uma réplica pode mudar no futuro (por exemplo, se a rede for configurada na réplica de modo que seu nome de host possa ser modificado usando DHCP), você pode evitar esse problema completamente usando as variáveis de sistema `relay_log` e `relay_log_index` para especificar explicitamente os nomes dos arquivos de log de retransmissão quando configurar a réplica inicialmente. Isso faz com que os nomes sejam independentes das mudanças no nome do host do servidor.

Se você encontrar o problema depois que a replicação já tiver começado, uma maneira de contorná-lo é parar o servidor de replicação, prependendo o conteúdo do antigo arquivo de índice do log do retransmissor ao novo, e depois reiniciar a replicação. Em um sistema Unix, isso pode ser feito conforme mostrado aqui:

```
$> cat new_relay_log_name.index >> old_relay_log_name.index
$> mv old_relay_log_name.index new_relay_log_name.index
```

Um servidor de replicação cria um novo arquivo de log de retransmissão nas seguintes condições:

- Cada vez que a thread de I/O de replicação (receptor) é iniciada.

- Quando os logs são limpos (por exemplo, com `FLUSH LOGS` ou **mysqladmin flush-logs**).

- Quando o tamanho do arquivo de registro do relé atual se torna muito grande, o que é determinado da seguinte forma:

  - Se o valor de `max_relay_log_size` for maior que 0, isso é o tamanho máximo do arquivo de registro do relé.

  - Se o valor de `max_relay_log_size` for 0, `max_binlog_size` determina o tamanho máximo do arquivo de registro do relé.

O fio de replicação SQL (aplicável) exclui automaticamente cada arquivo de log de relevo após ele ter executado todos os eventos no arquivo e não precisar mais dele. Não há um mecanismo explícito para excluir logs de relevo, porque o fio de replicação SQL cuida disso. No entanto, o `FLUSH LOGS` roda logs de relevo, o que influencia quando o fio de replicação SQL os exclui.
