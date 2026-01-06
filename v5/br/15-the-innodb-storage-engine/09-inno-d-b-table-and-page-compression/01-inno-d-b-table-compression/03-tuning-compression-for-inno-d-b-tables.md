#### 14.9.1.3 Ajuste da compressão para tabelas InnoDB

Na maioria das vezes, as otimizações internas descritas no Armazenamento e Compressão de Dados do InnoDB garantem que o sistema funcione bem com dados comprimidos. No entanto, como a eficiência da compressão depende da natureza dos seus dados, você pode tomar decisões que afetam o desempenho das tabelas comprimidas:

- Quais tabelas comprimir.

- Qual tamanho de página comprimida usar.

- Se ajustar o tamanho do pool de buffer com base nas características de desempenho em tempo de execução, como a quantidade de tempo que o sistema gasta comprimindo e descomprimindo dados. Se a carga de trabalho é mais parecida com um data warehouse (principalmente consultas) ou com um sistema OLTP (mistura de consultas e DML).

- Se o sistema realizar operações de DML em tabelas compactadas e a forma como os dados são distribuídos levar a falhas de compactação caras durante a execução, você pode ajustar opções de configuração avançadas adicionais.

Use as diretrizes nesta seção para ajudar a tomar essas decisões arquitetônicas e de configuração. Quando estiver pronto para realizar testes de longo prazo e colocar tabelas compactadas em produção, consulte a Seção 14.9.1.4, “Monitoramento da Compressão de Tabelas InnoDB em Tempo Real”, para maneiras de verificar a eficácia dessas escolhas em condições reais.

##### Quando usar compressão

Em geral, a compressão funciona melhor em tabelas que incluem um número razoável de colunas de cadeias de caracteres e onde os dados são lidos muito mais frequentemente do que são escritos. Como não há maneiras garantidas de prever se a compressão trará benefícios para uma situação específica, sempre teste com uma carga de trabalho e um conjunto de dados específicos em uma configuração representativa. Considere os seguintes fatores ao decidir quais tabelas comprimir.

##### Características e compressão de dados

Um fator determinante da eficiência da compressão na redução do tamanho dos arquivos de dados é a natureza dos próprios dados. Lembre-se de que a compressão funciona identificando sequências repetidas de bytes em um bloco de dados. Dados completamente aleatórios são o pior caso. Dados típicos geralmente têm valores repetidos, e, portanto, são comprimidos de forma eficaz. Strings de caracteres geralmente se comprimem bem, seja definidas nas colunas `CHAR`, `VARCHAR`, `TEXT` ou `BLOB`. Por outro lado, tabelas que contêm principalmente dados binários (inteiros ou números de ponto flutuante) ou dados que já foram comprimidos (por exemplo, imagens JPEG ou PNG) geralmente não se comprimem bem, significativamente ou de forma alguma.

Você escolhe se deseja ativar a compressão para cada tabela InnoDB. Uma tabela e todos seus índices usam o mesmo tamanho de página (comprimido). Pode ser que o índice de chave primária (agrupado), que contém os dados de todas as colunas de uma tabela, comprima de forma mais eficaz do que os índices secundários. Para os casos em que existem linhas longas, o uso da compressão pode resultar no armazenamento de valores de coluna longos "fora da página", conforme discutido no Formato de Linha Dinâmico. Essas páginas de excedente podem ser comprimidas bem. Dadas essas considerações, para muitas aplicações, algumas tabelas comprimem de forma mais eficaz do que outras, e você pode descobrir que sua carga de trabalho funciona melhor apenas com um subconjunto de tabelas comprimidas.

