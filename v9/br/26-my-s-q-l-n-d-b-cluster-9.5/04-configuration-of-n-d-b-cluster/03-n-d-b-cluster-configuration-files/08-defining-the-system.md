#### 25.4.3.8 Definindo o Sistema

A seção `[system]` é usada para parâmetros que se aplicam ao clúster como um todo. O parâmetro de sistema `Name` é usado com o MySQL Enterprise Monitor; `ConfigGenerationNumber` e `PrimaryMGMNode` não são usados em ambientes de produção. Exceto quando se usa o NDB Cluster com o MySQL Enterprise Monitor, não é necessário ter uma seção `[system]` no arquivo `config.ini`.

Mais informações sobre esses parâmetros podem ser encontradas na lista a seguir:

* `ConfigGenerationNumber`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração `ConfigGenerationNumber`" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>unsigned</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Intervalo</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reinício de nó: </strong></span>Requer um reinício Rolling do clúster. (NDB 9.5.0)</p></td> </tr></tbody></table>

  Número de geração de configuração. Este parâmetro atualmente não é usado.

* `Name`

<table frame="box" rules="all" summary="Parâmetro de configuração do sistema de nome e informações do tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>string</td></tr><tr><th>Padrão</th><td>[...]</td></tr><tr><th>Intervalo</th><td>...</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício de nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

Defina um nome para o cluster. Este parâmetro é necessário para implantações com o MySQL Enterprise Monitor; caso contrário, não é utilizado.

Você pode obter o valor deste parâmetro verificando a variável `Ndb_system_name`. Em aplicativos da API NDB, também pode obtê-lo usando `get_system_name()`.

* `PrimaryMGMNode`

<table frame="box" rules="all" summary="Parâmetro de configuração do sistema PrimaryMGMNode e informações do tipo e valor" width="35%"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr><th>Versão (ou posterior)</th><td>NDB 9.5.0</td></tr><tr><th>Tipo ou unidades</th><td>unsigned</td></tr><tr><th>Padrão</th><td>0</td></tr><tr><th>Intervalo</th><td>0 - 4294967039 (0xFFFFFEFF)</td></tr><tr><th>Tipo de reinício</th><td><p><span><strong>Reinício de nó: </strong></span>Requer um reinício Rolling do cluster. (NDB 9.5.0)</p></td></tr></tbody></table>

ID do nó do nó de gerenciamento primário. Este parâmetro atualmente não é utilizado.

**Tipos de reinício.** As informações sobre os tipos de reinício usados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 25.18 Tipos de reinício de cluster NDB**

<table><col style="width: 10%"/><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Símbolo</th> <th>Tipo de Reinício</th> <th>Descrição</th> </tr></thead><tbody><tr> <th>N</th> <td>Nó</th> <td>O parâmetro pode ser atualizado usando um reinício contínuo (consulte Seção 25.6.5, “Realizando um Reinício Contínuo de um Cluster NDB”)</td> </tr><tr> <th>S</th> <td>Sistema</th> <td>Todos os nós do cluster devem ser desligados completamente e, em seguida, reiniciados para efetuar uma mudança neste parâmetro</td> </tr><tr> <th>I</th> <td>Inicial</th> <td>Os nós de dados devem ser reiniciados usando a opção <code>--initial</code></td> </tr></tbody></table>