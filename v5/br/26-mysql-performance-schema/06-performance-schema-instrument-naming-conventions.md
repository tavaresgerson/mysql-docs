## 25.6 Convenções de Nomenclatura de Instrumentos do Schema de Desempenho

O nome de um instrumento é composto por uma sequência de elementos separados por caracteres `'/'` . Exemplos de nomes:

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

A interpretação de um elemento específico em um nome depende dos elementos à sua esquerda. Por exemplo, `myisam` aparece em ambos os seguintes nomes, mas `myisam` no primeiro nome está relacionado ao I/O de arquivos, enquanto no segundo está relacionado a um instrumento de sincronização:

```sql
wait/io/file/myisam/log
wait/synch/cond/myisam/MI_SORT_INFO::cond
```

Os nomes dos instrumentos consistem em um prefixo com uma estrutura definida pela implementação do Schema de Desempenho e um sufixo definido pelo desenvolvedor que implementa o código do instrumento. O elemento de nível superior de um prefixo de instrumento indica o tipo de instrumento. Esse elemento também determina qual temporizador de evento na tabela `setup_timers` se aplica ao instrumento. Para a parte do prefixo dos nomes dos instrumentos, o nível superior indica o tipo de instrumento.

A parte do sufixo dos nomes dos instrumentos vem do código dos próprios instrumentos. Os sufixos podem incluir níveis como estes:

- Um nome para o elemento principal (um módulo do servidor, como `myisam`, `innodb`, `mysys` ou `sql`) ou um nome de plugin.

- O nome de uma variável no código, na forma *`XXX`* (uma variável global) ou `CCC::MMM` (um membro *`MMM`* na classe *`CCC`*). Exemplos: `COND_thread_cache`, `THR_LOCK_myisam`, `BINLOG::LOCK_index`.

- Elementos de Instrumentos de Nível Superior

- Elementos de instrumentos em repouso

- Elementos do Instrumento de Memória

- Elementos de instrumentos de palco

- Elementos do Instrumento de Declaração

- Elementos de Instrumento de Aguardar

### Elementos de instrumentos de nível superior

- `idle`: Um evento de inatividade instrumentado. Este instrumento não possui outros elementos.

- `memory`: Um evento de memória instrumentado.

- `stage`: Um evento de palco instrumentado.

- `statement`: Um evento de declaração instrumentado.

- `transaction`: Um evento de transação instrumentado. Este instrumento não possui elementos adicionais.

- `wait`: um evento de espera instrumentado.

### Elementos de instrumento em repouso

O instrumento `idle` é usado para eventos de inatividade, que o Schema de Desempenho gera conforme discutido na descrição da coluna `socket_instances.STATE` em Seção 25.12.3.5, “A Tabela socket\_instances”.

### Elementos de Instrumento de Memória

A maioria das ferramentas de instrumentação de memória está desativada por padrão e pode ser ativada ou desativada durante o início do sistema ou dinamicamente durante a execução, atualizando a coluna `ENABLED` dos instrumentos relevantes na tabela `setup_instruments`. As ferramentas de memória têm nomes na forma `memory/code_area/instrument_name`, onde *`code_area`* é um valor como `sql` ou `myisam`, e *`instrument_name`* é o detalhe do instrumento.

Os instrumentos com o prefixo `memory/performance_schema/` mostram quanto memória é alocada para buffers internos no Schema de Desempenho. Os instrumentos `memory/performance_schema/` são pré-construídos, sempre ativados e não podem ser desativados no início ou durante o runtime. Os instrumentos de memória pré-construídos são exibidos apenas na tabela `Resumo de memória global por nome de evento`. Para mais informações, consulte Seção 25.17, “O modelo de alocação de memória do Schema de Desempenho”.

### Elementos de Instrumento de Cena

Os instrumentos de estágio têm nomes na forma `estágio/área_código/nome_estágio`, onde *`área_código`* é um valor como `sql` ou `myisam`, e *`nome_estágio`* indica o estágio do processamento da declaração, como `Ordenar resultado` ou `Enviar dados`. Os estágios correspondem aos estados de thread exibidos por `SHOW PROCESSLIST` ou que são visíveis na tabela do Schema de Informações `PROCESSLIST`.

### Elementos do Instrumento de Declaração

- `statement/abstract/*`: Um instrumento abstrato para operações de declaração. Instrumentos abstratos são usados nas fases iniciais da classificação de declarações antes que o tipo exato da declaração seja conhecido, e então são alterados para um instrumento de declaração mais específico quando o tipo é conhecido. Para uma descrição desse processo, consulte Seção 25.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

