#### 21.4.3.8 Definição do Sistema

A seção `[system]` é usada para parâmetros aplicáveis ao cluster como um todo. O parâmetro de sistema [`Name`](mysql-cluster-system-definition.html#ndbparam-system-name) é usado com o MySQL Enterprise Monitor; [`ConfigGenerationNumber`](mysql-cluster-system-definition.html#ndbparam-system-configgenerationnumber) e [`PrimaryMGMNode`](mysql-cluster-system-definition.html#ndbparam-system-primarymgmnode) não são usados em ambientes de produção. Exceto ao usar o NDB Cluster com o MySQL Enterprise Monitor, não é necessário ter uma seção `[system]` no arquivo `config.ini`.

Mais informações sobre esses parâmetros podem ser encontradas na lista a seguir:

* [`ConfigGenerationNumber`](mysql-cluster-system-definition.html#ndbparam-system-configgenerationnumber)

  <table frame="box" rules="all" summary="Informações sobre tipo e valor do parâmetro de configuração de sistema ConfigGenerationNumber" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Número de geração da configuração. Este parâmetro está atualmente sem uso.

* [`Name`](mysql-cluster-system-definition.html#ndbparam-system-name)

  <table frame="box" rules="all" summary="Informações sobre tipo e valor do parâmetro de configuração de sistema Name" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Define um nome para o cluster. Este parâmetro é obrigatório para implantações com MySQL Enterprise Monitor; caso contrário, não é usado.

  Você pode obter o valor deste parâmetro verificando a variável de status [`Ndb_system_name`](mysql-cluster-options-variables.html#statvar_Ndb_system_name). Em aplicações da NDB API, você também pode recuperá-lo usando [`get_system_name()`](/doc/ndbapi/en/ndb-ndb-cluster-connection.html#ndb-ndb-cluster-connection-get-system-name).

* [`PrimaryMGMNode`](mysql-cluster-system-definition.html#ndbparam-system-primarymgmnode)

  <table frame="box" rules="all" summary="Informações sobre tipo e valor do parâmetro de configuração de sistema PrimaryMGMNode" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart de Node: </strong></span>Requer um rolling restart do cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  ID do Node (Node ID) do Node de gerenciamento primário. Este parâmetro está atualmente sem uso.

**Tipos de Restart.** As informações sobre os tipos de Restart usados nas descrições de parâmetros nesta seção são mostradas na tabela a seguir:

**Tabela 21.17 Tipos de Restart do NDB Cluster**

<table><col style="width: 10%"/><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Símbolo</th> <th>Tipo de Restart</th> <th>Descrição</th> </tr></thead><tbody><tr> <th>N</th> <td>Node</td> <td>O parâmetro pode ser atualizado usando um rolling restart (veja Seção 21.6.5, “Executando um Rolling Restart de um NDB Cluster”)</td> </tr><tr> <th>S</th> <td>Sistema</td> <td>Todos os Nodes do cluster devem ser completamente desligados e, em seguida, reiniciados (restartados), para que uma alteração neste parâmetro entre em vigor</td> </tr><tr> <th>I</th> <td>Inicial</td> <td>Os Nodes de dados devem ser restartados usando a opção <code>--initial</code></td> </tr></tbody></table>
