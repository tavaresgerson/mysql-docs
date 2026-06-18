#### 29.12.3.1 A tabela cond\_instances

A tabela `cond_instances` lista todas as condições observadas pelo Schema de Desempenho enquanto o servidor está em execução. Uma condição é um mecanismo de sincronização usado no código para sinalizar que um evento específico ocorreu, para que um thread que está esperando por essa condição possa retomar o trabalho.

Quando um fio está esperando algo acontecer, o nome da condição é uma indicação do que o fio está esperando, mas não há uma maneira imediata de saber qual outro fio ou quais outros fios causam a condição de acontecer.

A tabela `cond_instances` tem essas colunas:

- `NAME`

  O nome do instrumento associado à condição.

- `OBJECT_INSTANCE_BEGIN`

  O endereço em memória da condição instrumentada.

A tabela `cond_instances` tem esses índices:

- Chave primária em (`OBJECT_INSTANCE_BEGIN`)
- Índice sobre (`NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `cond_instances`.
