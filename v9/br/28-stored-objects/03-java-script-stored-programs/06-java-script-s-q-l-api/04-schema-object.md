#### 27.3.6.4 Objeto do Esquema

O objeto `Schema` representa um esquema de banco de dados. Você pode obter uma instância do `Schema` chamando o método `getSchema()` do objeto `Session`; você também pode obter uma lista de todos os bancos de dados disponíveis chamando `getSchemas()`.

O `Schema` suporta os métodos listados aqui:

* `existsInDatabase()`: Retorna `true` se o esquema existir, caso contrário, `false`.

* `getTable(String name)`: Retorna a `Table` com o *`name`* especificado.

* `getTables()`: Retorna uma lista de tabelas (`Table` objetos) existentes neste `Schema`.

* `getName()`: Retorna o nome do `Schema` (uma `String`).

* `getName()`: Retorna o `Schema` em si.

* `getSession()`: Retorna o objeto `Session` correspondente à sessão atual.