## 14.9 Compressão de tabela e página do InnoDB

Esta seção fornece informações sobre a compressão da tabela `InnoDB` e as características de compressão de página `InnoDB`. O recurso de compressão de página é referido como compressão transparente de página.

Usando as características de compressão do `InnoDB`, você pode criar tabelas onde os dados são armazenados em forma comprimida. A compressão pode ajudar a melhorar tanto o desempenho bruto quanto a escalabilidade. A compressão significa que menos dados são transferidos entre o disco e a memória, e ocupa menos espaço no disco e na memória. Os benefícios são amplificados para tabelas com índices secundários, porque os dados do índice também são comprimidos. A compressão pode ser especialmente importante para dispositivos de armazenamento SSD, porque eles tendem a ter menor capacidade do que os dispositivos HDD.

### 14.9.1 Compressão de tabela InnoDB

Esta seção descreve a compressão da tabela `InnoDB`, que é suportada com tabelas `InnoDB` que residem em espaços de tabela por arquivo ou espaços de tabelas gerais. A compressão da tabela é habilitada usando o atributo `ROW_FORMAT=COMPRESSED` com `CREATE TABLE` ou `ALTER TABLE`.

#### 14.9.1.1 Visão geral da compressão de tabela

Como os processadores e as memórias de cache aumentaram em velocidade mais do que os dispositivos de armazenamento em disco, muitas cargas de trabalho estão limitadas ao disco. A compressão de dados permite um tamanho de banco de dados menor, redução do I/O e melhoria do desempenho, com o pequeno custo do aumento da utilização da CPU. A compressão é especialmente valiosa para aplicações intensivas em leitura, em sistemas com RAM suficiente para manter os dados utilizados frequentemente na memória.

Uma tabela `InnoDB` criada com `ROW_FORMAT=COMPRESSED` pode usar um tamanho de página menor no disco do que o valor configurado de `innodb_page_size`. Páginas menores exigem menos I/O para leitura e escrita no disco, o que é especialmente valioso para dispositivos SSD.

O tamanho de página compactada é especificado através do parâmetro `CREATE TABLE` ou `ALTER TABLE` `KEY_BLOCK_SIZE`. O tamanho de página diferente exige que a tabela seja colocada em um espaço de tabela por arquivo ou espaço de tabela geral, em vez do espaço de tabelas do sistema, pois o espaço de tabelas do sistema não pode armazenar tabelas compactadas. Para mais informações, consulte a Seção 14.6.3.2, “Espaços de Tabela por Arquivo”, e a Seção 14.6.3.3, “Espaços de Tabela Geral”.

O nível de compressão é o mesmo, independentemente do valor de `KEY_BLOCK_SIZE`. À medida que você especifica valores menores para `KEY_BLOCK_SIZE`, você obtém os benefícios de I/O de páginas cada vez menores. Mas se você especificar um valor que é muito pequeno, há um custo adicional para reorganizar as páginas quando os valores dos dados não podem ser comprimidos o suficiente para caber várias strings em cada página. Há um limite rígido sobre o quão pequeno `KEY_BLOCK_SIZE` pode ser para uma tabela, com base nas comprimentos das colunas chave para cada um de seus índices. Especifique um valor que é muito pequeno, e a declaração `CREATE TABLE` ou `ALTER TABLE` falha.

No buffer pool, os dados comprimidos são mantidos em pequenas páginas, com um tamanho de página baseado no valor do `KEY_BLOCK_SIZE`. Para extrair ou atualizar os valores da coluna, o MySQL também cria uma página não comprimida no buffer pool com os dados não comprimidos. Dentro do buffer pool, quaisquer atualizações na página não comprimida também são reescritas de volta para a página comprimida equivalente. Você pode precisar dimensionar seu buffer pool para acomodar os dados adicionais de ambas as páginas comprimidas e não comprimidas, embora as páginas não comprimidas sejam expulsas do buffer pool quando o espaço é necessário, e então não comprimidas novamente na próxima acesso.

#### 14.9.1.2 Criando tabelas comprimidas

Tabelas compactadas podem ser criadas em espaços de tabela por arquivo ou em espaços de tabela gerais. A compressão de tabelas não está disponível para o espaço de tabela do sistema InnoDB. O espaço de tabela do sistema (espaço 0, os arquivos .ibdata) pode conter tabelas criadas pelo usuário, mas também contém dados internos do sistema, que nunca são compactados. Assim, a compressão se aplica apenas às tabelas (e índices) armazenadas em espaços de tabela por arquivo ou espaços de tabela gerais.

##### Criando uma tabela comprimida em um espaço de tabela por arquivo

Para criar uma tabela compactada em um espaço de tabela por arquivo, `innodb_file_per_table` deve ser habilitado (o padrão no MySQL 5.6.6) e `innodb_file_format` deve ser definido como `Barracuda`. Você pode definir esses parâmetros no arquivo de configuração do MySQL (`my.cnf` ou `my.ini`) ou dinamicamente, usando uma declaração `SET`.

Após as opções `innodb_file_per_table` e `innodb_file_format` serem configuradas, especifique a cláusula `ROW_FORMAT=COMPRESSED` ou `KEY_BLOCK_SIZE`, ou ambas, em uma declaração `CREATE TABLE` ou `ALTER TABLE` para criar uma tabela compactada em um espaço de tabela por arquivo.

Por exemplo, você pode usar as seguintes declarações:

```sql
SET GLOBAL innodb_file_per_table=1;
SET GLOBAL innodb_file_format=Barracuda;
CREATE TABLE t1
 (c1 INT PRIMARY KEY)
 ROW_FORMAT=COMPRESSED
 KEY_BLOCK_SIZE=8;
```

##### Criando uma tabela comprimida em um espaço de tabelas geral

Para criar uma tabela compactada em um espaço de tabelas geral, `FILE_BLOCK_SIZE` deve ser definido para o espaço de tabelas geral, que é especificado quando o espaço de tabelas é criado. O valor `FILE_BLOCK_SIZE` deve ser um tamanho de página compactada válido em relação ao valor `innodb_page_size`, e o tamanho de página da tabela compactada, definido pela cláusula `CREATE TABLE` ou `ALTER TABLE` `KEY_BLOCK_SIZE`, deve ser igual a `FILE_BLOCK_SIZE/1024`. Por exemplo, se `innodb_page_size=16384` e `FILE_BLOCK_SIZE=8192`, o `KEY_BLOCK_SIZE` da tabela deve ser 8. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de Tabelas Gerais”.

O exemplo a seguir demonstra a criação de um espaço de tabelas geral e a adição de uma tabela comprimida. O exemplo assume um `innodb_page_size` padrão de 16K. O `FILE_BLOCK_SIZE` de 8192 exige que a tabela comprimida tenha um `KEY_BLOCK_SIZE` de 8.

