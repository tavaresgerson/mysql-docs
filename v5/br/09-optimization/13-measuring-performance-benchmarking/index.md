## 8.13 Medição de Desempenho (Benchmarking)

8.13.1 Medindo a Velocidade de Expressões e Funções

8.13.2 Usar seus próprios benchmarks

8.13.3 Medição de desempenho com performance\_schema

Para medir o desempenho, considere os seguintes fatores:

- Seja medindo a velocidade de uma única operação em um sistema silencioso ou como um conjunto de operações (uma "carga de trabalho") funciona ao longo de um período de tempo. Com testes simples, você geralmente testa como a mudança de um aspecto (uma configuração, o conjunto de índices em uma tabela, as cláusulas SQL em uma consulta) afeta o desempenho. Os benchmarks são, normalmente, testes de desempenho de longa duração e elaborados, onde os resultados podem ditar escolhas de alto nível, como a configuração do hardware e do armazenamento, ou quão cedo deve-se atualizar para uma nova versão do MySQL.

- Para a comparação, às vezes é necessário simular uma carga de trabalho pesada no banco de dados para obter uma imagem precisa.

- O desempenho pode variar dependendo de tantos fatores diferentes que uma diferença de alguns pontos percentuais pode não ser uma vitória decisiva. Os resultados podem mudar para o contrário quando você testar em um ambiente diferente.

- Algumas funcionalidades do MySQL ajudam ou não ajudam o desempenho, dependendo da carga de trabalho. Para obter uma visão completa, sempre teste o desempenho com essas funcionalidades ativadas e desativadas. As duas funcionalidades mais importantes a serem testadas com cada carga de trabalho são o cache de consultas do MySQL e o índice hash adaptativo para tabelas `InnoDB`.

Esta seção vai desde técnicas de medição simples e diretas que um único desenvolvedor pode realizar, até as mais complicadas, que exigem conhecimentos adicionais para serem realizadas e interpretadas os resultados.
