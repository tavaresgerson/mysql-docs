#### 21.4.3.4 Definindo Computadores em um NDB Cluster

A seção `[computer]` não tem real importância além de servir como uma forma de evitar a necessidade de definir nomes de host (host names) para cada node no sistema. Todos os parâmetros mencionados aqui são obrigatórios.

* `Id`

  <table frame="box" rules="all" summary="Informações sobre tipo e valor do parâmetro de configuração Id computer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Restart Inicial do Sistema: </strong></span>Requer o desligamento completo do cluster, limpando e restaurando o sistema de arquivos do cluster a partir de um backup, e então reiniciando o cluster. (NDB 7.5.0) </p></td> </tr> </tbody></table>

  Este é um identificador exclusivo, usado para se referir ao computador host em outras partes do arquivo de configuração.

  Importante

  O ID do computador *não* é o mesmo que o Node ID usado para um node de gerência (management), API ou de dados (data node). Ao contrário do que acontece com os Node IDs, você não pode usar `NodeId` no lugar de `Id` na seção `[computer]` do arquivo `config.ini`.

* `HostName`

  <table frame="box" rules="all" summary="Informações sobre tipo e valor do parâmetro de configuração HostName computer" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de Restart</th> <td><p> <span><strong>Node Restart: </strong></span>Requer um rolling restart (restart progressivo) do cluster. (NDB 7.5.0) </p></td> </tr> </tbody></table>

  Este é o hostname ou o endereço IP do computador.

**Tipos de Restart.** As informações sobre os tipos de restart utilizados nas descrições de parâmetros desta seção são apresentadas na tabela a seguir:

**Tabela 21.7 Tipos de restart do NDB Cluster**

<table><col style="width: 10%"/><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Símbolo</th> <th>Tipo de Restart</th> <th>Descrição</th> </tr></thead><tbody><tr> <th>N</th> <td>Node</td> <td>O parâmetro pode ser atualizado usando um rolling restart (restart progressivo) (consulte a Seção 21.6.5, “Executando um Rolling Restart de um NDB Cluster”)</td> </tr><tr> <th>S</th> <td>Sistema</td> <td>Todos os nodes do cluster devem ser completamente desligados e, em seguida, reiniciados para que uma alteração neste parâmetro entre em vigor</td> </tr><tr> <th>I</th> <td>Inicial</td> <td>Os data nodes devem ser reiniciados usando a opção <code>--initial</code></td> </tr></tbody></table>