```sql
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

##### Notas

* Se você especificar `ROW_FORMAT=COMPRESSED`, pode omitir `KEY_BLOCK_SIZE`; o ajuste `KEY_BLOCK_SIZE` tem como padrão metade do valor de `innodb_page_size`.

* Se você especificar um valor válido de `KEY_BLOCK_SIZE`, pode omitir `ROW_FORMAT=COMPRESSED`; a compressão é ativada automaticamente.

* Para determinar o melhor valor para `KEY_BLOCK_SIZE,`, geralmente, você cria várias cópias da mesma tabela com diferentes valores para esta cláusula, depois mede o tamanho dos arquivos resultantes de `.ibd` e verifica quão bem cada um se comporta com uma carga de trabalho realista. Para tabelas gerais, tenha em mente que a remoção de uma tabela não reduz o tamanho do espaço de tabelas geral `.ibd`, nem retorna espaço em disco ao sistema operacional. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de Tabelas Gerais”.

O valor `KEY_BLOCK_SIZE` é tratado como um indicativo; um tamanho diferente pode ser usado pelo `InnoDB`, se necessário. Para espaços de tabela por arquivo, o `KEY_BLOCK_SIZE` só pode ser menor ou igual ao valor `innodb_page_size`. Se você especificar um valor maior que o valor `innodb_page_size`, o valor especificado é ignorado, uma mensagem de aviso é emitida e `KEY_BLOCK_SIZE` é definido como metade do valor `innodb_page_size`. Se `innodb_strict_mode=ON`, especificar um valor `KEY_BLOCK_SIZE` inválido retorna um erro. Para espaços de tabela gerais, os valores válidos `KEY_BLOCK_SIZE` dependem da configuração `FILE_BLOCK_SIZE` do espaço de tabelas. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de Tabelas Gerais”.

* Os tamanhos de página de 32 KB e 64 KB não suportam compressão. Para mais informações, consulte a documentação do `innodb_page_size`.

* O tamanho padrão não compactado das páginas de dados do `InnoDB` é de 16 KB. Dependendo da combinação dos valores das opções, o MySQL utiliza um tamanho de página de 1 KB, 2 KB, 4 KB, 8 KB ou 16 KB para o arquivo de dados do espaço de tabela (arquivo `.ibd`). O algoritmo de compressão real não é afetado pelo valor do `KEY_BLOCK_SIZE`; o valor determina o tamanho de cada pedaço comprimido, o que, por sua vez, afeta quantas strings podem ser compactadas em cada página comprimida.

* Ao criar uma tabela compactada em um espaço de tabela por arquivo, definir `KEY_BLOCK_SIZE` igual ao tamanho de página `InnoDB` geralmente não resulta em muita compressão. Por exemplo, definir `KEY_BLOCK_SIZE=16` geralmente não resultaria em muita compressão, uma vez que o tamanho de página normal `InnoDB` é de 16 KB. Este ajuste ainda pode ser útil para tabelas com muitas colunas longas `BLOB`, `VARCHAR` ou `TEXT`, pois tais valores geralmente se comprimem bem e, portanto, podem exigir menos páginas de overflow, conforme descrito na Seção 14.9.1.5, “Como a compressão funciona para tabelas InnoDB”. Para espaços de tabela gerais, um valor de `KEY_BLOCK_SIZE` igual ao tamanho de página `InnoDB` não é permitido. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de tabela gerais”.

* Todos os índices de uma tabela (incluindo o índice agrupado) são compactados usando o mesmo tamanho de página, conforme especificado na declaração `CREATE TABLE` ou `ALTER TABLE`. Atributos da tabela, como `ROW_FORMAT` e `KEY_BLOCK_SIZE`, não fazem parte da sintaxe `CREATE INDEX` para tabelas `InnoDB`, e são ignorados se forem especificados (embora, se especificados, apareçam na saída da declaração `SHOW CREATE TABLE`).

* Para opções de configuração relacionadas ao desempenho, consulte a Seção 14.9.1.3, “Ajuste da compressão para tabelas InnoDB”.

##### Restrições para tabelas compactadas

* As versões do MySQL anteriores a 5.1 não podem processar tabelas compactadas.

* As tabelas compactadas não podem ser armazenadas no espaço de tabela do sistema `InnoDB`.

* Os espaços de tabelas gerais podem conter múltiplas tabelas, mas tabelas compactadas e não compactadas não podem coexistir no mesmo espaço de tabelas gerais.

* A compressão se aplica a uma tabela inteira e a todos os índices associados, e não a strings individuais, apesar do nome da cláusula `ROW_FORMAT`.

#### 14.9.1.3 Ajuste da compressão para tabelas InnoDB

Na maioria das vezes, as otimizações internas descritas em Armazenamento e Compressão de Dados do InnoDB garantem que o sistema funcione bem com dados comprimidos. No entanto, como a eficiência da compressão depende da natureza dos seus dados, você pode tomar decisões que afetam o desempenho das tabelas comprimidas:

* Quais tabelas comprimir. * Qual tamanho de página comprimida usar. * Se ajustar o tamanho do buffer de acordo com as características de desempenho em tempo de execução, como o tempo que o sistema gasta comprimindo e descomprimindo dados. Se a carga de trabalho é mais parecida com um armazém de dados (principalmente consultas) ou com um sistema OLTP (mix de consultas e DML).

* Se o sistema realizar operações de DML em tabelas compactadas e a forma como os dados são distribuídos levar a falhas de compressão caras no runtime, você pode ajustar opções de configuração avançada adicionais.

Utilize as diretrizes desta seção para ajudar a fazer essas escolhas arquitetônicas e de configuração. Quando estiver pronto para realizar testes de longo prazo e colocar as tabelas compactadas em produção, consulte a Seção 14.9.1.4, “Monitoramento da Compressão de Tabelas InnoDB em Tempo Real”, para formas de verificar a eficácia dessas escolhas em condições do mundo real.

##### Quando usar compressão

Em geral, a compressão funciona melhor em tabelas que incluem um número razoável de colunas de cadeia de caracteres e onde os dados são lidos muito mais frequentemente do que escritos. Como não há maneiras garantidas de prever se a compressão beneficia uma situação específica, sempre teste com uma carga de trabalho específica e um conjunto de dados em execução em uma configuração representativa. Considere os seguintes fatores ao decidir quais tabelas comprimir.

##### Características e compressão dos dados

Um fator determinante da eficiência da compressão na redução do tamanho dos arquivos de dados é a natureza dos próprios dados. Lembre-se de que a compressão funciona identificando strings repetidas de bytes em um bloco de dados. Dados completamente aleatórios são o caso mais ruim. Dados típicos geralmente têm valores repetidos, e, portanto, são comprimidos de forma eficaz. As cadeias de caracteres geralmente se comprimem bem, seja definidas nas colunas `CHAR`, `VARCHAR`, `TEXT` ou `BLOB`. Por outro lado, tabelas que contêm principalmente dados binários (inteiros ou números em ponto flutuante) ou dados que já foram comprimidos (por exemplo, imagens JPEG ou PNG) geralmente não se comprimem bem, significativamente ou de forma alguma.

Você escolhe se deseja ativar a compressão para cada tabela InnoDB. Uma tabela e todos seus índices usam o mesmo tamanho de página (comprimido). Pode ser que o índice primário (agrupado), que contém os dados de todas as colunas de uma tabela, comprima de forma mais eficaz do que os índices secundários. Nos casos em que há strings longas, o uso da compressão pode resultar no armazenamento de valores de coluna longos "fora da página", conforme discutido no Formato Dinâmico de String. Essas páginas de overflow podem comprimir bem. Dadas essas considerações, para muitas aplicações, algumas tabelas comprimem de forma mais eficaz do que outras, e você pode descobrir que sua carga de trabalho se sai melhor apenas com um subconjunto de tabelas comprimidas.

Para determinar se é ou não necessário comprimir uma tabela específica, realize experimentos. Você pode obter uma estimativa aproximada de quão eficientemente seus dados podem ser comprimidos usando uma ferramenta que implemente a compressão LZ77 (como `gzip` ou WinZip) em uma cópia do arquivo .ibd para uma tabela não comprimida. Você pode esperar menos compressão de uma tabela MySQL comprimida do que de ferramentas de compressão baseadas em arquivos, porque o MySQL comprime os dados em blocos com base no tamanho da página, 16 KB por padrão. Além dos dados do usuário, o formato da página inclui alguns dados internos do sistema que não são comprimidos. Ferramentas de compressão baseadas em arquivos podem examinar blocos de dados muito maiores, e assim podem encontrar mais strings repetidas em um arquivo enorme do que o MySQL pode encontrar em uma página individual.

Outra maneira de testar a compressão em uma tabela específica é copiar alguns dados da sua tabela não compactada para uma tabela semelhante, compactada (com todos os mesmos índices), em um espaço de tabela por arquivo e observar o tamanho do arquivo resultante `.ibd`. Por exemplo:

```sql
USE test;
SET GLOBAL innodb_file_per_table=1;
SET GLOBAL innodb_file_format=Barracuda;
SET GLOBAL autocommit=0;

-- Create an uncompressed table with a million or two rows.
CREATE TABLE big_table AS SELECT * FROM information_schema.columns;
INSERT INTO big_table SELECT * FROM big_table;
INSERT INTO big_table SELECT * FROM big_table;
INSERT INTO big_table SELECT * FROM big_table;
INSERT INTO big_table SELECT * FROM big_table;
INSERT INTO big_table SELECT * FROM big_table;
INSERT INTO big_table SELECT * FROM big_table;
INSERT INTO big_table SELECT * FROM big_table;
INSERT INTO big_table SELECT * FROM big_table;
INSERT INTO big_table SELECT * FROM big_table;
INSERT INTO big_table SELECT * FROM big_table;
COMMIT;
ALTER TABLE big_table ADD id int unsigned NOT NULL PRIMARY KEY auto_increment;

SHOW CREATE TABLE big_table\G

select count(id) from big_table;

-- Check how much space is needed for the uncompressed table.
\! ls -l data/test/big_table.ibd

CREATE TABLE key_block_size_4 LIKE big_table;
ALTER TABLE key_block_size_4 key_block_size=4 row_format=compressed;

INSERT INTO key_block_size_4 SELECT * FROM big_table;
commit;

