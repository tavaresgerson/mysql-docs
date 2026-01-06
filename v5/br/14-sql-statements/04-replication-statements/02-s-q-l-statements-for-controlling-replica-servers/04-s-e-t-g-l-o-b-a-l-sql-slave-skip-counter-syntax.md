#### 13.4.2.4 Sintaxe do parâmetro global sql\_slave\_skip\_counter

```sql
SET GLOBAL sql_slave_skip_counter = N
```

Essa declaração ignora os próximos eventos *`N`* do mestre. Isso é útil para recuperar-se de paradas de replicação causadas por uma declaração.

Esta declaração é válida apenas quando os threads escravos não estão em execução. Caso contrário, produz um erro.

Ao usar essa declaração, é importante entender que o log binário é organizado como uma sequência de grupos conhecidos como grupos de eventos. Cada grupo de eventos consiste em uma sequência de eventos.

- Para tabelas transacionais, um grupo de eventos corresponde a uma transação.

- Para tabelas não transacionais, um grupo de eventos corresponde a uma única instrução SQL.

Nota

Uma única transação pode conter alterações em tabelas tanto transacionais quanto não transacionais.

Quando você usa `SET GLOBAL sql_slave_skip_counter` para pular eventos e o resultado está no meio de um grupo, o escravo continua a pular eventos até chegar ao final do grupo. A execução então começa com o próximo grupo de eventos.
