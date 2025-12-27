### 19.4.7 Melhorando o Desempenho da Replicação

À medida que o número de réplicas conectadas a uma fonte aumenta, a carga, embora mínima, também aumenta, pois cada réplica usa uma conexão cliente com a fonte. Além disso, como cada réplica deve receber uma cópia completa do log binário da fonte, a carga na rede da fonte também pode aumentar e criar um gargalo.

Se você estiver usando um grande número de réplicas conectadas a uma única fonte e essa fonte também estiver ocupada processando solicitações (por exemplo, como parte de uma solução de escalabilidade), então você pode querer melhorar o desempenho do processo de replicação.

Uma maneira de melhorar o desempenho do processo de replicação é criar uma estrutura de replicação mais profunda que permita que a fonte replique para apenas uma réplica e que as réplicas restantes se conectem a essa réplica primária para atender às suas necessidades individuais de replicação. Uma amostra dessa estrutura é mostrada na Figura 19.3, “Usando uma Fonte de Replicação Adicionada para Melhorar o Desempenho”.

**Figura 19.3 Usando uma Fonte de Replicação Adicionada para Melhorar o Desempenho**

![O servidor MySQL Fonte 1 replica para o servidor MySQL Fonte 2, que por sua vez replica para os servidores MySQL Replica 1, MySQL Replica 2 e MySQL Replica 3.](images/subsource-performance.png)

Para que isso funcione, você deve configurar as instâncias do MySQL da seguinte forma:

* A Fonte 1 é a fonte primária onde todas as alterações e atualizações são escritas ao banco de dados. O registro binário está habilitado em ambos os servidores de fonte, o que é o padrão.

* A Fonte 2 é a réplica do servidor Fonte 1 que fornece a funcionalidade de replicação para o restante das réplicas na estrutura de replicação. A Fonte 2 é a única máquina permitida para se conectar à Fonte 1. A Fonte 2 tem a opção `--log-replica-updates` habilitada (o padrão). Com essa opção, as instruções de replicação da Fonte 1 também são escritas no log binário da Fonte 2, para que possam ser replicadas para as verdadeiras réplicas.

* A Replicação 1, a Replicação 2 e a Replicação 3 atuam como réplicas da Fonte 2 e replicam as informações da Fonte 2, que na verdade consistem nos upgrades registrados na Fonte 1.

A solução acima reduz a carga do cliente e a carga da interface de rede na fonte primária, o que deve melhorar o desempenho geral da fonte primária quando usada como uma solução de banco de dados direta.

Se suas réplicas estiverem tendo problemas para acompanhar o processo de replicação na fonte, há várias opções disponíveis:

* Se possível, coloque os logs de retransmissão e os arquivos de dados em unidades físicas diferentes. Para fazer isso, defina a variável de sistema `relay_log` para especificar a localização do log de retransmissão.

* Se a atividade de E/S de disco pesada para leituras do arquivo log binário e dos arquivos de log de retransmissão for um problema, considere aumentar o valor da variável de sistema `rpl_read_size`. Essa variável de sistema controla a quantidade mínima de dados lidos dos arquivos de log, e aumentá-la pode reduzir as leituras de arquivos e as paradas de E/S quando os dados do arquivo não estão atualmente cacheados pelo sistema operacional. Note que um buffer do tamanho desse valor é alocado para cada thread que lê dos arquivos log binário e de retransmissão, incluindo threads de dump nas fontes e threads de coordenador nas réplicas. Definir um valor grande pode, portanto, ter um impacto no consumo de memória para os servidores.

* Se as réplicas forem significativamente mais lentas que a fonte, você pode querer dividir a responsabilidade pela replicação de diferentes bancos de dados entre diferentes réplicas. Veja a Seção 19.4.6, “Replicação de Diferentes Bancos de Dados para Diferentes Réplicas”.

* Se sua fonte utilizar transações e você não se preocupar com o suporte a transações nas suas réplicas, use `MyISAM` ou outro motor não transacional nas réplicas. Veja a Seção 19.4.4, “Uso da Replicação com Diferentes Motores de Armazenamento de Fonte e Réplica”.

* Se suas réplicas não estiverem atuando como fontes e você tiver uma solução potencial para garantir que possa ativar uma fonte no caso de falha, então você pode desabilitar `log_replica_updates`. Isso impede que as réplicas “tônicas” também registrem eventos que executaram em seu próprio log binário.