-- Check how much space is needed for a compressed table
-- with particular compression settings.
\! ls -l data/test/key_block_size_4.ibd
```

Esse experimento produziu os seguintes números, que, claro, podem variar consideravelmente dependendo da estrutura da sua tabela e dos dados:

```sql
-rw-rw----  1 cirrus  staff  310378496 Jan  9 13:44 data/test/big_table.ibd
-rw-rw----  1 cirrus  staff  83886080 Jan  9 15:10 data/test/key_block_size_4.ibd
```

Para verificar se a compressão é eficiente para a sua carga de trabalho específica:

* Para testes simples, use uma instância do MySQL sem outras tabelas compactadas e execute consultas na tabela do esquema de informações `INNODB_CMP`.

* Para testes mais elaborados que envolvam cargas de trabalho com múltiplas tabelas compactadas, execute consultas na tabela do esquema de informações `INNODB_CMP_PER_INDEX`. Como as estatísticas na tabela `INNODB_CMP_PER_INDEX` são caras de coletar, você deve habilitar a opção de configuração `innodb_cmp_per_index_enabled` antes de fazer consultas nessa tabela, e você pode restringir esses testes a um servidor de desenvolvimento ou a um servidor de replica não crítico.

* Execute algumas declarações SQL típicas contra a tabela comprimida que você está testando.

* Examine a proporção de operações de compressão bem-sucedidas em relação às operações de compressão em geral, consultando a tabela do esquema de informações `INNODB_CMP` ou `INNODB_CMP_PER_INDEX`, e comparando `COMPRESS_OPS` com `COMPRESS_OPS_OK`.

* Se uma alta porcentagem de operações de compressão for concluída com sucesso, a tabela pode ser um bom candidato para compressão.

* Se você obtiver uma alta proporção de falhas de compressão, pode ajustar as opções `innodb_compression_level`, `innodb_compression_failure_threshold_pct` e `innodb_compression_pad_pct_max`, conforme descrito na Seção 14.9.1.6, “Compressão para cargas de trabalho OLTP”, e realizar mais testes.

##### Compressão de banco de dados versus compressão de aplicação

Decida se deseja comprimir os dados em sua aplicação ou na tabela; não use ambos os tipos de compressão para os mesmos dados. Quando você comprime os dados na aplicação e armazena os resultados em uma tabela comprimida, a economia de espaço extra é extremamente improvável, e a dupla compressão apenas desperdiça ciclos de CPU.

##### Compactação na Base de Dados

Quando ativado, a compressão de tabela MySQL é automática e se aplica a todas as colunas e valores de índice. As colunas ainda podem ser testadas com operadores como `LIKE`, e as operações de ordenação ainda podem usar índices mesmo quando os valores do índice estão comprimidos. Como os índices são frequentemente uma fração significativa do tamanho total de um banco de dados, a compressão pode resultar em economias significativas em armazenamento, I/O ou tempo de processador. As operações de compressão e descompressão ocorrem no servidor do banco de dados, que provavelmente é um sistema poderoso dimensionado para lidar com a carga esperada.

##### Compactação na Aplicação

Se você comprimir dados, como texto, em sua aplicação, antes de inseri-los no banco de dados, poderá economizar recursos em colunas que não se comprimem bem, comprimindo algumas colunas e não outras. Essa abordagem utiliza ciclos de CPU para compressão e descompactação na máquina do cliente, em vez do servidor do banco de dados, o que pode ser apropriado para uma aplicação distribuída com muitos clientes ou onde a máquina do cliente tem ciclos de CPU disponíveis.

##### Abordagem híbrida

Claro, é possível combinar essas abordagens. Para algumas aplicações, pode ser apropriado usar algumas tabelas compactadas e algumas tabelas não compactadas. Pode ser melhor comprimir externamente alguns dados (e armazená-los em tabelas não compactadas) e permitir que o MySQL comprima (algumas das) outras tabelas da aplicação. Como sempre, o projeto inicial e os testes na vida real são valiosos para tomar a decisão correta.

##### Características do Carregamento e Compressão

Além de escolher quais tabelas devem ser compactadas (e o tamanho da página), a carga de trabalho é outro fator determinante importante do desempenho. Se o aplicativo for dominado por leituras, em vez de atualizações, menos páginas precisam ser reorganizadas e recompactadas após a página do índice ficar sem espaço para o "registro de modificação por página" que o MySQL mantém para dados compactados. Se as atualizações predominantemente alterarem colunas não indexadas ou aquelas que contêm `BLOB`s ou grandes strings que, por acaso, sejam armazenadas "fora da página", o custo de compressão pode ser aceitável. Se as únicas alterações em uma tabela são `INSERT`s que usam uma chave primária monotinica e crescente, e há poucos índices secundários, há pouca necessidade de reorganizar e recompacetar páginas de índice. Como o MySQL pode "marcar para exclusão" e excluir strings em páginas compactadas "in loco" modificando dados não compactados, as operações `DELETE` em uma tabela são relativamente eficientes.

Para alguns ambientes, o tempo necessário para carregar os dados pode ser tão importante quanto a recuperação em tempo real. Especialmente em ambientes de data warehouse, muitas tabelas podem ser apenas de leitura ou de leitura predominantemente. Nesses casos, pode ou não ser aceitável pagar o preço da compressão em termos de tempo de carga aumentado, a menos que as economias resultantes em menos leituras em disco ou no custo de armazenamento sejam significativas.

Fundamentalmente, a compressão funciona melhor quando o tempo da CPU está disponível para comprimir e descomprimir dados. Assim, se sua carga de trabalho é limitada por I/O, e não por CPU, você pode descobrir que a compressão pode melhorar o desempenho geral. Ao testar o desempenho da sua aplicação com diferentes configurações de compressão, teste em uma plataforma semelhante à configuração planejada do sistema de produção.

##### Características de configuração e compressão

Ler e escrever páginas de banco de dados de e para o disco é o aspecto mais lento do desempenho do sistema. A compressão tenta reduzir o I/O usando tempo da CPU para comprimir e descomprimir dados, e é mais eficaz quando o I/O é um recurso relativamente escasso em comparação com os ciclos do processador.

Isso geralmente acontece especialmente quando se executa em um ambiente multiusuário com CPUs rápidas e multicore. Quando uma página de uma tabela compactada está na memória, o MySQL frequentemente usa memória adicional, tipicamente 16 KB, no pool de buffer para uma cópia não compactada da página. O algoritmo LRU adaptativo tenta equilibrar o uso da memória entre páginas compactadas e não compactadas para levar em conta se a carga de trabalho está sendo executada de forma dependente de I/O ou dependente de CPU. Ainda assim, uma configuração com mais memória dedicada ao pool de buffer tende a funcionar melhor ao usar tabelas compactadas do que uma configuração onde a memória é altamente restrita.

##### Escolhendo o Tamanho de Página Compressa

O ajuste ótimo do tamanho da página compactada depende do tipo e da distribuição dos dados que a tabela e seus índices contêm. O tamanho da página compactada deve sempre ser maior que o tamanho máximo do registro, ou as operações podem falhar, conforme observado na Compressão de Páginas de B-Tree.

Definir o tamanho de página comprimida como muito grande desperdiça um pouco de espaço, mas as páginas não precisam ser comprimidas com tanta frequência. Se o tamanho de página comprimida for definido como muito pequeno, as inserções ou atualizações podem exigir recompressão demorada, e os nós da árvore B podem ter que ser divididos com mais frequência, o que resulta em arquivos de dados maiores e em uma indexação menos eficiente.

Normalmente, você define o tamanho da página compactada para 8K ou 4K bytes. Dado que o tamanho máximo da string para uma tabela InnoDB é de cerca de 8K, `KEY_BLOCK_SIZE=8` é geralmente uma escolha segura.

#### 14.9.1.4 Monitoramento da Compressão de Tabelas InnoDB em Tempo Real

O desempenho geral do aplicativo, a utilização da CPU e da I/O e o tamanho dos arquivos do disco são bons indicadores de quão eficaz a compressão é para o seu aplicativo. Esta seção se baseia nos conselhos de ajuste de desempenho da Seção 14.9.1.3, “Ajustando a compressão para tabelas InnoDB”, e mostra como encontrar problemas que podem não aparecer durante o teste inicial.

Para investigar mais a fundo as considerações de desempenho para tabelas compactadas, você pode monitorar o desempenho da compactação em tempo de execução usando as tabelas do esquema de informações descritas no Exemplo 14.1, “Usando as tabelas do esquema de informações de compactação”. Essas tabelas refletem o uso interno de memória e as taxas de compactação usadas de forma geral.

A tabela `INNODB_CMP` relata informações sobre a atividade de compressão para cada tamanho de página comprimida (`KEY_BLOCK_SIZE`) em uso. As informações nessas tabelas são de âmbito sistêmico: resumem as estatísticas de compressão em todas as tabelas comprimidas em seu banco de dados. Você pode usar esses dados para ajudar a decidir se deve ou não comprimir uma tabela, examinando essas tabelas quando nenhuma outra tabela comprimida está sendo acessada. Isso envolve um custo relativamente baixo no servidor, então você pode consultar periodicamente em um servidor de produção para verificar a eficiência geral do recurso de compressão.

A tabela `INNODB_CMP_PER_INDEX` relata informações sobre a atividade de compressão para tabelas e índices individuais. Essas informações são mais direcionadas e mais úteis para avaliar a eficiência da compressão e diagnosticar problemas de desempenho uma tabela ou índice de cada vez. (Porque cada tabela `InnoDB` é representada como um índice agrupado, o MySQL não faz uma grande distinção entre tabelas e índices nesse contexto.) A tabela `INNODB_CMP_PER_INDEX` envolve um custo substancial, portanto, é mais adequada para servidores de desenvolvimento, onde você pode comparar os efeitos de diferentes cargas de trabalho, dados e configurações de compressão isoladamente. Para evitar impor esse custo de monitoramento acidentalmente, você deve habilitar a opção de configuração `innodb_cmp_per_index_enabled` antes de poder consultar a tabela `INNODB_CMP_PER_INDEX`.

As estatísticas principais a serem consideradas são o número e o tempo gasto realizando operações de compressão e descomprimentos. Como o MySQL divide os nós da árvore B quando eles estão muito cheios para conter os dados comprimidos após uma modificação, compare o número de operações de compressão "sucedidas" com o número total dessas operações. Com base nas informações nas tabelas `INNODB_CMP` e `INNODB_CMP_PER_INDEX` e no desempenho geral da aplicação e na utilização dos recursos de hardware, você pode fazer alterações na configuração do hardware, ajustar o tamanho do pool de buffers, escolher um tamanho de página diferente ou selecionar um conjunto diferente de tabelas para compressão.

Se o tempo de CPU necessário para a compressão e descomprimagem for elevado, mudar para CPUs mais rápidas ou multi-core pode ajudar a melhorar o desempenho com os mesmos dados, carga de trabalho da aplicação e conjunto de tabelas compactadas. Aumentar o tamanho do pool de buffer também pode ajudar no desempenho, de modo que mais páginas descomprimentadas possam permanecer na memória, reduzindo a necessidade de descomprimir páginas que existem na memória apenas em forma compactada.

Um grande número de operações de compressão no geral (comparado ao número de operações de `INSERT`, `UPDATE` e `DELETE` em sua aplicação e ao tamanho do banco de dados) pode indicar que algumas de suas tabelas comprimidas estão sendo atualizadas de forma excessiva para compressão eficaz. Se assim for, escolha um tamanho de página maior ou seja mais seletivo sobre quais tabelas você deseja comprimir.

Se o número de operações de compressão "sucesso" (`COMPRESS_OPS_OK`) for uma alta porcentagem do número total de operações de compressão (`COMPRESS_OPS`), então o sistema provavelmente está funcionando bem. Se a proporção for baixa, o MySQL está reorganizando, recomprimindo e dividindo os nós do B-tree com mais frequência do que o desejado. Neste caso, evite comprimir algumas tabelas, ou aumente `KEY_BLOCK_SIZE` para algumas das tabelas comprimidas. Você pode desativar a compressão para tabelas que causem que o número de "falhas de compressão" em sua aplicação seja mais de 1% ou 2% do total. (Tal índice de falha pode ser aceitável durante uma operação temporária, como uma carga de dados).

#### 14.9.1.5 Como a compressão funciona para tabelas InnoDB

Esta seção descreve alguns detalhes de implementação interna sobre compressão para tabelas InnoDB. As informações apresentadas aqui podem ser úteis para o ajuste de desempenho, mas não são necessárias para o uso básico de compressão.

##### Algoritmos de compressão

Alguns sistemas operacionais implementam compressão no nível do sistema de arquivos. Os arquivos são divididos em blocos de tamanho fixo, que são comprimidos em blocos de tamanho variável, o que facilmente leva à fragmentação. Toda vez que algo dentro de um bloco é modificado, o bloco inteiro é recomprimido antes de ser escrito no disco. Essas propriedades tornam essa técnica de compressão inadequada para uso em um sistema de banco de dados intensivo em atualizações.

O MySQL implementa a compressão com a ajuda da conhecida biblioteca zlib, que implementa o algoritmo de compressão LZ77. Este algoritmo de compressão é maduro, robusto e eficiente tanto na utilização da CPU quanto na redução do tamanho dos dados. O algoritmo é "sem perda", de modo que os dados originais não comprimidos sempre podem ser reconstruídos a partir da forma comprimida. A compressão LZ77 funciona encontrando sequências de dados que são repetidas dentro dos dados a serem comprimidos. Os padrões de valores nos seus dados determinam quão bem ele comprime, mas os dados típicos dos usuários geralmente comprimem em 50% ou mais.

Nota

Antes do MySQL 5.7.24, `InnoDB` suporta a biblioteca `zlib` até a versão 1.2.3. No MySQL 5.7.24 e versões posteriores, `InnoDB` suporta a biblioteca `zlib` até a versão 1.2.11.

Ao contrário da compressão realizada por uma aplicação ou das características de compressão de alguns outros sistemas de gerenciamento de banco de dados, a compressão do InnoDB aplica-se tanto aos dados do usuário quanto aos índices. Em muitos casos, os índices podem constituir de 40% a 50% ou mais do tamanho total do banco de dados, então essa diferença é significativa. Quando a compressão está funcionando bem para um conjunto de dados, o tamanho dos arquivos de dados do InnoDB (os arquivos do espaço de tabela por tabela ou espaço de tabela geral `.ibd`) é de 25% a 50% do tamanho não comprimido ou possivelmente menor. Dependendo da carga de trabalho, esse banco de dados menor pode, por sua vez, levar a uma redução no I/O e a um aumento no desempenho, a um custo modesto em termos de aumento da utilização da CPU. Você pode ajustar o equilíbrio entre o nível de compressão e o overhead da CPU modificando a opção de configuração `innodb_compression_level`.

##### Armazenamento e compressão de dados InnoDB

Todos os dados do usuário nas tabelas do InnoDB são armazenados em páginas que compõem um índice de árvore B (o índice agrupado). Em alguns outros sistemas de banco de dados, esse tipo de índice é chamado de "tabela organizada por índice". Cada string no nó do índice contém os valores da chave primária (especificada pelo usuário ou gerada pelo sistema) e todas as outras colunas da tabela.

Os índices secundários em tabelas InnoDB também são árvores B, contendo pares de valores: a chave do índice e um ponteiro para uma string no índice agrupado. O ponteiro é, na verdade, o valor da chave primária da tabela, que é usado para acessar o índice agrupado se forem necessárias colunas além da chave do índice e da chave primária. Os registros dos índices secundários devem sempre caber em uma única página da árvore B.

A compressão dos nós de árvore B (tanto de índices agrupados quanto de índices secundários) é tratada de maneira diferente da compressão das páginas de sobreposição usadas para armazenar as colunas longas `VARCHAR`, `BLOB` ou `TEXT`, conforme explicado nas seções a seguir.

##### Compressão de Páginas de B-Tree

Como elas são frequentemente atualizadas, as páginas de árvore B requerem um tratamento especial. É importante minimizar o número de vezes que os nós da árvore B são divididos, bem como a necessidade de descomprimir e recomprimi-los.

Uma técnica que o MySQL utiliza é manter algumas informações do sistema no nó da árvore B em forma descomprimida, facilitando assim certas atualizações no local. Por exemplo, isso permite que as strings sejam marcadas para exclusão e excluídas sem nenhuma operação de compressão.

Além disso, o MySQL tenta evitar a descomprimagem e a recomprimagem desnecessárias de páginas de índice quando elas são alteradas. Dentro de cada página de B-tree, o sistema mantém um "registro de modificação" não comprimido para registrar as alterações feitas na página. As atualizações e inserções de registros pequenos podem ser escritas neste registro de modificação sem exigir que toda a página seja completamente reconstruída.

Quando o espaço para o log de modificação esgota, o InnoDB descomprime a página, aplica as alterações e recomprime a página. Se a recompressão falhar (uma situação conhecida como falha de compressão), os nós da árvore B são divididos e o processo é repetido até que a atualização ou inserção seja bem-sucedida.

Para evitar falhas frequentes de compressão em cargas de trabalho intensivas de escrita, como as de aplicações OLTP, o MySQL às vezes reserva algum espaço vazio (buffer) na página, para que o log de modificação se preencha mais cedo e a página seja recompressa enquanto ainda há espaço suficiente para evitar a divisão. A quantidade de espaço de buffer restante em cada página varia à medida que o sistema mantém o controle da frequência de divisões de página. Em um servidor ocupado que realiza frequentes escritas em tabelas compactadas, você pode ajustar as opções de configuração `innodb_compression_failure_threshold_pct` e `innodb_compression_pad_pct_max` para ajustar esse mecanismo.

Geralmente, o MySQL exige que cada página B-tree em uma tabela InnoDB possa acomodar pelo menos dois registros. Para tabelas compactadas, esse requisito foi relaxado. As páginas de folha dos nós B-tree (seja da chave primária ou índices secundários) só precisam acomodar um registro, mas esse registro deve caber, em forma descompactada, no log de modificação por página. Se `innodb_strict_mode` é `ON`, o MySQL verifica o tamanho máximo da string durante `CREATE TABLE` ou `CREATE INDEX`. Se a string não caber, a seguinte mensagem de erro é emitida: `ERROR HY000: Too big row`.

Se você criar uma tabela quando `innodb_strict_mode` está DESATIVADO e uma declaração subsequente de `INSERT` ou `UPDATE` tenta criar uma entrada de índice que não cabe no tamanho da página compactada, a operação falha com `ERROR 42000: Row size too large`. (Esta mensagem de erro não nomeia o índice para o qual o registro é muito grande, nem menciona o comprimento do registro do índice ou o tamanho máximo do registro naquela página do índice específico). Para resolver esse problema, reconstrua a tabela com `ALTER TABLE` e selecione um tamanho de página compactada maior (`KEY_BLOCK_SIZE`), reduza quaisquer índices de prefixo de coluna ou desative a compressão completamente com `ROW_FORMAT=DYNAMIC` ou `ROW_FORMAT=COMPACT`.

`innodb_strict_mode` não é aplicável a tabelas gerais, que também suportam tabelas compactadas. As regras de gerenciamento de tabelasespaço para tabelas gerais são estritamente aplicadas independentemente de `innodb_strict_mode`. Para mais informações, consulte a Seção 13.1.19, “Declaração CREATE TABLESPACE”.

##### Compactação de colunas BLOB, VARCHAR e TEXT

Em uma tabela InnoDB, as colunas `BLOB`, `VARCHAR` e `TEXT` que não fazem parte da chave primária podem ser armazenadas em páginas de sobreposição alocadas separadamente. Essas colunas são chamadas de colunas fora da página. Seus valores são armazenados em listas de páginas de sobreposição com ligação simples.

Para tabelas criadas em `ROW_FORMAT=DYNAMIC` ou `ROW_FORMAT=COMPRESSED`, os valores das colunas `BLOB`, `TEXT` ou `VARCHAR` podem ser armazenados totalmente fora da página, dependendo de seu comprimento e do comprimento de toda a string. Para colunas que são armazenadas fora da página, o registro do índice agrupado contém apenas ponteiros de 20 bytes para as páginas de overflow, um por coluna. Se houver colunas armazenadas fora da página, depende do tamanho da página e do tamanho total da string. Quando a string é muito longa para caber inteiramente na página do índice agrupado, o MySQL escolhe as colunas mais longas para armazenamento fora da página até que a string se encaixe na página do índice agrupado. Como mencionado acima, se uma string não cabe por si só em uma página comprimida, ocorre um erro.

Nota

Para tabelas criadas em `ROW_FORMAT=DYNAMIC` ou `ROW_FORMAT=COMPRESSED`, as colunas `TEXT` e `BLOB` que têm menos de ou igual a 40 bytes são sempre armazenadas em string.

As tabelas criadas em versões mais antigas do MySQL utilizam o formato de arquivo Antelope, que suporta apenas `ROW_FORMAT=REDUNDANT` e `ROW_FORMAT=COMPACT`. Nesses formatos, o MySQL armazena os primeiros 768 bytes das colunas `BLOB`, `VARCHAR` e `TEXT` no registro do índice agrupado, juntamente com a chave primária. O prefixo de 768 bytes é seguido por um ponteiro de 20 bytes para as páginas de overflow que contêm o resto do valor da coluna.

Quando uma tabela está no formato `COMPRESSED`, todos os dados escritos em páginas de sobreposição são comprimidos “como estão”; ou seja, o MySQL aplica o algoritmo de compressão zlib ao item de dados inteiro. Além dos dados, as páginas de sobreposição comprimidas contêm um cabeçalho e um trailer não comprimidos que compreendem um checksum de página e um link para a próxima página de sobreposição, entre outras coisas. Portanto, é possível obter economias de armazenamento muito significativas para colunas mais longas `BLOB`, `TEXT` ou `VARCHAR` se os dados forem altamente compressivos, como é frequentemente o caso com dados de texto. Dados de imagem, como `JPEG`, geralmente já estão comprimidos e, portanto, não se beneficiam muito de serem armazenados em uma tabela comprimida; a compressão dupla pode desperdiçar ciclos de CPU para pouca ou nenhuma economia de espaço.

As páginas de sobreposição têm o mesmo tamanho que as outras páginas. Uma string que contém dez colunas armazenadas fora da página ocupa dez páginas de sobreposição, mesmo que o comprimento total das colunas seja apenas 8K bytes. Em uma tabela não compactada, dez páginas de sobreposição não compactadas ocupam 160K bytes. Em uma tabela compactada com um tamanho de página de 8K, elas ocupam apenas 80K bytes. Assim, é frequentemente mais eficiente usar o formato de tabela compactada para tabelas com valores de coluna longos.

Para espaços de tabela por arquivo, o uso de um tamanho de página compactada de 16 K pode reduzir os custos de armazenamento e de I/O para as colunas `BLOB`, `VARCHAR` ou `TEXT`, porque esses dados geralmente se comprimem bem e, portanto, podem exigir menos páginas de overflow, embora os próprios nós do B-tree ocupem tantas páginas quanto na forma descompactada. Os espaços de tabela gerais não suportam um tamanho de página compactada de 16 K (`KEY_BLOCK_SIZE`). Para mais informações, consulte a Seção 14.6.3.3, “Espaços de tabela gerais”.

##### Compressão e o Banco de Armazenamento de Armazenamento de Armazenamento InnoDB

Em uma tabela compactada `InnoDB`, cada página compactada (seja 1K, 2K, 4K ou 8K) corresponde a uma página não compactada de 16K bytes (ou um tamanho menor se `innodb_page_size` estiver definido). Para acessar os dados em uma página, o MySQL lê a página compactada do disco se ela não estiver já no buffer pool, e depois descompacta a página para sua forma original. Esta seção descreve como o `InnoDB` gerencia o buffer pool em relação a páginas de tabelas compactadas.

Para minimizar as operações de E/S e reduzir a necessidade de descomprimir uma página, às vezes, o conjunto de buffers contém tanto a forma comprimida quanto a não comprimida de uma página de banco de dados. Para dar espaço para outras páginas de banco de dados necessárias, o MySQL pode expulsar de um conjunto de buffers uma página não comprimida, deixando a página comprimida na memória. Ou, se uma página não tiver sido acessada há algum tempo, a forma comprimida da página pode ser escrita em disco, para liberar espaço para outros dados. Assim, em qualquer momento, o conjunto de buffers pode conter tanto as formas comprimida e não comprimida da página, ou apenas a forma comprimida da página, ou nenhuma das duas.

O MySQL mantém o controle de quais páginas devem ser mantidas na memória e quais devem ser eliminadas usando uma lista de menos recentemente usada (LRU), de modo que os dados quentes (acessados com frequência) tendem a permanecer na memória. Quando tabelas compactadas são acessadas, o MySQL utiliza um algoritmo LRU adaptativo para alcançar um equilíbrio apropriado entre páginas compactadas e não compactadas na memória. Este algoritmo adaptativo é sensível ao fato de que o sistema esteja executando de forma limitada por I/O ou por CPU. O objetivo é evitar gastar muito tempo de processamento para descompactar páginas quando a CPU está ocupada, e evitar fazer excesso de I/O quando a CPU tem ciclos disponíveis que podem ser usados para descompactar páginas compactadas (que podem já estar na memória). Quando o sistema está limitado por I/O, o algoritmo prefere eliminar a cópia não compactada de uma página em vez de ambas as cópias, para fazer mais espaço para outras páginas do disco se tornarem residentes na memória. Quando o sistema está limitado por CPU, o MySQL prefere eliminar ambas as páginas compactadas e não compactadas, para que mais memória possa ser usada para páginas "quentes" e reduzir a necessidade de descompactar dados na memória apenas em forma compactada.

##### Compressão e arquivos de registro InnoDB Redo

Antes de uma página compactada ser escrita em um arquivo de dados, o MySQL escreve uma cópia da página no log de refazer (se ela tiver sido recompactada desde a última vez que foi escrita no banco de dados). Isso é feito para garantir que os logs de refazer sejam utilizáveis para recuperação em caso de falha, mesmo no caso improvável de que a biblioteca `zlib` seja atualizada e que a mudança introduza um problema de compatibilidade com os dados compactados. Portanto, pode-se esperar um aumento no tamanho dos arquivos de log ou uma necessidade de verificações mais frequentes ao usar a compactação. A quantidade de aumento no tamanho do arquivo de log ou na frequência de verificação depende do número de vezes que páginas compactadas são modificadas de uma maneira que requer reorganização e recompactação.

As tabelas compactadas exigem o formato de arquivo Barracuda. Para criar uma tabela compactada em um espaço de tabela por arquivo, `innodb_file_per_table` deve ser habilitado e `innodb_file_format` deve ser definido como Barracuda. Não há dependência da configuração `innodb_file_format` ao criar uma tabela compactada em um espaço de tabela geral. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de Tabelas Gerais”. O produto MySQL Enterprise Backup suporta o formato de arquivo Barracuda.

#### 14.9.1.6 Compressão para cargas de trabalho OLTP

Tradicionalmente, o recurso de compressão `InnoDB` era recomendado principalmente para cargas de trabalho de leitura apenas ou de leitura predominantemente, como em uma configuração de armazém de dados. A ascensão dos dispositivos de armazenamento SSD, que são rápidos, mas relativamente pequenos e caros, torna a compressão atraente também para cargas de trabalho `OLTP`: sites de alto tráfego, interativos, podem reduzir seus requisitos de armazenamento e suas operações de E/S por segundo (IOPS) usando tabelas comprimidas com aplicativos que realizam operações frequentes de `INSERT`, `UPDATE` e `DELETE`.

As opções de configuração introduzidas no MySQL 5.6 permitem ajustar a forma como a compressão funciona para uma instância específica do MySQL, com ênfase no desempenho e na escalabilidade para operações intensivas de escrita:

* `innodb_compression_level` permite que você aumente ou reduza o grau de compressão. Um valor mais alto permite que você coloque mais dados em um dispositivo de armazenamento, às custas de mais sobrecarga de CPU durante a compressão. Um valor mais baixo permite que você reduza a sobrecarga de CPU quando o espaço de armazenamento não é crítico, ou você espera que os dados não sejam especialmente compressivos.

* `innodb_compression_failure_threshold_pct` especifica um ponto de corte para falhas de compressão durante atualizações em uma tabela comprimida. Quando esse limite é ultrapassado, o MySQL começa a deixar espaço livre adicional dentro de cada nova página comprimida, ajustando dinamicamente a quantidade de espaço livre até a porcentagem do tamanho da página especificada por `innodb_compression_pad_pct_max`

* `innodb_compression_pad_pct_max` permite ajustar a quantidade máxima de espaço reservado em cada página para registrar alterações em strings compactadas, sem precisar comprimir toda a página novamente. Quanto maior o valor, mais alterações podem ser registradas sem recomprimir a página. O MySQL utiliza uma quantidade variável de espaço livre para as páginas dentro de cada tabela compactada, apenas quando uma porcentagem designada de operações de compactação "fracassa" no runtime, exigindo uma operação cara para dividir a página compactada.

* `innodb_log_compressed_pages` permite desabilitar a escrita de imagens de páginas re-comprimidas no log de refazer. A recompressão pode ocorrer quando alterações são feitas em dados comprimidos. Esta opção é ativada por padrão para evitar corrupção que poderia ocorrer se uma versão diferente do algoritmo de compressão `zlib` for usada durante a recuperação. Se você tem certeza de que a versão `zlib` não é provável que mude, desabilite `innodb_log_compressed_pages` para reduzir a geração do log de refazer para cargas de trabalho que modificam dados comprimidos.

Como o trabalho com dados comprimidos às vezes envolve manter versões comprimidas e não comprimidas de uma página na memória ao mesmo tempo, ao usar compressão com uma carga de trabalho em estilo OLTP, esteja preparado para aumentar o valor da opção de configuração `innodb_buffer_pool_size`.

#### 14.9.1.7 Avisos e erros de sintaxe de compressão SQL

Esta seção descreve os avisos e erros de sintaxe que você pode encontrar ao usar o recurso de compressão de tabela com espaços de tabela por arquivo e espaços de tabela gerais.

Aviso e erros de sintaxe de compressão SQL para espaços de tabela por arquivo

Quando `innodb_strict_mode` está habilitado (o padrão), especificar `ROW_FORMAT=COMPRESSED` ou `KEY_BLOCK_SIZE` em declarações de `CREATE TABLE` ou `ALTER TABLE` produz o seguinte erro se `innodb_file_per_table` estiver desabilitado ou se `innodb_file_format` estiver definido como `Antelope` em vez de `Barracuda`.

```sql
ERROR 1031 (HY000): Table storage engine for 't1' does not have this option
```

Nota

A tabela não é criada se a configuração atual não permitir o uso de tabelas compactadas.

Quando o `innodb_strict_mode` é desativado, especificar o `ROW_FORMAT=COMPRESSED` ou o `KEY_BLOCK_SIZE` nas declarações do `CREATE TABLE` ou `ALTER TABLE` produz os seguintes avisos se o `innodb_file_per_table` estiver desativado.

```sql
mysql> SHOW WARNINGS;
+---------+------+---------------------------------------------------------------+
| Level   | Code | Message                                                       |
+---------+------+---------------------------------------------------------------+
| Warning | 1478 | InnoDB: KEY_BLOCK_SIZE requires innodb_file_per_table.        |
| Warning | 1478 | InnoDB: ignoring KEY_BLOCK_SIZE=4.                            |
| Warning | 1478 | InnoDB: ROW_FORMAT=COMPRESSED requires innodb_file_per_table. |
| Warning | 1478 | InnoDB: assuming ROW_FORMAT=DYNAMIC.                          |
+---------+------+---------------------------------------------------------------+
```

Avisos semelhantes são emitidos se `innodb_file_format` estiver definido como `Antelope`, em vez de `Barracuda`.

Nota

Essas mensagens são apenas avisos, não erros, e a tabela é criada sem compressão, como se as opções não fossem especificadas.

O comportamento “não estrito” permite que você importe um arquivo `mysqldump` em um banco de dados que não suporta tabelas compactadas, mesmo que o banco de dados de origem contenha tabelas compactadas. Nesse caso, o MySQL cria a tabela em `ROW_FORMAT=COMPACT` em vez de impedir a operação.

Para importar o arquivo de dump em um novo banco de dados e fazer com que as tabelas sejam recriadas conforme existem no banco de dados original, certifique-se de que o servidor tenha as configurações adequadas para os parâmetros de configuração `innodb_file_format` e `innodb_file_per_table`.

O atributo `KEY_BLOCK_SIZE` é permitido apenas quando `ROW_FORMAT` é especificado como `COMPRESSED` ou é omitido. Especificar um `KEY_BLOCK_SIZE` com qualquer outro `ROW_FORMAT` gera um aviso que você pode visualizar com `SHOW WARNINGS`. No entanto, a tabela não é compactada; o `KEY_BLOCK_SIZE` especificado é ignorado).

<table summary="Warning level, error code, and message text for messages that could be generated when using conflicting clauses for InnoDB table compression."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr> <th>Level</th> <th>Code</th> <th>Message</th> </tr></thead><tbody><tr> <th>Warning</th> <td>1478</td> <td><code> InnoDB: ignoring KEY_BLOCK_SIZE=<code>n</code> unless ROW_FORMAT=COMPRESSED. </code></td> </tr></tbody></table>

Se você estiver executando com `innodb_strict_mode` habilitado, a combinação de um `KEY_BLOCK_SIZE` com qualquer outro `ROW_FORMAT` que não seja `COMPRESSED` gera um erro, não um aviso, e a tabela não é criada.

A Tabela 14.6, “Opções ROW_FORMAT e KEY_BLOCK_SIZE”, fornece uma visão geral das opções `ROW_FORMAT` e `KEY_BLOCK_SIZE` que são usadas com `CREATE TABLE` ou `ALTER TABLE`.

**Tabela 14.6 Opções ROW_FORMAT e KEY_BLOCK_SIZE**

<table summary="ROW_FORMAT and KEY_BLOCK_SIZE option usage notes and descriptions."><col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>Option</th> <th>Usage Notes</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>ROW_FORMAT=​REDUNDANT</code></th> <td>Formato de armazenamento usado antes do MySQL 5.0.3</td> <td>Menos eficiente que<code>ROW_FORMAT=COMPACT</code>; para compatibilidade reversa</td> </tr><tr> <th><code>ROW_FORMAT=​COMPACT</code></th> <td>Formato de armazenamento padrão desde o MySQL 5.0.3</td> <td>Armazena um prefixo de 768 bytes de valores de coluna longa na página do índice agrupado, com os bytes restantes armazenados em uma página de overflow</td> </tr><tr> <th><code>ROW_FORMAT=​DYNAMIC</code></th> <td>Espaços de tabela por arquivo são necessários<code>innodb_file​_format=Barracuda</code></td> <td>Armazene valores dentro da página do índice agrupado, se cabem; caso contrário, armazene apenas um ponteiro de 20 bytes para uma página de sobreposição (sem prefixo)</td> </tr><tr> <th><code>ROW_FORMAT=​COMPRESSED</code></th> <td>Espaços de tabela por arquivo são necessários<code>innodb_file​_format=Barracuda</code></td> <td>Compreende a tabela e os índices usando zlib</td> </tr><tr> <th><code>KEY_BLOCK_​SIZE=<code>n</code></code></th> <td>File-per-table tablespaces require <code>innodb_file​_format=Barracuda</code></td> <td>Specifies compressed page size of 1, 2, 4, 8 or 16 kilobytes; implies <code>ROW_FORMAT=COMPRESSED</code>. For general tablespaces, a <code>KEY_BLOCK_SIZE</code> value equal to the <code>InnoDB</code> page size is not permitted.</td> </tr></tbody></table>

A Tabela 14.7, “Avisos e Erros de Criação/Alteração de Tabela quando o Modo Estrito InnoDB está DESATIVADO”, resume as condições de erro que ocorrem com certas combinações de parâmetros e opções de configuração nas declarações `CREATE TABLE` ou `ALTER TABLE`, e como as opções aparecem na saída de `SHOW TABLE STATUS`.

Quando `innodb_strict_mode` é `OFF`, o MySQL cria ou altera a tabela, mas ignora certos ajustes, conforme mostrado abaixo. Você pode ver as mensagens de aviso no registro de erro do MySQL. Quando `innodb_strict_mode` é `ON`, essas combinações especificadas de opções geram erros, e a tabela não é criada ou alterada. Para ver a descrição completa da condição de erro, execute a declaração `SHOW ERRORS`: exemplo:

```sql
mysql> CREATE TABLE x (id INT PRIMARY KEY, c INT)

