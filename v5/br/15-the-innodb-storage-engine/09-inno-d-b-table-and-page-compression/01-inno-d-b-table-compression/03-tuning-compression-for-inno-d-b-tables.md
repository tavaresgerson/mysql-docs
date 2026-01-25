#### 14.9.1.3 Ajustando a Compressão para Tabelas InnoDB

Na maioria das vezes, as otimizações internas descritas em Armazenamento e Compressão de Dados InnoDB garantem que o sistema funcione bem com dados compactados. No entanto, como a eficiência da compressão depende da natureza dos seus dados, você pode tomar decisões que afetam a *performance* de tabelas compactadas:

* Quais tabelas compactar.
* Qual tamanho de página compactada usar.
* Se deve ajustar o tamanho do *Buffer Pool* com base nas características de *performance* em tempo de execução (*runtime*), como a quantidade de tempo que o sistema gasta compactando e descompactando dados. Se a *workload* se assemelha mais a um *data warehouse* (principalmente *Queries*) ou a um sistema *OLTP* (combinação de *Queries* e *DML*).

* Se o sistema realiza operações *DML* em tabelas compactadas, e a maneira como os dados são distribuídos leva a falhas de compressão caras em tempo de execução, você pode ajustar opções de configuração avançadas adicionais.

Use as diretrizes nesta seção para ajudar a fazer essas escolhas arquitetônicas e de configuração. Quando estiver pronto para realizar testes de longo prazo e colocar tabelas compactadas em produção, consulte a Seção 14.9.1.4, “Monitoramento da Compressão de Tabela InnoDB em Tempo de Execução” para maneiras de verificar a eficácia dessas escolhas em condições reais.

##### Quando Usar Compressão

Em geral, a compressão funciona melhor em tabelas que incluem um número razoável de colunas de *string* de caracteres e onde os dados são lidos com muito mais frequência do que são escritos. Como não há maneiras garantidas de prever se a compressão beneficia ou não uma situação específica, teste sempre com uma *workload* e um *data set* específicos, rodando em uma configuração representativa. Considere os seguintes fatores ao decidir quais tabelas compactar.

##### Características dos Dados e Compressão

Um fator determinante chave da eficiência da compressão na redução do tamanho dos arquivos de dados é a natureza dos próprios dados. Lembre-se de que a compressão funciona identificando *strings* de *bytes* repetidas em um bloco de dados. Dados completamente aleatórios representam o pior caso. Dados típicos geralmente têm valores repetidos e, portanto, compactam-se de forma eficaz. *Strings* de caracteres geralmente compactam bem, sejam elas definidas em colunas `CHAR`, `VARCHAR`, `TEXT` ou `BLOB`. Por outro lado, tabelas contendo principalmente dados binários (*integers* ou *floating point numbers*) ou dados que já foram compactados (por exemplo, imagens *JPEG* ou *PNG*) geralmente podem não compactar bem, de forma significativa ou em nada.

Você escolhe se deseja ativar a compressão para cada tabela InnoDB. Uma tabela e todos os seus *Indexes* usam o mesmo tamanho de página (compactada). Pode ser que o *Index* da *Primary Key* (*clustered*), que contém os dados de todas as colunas de uma tabela, se comprima de forma mais eficaz do que os *Indexes* secundários. Para os casos em que há linhas longas, o uso de compressão pode resultar em valores de coluna longos sendo armazenados “fora da página” (*off-page*), conforme discutido em Formato de Linha DYNAMIC. Essas páginas de *overflow* podem compactar bem. Dadas estas considerações, para muitas aplicações, algumas tabelas compactam de forma mais eficaz do que outras, e você pode descobrir que sua *workload* tem melhor *performance* apenas com um subconjunto de tabelas compactadas.

Para determinar se deve ou não compactar uma tabela específica, realize experimentos. Você pode obter uma estimativa aproximada de quão eficientemente seus dados podem ser compactados usando um *utility* que implementa compressão LZ77 (como `gzip` ou WinZip) em uma cópia do arquivo `.ibd` para uma tabela não compactada. Você pode esperar menos compressão de uma tabela compactada MySQL do que de ferramentas de compressão baseadas em arquivo, porque o MySQL compacta dados em blocos com base no tamanho da página (*page size*), 16KB por padrão. Além dos dados do usuário, o formato da página inclui alguns dados de sistema internos que não são compactados. Utilitários de compressão baseados em arquivo podem examinar blocos de dados muito maiores e, portanto, podem encontrar mais *strings* repetidas em um arquivo enorme do que o MySQL pode encontrar em uma página individual.

