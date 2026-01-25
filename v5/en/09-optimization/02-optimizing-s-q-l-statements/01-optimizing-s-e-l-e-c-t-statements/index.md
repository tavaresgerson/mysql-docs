### 8.2.1 Otimizando Instruções SELECT

8.2.1.1 Otimização da Cláusula WHERE

8.2.1.2 Otimização de Range

8.2.1.3 Otimização de Index Merge

8.2.1.4 Otimização de Engine Condition Pushdown

8.2.1.5 Otimização de Index Condition Pushdown

8.2.1.6 Algoritmos de Nested-Loop Join

8.2.1.7 Otimização de Nested Join

8.2.1.8 Otimização de Outer Join

8.2.1.9 Simplificação de Outer Join

8.2.1.10 Otimização de Multi-Range Read

8.2.1.11 Joins do Tipo Block Nested-Loop e Batched Key Access

8.2.1.12 Filtragem de Condição

8.2.1.13 Otimização de IS NULL

8.2.1.14 Otimização de ORDER BY

8.2.1.15 Otimização de GROUP BY

8.2.1.16 Otimização de DISTINCT

8.2.1.17 Otimização de Query LIMIT

8.2.1.18 Otimização de Chamada de Função

8.2.1.19 Otimização de Expressão Row Constructor

8.2.1.20 Evitando Full Table Scans

Queries, na forma de instruções `SELECT`, executam todas as operações de busca (lookup operations) no Database. O Tuning dessas instruções é uma prioridade máxima, seja para alcançar tempos de resposta de sub-segundo para páginas web dinâmicas, ou para reduzir horas do tempo necessário para gerar grandes relatórios noturnos.

Além das instruções `SELECT`, as técnicas de Tuning para Queries também se aplicam a construções como `CREATE TABLE...AS SELECT`, `INSERT INTO...SELECT` e cláusulas `WHERE` em instruções `DELETE`. Essas instruções possuem considerações adicionais de performance porque combinam operações de escrita com as operações de Query orientadas à leitura.

O NDB Cluster suporta uma otimização de join pushdown pela qual um JOIN qualificável é enviado integralmente aos nós de dados do NDB Cluster, onde pode ser distribuído entre eles e executado em paralelo. Para mais informações sobre esta otimização, consulte Condições para NDB pushdown joins.

As principais considerações para otimizar Queries são:

*   Para tornar uma Query `SELECT ... WHERE` lenta mais rápida, a primeira coisa a verificar é se você pode adicionar um Index. Configure Indexes nas colunas usadas na cláusula `WHERE`, para acelerar a avaliação, a filtragem e a recuperação final dos resultados. Para evitar desperdício de espaço em disco, construa um pequeno conjunto de Indexes que acelere muitas Queries relacionadas usadas em sua aplicação.

    Indexes são especialmente importantes para Queries que referenciam diferentes tabelas, usando recursos como joins e foreign keys. Você pode usar a instrução `EXPLAIN` para determinar quais Indexes são usados para um `SELECT`. Consulte a Seção 8.3.1, “Como o MySQL Usa Indexes” e a Seção 8.8.1, “Otimizando Queries com EXPLAIN”.

*   Isole e ajuste (tune) qualquer parte da Query que leve tempo excessivo, como uma chamada de função. Dependendo de como a Query está estruturada, uma função pode ser chamada uma vez para cada linha no conjunto de resultados, ou até mesmo uma vez para cada linha na tabela, ampliando muito qualquer ineficiência.

*   Minimize o número de full table scans em suas Queries, particularmente para tabelas grandes.

*   Mantenha as estatísticas da tabela atualizadas usando a instrução `ANALYZE TABLE` periodicamente, para que o optimizer tenha as informações necessárias para construir um plano de execução eficiente.

*   Aprenda as técnicas de Tuning, técnicas de Indexing e parâmetros de configuração específicos para o storage engine de cada tabela. Tanto o `InnoDB` quanto o `MyISAM` possuem conjuntos de diretrizes para habilitar e sustentar alta performance em Queries. Para detalhes, consulte a Seção 8.5.6, “Otimizando Queries do InnoDB” e a Seção 8.6.1, “Otimizando Queries do MyISAM”.

*   Você pode otimizar transações de Query única para tabelas `InnoDB`, usando a técnica na Seção 8.5.3, “Otimizando Transações Read-Only do InnoDB”.

*   Evite transformar a Query de maneiras que a tornem difícil de entender, especialmente se o optimizer fizer algumas das mesmas transformações automaticamente.

*   Se um problema de performance não for facilmente resolvido por uma das diretrizes básicas, investigue os detalhes internos da Query específica lendo o plano `EXPLAIN` e ajustando seus Indexes, cláusulas `WHERE`, cláusulas de JOIN, e assim por diante. (Ao atingir um certo nível de especialização, a leitura do plano `EXPLAIN` pode ser seu primeiro passo para cada Query.)

*   Ajuste o tamanho e as propriedades das áreas de memória que o MySQL usa para caching. Com o uso eficiente do `InnoDB buffer pool`, do `MyISAM key cache` e do MySQL `query cache`, Queries repetidas são executadas mais rapidamente porque os resultados são recuperados da memória na segunda e nas vezes subsequentes.

*   Mesmo para uma Query que é executada rapidamente usando as áreas de memória cache, você ainda pode otimizar ainda mais para que ela exija menos memória cache, tornando sua aplicação mais escalável (scalable). Scalability (escalabilidade) significa que sua aplicação pode lidar com mais usuários simultâneos, requisições maiores, e assim por diante, sem experimentar uma grande queda na performance.

*   Lide com problemas de Lock (travamento), onde a velocidade da sua Query pode ser afetada por outras sessões acessando as tabelas simultaneamente.
