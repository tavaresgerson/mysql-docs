### 16.3.10 Replicação atrasada

O MySQL 5.7 suporta a replicação atrasada, de modo que um servidor de replicação fica deliberadamente atrasado em relação à fonte por um período de tempo especificado. O atraso padrão é de 0 segundos. Use a opção `MASTER_DELAY` para `ALTERAR MASTER PARA` para definir o atraso em *`N`* segundos:

```sql
CHANGE MASTER TO MASTER_DELAY = N;
```

Um evento recebido da fonte não é executado até, no mínimo, *`N`* segundos depois de sua execução na fonte. As exceções são que não há atraso para eventos de descrição de formato ou eventos de rotação de arquivo de log, que afetam apenas o estado interno do thread SQL.

A replicação retardada pode ser usada para vários propósitos:

- Para proteger contra erros do usuário na fonte. Um DBA pode reverter uma replica atrasada para o momento imediatamente anterior ao desastre.

- Para testar como o sistema se comporta quando há um atraso. Por exemplo, em uma aplicação, um atraso pode ser causado por uma carga pesada na replica. No entanto, pode ser difícil gerar esse nível de carga. A replicação atrasada pode simular o atraso sem precisar simular a carga. Também pode ser usado para depurar condições relacionadas a uma replica que está atrasada.

- Para verificar como o banco de dados parecia há muito tempo, sem precisar recarregar um backup. Por exemplo, se o atraso for de uma semana e o DBA precise ver como o banco de dados parecia antes dos últimos dias de desenvolvimento, a replica atrasada pode ser verificada.

`START SLAVE` e `STOP SLAVE` entram em vigor imediatamente e ignoram qualquer atraso. `RESET SLAVE` redefini o atraso para 0.

O botão `SHOW SLAVE STATUS` tem três campos que fornecem informações sobre o atraso:

- `SQL_Delay`: Um inteiro não negativo que indica o número de segundos que a réplica deve ficar atrasada em relação à fonte.

- `SQL_Remaining_Delay`: Quando `Slave_SQL_Running_State` é `Aguardando até que o evento do MASTER_DELAY segundos após o evento do MASTER seja executado`, este campo contém um inteiro que indica o número de segundos restantes do atraso. Em outros momentos, este campo é `NULL`.

- `Slave_SQL_Running_State`: Uma string que indica o estado do thread SQL (análogo ao `Slave_IO_State`). O valor é idêntico ao valor `State` do thread SQL, conforme exibido por `SHOW PROCESSLIST`.

Quando o fio de replicação SQL está aguardando o término do atraso antes de executar um evento, o `SHOW PROCESSLIST` exibe seu valor `State` como `Aguardando até os segundos `MASTER_DELAY` após o evento ser executado pelo mestre`.
