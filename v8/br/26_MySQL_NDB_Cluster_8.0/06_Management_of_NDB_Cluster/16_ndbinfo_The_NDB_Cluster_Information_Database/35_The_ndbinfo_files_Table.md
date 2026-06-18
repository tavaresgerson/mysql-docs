#### 25.6.16.35 Tabela dos arquivos ndbinfo

As tabelas `files` fornecem informações sobre os arquivos e outros objetos utilizados pelas tabelas de dados de disco `NDB` e contêm as colunas listadas aqui:

- `id`

  ID do objeto

- `type`

  O tipo de objeto; um dos `Log file group`, `Tablespace`, `Undo file` ou `Data file`

- `name`

  O nome do objeto

- `parent`

  ID do objeto pai

- `parent_name`

  Nome do objeto pai

- `free_extents`

  Número de extensões gratuitas

- `total_extents`

  Número total de extensões

- `extent_size`

  Tamanho da extensão (MB)

- `initial_size`

  Tamanho inicial (bytes)

- `maximum_size`

  Tamanho máximo (bytes)

- `autoextend_size`

  Tamanho de autoextensão (bytes)

Para grupos de arquivos de registro e espaços de tabelas, `parent` é sempre `0`, e as colunas `parent_name`, `free_extents`, `total_extents`, `extent_size`, `initial_size`, `maximum_size` e `autoentend_size` são todas `NULL`.

A tabela `files` está vazia se nenhum objeto de dados de disco foi criado em `NDB`. Consulte a Seção 25.6.11.1, “Objetos de Dados de Disco de NDB Cluster”, para obter mais informações.

A tabela `files` foi adicionada no NDB 8.0.29.

Veja também a Seção 28.3.15, “A Tabela INFORMATION\_SCHEMA FILES”.
