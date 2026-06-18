### 26.2.3 COLUNAS Partição

26.2.3.1 Partição de colunas de intervalo

26.2.3.2 Partição de colunas de lista

As próximas duas seções discutem a partição `COLUMNS`, que são variantes da partição `RANGE` e `LIST`. A partição `COLUMNS` permite o uso de múltiplas colunas nas chaves de partição. Todas essas colunas são levadas em consideração tanto para o propósito de colocar as linhas em partições quanto para determinar quais partições devem ser verificadas em busca de linhas correspondentes na poda de partições.

Além disso, tanto o particionamento `RANGE COLUMNS` quanto o particionamento `LIST COLUMNS` suportam o uso de colunas não inteiras para definir faixas de valores ou membros de listas. Os tipos de dados permitidos estão listados na seguinte tabela:

- Todos os tipos inteiros: `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (`INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")), e `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). (Isto é o mesmo que com a partição por `RANGE` e `LIST`.)

  Outros tipos de dados numéricos (como `DECIMAL` - DECIMAL, NUMERIC") ou `FLOAT` - FLOAT, DOUBLE")) não são suportados como colunas de particionamento.

- `DATE` e `DATETIME`.

  Colunas que utilizam outros tipos de dados relacionados a datas ou horários não são suportadas como colunas de particionamento.

- Os seguintes tipos de string: `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY`.

  As colunas `TEXT` e `BLOB` não são suportadas como colunas de particionamento.

As discussões sobre a partição `RANGE COLUMNS` e `LIST COLUMNS` nas próximas duas seções pressupõem que você já esteja familiarizado com a partição baseada em faixas e listas, conforme suportado no MySQL 5.1 e versões posteriores; para mais informações sobre essas opções, consulte a Seção 26.2.1, “Partição por Faixa”, e a Seção 26.2.2, “Partição por Lista”, respectivamente.
