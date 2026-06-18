### 17.12.5 Configurando Threads Paralelas para Operações DDL Online

O fluxo de trabalho de uma operação online de DDL que cria ou reconstrui um índice secundário envolve:

- Escaneando o índice agrupado e escrevendo dados em arquivos temporários de classificação

- Classificação dos dados

- Carregando dados ordenados dos arquivos de classificação temporários para o índice secundário

O número de threads paralelas que podem ser usadas para escanear um índice agrupado é definido pela variável `innodb_parallel_read_threads`. O valor padrão é 4. O valor máximo é 256, que é o número máximo para todas as sessões. O número real de threads que escanea o índice agrupado é o número definido pelo ajuste `innodb_parallel_read_threads` ou o número de subárvores do índice a serem escaneadas, o que for menor. Se o limite de threads for atingido, as sessões retornam a usar uma única thread.

O número de threads paralelas que fazem a classificação e o carregamento de dados é controlado pela variável `innodb_ddl_threads`, introduzida no MySQL 8.0.27. O ajuste padrão é 4. Antes do MySQL 8.0.27, as operações de classificação e carregamento são realizadas por uma única thread.

As seguintes limitações se aplicam:

- Os fios paralelos não são suportados para a construção de índices que incluem colunas virtuais.

- Os fios paralelos não são suportados para a criação de índices de texto completo.

- Os fios paralelos não são suportados para a criação de índices espaciais.

- O varredura paralela não é suportada em tabelas definidas com colunas virtuais.

- O varredura paralela não é suportada em tabelas definidas com um índice de texto completo.

- O varredura paralela não é suportada em tabelas definidas com um índice espacial.
