### 22.4.3 Documentos e Coleções

22.4.3.1 Criar, listar e excluir coleções

22.4.3.2 Trabalhando com Coleções

22.4.3.3 Encontrar documentos

22.4.3.4 Modificar documentos

22.4.3.5 Remover documentos

22.4.3.6 Criar e Remover Índices

Quando você está usando o MySQL como uma Armazenamento de Documentos, as coleções são contêineres dentro de um esquema que você pode criar, listar e descartar. As coleções contêm documentos JSON que você pode adicionar, encontrar, atualizar e remover.

Os exemplos nesta seção usam a coleção `countryinfo` no esquema `world_x`. Para obter instruções sobre como configurar o esquema `world_x`, consulte a Seção 22.4.2, “Baixar e importar o banco de dados world\_x”.

#### Documentos

No MySQL, os documentos são representados como objetos JSON. Internamente, eles são armazenados em um formato binário eficiente que permite buscas e atualizações rápidas.

- Formato de documento simples para Python:

  ```
  {"field1": "value", "field2" : 10, "field 3": null}
  ```

Um conjunto de documentos consiste em um conjunto de documentos separados por vírgulas e encerrados entre os caracteres `[` e `]`.

- Array simples de documentos para Python:

  ```
  [{"Name": "Aruba", "Code:": "ABW"}, {"Name": "Angola", "Code:": "AGO"}]
  ```

O MySQL suporta os seguintes tipos de valor Python em documentos JSON:

- números (inteiros e de ponto flutuante)
- cordas
- boolean (Falso e Verdadeiro)
- Nenhum
- arrays de mais valores JSON
- objetos aninhados (ou embutidos) de mais valores JSON

#### Coleções

As coleções são containers para documentos que compartilham um propósito e, possivelmente, compartilham um ou mais índices. Cada coleção tem um nome único e existe dentro de um único esquema.

O termo esquema é equivalente a um banco de dados, o que significa um grupo de objetos de banco de dados, em oposição a um esquema relacional, usado para impor estrutura e restrições aos dados. Um esquema não impõe conformidade aos documentos de uma coleção.

Neste guia de início rápido:

- Os objetos básicos incluem:

  <table summary="Objetos para uso interativo no MySQL Shell"><thead><tr> <th>Forma do objeto</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[<code>db</code>]]</td> <td>[[<code>db</code>]] é uma variável global atribuída ao esquema ativo atual. Quando você deseja executar operações contra o esquema, por exemplo, para recuperar uma coleção, você usa métodos disponíveis para a variável [[<code>db</code>]].</td> </tr><tr> <td>[[<code>db.get_collections()</code>]]</td> <td>db.get_collections() retorna uma lista de coleções no esquema. Use a lista para obter referências aos objetos de coleção, iterar sobre eles e assim por diante.</td> </tr></tbody></table>

- As operações básicas definidas por coleções incluem:

  <table summary="Operações CRUD disponíveis no X DevAPI"><thead><tr> <th>Formulário de operação</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[<code>db.<em class="replaceable"><code>name</code>]]</em>.add()</code></td> <td>O método add() insere um documento ou uma lista de documentos na coleção nomeada.</td> </tr><tr> <td>[[<code>db.<em class="replaceable"><code>name</code>]]</em>.find()</code></td> <td>O método find() retorna alguns ou todos os documentos na coleção nomeada.</td> </tr><tr> <td>[[<code>db.<em class="replaceable"><code>name</code>]]</em>.modificar()</code></td> <td>O método modify() atualiza documentos na coleção nomeada.</td> </tr><tr> <td>[[<code>db.<em class="replaceable"><code>name</code>]]</em>.remove()</code></td> <td>O método remove() exclui um documento ou uma lista de documentos da coleção nomeada.</td> </tr></tbody></table>

#### Informações Relacionadas

- Veja Trabalhando com Coleções para uma visão geral.

- As definições CRUD EBNF fornecem uma lista completa das operações.
