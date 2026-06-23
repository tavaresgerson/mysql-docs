## 17.5 Estruturas de Memória Dinâmica InnoDB

Esta seção descreve as estruturas de memória `InnoDB` e os tópicos relacionados.

### 17.5.1 Banco de Buffer

O pool de tampão é uma área na memória principal onde o `InnoDB` armazena dados de tabela e índice à medida que são acessados. O pool de tampão permite que os dados utilizados frequentemente sejam acessados diretamente da memória, o que acelera o processamento. Em servidores dedicados, até 80% da memória física é frequentemente atribuída ao pool de tampão.

Para a eficiência das operações de leitura de alto volume, o conjunto de buffers é dividido em páginas que podem potencialmente conter múltiplas linhas. Para a eficiência da gestão de cache, o conjunto de buffers é implementado como uma lista vinculada de páginas; os dados que raramente são usados são eliminados da cache usando uma variação do algoritmo do menos recentemente usado (LRU).

Saber como aproveitar o buffer pool para manter dados frequentemente acessados na memória é um aspecto importante do ajuste do MySQL.

#### Algoritmo de Pool de Buffer LRU

O buffer é gerenciado como uma lista usando uma variação do algoritmo LRU (Least Recently Used). Quando é necessário espaço para adicionar uma nova página ao buffer, a página menos recentemente usada é ejetada e uma nova página é adicionada no meio da lista. Essa estratégia de inserção no ponto central trata a lista como duas sublistas:

* No topo, uma sublista de páginas novas (“jovens”) que foram acessadas recentemente

* Na cauda, uma sublista de páginas antigas que foram acessadas com menos frequência

**Figura 17.2 Lista de Pool de Buffer**

![Content is described in the surrounding text.](images/innodb-buffer-pool-list.png)

O algoritmo mantém as páginas frequentemente usadas na nova sublista. A antiga sublista contém páginas menos frequentemente usadas; essas páginas são candidatas à expulsão.

Por padrão, o algoritmo funciona da seguinte forma:

* 3/8 do pool de buffer é dedicado à sublista antiga. * O ponto central da lista é a fronteira onde a cauda da nova sublista encontra a cabeça da sublista antiga.

* Quando o `InnoDB` lê uma página no pool de buffer, ele inicialmente a insere no ponto central (a cabeça da sublista antiga). Uma página pode ser lida porque é necessária para uma operação iniciada pelo usuário, como uma consulta SQL, ou como parte de uma operação de leitura à frente realizada automaticamente pelo `InnoDB`.

* Acessar uma página na sublista antiga a torna "jovem", movendo-a para a cabeça da nova sublista. Se a página foi lida porque era necessária por uma operação iniciada pelo usuário, o primeiro acesso ocorre imediatamente e a página é feita jovem. Se a página foi lida devido a uma operação de leitura à frente, o primeiro acesso não ocorre imediatamente e pode não ocorrer em tudo antes da página ser ejetada.

* À medida que o banco de dados opera, as páginas no buffer que não são acessadas "envelhecem" ao se moverem em direção à extremidade da lista. As páginas tanto na sublista nova quanto na antiga envelhecem à medida que outras páginas são feitas novas. As páginas na sublista antiga também envelhecem à medida que páginas são inseridas no ponto central. Eventualmente, uma página que permanece não utilizada atinge a extremidade da sublista antiga e é ejetada.

Por padrão, as páginas lidas por consultas são imediatamente movidas para o novo sublista, o que significa que permanecem no buffer pool por mais tempo. Um varredura de tabela, realizada para uma operação de **mysqldump** ou uma declaração `SELECT` sem cláusula `WHERE`, por exemplo, pode trazer uma grande quantidade de dados para o buffer pool e expulsar uma quantidade equivalente de dados mais antigos, mesmo que os novos dados nunca sejam usados novamente. Da mesma forma, as páginas que são carregadas pelo thread de pré-leitura de fundo e acessadas apenas uma vez são movidas para a cabeça da nova lista. Essas situações podem empurrar páginas frequentemente usadas para o sublista antigo, onde elas se tornam sujeitas à expulsão. Para informações sobre otimização desse comportamento, consulte a Seção 17.8.3.3, “Tornando o varredura do buffer pool resistente”, e a Seção 17.8.3.4, “Configurando a pré-visualização do buffer pool InnoDB (Pré-leitura)”.).

