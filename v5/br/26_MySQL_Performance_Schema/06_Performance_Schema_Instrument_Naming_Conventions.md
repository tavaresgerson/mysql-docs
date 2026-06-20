## 25.6 Convenções de Nomenclatura de Instrumentos do Schema de Desempenho

Um nome de instrumento consiste em uma sequência de elementos separados por caracteres `'/'`. Exemplos de nomes:

```sql
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
```

O espaço de nome do instrumento tem uma estrutura semelhante a uma árvore. Os elementos de um nome de instrumento, da esquerda para a direita, fornecem uma progressão de mais geral para mais específico. O número de elementos que um nome tem depende do tipo de instrumento.

A interpretação de um elemento dado em um nome depende dos elementos à esquerda dele. Por exemplo, `myisam` aparece em ambos os seguintes nomes, mas `myisam` no primeiro nome está relacionado ao I/O de arquivo, enquanto no segundo está relacionado a um instrumento de sincronização:

```sql
wait/io/file/myisam/log
wait/synch/cond/myisam/MI_SORT_INFO::cond
```

Os nomes dos instrumentos consistem em um prefixo com uma estrutura definida pela implementação do Schema de Desempenho e um sufixo definido pelo desenvolvedor que implementa o código do instrumento. O elemento de nível superior de um prefixo de instrumento indica o tipo de instrumento. Esse elemento também determina qual temporizador de evento na tabela `setup_timers` se aplica ao instrumento. Quanto à parte do prefixo dos nomes dos instrumentos, o nível superior indica o tipo de instrumento.

A parte do sufixo dos nomes dos instrumentos vem do código dos próprios instrumentos. Os sufixos podem incluir níveis como esses:

* Um nome para o elemento principal (um módulo do servidor, como `myisam`, `innodb`, `mysys` ou `sql`) ou um nome de plugin.

* O nome de uma variável no código, na forma *`XXX`* (uma variável global) ou `CCC::MMM` (um membro *`MMM`* na classe *`CCC`*) Exemplos: `COND_thread_cache`, `THR_LOCK_myisam`, `BINLOG::LOCK_index`.

* Elementos de Instrumento de Nível Superior
* Elementos de Instrumento Inativos
* Elementos de Instrumento de Memória
* Elementos de Instrumento de Escada
* Elementos de Instrumento de Declaração
* Elementos de Instrumento de Aguardar

### Elementos de Instrumento de Nível Superior

* `idle`: Um evento de inatividade instrumentado. Este instrumento não possui outros elementos.

* `memory`: Um evento de memória instrumentado.
* `stage`: Um evento de palco instrumentado.
* `statement`: Um evento de declaração instrumentado.

* `transaction`: Um evento de transação instrumentada. Este instrumento não possui elementos adicionais.

* `wait`: Um evento de espera instrumentado.

### Elementos de Instrumento Inativos

O instrumento `idle` é utilizado para eventos de inatividade, que o Schema de Desempenho gera conforme discutido na descrição da coluna `socket_instances.STATE` na Seção 25.12.3.5, “A tabela socket_instances”.

### Elementos do Instrumento de Memória

A maioria dos instrumentos de memória é desativada por padrão e pode ser ativada ou desativada no início ou dinamicamente durante a execução, atualizando a coluna `ENABLED` dos instrumentos relevantes na tabela `setup_instruments`. Os instrumentos de memória têm nomes na forma `memory/code_area/instrument_name`, onde *`code_area`* é um valor como `sql` ou `myisam`, e *`instrument_name`* é o detalhe do instrumento.

Os instrumentos com o prefixo `memory/performance_schema/` mostram quanto memória é alocada para buffers internos no Gerador de Desempenho. Os instrumentos `memory/performance_schema/` são construídos, sempre ativados e não podem ser desativados no início ou durante o runtime. Os instrumentos de memória embutidos são exibidos apenas na tabela `memory_summary_global_by_event_name`. Para mais informações, consulte a Seção 25.17, “O Modelo de Alocação de Memória do Gerador de Desempenho”.

### Elementos de Instrumento de Estágio

Os instrumentos de estágio têm nomes na forma `stage/code_area/stage_name`, onde *`code_area`* é um valor como `sql` ou `myisam`, e *`stage_name`* indica o estágio do processamento de declaração, como `Sorting result` ou `Sending data`. Os estágios correspondem aos estados de thread exibidos por `SHOW PROCESSLIST` ou que são visíveis na tabela do Esquema de Informações `PROCESSLIST`.

### Instrumentos de declaração Elementos do instrumento

* `statement/abstract/*`: Um instrumento abstrato para operações de declaração. Instrumentos abstratos são utilizados durante as fases iniciais da classificação de declarações, antes de o tipo exato de declaração ser conhecido, e são então alterados para um instrumento de declaração mais específico quando o tipo é conhecido. Para uma descrição desse processo, consulte a Seção 25.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