Para determinar se uma tabela específica deve ou não ser compactada, realize experimentos. Você pode obter uma estimativa aproximada de quão eficientemente seus dados podem ser compactados usando uma ferramenta que implemente a compressão LZ77 (como `gzip` ou WinZip) em uma cópia do arquivo .ibd para uma tabela não compactada. Você pode esperar menos compressão de uma tabela compactada do MySQL do que de ferramentas de compressão baseadas em arquivos, porque o MySQL compacta os dados em blocos com base no tamanho da página, 16 KB por padrão. Além dos dados do usuário, o formato da página inclui alguns dados internos do sistema que não são compactados. Ferramentas de compressão baseadas em arquivos podem examinar blocos de dados muito maiores, e, portanto, podem encontrar mais strings repetidas em um arquivo enorme do que o MySQL pode encontrar em uma página individual.

Outra maneira de testar a compressão em uma tabela específica é copiar alguns dados da sua tabela não compactada para uma tabela semelhante, compactada (com todos os mesmos índices), em um espaço de tabela por arquivo e observar o tamanho do arquivo `.ibd` resultante. Por exemplo:

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

- Para testes simples, use uma instância do MySQL sem outras tabelas compactadas e execute consultas na tabela do esquema de informações `INNODB_CMP`.

- Para testes mais elaborados que envolvam cargas de trabalho com múltiplas tabelas compactadas, execute consultas na tabela do esquema de informações `INNODB_CMP_PER_INDEX`. Como as estatísticas na tabela `INNODB_CMP_PER_INDEX` são caras de coletar, você deve habilitar a opção de configuração `innodb_cmp_per_index_enabled` antes de fazer consultas nessa tabela, e você pode restringir esses testes a um servidor de desenvolvimento ou a um servidor de replica não crítico.

- Execute algumas instruções SQL típicas contra a tabela compactada que você está testando.

- Examine a proporção de operações de compressão bem-sucedidas em relação às operações de compressão no geral, consultando a tabela do esquema de informações `INNODB_CMP` ou `INNODB_CMP_PER_INDEX`, e comparando `COMPRESS_OPS` com `COMPRESS_OPS_OK`.

- Se uma alta porcentagem de operações de compressão for concluída com sucesso, a tabela pode ser um bom candidato para compressão.

- Se você obtiver uma alta proporção de falhas de compressão, você pode ajustar as opções `innodb_compression_level`, `innodb_compression_failure_threshold_pct` e `innodb_compression_pad_pct_max`, conforme descrito na Seção 14.9.1.6, “Compressão para cargas de trabalho OLTP”, e realizar mais testes.

##### Compressão de banco de dados versus compressão de aplicação

Decida se deseja comprimir os dados em sua aplicação ou na tabela; não use ambos os tipos de compressão para os mesmos dados. Quando você comprime os dados na aplicação e armazena os resultados em uma tabela comprimida, a economia de espaço extra é extremamente improvável, e a compressão dupla apenas desperdiça ciclos de CPU.

##### Compressão na Base de Dados

Quando ativada, a compressão de tabelas MySQL é automática e se aplica a todas as colunas e valores de índice. As colunas ainda podem ser testadas com operadores como `LIKE`, e as operações de ordenação ainda podem usar índices, mesmo quando os valores do índice estão comprimidos. Como os índices muitas vezes representam uma fração significativa do tamanho total de um banco de dados, a compressão pode resultar em economias significativas em armazenamento, I/O ou tempo de processador. As operações de compressão e descomprimagem ocorrem no servidor do banco de dados, que provavelmente é um sistema poderoso dimensionado para lidar com a carga esperada.

##### Compressão na Aplicação

Se você comprimir dados, como texto, em sua aplicação antes de inseri-los no banco de dados, poderá economizar recursos em colunas que não se comprimem bem ao comprimir outras. Essa abordagem utiliza ciclos de CPU para compressão e descompactação na máquina do cliente, em vez do servidor do banco de dados, o que pode ser apropriado para uma aplicação distribuída com muitos clientes ou quando a máquina do cliente tem ciclos de CPU disponíveis.

##### Abordagem híbrida

Claro, é possível combinar essas abordagens. Para algumas aplicações, pode ser apropriado usar algumas tabelas compactadas e outras não compactadas. Pode ser melhor comprimir externamente alguns dados (e armazená-los em tabelas não compactadas) e permitir que o MySQL comprima (algumas das) outras tabelas da aplicação. Como sempre, o planejamento inicial e os testes práticos são valiosos para tomar a decisão correta.

