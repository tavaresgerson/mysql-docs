#### 13.4.1.3 Declaração sql_log_bin do SET

```sql
SET sql_log_bin = {OFF|ON}
```

A variável [`sql_log_bin`](https://pt.wikipedia.org/wiki/Replicação_de_log_bin%C3%A1rio#sysvar_sql_log_bin) controla se o registro no log binário está habilitado para a sessão atual (assumindo que o próprio log binário esteja habilitado). O valor padrão é `ON`. Para desabilitar ou habilitar o registro binário para a sessão atual, defina a variável de sessão [`sql_log_bin`](https://pt.wikipedia.org/wiki/Replicação_de_log_bin%C3%A1rio#sysvar_sql_log_bin) para `OFF` ou `ON`.

Defina essa variável para `OFF` para uma sessão desativar temporariamente o registro binário enquanto você faz alterações na fonte que você não deseja replicar para a replica.

Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

Não é possível definir o valor da sessão de [`sql_log_bin`](https://pt.wikipedia.org/wiki/Replicação_de_logs_bin%C3%A1rios#sysvar_sql_log_bin) dentro de uma transação ou subconsulta.

*Definir essa variável como `OFF` impede que GTIDs sejam atribuídos às transações no log binário*. Se você estiver usando GTIDs para replicação, isso significa que, mesmo quando o registro binário for habilitado novamente, os GTIDs escritos no log a partir desse ponto não considerarão quaisquer transações que ocorreram nesse período, portanto, essas transações serão perdidas.

A variável global [`sql_log_bin`](https://pt.wikipedia.org/wiki/Replicação_de_opções_de_log_bin%C3%A1rio#sysvar_sql_log_bin) é de leitura somente e não pode ser modificada. O escopo global é desatualizado; espere que ele seja removido em uma futura versão do MySQL.
