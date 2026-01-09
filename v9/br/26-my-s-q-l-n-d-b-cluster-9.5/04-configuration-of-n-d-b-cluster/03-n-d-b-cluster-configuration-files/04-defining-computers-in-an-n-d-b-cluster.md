#### 25.4.3.4 Definindo Computadores em um Clúster NDB

A seção `[computer]` não tem significado real, exceto para servir como uma maneira de evitar a necessidade de definir nomes de host para cada nó no sistema. Todos os parâmetros mencionados aqui são obrigatórios.

* `Id`

  <table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração de computador `Id`"><tr><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Versão (ou posterior)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Tipo ou unidades</th> <td>string</td> </tr><tr> <th>Padrão</th> <td>[...]</td> </tr><tr> <th>Intervalo</th> <td>...</td> </tr><tr> <th>Tipo de reinício</th> <td><p> <span class="bold"><strong>Reinício Inicial do Sistema: </strong></span>Requer o desligamento completo do clúster, apagando e restaurando o sistema de arquivos do clúster a partir de um <a class="link" href="mysql-cluster-backup.html" title="25.6.8 Backup Online do Clúster NDB">backup</a>, e depois reiniciando o clúster. (NDB 9.5.0) </p></td> </tr></tbody></table>

  Este é um identificador único, usado para referenciar o computador host em outros lugares no arquivo de configuração.

  Importante

  O ID do computador *não* é o mesmo que o ID do nó usado para um nó de gerenciamento, API ou nó de dados. Ao contrário do caso dos IDs de nó, você não pode usar `NodeId` no lugar de `Id` na seção `[computer]` do arquivo `config.ini`.

* `HostName`

<table frame="box" rules="all" summary="Informações sobre o tipo e o valor do parâmetro de configuração do host do computador" width="35%">
  <col style="width: 50%"/><col style="width: 50%"/>
  <tbody>
    <tr>
      <th>Versão (ou superior)</th>
      <td>NDB 9.5.0</td>
    </tr>
    <tr>
      <th>Tipo ou unidades</th>
      <td>nome ou endereço IP</td>
    </tr>
    <tr>
      <th>Padrão</th>
      <td>[...]</td>
    </tr>
    <tr>
      <th>Intervalo</th>
      <td>...</td>
    </tr>
    <tr>
      <th>Tipo de reinício</th>
      <td><p> <span class="bold"><strong>Reinício de nó: </strong></span>Requer um <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um reinício Rolling de um NDB Cluster" target="_blank">reinício Rolling</a> do cluster. (NDB 9.5.0)</p></td>
    </tr>
  </tbody>
</table>

Este é o nome do host ou endereço IP do computador.

**Tipos de reinício.** As informações sobre os tipos de reinício usados pelas descrições dos parâmetros nesta seção estão mostradas na tabela a seguir:

**Tabela 25.7 Tipos de reinício do NDB Cluster**

<table><col style="width: 10%"/><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Símbolo</th> <th>Tipo de Reinício</th> <th>Descrição</th> </tr></thead><tbody><tr> <th>N</th> <td>Núcleo</td> <td>O parâmetro pode ser atualizado usando um reinício contínuo (consulte <a class="xref" href="mysql-cluster-rolling-restart.html" title="25.6.5 Realizando um Reinício Contínuo de um NDB Cluster">Seção 25.6.5, “Realizando um Reinício Contínuo de um NDB Cluster”</a>)</td> </tr><tr> <th>S</th> <td>Sistema</td> <td>Todos os nós do cluster devem ser desligados completamente e, em seguida, reiniciados para efetuar uma mudança neste parâmetro</td> </tr><tr> <th>I</th> <td>Inicial</td> <td>Os nós de dados devem ser reiniciados usando a opção <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code>--initial</code></a></td> </tr></tbody></table>