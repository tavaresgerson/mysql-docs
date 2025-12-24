## 3.2 Caminhos de atualização

::: info Notes

- Certifique-se de que você entende o modelo de lançamento do MySQL para as versões de suporte de longo prazo (LTS) e inovação do MySQL antes de prosseguir com uma atualização.
- Recomendamos verificar a compatibilidade de atualização com o Utilitário de Verificador de Atualização do MySQL Shell antes de executar uma atualização.
- Uma topologia de replicação é atualizada seguindo o esquema de atualização contínua descrito na secção 19.5.3, "Upgrading or Downgrading a Replication Topology", que utiliza um dos métodos de servidor único suportados para cada atualização de servidor individual.
- As atualizações rápidas mensais (MRUs) e as correcções rápidas também contam como lançamentos nesta documentação.

:::

**Tabela 3.1 Caminhos de atualização para o MySQL Server**

<table><thead><tr> <th>Caminho de atualização</th> <th>Exemplos de Caminhos</th> <th>Métodos de atualização suportados</th> </tr></thead><tbody><tr> <th>Dentro de uma série LTS ou Bugfix</th> <td>8.0.37 a 8.0.41 ou 8.4.0 a 8.4.4</td> <td>Atualização no local, descarga e carregamento lógico, replicação e clone MySQL</td> </tr><tr> <th>De uma série LTS ou Bugfix para a próxima série LTS</th> <td>8.0.37 a 8.4.x LTS</td> <td>Reforço no local, descarga e carga lógicas e replicação</td> </tr><tr> <th>De uma versão LTS ou Bugfix para uma versão Innovation<span><em>antes da próxima série LTS</em></span></th> <td>8.0.34 a 8.3.0 ou 8.4.0 a 9.0.0</td> <td>Reforço no local, descarga e carga lógicas e replicação</td> </tr><tr> <th>De uma série Innovation para a próxima série LTS</th> <td>8.3.0 a 8.4 LTS</td> <td>Reforço no local, descarga e carga lógicas e replicação</td> </tr><tr> <th>De uma série de Inovação a um lançamento de Inovação<span><em>após a próxima série LTS</em></span></th> <td>Não é permitido, são necessárias duas etapas: 8.3.0 a 8.4 LTS e 8.4 LTS a 9.x Inovação</td> <td>Reforço no local, descarga e carga lógicas e replicação</td> </tr><tr> <th>Dentro de uma série de Inovação</th> <td>8.1.0 a 8.3.0</td> <td>Reforço no local, descarga e carga lógicas e replicação</td> </tr><tr> <th>Do MySQL 5.7 para uma versão LTS ou Innovation</th> <td>MySQL 5.7 a 8.4</td> <td>Uma correção de bugs ou série LTS não pode ser ignorada, então neste exemplo primeiro atualize o MySQL 5.7 para o MySQL 8.0, e depois atualize o MySQL 8.0 para o MySQL 8.4.</td> </tr></tbody></table>
