### 14.8.8 Configurando a capacidade de E/S do InnoDB

O thread mestre `InnoDB` e outros fios realizam várias tarefas em segundo plano, a maioria das quais está relacionada ao E/S, como o esvaziamento de páginas sujas do pool de buffers e a escrita de alterações do buffer de alterações nos índices secundários apropriados. O `InnoDB` tenta realizar essas tarefas de uma maneira que não afete negativamente o funcionamento normal do servidor. Ele tenta estimar a largura de banda de E/S disponível e ajustar suas atividades para aproveitar a capacidade disponível.

A variável `innodb_io_capacity` define a capacidade geral de E/S disponível para o `InnoDB`. Ela deve ser definida para aproximadamente o número de operações de E/S que o sistema pode realizar por segundo (IOPS). Quando `innodb_io_capacity` é definido, o `InnoDB` estima a largura de banda de E/S disponível para tarefas em segundo plano com base no valor definido.

Você pode definir `innodb_io_capacity` para um valor de 100 ou maior. O valor padrão é `200`. Normalmente, valores em torno de 100 são apropriados para dispositivos de armazenamento de nível de consumidor, como discos rígidos de até 7200 RPM. Discos rígidos mais rápidos, configurações RAID e unidades de estado sólido (SSDs) se beneficiam de valores mais altos.

Idealmente, mantenha o valor o mais baixo possível, mas não tão baixo que as atividades de fundo fiquem para trás. Se o valor for muito alto, os dados serão removidos do pool de buffer e o buffer de mudança será atualizado muito rapidamente para que o cache ofereça um benefício significativo. Para sistemas ocupados capazes de taxas de E/S mais altas, você pode definir um valor mais alto para ajudar o servidor a lidar com o trabalho de manutenção de fundo associado a uma alta taxa de mudanças de linhas. Geralmente, você pode aumentar o valor como uma função do número de unidades usadas para o E/S do `InnoDB`. Por exemplo, você pode aumentar o valor em sistemas que usam múltiplos discos ou SSDs.

A configuração padrão de 200 geralmente é suficiente para um SSD de menor custo. Para um SSD conectado ao barramento de alta gama, considere uma configuração mais alta, como 1000, por exemplo. Para sistemas com unidades individuais de 5400 RPM ou 7200 RPM, você pode reduzir o valor para 100, que representa uma proporção estimada das operações de entrada/saída por segundo (IOPS) disponíveis para unidades de disco de geração mais antiga, que podem realizar cerca de 100 IOPS.

Embora você possa especificar um valor alto, como um milhão, na prática, valores tão grandes têm pouco benefício. Geralmente, um valor superior a 20.000 não é recomendado, a menos que você esteja certo de que valores menores são insuficientes para sua carga de trabalho.

Considere a carga de trabalho de escrita ao ajustar `innodb_io_capacity`. Sistemas com grandes cargas de trabalho de escrita provavelmente se beneficiarão de um valor mais alto. Um valor mais baixo pode ser suficiente para sistemas com uma pequena carga de trabalho de escrita.

O ajuste `innodb_io_capacity` não é um ajuste por instância de pool de buffers. A capacidade de E/S disponível é distribuída igualmente entre as instâncias do pool de buffers para atividades de varredura.

Você pode definir o valor `innodb_io_capacity` no arquivo de opções do MySQL (`my.cnf` ou `my.ini`) ou modificá-lo em tempo de execução usando uma instrução `SET GLOBAL`, que requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

#### Ignorar a capacidade de E/S nos pontos de verificação

A variável `innodb_flush_sync`, que está habilitada por padrão, faz com que o ajuste `innodb_io_capacity` seja ignorado durante os picos de atividade de E/S que ocorrem nos pontos de verificação. Para aderir à taxa de E/S definida pelo ajuste `innodb_io_capacity`, desabilite `innodb_flush_sync`.

Você pode definir o valor `innodb_flush_sync` no arquivo de opções do MySQL (`my.cnf` ou `my.ini`) ou modificá-lo em tempo de execução usando uma instrução `SET GLOBAL`, que requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

#### Configurando um Máximo de Capacidade de Entrada/Saída

Se a atividade de limpeza ficar para trás, o `InnoDB` pode realizar a limpeza de forma mais agressiva, com uma taxa maior de operações de E/S por segundo (IOPS) do que a definida pela variável `innodb_io_capacity`. A variável `innodb_io_capacity_max` define um número máximo de IOPS realizados pelas tarefas de segundo plano do `InnoDB` nessas situações.

Se você especificar um valor para `innodb_io_capacity` durante a inicialização, mas não especificar um valor para `innodb_io_capacity_max`, `innodb_io_capacity_max` terá como padrão o dobro do valor de `innodb_io_capacity` ou 2000, dependendo do valor maior.

Ao configurar `innodb_io_capacity_max`, o dobro de `innodb_io_capacity` é frequentemente um bom ponto de partida. O valor padrão de 2000 é destinado a cargas de trabalho que utilizam um SSD ou mais de uma unidade de disco regular. Um ajuste de 2000 é provavelmente muito alto para cargas de trabalho que não utilizam SSDs ou múltiplas unidades de disco, e poderia permitir um esvaziamento excessivo. Para uma única unidade de disco regular, um ajuste entre 20 e 400 é recomendado. Para um SSD de alta gama, acoplado à barra, considere um ajuste mais alto, como 2500. Como com o ajuste de `innodb_io_capacity`, mantenha o ajuste o mais baixo possível, mas não tão baixo que o `InnoDB` não possa estender suficientemente a taxa de IOPS além do ajuste de `innodb_io_capacity`.

Considere a carga de trabalho de escrita ao ajustar `innodb_io_capacity_max`. Sistemas com grandes cargas de trabalho de escrita podem se beneficiar de um valor mais alto. Um valor mais baixo pode ser suficiente para sistemas com uma pequena carga de trabalho de escrita.

`innodb_io_capacity_max` não pode ser definido para um valor menor que o valor `innodb_io_capacity`.

Definir `innodb_io_capacity_max` para `DEFAULT` usando uma instrução `SET` (`SET GLOBAL innodb_io_capacity_max=DEFAULT`) define `innodb_io_capacity_max` para o valor máximo.

O limite `innodb_io_capacity_max` aplica-se a todas as instâncias do pool de buffers. Não é uma configuração por instância do pool de buffers.