`InnoDB` A saída padrão do Monitor contém vários campos na seção `BUFFER POOL AND MEMORY` em relação ao funcionamento do algoritmo de buffer LRU. Para detalhes, consulte Monitoramento do Buffer Pool usando o Monitor Padrão do InnoDB.

#### Configuração do Banco de Armazenamento de Buffer

Você pode configurar os vários aspectos do pool de buffer para melhorar o desempenho.

* Idealmente, você define o tamanho do pool de buffer para um valor tão grande quanto possível, deixando memória suficiente para outros processos no servidor para funcionar sem paginação excessiva. Quanto maior o pool de buffer, mais o `InnoDB` age como um banco de dados em memória, lendo dados do disco uma vez e, em seguida, acessando os dados da memória durante leituras subsequentes. Veja a Seção 17.8.3.1, “Configurando o Tamanho do Pool de Buffer InnoDB”.

* Em sistemas de 64 bits com memória suficiente, você pode dividir o pool de buffers em várias partes para minimizar a disputa por estruturas de memória entre operações concorrentes. Para detalhes, consulte a Seção 17.8.3.2, “Configurando múltiplas instâncias de pool de buffers”.

* Você pode manter dados frequentemente acessados na memória, independentemente de picos repentinos de atividade de operações que levem grandes quantidades de dados raramente acessados ao pool de buffer. Para mais detalhes, consulte a Seção 17.8.3.3, “Tornando o Scan do Pool de Buffer Resistente”.

* Você pode controlar como e quando realizar solicitações de leitura antecipada para pré-carregar páginas no pool de buffer de forma assíncrona, antecipando a necessidade iminente delas. Para mais detalhes, consulte a Seção 17.8.3.4, “Configurando a pré-visualização do pool de buffer InnoDB (Leitura Antecipada”)”).

* Você pode controlar quando o esvaziamento de fundo ocorre e se a taxa de esvaziamento é ajustada dinamicamente com base na carga de trabalho. Para detalhes, consulte a Seção 17.8.3.5, “Configurando o esvaziamento do Pool de Buffer”.

* Você pode configurar como o `InnoDB` preserva o estado atual do pool de buffer para evitar um longo período de aquecimento após o reinício do servidor. Para detalhes, consulte a Seção 17.8.3.6, “Salvar e restaurar o estado do pool de buffer”.

#### Monitoramento do Pool de Buffer usando o Monitor Padrão InnoDB

A saída padrão do Monitor `InnoDB` pode ser acessada usando [`SHOW ENGINE INNODB STATUS`](innodb-standard-monitor.html "17.17.3 InnoDB Standard Monitor and Lock Monitor Output"), e fornece métricas sobre o funcionamento do pool de buffers. As métricas do pool de buffers estão localizadas na seção `BUFFER POOL AND MEMORY` da saída padrão do Monitor `InnoDB`:

```
----------------------
BUFFER POOL AND MEMORY
----------------------
Total large memory allocated 2198863872
Dictionary memory allocated 776332
Buffer pool size   131072
Free buffers       124908
Database pages     5720
Old database pages 2071
Modified db pages  910
Pending reads 0
Pending writes: LRU 0, flush list 0, single page 0
Pages made young 4, not young 0
0.10 youngs/s, 0.00 non-youngs/s
Pages read 197, created 5523, written 5060
0.00 reads/s, 190.89 creates/s, 244.94 writes/s
Buffer pool hit rate 1000 / 1000, young-making rate 0 / 1000 not
0 / 1000
Pages read ahead 0.00/s, evicted without access 0.00/s, Random read
ahead 0.00/s
LRU len: 5720, unzip_LRU len: 0
I/O sum[0]:cur[0], unzip sum[0]:cur[0]
```

