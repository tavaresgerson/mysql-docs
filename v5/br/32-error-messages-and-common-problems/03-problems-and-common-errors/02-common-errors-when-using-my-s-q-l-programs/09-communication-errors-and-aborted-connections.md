#### B.3.2.9 Erros de Comunicação e Conexões Abortadas

Se ocorrerem problemas de conexão, como erros de comunicação ou conexões abortadas, use estas fontes de informação para diagnosticar os problemas:

* O error log. Consulte [Seção 5.4.2, “The Error Log”](error-log.html "5.4.2 The Error Log").
* O general query log. Consulte [Seção 5.4.3, “The General Query Log”](query-log.html "5.4.3 The General Query Log").
* As variáveis de status `Aborted_xxx` e `Connection_errors_xxx`. Consulte [Seção 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables").

* O host cache, que é acessível usando a tabela [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table") do Performance Schema. Consulte [Seção 5.1.11.2, “DNS Lookups and the Host Cache”](host-cache.html "5.1.11.2 DNS Lookups and the Host Cache") e [Seção 25.12.16.1, “The host_cache Table”](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table").

Se a variável de sistema [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) estiver definida como 3, você pode encontrar mensagens como esta no seu error log:

```sql
[Note] Aborted connection 854 to db: 'employees' user: 'josh'
```

Se um cliente não conseguir sequer conectar, o server incrementa a variável de status [`Aborted_connects`](server-status-variables.html#statvar_Aborted_connects). Tentativas de conexão malsucedidas podem ocorrer pelos seguintes motivos:

* Um cliente tenta acessar um Database, mas não tem Privileges para isso.

* Um cliente usa uma password incorreta.
* Um connection packet não contém a informação correta.

* Demora mais do que [`connect_timeout`](server-system-variables.html#sysvar_connect_timeout) segundos para obter um connect packet. Consulte [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

Se esse tipo de coisa acontecer, pode indicar que alguém está tentando invadir o seu Server! Se o general query log estiver habilitado, as mensagens para esses tipos de problemas são registradas nele.

Se um cliente conecta com sucesso, mas depois se desconecta de forma inadequada ou é terminado, o server incrementa a variável de status [`Aborted_clients`](server-status-variables.html#statvar_Aborted_clients) e registra uma mensagem de Aborted connection no error log. A causa pode ser qualquer uma das seguintes:

* O programa cliente não chamou [`mysql_close()`](/doc/c-api/5.7/en/mysql-close.html) antes de sair (exiting).

* O cliente estava em estado de "sleeping" por mais de [`wait_timeout`](server-system-variables.html#sysvar_wait_timeout) ou [`interactive_timeout`](server-system-variables.html#sysvar_interactive_timeout) segundos sem emitir qualquer Query ao Server. Consulte [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

* O programa cliente terminou abruptamente no meio de uma transferência de dados.

Outras razões para problemas com aborted connections ou aborted clients:

* O valor da variável [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) é muito pequeno ou as Queries exigem mais memória do que você alocou para o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Consulte [Seção B.3.2.8, “Packet Too Large”](packet-too-large.html "B.3.2.8 Packet Too Large").

* Uso do protocolo Ethernet com Linux, tanto half duplex quanto full duplex. Alguns drivers Ethernet do Linux têm esse bug. Você deve testar a existência desse bug transferindo um arquivo grande usando FTP entre as máquinas Client e Server. Se uma transferência ocorrer no modo burst-pause-burst-pause, você está enfrentando uma síndrome de Duplex do Linux. Altere o modo Duplex da sua placa de rede e do hub/switch para full duplex ou half duplex e teste os resultados para determinar a melhor configuração.

* Um problema com a library de Thread que causa Interrupts nas operações de leitura (reads).

* TCP/IP mal configurado.
* Ethernets, hubs, switches, cabos defeituosos, e assim por diante. Isso só pode ser diagnosticado corretamente substituindo o hardware.

Veja também [Seção B.3.2.7, “MySQL server has gone away”](gone-away.html "B.3.2.7 MySQL server has gone away").