#### 25.12.3.2 A Tabela file_instances

A Tabela `file_instances` lista todos os arquivos vistos pelo Performance Schema ao executar a instrumentação de file I/O. Se um arquivo no disco nunca foi aberto, ele não está em `file_instances`. Quando um arquivo é excluído do disco, ele também é removido da Tabela `file_instances`.

A Tabela `file_instances` possui as seguintes colunas:

* `FILE_NAME`

  O nome do arquivo (file name).

* `EVENT_NAME`

  O nome do instrumento (instrument name) associado ao arquivo.

* `OPEN_COUNT`

  A contagem de *handles* abertos no arquivo. Se um arquivo foi aberto e depois fechado, ele foi aberto 1 vez, mas `OPEN_COUNT` é 0. Para listar todos os arquivos atualmente abertos pelo server, use `WHERE OPEN_COUNT > 0`.

`TRUNCATE TABLE` não é permitido para a Tabela `file_instances`.