## 10.8 Entendendo o Plano de Execução da Consulta

10.8.1 Otimizando Consultas com EXPLAIN

10.8.2 Formato de Saída EXPLAIN

10.8.3 Formato de Saída EXPLAIN Expandido

10.8.4 Obtendo Informações do Plano de Execução para uma Conexão Nomeada

10.8.5 Estimativa do Desempenho da Consulta

Dependendo dos detalhes das suas tabelas, colunas, índices e das condições na cláusula `WHERE`, o otimizador do MySQL considera várias técnicas para realizar eficientemente as consultas envolvidas em uma consulta SQL. Uma consulta em uma tabela enorme pode ser realizada sem ler todas as linhas; uma junção envolvendo várias tabelas pode ser realizada sem comparar todas as combinações de linhas. O conjunto de operações que o otimizador escolhe para realizar a consulta mais eficiente é chamado de “plano de execução da consulta”, também conhecido como o plano `EXPLAIN`. Seus objetivos são reconhecer os aspectos do plano `EXPLAIN` que indicam que uma consulta está bem otimizada e aprender a sintaxe SQL e as técnicas de indexação para melhorar o plano se você vir algumas operações ineficientes.