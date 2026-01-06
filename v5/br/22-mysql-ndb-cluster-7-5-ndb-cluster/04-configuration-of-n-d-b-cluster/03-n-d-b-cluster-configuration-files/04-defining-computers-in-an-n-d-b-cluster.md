#### 21.4.3.4 Definindo Computadores em um Clúster NDB

A seção `[computer]` não tem importância real, exceto por servir como uma maneira de evitar a necessidade de definir nomes de host para cada nó no sistema. Todos os parâmetros mencionados aqui são obrigatórios.

- `Id`

  <table frame="box" rules="all" summary="Tipo e valor da configuração do computador do ID" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício inicial do sistema:</strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de<a class="link" href="mysql-cluster-backup.html" title="21.6.8 Backup online do NDB Cluster">backup</a>, e, em seguida, reinicie o clúster. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Este é um identificador único, usado para se referir ao computador hospedeiro em outros lugares do arquivo de configuração.

  Importante

  O ID do computador *não* é o mesmo que o ID do nó usado para uma gestão, API ou nó de dados. Ao contrário do que acontece com os IDs de nó, você não pode usar `NodeId` no lugar de `Id` na seção `[computer]` do arquivo `config.ini`.

- `HostName`

  <table frame="box" rules="all" summary="Tipo e informações de valor do parâmetro de configuração do HostName" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>nome ou endereço IP</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Gama</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reiniciar o nó:</strong></span>Requer um<a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">reinício em rotação</a>do aglomerado. (NDB 7.5.0)</p></td> </tr></tbody></table>

  Este é o nome do computador ou o endereço IP.

**Tipos de reinício.** As informações sobre os tipos de reinício utilizados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 21.7 Tipos de reinício de cluster do NDB**

<table><col style="width: 10%"/><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th scope="col">Símbolo</th> <th scope="col">Tipo de reinício</th> <th scope="col">Descrição</th> </tr></thead><tbody><tr> <th scope="row">N</th> <td>Nó</td> <td>O parâmetro pode ser atualizado usando um reinício contínuo (consulte<a class="xref" href="mysql-cluster-rolling-restart.html" title="21.6.5 Realizar um Reinício Rotativo de um Clúster NDB">Seção 21.6.5, “Realizar um Reinício Rotativo de um NDB Cluster”</a>)</td> </tr><tr> <th scope="row">S</th> <td>Sistema</td> <td>Todos os nós do cluster devem ser desligados completamente e, em seguida, reiniciados para efetuar uma alteração neste parâmetro.</td> </tr><tr> <th scope="row">Eu</th> <td>Inicial</td> <td>Os nós de dados devem ser reiniciados usando o<a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial">[[<code class="option">--initial</code>]]</a>opção</td> </tr></tbody></table>
