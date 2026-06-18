## 4.10 Gerenciamento de Sinais Unix no MySQL

Em sistemas Unix e similares, um processo pode ser o destinatário de sinais enviados a ele pela conta de sistema `root` ou pela conta de sistema que possui o processo. Os sinais podem ser enviados usando o comando **kill**. Alguns interpretadores de comandos associam certas sequências de teclas a sinais, como **Control+C** para enviar um sinal `SIGINT`. Esta seção descreve como o servidor MySQL e os programas cliente respondem a sinais.

- Resposta do servidor aos sinais
- Resposta do cliente aos sinais

### Resposta do servidor aos sinais

O **mysqld** responde a sinais da seguinte forma:

- O comando `SIGTERM` faz o servidor desligar. Isso é como executar uma instrução `SHUTDOWN` sem precisar se conectar ao servidor (o que, para o desligamento, requer uma conta com o privilégio `SHUTDOWN`).

- O sinal `SIGHUP` faz com que o servidor recarregue as tabelas de concessão e limpe as tabelas, os registros, o cache de threads e o cache do host. Essas ações são como várias formas da instrução `FLUSH`. Enviar o sinal permite que as operações de limpeza sejam realizadas sem precisar se conectar ao servidor, o que requer uma conta MySQL com privilégios suficientes para essas operações. O servidor também escreve um relatório de status no log de erro com este formato:

  ```sql
  Status information:

  Current dir: /var/mysql/data/
  Running threads: 4  Stack size: 262144
  Current locks:
  lock: 0x7f742c02c0e0:

  lock: 0x2cee2a20:
  :
  lock: 0x207a080:

  Key caches:
  default
  Buffer_size:       8388608
  Block_size:           1024
  Division_limit:        100
  Age_limit:             300
  blocks used:             4
  not flushed:             0
  w_requests:              0
  writes:                  0
  r_requests:              8
  reads:                   4

  handler status:
  read_key:           13
  read_next:           4
  read_rnd             0
  read_first:         13
  write:               1
  delete               0
  update:              0

  Table status:
  Opened tables:        121
  Open tables:          114
  Open files:            18
  Open streams:           0

  Memory status:
  <malloc version="1"><heap nr="0"><sizes><size from="17" to="32" total="32" count="1"/><size from="33" to="48" total="96" count="2"/><size from="33" to="33" total="33" count="1"/><size from="97" to="97" total="6014" count="62"/><size from="113" to="113" total="904" count="8"/><size from="193" to="193" total="193" count="1"/><size from="241" to="241" total="241" count="1"/><size from="609" to="609" total="609" count="1"/><size from="16369" to="16369" total="49107" count="3"/><size from="24529" to="24529" total="98116" count="4"/><size from="32689" to="32689" total="32689" count="1"/><unsorted from="241" to="7505" total="7746" count="2"/></sizes><total type="fast" count="3" size="128"/><total type="rest" count="84" size="195652"/><system type="current" size="690774016"/><system type="max" size="690774016"/><aspace type="total" size="690774016"/><aspace type="mprotect" size="690774016"/></heap>
  :
  <total type="fast" count="85" size="5520"/><total type="rest" count="116" size="316820"/><total type="mmap" count="82" size="939954176"/><system type="current" size="695717888"/><system type="max" size="695717888"/><aspace type="total" size="695717888"/><aspace type="mprotect" size="695717888"/></malloc>

  Events status:
  LLA = Last Locked At  LUA = Last Unlocked At
  WOC = Waiting On Condition  DL = Data Locked

  Event scheduler status:
  State      : INITIALIZED
  Thread id  : 0
  LLA        : n/a:0
  LUA        : n/a:0
  WOC        : NO
  Workers    : 0
  Executed   : 0
  Data locked: NO

  Event queue status:
  Element count   : 0
  Data locked     : NO
  Attempting lock : NO
  LLA             : init_queue:95
  LUA             : init_queue:103
  WOC             : NO
  Next activation : never
  ```

- O `SIGINT` é normalmente ignorado pelo servidor. Ao iniciar o servidor com a opção `--gdb`, um manipulador de interrupção para `SIGINT` é instalado para fins de depuração. Consulte a Seção 5.8.1.4, “Depuração do mysqld sob o gdb”.

### Resposta do cliente aos sinais

Os programas clientes do MySQL respondem aos sinais da seguinte forma:

- O cliente **mysql** interpreta o `SIGINT` (geralmente o resultado de digitar **Control+C**) como uma instrução para interromper a declaração atual, se houver uma, ou cancelar qualquer linha de entrada parcial, caso contrário. Esse comportamento pode ser desativado usando a opção `--sigint-ignore` para ignorar os sinais `SIGINT`.

- Os programas de clientes que utilizam a biblioteca de clientes MySQL bloqueiam sinais `SIGPIPE` por padrão. Essas variações são possíveis:

  - O cliente pode instalar seu próprio manipulador `SIGPIPE` para substituir o comportamento padrão. Veja Escrever programas cliente em API C em threads.

  - Os clientes podem impedir a instalação de manipuladores `SIGPIPE` especificando a opção `CLIENT_IGNORE_SIGPIPE` para `mysql_real_connect()` no momento da conexão. Veja mysql_real_connect().
