#### 25.6.15.39 A tabela ndbinfo hwinfo

A tabela `hwinfo` fornece informações sobre o hardware no qual um dado nó de dados executa.

A tabela `hwinfo` contém as seguintes colunas:

* `node_id`

  ID do nó

* `cpu_cnt_max`

  Número de processadores neste host

* `cpu_cnt`

  Número de processadores disponíveis para este nó

* `num_cpu_cores`

  Número de núcleos de CPU neste host

* `num_cpu_sockets`

  Número de soquetes de CPU neste host

* `HW_memory_size`

  Quantidade de memória disponível neste host

* `model_name`

  Nome do modelo de CPU

##### Notas

A tabela `hwinfo` está disponível em todos os sistemas operacionais suportados pelo `NDB`.