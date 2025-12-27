#### 17.9.1.3 Ajuste da Compressão para Tabelas InnoDB

Na maioria das vezes, as otimizações internas descritas no Armazenamento e Compressão de Dados do InnoDB garantem que o sistema funcione bem com dados comprimidos. No entanto, como a eficiência da compressão depende da natureza dos seus dados, você pode tomar decisões que afetam o desempenho das tabelas comprimidas:

* Quais tabelas comprimir.
* Qual tamanho de página comprimida usar.
* Se ajustar o tamanho do pool de buffers com base nas características de desempenho em tempo de execução, como a quantidade de tempo que o sistema gasta comprimindo e descomprimindo dados. Se a carga de trabalho é mais parecida com um armazém de dados (principalmente consultas) ou com um sistema OLTP (mistura de consultas e DML).

* Se o sistema realizar operações DML em tabelas comprimidas e a maneira como os dados são distribuídos levar a falhas de compressão caras em tempo de execução, você pode ajustar opções de configuração avançadas adicionais.

Use as diretrizes nesta seção para ajudar a tomar essas escolhas arquitetônicas e de configuração. Quando estiver pronto para realizar testes de longo prazo e colocar tabelas comprimidas em produção, consulte a Seção 17.9.1.4, “Monitoramento da Compressão de Tabelas InnoDB em Tempo de Execução” para maneiras de verificar a eficácia dessas escolhas em condições reais.

##### Quando Usar a Compressão

De forma geral, a compressão funciona melhor em tabelas que incluem um número razoável de colunas de strings de caracteres e onde os dados são lidos muito mais frequentemente do que escritos. Como não há maneiras garantidas de prever se a compressão trará benefícios para uma situação específica, sempre teste com uma carga de trabalho e conjunto de dados específicos em execução em uma configuração representativa. Considere os seguintes fatores ao decidir quais tabelas comprimir.

##### Características dos Dados e Compressão

Um fator determinante para a eficiência da compressão na redução do tamanho dos arquivos de dados é a natureza dos próprios dados. Lembre-se de que a compressão funciona identificando sequências repetidas de bytes em um bloco de dados. Dados completamente aleatórios são o pior caso. Dados típicos geralmente têm valores repetidos, e, portanto, são comprimidos de forma eficaz. Strings de caracteres geralmente se comprimem bem, seja definidas nas colunas `CHAR`, `VARCHAR`, `TEXT` ou `BLOB`. Por outro lado, tabelas que contêm principalmente dados binários (inteiros ou números de ponto flutuante) ou dados que já foram comprimidos (por exemplo, imagens JPEG ou PNG) geralmente não se comprimem bem, significativamente ou de forma alguma.

Você escolhe se deseja ativar a compressão para cada tabela InnoDB. Uma tabela e todos seus índices usam o mesmo tamanho de página (comprimido). Pode ser que o índice de chave primária (agrupado), que contém os dados de todas as colunas de uma tabela, comprima de forma mais eficaz do que os índices secundários. Para os casos em que existem linhas longas, o uso da compressão pode resultar no armazenamento de valores de coluna longos “fora da página”, conforme discutido no Formato de Linha Dinâmico. Essas páginas de excedente podem se comprimir bem. Dadas essas considerações, para muitas aplicações, algumas tabelas se comprimem de forma mais eficaz do que outras, e você pode descobrir que sua carga de trabalho funciona melhor apenas com um subconjunto de tabelas comprimidas.

Para determinar se é ou não conveniente comprimir uma tabela específica, realize experimentos. Você pode obter uma estimativa aproximada de quão eficientemente seus dados podem ser comprimidos usando uma ferramenta que implemente a compressão LZ77 (como `gzip` ou WinZip) em uma cópia do arquivo .ibd da tabela não comprimida. Você pode esperar uma compressão menor em uma tabela MySQL comprimida do que em ferramentas de compressão baseadas em arquivos, porque o MySQL comprime os dados em blocos com base no tamanho da página, 16 KB por padrão. Além dos dados do usuário, o formato da página inclui alguns dados internos do sistema que não são comprimidos. Ferramentas de compressão baseadas em arquivos podem examinar blocos de dados muito maiores, e, portanto, podem encontrar mais strings repetidas em um arquivo enorme do que o MySQL pode encontrar em uma página individual.

