## 3.2 Caminhos de Atualização

Observações

* Certifique-se de entender o modelo de lançamento do MySQL para as versões de longo prazo de suporte (LTS) e inovação do MySQL antes de prosseguir com uma atualização para uma versão anterior.

* Recomendamos verificar a compatibilidade da atualização com o Ferramenta de Verificação de Atualização do MySQL Shell antes de realizar uma atualização.

* A topologia de replicação é atualizada seguindo o esquema de atualização contínua descrito na Seção 19.5.3, “Atualizando ou Desatualizando uma Topologia de Replicação”, que utiliza um dos métodos de servidor único suportados para cada atualização de servidor individual.

* As Atualizações Rápidas Mensais (MRUs) e as correções em tempo real também são consideradas lançamentos nesta documentação.

**Tabela 3.1 Caminhos de Atualização para o MySQL Server**

<table><col width="35%"/><col width="15%"/><col width="50%"/><thead><tr> <th>Caminho de Atualização</th> <th>Exemplos de Caminhos</th> <th>Métodos de Atualização Suportado</th> </tr></thead><tbody><tr> <th>Dentro de uma Série LTS ou Bugfix</th> <td>8.0.37 a 8.0.41 ou 8.4.0 a 8.4.4</td> <td>Atualização In-Place, dump e carga lógicas, replicação, e MySQL Clone</td> </tr><tr> <th>De uma Série LTS ou Bugfix para a próxima Série LTS</th> <td>8.0.37 a 8.4.x LTS</td> <td>Atualização In-Place, dump e carga lógicas, e replicação</td> </tr><tr> <th>De uma Série LTS ou Bugfix para uma Série Innovation <span class="emphasis"><em>antes da próxima Série LTS</em></span></th> <td>8.0.34 a 8.3.0 ou 8.4.0 a 9.2.0</td> <td>Atualização In-Place, dump e carga lógicas, e replicação</td> </tr><tr> <th>De uma Série Innovation para a próxima Série LTS</th> <td>8.3.0 a 8.4 LTS</td> <td>Atualização In-Place, dump e carga lógicas, e replicação</td> </tr><tr> <th>De uma Série Innovation para uma Série Innovation <span class="emphasis"><em>depois da próxima Série LTS</em></span></th> <td>Não permitido, são necessários dois passos: 8.3.0 a 8.4 LTS, e 8.4 LTS a 9.x Innovation</td> <td>Atualização In-Place, dump e carga lógicas, e replicação</td> </tr><tr> <th>De dentro de uma Série Innovation</th> <td>8.1