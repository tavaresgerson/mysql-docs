### 10.2.1 Otimização de Instruções `SELECT`

10.2.1.1 Otimização da Cláusula `WHERE`

10.2.1.2 Otimização de Faixas

10.2.1.3 Otimização de Fusão de Índices

10.2.1.4 Otimização de Conexão de Hash

10.2.1.5 Otimização de Desvio de Condição do Motor

10.2.1.6 Otimização de Desvio de Condição de Índices

10.2.1.7 Algoritmos de Conexão de Loop Aninhado

10.2.1.8 Otimização de Conexão Aninhada

10.2.1.9 Otimização de Conexão Externa

10.2.1.10 Simplificação de Conexão Externa

10.2.1.11 Otimização de Leitura de Múltiplas Faixas

10.2.1.12 Conexões de Leitura de Loop Aninhado e de Acesso a Chave em Bloco

10.2.1.13 Filtro de Condição

10.2.1.14 Otimização de Dobramento de Constantes

10.2.1.15 Otimização de IS NULL

10.2.1.16 Otimização de ORDER BY

10.2.1.17 Otimização de GROUP BY

10.2.1.18 Otimização de DISTINCT

10.2.1.19 Otimização de Consulta LIMIT

10.2.1.20 Otimização de Chamada de Função

10.2.1.21 Otimização de Função de Janela

10.2.1.22 Otimização de Expressão de Construtor de Linha

10.2.1.23 Evitar Varreduras Completas da Tabela

As consultas, na forma de instruções `SELECT`, realizam todas as operações de busca no banco de dados. A otimização dessas instruções é uma prioridade máxima, seja para alcançar tempos de resposta inferiores a um segundo para páginas da web dinâmicas, ou para reduzir horas no tempo necessário para gerar relatórios enormes durante a noite.

Além das instruções `SELECT`, as técnicas de otimização para consultas também se aplicam a construções como `CREATE TABLE...AS SELECT`, `INSERT INTO...SELECT` e cláusulas `WHERE` em instruções `DELETE`. Essas instruções têm considerações de desempenho adicionais porque combinam operações de escrita com operações de consulta orientadas para leitura.

O NDB Cluster suporta uma otimização de empurrão de junção, onde uma junção qualificada é enviada na íntegra para os nós de dados do NDB Cluster, onde pode ser distribuída entre eles e executada em paralelo. Para obter mais informações sobre essa otimização, consulte as Condições para junções de empurrão de NDB.

As principais considerações para otimizar consultas são:

* Para tornar uma consulta lenta de `SELECT ... WHERE` mais rápida, a primeira coisa a verificar é se é possível adicionar um índice. Configure índices nas colunas usadas na cláusula `WHERE`, para acelerar a avaliação, o filtro e a recuperação final dos resultados. Para evitar o desperdício de espaço em disco, construa um pequeno conjunto de índices que acelere muitas consultas relacionadas usadas em sua aplicação.

  Os índices são especialmente importantes para consultas que referenciam diferentes tabelas, usando recursos como junções e chaves estrangeiras. Você pode usar a instrução `EXPLAIN` para determinar quais índices são usados para uma `SELECT`. Veja a Seção 10.3.1, “Como o MySQL Usa Índices” e a Seção 10.8.1, “Otimizando Consultas com EXPLAIN”.

* Isolar e ajustar qualquer parte da consulta, como uma chamada de função, que leva tempo excessivo. Dependendo da estrutura da consulta, uma função pode ser chamada uma vez para cada linha no conjunto de resultados, ou até mesmo uma vez para cada linha da tabela, ampliando grandemente qualquer ineficiência.

* Minimizar o número de varreduras completas da tabela em suas consultas, particularmente para tabelas grandes.

* Mantenha as estatísticas da tabela atualizadas usando a instrução `ANALYZE TABLE` periodicamente, para que o otimizador tenha as informações necessárias para construir um plano de execução eficiente.

* Aprenda as técnicas de sintonização, técnicas de indexação e parâmetros de configuração específicos para o motor de armazenamento de cada tabela. Tanto o `InnoDB` quanto o `MyISAM` têm conjuntos de diretrizes para habilitar e manter alto desempenho em consultas. Para detalhes, consulte a Seção 10.5.6, “Otimizando Consultas InnoDB” e a Seção 10.6.1, “Otimizando Consultas MyISAM”.

* Você pode otimizar transações de consulta única para tabelas `InnoDB`, usando a técnica na Seção 10.5.3, “Otimizando Transações de Leitura Isoladas InnoDB”.

* Evite transformar a consulta de maneiras que dificultem a compreensão, especialmente se o otimizador realizar algumas das mesmas transformações automaticamente.

* Se um problema de desempenho não for facilmente resolvido por uma das diretrizes básicas, investigue os detalhes internos da consulta específica lendo o plano `EXPLAIN` e ajustando seus índices, cláusulas `WHERE`, cláusulas de junção e assim por diante. (Quando você atingir um certo nível de expertise, ler o plano `EXPLAIN` pode ser o seu primeiro passo para cada consulta.)

* Ajuste o tamanho e as propriedades das áreas de memória que o MySQL usa para cache. Com o uso eficiente do pool de buffers `InnoDB`, cache de chaves `MyISAM` e cache de consultas MySQL, consultas repetidas são executadas mais rápido porque os resultados são recuperados da memória na segunda e em consultas subsequentes.

* Mesmo para uma consulta que roda rápido usando as áreas de memória de cache, você ainda pode otimizar mais para que elas exijam menos memória de cache, tornando sua aplicação mais escalável. Escalabilidade significa que sua aplicação pode lidar com mais usuários simultâneos, solicitações maiores e assim por diante sem experimentar uma grande queda de desempenho.

* Lidar com problemas de bloqueio, onde a velocidade da sua consulta pode ser afetada por outras sessões acessando as tabelas ao mesmo tempo.