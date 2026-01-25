#### 25.12.3.5 A Tabela socket_instances

A tabela [`socket_instances`](performance-schema-socket-instances-table.html "25.12.3.5 The socket_instances Table") fornece um snapshot em tempo real das conexões ativas com o servidor MySQL. A tabela contém uma linha para cada conexão TCP/IP ou via arquivo de Unix socket. As informações disponíveis nesta tabela fornecem um snapshot em tempo real das conexões ativas com o servidor. (Informações adicionais estão disponíveis nas tabelas de resumo de socket, incluindo atividade de rede como operações de socket e o número de bytes transmitidos e recebidos; consulte [Seção 25.12.15.8, “Tabelas de Resumo de Socket”](performance-schema-socket-summary-tables.html "25.12.15.8 Socket Summary Tables")).

```sql
mysql> SELECT * FROM performance_schema.socket_instances\G
*************************** 1. row ***************************
           EVENT_NAME: wait/io/socket/sql/server_unix_socket
OBJECT_INSTANCE_BEGIN: 4316619408
            THREAD_ID: 1
            SOCKET_ID: 16
                   IP:
                 PORT: 0
                STATE: ACTIVE
*************************** 2. row ***************************
           EVENT_NAME: wait/io/socket/sql/client_connection
OBJECT_INSTANCE_BEGIN: 4316644608
            THREAD_ID: 21
            SOCKET_ID: 39
                   IP: 127.0.0.1
                 PORT: 55233
                STATE: ACTIVE
*************************** 3. row ***************************
           EVENT_NAME: wait/io/socket/sql/server_tcpip_socket
OBJECT_INSTANCE_BEGIN: 4316699040
            THREAD_ID: 1
            SOCKET_ID: 14
                   IP: 0.0.0.0
                 PORT: 50603
                STATE: ACTIVE
```

Os instruments de Socket têm nomes no formato `wait/io/socket/sql/socket_type` e são usados da seguinte forma:

1. O servidor possui um *listening socket* para cada protocolo de rede que ele suporta. Os instruments associados a *listening sockets* para conexões TCP/IP ou via arquivo de Unix socket têm um valor *`socket_type`* de `server_tcpip_socket` ou `server_unix_socket`, respectivamente.

2. Quando um *listening socket* detecta uma conexão, o servidor transfere a conexão para um novo socket gerenciado por uma Thread separada. O instrument para a Thread da nova conexão tem um valor *`socket_type`* de `client_connection`.

3. Quando uma conexão é encerrada, a linha correspondente na tabela [`socket_instances`](performance-schema-socket-instances-table.html "25.12.3.5 The socket_instances Table") é excluída.

A tabela [`socket_instances`](performance-schema-socket-instances-table.html "25.12.3.5 The socket_instances Table") possui as seguintes colunas:

* `EVENT_NAME`

  O nome do instrument `wait/io/socket/*` que produziu o evento. Este é um valor `NAME` da tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"). Nomes de instruments podem ter múltiplas partes e formar uma hierarquia, conforme discutido em [Seção 25.6, “Convenções de Nomenclatura de Instrument do Performance Schema”](performance-schema-instrument-naming.html "25.6 Performance Schema Instrument Naming Conventions").

* `OBJECT_INSTANCE_BEGIN`

  Esta coluna identifica o socket de forma exclusiva. O valor é o endereço de um objeto na memória.

* `THREAD_ID`

  O identificador interno de Thread atribuído pelo servidor. Cada socket é gerenciado por uma única Thread, de modo que cada socket pode ser mapeado para uma Thread, que por sua vez pode ser mapeada para um processo do servidor.

* `SOCKET_ID`

  O *file handle* interno atribuído ao socket.

* `IP`

  O endereço IP do cliente. O valor pode ser um endereço IPv4 ou IPv6, ou estar em branco para indicar uma conexão via arquivo de Unix socket.

* `PORT`

  O número da porta TCP/IP, no intervalo de 0 a 65535.

* `STATE`

  O status do socket, sendo `IDLE` (Ocioso) ou `ACTIVE` (Ativo). Os tempos de espera para sockets `ACTIVE` são rastreados usando o instrument de socket correspondente. Os tempos de espera para sockets `IDLE` são rastreados usando o instrument `idle`.

  Um socket está `IDLE` se estiver aguardando uma solicitação do cliente. Quando um socket se torna `IDLE`, a linha de evento na tabela [`socket_instances`](performance-schema-socket-instances-table.html "25.12.3.5 The socket_instances Table") que está rastreando o socket muda de um status `ACTIVE` para `IDLE`. O valor de `EVENT_NAME` permanece `wait/io/socket/*`, mas a contagem de tempo para o instrument é suspensa. Em vez disso, um evento é gerado na tabela [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table") com um valor `EVENT_NAME` de `idle`.

  Quando a próxima solicitação é recebida, o evento `idle` é encerrado, a instância do socket muda de `IDLE` para `ACTIVE`, e a contagem de tempo do instrument de socket é retomada.

O comando [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitido para a tabela [`socket_instances`](performance-schema-socket-instances-table.html "25.12.3.5 The socket_instances Table").

O valor da combinação das colunas `IP:PORT` identifica a conexão. Este valor de combinação é usado na coluna `OBJECT_NAME` das tabelas `events_waits_xxx`, para identificar a conexão da qual os eventos de socket se originam:

* Para o *listener socket* de domínio Unix (`server_unix_socket`), a porta é 0, e o IP é `''`.

* Para conexões de cliente via *listener* de domínio Unix (`client_connection`), a porta é 0, e o IP é `''`.

* Para o *listener socket* do servidor TCP/IP (`server_tcpip_socket`), a porta é sempre a porta principal (por exemplo, 3306), e o IP é sempre `0.0.0.0`.

* Para conexões de cliente via *listener* TCP/IP (`client_connection`), a porta é aquela que o servidor atribui, mas nunca 0. O IP é o IP do host de origem (`127.0.0.1` ou `::1` para o *local host*)