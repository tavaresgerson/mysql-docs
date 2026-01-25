### 14.8.4 Configurando o Alocador de Memória para InnoDB

Quando o `InnoDB` foi desenvolvido, os alocadores de memória fornecidos com os sistemas operacionais e bibliotecas de tempo de execução (run-time libraries) frequentemente careciam de desempenho e escalabilidade. Naquela época, não havia bibliotecas de alocadores de memória otimizadas (tuned) para CPUs multi-core. Portanto, o `InnoDB` implementou seu próprio alocador de memória no subsistema `mem`. Este alocador é protegido por um único Mutex, que pode se tornar um bottleneck. O `InnoDB` também implementa uma interface wrapper em torno do alocador do sistema (`malloc` e `free`) que também é protegida por um único Mutex.

Hoje, à medida que os sistemas multi-core se tornaram mais amplamente disponíveis e os sistemas operacionais amadureceram, melhorias significativas foram feitas nos alocadores de memória fornecidos com eles. Esses novos alocadores de memória têm melhor desempenho e são mais escaláveis do que eram no passado. A maioria das cargas de trabalho (workloads), especialmente aquelas onde a memória é alocada e liberada frequentemente (como em JOINs de múltiplas tabelas), se beneficia do uso de um alocador de memória mais otimizado em comparação ao alocador de memória interno, específico do `InnoDB`.

Você pode controlar se o `InnoDB` usa seu próprio alocador de memória ou um alocador do sistema operacional, definindo o valor do parâmetro de configuração de sistema `innodb_use_sys_malloc` no arquivo de opções do MySQL (`my.cnf` ou `my.ini`). Se configurado para `ON` ou `1` (o padrão), o `InnoDB` usa as funções `malloc` e `free` do sistema subjacente em vez de gerenciar os pools de memória por conta própria. Este parâmetro não é dinâmico e só entra em vigor quando o sistema é iniciado. Para continuar a usar o alocador de memória do `InnoDB`, defina `innodb_use_sys_malloc` como `0`.

Quando o alocador de memória do `InnoDB` está desativado, o `InnoDB` ignora o valor do parâmetro `innodb_additional_mem_pool_size`. O alocador de memória do `InnoDB` usa um pool de memória adicional para satisfazer as solicitações de alocação sem ter que recorrer ao alocador de memória do sistema. Quando o alocador de memória do `InnoDB` é desativado, todas essas solicitações de alocação são atendidas pelo alocador de memória do sistema.

Em sistemas tipo Unix que usam linking dinâmico, substituir o alocador de memória pode ser tão fácil quanto fazer com que a variável de ambiente `LD_PRELOAD` ou `LD_LIBRARY_PATH` aponte para a biblioteca dinâmica que implementa o alocador. Em outros sistemas, pode ser necessário algum religamento (relinking). Consulte a documentação da biblioteca de alocador de memória de sua escolha.

Uma vez que o `InnoDB` não pode rastrear todo o uso de memória quando o alocador de memória do sistema é utilizado (`innodb_use_sys_malloc` está `ON`), a seção “BUFFER POOL AND MEMORY” na saída do comando `SHOW ENGINE INNODB STATUS` inclui apenas as estatísticas do Buffer Pool em “Total memory allocated”. Qualquer memória alocada usando o subsistema `mem` ou usando `ut_malloc` é excluída.

Nota

`innodb_use_sys_malloc` e `innodb_additional_mem_pool_size` foram descontinuados (deprecated) no MySQL 5.6 e removidos no MySQL 5.7.

Para mais informações sobre as implicações de desempenho do uso de memória do `InnoDB`, consulte a Seção 8.10, “Buffering and Caching”.