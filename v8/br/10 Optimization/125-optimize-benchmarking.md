## 10.13 Medindo o Desempenho (Benchmarking)

Para medir o desempenho, considere os seguintes fatores:

* Se você está medindo a velocidade de uma única operação em um sistema silencioso, ou como um conjunto de operações (uma "carga de trabalho") funciona ao longo de um período de tempo. Com testes simples, você geralmente testa como a mudança de um aspecto (uma configuração, o conjunto de índices em uma tabela, as cláusulas SQL em uma consulta) afeta o desempenho. Os benchmarks são, normalmente, testes de desempenho de longa duração e elaborados, onde os resultados podem ditar escolhas de alto nível, como a configuração do hardware e do armazenamento, ou a frequência com que deve-se atualizar para uma nova versão do MySQL.
* Para o benchmarking, às vezes é necessário simular uma carga de trabalho pesada no banco de dados para obter uma imagem precisa.
* O desempenho pode variar dependendo de tantos fatores diferentes que uma diferença de alguns pontos percentuais pode não ser uma vitória decisiva. Os resultados podem mudar para o sentido oposto quando você testa em um ambiente diferente.
* Algumas funcionalidades do MySQL ajudam ou não ajudam o desempenho, dependendo da carga de trabalho. Para a completude, sempre teste o desempenho com essas funcionalidades ativadas e desativadas. A funcionalidade mais importante a ser testada com cada carga de trabalho é o índice hash adaptativo para tabelas `InnoDB`.

Esta seção progride de técnicas de medição simples e diretas que um único desenvolvedor pode realizar, para as mais complicadas que requerem experiência adicional para realizar e interpretar os resultados.