Outra maneira de testar a compressão em uma tabela específica é copiar alguns dados de sua tabela não compactada para uma tabela compactada semelhante (tendo todos os mesmos *Indexes*) em um *tablespace* *file-per-table* e verificar o tamanho do arquivo `.ibd` resultante. Por exemplo:

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

Este experimento produziu os seguintes números, que, é claro, podem variar consideravelmente dependendo da estrutura da sua tabela e dos seus dados:

```sql
-rw-rw----  1 cirrus  staff  310378496 Jan  9 13:44 data/test/big_table.ibd
-rw-rw----  1 cirrus  staff  83886080 Jan  9 15:10 data/test/key_block_size_4.ibd
```

Para ver se a compressão é eficiente para sua *workload* específica:

* Para testes simples, use uma instância MySQL sem outras tabelas compactadas e execute *Queries* na tabela `INNODB_CMP` do *Information Schema*.

* Para testes mais elaborados envolvendo *workloads* com múltiplas tabelas compactadas, execute *Queries* na tabela `INNODB_CMP_PER_INDEX` do *Information Schema*. Como as estatísticas na tabela `INNODB_CMP_PER_INDEX` são caras de coletar, você deve habilitar a opção de configuração `innodb_cmp_per_index_enabled` antes de consultar essa tabela, e você pode restringir tal teste a um servidor de desenvolvimento ou a um servidor de réplica não crítico.

* Execute algumas instruções *SQL* típicas na tabela compactada que você está testando.

* Examine a proporção de operações de compressão bem-sucedidas em relação ao total de operações de compressão consultando a tabela `INNODB_CMP` ou `INNODB_CMP_PER_INDEX` do *Information Schema* e comparando `COMPRESS_OPS` com `COMPRESS_OPS_OK`.

* Se uma alta porcentagem das operações de compressão for concluída com sucesso, a tabela pode ser uma boa candidata à compressão.

* Se você obtiver uma alta proporção de falhas de compressão, você pode ajustar as opções `innodb_compression_level`, `innodb_compression_failure_threshold_pct` e `innodb_compression_pad_pct_max`, conforme descrito na Seção 14.9.1.6, “Compressão para *Workloads OLTP*”, e tentar testes adicionais.

##### Compressão de Database versus Compressão de Aplicação

Decida se deve compactar os dados em sua aplicação ou na tabela; não use ambos os tipos de compressão para os mesmos dados. Quando você compacta os dados na aplicação e armazena os resultados em uma tabela compactada, é extremamente improvável obter economia de espaço extra, e a dupla compressão apenas desperdiça ciclos de *CPU*.

##### Compactando no Database

Quando habilitada, a compressão de tabela MySQL é automática e se aplica a todas as colunas e valores de *Index*. As colunas ainda podem ser testadas com operadores como `LIKE`, e as operações de ordenação ainda podem usar *Indexes*, mesmo quando os valores de *Index* estão compactados. Como os *Indexes* geralmente são uma fração significativa do tamanho total de um *Database*, a compressão pode resultar em economias significativas de armazenamento, *I/O* ou tempo de processador. As operações de compressão e descompressão ocorrem no *server* do *Database*, que provavelmente é um sistema poderoso dimensionado para lidar com a carga esperada.

##### Compactando na Aplicação

Se você compactar dados como texto em sua aplicação, antes de serem inseridos no *Database*, você pode economizar *overhead* para dados que não compactam bem, comprimindo algumas colunas e não outras. Essa abordagem usa ciclos de *CPU* para compressão e descompressão na máquina *client*, em vez do *server* do *Database*, o que pode ser apropriado para uma aplicação distribuída com muitos *clients*, ou onde a máquina *client* tem ciclos de *CPU* sobressalentes.

##### Abordagem Híbrida

