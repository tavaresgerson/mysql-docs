#### 27.3.6.5 Objeto `Table`

O objeto `Table` representa uma tabela de banco de dados

* `existsInDatabase()`: Retorna `true` se a tabela existir no banco de dados atual, caso contrário, `false`.

* `count()`: Retorna o número de linhas nesta tabela se ela existir no banco de dados atual, caso contrário, lança um erro.

* `isView()`: Retorna `true` se a tabela for uma visualização, caso contrário, `false`.

Consulte também a Seção 27.6, “Usando Visualizações”, para obter mais informações sobre visualizações de banco de dados no MySQL.

* `getName()`: Retorna o nome da `Table` (uma `String`).

* `getName()`: Retorna o `Schema` no qual esta tabela reside.

* `getSession()`: Retorna o objeto `Session` correspondente à sessão atual.