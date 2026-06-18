#### B.3.2.9 Erros de comunicação e conexões interrompidas

Se ocorrerem problemas de conexão, como erros de comunicação ou conexões abortadas, use essas fontes de informações para diagnosticar os problemas:

- O log de erros. Veja a Seção 7.4.2, “O Log de Erros”.

- O log de consulta geral. Veja a Seção 7.4.3, “O log de consulta geral”.

- As variáveis de status `Aborted_xxx` e `Connection_errors_xxx`. Veja a Seção 7.1.10, “Variáveis de Status do Servidor”.

- O cache do host, que é acessível usando a tabela do Schema de Desempenho `host_cache`. Veja a Seção 7.1.12.3, “Consultas DNS e o Cache do Host”, e a Seção 29.12.21.3, “A Tabela host\_cache”.

Se a variável de sistema `log_error_verbosity` estiver definida como 3, você pode encontrar mensagens como esta no seu log de erros:

```
[Note] Aborted connection 854 to db: 'employees' user: 'josh'
```

Se um cliente não conseguir se conectar, o servidor incrementa a variável de status `Aborted_connects`. As tentativas de conexão não bem-sucedidas podem ocorrer por motivos como:

- Um cliente tenta acessar um banco de dados, mas não tem privilégios para isso.

- Um cliente usa uma senha incorreta.

- Um pacote de conexão não contém as informações corretas.

- Leva mais de `connect_timeout` segundos para obter um pacote de conexão. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

Se esse tipo de coisa acontecer, pode indicar que alguém está tentando invadir seu servidor! Se o log de consulta geral estiver ativado, as mensagens desses tipos de problemas serão registradas nele.

Se um cliente se conectar com sucesso, mas depois se desconectar de forma inadequada ou for encerrado, o servidor incrementa a variável de status `Aborted_clients` e registra uma mensagem de conexão interrompida no log de erros. A causa pode ser qualquer uma das seguintes:

- O programa cliente não chamou `mysql_close()` antes de sair.

- O cliente havia dormido mais de `wait_timeout` ou `interactive_timeout` segundos sem emitir quaisquer solicitações ao servidor. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

- O programa cliente terminou abruptamente no meio de uma transferência de dados.

Outras razões para problemas com conexões interrompidas ou clientes interrompidos:

- O valor da variável `max_allowed_packet` é muito pequeno ou as consultas exigem mais memória do que a alocada para o **mysqld**. Veja a Seção B.3.2.8, “Pacote muito grande”.

- Uso do protocolo Ethernet com Linux, tanto em modo half quanto em modo full duplex. Alguns drivers de Ethernet do Linux têm esse bug. Você deve testar esse bug transferindo um arquivo enorme usando FTP entre as máquinas cliente e servidor. Se uma transferência ocorrer no modo burst-pause-burst-pause, você está experimentando uma síndrome de duplex Linux. Mude o modo de duplex tanto para o seu cartão de rede quanto para o hub/switch para full duplex ou para half duplex e teste os resultados para determinar o melhor ajuste.

- Um problema com a biblioteca de threads que causa interrupções nas leituras.

- TCP/IP mal configurado.

- Ethernet defeituosos, hubs, switches, cabos, e assim por diante. Isso só pode ser diagnosticado corretamente substituindo o hardware.

Veja também a Seção B.3.2.7, “O servidor MySQL desapareceu”.
