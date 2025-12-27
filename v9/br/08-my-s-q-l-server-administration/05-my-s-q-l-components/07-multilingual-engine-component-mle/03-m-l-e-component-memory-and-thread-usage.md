#### 7.5.7.3 Memória do Compósito MLE e Uso de Fios

Informações sobre a alocação e o uso da memória do componente MLE podem ser obtidas verificando os valores das variáveis de status `mle_heap_status` e `mle_memory_used`. A memória não é alocada até que o componente seja ativado, criando ou executando um programa armazenado que utilize JavaScript. Isso significa que, até que o componente esteja ativo, o valor de `mle_heap_status` será `Não Alocado` e `mle_memory_used` será `0`. Quando o componente estiver ativo, `mle_heap_status` deve ser `Alocado`, e `mle_memory_used` deve ser um inteiro no intervalo de 0 a 100, inclusive; a última variável indica a memória usada pelo componente MLE como uma porcentagem da quantidade alocada para ele, arredondada para o número inteiro mais próximo. Também é possível que `mle_heap_status` seja `Coleta de Lixo`, caso seja necessário recuperar memória que não esteja mais sendo usada.

Por padrão, a quantidade de memória alocada para o componente MLE é calculada usando a fórmula: (0,05) \* (memória física total em GB), e mantida dentro do intervalo de 0,4 GB a 32 GB. Você pode ajustar isso definindo a variável de sistema `mle.memory_max` até um máximo de 8 GB (8589934592 bytes); o valor mínimo possível é 32 MB. Ao aumentar isso, você deve ter em mente que deve permanecer memória suficiente para outros usos pelo servidor MySQL e para que os processos do sistema funcionem corretamente.

Definir `mle.memory_max` para um valor maior que a quantidade total de memória no sistema causa comportamento indefinido.

Importante

Você pode alterar a quantidade de memória alocada para o componente MLE apenas quando o componente estiver inativo. Para definir a alocação para um valor não padrão no momento da instalação, use uma instrução como `INSTALL COMPONENT 'file://component_mle' SET GLOBAL mle.memory_max = 1024*1024*512`, ou defina-a após a instalação, mas antes de usar qualquer programa JavaScript armazenado.

Você pode obter o número de erros de falta de memória que foram gerados por programas armazenados no MLE consultando o valor da variável de status `mle_oom_errors`.

Para obter informações sobre os threads usados pelo componente Multilingual Engine, você pode consultar a variável de status `mle_threads`, que mostra o número atual de threads físicos conectados ao GraalVM. `mle_threads_max` mostra o número máximo de threads físicos simultâneos conectados ao GraalVM em qualquer momento desde que o componente se tornou ativo.