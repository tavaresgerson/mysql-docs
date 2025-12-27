### 17.8.8 Configurando a Pesquisa de Bloqueio por Rotação

Os mutexes e bloqueios de leitura/escrita (`rw-locks`) do `InnoDB` são tipicamente reservados para intervalos curtos. Em um sistema multi-core, pode ser mais eficiente que um thread verifique continuamente se pode adquirir um mutex ou bloqueio de leitura/escrita por um período de tempo antes de dormir. Se o mutex ou bloqueio de leitura/escrita ficar disponível durante esse período, o thread pode continuar imediatamente, no mesmo intervalo de tempo. No entanto, a pesquisa frequente de um objeto compartilhado, como um mutex ou bloqueio de leitura/escrita, por vários threads pode causar o "ping-pong de cache", o que resulta na invalidação de partes do cache de cada um pelos processadores. O `InnoDB` minimiza esse problema forçando um atraso aleatório entre as pesquisas para desincronizar a atividade de pesquisa. O atraso aleatório é implementado como um loop de espera por rotação.

A duração de um loop de espera por rotação é determinada pelo número de instruções PAUSE que ocorrem no loop. Esse número é gerado selecionando aleatoriamente um inteiro variando de 0 até, mas não incluindo, o valor de `innodb_spin_wait_delay`, e multiplicando esse valor por 50. Por exemplo, um inteiro é selecionado aleatoriamente da seguinte faixa para um ajuste de `innodb_spin_wait_delay` de 6:

```
{0,1,2,3,4,5}
```

O inteiro selecionado é multiplicado por 50, resultando em um dos seis possíveis valores de instruções PAUSE:

```
{0,50,100,150,200,250}
```

Para esse conjunto de valores, 250 é o número máximo de instruções PAUSE que podem ocorrer em um loop de espera por rotação. Um ajuste de `innodb_spin_wait_delay` de 5 resulta em um conjunto de cinco possíveis valores `{0,50,100,150,200}`, onde 200 é o número máximo de instruções PAUSE, e assim por diante. Dessa forma, o ajuste de `innodb_spin_wait_delay` controla o atraso máximo entre as pesquisas de bloqueio por rotação.

Em um sistema onde todos os núcleos do processador compartilham uma memória cache rápida, você pode reduzir o atraso máximo ou desativar o loop ocupado completamente, configurando `innodb_spin_wait_delay=0`. Em um sistema com vários chips de processador, o efeito da invalidação da cache pode ser mais significativo e você pode aumentar o atraso máximo.

Na era do Pentium de 100 MHz, uma unidade `innodb_spin_wait_delay` foi calibrada para ser equivalente a um microsegundo. Essa equivalência de tempo não se manteve, mas a duração da instrução PAUSE permaneceu relativamente constante em termos de ciclos de processador em relação a outras instruções da CPU até a introdução da geração Skylake de processadores, que têm uma instrução PAUSE comparativamente mais longa. A variável `innodb_spin_wait_pause_multiplier` fornece uma maneira de levar em conta diferenças na duração da instrução PAUSE.

A variável `innodb_spin_wait_pause_multiplier` controla o tamanho dos valores da instrução PAUSE. Por exemplo, assumindo um ajuste de `innodb_spin_wait_delay` de 6, diminuindo o valor de `innodb_spin_wait_pause_multiplier` de 50 (o valor padrão e previamente codificado) para 5 gera um conjunto de valores menores da instrução PAUSE:

```
{0,5,10,15,20,25}
```

A capacidade de aumentar ou diminuir os valores da instrução PAUSE permite o ajuste fino do `InnoDB` para diferentes arquiteturas de processador. Valores menores da instrução PAUSE seriam apropriados para arquiteturas de processador com uma instrução PAUSE comparativamente mais longa, por exemplo.

As variáveis `innodb_spin_wait_delay` e `innodb_spin_wait_pause_multiplier` são dinâmicas. Elas podem ser especificadas em um arquivo de opção do MySQL ou modificadas em tempo de execução usando uma declaração `SET GLOBAL`. Modificar as variáveis em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.