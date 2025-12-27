#### 29.12.3.5 A tabela socket_instances

A tabela `socket_instances` fornece uma instantânea em tempo real das conexões ativas no servidor MySQL. A tabela contém uma linha por conexão de arquivo de socket TCP/IP ou Unix. As informações disponíveis nesta tabela fornecem uma instantânea em tempo real das conexões ativas no servidor. (Informações adicionais estão disponíveis nas tabelas de resumo de sockets, incluindo a atividade de rede, como operações de socket e número de bytes transmitidos e recebidos; consulte a Seção 29.12.20.9, “Tabelas de Resumo de Sockets”).

```
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

Os instrumentos de socket têm nomes na forma `wait/io/socket/sql/socket_type` e são usados da seguinte maneira:

1. O servidor tem um socket de escuta para cada protocolo de rede que ele suporta. Os instrumentos associados aos sockets de escuta para conexões de arquivo de socket TCP/IP ou Unix têm um valor de *`socket_type`* de `server_tcpip_socket` ou `server_unix_socket`, respectivamente.

2. Quando um socket de escuta detecta uma conexão, o servidor transfere a conexão para um novo socket gerenciado por um fio separado. O instrumento para o novo fio de conexão tem um valor de *`socket_type`* de `client_connection`.

3. Quando uma conexão termina, a linha na `socket_instances` correspondente a ela é excluída.

A tabela `socket_instances` tem as seguintes colunas:

* `EVENT_NAME`

  O nome do instrumento `wait/io/socket/*` que produziu o evento. Este é um valor `NAME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

* `OBJECT_INSTANCE_BEGIN`

  Esta coluna identifica de forma única o socket. O valor é o endereço de um objeto na memória.

* `THREAD_ID`

O identificador de fio interno atribuído pelo servidor. Cada soquete é gerenciado por um único fio, então cada soquete pode ser mapeado a um fio que pode ser mapeado a um processo de servidor.

* `SOCKET_ID`

  O identificador de handle de arquivo interno atribuído ao soquete.

* `IP`

  O endereço IP do cliente. O valor pode ser um endereço IPv4 ou IPv6, ou vazio para indicar uma conexão de arquivo de soquete Unix.

* `PORT`

  O número de porta TCP/IP, no intervalo de 0 a 65535.

* `STATE`

  O estado do soquete, seja `IDLE` ou `ACTIVE`. Os tempos de espera para soquetes ativos são rastreados usando o instrumento de soquete correspondente. Os tempos de espera para soquetes inativos são rastreados usando o instrumento `idle`.

  Um soquete está inactivo se estiver esperando por uma solicitação do cliente. Quando um soquete fica inactivo, a linha de evento na `socket_instances` que está rastreando o soquete muda de um estado de `ACTIVE` para `IDLE`. O valor do `EVENT_NAME` permanece `wait/io/socket/*`, mas o temporizador do instrumento é suspenso. Em vez disso, um evento é gerado na tabela `events_waits_current` com um valor de `EVENT_NAME` de `idle`.

  Quando a próxima solicitação é recebida, o evento `idle` termina, a instância do soquete muda de `IDLE` para `ACTIVE`, e o temporizador do instrumento de soquete é retomado.

A tabela `socket_instances` tem esses índices:

* Chave primária em (`OBJECT_INSTANCE_BEGIN`)
* Índice em (`THREAD_ID`)
* Índice em (`SOCKET_ID`)
* Índice em (`IP`, `PORT`)

O valor da combinação de coluna `IP:PORT` identifica a conexão. Esse valor de combinação é usado na coluna `OBJECT_NAME` das tabelas `events_waits_xxx`, para identificar a conexão de onde os eventos de soquete vêm:

* Para o soquete de escuta de domínio Unix (`server_unix_socket`), a porta é 0 e o IP é `''`.

* Para conexões de clientes via o ouvinte de domínio Unix (`client_connection`), a porta é 0 e o IP é `''`.

* Para o socket do ouvinte de servidor TCP/IP (`server_tcpip_socket`), a porta é sempre a porta mestre (por exemplo, 3306) e o IP é sempre `0.0.0.0`.

* Para conexões de clientes via o ouvinte de TCP/IP (`client_connection`), a porta é a que o servidor atribui, mas nunca 0. O IP é o IP do host de origem (`127.0.0.1` ou `::1` para o host local)