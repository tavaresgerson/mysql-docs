#### 29.12.3.2 A tabela `file_instances`

A tabela `file_instances` lista todos os arquivos vistos pelo Schema de Desempenho ao executar a instrumentação de E/S de arquivos. Se um arquivo no disco nunca tiver sido aberto, ele não será exibido na `file_instances`. Quando um arquivo é excluído do disco, ele também é removido da tabela `file_instances`.

A tabela `file_instances` tem as seguintes colunas:

* `FILE_NAME`

  O nome do arquivo.

* `EVENT_NAME`

  O nome do instrumento associado ao arquivo.

* `OPEN_COUNT`

  O número de contatos abertos no arquivo. Se um arquivo foi aberto e depois fechado, ele foi aberto 1 vez, mas `OPEN_COUNT` é 0. Para listar todos os arquivos atualmente abertos pelo servidor, use `WHERE OPEN_COUNT > 0`.

A tabela `file_instances` tem os seguintes índices:

* Chave primária em (`FILE_NAME`)
* Índice em (`EVENT_NAME`)

O `TRUNCATE TABLE` não é permitido para a tabela `file_instances`.