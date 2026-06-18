### 19.4.7 Melhorar o desempenho da replicação

À medida que o número de réplicas que se conectam a uma fonte aumenta, a carga, embora mínima, também aumenta, pois cada réplica usa uma conexão de cliente para a fonte. Além disso, como cada réplica deve receber uma cópia completa do log binário da fonte, a carga na rede da fonte também pode aumentar e criar um gargalo.

Se você estiver usando um grande número de réplicas conectadas a uma única fonte e essa fonte também estiver ocupada processando solicitações (por exemplo, como parte de uma solução de escalabilidade), talvez queira melhorar o desempenho do processo de replicação.

Uma maneira de melhorar o desempenho do processo de replicação é criar uma estrutura de replicação mais profunda que permita que a fonte se replique apenas para uma replica, e que as demais replicas se conectem a essa replica primária para atender às suas necessidades individuais de replicação. Uma amostra dessa estrutura é mostrada na Figura 19.3, “Usando uma Fonte de Replicação Adicionada para Melhorar o Desempenho”.

**Figura 19.3: Uso de uma fonte de replicação adicional para melhorar o desempenho**

![The server MySQL Source 1 replicates to the server MySQL Source 2, which in turn replicates to the servers MySQL Replica 1, MySQL Replica 2, and MySQL Replica 3.](images/subsource-performance.png)

Para que isso funcione, você deve configurar as instâncias do MySQL da seguinte forma:

- A Fonte 1 é a fonte principal onde todas as alterações e atualizações são escritas no banco de dados. O registro binário está habilitado em ambos os servidores de origem, o que é o padrão.

- A Fonte 2 é a réplica do servidor Fonte 1 que fornece a funcionalidade de replicação para o restante das réplicas na estrutura de replicação. A Fonte 2 é a única máquina permitida para se conectar à Fonte 1. A Fonte 2 tem a opção `--log-slave-updates` habilitada (que é a opção padrão). Com essa opção, as instruções de replicação da Fonte 1 também são escritas no log binário da Fonte 2, para que possam então ser replicadas para as verdadeiras réplicas.

- A Replica 1, a Replica 2 e a Replica 3 atuam como réplicas da Fonte 2 e replicaram as informações da Fonte 2, que, na verdade, consistem nos upgrades registrados na Fonte 1.

A solução acima reduz a carga do cliente e a carga da interface de rede na fonte primária, o que deve melhorar o desempenho geral da fonte primária quando usada como solução de banco de dados direto.

Se suas réplicas estiverem tendo dificuldades para acompanhar o processo de replicação na fonte, há várias opções disponíveis:

- Se possível, coloque os logs do relé e os arquivos de dados em unidades físicas diferentes. Para fazer isso, defina a variável de sistema `relay_log` para especificar o local do log do relé.

- Se a atividade de E/S de disco pesada para leituras do arquivo de log binário e dos arquivos de log de retransmissão for um problema, considere aumentar o valor da variável de sistema `rpl_read_size`. Esta variável de sistema controla a quantidade mínima de dados lidos dos arquivos de log, e aumentá-la pode reduzir as leituras de arquivos e as travagens de E/S quando os dados do arquivo não estão atualmente cacheados pelo sistema operacional. Observe que um buffer do tamanho deste valor é alocado para cada thread que lê dos arquivos de log binário e de log de retransmissão, incluindo threads de dump em fontes e threads de coordenador em réplicas. Portanto, definir um valor grande pode ter um impacto no consumo de memória para os servidores.

- Se as réplicas forem significativamente mais lentas que a fonte, você pode querer dividir a responsabilidade pela replicação de diferentes bancos de dados entre diferentes réplicas. Consulte a Seção 19.4.6, “Replicação de Diferentes Bancos de Dados em Diferentes Réplicas”.

- Se a sua fonte utilizar transações e você não se preocupar com o suporte a transações nas suas réplicas, use `MyISAM` ou outro motor não transacional nas réplicas. Veja a Seção 19.4.4, “Usando a Replicação com Diferentes Motores de Armazenamento de Fonte e Replicação”.

- Se suas réplicas não estiverem atuando como fontes e você tiver uma solução potencial para garantir que possa recuperar uma fonte em caso de falha, você pode desabilitar a variável de sistema `log_replica_updates` (a partir do MySQL 8.0.26) ou `log_slave_updates` (antes do MySQL 8.0.26) nas réplicas. Isso impede que réplicas "estúpidas" também registrem eventos que executaram em seu próprio log binário.
