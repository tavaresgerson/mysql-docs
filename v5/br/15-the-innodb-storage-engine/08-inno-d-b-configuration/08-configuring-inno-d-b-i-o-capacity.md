### 14.8.8 Configurando a Capacidade de I/O do InnoDB

O *master thread* do `InnoDB` e outros *threads* executam várias tarefas em *background*, a maioria das quais relacionadas a I/O, como *flushing* de páginas sujas do *Buffer Pool* e escrita de alterações do *change buffer* para os *secondary indexes* apropriados. O `InnoDB` tenta executar essas tarefas de forma que não afete adversamente o funcionamento normal do servidor. Ele tenta estimar a largura de banda de I/O disponível e ajustar suas atividades para aproveitar a capacidade disponível.

A variável `innodb_io_capacity` define a capacidade total de I/O disponível para o `InnoDB`. Ela deve ser configurada para ser aproximadamente o número de operações de I/O que o sistema pode realizar por segundo (*IOPS*). Quando `innodb_io_capacity` é configurada, o `InnoDB` estima a largura de banda de I/O disponível para tarefas em *background* com base no valor definido.

Você pode definir `innodb_io_capacity` para um valor de 100 ou maior. O valor padrão é `200`. Tipicamente, valores em torno de 100 são apropriados para dispositivos de armazenamento de nível de consumidor, como *hard drives* de até 7200 RPM. *Hard drives* mais rápidos, configurações *RAID* e *Solid State Drives* (*SSDs*) se beneficiam de valores mais altos.

Idealmente, mantenha a configuração o mais baixa possível, mas não tão baixa que as atividades em *background* fiquem atrasadas. Se o valor for muito alto, os dados são removidos do *Buffer Pool* e do *change buffer* muito rapidamente para que o *caching* forneça um benefício significativo. Para sistemas ocupados capazes de taxas de I/O mais altas, você pode definir um valor maior para ajudar o servidor a lidar com o trabalho de manutenção em *background* associado a uma alta taxa de alterações de linha. Geralmente, você pode aumentar o valor em função do número de *drives* usados para I/O do `InnoDB`. Por exemplo, você pode aumentar o valor em sistemas que usam múltiplos *disks* ou *SSDs*.

A configuração padrão de 200 é geralmente suficiente para um *SSD* de baixo custo. Para um *SSD* de ponta acoplado ao *bus*, considere uma configuração mais alta, como 1000, por exemplo. Para sistemas com *drives* individuais de 5400 RPM ou 7200 RPM, você pode reduzir o valor para 100, o que representa uma proporção estimada das operações de I/O por segundo (*IOPS*) disponíveis para *disk drives* de geração mais antiga que podem executar cerca de 100 *IOPS*.

Embora você possa especificar um valor alto, como um milhão, na prática, valores tão grandes têm pouco benefício. Geralmente, um valor superior a 20000 não é recomendado, a menos que você tenha certeza de que valores mais baixos são insuficientes para sua *workload*.

Considere a *write workload* (carga de trabalho de escrita) ao ajustar `innodb_io_capacity`. Sistemas com grandes *write workloads* provavelmente se beneficiarão de uma configuração mais alta. Uma configuração mais baixa pode ser suficiente para sistemas com uma pequena *write workload*.

A configuração de `innodb_io_capacity` não é uma configuração por instância de *Buffer Pool*. A capacidade de I/O disponível é distribuída igualmente entre as instâncias de *Buffer Pool* para atividades de *flushing*.

Você pode definir o valor de `innodb_io_capacity` no arquivo de opções do MySQL (`my.cnf` ou `my.ini`) ou modificá-lo em tempo de execução usando uma instrução `SET GLOBAL`, o que requer privilégios suficientes para definir variáveis de sistema globais. Consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

#### Ignorando a Capacidade de I/O em Checkpoints

A variável `innodb_flush_sync`, que é ativada por padrão, faz com que a configuração `innodb_io_capacity` seja ignorada durante picos de atividade de I/O que ocorrem nos *Checkpoints*. Para aderir à taxa de I/O definida pela configuração `innodb_io_capacity`, desative `innodb_flush_sync`.

Você pode definir o valor de `innodb_flush_sync` no arquivo de opções do MySQL (`my.cnf` ou `my.ini`) ou modificá-lo em tempo de execução usando uma instrução `SET GLOBAL`, o que requer privilégios suficientes para definir variáveis de sistema globais. Consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

#### Configurando um Máximo de Capacidade de I/O

Se a atividade de *flushing* ficar atrasada, o `InnoDB` pode executar *flush* de forma mais agressiva, a uma taxa maior de operações de I/O por segundo (*IOPS*) do que o definido pela variável `innodb_io_capacity`. A variável `innodb_io_capacity_max` define um número máximo de *IOPS* executadas por tarefas em *background* do `InnoDB` em tais situações.

Se você especificar uma configuração `innodb_io_capacity` na inicialização, mas não especificar um valor para `innodb_io_capacity_max`, `innodb_io_capacity_max` assume como padrão o dobro do valor de `innodb_io_capacity` ou 2000, o que for maior.

Ao configurar `innodb_io_capacity_max`, o dobro de `innodb_io_capacity` é frequentemente um bom ponto de partida. O valor padrão de 2000 é destinado a *workloads* que usam um *SSD* ou mais de um *disk drive* comum. Uma configuração de 2000 é provavelmente muito alta para *workloads* que não usam *SSDs* ou múltiplos *disk drives*, e pode permitir um *flushing* excessivo. Para um único *disk drive* comum, é recomendada uma configuração entre 200 e 400. Para um *SSD* de ponta acoplado ao *bus*, considere uma configuração mais alta, como 2500. Assim como na configuração `innodb_io_capacity`, mantenha a configuração o mais baixa possível, mas não tão baixa que o `InnoDB` não consiga estender suficientemente a taxa de *IOPS* além da configuração `innodb_io_capacity`.

Considere a *write workload* ao ajustar `innodb_io_capacity_max`. Sistemas com grandes *write workloads* podem se beneficiar de uma configuração mais alta. Uma configuração mais baixa pode ser suficiente para sistemas com uma pequena *write workload*.

`innodb_io_capacity_max` não pode ser definido para um valor inferior ao valor de `innodb_io_capacity`.

Definir `innodb_io_capacity_max` como `DEFAULT` usando uma instrução `SET` (`SET GLOBAL innodb_io_capacity_max=DEFAULT`) define `innodb_io_capacity_max` para o valor máximo.

O limite de `innodb_io_capacity_max` se aplica a todas as instâncias de *Buffer Pool*. Não é uma configuração por instância de *Buffer Pool*.