### 17.5.1 Pool de Buffer

O pool de buffer é uma área na memória principal onde o `InnoDB` armazena dados de tabelas e índices à medida que são acessados. O pool de buffer permite que dados frequentemente usados sejam acessados diretamente da memória, o que acelera o processamento. Em servidores dedicados, até 80% da memória física é frequentemente atribuída ao pool de buffer.

Para a eficiência das operações de leitura de alto volume, o pool de buffer é dividido em páginas que podem potencialmente conter várias linhas. Para a eficiência da gestão do cache, o pool de buffer é implementado como uma lista encadeada de páginas; os dados raramente usados são eliminados do cache usando uma variação do algoritmo de uso menos recentemente (LRU).

Conhecer como aproveitar o pool de buffer para manter dados frequentemente acessados na memória é um aspecto importante do ajuste do MySQL.

#### Algoritmo LRU do Pool de Buffer

O pool de buffer é gerenciado como uma lista usando uma variação do algoritmo LRU. Quando é necessário espaço para adicionar uma nova página ao pool de buffer, a página menos recentemente usada é removida e uma nova página é adicionada ao meio da lista. Essa estratégia de inserção no meio trata a lista como duas sublistas:

* Na cabeça, uma sublista de novas ("jovens") páginas que foram acessadas recentemente
* Na cauda, uma sublista de páginas antigas que foram acessadas com menos frequência

**Figura 17.2 Lista do Pool de Buffer**

![O conteúdo é descrito no texto ao redor.](images/innodb-buffer-pool-list.png)

O algoritmo mantém páginas frequentemente usadas na nova sublista. A sublista antiga contém páginas menos frequentemente usadas; essas páginas são candidatas à remoção.

Por padrão, o algoritmo opera da seguinte forma:

* 3/8 do pool de buffer é dedicado à sublista antiga.
* O ponto médio da lista é a fronteira onde a cauda da nova sublista encontra a cabeça da sublista antiga.

* Quando o `InnoDB` lê uma página no pool de buffers, ele inicialmente a insere no ponto central (a cabeça da antiga sublista). Uma página pode ser lida porque é necessária para uma operação iniciada pelo usuário, como uma consulta SQL, ou como parte de uma operação de leitura à frente realizada automaticamente pelo `InnoDB`.

* Acessar uma página na antiga sublista a torna “jovem”, movendo-a para a cabeça da nova sublista. Se a página foi lida porque era necessária para uma operação iniciada pelo usuário, o primeiro acesso ocorre imediatamente e a página é torna jovem. Se a página foi lida devido a uma operação de leitura à frente, o primeiro acesso não ocorre imediatamente e pode não ocorrer de todo antes de a página ser ejetada.

* À medida que o banco de dados opera, as páginas no pool de buffers que não são acessadas “envelhecem”, se movendo em direção à cauda da lista. As páginas tanto na nova quanto na antiga sublistas envelhecem à medida que outras páginas são tornadas novas. As páginas na antiga sublista também envelhecem à medida que páginas são inseridas no ponto central. Eventualmente, uma página que permanece inutilizada chega à cauda da antiga sublista e é ejetada.

Por padrão, as páginas lidas por consultas são movidas imediatamente para a nova sublista, o que significa que permanecem no buffer pool por mais tempo. Um varredura de tabela, realizada para uma operação de **mysqldump** ou uma instrução `SELECT` sem cláusula `WHERE`, por exemplo, pode trazer uma grande quantidade de dados para o buffer pool e expulsar um volume equivalente de dados mais antigos, mesmo que os novos dados nunca sejam usados novamente. Da mesma forma, as páginas que são carregadas pelo thread de pré-leitura em segundo plano e acessadas apenas uma vez são movidas para a frente da nova lista. Essas situações podem empurrar páginas frequentemente usadas para a sublista antiga, onde elas se tornam sujeitas à expulsão. Para obter informações sobre como otimizar esse comportamento, consulte a Seção 17.8.3.3, “Tornando o Scan do Buffer Pool Resistente”, e a Seção 17.8.3.4, “Configurando a Pré-visualização do Buffer Pool InnoDB (Pré-leitura)”.")

A saída do Monitor Padrão do `InnoDB` contém vários campos na seção `BUFFER POOL AND MEMORY` (Buffer Pool e Memória) sobre o funcionamento do algoritmo LRU do buffer pool. Para detalhes, consulte Monitorando o Buffer Pool Usando o Monitor Padrão do `InnoDB`.

#### Configuração do Buffer Pool

Você pode configurar vários aspectos do buffer pool para melhorar o desempenho.