##### Características da carga de trabalho e compressão

Além de escolher quais tabelas serão compactadas (e o tamanho da página), a carga de trabalho é outro fator determinante para o desempenho. Se o aplicativo for dominado por leituras, em vez de atualizações, será necessário reorganizar e recomprimir menos páginas após o índice ficar sem espaço para o "registro de modificação por página" que o MySQL mantém para os dados compactados. Se as atualizações alterarem predominantemente colunas não indexadas ou aquelas que contêm `BLOB`s ou grandes strings que estejam armazenadas "fora da página", o custo de compressão pode ser aceitável. Se as únicas alterações em uma tabela são `INSERT`s que usam uma chave primária monotonia e crescente, e há poucos índices secundários, há pouca necessidade de reorganizar e recomprimir páginas de índice. Como o MySQL pode "marcar para exclusão" e excluir linhas em páginas compactadas "in loco" modificando dados não compactados, as operações `DELETE` em uma tabela são relativamente eficientes.

Para alguns ambientes, o tempo necessário para carregar os dados pode ser tão importante quanto a recuperação durante a execução. Especialmente em ambientes de data warehouse, muitas tabelas podem ser apenas de leitura ou de leitura predominante. Nesses casos, pode ou não ser aceitável pagar o preço da compressão em termos de aumento do tempo de carga, a menos que as economias resultantes em menos leituras de disco ou no custo de armazenamento sejam significativas.

Fundamentalmente, a compressão funciona melhor quando o tempo da CPU está disponível para comprimir e descomprimir dados. Portanto, se sua carga de trabalho for mais voltada para operações de entrada/saída (I/O) do que para a CPU, você pode descobrir que a compressão pode melhorar o desempenho geral. Ao testar o desempenho da sua aplicação com diferentes configurações de compressão, teste em uma plataforma semelhante à configuração planejada do sistema de produção.

##### Características de Configuração e Compressão

Ler e escrever páginas de banco de dados do disco para e do disco para é o aspecto mais lento do desempenho do sistema. A compressão tenta reduzir o I/O usando o tempo da CPU para comprimir e descomprimir dados, e é mais eficaz quando o I/O é um recurso relativamente escasso em comparação com os ciclos do processador.

Isso geralmente acontece especialmente quando se executa em um ambiente multiusuário com CPUs multi-core rápidas. Quando uma página de uma tabela compactada está na memória, o MySQL frequentemente utiliza memória adicional, tipicamente 16 KB, no pool de buffers para uma cópia não compactada da página. O algoritmo LRU adaptativo tenta equilibrar o uso da memória entre páginas compactadas e não compactadas para levar em conta se a carga de trabalho está sendo executada de forma I/O-bound ou CPU-bound. Ainda assim, uma configuração com mais memória dedicada ao pool de buffers tende a funcionar melhor ao usar tabelas compactadas do que uma configuração onde a memória é altamente restrita.

##### Escolher o tamanho de página comprimida

O tamanho ótimo da página compactada depende do tipo e da distribuição dos dados que a tabela e seus índices contêm. O tamanho da página compactada deve ser sempre maior que o tamanho máximo do registro, caso contrário, as operações podem falhar, conforme mencionado na Compressão de Páginas B-Tree.

Definir o tamanho da página comprimida como muito grande desperdiça um pouco de espaço, mas as páginas não precisam ser comprimidas com tanta frequência. Se o tamanho da página comprimida for definido como muito pequeno, as inserções ou atualizações podem exigir recompressão demorada, e os nós da árvore B podem ter que ser divididos com mais frequência, levando a arquivos de dados maiores e uma indexação menos eficiente.

Normalmente, você define o tamanho da página compactada para 8K ou 4K bytes. Dado que o tamanho máximo da linha para uma tabela InnoDB é de cerca de 8K, `KEY_BLOCK_SIZE=8` é geralmente uma escolha segura.