Outra maneira de testar a compressão em uma tabela específica é copiar alguns dados da sua tabela não comprimida para uma tabela semelhante e comprimida (com todos os mesmos índices) em um espaço de tabelas por arquivo e observar o tamanho do arquivo `.ibd` resultante. Por exemplo:

```
USE test;
SET GLOBAL innodb_file_per_table=1;
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

Esse experimento produziu os seguintes números, que, claro, podem variar consideravelmente dependendo da estrutura e dos dados da sua tabela:

```
-rw-rw----  1 cirrus  staff  310378496 Jan  9 13:44 data/test/big_table.ibd
-rw-rw----  1 cirrus  staff  83886080 Jan  9 15:10 data/test/key_block_size_4.ibd
```

Para ver se a compressão é eficiente para sua carga de trabalho específica:

* Para testes simples, use uma instância do MySQL sem outras tabelas comprimidas e execute consultas na tabela do Schema de Informações `INNODB_CMP`.

* Para testes mais elaborados que envolvam cargas de trabalho com múltiplas tabelas compactadas, execute consultas na tabela do Schema de Informações `INNODB_CMP_PER_INDEX`. Como as estatísticas na tabela `INNODB_CMP_PER_INDEX` são caras de coletar, você deve habilitar a opção de configuração `innodb_cmp_per_index_enabled` antes de fazer consultas nessa tabela, e você pode restringir esses testes a um servidor de desenvolvimento ou a um servidor de replica não crítico.

* Execute algumas instruções SQL típicas contra a tabela compactada que você está testando.

* Examine a proporção de operações de compactação bem-sucedidas em relação às operações de compactação no geral, fazendo consultas na `INFORMATION_SCHEMA.INNODB_CMP` ou `INFORMATION_SCHEMA.INNODB_CMP_PER_INDEX`, e comparando `COMPRESS_OPS` com `COMPRESS_OPS_OK`.

* Se uma alta porcentagem das operações de compactação forem concluídas com sucesso, a tabela pode ser um bom candidato para compactação.

* Se você obtiver uma alta proporção de falhas de compactação, você pode ajustar as opções `innodb_compression_level`, `innodb_compression_failure_threshold_pct` e `innodb_compression_pad_pct_max`, conforme descrito na Seção 17.9.1.6, “Compactação para Cargas de Trabalho OLTP”, e tentar mais testes.

##### Compactação de Banco de Dados versus Compactação de Aplicação

Decida se você deseja comprimir os dados em sua aplicação ou na tabela; não use ambos os tipos de compactação para os mesmos dados. Quando você compacta os dados na aplicação e armazena os resultados em uma tabela compactada, a economia de espaço extra é extremamente improvável, e a compactação dupla apenas desperdiça ciclos de CPU.

##### Compactação no Banco de Dados

Quando ativada, a compressão de tabelas MySQL é automática e se aplica a todas as colunas e valores de índice. As colunas ainda podem ser testadas com operadores como `LIKE`, e as operações de ordenação ainda podem usar índices, mesmo quando os valores do índice estão comprimidos. Como os índices muitas vezes representam uma fração significativa do tamanho total de um banco de dados, a compressão pode resultar em economias significativas em armazenamento, I/O ou tempo do processador. As operações de compressão e descomprimagem ocorrem no servidor do banco de dados, que provavelmente é um sistema poderoso dimensionado para lidar com a carga esperada.

##### Compressão na Aplicação

Se você comprometer dados, como texto, em sua aplicação, antes de inseri-los no banco de dados, você pode economizar overhead para dados que não se comprimem bem, comprimindo algumas colunas e não outras. Essa abordagem usa ciclos de CPU para compressão e descomprimagem na máquina cliente, em vez do servidor do banco de dados, o que pode ser apropriado para uma aplicação distribuída com muitos clientes ou onde a máquina cliente tem ciclos de CPU disponíveis.

##### Abordagem Híbrida

Claro, é possível combinar essas abordagens. Para algumas aplicações, pode ser apropriado usar algumas tabelas comprimidas e algumas tabelas não comprimidas. Pode ser melhor comprimir externamente alguns dados (e armazená-los em tabelas não comprimidas) e permitir que o MySQL comprima (algumas das) outras tabelas da aplicação. Como sempre, o design inicial e os testes na vida real são valiosos para tomar a decisão correta.

##### Características da Carga de Trabalho e Compressão

Além de escolher quais tabelas serão compactadas (e o tamanho da página), a carga de trabalho é outro fator determinante importante para o desempenho. Se o aplicativo for dominado por leituras, em vez de atualizações, será necessário reorganizar e recomprimir menos páginas após o índice ficar sem espaço para o "registro de modificação por página" que o MySQL mantém para os dados compactados. Se as atualizações alterarem predominantemente colunas não indexadas ou aquelas que contêm `BLOB`s ou strings grandes que estejam armazenadas "fora da página", o custo da compactação pode ser aceitável. Se as únicas alterações em uma tabela são `INSERT`s que usam uma chave primária monotonia e crescente, e há poucos índices secundários, há pouca necessidade de reorganizar e recomprimir páginas de índice. Como o MySQL pode "marcar para exclusão" e excluir linhas em páginas compactadas "in loco" modificando dados não compactados, as operações `DELETE` em uma tabela são relativamente eficientes.

Para alguns ambientes, o tempo necessário para carregar os dados pode ser tão importante quanto a recuperação em tempo de execução. Especialmente em ambientes de data warehouse, muitas tabelas podem ser apenas de leitura ou de leitura predominantemente. Nesses casos, pode ou não ser aceitável pagar o preço da compactação em termos de aumento do tempo de carregamento, a menos que as economias resultantes em menos leituras de disco ou no custo de armazenamento sejam significativas.

Fundamentalmente, a compactação funciona melhor quando o tempo de CPU está disponível para comprimir e descomprimir dados. Assim, se sua carga de trabalho for limitada por I/O, em vez de limitada por CPU, você pode descobrir que a compactação pode melhorar o desempenho geral. Ao testar o desempenho da sua aplicação com diferentes configurações de compactação, teste em uma plataforma semelhante à configuração planejada do sistema de produção.

##### Características da Configuração e Compactação

Ler e escrever páginas de banco de dados do disco para e do disco é o aspecto mais lento do desempenho do sistema. A compressão tenta reduzir o I/O usando o tempo da CPU para comprimir e descomprimir dados, e é mais eficaz quando o I/O é um recurso relativamente escasso em comparação com os ciclos do processador.

Isso geralmente acontece especialmente quando executado em um ambiente multiusuário com CPUs multi-core rápidas. Quando uma página de uma tabela comprimida está na memória, o MySQL muitas vezes usa memória adicional, tipicamente 16KB, no pool de buffers para uma cópia descomprimida da página. O algoritmo LRU adaptativo tenta equilibrar o uso da memória entre páginas comprimidas e descomprimidas para levar em conta se a carga de trabalho está sendo executada de forma limitada por I/O ou por CPU. Ainda assim, uma configuração com mais memória dedicada ao pool de buffers tende a funcionar melhor ao usar tabelas comprimidas do que uma configuração onde a memória é altamente restrita.

##### Escolhendo o Tamanho da Página Compressa

A configuração ótima do tamanho da página comprimida depende do tipo e da distribuição dos dados que a tabela e seus índices contêm. O tamanho da página comprimida deve ser sempre maior que o tamanho máximo do registro, ou as operações podem falhar, conforme observado na Compressão de Páginas de B-Tree.

Definir o tamanho da página comprimida muito grande desperdiça algum espaço, mas as páginas não precisam ser comprimidas tão frequentemente. Se o tamanho da página comprimida for definido muito pequeno, as inserções ou atualizações podem exigir recompressão demorada, e os nós do B-Tree podem ter que ser divididos com mais frequência, levando a arquivos de dados maiores e indexação menos eficiente.

Tipicamente, você define o tamanho da página comprimida para 8K ou 4K bytes. Dado que o tamanho máximo da linha para uma tabela InnoDB é de cerca de 8K, `KEY_BLOCK_SIZE=8` é geralmente uma escolha segura.