-> ENGINE=INNODB KEY_BLOCK_SIZE=33333;

ERROR 1005 (HY000): Can't create table 'test.x' (errno: 1478)

mysql> SHOW ERRORS;
+-------+------+-------------------------------------------+
| Level | Code | Message                                   |
+-------+------+-------------------------------------------+
| Error | 1478 | InnoDB: invalid KEY_BLOCK_SIZE=33333.     |
| Error | 1005 | Can't create table 'test.x' (errno: 1478) |
+-------+------+-------------------------------------------+
```

**Tabela 14.7 Criar/alterar tabela Avisos e Erros quando o Modo Estrito InnoDB está DESATIVADO**

<table summary="CREATE and ALTER TABLE warnings and errors when InnoDB strict mode is OFF."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Sintaxe</th> <th>Condição de advertência ou erro</th> <th>Resultante<code>ROW_FORMAT</code>, conforme demonstrado em<code>SHOW TABLE STATUS</code></th> </tr></thead><tbody><tr> <th><code>ROW_FORMAT=REDUNDANT</code></th> <td>None</td> <td><code>REDUNDANT</code></td> </tr><tr> <th><code>ROW_FORMAT=COMPACT</code></th> <td>None</td> <td><code>COMPACT</code></td> </tr><tr> <th><code>ROW_FORMAT=COMPRESSED</code>ou<code>ROW_FORMAT=DYNAMIC</code>ou<code>KEY_BLOCK_SIZE</code>é especificado</th> <td>Ignorado para tabelas de espaço de arquivo por tabela, a menos que ambos<code>innodb_file_format</code><code>=Barracuda</code>e<code>innodb_file_per_table</code>As tabelas gerais são compatíveis com todos os formatos de string (com algumas restrições), independentemente<code>innodb_file_format</code>e<code>innodb_file_per_table</code>configurações. Veja a Seção 14.6.3.3, “Tabelas gerais”.</td> <td><code>the default row format for file-per-table tablespaces; the specified row format for general tablespaces</code></td> </tr><tr> <th>Inválido<code>KEY_BLOCK_SIZE</code>é especificado (não 1, 2, 4, 8 ou 16)</th> <td><code>KEY_BLOCK_SIZE</code>é ignorado</td> <td>o formato de string especificado, ou o formato de string padrão</td> </tr><tr> <th><code>ROW_FORMAT=COMPRESSED</code> and valid <code>KEY_BLOCK_SIZE</code> are specified</th> <td>None; <code>KEY_BLOCK_SIZE</code> specified is used</td> <td><code>COMPRESSED</code></td> </tr><tr> <th><code>KEY_BLOCK_SIZE</code>é especificado com<code>REDUNDANT</code>,<code>COMPACT</code>ou<code>DYNAMIC</code>formato de string</th> <td><code>KEY_BLOCK_SIZE</code>é ignorado</td> <td><code>REDUNDANT</code>,<code>COMPACT</code>ou<code>DYNAMIC</code></td> </tr><tr> <th><code>ROW_FORMAT</code>não é uma das<code>REDUNDANT</code>,<code>COMPACT</code>,<code>DYNAMIC</code>ou<code>COMPRESSED</code></th> <td>Ignorado se reconhecido pelo analisador MySQL. Caso contrário, um erro é emitido.</td> <td>o formato padrão da string ou N/A</td> </tr></tbody></table>

Quando `innodb_strict_mode` é `ON`, o MySQL rejeita os parâmetros inválidos `ROW_FORMAT` ou `KEY_BLOCK_SIZE` e emite erros. Quando `innodb_strict_mode` é `OFF`, o MySQL emite avisos em vez de erros para os parâmetros inválidos ignorados. `innodb_strict_mode` é `ON` por padrão.

Quando `innodb_strict_mode` é `ON`, o MySQL rejeita os parâmetros inválidos `ROW_FORMAT` ou `KEY_BLOCK_SIZE`. Para compatibilidade com versões anteriores do MySQL, o modo estrito não é ativado por padrão; em vez disso, o MySQL emite avisos (não erros) para parâmetros inválidos ignorados.

Não é possível ver o `KEY_BLOCK_SIZE` escolhido usando `SHOW TABLE STATUS`. A declaração `SHOW CREATE TABLE` exibe o `KEY_BLOCK_SIZE` (mesmo que tenha sido ignorado ao criar a tabela). O tamanho real da página comprimida da tabela não pode ser exibido pelo MySQL.

Aviso e erros de sintaxe de compressão SQL para espaços de tabela gerais

* Se `FILE_BLOCK_SIZE` não foi definido para o espaço de tabela geral quando o espaço de tabela foi criado, o espaço de tabela não pode conter tabelas comprimidas. Se você tentar adicionar uma tabela comprimida, um erro é retornado, conforme mostrado no exemplo a seguir:

  ```sql
  mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

  mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=COMPRESSED
         KEY_BLOCK_SIZE=8;
  ERROR 1478 (HY000): InnoDB: Tablespace `ts1` cannot contain a COMPRESSED table
  ```

* Tentar adicionar uma tabela com um `KEY_BLOCK_SIZE` inválido a um espaço de tabelas geral retorna um erro, conforme mostrado no exemplo a seguir:

  ```sql
  mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

  mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED
         KEY_BLOCK_SIZE=4;
  ERROR 1478 (HY000): InnoDB: Tablespace `ts2` uses block size 8192 and cannot
  contain a table with physical page size 4096
  ```

Para tabelas gerais, o `KEY_BLOCK_SIZE` da tabela deve ser igual ao `FILE_BLOCK_SIZE` do tablespace dividido por 1024. Por exemplo, se o `FILE_BLOCK_SIZE` do tablespace é 8192, o `KEY_BLOCK_SIZE` da tabela deve ser 8.

* Tentar adicionar uma tabela com um formato de string não compactada a um espaço de tabelas geral configurado para armazenar tabelas compactadas retorna um erro, conforme mostrado no exemplo a seguir:

  ```sql
  mysql> CREATE TABLESPACE `ts3` ADD DATAFILE 'ts3.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

  mysql> CREATE TABLE t3 (c1 INT PRIMARY KEY) TABLESPACE ts3 ROW_FORMAT=COMPACT;
  ERROR 1478 (HY000): InnoDB: Tablespace `ts3` uses block size 8192 and cannot
  contain a table with physical page size 16384
  ```

`innodb_strict_mode` não é aplicável a tabelas gerais. As regras de gerenciamento de tabelas para tabelas gerais são estritamente aplicadas independentemente de `innodb_strict_mode`. Para mais informações, consulte a Seção 13.1.19, “Declaração CREATE TABLESPACE”.

Para mais informações sobre o uso de tabelas compactadas com espaços de tabelas gerais, consulte a Seção 14.6.3.3, “Espaços de tabelas gerais”.

### 14.9.2 Compressão de página InnoDB

`InnoDB` suporta compressão de nível de página para tabelas que residem em espaços de tabela por arquivo. Esse recurso é referido como *Compressão de Página Transparente*. A compressão de página é habilitada especificando o atributo `COMPRESSION` com `CREATE TABLE` ou `ALTER TABLE`. Os algoritmos de compressão suportados incluem `Zlib` e `LZ4`.

#### Plataformas suportadas

A compressão de página requer suporte a arquivos esparsos e perfuração de buracos. A compressão de página é suportada no Windows com NTFS e nas seguintes subconjuntos de plataformas Linux suportadas pelo MySQL, onde o nível do kernel oferece suporte a perfuração de buracos:

* RHEL 7 e distribuições derivadas que utilizam a versão do kernel 3.10.0-123 ou superior

* OEL 5.10 (UEK2) versão do kernel 2.6.39 ou superior
* OEL 6.5 (UEK3) versão do kernel 3.8.13 ou superior
* OEL 7.0 versão do kernel 3.8.13 ou superior
* SLE11 versão do kernel 3.0-x
* SLE12 versão do kernel 3.12-x
* OES11 versão do kernel 3.0-x
* Ubuntu 14.0.4 LTS versão do kernel 3.13 ou superior
* Ubuntu 12.0.4 LTS versão do kernel 3.2 ou superior
* Debian 7 versão do kernel 3.2 ou superior

Nota

Todos os sistemas de arquivos disponíveis para uma determinada distribuição Linux podem não suportar perfuração.

#### Como funciona a compressão de página

Quando uma página é escrita, ela é comprimida usando o algoritmo de compressão especificado. Os dados comprimidos são escritos em disco, onde o mecanismo de perfuração de buracos libera blocos vazios do final da página. Se a compressão falhar, os dados são escritos como estão.

#### Tamanho do buraco de perfuração no Linux

Nos sistemas Linux, o tamanho do bloco do sistema de arquivos é o tamanho da unidade utilizado para perfuração de buracos. Portanto, a compressão de páginas só funciona se os dados das páginas puderem ser comprimidos para um tamanho que seja menor ou igual ao tamanho da página `InnoDB` menos o tamanho do bloco do sistema de arquivos. Por exemplo, se `innodb_page_size=16K` e o tamanho do bloco do sistema de arquivos é de 4K, os dados das páginas devem ser comprimidos para menos ou igual a 12K para permitir a perfuração de buracos.

#### Tamanho do buraco de perfuração em Windows

Nos sistemas Windows, a infraestrutura subjacente para arquivos esparsos é baseada na compressão NTFS. O tamanho do perfuração de buracos é a unidade de compressão NTFS, que é 16 vezes o tamanho do clúster NTFS. Os tamanhos dos clústeres e suas unidades de compressão são mostrados na tabela a seguir:

**Tabela 14.8 Tamanho do clúster NTFS e unidades de compressão dos Windows**

<table frame="all" summary="Windows NTFS cluster size and compression units."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Cluster Size</th> <th>Compression Unit</th> </tr></thead><tbody><tr> <td>512 Bytes</td> <td>8 KB</td> </tr><tr> <td>1 KB</td> <td>16 KB</td> </tr><tr> <td>2 KB</td> <td>32 KB</td> </tr><tr> <td>4 KB</td> <td>64 KB</td> </tr></tbody></table>

A compressão de página em sistemas Windows só funciona se os dados da página puderem ser comprimidos para um tamanho menor ou igual ao tamanho da página `InnoDB` menos o tamanho da unidade de compressão.

O tamanho padrão do clúster NTFS é de 4 KB, para o qual o tamanho da unidade de compressão é de 64 KB. Isso significa que a compressão de página não traz nenhum benefício para uma configuração pré-instalada do Windows NTFS, pois o tamanho máximo `innodb_page_size` também é de 64 KB.

Para que a compressão de páginas funcione no Windows, o sistema de arquivos deve ser criado com um tamanho de cluster menor que 4K, e o `innodb_page_size` deve ter pelo menos o dobro do tamanho da unidade de compressão. Por exemplo, para que a compressão de páginas funcione no Windows, você pode construir o sistema de arquivos com um tamanho de cluster de 512 bytes (que tem uma unidade de compressão de 8 KB) e inicializar o `InnoDB` com um valor de `innodb_page_size` de 16 K ou maior.

#### Habilitar a Compressão de Página

Para habilitar a compressão de página, especifique o atributo `COMPRESSION` na declaração `CREATE TABLE`. Por exemplo:

```sql
CREATE TABLE t1 (c1 INT) COMPRESSION="zlib";
```

Você também pode habilitar a compressão de página em uma declaração `ALTER TABLE`. No entanto, `ALTER TABLE ... COMPRESSION` atualiza apenas o atributo de compressão do tablespace. As escritas no tablespace que ocorrem após a definição do novo algoritmo de compressão usam o novo ajuste, mas para aplicar o novo algoritmo de compressão a páginas existentes, você deve reconstruir a tabela usando `OPTIMIZE TABLE`.

```sql
ALTER TABLE t1 COMPRESSION="zlib";
OPTIMIZE TABLE t1;
```

#### Desativando a Compressão de Página

Para desativar a compressão de páginas, configure `COMPRESSION=None` usando `ALTER TABLE`. As escritas nos espaços de tabela que ocorrem após a configuração de `COMPRESSION=None` não utilizam compressão de páginas. Para descomprimir páginas existentes, você deve reconstruir a tabela usando `OPTIMIZE TABLE` após a configuração de `COMPRESSION=None`.

```sql
ALTER TABLE t1 COMPRESSION="None";
OPTIMIZE TABLE t1;
```

#### Metadados de Compressão de Página

Os metadados de compressão de página são encontrados na tabela do esquema de informações `INNODB_SYS_TABLESPACES`, nas seguintes colunas:

* `FS_BLOCK_SIZE`: O tamanho do bloco do sistema de arquivos, que é o tamanho da unidade usado para perfuração de buracos.

* `FILE_SIZE`: O tamanho aparente do arquivo, que representa o tamanho máximo do arquivo, não comprimido.

* `ALLOCATED_SIZE`: O tamanho real do arquivo, que é a quantidade de espaço alocada no disco.

Nota

Nos sistemas semelhantes ao Unix, `ls -l tablespace_name.ibd` mostra o tamanho aparente do arquivo (equivalente a `FILE_SIZE`) em bytes. Para visualizar a quantidade real de espaço alocado no disco (equivalente a `ALLOCATED_SIZE`, use `du --block-size=1 tablespace_name.ibd`. A opção `--block-size=1` imprime o espaço alocado em bytes, em vez de blocos, para que possa ser comparado com a saída de `ls -l`.

Use `SHOW CREATE TABLE` para visualizar a configuração atual de compressão da página (`Zlib`, `Lz4` ou `None`). Uma tabela pode conter uma mistura de páginas com diferentes configurações de compressão.

No exemplo a seguir, os metadados de compressão de página para a tabela de funcionários são recuperados da tabela do esquema de informações `INNODB_SYS_TABLESPACES`.

```sql
# Create the employees table with Zlib page compression

