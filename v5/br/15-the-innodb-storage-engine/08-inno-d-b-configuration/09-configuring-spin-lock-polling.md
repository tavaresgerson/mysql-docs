### 14.8.9 Configurando o Polling de Spin Lock

Os mutexes e rw-locks do `InnoDB` são tipicamente reservados para intervalos curtos. Em um sistema multi-core, pode ser mais eficiente para uma Thread verificar continuamente se pode adquirir um mutex ou rw-lock por um período de tempo antes de entrar em repouso (sleep). Se o mutex ou rw-lock se tornar disponível durante esse período, a Thread pode continuar imediatamente, no mesmo time slice. No entanto, o polling muito frequente de um objeto compartilhado, como um mutex ou rw-lock, por múltiplas Threads pode causar o “cache ping pong”, o que resulta em processadores invalidando porções do cache uns dos outros. O `InnoDB` minimiza esse problema forçando um atraso aleatório entre os polls para dessincronizar a atividade de polling. O atraso aleatório é implementado como um spin-wait loop.

A duração de um spin-wait loop é determinada pelo número de PAUSE instructions que ocorrem no loop. Esse número é gerado pela seleção aleatória de um integer variando de 0 até, mas sem incluir, o valor de `innodb_spin_wait_delay`, e multiplicando esse valor por 50. Por exemplo, um integer é selecionado aleatoriamente a partir do seguinte intervalo para uma configuração de `innodb_spin_wait_delay` igual a 6:

```sql
{0,1,2,3,4,5}
```

O integer selecionado é multiplicado por 50, resultando em um dos seis possíveis valores de PAUSE instruction:

```sql
{0,50,100,150,200,250}
```

Para esse conjunto de valores, 250 é o número máximo de PAUSE instructions que pode ocorrer em um spin-wait loop. Uma configuração de `innodb_spin_wait_delay` igual a 5 resulta em um conjunto de cinco valores possíveis `{0,50,100,150,200}`, onde 200 é o número máximo de PAUSE instructions, e assim por diante. Dessa forma, a configuração de `innodb_spin_wait_delay` controla o atraso máximo entre os polls de spin lock.

A duração do loop de atraso depende do C compiler e do processador alvo. Na era do Pentium de 100MHz, uma unidade de `innodb_spin_wait_delay` foi calibrada para ser equivalente a um microssegundo. Essa equivalência de tempo não se manteve, mas a duração da PAUSE instruction permaneceu razoavelmente constante em termos de ciclos de processador em relação a outras instruções de CPU na maioria das arquiteturas de processador.

Em um sistema onde todos os cores de processador compartilham uma memória cache rápida, você pode reduzir o atraso máximo ou desabilitar o busy loop completamente definindo `innodb_spin_wait_delay=0`. Em um sistema com múltiplos chips de processador, o efeito da invalidação de cache pode ser mais significativo, e você pode aumentar o atraso máximo.

A variável `innodb_spin_wait_delay` é dinâmica. Ela pode ser especificada em um arquivo de opção do MySQL ou modificada em runtime usando uma instrução `SET GLOBAL`. A modificação em runtime requer privilégios suficientes para definir global system variables. Consulte a Seção 5.1.8.1, “System Variable Privileges”.