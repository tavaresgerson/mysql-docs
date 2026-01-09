#### 21.4.3.8 Definindo o Sistema

A seção `[system]` é usada para parâmetros que se aplicam ao conjunto como um todo. O parâmetro de sistema `Name` é usado com o MySQL Enterprise Monitor; `ConfigGenerationNumber` e `PrimaryMGMNode` não são usados em ambientes de produção. Exceto quando se usa o NDB Cluster com o MySQL Enterprise Monitor, não é necessário ter uma seção `[system]` no arquivo `config.ini`.

Mais informações sobre esses parâmetros podem ser encontradas na lista a seguir:

- `ConfigGenerationNumber`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração do sistema ConfigGenerationNumber" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Número de geração de configuração. Este parâmetro não é atualmente utilizado.

- `Nome`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do sistema de nome" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Defina um nome para o grupo. Este parâmetro é necessário para implantações com o MySQL Enterprise Monitor; caso contrário, ele não será utilizado.

  Você pode obter o valor deste parâmetro verificando a variável de status `Ndb_system_name`. Em aplicativos da API NDB, você também pode obtê-lo usando `get_system_name()`.

- `PrimaryMGMNode`

  <table frame="box" rules="all" summary="Tipo e valor das informações do parâmetro de configuração do sistema PrimaryMGMNode" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>não assinado</td> </tr><tr> <th>Padrão</th> <td>0</td> </tr><tr> <th>Gama</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span><strong>Reiniciar o nó:</strong></span>Requer umreinício em rotaçãodo aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  ID do nó do nó de gerenciamento primário. Este parâmetro atualmente não é utilizado.

**Tipos de reinício.** As informações sobre os tipos de reinício utilizados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 21.17 Tipos de reinício de cluster do NDB**

<table><col style="width: 10%"/><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Símbolo</th> <th>Tipo de reinício</th> <th>Descrição</th> </tr></thead><tbody><tr> <th>N</th> <td>Nó</td> <td>O parâmetro pode ser atualizado usando um reinício contínuo (consulteSeção 21.6.5, “Realizar um Reinício Rotativo de um NDB Cluster”)</td> </tr><tr> <th>S</th> <td>Sistema</td> <td>Todos os nós do cluster devem ser desligados completamente e, em seguida, reiniciados para efetuar uma alteração neste parâmetro.</td> </tr><tr> <th>Eu</th> <td>Inicial</td> <td>Os nós de dados devem ser reiniciados usando o[[<code>--initial</code>]]opção</td> </tr></tbody></table>
