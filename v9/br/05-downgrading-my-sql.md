# Capítulo 4 Desatualização do MySQL

Observações

* Certifique-se de entender o modelo de lançamento do MySQL para suporte a longo prazo (LTS) e lançamentos de inovação do MySQL antes de prosseguir com uma desatualização.

* A topologia de replicação é desatualizada seguindo o esquema de desatualização contínua descrito na Seção 19.5.3, “Atualização ou Desatualização de uma Topologia de Replicação”, que utiliza um dos métodos de servidor único suportados para cada desatualização de servidor individual.

* As Atualizações Rápidas Mensais (MRUs) e correções quentes também são consideradas lançamentos nesta documentação.

**Tabela 4.1 Caminhos de Desatualização para o Servidor MySQL**

<table width="1062"><col width="25%"/><col width="15%"/><col width="30%"/><col width="30%"/><thead><tr> <th scope="col">Caminho de Downgrade</th> <th scope="col">Exemplos de Caminhos</th> <th scope="col">Métodos de Downgrade Suportado</th> <th scope="col">Notas</th> </tr></thead><tbody><tr> <th scope="row">Dentro de uma série LTS</th> <td><p> 8.4.y LTS para 8.4.x LTS </p></td> <td>Instalação no local, varredura e carregamento lógicos, MySQL Clone ou usando replicação</td> <td></td> </tr><tr> <th scope="row">De uma série LTS ou Bugfix para a série LTS ou Bugfix anterior</th> <td>8.4.x LTS para 8.0.y</td> <td>Varredura e carregamento lógicos ou usando replicação</td> <td>Só suportado para fins de rollback (ou seja, se nenhuma nova funcionalidade do servidor foi aplicada aos dados)</td> </tr><tr> <th scope="row">De uma série LTS ou Bugfix para uma série Innovation <span class="emphasis"><em>após a série LTS anterior</em></span></th> <td>8.4.x LTS para 8.3.0 Innovation</td> <td>Varredura e carregamento lógicos ou usando replicação</td> <td>Só suportado para fins de rollback (ou seja, se nenhuma nova funcionalidade do servidor foi aplicada aos dados)</td> </tr><tr> <th scope="row">Dentro de uma série Innovation</th> <td>9.5 para 9.4</td> <td>Varredura e carregamento lógicos ou usando replicação</td> <td>Só suportado para fins de rollback (ou seja, se nenhuma nova funcionalidade do servidor foi aplicada aos dados)</td> </tr></tbody></table>

A desativação para o MySQL 5.7 ou versões anteriores não é suportada.