A tabela a seguir descreve as métricas do pool de buffers relatadas pelo Monitor Padrão `InnoDB`.

As médias por segundo fornecidas na saída do Monitor Padrão `InnoDB` são baseadas no tempo decorrido desde que a saída do Monitor Padrão `InnoDB` foi impressa pela última vez.

**Tabela 17.2 Metricas do Banco de Armazenamento de Buffer InnoDB**

<table summary="InnoDB buffer pool metrics reported by the InnoDB Standard Monitor."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>Total memory allocated</td> <td>A memória total alocada para o conjunto de buffers em bytes.</td> </tr><tr> <td>Dictionary memory allocated</td> <td>A memória total alocada para o<code>InnoDB</code>dicionário de dados em bytes.</td> </tr><tr> <td>Buffer pool size</td> <td>O tamanho total em páginas alocado para o pool de buffer.</td> </tr><tr> <td>Free buffers</td> <td>O tamanho total em páginas da lista livre do buffer pool.</td> </tr><tr> <td>Database pages</td> <td>O tamanho total em páginas da lista de buffer LRU.</td> </tr><tr> <td>Old database pages</td> <td>O tamanho total em páginas do subconjunto antigo LRU do buffer pool.</td> </tr><tr> <td>Modified db pages</td> <td>O número atual de páginas modificadas no buffer pool.</td> </tr><tr> <td>Pending reads</td> <td>O número de páginas do pool de buffer à espera de serem lidas no pool de buffer.</td> </tr><tr> <td>Pending writes LRU</td> <td>O número de páginas antigas sujas que devem ser escritas do fundo da lista LRU no buffer pool.</td> </tr><tr> <td>Pending writes flush list</td> <td>O número de páginas do buffer a serem esvaziadas durante o checkpointing.</td> </tr><tr> <td>Pending writes single page</td> <td>O número de escritas de página independentes pendentes no pool de buffer.</td> </tr><tr> <td>Pages made young</td> <td>O número total de páginas que foram feitas jovens na lista LRU do buffer pool (movidas para a cabeça da sublista de páginas “novas”).</td> </tr><tr> <td>Pages made not young</td> <td>O número total de páginas que não foram atualizadas como jovens na lista LRU do buffer (páginas que permaneceram na sublista "antiga" sem serem atualizadas).</td> </tr><tr> <td>youngs/s</td> <td>A média de acessos por segundo às páginas antigas na lista de buffer LRU que resultaram em páginas jovens. Consulte as notas que seguem esta tabela para obter mais informações.</td> </tr><tr> <td>non-youngs/s</td> <td>A média de acessos por segundo às páginas antigas na lista de buffer LRU que resultaram em não tornar as páginas jovens. Consulte as notas que seguem esta tabela para obter mais informações.</td> </tr><tr> <td>Pages read</td> <td>O número total de páginas lidas do buffer pool.</td> </tr><tr> <td>Pages created</td> <td>O número total de páginas criadas dentro do buffer pool.</td> </tr><tr> <td>Pages written</td> <td>O número total de páginas escritas a partir do pool de buffer.</td> </tr><tr> <td>reads/s</td> <td>O número médio de leituras de páginas do pool de buffer por segundo.</td> </tr><tr> <td>creates/s</td> <td>O número médio de páginas do pool de buffer criadas por segundo.</td> </tr><tr> <td>writes/s</td> <td>O número médio de escritas de páginas do pool de buffer por segundo.</td> </tr><tr> <td>Buffer pool hit rate</td> <td>A taxa de acerto de página do buffer de pool para páginas lidas do buffer de pool em comparação com armazenamento em disco.</td> </tr><tr> <td>young-making rate</td> <td>A taxa média de acerto com a qual os acessos às páginas resultam em páginas jovens. Consulte as notas que seguem esta tabela para obter mais informações.</td> </tr><tr> <td>not (young-making rate)</td> <td>A taxa média de acerto em que os acessos às páginas não resultaram em tornar as páginas jovens. Consulte as notas que seguem esta tabela para obter mais informações.</td> </tr><tr> <td>Pages read ahead</td> <td>A média de operações de leitura à frente por segundo.</td> </tr><tr> <td>Pages evicted without access</td> <td>A média por segundo das páginas expulsas sem serem acessadas do pool de buffer.</td> </tr><tr> <td>Random read ahead</td> <td>A média por segundo das operações de leitura aleatória à frente.</td> </tr><tr> <td>LRU len</td> <td>O tamanho total em páginas da lista de buffer LRU.</td> </tr><tr> <td>unzip_LRU len</td> <td>O comprimento (em páginas) da lista de buffer pool unzip_LRU.</td> </tr><tr> <td>I/O sum</td> <td>O número total de páginas da lista LRU do pool de buffer acessadas.</td> </tr><tr> <td>I/O cur</td> <td>O número total de páginas da lista LRU do pool de buffer acessadas no intervalo atual.</td> </tr><tr> <td>I/O unzip sum</td> <td>O número total de páginas da lista de buffer pool unzip_LRU descomprimidas.</td> </tr><tr> <td>I/O unzip cur</td> <td>O número total de páginas da lista de buffer pool unzip_LRU descomprimidas no intervalo atual.</td> </tr></tbody></table>

