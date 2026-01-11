### 14.5.1 Pool de tampão

O pool de tampão é uma área na memória principal onde o `InnoDB` armazena em cache os dados das tabelas e índices conforme eles são acessados. O pool de tampão permite que os dados frequentemente utilizados sejam acessados diretamente da memória, o que acelera o processamento. Em servidores dedicados, até 80% da memória física é frequentemente atribuída ao pool de tampão.

Para a eficiência das operações de leitura de alto volume, o pool de buffers é dividido em páginas que podem potencialmente armazenar múltiplas linhas. Para a eficiência da gestão de cache, o pool de buffers é implementado como uma lista encadeada de páginas; os dados que raramente são usados são eliminados do cache usando uma variação do algoritmo de uso menos recentemente (LRU).

Saber como aproveitar o pool de buffer para manter dados acessados com frequência na memória é um aspecto importante do ajuste do MySQL.

#### Algoritmo de Pool de Buffer LRU

O pool de tampão é gerenciado como uma lista usando uma variação do algoritmo LRU. Quando é necessário espaço para adicionar uma nova página ao pool de tampão, a página menos recentemente usada é removida e uma nova página é adicionada ao meio da lista. Essa estratégia de inserção no ponto médio trata a lista como duas sublistas:

- No topo, uma sublista de novas ("jovens") páginas que foram acessadas recentemente

- Na cauda, uma sublista de páginas antigas que foram acessadas com menos frequência

**Figura 14.2 Lista de Pool de Buffer**

![O conteúdo é descrito no texto ao redor.](images/innodb-buffer-pool-list.png)

O algoritmo mantém as páginas frequentemente usadas na nova sublista. A sublista antiga contém páginas menos frequentemente usadas; essas páginas são candidatas à expulsão.

Por padrão, o algoritmo funciona da seguinte forma:

- 3/8 do pool de buffer é dedicado à antiga sublista.

- O ponto médio da lista é a linha divisória onde a cauda da nova sublista encontra a cabeça da sublista antiga.

- Quando o `InnoDB` lê uma página no pool de buffers, ele inicialmente a insere no ponto central (a cabeça da antiga sublista). Uma página pode ser lida porque é necessária para uma operação iniciada pelo usuário, como uma consulta SQL, ou como parte de uma operação de leitura à frente realizada automaticamente pelo `InnoDB`.

- Acessar uma página na antiga sublista a torna "jovem", movendo-a para a parte superior da nova sublista. Se a página foi lida porque foi necessária por uma operação iniciada pelo usuário, o primeiro acesso ocorre imediatamente e a página é marcada como jovem. Se a página foi lida devido a uma operação de leitura antecipada, o primeiro acesso não ocorre imediatamente e pode não ocorrer de todo antes de a página ser removida.

- À medida que o banco de dados opera, as páginas no pool de buffer que não são acessadas "envelhecem" ao se moverem para a extremidade da lista. As páginas tanto na sublista nova quanto na antiga envelhecem à medida que outras páginas são atualizadas. As páginas na sublista antiga também envelhecem à medida que páginas são inseridas no meio. Eventualmente, uma página que permanece inutilizada atinge a extremidade da sublista antiga e é removida.

Por padrão, as páginas lidas por consultas são imediatamente movidas para a nova sublista, o que significa que permanecem no buffer pool por mais tempo. Um varredura de tabela, realizada para uma operação de **mysqldump** ou uma instrução `SELECT` sem cláusula `WHERE`, por exemplo, pode trazer uma grande quantidade de dados para o buffer pool e expulsar uma quantidade equivalente de dados mais antigos, mesmo que os novos dados nunca sejam usados novamente. Da mesma forma, as páginas que são carregadas pelo thread de pré-leitura em segundo plano e acessadas apenas uma vez são movidas para a frente da nova lista. Essas situações podem empurrar páginas frequentemente usadas para a sublista antiga, onde elas se tornam sujeitas à expulsão. Para obter informações sobre como otimizar esse comportamento, consulte a Seção 14.8.3.3, “Tornando a varredura do buffer pool resistente”, e a Seção 14.8.3.4, “Configurando o pré-enchimento do buffer pool do InnoDB (Pré-leitura)”).

A saída do Monitor Padrão do `InnoDB` contém vários campos na seção `POOL DE BUFFER E MEMÓRIA` sobre o funcionamento do algoritmo LRU do pool de buffers. Para obter detalhes, consulte Monitoramento do Pool de Buffers Usando o Monitor Padrão do InnoDB.

#### Configuração do Pool de Armazenamento de Buffer

Você pode configurar os vários aspectos do pool de buffer para melhorar o desempenho.

- Idealmente, você define o tamanho do pool de buffers para um valor tão grande quanto possível, deixando memória suficiente para que outros processos no servidor funcionem sem paginação excessiva. Quanto maior o pool de buffers, mais o `InnoDB` age como um banco de dados em memória, lendo dados do disco uma vez e, em seguida, acessando os dados da memória durante leituras subsequentes. Veja a Seção 14.8.3.1, “Configurando o Tamanho do Pool de Buffers do InnoDB”.

