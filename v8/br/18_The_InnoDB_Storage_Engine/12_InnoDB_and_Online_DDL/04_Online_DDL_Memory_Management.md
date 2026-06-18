### 17.12.4 Gerenciamento de Memória DDL Online

As operações DDL online que criam ou reconstroem índices secundários alocam tampões temporários durante diferentes fases da criação do índice. A variável `innodb_ddl_buffer_size`, introduzida no MySQL 8.0.27, define o tamanho máximo do tampão para operações DDL online. O ajuste padrão é de 1048576 bytes (1 MB). O ajuste se aplica aos tampões criados por threads que executam operações DDL online. Definir um limite de tamanho de tampão apropriado evita potenciais erros de falta de memória para operações DDL online que criam ou reconstroem índices secundários. O tamanho máximo do tampão por thread DDL é o tamanho máximo do tampão dividido pelo número de threads DDL (`innodb_ddl_buffer_size`/`innodb_ddl_threads`).

Antes do MySQL 8.0.27, a variável `innodb_sort_buffer_size` define o tamanho do buffer para operações DDL online que criam ou reconstroem índices secundários.
