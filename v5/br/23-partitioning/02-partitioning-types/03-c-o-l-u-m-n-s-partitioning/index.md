### 22.2.3 COLUNAS Partição

22.2.3.1 Partição de COLUNAS DE ÁREA

22.2.3.2 Partição de COLUNAS DA LISTA

As duas seções seguintes discutem a partição `COLUMNS`, que são variantes da partição `RANGE` e `LIST`. A partição `COLUMNS` permite o uso de múltiplas colunas nas chaves de partição. Todas essas colunas são levadas em consideração tanto para o propósito de colocar as linhas em partições quanto para determinar quais partições devem ser verificadas em busca de linhas correspondentes na poda de partições.

Além disso, tanto a partição `RANGE COLUMNS` quanto a partição `LIST COLUMNS` suportam o uso de colunas não inteiras para definir faixas de valores ou membros de listas. Os tipos de dados permitidos estão listados na seguinte tabela:

- Todos os tipos inteiros: `TINYINT`, `SMALLINT`, `MEDIUMINT`, `INT` (`INTEGER`) e `BIGINT`. (Isso é o mesmo que com a partição por `RANGE` e `LIST`.)

  Outros tipos de dados numéricos (como `DECIMAL` ou `FLOAT`) não são suportados como colunas de partição.

- `DATA` e `DATA E HORA`.

  Colunas que utilizam outros tipos de dados relacionados a datas ou horários não são suportadas como colunas de particionamento.

- Os seguintes tipos de cadeia: `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY`.

  As colunas `TEXT` e `BLOB` não são suportadas como colunas de particionamento.

As discussões sobre a partição de `COLUNAS DE ÁREA` e `COLUNAS DE LISTA` nas próximas duas seções pressupõem que você já esteja familiarizado com a partição baseada em intervalos e listas, conforme suportado no MySQL 5.1 e versões posteriores; para mais informações sobre isso, consulte Seção 22.2.1, “Partição de Intervalo” e Seção 22.2.2, “Partição de Lista”, respectivamente.