* Idealmente, você define o tamanho do buffer pool para um valor tão grande quanto possível, deixando memória suficiente para que outros processos no servidor possam funcionar sem paginação excessiva. Quanto maior o buffer pool, mais o `InnoDB` age como um banco de dados em memória, lendo dados do disco uma vez e acessando os dados da memória durante leituras subsequentes. Veja a Seção 17.8.3.1, “Configurando o Tamanho do Buffer Pool InnoDB”.

* Em sistemas de 64 bits com memória suficiente, você pode dividir o pool de buffers em várias partes para minimizar a disputa por estruturas de memória entre operações concorrentes. Para obter detalhes, consulte a Seção 17.8.3.2, “Configurando Instâncias Múltiplas do Pool de Buffers”.

* Você pode manter dados acessados com frequência na memória, independentemente de picos repentinos de atividade de operações que levem grandes quantidades de dados acessados com menos frequência para o pool de buffers. Para obter detalhes, consulte a Seção 17.8.3.3, “Tornando o Scan do Pool de Buffers Resistente a Falhas”.

* Você pode controlar como e quando realizar solicitações de pré-leitura para pré-carregar páginas no pool de buffers de forma assíncrona, antecipando a necessidade iminente delas. Para obter detalhes, consulte a Seção 17.8.3.4, “Configurando a Pré-leitura do Pool de Buffers do InnoDB (Pré-leitura)”.

* Você pode controlar quando ocorre o esvaziamento em segundo plano e se a taxa de esvaziamento é ajustada dinamicamente com base na carga de trabalho. Para obter detalhes, consulte a Seção 17.8.3.5, “Configurando o Esvaziamento do Pool de Buffers”.

* Você pode configurar como o `InnoDB` preserva o estado atual do pool de buffers para evitar um longo período de aquecimento após o reinício do servidor. Para obter detalhes, consulte a Seção 17.8.3.6, “Salvando e Restaurando o Estado do Pool de Buffers”.

#### Monitoramento do Pool de Buffers Usando o Monitor Padrão do InnoDB

A saída do Monitor Padrão do `InnoDB`, que pode ser acessada usando `SHOW ENGINE INNODB STATUS`, fornece métricas sobre o funcionamento do pool de buffers. As métricas do pool de buffers estão localizadas na seção `BUFFER POOL AND MEMORY` (Buffer Pool e Memória) da saída do Monitor Padrão do `InnoDB`:

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

A tabela a seguir descreve as métricas do pool de buffers relatadas pelo Monitor Padrão do `InnoDB`.

As médias por segundo fornecidas na saída do Monitor Padrão do `InnoDB` são baseadas no tempo decorrido desde que a saída do Monitor Padrão do `InnoDB` foi impressa pela última vez.

**Tabela 17.2: Métricas do Pool de Buffer do InnoDB**

