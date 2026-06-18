### 10.2.1 Otimizando instruções SELECT

10.2.1.1 Otimização da cláusula WHERE

10.2.1.2 Otimização da Gama

10.2.1.3 Otimização da Mesclagem de Índices

10.2.1.4 Otimização de Join por Hash

10.2.1.5 Otimização da Depressão da Condição do Motor

10.2.1.6 Otimização da empilhamento da condição do índice

10.2.1.7 Algoritmos de Conjunção com Laços Aninhados

10.2.1.8 Otimização de Conexão Aninhada

10.2.1.9 Otimização de Conexão Externa

10.2.1.10 Simplificação da Conexão Externa

10.2.1.11 Otimização da leitura de várias faixas de frequência

10.2.1.12 Conexões de junção de laço aninhado e acesso a chave em lote

10.2.1.13 Filtro de Condições

10.2.1.14 Otimização da dobragem constante

10.2.1.15 IS NULL Otimização

10.2.1.16 ORDEM POR Otimização

10.2.1.17 Otimização por GRUPO

10.2.1.18 Otimização Distinta

10.2.1.19 Otimização da consulta de limite

10.2.1.20 Otimização da Chamada de Função

10.2.1.21 Otimização da Função de Janela

10.2.1.22 Otimização da Expressão de Construção de Linha

10.2.1.23 Evitar varreduras completas da tabela

As consultas, na forma de declarações `SELECT`, realizam todas as operações de busca no banco de dados. A otimização dessas declarações é uma prioridade máxima, seja para alcançar tempos de resposta inferiores a um segundo para páginas da web dinâmicas ou para reduzir horas no tempo necessário para gerar relatórios enormes durante a noite.

Além das declarações `SELECT`, as técnicas de ajuste para consultas também se aplicam a construções como as cláusulas `CREATE TABLE...AS SELECT`, `INSERT INTO...SELECT` e `WHERE` em declarações `DELETE`. Essas declarações têm considerações de desempenho adicionais porque combinam operações de escrita com operações de consulta orientadas para leitura.

O NDB Cluster suporta uma otimização de empurrão de junção, onde uma junção qualificada é enviada em sua totalidade para os nós de dados do NDB Cluster, onde ela pode ser distribuída entre eles e executada em paralelo. Para obter mais informações sobre essa otimização, consulte Condições para junções de empurrão do NDB.

As principais considerações para otimizar as consultas são:

- Para tornar uma consulta lenta `SELECT ... WHERE` mais rápida, a primeira coisa a verificar é se você pode adicionar um índice. Configure índices nas colunas usadas na cláusula `WHERE`, para acelerar a avaliação, o filtro e a recuperação final dos resultados. Para evitar o desperdício de espaço em disco, construa um pequeno conjunto de índices que acelere muitas consultas relacionadas usadas em sua aplicação.

  Os índices são especialmente importantes para consultas que fazem referência a diferentes tabelas, utilizando recursos como junções e chaves estrangeiras. Você pode usar a instrução `EXPLAIN` para determinar quais índices são usados para um `SELECT`. Veja a Seção 10.3.1, “Como o MySQL Usa Índices” e a Seção 10.8.1, “Otimizando Consultas com EXPLAIN”.

- Isolar e ajustar qualquer parte da consulta, como uma chamada de função, que leva tempo excessivo. Dependendo da estrutura da consulta, uma função pode ser chamada uma vez para cada linha do conjunto de resultados ou até mesmo uma vez para cada linha da tabela, aumentando significativamente qualquer ineficiência.

- Minimize o número de varreduras completas da tabela em suas consultas, especialmente para tabelas grandes.

- Mantenha as estatísticas da tabela atualizadas usando a instrução `ANALYZE TABLE` periodicamente, para que o otimizador tenha as informações necessárias para construir um plano de execução eficiente.

- Aprenda as técnicas de sintonização, técnicas de indexação e parâmetros de configuração específicos para o motor de armazenamento de cada tabela. Tanto o `InnoDB` quanto o `MyISAM` têm conjuntos de diretrizes para habilitar e manter alto desempenho em consultas. Para detalhes, consulte a Seção 10.5.6, “Otimizando Consultas InnoDB” e a Seção 10.6.1, “Otimizando Consultas MyISAM”.

- Você pode otimizar transações de consulta única para tabelas de `InnoDB`, usando a técnica na Seção 10.5.3, “Otimizando Transações de Leitura Apenas de InnoDB”.

- Evite transformar a consulta de maneiras que dificultem a compreensão, especialmente se o otimizador realizar algumas dessas mesmas transformações automaticamente.

- Se um problema de desempenho não for facilmente resolvido por uma das diretrizes básicas, investigue os detalhes internos da consulta específica lendo o plano `EXPLAIN` e ajustando seus índices, cláusulas `WHERE`, cláusulas de junção, e assim por diante. (Quando você atingir um certo nível de experiência, ler o plano `EXPLAIN` pode ser o seu primeiro passo para cada consulta.)

- Ajuste o tamanho e as propriedades das áreas de memória que o MySQL usa para o cache. Com o uso eficiente do pool de buffers `InnoDB` e do cache de chaves `MyISAM`, e do cache de consultas MySQL, as consultas repetidas são executadas mais rapidamente, pois os resultados são recuperados da memória na segunda e em consultas subsequentes.

- Mesmo para uma consulta que roda rápido usando as áreas de memória cache, você ainda pode otimizar mais para que elas precisem de menos memória cache, tornando sua aplicação mais escalável. Escalabilidade significa que sua aplicação pode lidar com mais usuários simultâneos, solicitações maiores, e assim por diante, sem sofrer uma queda significativa no desempenho.

- Lidar com problemas de bloqueio, onde a velocidade da sua consulta pode ser afetada por outras sessões acessando as tabelas ao mesmo tempo.
