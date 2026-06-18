### 16.3.10 Replicação Atrasada (Delayed Replication)

O MySQL 5.7 oferece suporte à Delayed Replication, de modo que um servidor replica atrase deliberadamente a execução em relação ao source (fonte) por, pelo menos, uma quantidade de tempo especificada. O delay (atraso) padrão é de 0 segundos. Use a opção `MASTER_DELAY` no comando `CHANGE MASTER TO` para definir o delay para *`N`* segundos:

```sql
CHANGE MASTER TO MASTER_DELAY = N;
```

Um event recebido do source não é executado até que se passem pelo menos *`N`* segundos após sua execução no source. As exceções são os format description events ou log file rotation events, para os quais não há delay, pois eles afetam apenas o estado interno do SQL thread.

A Delayed Replication pode ser usada para diversos propósitos:

* Para proteger contra erros de usuário no source. Um DBA pode reverter (roll back) uma replica atrasada para o momento imediatamente anterior ao desastre.

* Para testar como o sistema se comporta quando há um lag (atraso). Por exemplo, em uma aplicação, um lag pode ser causado por uma carga pesada (heavy load) na replica. No entanto, pode ser difícil gerar esse nível de load. A Delayed Replication pode simular o lag sem ter que simular o load. Também pode ser usada para depurar condições relacionadas a uma replica com lag.

* Para inspecionar a aparência do database há muito tempo, sem a necessidade de recarregar um backup. Por exemplo, se o delay for de uma semana e o DBA precisar ver como o database estava antes do trabalho de desenvolvimento dos últimos dias, a replica atrasada pode ser inspecionada.

`START SLAVE` e `STOP SLAVE` entram em vigor imediatamente e ignoram qualquer delay. `RESET SLAVE` redefine o delay para 0.

O comando `SHOW SLAVE STATUS` possui três fields (campos) que fornecem informações sobre o delay:

* `SQL_Delay`: Um integer (inteiro) não negativo que indica o número de segundos que a replica deve ter de lag em relação ao source.

* `SQL_Remaining_Delay`: Quando `Slave_SQL_Running_State` for `Waiting until MASTER_DELAY seconds after master executed event`, este field contém um integer indicando o número de segundos restantes do delay. Em outros momentos, este field é `NULL`.

* `Slave_SQL_Running_State`: Uma string que indica o state (estado) do SQL thread (análogo a `Slave_IO_State`). O valor é idêntico ao valor `State` do SQL thread, conforme exibido por `SHOW PROCESSLIST`.

Quando o SQL thread de replication está aguardando o término do delay antes de executar um event, `SHOW PROCESSLIST` exibe seu valor de `State` como `Waiting until MASTER_DELAY seconds after master executed event`.