### 22.2.3 Particionamento COLUMNS

22.2.3.1 Particionamento RANGE COLUMNS

22.2.3.2 Particionamento LIST COLUMNS

As próximas duas seções discutem o particionamento `COLUMNS`, que são variantes do particionamento `RANGE` e `LIST`. O particionamento `COLUMNS` permite o uso de múltiplas colunas nas chaves de particionamento (partitioning keys). Todas essas colunas são levadas em consideração tanto para o propósito de alocar linhas nas partitions quanto para a determinação de quais partitions devem ser verificadas em busca de linhas correspondentes durante o partition pruning.

Além disso, tanto o particionamento `RANGE COLUMNS` quanto o particionamento `LIST COLUMNS` suportam o uso de colunas não inteiras para definir faixas de valores (value ranges) ou membros da lista (list members). Os tipos de dados permitidos são mostrados na lista a seguir:

* Todos os tipos inteiros: `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (`INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")), e `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). (Isso é o mesmo que ocorre com o particionamento por `RANGE` e `LIST`.)

  Outros tipos de dados numéricos (como `DECIMAL` - DECIMAL, NUMERIC") ou `FLOAT` - FLOAT, DOUBLE")) não são suportados como colunas de particionamento (partitioning columns).

* `DATE` e `DATETIME`.

  Colunas que usam outros tipos de dados relacionados a datas ou horas não são suportadas como colunas de particionamento (partitioning columns).

* Os seguintes tipos string: `CHAR`, `VARCHAR`, `BINARY`, e `VARBINARY`.

  Colunas `TEXT` e `BLOB` não são suportadas como colunas de particionamento (partitioning columns).

As discussões sobre o particionamento `RANGE COLUMNS` e `LIST COLUMNS` nas próximas duas seções pressupõem que você já esteja familiarizado com o particionamento baseado em ranges e lists, conforme suportado no MySQL 5.1 e posterior; para mais informações sobre estes, consulte Seção 22.2.1, “Particionamento RANGE”, e Seção 22.2.2, “Particionamento LIST”, respectivamente.