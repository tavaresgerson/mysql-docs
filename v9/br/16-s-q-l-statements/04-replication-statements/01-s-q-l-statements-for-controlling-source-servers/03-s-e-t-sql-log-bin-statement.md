#### 15.4.1.3 Instrução `sql_log_bin`

```
SET sql_log_bin = {OFF|ON}
```

A variável `sql_log_bin` controla se o registro no log binário está habilitado para a sessão atual (assumindo que o próprio log binário esteja habilitado). O valor padrão é `ON`. Para desabilitar ou habilitar o registro binário para a sessão atual, defina a variável de sessão `sql_log_bin` para `OFF` ou `ON`.

Defina essa variável para `OFF` para uma sessão desativar temporariamente o registro binário enquanto faz alterações na fonte que você não deseja replicar para a replica.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”.

Não é possível definir o valor da sessão de `sql_log_bin` dentro de uma transação ou subconsulta.

*Definir essa variável para `OFF` impede que novos GTIDs sejam atribuídos às transações no log binário*. Se você estiver usando GTIDs para replicação, isso significa que, mesmo quando o registro binário for habilitado novamente, os GTIDs escritos no log a partir desse ponto não consideram quaisquer transações que ocorreram no meio do caminho, portanto, efetivamente, essas transações são perdidas.

O **mysqldump** adiciona uma instrução `SET @@SESSION.sql_log_bin=0` a um arquivo de dump de um servidor onde GTIDs estão em uso, o que desabilita o registro binário enquanto o arquivo de dump está sendo recarregado. A instrução impede que novos GTIDs sejam gerados e atribuídos às transações no arquivo de dump à medida que são executadas, para que os GTIDs originais das transações sejam usados.