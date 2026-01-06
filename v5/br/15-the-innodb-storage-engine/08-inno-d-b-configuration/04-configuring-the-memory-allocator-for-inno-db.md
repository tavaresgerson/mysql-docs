### 14.8.4 Configurando o alocador de memória para o InnoDB

Quando o `InnoDB` foi desenvolvido, os alocadores de memória fornecidos pelos sistemas operacionais e pelas bibliotecas de tempo de execução frequentemente apresentavam desempenho e escalabilidade insuficientes. Naquela época, não havia bibliotecas de alocador de memória adaptadas para CPUs multi-core. Portanto, o `InnoDB` implementou seu próprio alocador de memória no subsistema `mem`. Esse alocador é protegido por um único mutex, que pode se tornar um gargalo. O `InnoDB` também implementa uma interface de wrapper em torno do alocador do sistema (`malloc` e `free`), que também é protegida por um único mutex.

Hoje, com os sistemas multicore se tornando mais amplamente disponíveis e com os sistemas operacionais amadurecendo, melhorias significativas foram feitas nos alocadores de memória fornecidos pelos sistemas operacionais. Esses novos alocadores de memória funcionam melhor e são mais escaláveis do que no passado. A maioria das cargas de trabalho, especialmente aquelas em que a memória é alocada e liberada frequentemente (como junções de várias tabelas), se beneficia do uso de um alocador de memória mais otimizado, em vez do alocador de memória interno, específico para o `InnoDB`.

Você pode controlar se o `InnoDB` usa seu próprio alocador de memória ou um alocador do sistema operacional, definindo o valor do parâmetro de configuração do sistema `innodb_use_sys_malloc` no arquivo de opções do MySQL (`my.cnf` ou `my.ini`). Se definido como `ON` ou `1` (o padrão), o `InnoDB` usa as funções `malloc` e `free` do sistema subjacente em vez de gerenciar pools de memória por conta própria. Este parâmetro não é dinâmico e só entra em vigor quando o sistema é iniciado. Para continuar usando o alocador de memória do `InnoDB`, defina `innodb_use_sys_malloc` para `0`.

Quando o alocador de memória `InnoDB` é desativado, o `InnoDB` ignora o valor do parâmetro `innodb_additional_mem_pool_size`. O alocador de memória `InnoDB` usa um pool de memória adicional para atender às solicitações de alocação sem precisar recorrer ao alocador de memória do sistema. Quando o alocador de memória `InnoDB` é desativado, todas essas solicitações de alocação são atendidas pelo alocador de memória do sistema.

Em sistemas semelhantes ao Unix que utilizam vincular dinamicamente, substituir o alocador de memória pode ser tão fácil quanto fazer a variável de ambiente `LD_PRELOAD` ou `LD_LIBRARY_PATH` apontar para a biblioteca dinâmica que implementa o alocador. Em outros sistemas, pode ser necessário algum relinking. Consulte a documentação da biblioteca de alocador de memória que você escolher.

Como o `InnoDB` não pode rastrear todo o uso de memória quando o alocador de memória do sistema é usado (`innodb_use_sys_malloc` está ativado), a seção “POOL DE BUFFER E MEMÓRIA” no resultado do comando `SHOW ENGINE INNODB STATUS` inclui apenas as estatísticas do pool de buffers na opção “Memória total alocada”. Qualquer memória alocada usando o subsistema `mem` ou usando `ut_malloc` é excluída.

Nota

`innodb_use_sys_malloc` e `innodb_additional_mem_pool_size` foram desaconselhados no MySQL 5.6 e removidos no MySQL 5.7.

Para obter mais informações sobre as implicações de desempenho do uso de memória do InnoDB, consulte a Seção 8.10, “Buffering and Caching”.
