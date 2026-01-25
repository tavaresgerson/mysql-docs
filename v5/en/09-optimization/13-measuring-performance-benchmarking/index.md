## 8.13 Medindo Desempenho (Benchmarking)

8.13.1 Medindo a Velocidade de Expressões e Funções

8.13.2 Usando Seus Próprios Benchmarks

8.13.3 Medindo Desempenho com performance_schema

Para medir o desempenho, considere os seguintes fatores:

* Se você está medindo a velocidade de uma única operação em um sistema ocioso, ou como um conjunto de operações (um “workload”) se comporta ao longo de um período de tempo. Em testes simples, você geralmente testa como a alteração de um aspecto (uma configuração, o conjunto de indexes em uma table, as cláusulas SQL em uma query) afeta o desempenho. Benchmarks são tipicamente testes de desempenho elaborados e de longa duração, onde os resultados podem ditar escolhas de alto nível, como a configuração de hardware e armazenamento, ou em quanto tempo atualizar para uma nova versão do MySQL.

* Para o benchmarking, às vezes você deve simular um heavy workload de Database para obter um panorama preciso.

* O desempenho pode variar dependendo de tantos fatores diferentes que uma diferença de alguns pontos percentuais pode não ser uma vitória decisiva. Os resultados podem mudar para o caminho oposto quando você testa em um ambiente diferente.

* Certos recursos do MySQL ajudam ou não o desempenho dependendo do workload. Para maior completude, sempre teste o desempenho com esses recursos ativados e desativados. Os dois recursos mais importantes a serem testados com cada workload são o MySQL query cache e o adaptive hash index para tables `InnoDB`.

Esta seção progride de técnicas de medição simples e diretas que um único desenvolvedor pode realizar, para outras mais complicadas que exigem experiência adicional para executar e interpretar os resultados.