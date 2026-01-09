#### B.3.2.9 Erros de comunicação e conexões interrompidas

Se ocorrerem problemas de conexão, como erros de comunicação ou conexões abortadas, use essas fontes de informações para diagnosticar os problemas:

- O log de erros. Veja [Seção 5.4.2, “O Log de Erros”](error-log.html).

- O log de consultas gerais. Consulte [Seção 5.4.3, “O log de consultas gerais”](query-log.html).

- As variáveis de status `Aborted_xxx` e `Connection_errors_xxx`. Consulte [Seção 5.1.9, “Variáveis de Status do Servidor”](server-status-variables.html).

- O cache do host, que é acessível usando a tabela do Schema de Desempenho [`host_cache`](performance-schema-host-cache-table.html). Veja [Seção 5.1.11.2, “Consultas DNS e o Cache do Host”](host-cache.html) e [Seção 25.12.16.1, “A Tabela host\_cache”](performance-schema-host-cache-table.html).

Se a variável de sistema [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) estiver definida como 3, você pode encontrar mensagens como esta no seu log de erros:

```sql
[Note] Aborted connection 854 to db: 'employees' user: 'josh'
```

Se um cliente não conseguir se conectar, o servidor incrementa a variável de status [`Aborted_connects`](server-status-variables.html#statvar_Aborted_connects). As tentativas de conexão não bem-sucedidas podem ocorrer por várias razões:

- Um cliente tenta acessar um banco de dados, mas não tem privilégios para isso.

- Um cliente usa uma senha incorreta.

- Um pacote de conexão não contém as informações corretas.

- Leva mais de \[`connect_timeout`]\(server-system-variables.html#sysvar\_connect\_timeout] segundos para obter um pacote de conexão. Veja [Seção 5.1.7, “Variáveis do Sistema do Servidor”](server-system-variables.html).

Se esse tipo de coisa acontecer, pode indicar que alguém está tentando invadir seu servidor! Se o log de consulta geral estiver ativado, as mensagens desses tipos de problemas serão registradas nele.

Se um cliente se conectar com sucesso, mas depois se desconectar de forma inadequada ou for encerrado, o servidor incrementa a variável de status [`Aborted_clients`](server-status-variables.html#statvar_Aborted_clients) e registra uma mensagem de conexão Abortada no log de erros. A causa pode ser qualquer uma das seguintes:

- O programa cliente não chamou [`mysql_close()`](/doc/c-api/5.7/pt-BR/mysql-close.html) antes de sair.

- O cliente havia dormido mais de \[`wait_timeout`]\(server-system-variables.html#sysvar\_wait\_timeout] ou \[`interactive_timeout`]\(server-system-variables.html#sysvar\_interactive\_timeout] segundos sem emitir quaisquer solicitações ao servidor. Veja [Seção 5.1.7, “Variáveis do Sistema do Servidor”](server-system-variables.html).

- O programa cliente terminou abruptamente no meio de uma transferência de dados.

Outras razões para problemas com conexões interrompidas ou clientes interrompidos:

- O valor da variável [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) é muito pequeno ou as consultas exigem mais memória do que a alocada para o [**mysqld**](mysqld.html). Veja [Seção B.3.2.8, “Pacote muito grande”](packet-too-large.html).

- Uso do protocolo Ethernet com Linux, tanto em modo half quanto em modo full duplex. Alguns drivers de Ethernet do Linux têm esse bug. Você deve testar esse bug transferindo um arquivo enorme usando FTP entre as máquinas cliente e servidor. Se uma transferência ocorrer no modo burst-pause-burst-pause, você está experimentando uma síndrome de duplex Linux. Mude o modo de duplex tanto para o seu cartão de rede quanto para o hub/switch para full duplex ou para half duplex e teste os resultados para determinar o melhor ajuste.

- Um problema com a biblioteca de threads que causa interrupções nas leituras.

- TCP/IP mal configurado.

- Ethernet defeituosos, hubs, switches, cabos, e assim por diante. Isso só pode ser diagnosticado corretamente substituindo o hardware.

Veja também [Seção B.3.2.7, “O servidor MySQL desapareceu”](gone-away.html).
