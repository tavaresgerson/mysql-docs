### 14.8.9 Configurando a Pesquisa de Bloqueio por Rotação

Os mutexes e bloqueios `rw-` do `InnoDB` são tipicamente reservados para intervalos curtos. Em um sistema multi-core, pode ser mais eficiente para um thread verificar continuamente se pode adquirir um mutex ou bloqueio `rw-` por um período de tempo antes de dormir. Se o mutex ou bloqueio `rw-` ficar disponível durante esse período, o thread pode continuar imediatamente, no mesmo intervalo de tempo. No entanto, a verificação frequente de um objeto compartilhado, como um mutex ou bloqueio `rw-`, por vários threads pode causar o "ping-pong de cache", o que resulta na invalidação de partes do cache de cada um pelos processadores. O `InnoDB` minimiza esse problema ao forçar um atraso aleatório entre as verificações para desincronizar a atividade de verificação. O atraso aleatório é implementado como um loop de espera em rotação.

A duração de um loop de espera de rotação é determinada pelo número de instruções PAUSE que ocorrem no loop. Esse número é gerado selecionando aleatoriamente um inteiro variando de 0 até, mas não incluindo, o valor `innodb_spin_wait_delay`, e multiplicando esse valor por 50. Por exemplo, um inteiro é selecionado aleatoriamente da seguinte faixa para um ajuste `innodb_spin_wait_delay` de 6:

```sql
{0,1,2,3,4,5}
```

O inteiro selecionado é multiplicado por 50, resultando em um dos seis possíveis valores de instrução PAUSE:

```sql
{0,50,100,150,200,250}
```

Para esse conjunto de valores, 250 é o número máximo de instruções PAUSE que podem ocorrer em um loop de espera por rotação. Um ajuste de `innodb_spin_wait_delay` de 5 resulta em um conjunto de cinco valores possíveis `{0,50,100,150,200}`, onde 200 é o número máximo de instruções PAUSE, e assim por diante. Dessa forma, o ajuste `innodb_spin_wait_delay` controla o atraso máximo entre as consultas de bloqueio por rotação.

A duração do loop de atraso depende do compilador C e do processador alvo. Na era do Pentium de 100 MHz, uma unidade `innodb_spin_wait_delay` foi calibrada para ser equivalente a um microsegundo. Essa equivalência de tempo não se manteve, mas a duração da instrução PAUSE permaneceu bastante constante em termos de ciclos de processador em relação a outras instruções da CPU na maioria das arquiteturas de processador.

Em um sistema onde todos os núcleos do processador compartilham uma memória cache rápida, você pode reduzir o atraso máximo ou desativar o loop ocupado completamente, configurando `innodb_spin_wait_delay=0`. Em um sistema com vários chips de processador, o efeito da invalidação da cache pode ser mais significativo e você pode aumentar o atraso máximo.

A variável `innodb_spin_wait_delay` é dinâmica. Ela pode ser especificada em um arquivo de opção do MySQL ou modificada em tempo de execução usando uma instrução `SET GLOBAL`. A modificação em tempo de execução requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.
