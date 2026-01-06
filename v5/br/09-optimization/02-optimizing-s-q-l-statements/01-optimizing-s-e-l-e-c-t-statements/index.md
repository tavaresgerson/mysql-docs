### 8.2.1 Otimizando instruções SELECT

8.2.1.1 Otimização da cláusula WHERE

8.2.1.2 Otimização da Gama

8.2.1.3 Otimização da Mesclagem de Índices

8.2.1.4 Otimização da Depressão da Condição do Motor

8.2.1.5 Otimização da empilhamento da condição do índice

8.2.1.6 Algoritmos de Conjunção com Laços Aninhados

8.2.1.7 Otimização de Conexão Aninhada

8.2.1.8 Otimização de Conexão Externa

8.2.1.9 Simplificação da Conjunção Externa

8.2.1.10 Otimização da leitura em várias faixas de amplitude

8.2.1.11 Conexões de junção de laço aninhado e acesso a chave em lote

8.2.1.12 Filtro de Condição

8.2.1.13 O valor IS NULL: Otimização

8.2.1.14 Ordenação por otimização

8.2.1.15 Otimização por GROUP BY

8.2.1.16 Otimização Distinta

8.2.1.17 Otimização da consulta de LIMITE

8.2.1.18 Otimização de Chamadas de Função

8.2.1.19 Otimização da Expressão de Construção de Linha

8.2.1.20 Evitar varreduras completas da tabela

As consultas, na forma de instruções `SELECT`, realizam todas as operações de busca no banco de dados. A otimização dessas instruções é uma prioridade máxima, seja para alcançar tempos de resposta inferiores a um segundo para páginas web dinâmicas ou para reduzir horas no tempo necessário para gerar relatórios enormes durante a noite.

Além das instruções `SELECT`, as técnicas de ajuste para consultas também se aplicam a construções como `CREATE TABLE...AS SELECT`, `INSERT INTO...SELECT` e cláusulas `WHERE` em instruções `DELETE`. Essas instruções têm considerações de desempenho adicionais porque combinam operações de escrita com operações de consulta orientadas para leitura.

O NDB Cluster suporta uma otimização de empurrão de junção, onde uma junção qualificada é enviada em sua totalidade para os nós de dados do NDB Cluster, onde ela pode ser distribuída entre eles e executada em paralelo. Para obter mais informações sobre essa otimização, consulte Condições para junções de empurrão do NDB.

As principais considerações para otimizar as consultas são:

- Para tornar uma consulta `SELECT ... WHERE` lenta mais rápida, a primeira coisa a verificar é se você pode adicionar um índice. Configure índices nas colunas usadas na cláusula `WHERE`, para acelerar a avaliação, o filtro e a recuperação final dos resultados. Para evitar o desperdício de espaço em disco, construa um pequeno conjunto de índices que acelere muitas consultas relacionadas usadas em sua aplicação.

  Os índices são especialmente importantes para consultas que fazem referência a diferentes tabelas, utilizando recursos como junções e chaves estrangeiras. Você pode usar a instrução `EXPLAIN` para determinar quais índices são usados para uma consulta `SELECT`. Veja a Seção 8.3.1, “Como o MySQL Usa Índices” e a Seção 8.8.1, “Otimizando Consultas com EXPLAIN”.

- Isolar e ajustar qualquer parte da consulta, como uma chamada de função, que leva tempo excessivo. Dependendo da estrutura da consulta, uma função pode ser chamada uma vez para cada linha do conjunto de resultados ou até mesmo uma vez para cada linha da tabela, aumentando significativamente qualquer ineficiência.

- Minimize o número de varreduras completas da tabela em suas consultas, especialmente para tabelas grandes.

- Mantenha as estatísticas da tabela atualizadas usando a instrução `ANALYZE TABLE` periodicamente, para que o otimizador tenha as informações necessárias para construir um plano de execução eficiente.

- Aprenda as técnicas de sintonização, técnicas de indexação e parâmetros de configuração específicos para o motor de armazenamento de cada tabela. Tanto o `InnoDB` quanto o `MyISAM` têm conjuntos de diretrizes para habilitar e manter alto desempenho em consultas. Para detalhes, consulte a Seção 8.5.6, “Otimizando Consultas InnoDB” e a Seção 8.6.1, “Otimizando Consultas MyISAM”.

- Você pode otimizar transações de consulta única para tabelas do `InnoDB`, usando a técnica descrita na Seção 8.5.3, “Otimizando transações de leitura somente do InnoDB”.

- Evite transformar a consulta de maneiras que dificultem a compreensão, especialmente se o otimizador realizar algumas dessas mesmas transformações automaticamente.

- Se um problema de desempenho não for facilmente resolvido por uma das diretrizes básicas, investigue os detalhes internos da consulta específica lendo o plano `EXPLAIN` e ajustando seus índices, cláusulas `WHERE`, cláusulas de junção, etc. (Quando você atingir um certo nível de experiência, ler o plano `EXPLAIN` pode ser o seu primeiro passo para cada consulta.)

- Ajuste o tamanho e as propriedades das áreas de memória que o MySQL usa para cache. Com o uso eficiente do pool de buffers `InnoDB`, do cache de chaves `MyISAM` e do cache de consultas MySQL, as consultas repetidas são executadas mais rapidamente, pois os resultados são recuperados da memória na segunda e em consultas subsequentes.

- Mesmo para uma consulta que roda rápido usando as áreas de memória cache, você ainda pode otimizar mais para que elas precisem de menos memória cache, tornando sua aplicação mais escalável. Escalabilidade significa que sua aplicação pode lidar com mais usuários simultâneos, solicitações maiores, e assim por diante, sem sofrer uma queda significativa no desempenho.

- Lidar com problemas de bloqueio, onde a velocidade da sua consulta pode ser afetada por outras sessões acessando as tabelas ao mesmo tempo.
