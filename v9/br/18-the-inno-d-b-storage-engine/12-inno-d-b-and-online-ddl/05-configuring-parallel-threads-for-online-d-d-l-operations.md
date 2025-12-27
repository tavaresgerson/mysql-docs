### 17.12.5 Configurando Threads Paralelas para Operações DDL Online

O fluxo de trabalho de uma operação DDL online que cria ou reconstrui um índice secundário envolve:

* Escaneamento do índice agrupado e gravação de dados em arquivos temporários de ordenação
* Ordenação dos dados
* Carregamento dos dados ordenados dos arquivos temporários de ordenação para o índice secundário

O número de threads paralelas que podem ser usados para escanear o índice agrupado é definido pela variável `innodb_parallel_read_threads`. O ajuste padrão é calculado pelo número de processadores lógicos disponíveis no sistema dividido por 8, com um valor padrão mínimo de 4. O ajuste máximo é de 256, que é o número máximo para todas as sessões. O número real de threads que escanea o índice agrupado é o número definido pela configuração `innodb_parallel_read_threads` ou o número de subárvores de índice a serem escaneadas, o que for menor. Se o limite de threads for atingido, as sessões retornam a usar um único thread.

O número de threads paralelas que ordenam e carregam dados é controlado pela variável `innodb_ddl_threads`. O ajuste padrão é de 4.

As seguintes limitações se aplicam:

* Threads paralelas não são suportadas para a construção de índices que incluem colunas virtuais.
* Threads paralelas não são suportadas para a criação de índices de texto completo.
* Threads paralelas não são suportadas para a criação de índices espaciais.
* Varredura paralela não é suportada em tabelas definidas com colunas virtuais.
* Varredura paralela não é suportada em tabelas definidas com um índice de texto completo.
* Varredura paralela não é suportada em tabelas definidas com um índice espacial.