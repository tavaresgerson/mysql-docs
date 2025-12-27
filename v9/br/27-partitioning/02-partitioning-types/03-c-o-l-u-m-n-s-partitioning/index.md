### 26.2.3 Partição de Colunas

26.2.3.1 Partição de Colunas de Ámbito

26.2.3.2 Partição de Colunas de Lista

As duas seções seguintes discutem a partição de `COLUMNS`, que são variantes da partição de `RANGE` e `LIST`. A partição de `COLUMNS` permite o uso de múltiplas colunas nas chaves de partição. Todas essas colunas são consideradas tanto para o propósito de colocar linhas em partições quanto para a determinação de quais partições devem ser verificadas em busca de linhas correspondentes na poda de partições.

Além disso, tanto a partição de `RANGE COLUMNS` quanto a partição de `LIST COLUMNS` suportam o uso de colunas não inteiras para definir faixas de valores ou membros de lista. Os tipos de dados permitidos estão listados na seguinte lista:

* Todos os tipos inteiros: `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (`INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")), e `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). (Isso é o mesmo que com a partição por `RANGE` e `LIST`.)

Outros tipos de dados numéricos (como `DECIMAL` - DECIMAL, NUMERIC") ou `FLOAT` - FLOAT, DOUBLE")) não são suportados como colunas de partição.

* `DATE` e `DATETIME`.

  Colunas que usam outros tipos de dados relacionados a datas ou horários não são suportadas como colunas de partição.

* Os seguintes tipos de string: `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY`.

  Colunas `TEXT` e `BLOB` não são suportadas como colunas de partição.

As discussões sobre a partição de `COLUNAS DE ÁREA` e `COLUNAS DE LISTA` nas próximas duas seções pressupõem que você já esteja familiarizado com a partição baseada em intervalos e listas, conforme suportado no MySQL 5.1 e versões posteriores; para mais informações sobre isso, consulte a Seção 26.2.1, “Partição de Intervalo”, e a Seção 26.2.2, “Partição de Lista”, respectivamente.