- Em sistemas de 64 bits com memória suficiente, você pode dividir o pool de buffers em várias partes para minimizar a disputa por estruturas de memória entre operações concorrentes. Para obter detalhes, consulte a Seção 14.8.3.2, “Configurando Instâncias Múltiplas de Pool de Buffers”.

- Você pode manter os dados acessados com frequência na memória, independentemente de picos repentinos de atividade causados por operações que levem grandes quantidades de dados acessados com menos frequência para o pool de buffer. Para obter detalhes, consulte a Seção 14.8.3.3, “Tornando o Scan do Pool de Buffer Resistente”.

- Você pode controlar como e quando realizar solicitações de leitura antecipada para pré-carregar páginas no pool de buffer de forma assíncrona, antecipando que as páginas serão necessárias em breve. Para obter detalhes, consulte a Seção 14.8.3.4, “Configurando a Pré-visualização (Leitura Antecipada) do Pool de Buffer do InnoDB”).

- Você pode controlar quando ocorre o esvaziamento de fundo e se a taxa de esvaziamento é ajustada dinamicamente com base na carga de trabalho. Para obter detalhes, consulte a Seção 14.8.3.5, “Configurando o Esvaziamento do Pool de Buffer”.

- Você pode configurar como o `InnoDB` preserva o estado atual do pool de buffers para evitar um longo período de aquecimento após o reinício do servidor. Para obter detalhes, consulte a Seção 14.8.3.6, “Salvar e restaurar o estado do pool de buffers”.

#### Monitoramento do Pool de Buffer Usando o Monitor Padrão InnoDB

A saída do Monitor Padrão `InnoDB`, que pode ser acessada usando `SHOW ENGINE INNODB STATUS`, fornece métricas sobre o funcionamento do pool de buffers. As métricas do pool de buffers estão localizadas na seção `BUFFER POOL AND MEMORY` (Pool de Buffers e Memória) da saída do Monitor Padrão `InnoDB`:

