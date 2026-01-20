#### 25.12.3.1 A tabela cond_instances

A tabela `cond_instances` lista todas as condições observadas pelo Schema de Desempenho enquanto o servidor está em execução. Uma condição é um mecanismo de sincronização usado no código para sinalizar que um evento específico ocorreu, para que um thread que está esperando por essa condição possa retomar o trabalho.

Quando um thread está esperando algo acontecer, o nome da condição é uma indicação do que o thread está esperando, mas não há uma maneira imediata de saber quais outros fios causam a condição de acontecer.

A tabela `cond_instances` tem as seguintes colunas:

- `NOME`

  O nome do instrumento associado à condição.

- `OBJECT_INSTANCE_BEGIN`

  O endereço em memória da condição instrumentada.

A operação `TRUNCATE TABLE` não é permitida para a tabela `cond_instances`.
