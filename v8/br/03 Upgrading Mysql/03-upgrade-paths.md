## 3.2 Caminhos de Atualização

::: info Notas

* Certifique-se de entender o modelo de lançamento do MySQL para as versões de longo suporte (LTS) e inovação do MySQL antes de prosseguir com uma atualização para uma versão anterior.
* Recomendamos verificar a compatibilidade da atualização com o Ferramenta de Verificação de Atualização do MySQL Shell antes de realizar uma atualização.
* A topologia de replicação é atualizada seguindo o esquema de atualização contínua descrito na Seção 19.5.3, “Atualizando ou Desatualizando uma Topologia de Replicação”, que utiliza um dos métodos de servidor único suportados para cada atualização de servidor individual.
* As Atualizações Rápidas Mensais (MRUs) e as correções em tempo real também são consideradas lançamentos nesta documentação.

:::

**Tabela 3.1 Caminhos de Atualização para o MySQL Server**

<table><thead><tr> <th>Caminho de Atualização</th> <th>Exemplos de Caminhos</th> <th>Métodos de Atualização Suportado</th> </tr></thead><tbody><tr> <th>Dentro de uma Série LTS ou Bugfix</th> <td>8.0.37 para 8.0.41 ou 8.4.0 para 8.4.4</td> <td>Atualização local, dump lógico e carga, replicação e MySQL Clone</td> </tr><tr> <th>De uma Série LTS ou Bugfix para a próxima Série LTS</th> <td>8.0.37 para 8.4.x LTS</td> <td>Atualização local, dump lógico e carga, e replicação</td> </tr><tr> <th>De uma Série LTS ou Bugfix para uma Série de Inovação <span><em>antes da próxima Série LTS</em></span></th> <td>8.0.34 para 8.3.0 ou 8.4.0 para 9.0.0</td> <td>Atualização local, dump lógico e carga, e replicação</td> </tr><tr> <th>De uma Série de Inovação para a próxima Série LTS</th> <td>8.3.0 para 8.4 LTS</td> <td>Atualização local, dump lógico e carga, e replicação</td> </tr><tr> <th>De uma Série de Inovação para uma Série de Inovação <span><em>depois da próxima Série LTS</em></span></th> <td>Não permitido, são necessários dois passos: 8.3.0 para 8.4 LTS, e 8.4 LTS para 9.x Inovação</td> <td>Atualização local, dump lógico e carga, e replicação</td> </tr><tr> <th>Dentro de uma Série de Inovação</th> <td>8.1.0 para 8.3.0</td> <td>Atualização local, dump lógico e carga, e replicação</td> </tr><tr> <th>De MySQL 5.7 para uma Série LTS ou Inovação</th> <td>MySQL 5.7 para 8.4</td> <td>Uma série de bugfix ou LTS não pode ser ignorada, então, neste exemplo, primeiro atualize o MySQL 5.7 para o MySQL 8.0, e depois atualize o MySQL 8.0 para o MySQL 8.4.</td> </tr></tbody></table>