```sql
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

As médias por segundo fornecidas na saída do Monitor Padrão do InnoDB são baseadas no tempo decorrido desde que a saída do Monitor Padrão do InnoDB foi impressa pela última vez.

**Tabela 14.2: Métricas do Pool de Buffer do InnoDB**

<table summary="Métricas do pool de buffers do InnoDB relatadas pelo Monitor Padrão do InnoDB."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>Memória total alocada</td> <td>A memória total alocada para o pool de buffers em bytes.</td> </tr><tr> <td>Memória do dicionário alocada</td> <td>A memória total alocada para o dicionário de dados <code>InnoDB</code> em bytes.</td> </tr><tr> <td>Tamanho do pool de tampão</td> <td>O tamanho total em páginas alocado ao pool de buffer.</td> </tr><tr> <td>Buffers gratuitos</td> <td>O tamanho total em páginas da lista livre do pool de buffer.</td> </tr><tr> <td>Páginas de banco de dados</td> <td>O tamanho total em páginas da lista de buffer pool LRU.</td> </tr><tr> <td>Páginas antigas do banco de dados</td> <td>O tamanho total em páginas do sublista LRU do pool de buffer antigo.</td> </tr><tr> <td>Páginas de banco de dados modificadas</td> <td>O número atual de páginas modificadas no pool de buffer.</td> </tr><tr> <td>Leitura pendente</td> <td>O número de páginas do pool de buffer à espera de serem lidas para o pool de buffer.</td> </tr><tr> <td>Espera-se que escreva LRU</td> <td>O número de páginas antigas e sujas dentro do pool de buffer a serem escritas a partir da parte inferior da lista LRU.</td> </tr><tr> <td>Espera-se que a lista de escritas seja esvaziada</td> <td>O número de páginas do pool de buffers a serem descartadas durante o checkpointing.</td> </tr><tr> <td>Escrevendo em espera de uma única página</td> <td>O número de escritas de páginas independentes pendentes no pool de buffer.</td> </tr><tr> <td>Pequenos feitos</td> <td>O número total de páginas que foram jovens na lista LRU do pool de buffer (movidas para a cabeça da sublista de<span class="quote">“<span class="quote">novo</span>”</span>páginas).</td> </tr><tr> <td>Páginas feitas não são jovens</td> <td>O número total de páginas que não foram atualizadas no cache LRU (páginas que permaneceram no cache)<span class="quote">“<span class="quote">antigo</span>”</span>sublista sem se tornar jovem).</td> </tr><tr> <td>jovens/s</td> <td>A média de acessos por segundo às páginas antigas na lista de pool de buffer LRU que resultaram em páginas jovens. Consulte as notas que seguem esta tabela para obter mais informações.</td> </tr><tr> <td>não jovens/s</td> <td>A média de acessos por segundo às páginas antigas na lista de pool de buffer LRU que não resultaram em páginas jovens. Consulte as notas que seguem esta tabela para obter mais informações.</td> </tr><tr> <td>Páginas lidas</td> <td>O número total de páginas lidas do pool de buffer.</td> </tr><tr> <td>Páginas criadas</td> <td>O número total de páginas criadas dentro do pool de buffer.</td> </tr><tr> <td>Páginas escritas</td> <td>O número total de páginas escritas a partir do pool de buffer.</td> </tr><tr> <td>leia/s</td> <td>O número médio de leituras de páginas do pool de buffer por segundo.</td> </tr><tr> <td>cria/s</td> <td>O número médio de páginas do pool de tampão criadas por segundo.</td> </tr><tr> <td>escreve/s</td> <td>O número médio de escritas de páginas do pool de buffer por segundo.</td> </tr><tr> <td>Taxa de impacto do pool de tampão</td> <td>Taxa de acerto da página do pool de tampão para páginas lidas do pool de tampão em comparação com o armazenamento em disco.</td> </tr><tr> <td>taxa de juventude</td> <td>A taxa média de acerto com a qual os acessos às páginas resultaram em páginas jovens. Consulte as notas que seguem esta tabela para obter mais informações.</td> </tr><tr> <td>não (taxa de envelhecimento)</td> <td>A taxa média de acerto em que os acessos às páginas não resultaram em tornar as páginas jovens. Consulte as notas que seguem esta tabela para obter mais informações.</td> </tr><tr> <td>Páginas lidas adiante</td> <td>A média por segundo das operações de leitura à frente.</td> </tr><tr> <td>Páginas despejadas sem acesso</td> <td>A média por segundo das páginas expulsas sem serem acessadas do pool de buffer.</td> </tr><tr> <td>Leia aleatoriamente para frente</td> <td>A média por segundo das operações de leitura adiante aleatória.</td> </tr><tr> <td>LRU len</td> <td>O tamanho total em páginas da lista de buffer pool LRU.</td> </tr><tr> <td>descompactar_LRU len</td> <td>O comprimento (em páginas) da lista de buffer pool unzip_LRU.</td> </tr><tr> <td>Soma de entrada/saída</td> <td>O número total de páginas da lista LRU do pool de tampão acessadas.</td> </tr><tr> <td>I/O cur</td> <td>O número total de páginas da lista LRU do pool de tampão acessadas no intervalo atual.</td> </tr><tr> <td>I/O unzip sum</td> <td>Número total de páginas da lista de buffer pool unzip_LRU descompressas.</td> </tr><tr> <td>I/O unzip cur</td> <td>O número total de páginas da lista de buffer pool unzip_LRU descompressas no intervalo atual.</td> </tr></tbody></table>

**Notas**:

- A métrica `youngs/s` é aplicável apenas a páginas antigas. Ela é baseada no número de acessos à página. Pode haver múltiplos acessos para uma mesma página, todos contados. Se você observar valores muito baixos de `youngs/s` quando não houver grandes varreduras, considere reduzir o tempo de atraso ou aumentar a porcentagem do pool de buffer usado para a sublista antiga. Aumentar a porcentagem faz com que a sublista antiga seja maior, de modo que leva mais tempo para que as páginas dessa sublista sejam movidas para a cauda, o que aumenta a probabilidade de essas páginas serem acessadas novamente e tornadas jovens. Consulte a Seção 14.8.3.3, “Tornando a varredura do pool de buffer resistente”.

- A métrica `non-youngs/s` é aplicável apenas a páginas antigas. Ela é baseada no número de acessos à página. Pode haver múltiplos acessos para uma mesma página, todos contados. Se você não ver um valor maior de `non-youngs/s` ao realizar varreduras de tabelas grandes (e um valor maior de `youngs/s`), aumente o valor de atraso. Consulte a Seção 14.8.3.3, “Tornando a varredura do Pool de Buffer resistente”.

- A taxa de `young-making` considera todos os acessos à página do pool de buffers, não apenas os acessos às páginas da antiga sublista. A taxa de `young-making` e a taxa de `not` normalmente não somam a taxa geral de acerto do pool de buffers. Os acessos às páginas na antiga sublista fazem com que as páginas sejam movidas para a nova sublista, mas os acessos às páginas na nova sublista fazem com que as páginas sejam movidas para a cabeça da lista apenas se estiverem a uma certa distância da cabeça.

- `taxa de não tornar páginas jovens` é a taxa de acerto média em que os acessos à página não resultaram em tornar as páginas jovens devido ao atraso definido por `innodb_old_blocks_time` não ser atendido, ou devido a acessos à página na nova sublista que não resultaram no deslocamento das páginas para a cabeça. Essa taxa considera todos os acessos à página do pool de tampão, e não apenas os acessos às páginas na sublista antiga.

As variáveis de status do servidor do buffer pool e a tabela `INNODB_BUFFER_POOL_STATS` fornecem muitas das mesmas métricas do buffer pool encontradas na saída do Monitor Padrão do `InnoDB`. Para mais informações, consulte o Exemplo 14.10, “Consultando a Tabela INNODB_BUFFER_POOL_STATS”.
