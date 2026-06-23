## 10.13 Medição de desempenho (benchmarking)

Para medir o desempenho, considere os seguintes fatores:

* Se você está medindo a velocidade de uma única operação em um sistema silencioso, ou como um conjunto de operações (uma "carga de trabalho") funciona ao longo de um período de tempo. Com testes simples, você geralmente testa como a mudança de um aspecto (um ajuste de configuração, o conjunto de índices em uma tabela, as cláusulas SQL em uma consulta) afeta o desempenho. Os benchmarks são, tipicamente, testes de desempenho de longa duração e elaborados, onde os resultados podem ditar escolhas de alto nível, como a configuração de hardware e armazenamento, ou quão cedo deve-se atualizar para uma nova versão do MySQL.

* Para fazer comparações, às vezes é necessário simular uma carga pesada de trabalho em um banco de dados para obter uma imagem precisa.

* O desempenho pode variar dependendo de muitos fatores diferentes, de modo que uma diferença de alguns pontos percentuais pode não ser uma vitória decisiva. Os resultados podem mudar para o contrário quando você testa em um ambiente diferente.

* Algumas funcionalidades do MySQL ajudam ou não ajudam no desempenho, dependendo da carga de trabalho. Para a totalidade, sempre teste o desempenho com essas funcionalidades ativadas e desativadas. A funcionalidade mais importante a ser testada com cada carga de trabalho é o [índice de hash adaptável][(innodb-adaptive-hash.html "17.5.3 Adaptive Hash Index")] para tabelas de `InnoDB`.

Esta seção progride de técnicas de medição simples e diretas que um único desenvolvedor pode realizar, para as mais complicadas, que exigem conhecimentos adicionais para serem realizadas e interpretadas os resultados.

### 10.13.1 Medindo a Velocidade das Expressões e Funções

Para medir a velocidade de uma expressão ou função específica do MySQL, invoque a função `BENCHMARK()` usando o programa cliente **mysql**. Sua sintaxe é `BENCHMARK(loop_count,expr)`. O valor de retorno é sempre zero, mas o **mysql** exibe uma linha mostrando aproximadamente quanto tempo a declaração levou para ser executada. Por exemplo:

```
mysql> SELECT BENCHMARK(1000000,1+1);
+------------------------+
| BENCHMARK(1000000,1+1) |
+------------------------+
|                      0 |
+------------------------+
1 row in set (0.32 sec)
```

Esse resultado foi obtido em um sistema Pentium II de 400 MHz. Isso mostra que o MySQL pode executar 1.000.000 de expressões de adição simples em 0,32 segundos nesse sistema.

As funções do MySQL embutidas são, normalmente, altamente otimizadas, mas pode haver algumas exceções. `BENCHMARK()` é uma excelente ferramenta para descobrir se alguma função é um problema para suas consultas.

### 10.13.2 Usando seus próprios benchmarks

Compruebe sua aplicação e banco de dados para descobrir onde estão os gargalos. Após corrigir um gargalo (ou substituí-lo por um módulo “fantoche”), você pode prosseguir para identificar o próximo gargalo. Mesmo que o desempenho geral da sua aplicação seja atualmente aceitável, você deve, pelo menos, fazer um plano para cada gargalo e decidir como resolvê-lo, caso, algum dia, você realmente precise do desempenho extra.

Uma suíte de referência gratuita é o Benchmark de Banco de Dados de Código Aberto, disponível em <http://osdb.sourceforge.net/>.

É muito comum que um problema ocorra apenas quando o sistema está muito carregado. Temos tido muitos clientes que nos contatam quando têm um sistema (testado) em produção e encontraram problemas de carga. Na maioria dos casos, os problemas de desempenho acabam sendo devidos a questões de projeto básico do banco de dados (por exemplo, varreduras de tabela não são boas sob carga alta) ou problemas com o sistema operacional ou bibliotecas. Na maioria das vezes, esses problemas seriam muito mais fáceis de corrigir se os sistemas não estivessem já em produção.

Para evitar problemas como esse, faça uma comparação de desempenho de toda a sua aplicação sob a carga mais ruim possível:

* O programa **mysqlslap** pode ser útil para simular uma carga alta produzida por vários clientes que emitem consultas simultaneamente. Veja a Seção 6.5.8, “mysqlslap — Um cliente de emulação de carga”.

* Você também pode experimentar pacotes de referência, como SysBench e DBT2, disponíveis em <https://launchpad.net/sysbench> e <http://osdldbt.sourceforge.net/#dbt2>.

Esses programas ou pacotes podem derrubar um sistema, então certifique-se de usá-los apenas em seus sistemas de desenvolvimento.

### 10.13.3 Medindo o desempenho com performance_schema

Você pode consultar as tabelas no banco de dados `performance_schema` para obter informações em tempo real sobre as características de desempenho do seu servidor e das aplicações que ele está executando. Consulte o Capítulo 29, *MySQL Performance Schema*, para obter detalhes.