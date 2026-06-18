### 17.8.8 Configurando a Pesquisa de Bloqueio por Rotação

Os `InnoDB` mútuos e bloqueios rw são tipicamente reservados para intervalos curtos. Em um sistema multi-core, pode ser mais eficiente para um thread verificar continuamente se pode adquirir um mútuo ou bloqueio rw por um período de tempo antes de dormir. Se o mútuo ou bloqueio rw ficar disponível durante esse período, o thread pode continuar imediatamente, no mesmo intervalo de tempo. No entanto, a verificação frequente de um objeto compartilhado, como um mútuo ou bloqueio rw, por vários threads pode causar o "ping-pong de cache", o que resulta na invalidação de partes do cache de cada um pelos processadores. `InnoDB` minimiza esse problema ao forçar um atraso aleatório entre as verificações para desincronizar a atividade de verificação. O atraso aleatório é implementado como um loop de espera em rotação.

A duração de um loop de espera de rotação é determinada pelo número de instruções PAUSE que ocorrem no loop. Esse número é gerado selecionando aleatoriamente um inteiro variando de 0 até, mas não incluindo, o valor `innodb_spin_wait_delay`, e multiplicando esse valor por 50. (O valor do multiplicador, 50, é hardcoded antes do MySQL 8.0.16 e configurável posteriormente.) Por exemplo, um inteiro é selecionado aleatoriamente da seguinte faixa para um ajuste `innodb_spin_wait_delay` de 6:

```
{0,1,2,3,4,5}
```

O inteiro selecionado é multiplicado por 50, resultando em um dos seis possíveis valores de instrução PAUSE:

```
{0,50,100,150,200,250}
```

Para esse conjunto de valores, 250 é o número máximo de instruções PAUSE que podem ocorrer em um loop de espera por rotação. Uma configuração de `innodb_spin_wait_delay` de 5 resulta em um conjunto de cinco valores possíveis `{0,50,100,150,200}`, onde 200 é o número máximo de instruções PAUSE, e assim por diante. Dessa forma, a configuração de `innodb_spin_wait_delay` controla o atraso máximo entre as pesquisas de bloqueio por rotação.

Em um sistema onde todos os núcleos do processador compartilham uma memória cache rápida, você pode reduzir o atraso máximo ou desativar o loop ocupado completamente, configurando `innodb_spin_wait_delay=0`. Em um sistema com vários chips de processador, o efeito da invalidação da cache pode ser mais significativo e você pode aumentar o atraso máximo.

Na era do Pentium de 100 MHz, uma unidade `innodb_spin_wait_delay` foi calibrada para ser equivalente a um microsegundo. Essa equivalência de tempo não se manteve, mas a duração da instrução PAUSE permaneceu relativamente constante em termos de ciclos do processador em relação a outras instruções da CPU até a introdução da geração Skylake dos processadores, que têm uma instrução PAUSE comparativamente mais longa. A variável `innodb_spin_wait_pause_multiplier` foi introduzida no MySQL 8.0.16 para fornecer uma maneira de levar em conta as diferenças na duração da instrução PAUSE.

A variável `innodb_spin_wait_pause_multiplier` controla o tamanho dos valores das instruções PAUSE. Por exemplo, assumindo um ajuste `innodb_spin_wait_delay` de 6, a diminuição do valor `innodb_spin_wait_pause_multiplier` de 50 (o valor padrão e previamente codificado) para 5 gera um conjunto de valores menores para as instruções PAUSE:

```
{0,5,10,15,20,25}
```

A capacidade de aumentar ou diminuir os valores das instruções PAUSE permite o ajuste fino do `InnoDB` para diferentes arquiteturas de processadores. Valores menores das instruções PAUSE seriam apropriados para arquiteturas de processadores com uma instrução PAUSE comparativamente mais longa, por exemplo.

As variáveis `innodb_spin_wait_delay` e `innodb_spin_wait_pause_multiplier` são dinâmicas. Elas podem ser especificadas em um arquivo de opção MySQL ou modificadas em tempo de execução usando uma instrução `SET GLOBAL`. A modificação das variáveis em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.
