### 17.8.7 Configurando a Capacidade de E/S do InnoDB

O fio mestre `InnoDB` e outros fios realizam várias tarefas em segundo plano, a maioria das quais está relacionada ao E/S, como o esvaziamento de páginas sujas do pool de buffers e a escrita de alterações do buffer de alterações nos índices secundários apropriados. O `InnoDB` tenta realizar essas tarefas de uma maneira que não afete negativamente o funcionamento normal do servidor. Ele tenta estimar a largura de banda de E/S disponível e ajustar suas atividades para aproveitar a capacidade disponível.

A variável `innodb_io_capacity` define a capacidade geral de E/S disponível para o `InnoDB`. Deve ser definida para aproximadamente o número de operações de E/S que o sistema pode realizar por segundo (IOPS). Quando `innodb_io_capacity` é definido, o `InnoDB` estima a largura de banda de E/S disponível para tarefas em segundo plano com base no valor definido.

Você pode definir `innodb_io_capacity` para um valor de 100 ou maior. O valor padrão é `10000`. Tipicamente, discos rígidos mais rápidos, configurações RAID e unidades de estado sólido (SSDs) se beneficiam de valores mais altos do que dispositivos de armazenamento de menor qualidade, como discos rígidos de até 7200 RPM.

Idealmente, mantenha a configuração o mais baixa possível, mas não tão baixa que as atividades em segundo plano fiquem para trás. Se o valor for muito alto, os dados são removidos do pool de buffers e do buffer de alterações muito rapidamente para que o cache forneça um benefício significativo. Para sistemas ocupados capazes de taxas de E/S mais altas, você pode definir um valor mais alto para ajudar o servidor a lidar com o trabalho de manutenção em segundo plano associado a uma alta taxa de alterações de linhas. Geralmente, você pode aumentar o valor como uma função do número de discos usados para o E/S do `InnoDB`. Por exemplo, você pode aumentar o valor em sistemas que usam múltiplos discos ou SSDs.

Embora você possa especificar um valor alto, como um milhão, na prática, valores tão grandes têm pouco benefício. Geralmente, um valor superior a 20000 não é recomendado, a menos que você esteja certo de que valores menores são insuficientes para sua carga de trabalho. Veja também a opção `innodb_io_capacity_max`, que aumenta automaticamente esse valor quando o esvaziamento fica para trás.

Considere a carga de trabalho de escrita ao ajustar `innodb_io_capacity`. Sistemas com grandes cargas de trabalho de escrita provavelmente se beneficiarão de um ajuste mais alto. Um ajuste mais baixo pode ser suficiente para sistemas com uma pequena carga de trabalho de escrita.

O ajuste `innodb_io_capacity` não é um ajuste por instância de pool de buffers. A capacidade de I/O disponível é distribuída igualmente entre as instâncias do pool de buffers para atividades de esvaziamento.

Você pode definir o valor de `innodb_io_capacity` no arquivo de opções do MySQL (`my.cnf` ou `my.ini`) ou modificá-lo em tempo de execução usando uma declaração `SET GLOBAL`, que requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

#### Ignorar a Capacidade de I/O em Pontos de Controle

A variável `innodb_flush_sync`, que é habilitada por padrão, faz com que o ajuste `innodb_io_capacity` seja ignorado durante picos de atividade de I/O que ocorrem em pontos de controle. Para aderir à taxa de I/O definida pelos ajustes `innodb_io_capacity` e `innodb_io_capacity_max`, desabilite `innodb_flush_sync`.

Você pode definir o valor de `innodb_flush_sync` no arquivo de opções do MySQL (`my.cnf` ou `my.ini`) ou modificá-lo em tempo de execução usando uma declaração `SET GLOBAL`, que requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

#### Configurando um Máximo de Capacidade de I/O

Se a atividade de varredura ficar para trás, o `InnoDB` pode realizar varreduras de forma mais agressiva, com uma taxa maior de operações de E/S por segundo (IOPS) do que a definida pela variável `innodb_io_capacity`. A variável `innodb_io_capacity_max` define um número máximo de IOPS realizados pelas tarefas de fundo do `InnoDB` nessas situações.

Se você especificar um valor para `innodb_io_capacity` na inicialização, mas não especificar um valor para `innodb_io_capacity_max`, `innodb_io_capacity_max` terá o valor padrão do dobro do valor de `innodb_io_capacity`.

Ao configurar `innodb_io_capacity_max`, o dobro de `innodb_io_capacity` é frequentemente um bom ponto de partida. Como com a configuração de `innodb_io_capacity`, mantenha a configuração o mais baixa possível, mas não tão baixa que o `InnoDB` não possa estender suficientemente a taxa de IOPS além da configuração de `innodb_io_capacity`.

Considere a carga de trabalho de escrita ao ajustar `innodb_io_capacity_max`. Sistemas com grandes cargas de trabalho de escrita podem se beneficiar de uma configuração mais alta. Uma configuração mais baixa pode ser suficiente para sistemas com uma pequena carga de trabalho de escrita.

`innodb_io_capacity_max` não pode ser definido para um valor menor que o valor de `innodb_io_capacity`.

Definir `innodb_io_capacity_max` para `DEFAULT` usando uma instrução `SET` (`SET GLOBAL innodb_io_capacity_max=DEFAULT`) define `innodb_io_capacity_max` para o valor padrão.

O limite de `innodb_io_capacity_max` se aplica a todas as instâncias do pool de buffers. Não é uma configuração por instância do pool de buffers.