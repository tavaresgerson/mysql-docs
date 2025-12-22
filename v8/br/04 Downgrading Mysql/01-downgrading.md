# Capítulo 4 Downgrading MySQL

::: info Notes

- Certifique-se de que você entende o modelo de lançamento do MySQL para o suporte de longo prazo do MySQL (LTS) e lançamentos de inovação antes de prosseguir com uma atualização.
- Uma topologia de replicação é degradada seguindo o esquema de degradação contínua descrito na secção 19.5.3, "Upgrading or Downgrading a Replication Topology", que utiliza um dos métodos de servidor único suportados para cada degradação de servidor individual.
- As atualizações rápidas mensais (MRUs) e as correcções rápidas também contam como lançamentos nesta documentação.

:::

**Tabela 4.1 Caminhos de degradação para o MySQL Server**

<table><col width="25%"/><col width="15%"/><col width="30%"/><col width="30%"/><thead><tr> <th scope="col">Descer o caminho</th> <th scope="col">Exemplos de Caminhos</th> <th scope="col">Métodos de degradação suportados</th> <th scope="col">Notas</th> </tr></thead><tbody><tr> <th>Dentro de uma série LTS</th> <td><p>8.4.y LTS para 8.4.x LTS</p></td> <td>In-place, despejo lógico e carga, clone MySQL, ou usando replicação</td> <td></td> </tr><tr> <th>De uma série LTS ou Bugfix para a série LTS ou Bugfix anterior</th> <td>8.4.x LTS para 8.0.y</td> <td>Descarga e carga lógicas ou através da replicação</td> <td>Só é suportado para efeitos de reversão (ou seja, se não tiver sido aplicada nenhuma nova funcionalidade de servidor aos dados)</td> </tr><tr> <th>De uma série LTS ou Bugfix para uma série Innovation<span><em>após a série LTS anterior</em></span></th> <td>8.4.x LTS para 8.3.0 Inovação</td> <td>Descarga e carga lógicas ou através da replicação</td> <td>Só é suportado para efeitos de reversão (ou seja, se não tiver sido aplicada nenhuma nova funcionalidade de servidor aos dados)</td> </tr><tr> <th>Dentro de uma série de Inovação</th> <td>9.5 a 9.4</td> <td>Descarga e carga lógicas ou através da replicação</td> <td>Só é suportado para efeitos de reversão (ou seja, se não tiver sido aplicada nenhuma nova funcionalidade de servidor aos dados)</td> </tr></tbody></table>

A atualização para MySQL 5.7 ou anterior não é suportada.
