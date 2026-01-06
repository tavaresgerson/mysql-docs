#### 26.4.3.32 A visão schema\_unused\_indexes

Essas visualizações exibem índices para os quais não há eventos, o que indica que eles não estão sendo usados. Por padrão, as linhas são ordenadas por esquema e tabela.

Essa visualização é muito útil quando o servidor está ativo e processando por tempo suficiente para que sua carga de trabalho seja representativa. Caso contrário, a presença de um índice nessa visualização pode não ter significado.

A visão `schema_unused_indexes` tem essas colunas:

- `objeto_esquema`

  O nome do esquema.

- `nome_objeto`

  O nome da tabela.

- `nome_do_índice`

  O nome do índice não utilizado.
