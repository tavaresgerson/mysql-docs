#### 7.4.4.2 Definição do formato do log binário

Você pode selecionar o formato de registro binário explicitamente iniciando o servidor MySQL com `--binlog-format=type`. Os valores suportados para `type` são:

- `STATEMENT` faz com que o registro seja baseado em instruções.
- `ROW` faz com que o registro seja baseado em linhas. Este é o padrão.
- `MIXED` faz com que o registro use formato misto.

A configuração do formato de registro binário não ativa o registro binário para o servidor. A configuração só entra em vigor quando o registro binário é ativado no servidor, que é o caso quando a variável do sistema `log_bin` é definida como `ON`. No MySQL 8.4, o registro binário é ativado por padrão e é desativado apenas se você iniciar o servidor com `--skip-log-bin` ou `--disable-log-bin`.

O formato de registro também pode ser alterado no tempo de execução, embora note que há uma série de situações em que você não pode fazer isso, como discutido mais adiante nesta seção. Defina o valor global da variável do sistema `binlog_format` para especificar o formato para clientes que se conectam após a alteração:

```
mysql> SET GLOBAL binlog_format = 'STATEMENT';
mysql> SET GLOBAL binlog_format = 'ROW';
mysql> SET GLOBAL binlog_format = 'MIXED';
```

Um cliente individual pode controlar o formato de registro para suas próprias instruções definindo o valor de sessão de `binlog_format`:

```
mysql> SET SESSION binlog_format = 'STATEMENT';
mysql> SET SESSION binlog_format = 'ROW';
mysql> SET SESSION binlog_format = 'MIXED';
```

A alteração do valor global `binlog_format` requer privilégios suficientes para definir variáveis globais do sistema. A alteração do valor da sessão `binlog_format` requer privilégios suficientes para definir variáveis de sistema de sessão restritas. Veja Seção 7.1.9.1, "Privilégios de variáveis do sistema".

Existem várias razões pelas quais um cliente pode querer configurar o registro binário por sessão:

- Uma sessão que faz muitas pequenas alterações no banco de dados pode querer usar o registro baseado em linhas.
- Uma sessão que executa atualizações que correspondem a muitas linhas na cláusula `WHERE` pode querer usar o registro baseado em instruções porque é mais eficiente registrar algumas instruções do que muitas linhas.
- Algumas instruções requerem muito tempo de execução na fonte, mas resultam em apenas algumas linhas sendo modificadas.

Existem exceções quando você não pode mudar o formato de replicação no tempo de execução:

- O formato de replicação não pode ser alterado a partir de uma função armazenada ou um gatilho.
- Se o motor de armazenamento `NDB` estiver ativado.
- Se uma sessão tiver tabelas temporárias abertas, o formato de replicação não pode ser alterado para a sessão (`SET @@SESSION.binlog_format`).
- Se qualquer canal de replicação tiver tabelas temporárias abertas, o formato de replicação não pode ser alterado globalmente (`SET @@GLOBAL.binlog_format` ou `SET @@PERSIST.binlog_format`).
- Se qualquer thread de aplicador de canal de replicação estiver atualmente em execução, o formato de replicação não pode ser alterado globalmente (`SET @@GLOBAL.binlog_format` ou `SET @@PERSIST.binlog_format`).

Tentar mudar o formato de replicação em qualquer um desses casos (ou tentar definir o formato de replicação atual) resulta em um erro. No entanto, você pode usar `PERSIST_ONLY` (`SET @@PERSIST_ONLY.binlog_format`) para alterar o formato de replicação a qualquer momento, porque essa ação não modifica o valor da variável do sistema global de tempo de execução e só entra em vigor após uma reinicialização do servidor.

A troca do formato de replicação no tempo de execução não é recomendada quando existem tabelas temporárias, porque as tabelas temporárias são registradas apenas quando se usa a replicação baseada em instruções, enquanto que com a replicação baseada em linhas e a replicação mista, elas não são registradas.

A mudança do formato de replicação enquanto a replicação está em andamento também pode causar problemas. Cada servidor MySQL pode definir seu próprio e somente seu próprio formato de registro binário (verdadeiro se `binlog_format` é definido com escopo global ou de sessão). Isso significa que alterar o formato de registro em um servidor de origem de replicação não faz com que uma réplica altere seu formato de registro para corresponder. Ao usar o modo `STATEMENT`, a variável do sistema `binlog_format` não é replicada. Ao usar o modo de registro `MIXED` ou `ROW`, ela é replicada, mas é ignorada pela réplica.

Uma réplica não é capaz de converter as entradas de log binário recebidas no formato de registro `ROW` para o formato de registro `STATEMENT` para uso em seu próprio log binário. A réplica deve, portanto, usar o formato `ROW` ou `MIXED` se a fonte o fizer. Mudar o formato de registro binário na fonte de `STATEMENT` para `ROW` ou `MIXED` enquanto a réplica está em andamento para uma réplica com o formato `STATEMENT` pode causar falhas na réplica com erros como erro executando evento de linha: 'Não é possível executar instrução: impossível escrever instrução de log binário, pois está em linha e formato BINGLO\_FORMAT = STEMATENT.' Mudar o formato de registro binário na réplica para \[\[CO`STATEMENT`]] quando a réplica ainda está usando o formato \[\[CO`MIXED`]] ou \[\[CO`ROW`]] enquanto

Se você estiver usando tabelas `InnoDB` e o nível de isolamento de transação for `READ COMMITTED` ou `READ UNCOMMITTED`, só poderá ser usado o registro baseado em linhas. É \* possível \* mudar o formato de registro para `STATEMENT`, mas fazê-lo no tempo de execução leva muito rapidamente a erros porque `InnoDB` não pode mais executar inserções.

Com o formato de registro binário definido como `ROW`, muitas alterações são escritas no registro binário usando o formato baseado em linhas. Algumas alterações, no entanto, ainda usam o formato baseado em instruções.

Quando o registro binário baseado em linhas é usado, a variável de sistema `binlog_row_event_max_size` e sua opção de inicialização correspondente `--binlog-row-event-max-size` definem um limite suave no tamanho máximo dos eventos de linha. O valor padrão é 8192 bytes, e o valor só pode ser alterado na inicialização do servidor. Quando possível, as linhas armazenadas no registro binário são agrupadas em eventos com um tamanho não superior ao valor desta configuração. Se um evento não pode ser dividido, o tamanho máximo pode ser excedido.

A opção `--binlog-row-event-max-size` está disponível para servidores que são capazes de replicação baseada em linhas. As linhas são armazenadas no log binário em pedaços com um tamanho em bytes não excedendo o valor desta opção. O valor deve ser um múltiplo de 256. O valor padrão é 8192.

Advertência

Ao usar o registro baseado em instruções para replicação, é possível que os dados da fonte e da réplica se tornem diferentes se uma instrução for projetada de tal forma que a modificação de dados seja não-determinista; ou seja, é deixada para o otimizador de consulta.
