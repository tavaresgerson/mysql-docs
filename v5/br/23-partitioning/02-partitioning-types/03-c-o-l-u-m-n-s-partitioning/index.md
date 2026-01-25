### 22.2.3 Particionamento COLUMNS

[22.2.3.1 Particionamento RANGE COLUMNS](partitioning-columns-range.html)

[22.2.3.2 Particionamento LIST COLUMNS](partitioning-columns-list.html)

As próximas duas seções discutem o particionamento `COLUMNS`, que são variantes do particionamento `RANGE` e `LIST`. O particionamento `COLUMNS` permite o uso de múltiplas colunas nas chaves de particionamento (partitioning keys). Todas essas colunas são levadas em consideração tanto para o propósito de alocar linhas nas partitions quanto para a determinação de quais partitions devem ser verificadas em busca de linhas correspondentes durante o partition pruning.

Além disso, tanto o particionamento `RANGE COLUMNS` quanto o particionamento `LIST COLUMNS` suportam o uso de colunas não inteiras para definir faixas de valores (value ranges) ou membros da lista (list members). Os tipos de dados permitidos são mostrados na lista a seguir:

* Todos os tipos inteiros: [`TINYINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), [`SMALLINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), [`MEDIUMINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ([`INTEGER`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")), e [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). (Isso é o mesmo que ocorre com o particionamento por `RANGE` e `LIST`.)

  Outros tipos de dados numéricos (como [`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC") ou [`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")) não são suportados como colunas de particionamento (partitioning columns).

* [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") e [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types").

  Colunas que usam outros tipos de dados relacionados a datas ou horas não são suportadas como colunas de particionamento (partitioning columns).

* Os seguintes tipos string: [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), e [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types").

  Colunas [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") e [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") não são suportadas como colunas de particionamento (partitioning columns).

As discussões sobre o particionamento `RANGE COLUMNS` e `LIST COLUMNS` nas próximas duas seções pressupõem que você já esteja familiarizado com o particionamento baseado em ranges e lists, conforme suportado no MySQL 5.1 e posterior; para mais informações sobre estes, consulte [Seção 22.2.1, “Particionamento RANGE”](partitioning-range.html "22.2.1 RANGE Partitioning"), e [Seção 22.2.2, “Particionamento LIST”](partitioning-list.html "22.2.2 LIST Partitioning"), respectivamente.