- `statement/com`: Uma operação de comando instrumentada. Estes têm nomes correspondentes às operações `COM_xxx` (consulte o arquivo de cabeçalho `mysql_com.h` e `sql/sql_parse.cc`. Por exemplo, os instrumentos `statement/com/Connect` e `statement/com/Init DB` correspondem aos comandos `COM_CONNECT` e `COM_INIT_DB`.

- `statement/scheduler/event`: Um único instrumento para rastrear todos os eventos executados pelo Cronômetro de Eventos. Este instrumento entra em ação quando um evento agendado começa a ser executado.

- `statement/sp`: Uma instrução interna instrumentada executada por um programa armazenado. Por exemplo, as instruções `statement/sp/cfetch` e `statement/sp/freturn` são usadas para obter o cursor e retornar funções.

- `statement/sql`: Uma operação de instrução SQL instrumentada. Por exemplo, os instrumentos `statement/sql/create_db` e `statement/sql/select` são usados para as instruções `CREATE DATABASE` (criar banco de dados) e `SELECT` (selecionar).

### Aguarde Elementos de Instrumento

- `wait/io`

  Uma operação de E/S instrumentada.

  - `wait/io/file`

    Uma operação de E/S de arquivo instrumentada. Para arquivos, a espera é o tempo que o sistema espera para que a operação de arquivo seja concluída (por exemplo, uma chamada a `fwrite()`). Devido ao cache, a E/S física de arquivo no disco pode não ocorrer dentro desta chamada.

  - `wait/io/socket`

    Uma operação de soquete instrumentado. Os instrumentos de soquete têm nomes na forma `wait/io/socket/sql/socket_type`. O servidor tem um soquete de escuta para cada protocolo de rede que ele suporta. Os instrumentos associados aos soquetes de escuta para conexões de arquivos de soquete TCP/IP ou Unix têm um valor de *`socket_type`* de `server_tcpip_socket` ou `server_unix_socket`, respectivamente. Quando um soquete de escuta detecta uma conexão, o servidor transfere a conexão para um novo soquete gerenciado por um fio separado. O instrumento para o novo fio de conexão tem um valor de *`socket_type`* de `client_connection`.

  - `wait/io/table`

    Uma operação de entrada/saída de tabela instrumentada. Isso inclui acessos em nível de linha a tabelas de base persistentes ou tabelas temporárias. As operações que afetam as linhas são buscar, inserir, atualizar e excluir. Para uma visualização, as espera são associadas às tabelas de base referenciadas pela visualização.

    Ao contrário da maioria das espera, uma espera de I/O de tabela pode incluir outras espera. Por exemplo, o I/O de tabela pode incluir operações de I/O de arquivo ou de memória. Assim, `events_waits_current` para uma espera de I/O de tabela geralmente tem duas linhas. Para mais informações, consulte Seção 25.8, “Eventos de Átomo e Molécula do Schema de Desempenho”.

    Algumas operações de linha podem causar múltiplas espera de E/S de tabela. Por exemplo, uma inserção pode ativar um gatilho que causa uma atualização.

- `espera/bloqueio`

  Uma operação de fechamento instrumentada.

  - `esperar/bloquear/tabela`

    Uma operação de bloqueio de tabela instrumentada.

  - `wait/lock/metadata/sql/mdl`

    Uma operação de bloqueio de metadados instrumentada.

- `wait/synch`

  Um objeto de sincronização instrumentado. Para objetos de sincronização, o tempo `TIMER_WAIT` inclui o tempo bloqueado enquanto tenta adquirir um bloqueio no objeto, se houver.

  - `wait/synch/cond`

    Uma condição é usada por um fio para sinalizar para outros fios que algo pelo qual eles estavam esperando aconteceu. Se um único fio estava esperando por uma condição, ele pode acordar e prosseguir com sua execução. Se vários fios estavam esperando, eles podem acordar e competir pelo recurso pelo qual estavam esperando.

  - `wait/synch/mutex`

    Um objeto de exclusão mútua usado para permitir o acesso a um recurso (como uma seção de código executável) enquanto impede que outros threads acessem o recurso.

  - `wait/synch/rwlock`

    Um objeto de bloqueio de leitura/escrita (glossary.html#glos\_rw\_lock) usado para bloquear uma variável específica para acesso, impedindo seu uso por outros threads. Um bloqueio de leitura compartilhado pode ser adquirido simultaneamente por vários threads. Um bloqueio de escrita exclusivo pode ser adquirido por apenas um thread de cada vez.

  - `wait/synch/sxlock`

    Um bloqueio compartilhado exclusivo (SX) é um tipo de objeto de bloqueio rwlock que fornece acesso de escrita a um recurso comum, permitindo leituras inconsistentes por outros threads. Os `sxlocks` otimizam a concorrência e melhoram a escalabilidade para cargas de trabalho de leitura e escrita.
