#### 29.12.3.1 A tabela cond_instances

A tabela `cond_instances` lista todas as condições observadas pelo Schema de Desempenho enquanto o servidor está em execução. Uma condição é um mecanismo de sincronização usado no código para sinalizar que um evento específico ocorreu, para que um thread que está esperando por essa condição possa retomar o trabalho.

Quando um thread está esperando que algo aconteça, o nome da condição é uma indicação do que o thread está esperando, mas não há uma maneira imediata de saber qual outro thread ou quais outros threads causam a condição.

A tabela `cond_instances` tem essas colunas:

* `NOME`

  O nome do instrumento associado à condição.

* `OBJECT_INSTANCE_BEGIN`

  O endereço na memória da condição instrumentada.

A tabela `cond_instances` tem esses índices:

* Chave primária em (`OBJECT_INSTANCE_BEGIN`)
* Índice em (`NOME`)

O `TRUNCATE TABLE` não é permitido para a tabela `cond_instances`.