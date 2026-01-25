## 8.8 Entendendo o Plano de Execução da Query

8.8.1 Otimizando Queries com EXPLAIN

8.8.2 Formato de Saída do EXPLAIN

8.8.3 Formato de Saída Estendido do EXPLAIN

8.8.4 Obtendo Informações do Plano de Execução para uma Conexão Nomeada

8.8.5 Estimando a Performance da Query

Dependendo dos detalhes de suas tables, columns, indexes e das condições em sua `WHERE` clause, o optimizer do MySQL considera diversas técnicas para realizar eficientemente as operações de busca (lookups) envolvidas em uma SQL query. Uma query em uma table grande pode ser executada sem ler todas as rows; um JOIN envolvendo diversas tables pode ser realizado sem comparar todas as combinações de rows. O conjunto de operações que o optimizer escolhe para executar a query da forma mais eficiente é chamado de "plano de execução da query", também conhecido como plano `EXPLAIN`. Seu objetivo é reconhecer os aspectos do plano `EXPLAIN` que indicam que uma query está bem otimizada, e aprender a sintaxe SQL e as técnicas de Indexing para aprimorar o plano caso observe operações ineficientes.