**Notas**:

* A métrica `youngs/s` é aplicável apenas a páginas antigas. Ela é baseada no número de acessos à página. Pode haver múltiplos acessos para uma página específica, todos contados. Se você observar valores muito baixos de `youngs/s` quando não há grandes varreduras ocorrendo, considere reduzir o tempo de atraso ou aumentar a porcentagem do pool de buffer usado para a sublista antiga. Aumentar a porcentagem torna a sublista antiga maior, de modo que leva mais tempo para as páginas nessa sublista se moverem para a extremidade, o que aumenta a probabilidade de essas páginas serem acessadas novamente e tornadas jovens. Veja a Seção 17.8.3.3, “Tornando a varredura do pool de buffer resistente”.

* A métrica `non-youngs/s` é aplicável apenas a páginas antigas. Ela é baseada no número de acessos à página. Pode haver múltiplos acessos para uma página específica, todos contados. Se você não ver um valor maior `non-youngs/s` ao realizar grandes varreduras de tabela (e um valor maior `youngs/s`,) aumente o valor do atraso. Veja a Seção 17.8.3.3, “Tornando a varredura do Buffer Pool resistente”.

* A taxa `young-making` contabiliza todos os acessos à página do pool de tampão, não apenas os acessos às páginas da antiga sublista. A taxa `young-making` e a taxa `not` normalmente não somam a taxa geral de acerto do pool de tampão. Os acertos de página na antiga sublista fazem com que as páginas sejam movidas para a nova sublista, mas os acertos de página na nova sublista fazem com que as páginas sejam movidas à cabeça da lista, apenas se estiverem a uma certa distância da cabeça.

* `not (young-making rate)` é a taxa média de acerto na qual os acessos à página não resultaram em páginas jovens devido ao atraso definido por `innodb_old_blocks_time` não ser atendido, ou devido a acessos à página na nova sublista que não resultaram em páginas sendo movidas para a cabeça. Essa taxa contabiliza todos os acessos de página do buffer pool, não apenas os acessos para páginas na sublista antiga.

