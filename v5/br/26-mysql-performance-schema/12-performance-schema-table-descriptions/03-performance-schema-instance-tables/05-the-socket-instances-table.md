#### 25.12.3.5 A tabela socket_instances

A tabela `socket_instances` fornece um instantâneo em tempo real das conexões ativas ao servidor MySQL. A tabela contém uma linha por conexão de arquivo de socket TCP/IP ou Unix. As informações disponíveis nesta tabela fornecem um instantâneo em tempo real das conexões ativas ao servidor. (Informações adicionais estão disponíveis em tabelas de resumo de sockets, incluindo atividade de rede, como operações de socket e número de bytes transmitidos e recebidos; consulte Seção 25.12.15.8, “Tabelas de Resumo de Sockets”).

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

Os instrumentos de soquete têm nomes na forma `wait/io/socket/sql/socket_type` e são usados da seguinte maneira:

1. O servidor possui uma porta de escuta para cada protocolo de rede que ele suporta. Os instrumentos associados às portas de escuta para conexões de arquivos de socket TCP/IP ou Unix têm um valor de *`socket_type`* de `server_tcpip_socket` ou `server_unix_socket`, respectivamente.

2. Quando uma porta de escuta detecta uma conexão, o servidor transfere a conexão para uma nova porta gerenciada por um fio separado. O instrumento para o novo fio de conexão tem um valor de *`socket_type`* de `client_connection`.

3. Quando uma conexão é encerrada, a linha na tabela `socket_instances` correspondente a ela é excluída.

A tabela `socket_instances` tem as seguintes colunas:

- `NOME_DO_Evento`

  O nome do instrumento `wait/io/socket/*` que produziu o evento. Este é um valor `NAME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

- `OBJECT_INSTANCE_BEGIN`

  Esta coluna identifica de forma única o soquete. O valor é o endereço de um objeto na memória.

- `THREAD_ID`

  O identificador de fio interno atribuído pelo servidor. Cada soquete é gerenciado por um único fio, então cada soquete pode ser mapeado para um fio que pode ser mapeado para um processo do servidor.

- `SOCKET_ID`

  O identificador de arquivo interno atribuído ao soquete.

- `IP`

  O endereço IP do cliente. O valor pode ser um endereço IPv4 ou IPv6, ou pode estar em branco para indicar uma conexão por arquivo de soquete Unix.

- `PORT`

  O número de porta TCP/IP, no intervalo de 0 a 65535.

- `ESTADO`

  O status da porta, `IDLE` ou `ACTIVE`. Os tempos de espera para portas ativas são rastreados usando o instrumento de porta correspondente. Os tempos de espera para portas ociosas são rastreados usando o instrumento `idle`.

  Um soquete está inativo se estiver aguardando uma solicitação do cliente. Quando um soquete fica inativo, a linha de evento na tabela `socket_instances` que está rastreando o soquete muda de status de `ACTIVE` para `IDLE`. O valor `EVENT_NAME` permanece `wait/io/socket/*`, mas o temporizador do instrumento é suspenso. Em vez disso, um evento é gerado na tabela `events_waits_current` com um valor `EVENT_NAME` de `idle`.

  Quando o próximo pedido for recebido, o evento `idle` é encerrado, a instância de socket muda de `IDLE` para `ACTIVE` e o cronometramento do instrumento de socket é retomado.

A operação `TRUNCATE TABLE` não é permitida para a tabela `socket_instances`.

O valor da combinação da coluna `IP:PORT` identifica a conexão. Esse valor de combinação é usado na coluna `OBJECT_NAME` das tabelas `events_waits_xxx`, para identificar a conexão de onde os eventos de soquete vêm:

- Para o soquete de escuta de domínio Unix (`server_unix_socket`), a porta é 0 e o IP é `''`.

- Para conexões de clientes via o ouvinte de domínio Unix (`client_connection`), a porta é 0 e o IP é `''`.

- Para o socket de escuta do servidor TCP/IP (`server_tcpip_socket`), a porta é sempre a porta mestre (por exemplo, 3306) e o IP é sempre `0.0.0.0`.

- Para conexões de clientes via o ouvinte TCP/IP (`client_connection`), a porta é a que o servidor atribui, mas nunca 0. O IP é o IP do host de origem (`127.0.0.1` ou `::1` para o host local)
