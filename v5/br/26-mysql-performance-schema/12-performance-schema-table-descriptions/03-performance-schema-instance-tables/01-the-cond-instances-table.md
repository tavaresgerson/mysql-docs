#### 25.12.3.1 A Tabela cond_instances

A tabela [`cond_instances`](performance-schema-cond-instances-table.html "25.12.3.1 The cond_instances Table") lista todas as *conditions* vistas pelo Performance Schema enquanto o servidor está em execução. Uma *condition* é um mecanismo de sincronização usado no código para sinalizar que um evento específico ocorreu, de modo que um *thread* esperando por esta *condition* possa retomar o trabalho.

Quando um *thread* está esperando que algo aconteça, o nome da *condition* é uma indicação do que o *thread* está esperando, mas não há uma maneira imediata de saber quais outros *threads* causam a ocorrência da *condition*.

A tabela [`cond_instances`](performance-schema-cond-instances-table.html "25.12.3.1 The cond_instances Table") possui as seguintes colunas:

* `NAME`

  O nome do instrumento associado à *condition*.

* `OBJECT_INSTANCE_BEGIN`

  O endereço na memória da *condition* instrumentada.

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitido para a tabela [`cond_instances`](performance-schema-cond-instances-table.html "25.12.3.1 The cond_instances Table").