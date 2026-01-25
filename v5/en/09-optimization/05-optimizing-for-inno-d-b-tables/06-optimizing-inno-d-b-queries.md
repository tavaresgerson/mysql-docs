### 8.5.6 Otimizando Queries InnoDB

Para otimizar Queries para tabelas `InnoDB`, crie um conjunto apropriado de Indexes em cada tabela. Consulte a Seção 8.3.1, “Como o MySQL Usa Indexes” para obter detalhes. Siga estas diretrizes para Indexes `InnoDB`:

* Como cada tabela `InnoDB` possui uma Primary Key (solicitando você uma ou não), especifique um conjunto de colunas de Primary Key para cada tabela, colunas que são usadas nas Queries mais importantes e críticas em termos de tempo.

* Não especifique muitas colunas ou colunas muito longas na Primary Key, pois esses valores de coluna são duplicados em cada Secondary Index. Quando um Index contém dados desnecessários, o I/O para ler esses dados e a memória para armazená-los em cache reduzem a performance e a escalabilidade do servidor.

* Não crie um Secondary Index separado para cada coluna, pois cada Query pode utilizar apenas um Index. Indexes em colunas raramente testadas ou em colunas com apenas alguns valores diferentes podem não ser úteis para nenhuma Query. Se você tiver muitas Queries para a mesma tabela, testando diferentes combinações de colunas, tente criar um pequeno número de Indexes concatenados em vez de um grande número de Indexes de coluna única. Se um Index contiver todas as colunas necessárias para o conjunto de resultados (conhecido como *covering index*), a Query pode ser capaz de evitar a leitura dos dados da tabela por completo.

* Se uma coluna indexada não puder conter valores `NULL`, declare-a como `NOT NULL` ao criar a tabela. O *optimizer* pode determinar melhor qual Index é mais eficaz para ser usado em uma Query, quando sabe se cada coluna contém valores `NULL`.

* Você pode otimizar transações de Query única para tabelas `InnoDB`, usando a técnica descrita na Seção 8.5.3, “Otimizando Transações Read-Only InnoDB”.