* `statement/com`: Uma operação de comando instrumentada. Estes têm nomes correspondentes às operações de `COM_xxx` (consulte o arquivo de cabeçalho `mysql_com.h` e `sql/sql_parse.cc`. Por exemplo, os instrumentos `statement/com/Connect` e `statement/com/Init DB` correspondem aos comandos `COM_CONNECT` e `COM_INIT_DB`.

* `statement/scheduler/event`: Um único instrumento para rastrear todos os eventos executados pelo Cronograma de Eventos. Este instrumento entra em ação quando um evento agendado começa a ser executado.

* `statement/sp`: Uma instrução interna instrumentada executada por um programa armazenado. Por exemplo, os instrumentos `statement/sp/cfetch` e `statement/sp/freturn` são usados para instruções de obtenção de cursor e retorno de função.

* `statement/sql`: Uma operação de declaração instrumentada em SQL. Por exemplo, os instrumentos `statement/sql/create_db` e `statement/sql/select` são usados para as declarações `CREATE DATABASE` e `SELECT`.

### Espera Elementos de Instrumento

* `wait/io`

Uma operação de E/S instrumentada.

+ `wait/io/file`

Uma operação de E/S de arquivo instrumentada. Para arquivos, a espera é o tempo que o usuário espera para que a operação de arquivo seja concluída (por exemplo, uma chamada a `fwrite()`). Devido ao cache, o E/S físico do arquivo no disco pode não ocorrer dentro desta chamada.

+ `wait/io/socket`

Uma operação de soquete instrumentado. Os instrumentos de soquete têm nomes na forma `wait/io/socket/sql/socket_type`. O servidor tem um soquete de escuta para cada protocolo de rede que ele suporta. Os instrumentos associados a soquetes de escuta para conexões de arquivo de soquete TCP/IP ou Unix têm um valor *`socket_type`* de `server_tcpip_socket`, respectivamente. Quando um soquete de escuta detecta uma conexão, o servidor transfere a conexão para um novo soquete gerenciado por um thread separado. O instrumento para o novo thread de conexão tem um valor *`socket_type`* de `client_connection`.

+ `wait/io/table`

Uma operação de I/O de tabela instrumentada. Estas incluem acessos de nível de string a tabelas de base persistentes ou tabelas temporárias. As operações que afetam as strings são buscar, inserir, atualizar e excluir. Para uma visão, as espera são associadas a tabelas de base referenciadas pela visão.

Ao contrário da maioria das espera, uma espera de I/O de tabela pode incluir outras espera. Por exemplo, o I/O de tabela pode incluir operações de arquivo ou de memória. Assim, `events_waits_current` para uma espera de I/O de tabela geralmente tem duas strings. Para mais informações, consulte a Seção 25.8, “Eventos de átomo e molécula do Schema de desempenho”.

Algumas operações de string podem causar múltiplos aguamentos de E/S de tabela. Por exemplo, uma inserção pode ativar um gatilho que causa uma atualização.

* `wait/lock`

Uma operação de fechamento instrumentada.

+ `wait/lock/table`

Uma operação de bloqueio de tabela instrumentada.

+ `wait/lock/metadata/sql/mdl`

Uma operação de bloqueio de metadados instrumentada.

* `wait/synch`

Um objeto de sincronização instrumentado. Para objetos de sincronização, o tempo `TIMER_WAIT` inclui o tempo bloqueado ao tentar adquirir um bloqueio no objeto, se houver.

+ `wait/synch/cond`

Uma condição é usada por um thread para sinalizar para outros threads que algo pelo qual eles estavam esperando aconteceu. Se um único thread estava esperando por uma condição, ele pode acordar e prosseguir com sua execução. Se vários threads estavam esperando, todos eles podem acordar e competir pelo recurso pelo qual estavam esperando.

+ `wait/synch/mutex`

Um objeto de exclusão mútua usado para permitir o acesso a um recurso (como uma seção de código executável) enquanto impede que outros threads acessem o recurso.

+ `wait/synch/rwlock`

Um objeto de bloqueio de leitura/escrita usado para bloquear uma variável específica para acesso, impedindo seu uso por outros threads. Um bloqueio de leitura compartilhado pode ser adquirido simultaneamente por múltiplos threads. Um bloqueio de escrita exclusivo pode ser adquirido por apenas uma thread de cada vez.

+ `wait/synch/sxlock`

Um bloqueio exclusivo compartilhado (SX) é um tipo de objeto de bloqueio rwlock que fornece acesso de escrita a um recurso comum, permitindo leituras inconsistentes por outros threads. `sxlocks` otimiza a concorrência e melhora a escalabilidade para cargas de trabalho de leitura e escrita.