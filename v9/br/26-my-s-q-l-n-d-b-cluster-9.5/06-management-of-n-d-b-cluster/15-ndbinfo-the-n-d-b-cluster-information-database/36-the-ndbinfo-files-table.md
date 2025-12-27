#### 25.6.15.36 Tabela de arquivos ndbinfo

A tabela `files` fornece informações sobre arquivos e outros objetos utilizados pelas tabelas de dados de disco `NDB`, e contém as colunas listadas aqui:

* `id`

  ID do objeto

* `type`

  O tipo do objeto; um dos valores `Grupo de arquivos de registro`, `Espaço de tabelas`, `Arquivo de desfazer` ou `Arquivo de dados`

* `name`

  O nome do objeto

* `parent`

  ID do objeto pai

* `parent_name`

  Nome do objeto pai

* `free_extents`

  Número de extensões livres

* `total_extents`

  Número total de extensões

* `extent_size`

  Tamanho da extensão (MB)

* `initial_size`

  Tamanho inicial (bytes)

* `maximum_size`

  Tamanho máximo (bytes)

* `autoextend_size`

  Tamanho de autoextensão (bytes)

Para grupos de arquivos de registro e espaços de tabelas, `parent` é sempre `0`, e as colunas `parent_name`, `free_extents`, `total_extents`, `extent_size`, `initial_size`, `maximum_size` e `autoextend_size` são todas `NULL`.

A tabela `files` está vazia se nenhum objeto de dados de disco `NDB` tiver sido criado. Consulte a Seção 25.6.11.1, “Objetos de dados de disco em cluster NDB”, para obter mais informações.

Veja também a Seção 28.3.15, “A tabela de arquivos INFORMATION_SCHEMA FILES”.