<table summary="Metricas do pool de buffers do InnoDB relatadas pelo Monitor Padrão do InnoDB."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>Memória total alocada</td> <td>A memória total alocada para o pool de buffers em bytes.</td> </tr><tr> <td>Memória do dicionário do InnoDB alocada</td> <td>A memória total alocada para o dicionário de dados do <code>InnoDB</code> em bytes.</td> </tr><tr> <td>Tamanho do pool de buffers</td> <td>O tamanho total em páginas alocadas para o pool de buffers.</td> </tr><tr> <td>Buffers livres</td> <td>O tamanho total em páginas da lista de buffers livres.</td> </tr><tr> <td>Páginas do banco de dados</td> <td>O tamanho total em páginas da lista LRU do pool de buffers.</td> </tr><tr> <td>Páginas antigas do banco de dados</td> <td>O tamanho total em páginas da sublista LRU antiga do pool de buffers.</td> </tr><tr> <td>Páginas de banco de dados modificadas</td> <td>O número atual de páginas modificadas no pool de buffers.</td> </tr><tr> <td>Leitura pendente</td> <td>O número de páginas do pool de buffers à espera de serem lidas.</td> </tr><tr> <td>Escrita LRU pendente</td> <td>O número de páginas antigas e sujas dentro do pool de buffers que devem ser escritas a partir da parte inferior da lista LRU.</td> </tr><tr> <td>Lista de escritas LRU pendentes</td> <td>O número de páginas do pool de buffers que devem ser descartadas durante o checkpointing.</td> </tr><tr> <td>Escrita de página pendente única</td> <td>O número de escritas de página pendentes independentes dentro do pool de buffers.</td> </tr><tr> <td>Páginas tornadas jovens</td> <td>O número total de páginas tornadas jovens na lista LRU do pool de buffers (movidas para a cabeça da sublista de páginas "<span class="quote">new</span>” (novas)).</td> </tr><tr> <td>Páginas não tornadas jovens</td> <td>O número total de páginas que não foram tornadas jovens na lista LRU do pool de buffers (páginas que permaneceram na sublista "<span class="quote">old</span>” (antigas) sem serem tornadas jovens).</td> </tr><tr> <td>Youngs/s</td> <td>A média por segundo de acessos a páginas antigas na lista LRU do pool de buffers que resultaram no torneamento de páginas jovens. Consulte as notas que seguem esta tabela para mais informações.</td> </tr><tr> <td>Non-youngs/s</td> <td>A média por segundo de acessos a páginas antigas na lista LRU do pool de buffers que não resultaram no torneamento de páginas jovens. Consulte as notas que seguem esta tabela para mais informações.</td> </tr><tr> <td>Páginas lidas</td> <td>O número total de páginas lidas do pool de buffers.</td> </tr><tr> <td>Páginas criadas</td> <td>O número total de páginas criadas dentro do pool de buffers.</td> </tr><tr> <td>Páginas escritas</td> <td>O número total de páginas escritas a partir do pool de buffers.</td> </tr><tr> <td>Leitura/s</td> <td>A média por segundo de leituras de páginas do pool de buffers.</td> </tr><tr> <td>Criação/s</td> <td>A média por segundo de páginas criadas no pool de buffers.</td> </tr><tr> <td>Escrita/s</td> <td>A média por segundo de páginas escritas no pool de buffers.</td> </tr><tr> <td>Taxa de acerto do pool de buffers</td> <td>A taxa de acerto do pool de buffers para páginas lidas do pool de buffers em comparação com o armazenamento em disco.</td> </tr><tr> <td>Taxa de torneamento (acerto)</td> <td>A taxa média de acerto em que os acessos a páginas resultaram no torneamento de páginas jovens. Consulte as notas que seguem esta tabela para mais informações.</td> </tr><tr> <td>Taxa de não torneamento (não acerto)</td> <td>A taxa média de acerto em que os acessos a páginas não resultaram no torneamento de páginas jovens. Consulte as notas que seguem esta tabela para mais informações.</td> </tr><tr> <td>Leitura adiante</td> <td>A média por segundo de operações de leitura adiante.</td> </tr><tr> <td>Evicção de páginas sem acesso</td> <td>A média por segundo de páginas que foram evitadas sem serem acessadas do pool de buffers.</td> </tr><tr> <td>Leitura adiante aleatória</td> <td>A média por segundo de operações de leitura adiante aleatória.</td> </tr><tr> <td>LRU

**Notas:**

* A métrica `youngs/s` é aplicável apenas a páginas antigas. Ela é baseada no número de acessos à página. Pode haver múltiplos acessos para uma mesma página, todos contados. Se você observar valores muito baixos de `youngs/s` quando não há grandes varreduras ocorrendo, considere reduzir o tempo de atraso ou aumentar a porcentagem do pool de buffer usado para a sublista antiga. Aumentar a porcentagem faz com que a sublista antiga seja maior, de modo que leva mais tempo para que as páginas nessa sublista sejam movidas para a cauda, o que aumenta a probabilidade de essas páginas serem acessadas novamente e tornadas jovens. Veja a Seção 17.8.3.3, “Tornando a varredura do pool de buffer resistente”.

* A métrica `non-youngs/s` é aplicável apenas a páginas antigas. Ela é baseada no número de acessos à página. Pode haver múltiplos acessos para uma mesma página, todos contados. Se você não observar um valor maior de `non-youngs/s` ao realizar varreduras grandes da tabela (e um valor maior de `youngs/s`), aumente o valor do atraso. Veja a Seção 17.8.3.3, “Tornando a varredura do pool de buffer resistente”.

* A taxa `young-making` contabiliza todos os acessos à página do pool de buffer, não apenas os acessos para páginas na sublista antiga. A taxa `young-making` e a taxa `not` normalmente não somam-se à taxa geral de acerto do pool de buffer. Os acessos à página na sublista antiga fazem com que as páginas sejam movidas para a nova sublista, mas os acessos à página na nova sublista fazem com que as páginas sejam movidas para a cabeça da lista apenas se estiverem a uma certa distância da cabeça.

* `taxa de não tornar páginas jovens` é a taxa média de acertos em que os acessos à página não resultaram em tornar as páginas jovens devido ao atraso definido por `innodb_old_blocks_time` não ser atendido, ou devido a acessos à página na nova sublista que não resultaram em páginas serem movidas para a cabeça. Essa taxa contabiliza todos os acessos à página do pool de buffers, e não apenas os acessos às páginas na sublista antiga.

As variáveis de status do servidor do pool de buffers e a tabela `INNODB_BUFFER_POOL_STATS` fornecem muitas das mesmas métricas do pool de buffers encontradas na saída do Monitor Padrão do `InnoDB`. Para mais informações, consulte o Exemplo 17.10, “Consultando a Tabela INNODB_BUFFER_POOL_STATS”.