O buffer pool [variáveis de status do servidor](server-status-variables.html "7.1.10 Server Status Variables") e a tabela `INNODB_BUFFER_POOL_STATS` fornecem muitas das mesmas métricas do buffer pool encontradas na saída do Monitor Padrão `InnoDB`. Para mais informações, consulte o Exemplo 17.10, “Consultando a tabela INNODB_BUFFER_POOL_STATS”.

### 17.5.2 Buffer de Mudança

O buffer de alterações é uma estrutura de dados especial que armazena alterações em páginas de índice secundário quando essas páginas não estão no pool de buffer. As alterações armazenadas, que podem resultar de operações `INSERT`, `UPDATE` ou `DELETE` (DML), são agregadas posteriormente quando as páginas são carregadas no pool de buffer por outras operações de leitura.

**Figura 17.3 Buffer de alteração**

![Content is described in the surrounding text.](images/innodb-change-buffer.png)

Ao contrário dos índices agrupados (glossary.html#glos_clustered_index "clustered index"), os índices secundários geralmente não são exclusivos, e as inserções em índices secundários ocorrem em uma ordem relativamente aleatória. Da mesma forma, as exclusões e atualizações podem afetar páginas de índice secundário que não estão adjacentemente localizadas em uma árvore de índice. A fusão de alterações armazenadas em um momento posterior, quando as páginas afetadas são lidas no buffer pool por outras operações, evita o acesso aleatório substancial a I/O que seria necessário para ler páginas de índice secundário no buffer pool a partir do disco.

Periodicamente, a operação de purga que é executada quando o sistema está quase parado ou durante um desligamento lento, escreve as páginas de índice atualizadas no disco. A operação de purga pode escrever blocos de disco para uma série de valores de índice de forma mais eficiente do que se cada valor fosse escrito no disco imediatamente.

A fusão de buffers pode levar várias horas quando há muitas linhas afetadas e vários índices secundários a serem atualizados. Durante esse período, o I/O do disco é aumentado, o que pode causar um atraso significativo para consultas vinculadas ao disco. A fusão de buffers também pode continuar a ocorrer após a transação ser comprometida e até mesmo após o desligamento e o reinício do servidor (consulte a Seção 17.21.3, “Forçando a Recuperação do InnoDB”, para mais informações).

Em memória, o buffer de alterações ocupa parte do conjunto de buffers. No disco, o buffer de alterações faz parte do espaço de tabela do sistema, onde as alterações de índice são armazenadas quando o servidor de banco de dados é desligado.

O tipo de dados armazenados no buffer de alterações é controlado pela variável `innodb_change_buffering`. Para mais informações, consulte Configurando o buffer de alterações. Você também pode configurar o tamanho máximo do buffer de alterações. Para mais informações, consulte Configurando o tamanho máximo do buffer de alterações.

A alteração de buffer não é suportada para um índice secundário se o índice contiver uma coluna de índice descendente ou se a chave primária incluir uma coluna de índice descendente.

Para respostas a perguntas frequentes sobre o buffer de alterações, consulte a Seção A.16, “Perguntas frequentes sobre o MySQL 8.0: Buffer de alterações InnoDB”.

#### Configurando o Bufferamento de Alterações

Quando as operações `INSERT`, `UPDATE` e `DELETE` são realizadas em uma tabela, os valores das colunas indexadas (particularmente os valores das chaves secundárias) estão frequentemente em ordem não ordenada, exigindo um I/O substancial para atualizar os índices secundários. O buffer de mudança armazena as alterações nas entradas dos índices secundários quando a página relevante não está no buffer pool, evitando assim operações de I/O caras, sem ler imediatamente a página a partir do disco. As alterações bufferizadas são unidas quando a página é carregada no buffer pool e a página atualizada é posteriormente descarregada no disco. O principal thread `InnoDB` une as alterações bufferizadas quando o servidor está quase parado e durante um desligamento lento.

Como pode resultar em menos leituras e escritas em disco, a mudança de buffer é mais valiosa para cargas de trabalho que são limitadas por I/O; por exemplo, aplicativos com um alto volume de operações DML, como inserções em massa, se beneficiam da mudança de buffer.

No entanto, o buffer de alterações ocupa uma parte do conjunto de buffers, reduzindo a memória disponível para as páginas de cache de dados. Se o conjunto de dados em uso quase cabe no conjunto de buffers, ou se suas tabelas têm índices secundários relativamente poucos, pode ser útil desativar o buffer de alterações. Se o conjunto de dados em uso cabe inteiramente dentro do conjunto de buffers, o buffer de alterações não impõe sobrecarga extra, porque ele se aplica apenas às páginas que não estão no conjunto de buffers.

A variável `innodb_change_buffering` controla a extensão em que o `InnoDB` realiza o bufferamento de alterações. Você pode habilitar ou desabilitar o bufferamento para operações de inserção, operações de exclusão (quando os registros do índice são inicialmente marcados para exclusão) e operações de purga (quando os registros do índice são excluídos fisicamente). Uma operação de atualização é uma combinação de uma inserção e uma exclusão. O valor padrão da `innodb_change_buffering` é `all`.

Os valores permitidos do `innodb_change_buffering` incluem:

* **`all`**

O valor padrão: operações de inserção de buffer, marcação de apagamento e purges.

* **`none`**

Não realize bufferamento em nenhuma operação.

* **`inserts`**

Operações de inserção de tampão.

* **`deletes`**

Operações de marcação de apagamento do buffer.

* **`changes`**

Buffer tanto as operações de inserção quanto de marcação de exclusão.

* **`purges`**

Atenda as operações de exclusão física que ocorrem no segundo plano.

Você pode definir a variável `innodb_change_buffering` no arquivo de opções do MySQL (`my.cnf` ou `my.ini`) ou alterá-la dinamicamente com a declaração `SET GLOBAL`, que requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”. A alteração do ajuste afeta o bufferamento de novas operações; a fusão das entradas bufferadas existentes não é afetada.

#### Configurando o Tamanho Máximo do Buffer de Alterações

A variável `innodb_change_buffer_max_size` permite configurar o tamanho máximo do buffer de alterações como uma porcentagem do tamanho total do conjunto de buffers. Por padrão, `innodb_change_buffer_max_size` está definido como 25. O valor máximo é 50.

Considere aumentar `innodb_change_buffer_max_size` em um servidor MySQL com alta atividade de inserção, atualização e exclusão, onde a fusão do buffer de alterações não acompanha as novas entradas do buffer de alterações, fazendo com que o buffer de alterações atinja seu limite máximo de tamanho.

Considere diminuir `innodb_change_buffer_max_size` em um servidor MySQL com dados estáticos usados para relatórios, ou se o buffer de alteração consumir muito do espaço de memória compartilhado com o pool de buffers, fazendo com que as páginas sejam eliminadas do pool de buffers mais cedo do que o desejado.

Teste diferentes configurações com uma carga de trabalho representativa para determinar uma configuração ótima. A variável `innodb_change_buffer_max_size` é dinâmica, o que permite modificar a configuração sem reiniciar o servidor.

#### Monitoramento do Buffer de Mudança

As seguintes opções estão disponíveis para monitoramento do buffer de alteração:

* `InnoDB` A saída padrão do monitor inclui informações sobre o status do buffer de alterações. Para visualizar os dados do monitor, execute a declaração `SHOW ENGINE INNODB STATUS`.

  ```
  mysql> SHOW ENGINE INNODB STATUS\G
  ```

As informações de status do buffer são encontradas sob o título `INSERT BUFFER AND ADAPTIVE HASH INDEX` e aparecem de forma semelhante à seguinte:

  ```
  -------------------------------------
  INSERT BUFFER AND ADAPTIVE HASH INDEX
  -------------------------------------
  Ibuf: size 1, free list len 0, seg size 2, 0 merges
  merged operations:
   insert 0, delete mark 0, delete 0
  discarded operations:
   insert 0, delete mark 0, delete 0
  Hash table size 4425293, used cells 32, node heap has 1 buffer(s)
  13577.57 hash searches/s, 202.47 non-hash searches/s
  ```

Para mais informações, consulte a Seção 17.17.3, “Saída do Monitor Padrão InnoDB e do Monitor de Bloqueio”.

* A tabela do esquema de informações `INNODB_METRICS` fornece a maioria dos pontos de dados encontrados na saída do Monitor Padrão `InnoDB`, além de outros pontos de dados. Para visualizar as métricas do buffer de alterações e uma descrição de cada uma, execute a seguinte consulta:

  ```
  mysql> SELECT NAME, COMMENT FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME LIKE '%ibuf%'\G
  ```

Veja a Seção 17.15.6, “Tabela de métricas do InnoDB INFORMATION_SCHEMA”.

* A tabela do esquema de informações `INNODB_BUFFER_PAGE` fornece metadados sobre cada página no buffer pool, incluindo páginas de índice de buffer de mudança e páginas de mapa de bits de buffer de mudança. As páginas de buffer de mudança são identificadas por `PAGE_TYPE`. `IBUF_INDEX` é o tipo de página para páginas de índice de buffer de mudança, e `IBUF_BITMAP` é o tipo de página para páginas de mapa de bits de buffer de mudança.

Aviso

Consultar a tabela `INNODB_BUFFER_PAGE` pode introduzir um sobrecarga significativa de desempenho. Para evitar impactar o desempenho, reproduza o problema que você deseja investigar em uma instância de teste e execute suas consultas na instância de teste.

Por exemplo, você pode consultar a tabela `INNODB_BUFFER_PAGE` para determinar o número aproximado de páginas `IBUF_INDEX` e `IBUF_BITMAP` como uma porcentagem das páginas totais do buffer pool.

  ```
  mysql> SELECT (SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
         WHERE PAGE_TYPE LIKE 'IBUF%') AS change_buffer_pages,
         (SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE) AS total_pages,
         (SELECT ((change_buffer_pages/total_pages)*100))
         AS change_buffer_page_percentage;
  +---------------------+-------------+-------------------------------+
  | change_buffer_pages | total_pages | change_buffer_page_percentage |
  +---------------------+-------------+-------------------------------+
  |                  25 |        8192 |                        0.3052 |
  +---------------------+-------------+-------------------------------+
  ```

Para informações sobre outros dados fornecidos pela tabela `INNODB_BUFFER_PAGE`, consulte a Seção 28.4.2, “A tabela INFORMATION_SCHEMA INNODB_BUFFER_PAGE”. Para informações sobre o uso relacionado, consulte a Seção 17.15.5, “Tabelas de buffer do pool de informações do InnoDB”.

* O Schema de desempenho oferece instrumentação de espera de mutex de buffer de alterações para monitoramento avançado de desempenho. Para visualizar a instrumentação do buffer de alterações, execute a seguinte consulta:

  ```
  mysql> SELECT * FROM performance_schema.setup_instruments
         WHERE NAME LIKE '%wait/synch/mutex/innodb/ibuf%';
  +-------------------------------------------------------+---------+-------+
  | NAME                                                  | ENABLED | TIMED |
  +-------------------------------------------------------+---------+-------+
  | wait/synch/mutex/innodb/ibuf_bitmap_mutex             | YES     | YES   |
  | wait/synch/mutex/innodb/ibuf_mutex                    | YES     | YES   |
  | wait/synch/mutex/innodb/ibuf_pessimistic_insert_mutex | YES     | YES   |
  +-------------------------------------------------------+---------+-------+
  ```

Para obter informações sobre o monitoramento das esperas dos mutexes `InnoDB`, consulte a Seção 17.16.2, “Monitoramento das esperas dos mutexes InnoDB usando o Gerador de Desempenho”.

### 17.5.3 Índice Hash Adaptável

O índice de hash adaptável permite que o `InnoDB` funcione mais como um banco de dados em memória em sistemas com combinações apropriadas de carga de trabalho e memória suficiente para o pool de buffers, sem sacrificar as características transacionais ou a confiabilidade. O índice de hash adaptável é ativado pela variável `innodb_adaptive_hash_index`, ou desativado na inicialização do servidor pelo `--skip-innodb-adaptive-hash-index`.

Com base no padrão observado de pesquisas, um índice de hash é construído usando um prefixo da chave do índice. O prefixo pode ter qualquer comprimento, e pode ser que apenas alguns valores na árvore B apareçam no índice de hash. Os índices de hash são construídos sob demanda para as páginas do índice que são acessadas frequentemente.

Se uma tabela cabe quase inteiramente na memória principal, um índice de hash acelera as consultas ao permitir a busca direta de qualquer elemento, transformando o valor do índice em um tipo de ponteiro. `InnoDB` tem um mecanismo que monitora as pesquisas de índice. Se `InnoDB` percebe que as consultas poderiam se beneficiar da construção de um índice de hash, ele faz isso automaticamente.

Em alguns casos de carga de trabalho, a aceleração das consultas de índice de hash supera em muito o trabalho adicional necessário para monitorar as consultas de índice e manter a estrutura do índice de hash. O acesso ao índice de hash adaptável pode, às vezes, se tornar uma fonte de contenção em cargas de trabalho pesadas, como múltiplas junções concorrentes. As consultas com operadores `LIKE` e `%` também tendem a não se beneficiar. Para cargas de trabalho que não se beneficiam do índice de hash adaptável, desativá-lo reduz o overhead desnecessário de desempenho. Como é difícil prever antecipadamente se o índice de hash adaptável é apropriado para um sistema e uma carga de trabalho em particular, considere executar benchmarks com ele ativado e desativado.

O recurso de índice de hash adaptável é particionado. Cada índice está vinculado a uma partição específica, e cada partição é protegida por um bloqueio separado. A partição é controlada pela variável `innodb_adaptive_hash_index_parts`. A variável `innodb_adaptive_hash_index_parts` é definida como 8 por padrão. O valor máximo é 512.

Você pode monitorar o uso de índice de hash adaptativo e a concorrência na seção `SEMAPHORES` do `SHOW ENGINE INNODB STATUS` (show-engine.html "15.7.7.15 SHOW ENGINE Statement") de saída. Se houver vários threads aguardando latências rw-criadas em `btr0sea.c`, considere aumentar o número de partições de índice de hash adaptativo ou desativar o índice de hash adaptativo.

Para informações sobre as características de desempenho dos índices de hash, consulte a Seção 10.3.9, “Comparação entre B-Tree e índices de hash”.

### 17.5.4 Buffer de registro

O buffer de registro é a área de memória que armazena os dados que serão escritos nos arquivos de registro no disco. O tamanho do buffer de registro é definido pela variável `innodb_log_buffer_size`. O tamanho padrão é de 16 MB. O conteúdo do buffer de registro é periodicamente descarregado no disco. Um buffer de registro grande permite que transações grandes sejam executadas sem a necessidade de escrever dados de log de revisão no disco antes do comprometimento das transações. Assim, se você tiver transações que atualizam, inserem ou excluem muitas linhas, aumentar o tamanho do buffer de registro economiza o I/O do disco.

A variável `innodb_flush_log_at_trx_commit` controla como o conteúdo do buffer de registro é escrito e esvaziado no disco. A variável `innodb_flush_log_at_timeout` controla a frequência de esvaziamento do log.

Para informações relacionadas, consulte Configuração de memória e Seção 10.5.4, “Otimização do registro InnoDB Redo”.