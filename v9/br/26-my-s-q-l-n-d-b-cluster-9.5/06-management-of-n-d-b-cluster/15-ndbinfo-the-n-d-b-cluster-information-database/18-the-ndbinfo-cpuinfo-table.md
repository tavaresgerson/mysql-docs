#### 25.6.15.18 A tabela ndbinfo cpuinfo

A tabela `cpuinfo` fornece informações sobre a CPU na qual um dado nó de dados é executado.

A tabela `cpuinfo` contém as seguintes colunas:

* `node_id`

  ID do nó

* `cpu_no`

  ID da CPU

* `cpu_online`

  1 se a CPU estiver online, caso contrário 0

* `core_id`

  ID do núcleo da CPU

* `socket_id`

  ID do soquete da CPU

##### Notas

A tabela `cpuinfo` está disponível em todos os sistemas operacionais suportados pelo `NDB`, com exceção do MacOS e do FreeBSD.