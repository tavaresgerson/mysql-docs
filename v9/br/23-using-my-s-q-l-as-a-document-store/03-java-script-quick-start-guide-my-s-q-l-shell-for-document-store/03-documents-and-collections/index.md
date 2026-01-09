### 22.3.3 Documentos e Coleções

22.3.3.1 Criar, Listar e Remover Coleções

22.3.3.2 Trabalhar com Coleções

22.3.3.3 Encontrar Documentos

22.3.3.4 Modificar Documentos

22.3.3.5 Remover Documentos

22.3.3.6 Criar e Remover Índices

Ao usar o MySQL como um Armazenamento de Documentos, as coleções são recipientes dentro de um esquema que você pode criar, listar e remover. As coleções contêm documentos JSON que você pode adicionar, encontrar, atualizar e remover.

Os exemplos nesta seção usam a coleção `countryinfo` no esquema `world_x`. Para instruções sobre como configurar o esquema `world_x`, consulte a Seção 22.3.2, “Baixar e Importar o Banco de Dados world\_x”.

#### Documentos

No MySQL, os documentos são representados como objetos JSON. Internamente, eles são armazenados em um formato binário eficiente que permite buscas e atualizações rápidas.

* Formato simples de documento para JavaScript:

  ```
  {field1: "value", field2 : 10, "field 3": null}
  ```

Um array de documentos consiste em um conjunto de documentos separados por vírgulas e encerrados entre os caracteres `[` e `]` .

* Array simples de documentos para JavaScript:

  ```
  [{"Name": "Aruba", "Code:": "ABW"}, {"Name": "Angola", "Code:": "AGO"}]
  ```

O MySQL suporta os seguintes tipos de valor JavaScript em documentos JSON:

* números (inteiro e ponto flutuante)
* strings
* booleano (Falso e Verdadeiro)
* null
* arrays de mais valores JSON
* objetos aninhados (ou embutidos) de mais valores JSON

#### Coleções

As coleções são recipientes para documentos que compartilham um propósito e, possivelmente, compartilham um ou mais índices. Cada coleção tem um nome único e existe dentro de um único esquema.

O termo esquema é equivalente a um banco de dados, o que significa um grupo de objetos de banco de dados, em oposição a um esquema relacional, usado para impor estrutura e restrições sobre os dados. Um esquema não impõe conformidade nos documentos de uma coleção.

Neste guia rápido:

* Objetos básicos incluem:

<table summary="Objetos para uso interativo no MySQL Shell"><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Objeto</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>db</code></td> <td><code>db</code> é uma variável global atribuída ao esquema ativo atual. Quando você deseja executar operações no esquema, por exemplo, para recuperar uma coleção, você usa os métodos disponíveis para a variável <code>db</code>.</td> </tr><tr> <td><code>db.getCollections()</code></td> <td><a class="link" href="mysql-shell-tutorial-javascript-collections-operations.html#mysql-shell-tutorial-javascript-collections-get" title="Listar Coleções">db.getCollections()</a> retorna uma lista de coleções no esquema. Use a lista para obter referências aos objetos de coleção, iterar sobre eles, e assim por diante.</td> </tr></tbody></table>

* As operações básicas definidas por coleções incluem:

<table summary="Operações CRUD disponíveis no X DevAPI"><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Formulário da operação</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.add()</code></td> <td>O método <a class="link" href="mysql-shell-tutorial-javascript-collections-add.html" title="22.3.3.2 Trabalhando com Coleções">add()</a> insere um documento ou uma lista de documentos na coleção nomeada.</td> </tr><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.find()</code></td> <td>O método <a class="link" href="mysql-shell-tutorial-javascript-documents-find.html" title="22.3.3.3 Encontrar Documentos">find()</a> retorna alguns ou todos os documentos na coleção nomeada.</td> </tr><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.modify()</code></td> <td>O método <a class="link" href="mysql-shell-tutorial-javascript-documents-modify.html" title="22.3.3.4 Modificar Documentos">modify()</a> atualiza documentos na coleção nomeada.</td> </tr><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.remove()</code></td> <td>O método <a class="link" href="mysql-shell-tutorial-javascript-documents-remove.html" title="22.3.3.5 Remover Documentos">remove()</a> exclui um documento ou uma lista de documentos da coleção nomeada.</td> </tr></tbody></table>

#### Informações Relacionadas

* Veja Trabalhando com Coleções para uma visão geral geral.

* Definições EBNF CRUD fornece uma lista completa das operações.