# Capítulo 4 Desatualização do MySQL

::: info Notas

* Certifique-se de entender o modelo de lançamento do MySQL para o suporte a longo prazo (LTS) e os lançamentos de inovação do MySQL antes de prosseguir com uma desatualização.
* A topologia de replicação é desatualizada seguindo o esquema de desatualização contínua descrito na Seção 19.5.3, “Atualização ou Desatualização de uma Topologia de Replicação”, que utiliza um dos métodos de servidor único suportados para cada desatualização de servidor individual.
* Atualizações Rápidas Mensais (MRUs) e correções quentes também são consideradas lançamentos nesta documentação.

:::

**Tabela 4.1 Caminhos de Desatualização para o Servidor MySQL**

<table><thead><tr> <th>Caminho de Desatualização</th> <th>Exemplos de Caminho</th> <th>Métodos de Desatualização Suportáveis</th> <th>Notas</th> </tr></thead><tbody><tr> <th>Dentro de uma série LTS</th> <td><p> 8.4.y LTS para 8.4.x LTS </p></td> <td>In-place, dump lógico e carga, MySQL Clone ou usando replicação</td> <td></td> </tr><tr> <th>De uma série LTS ou Bugfix para a série LTS ou Bugfix anterior</th> <td>8.4.x LTS para 8.0.y</td> <td>Dump lógico e carga ou usando replicação</td> <td>Só suportado para fins de rollback (ou seja, se nenhuma nova funcionalidade do servidor foi aplicada aos dados)</td> </tr><tr> <th>De uma série LTS ou Bugfix para uma série de inovação <span><em>após a série LTS anterior</em></span></th> <td>8.4.x LTS para 8.3.0 Inovação</td> <td>Dump lógico e carga ou usando replicação</td> <td>Só suportado para fins de rollback (ou seja, se nenhuma nova funcionalidade do servidor foi aplicada aos dados)</td> </tr><tr> <th>Dentro de uma série de inovação</th> <td>9.5 para 9.4</td> <td>Dump lógico e carga ou usando replicação</td> <td>Só suportado para fins de rollback (ou seja, se nenhuma nova funcionalidade do servidor foi aplicada aos dados)</td> </tr></tbody></table>

A desatualização para o MySQL 5.7 ou versões anteriores não é suportada.