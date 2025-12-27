## Convenções de Nomenclatura de Instrumentos do Schema de Desempenho

O nome de um instrumento é composto por uma sequência de elementos separados por caracteres `'/'` (barra invertida). Exemplos de nomes:

```
wait/io/file/myisam/log
wait/io/file/mysys/charset
wait/lock/table/sql/handler
wait/synch/cond/mysys/COND_alarm
wait/synch/cond/sql/BINLOG::update_cond
wait/synch/mutex/mysys/BITMAP_mutex
wait/synch/mutex/sql/LOCK_delete
wait/synch/rwlock/sql/Query_cache_query::lock
stage/sql/closing tables
stage/sql/Sorting result
statement/com/Execute
statement/com/Query
statement/sql/create_table
statement/sql/lock_tables
errors
```

O espaço de nomes de instrumentos tem uma estrutura semelhante a uma árvore. Os elementos de um nome de instrumento, da esquerda para a direita, fornecem uma progressão de mais geral para mais específico. O número de elementos de um nome depende do tipo de instrumento.

A interpretação de um elemento dado em um nome depende dos elementos à esquerda dele. Por exemplo, `myisam` aparece em ambos os seguintes nomes, mas `myisam` no primeiro nome está relacionado ao I/O de arquivos, enquanto no segundo está relacionado a um instrumento de sincronização:

```
wait/io/file/myisam/log
wait/synch/cond/myisam/MI_SORT_INFO::cond
```

Os nomes de instrumentos consistem em um prefixo com uma estrutura definida pela implementação do Schema de Desempenho e um sufixo definido pelo desenvolvedor que implementa o código do instrumento. O elemento de nível superior de um prefixo de instrumento indica o tipo de instrumento. Esse elemento também determina qual temporizador de evento na tabela `performance_timers` se aplica ao instrumento. Para a parte de prefixo dos nomes de instrumentos, o nível superior indica o tipo de instrumento.

A parte de sufixo dos nomes de instrumentos vem do código dos próprios instrumentos. Sufixos podem incluir níveis como estes:

* Um nome para o elemento principal (um módulo do servidor, como `myisam`, `innodb`, `mysys` ou `sql`) ou um nome de plugin.

* O nome de uma variável no código, na forma *`XXX`* (uma variável global) ou `CCC::MMM` (um membro *`MMM`* na classe *`CCC`*). Exemplos: `COND_thread_cache`, `THR_LOCK_myisam`, `BINLOG::LOCK_index`.

* Elementos de Instrumento de Nível Superior
* Elementos de Instrumento Inativos
* Elementos de Instrumento de Erro
* Elementos de Instrumento de Memória
* Elementos de Instrumento de Palco
* Elementos de Instrumento de Declaração
* Elementos de Instrumento de Fio
* Elementos de Instrumento de Aguardar

### Elementos de Instrumento de Nível Superior

* `idle`: Um evento instrumentado de inatividade. Este instrumento não tem elementos adicionais.

* `error`: Um evento instrumentado de erro. Este instrumento não tem elementos adicionais.

* `memory`: Um evento instrumentado de memória.
* `stage`: Um evento instrumentado de palco.
* `statement`: Um evento instrumentado de declaração.

* `transaction`: Um evento instrumentado de transação. Este instrumento não tem elementos adicionais.

* `wait`: Um evento instrumentado de espera.

### Elementos de Instrumento Inativos

O instrumento `idle` é usado para eventos de inatividade, que o Schema de Desempenho gera conforme discutido na descrição da coluna `socket\_instances.STATE` na Seção 29.12.3.5, “A Tabela socket\_instances”.

### Elementos de Instrumento de Erro

O instrumento `error` indica se as informações para erros e avisos do servidor devem ser coletadas. Este instrumento é ativado por padrão. A coluna `TIMED` da linha `error` na tabela `setup_instruments` é inapropriável porque as informações de temporização não são coletadas.

### Elementos de Instrumento de Memória

A instrumentação de memória é ativada por padrão. A instrumentação de memória pode ser ativada ou desativada no início ou dinamicamente no runtime, atualizando a coluna `ENABLED` dos instrumentos relevantes na tabela `setup_instruments`. Os instrumentos de memória têm nomes da forma `memory/code_area/instrument_name` onde *`code_area`* é um valor como `sql` ou `myisam`, e *`instrument_name`* é o detalhe do instrumento.

Os instrumentos com o prefixo `memory/performance_schema/` mostram quanto memória é alocada para buffers internos no Schema de Desempenho. Os instrumentos `memory/performance_schema/` são pré-construídos, sempre ativados e não podem ser desativados no início ou durante o runtime. Os instrumentos de memória pré-construídos são exibidos apenas na tabela `memory_summary_global_by_event_name`. Para mais informações, consulte a Seção 29.17, “O Modelo de Alocação de Memória do Schema de Desempenho”.

### Elementos de Instrumentos de Estágio

Os instrumentos de estágio têm nomes na forma `stage/code_area/stage_name`, onde *`code_area`* é um valor como `sql` ou `myisam`, e *`stage_name`* indica o estágio do processamento da declaração, como `Ordenando resultado` ou `Enviando dados`. Os estágios correspondem aos estados de thread exibidos pelo `SHOW PROCESSLIST` ou que são visíveis na tabela `PROCESSLIST` do Schema de Informações `PROCESSLIST`.

### Elementos de Instrumentos de Declaração

