#### 25.12.3.2 A tabela file_instances

A tabela `file_instances` lista todos os arquivos vistos pelo Schema de Desempenho ao executar a instrumentação de E/S de arquivos. Se um arquivo no disco nunca tiver sido aberto, ele não estará na tabela `file_instances`. Quando um arquivo é excluído do disco, ele também é removido da tabela `file_instances`.

A tabela `file_instances` tem as seguintes colunas:

- `NOME_DO_ARQUIVO`

  O nome do arquivo.

- `NOME_DO_Evento`

  O nome do instrumento associado ao arquivo.

- `OPEN_COUNT`

  O número de abas abertas no arquivo. Se um arquivo foi aberto e depois fechado, ele foi aberto 1 vez, mas `OPEN_COUNT` é 0. Para listar todos os arquivos atualmente abertos pelo servidor, use `WHERE OPEN_COUNT > 0`.

A operação `TRUNCATE TABLE` não é permitida para a tabela `file_instances`.