CREATE TABLE employees (
    emp_no      INT             NOT NULL,
    birth_date  DATE            NOT NULL,
    first_name  VARCHAR(14)     NOT NULL,
    last_name   VARCHAR(16)     NOT NULL,
    gender      ENUM ('M','F')  NOT NULL,
    hire_date   DATE            NOT NULL,
    PRIMARY KEY (emp_no)
) COMPRESSION="zlib";

# Insert data (not shown)

# Query page compression metadata in INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES

mysql> SELECT SPACE, NAME, FS_BLOCK_SIZE, FILE_SIZE, ALLOCATED_SIZE FROM
       INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES WHERE NAME='employees/employees'\G
*************************** 1. row ***************************
SPACE: 45
NAME: employees/employees
FS_BLOCK_SIZE: 4096
FILE_SIZE: 23068672
ALLOCATED_SIZE: 19415040
```

Os metadados de compressão de página para a tabela de funcionários mostram que o tamanho aparente do arquivo é de 23068672 bytes, enquanto o tamanho real do arquivo (com compressão de página) é de 19415040 bytes. O tamanho do bloco do sistema de arquivos é de 4096 bytes, que é o tamanho do bloco usado para perfuração de buracos.

#### Identificando tabelas usando compressão de página

Para identificar as tabelas para as quais a compressão de página está habilitada, você pode consultar a coluna `CREATE_OPTIONS` da tabela do esquema de informações `TABLES` para tabelas definidas com o atributo `COMPRESSION`:

```sql
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, CREATE_OPTIONS FROM INFORMATION_SCHEMA.TABLES
       WHERE CREATE_OPTIONS LIKE '%COMPRESSION=%';