Obviamente, é possível combinar essas abordagens. Para algumas aplicações, pode ser apropriado usar algumas tabelas compactadas e algumas tabelas não compactadas. Pode ser melhor compactar externamente alguns dados (e armazená-los em tabelas não compactadas) e permitir que o MySQL comprima (algumas das) outras tabelas na aplicação. Como sempre, o design inicial e os testes na vida real são valiosos para chegar à decisão correta.

##### Características da Workload e Compressão

Além de escolher quais tabelas compactar (e o tamanho da página), a *workload* é outro fator determinante chave da *performance*. Se a aplicação for dominada por leituras, em vez de *updates*, menos páginas precisarão ser reorganizadas e recompactadas depois que a página do *Index* ficar sem espaço para o "log de modificação" por página que o MySQL mantém para dados compactados. Se os *updates* predominantemente alterarem colunas não indexadas ou aquelas que contenham `BLOBs` ou *strings* grandes que porventura estejam armazenadas “fora da página” (*off-page*), o *overhead* da compressão pode ser aceitável. Se as únicas alterações em uma tabela forem `INSERTs` que usam uma *Primary Key* que aumenta monotonicamente, e houver poucos *Indexes* secundários, há pouca necessidade de reorganizar e recompactar as páginas de *Index*. Uma vez que o MySQL pode “marcar para exclusão” (*delete-mark*) e excluir linhas em páginas compactadas “in place” modificando dados não compactados, as operações `DELETE` em uma tabela são relativamente eficientes.

Para alguns ambientes, o tempo que leva para carregar dados pode ser tão importante quanto a recuperação em tempo de execução. Especialmente em ambientes de *data warehouse*, muitas tabelas podem ser somente leitura ou predominantemente leitura (*read-mostly*). Nesses casos, pode ser ou não aceitável pagar o preço da compressão em termos de aumento do tempo de carregamento, a menos que a economia resultante em menos leituras de disco ou no custo de armazenamento seja significativa.

Fundamentalmente, a compressão funciona melhor quando o tempo de *CPU* está disponível para compactar e descompactar dados. Assim, se sua *workload* for limitada por *I/O* (*I/O bound*), em vez de limitada por *CPU* (*CPU-bound*), você pode descobrir que a compressão pode melhorar a *performance* geral. Ao testar a *performance* da sua aplicação com diferentes configurações de compressão, teste em uma plataforma semelhante à configuração planejada do sistema de produção.

##### Características da Configuração e Compressão

Ler e escrever páginas do *Database* de e para o disco é o aspecto mais lento da *performance* do sistema. A compressão tenta reduzir o *I/O* usando o tempo de *CPU* para compactar e descompactar dados, e é mais eficaz quando o *I/O* é um recurso relativamente escasso em comparação com os ciclos de processador.

Isso é frequentemente o caso, especialmente ao rodar em um ambiente multiusuário com *CPUs* rápidas e multi-core. Quando uma página de uma tabela compactada está na memória, o MySQL geralmente usa memória adicional, tipicamente 16KB, no *Buffer Pool* para uma cópia não compactada da página. O algoritmo *LRU* adaptativo tenta equilibrar o uso de memória entre páginas compactadas e não compactadas para levar em consideração se a *workload* está rodando de forma limitada por *I/O* ou limitada por *CPU*. Ainda assim, uma configuração com mais memória dedicada ao *Buffer Pool* tende a funcionar melhor ao usar tabelas compactadas do que uma configuração onde a memória é altamente restrita.

##### Escolhendo o Tamanho da Página Compactada

A configuração ideal do tamanho da página compactada depende do tipo e distribuição dos dados que a tabela e seus *Indexes* contêm. O tamanho da página compactada deve ser sempre maior do que o tamanho máximo do *record*, ou as operações podem falhar, conforme observado em Compressão de Páginas B-Tree.

Configurar o tamanho da página compactada muito grande desperdiça algum espaço, mas as páginas não precisam ser compactadas com tanta frequência. Se o tamanho da página compactada for definido muito pequeno, *inserts* ou *updates* podem exigir uma recompressão demorada, e os nós *B-tree* podem ter que ser divididos com mais frequência, levando a arquivos de dados maiores e indexação menos eficiente.

Tipicamente, você define o tamanho da página compactada para 8K ou 4K *bytes*. Dado que o tamanho máximo da linha para uma tabela InnoDB é de cerca de 8K, `KEY_BLOCK_SIZE=8` é geralmente uma escolha segura.