* `statement/abstract/*`: Um instrumento abstrato para operações de declaração. Os instrumentos abstratos são usados durante as fases iniciais da classificação da declaração antes que o tipo exato da declaração seja conhecido, e então são alterados para um instrumento de declaração mais específico quando o tipo é conhecido. Para uma descrição desse processo, consulte a Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

* `statement/com`: Uma operação de comando instrumentada. Esses têm nomes correspondentes às operações `COM_xxx` (consulte o arquivo de cabeçalho `mysql_com.h` e `sql/sql_parse.cc`. Por exemplo, os instrumentos `statement/com/Connect` e `statement/com/Init DB` correspondem aos comandos `COM_CONNECT` e `COM_INIT_DB`.

* `statement/scheduler/event`: Um único instrumento para rastrear todos os eventos executados pelo Cronômetro de Eventos. Este instrumento entra em ação quando um evento agendado começa a ser executado.

* `statement/sp`: Uma instrução interna instrumentada executada por um programa armazenado. Por exemplo, as instruções `statement/sp/cfetch` e `statement/sp/freturn` são usadas para instruções de recuperação de cursor e retorno de função.

* `statement/sql`: Uma operação de instrução SQL instrumentada. Por exemplo, as instruções `statement/sql/create_db` e `statement/sql/select` são usadas para instruções `CREATE DATABASE` e `SELECT`.

### Elementos de Instrumento de Thread

Threads instrumentados são exibidos na tabela `setup_threads`, que expõe os nomes e atributos das classes de threads.

Os instrumentos de thread começam com `thread` (por exemplo, `thread/sql/parser_service` ou `thread/performance_schema/setup`).

Os nomes dos instrumentos de thread para threads do plugin `ndbcluster` começam com `thread/ndbcluster/`; para mais informações sobre esses, veja Threads do Plugin ndbcluster.

### Elementos de Instrumento de Wait

* `wait/io`

  Uma operação de I/O instrumentada.

  + `wait/io/file`

    Uma operação de I/O de arquivo instrumentada. Para arquivos, a espera é o tempo de espera para que a operação de arquivo seja concluída (por exemplo, uma chamada a `fwrite()`). Devido ao cache, o I/O físico de arquivo no disco pode não ocorrer dentro desta chamada.

  + `wait/io/socket`

Uma operação de soquete instrumentada. Os instrumentos de soquete têm nomes na forma `wait/io/socket/sql/socket_type`. O servidor tem um soquete de escuta para cada protocolo de rede que ele suporta. Os instrumentos associados aos soquetes de escuta para conexões de arquivos de soquete TCP/IP ou Unix têm um valor de *`socket_type`* de `server_tcpip_socket` ou `server_unix_socket`, respectivamente. Quando um soquete de escuta detecta uma conexão, o servidor transfere a conexão para um novo soquete gerenciado por um fio separado. O instrumento para o novo fio de conexão tem um valor de *`socket_type`* de `client_connection`.

  + `wait/io/table`

    Uma operação de E/S de tabela instrumentada. Isso inclui acessos de nível de linha a tabelas de base persistentes ou tabelas temporárias. As operações que afetam linhas são fetch, insert, update e delete. Para uma visualização, as espera são associadas a tabelas de base referenciadas pela visualização.

    Ao contrário da maioria das espera, uma espera de E/S de tabela pode incluir outras espera. Por exemplo, a E/S de tabela pode incluir E/S de arquivo ou operações de memória. Assim, `events_waits_current` para uma espera de E/S de tabela geralmente tem duas linhas. Para mais informações, consulte a Seção 29.8, “Eventos de Átomo e Molécula do Schema de Desempenho”.

    Algumas operações de linha podem causar múltiplas espera de E/S de tabela. Por exemplo, uma inserção pode ativar um gatilho que causa uma atualização.

* `wait/lock`

    Uma operação de bloqueio instrumentada.

  + `wait/lock/table`

    Uma operação de bloqueio de tabela instrumentada.

  + `wait/lock/metadata/sql/mdl`

    Uma operação de bloqueio de metadados instrumentada.

* `wait/synch`

    Um objeto de sincronização instrumentado. Para objetos de sincronização, o tempo `TIMER_WAIT` inclui a quantidade de tempo bloqueado enquanto se tenta adquirir um bloqueio no objeto, se houver.

  + `wait/synch/cond`

Uma condição é usada por um fio para sinalizar aos outros fios que algo pelo qual eles estavam esperando aconteceu. Se um único fio estava esperando por uma condição, ele pode acordar e prosseguir com sua execução. Se vários fios estavam esperando, todos podem acordar e competir pelo recurso pelo qual estavam esperando.

  + `wait/synch/mutex`

    Um objeto de exclusão mútua usado para permitir o acesso a um recurso (como uma seção de código executável) enquanto impede que outros fios acessem o recurso.

  + `wait/synch/prlock`

    Um objeto de bloqueio rwlock de prioridade.

  + `wait/synch/rwlock`

    Um objeto de bloqueio de leitura/escrita simples usado para bloquear uma variável específica para acesso enquanto impede seu uso por outros fios. Um bloqueio de leitura compartilhado pode ser adquirido simultaneamente por vários fios. Um bloqueio de escrita exclusivo pode ser adquirido por apenas um fio de cada vez.

  + `wait/synch/sxlock`

    Um bloqueio compartilhado (SX) é um tipo de objeto de bloqueio rwlock que fornece acesso de escrita a um recurso comum enquanto permite leituras inconsistentes por outros fios. `sxlocks` otimizam a concorrência e melhoram a escalabilidade para cargas de trabalho de leitura/escrita.