+------------+--------------+--------------------+
| TABLE_NAME | TABLE_SCHEMA | CREATE_OPTIONS     |
+------------+--------------+--------------------+
| employees  | test         | COMPRESSION="zlib" |
+------------+--------------+--------------------+
```

`SHOW CREATE TABLE` também mostra o atributo `COMPRESSION`, se utilizado.

#### Limitações de compressão de página e notas de uso

* A compressão de página é desativada se o tamanho do bloco do sistema de arquivos (ou tamanho da unidade de compressão no Windows) * 2 > `innodb_page_size`.

* A compactação de página não é suportada para tabelas que residem em espaços de tabela compartilhados, que incluem o espaço de tabela do sistema, o espaço de tabela temporário e os espaços de tabela gerais.

* A compressão de página não é suportada para espaços de tabela de registro de desfazer. * A compressão de página não é suportada para páginas de registro de refazer. * As páginas do R-tree, que são usadas para índices espaciais, não são comprimidas.

* As páginas que pertencem a tabelas compactadas (`ROW_FORMAT=COMPRESSED`) são deixadas como estão.

* Durante a recuperação, as páginas atualizadas são escritas em um formato descompactado.

* Carregar um espaço de tabela compactado em um servidor que não suporta o algoritmo de compactação utilizado causa um erro de E/S.

* Antes de fazer uma atualização para uma versão anterior do MySQL que não suporte compressão de página, descomprima as tabelas que utilizam o recurso de compressão de página. Para descomprimir uma tabela, execute `ALTER TABLE ... COMPRESSION=None` e `OPTIMIZE TABLE`.

Os espaços de tabela comprimidos por página podem ser copiados entre servidores Linux e Windows se o algoritmo de compressão utilizado estiver disponível em ambos os servidores.

* Para preservar a compressão de páginas ao mover um arquivo de espaço de tabela comprimido para uma página de um host para outro, é necessário um utilitário que preserve arquivos esparsos.

* A compressão de páginas melhor pode ser alcançada em hardware Fusion-io com NVMFS do que em outras plataformas, pois o NVMFS é projetado para aproveitar a funcionalidade de furo de punho.

* O uso da função de compressão de página com um tamanho de página `InnoDB` grande e um tamanho de bloco do sistema de arquivos relativamente pequeno pode resultar em amplificação de escrita. Por exemplo, um tamanho máximo de página `InnoDB` de 64 KB com um tamanho de bloco do sistema de arquivos de 4 KB pode melhorar a compressão, mas também pode aumentar a demanda pelo pool de buffer, levando a um aumento no I/O e potencial amplificação de escrita.