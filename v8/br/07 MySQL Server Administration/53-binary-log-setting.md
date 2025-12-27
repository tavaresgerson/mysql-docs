#### 7.4.4.2 Definindo o Formato de Registro Binário

Você pode selecionar explicitamente o formato de registro binário ao iniciar o servidor MySQL com `--binlog-format=type`. Os valores suportados para *`type`* são:

* `STATEMENT` faz com que o registro seja baseado em declarações.
* `ROW` faz com que o registro seja baseado em linhas. Este é o valor padrão.
* `MIXED` faz com que o registro use o formato misto.

Definir o formato de registro binário não ativa o registro binário para o servidor. A configuração só entra em vigor quando o registro binário estiver habilitado no servidor, o que ocorre quando a variável de sistema `log_bin` é definida como `ON`. No MySQL 8.4, o registro binário está habilitado por padrão e é desativado apenas se você iniciar o servidor com `--skip-log-bin` ou `--disable-log-bin`.

O formato de registro também pode ser alterado em tempo de execução, embora note que há várias situações em que você não pode fazer isso, conforme discutido mais adiante nesta seção. Defina o valor global da variável de sistema `binlog_format` para especificar o formato para clientes que se conectam após a mudança:

```
mysql> SET GLOBAL binlog_format = 'STATEMENT';
mysql> SET GLOBAL binlog_format = 'ROW';
mysql> SET GLOBAL binlog_format = 'MIXED';
```

Um cliente individual pode controlar o formato de registro para suas próprias declarações definindo o valor de sessão `binlog_format`:

```
mysql> SET SESSION binlog_format = 'STATEMENT';
mysql> SET SESSION binlog_format = 'ROW';
mysql> SET SESSION binlog_format = 'MIXED';
```

Alterar o valor global de `binlog_format` requer privilégios suficientes para definir variáveis de sistema globais. Alterar o valor de sessão `binlog_format` requer privilégios suficientes para definir variáveis de sistema de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

Há várias razões pelas quais um cliente pode querer definir o registro binário em uma base por sessão:

* Uma sessão que realiza muitas pequenas alterações no banco de dados pode querer usar o registro baseado em linhas.
* Uma sessão que realiza atualizações que correspondem a muitas linhas na cláusula `WHERE` pode querer usar o registro baseado em instruções, porque é mais eficiente registrar algumas instruções do que muitas linhas.
* Algumas instruções exigem muito tempo de execução na fonte, mas resultam em apenas algumas linhas sendo modificadas. Portanto, pode ser benéfico replicá-las usando o registro baseado em linhas.

Existem exceções quando você não pode alternar o formato de replicação no tempo de execução:

* O formato de replicação não pode ser alterado a partir de uma função armazenada ou um gatilho.
* Se o motor de armazenamento `NDB` estiver habilitado.
* Se uma sessão tiver tabelas temporárias abertas, o formato de replicação não pode ser alterado para a sessão (`SET @@SESSION.binlog_format`).
* Se qualquer canal de replicação tiver tabelas temporárias abertas, o formato de replicação não pode ser alterado globalmente (`SET @@GLOBAL.binlog_format` ou `SET @@PERSIST.binlog_format`).
* Se qualquer fio de aplicação de canal de replicação estiver em execução, o formato de replicação não pode ser alterado globalmente (`SET @@GLOBAL.binlog_format` ou `SET @@PERSIST.binlog_format`).

Tentar alternar o formato de replicação em qualquer um desses casos (ou tentar definir o formato de replicação atual) resulta em um erro. No entanto, você pode usar `PERSIST_ONLY` (`SET @@PERSIST_ONLY.binlog_format`) para alterar o formato de replicação a qualquer momento, porque essa ação não modifica o valor da variável de sistema global de tempo de execução e só entra em vigor após o reinício do servidor.

Alternar o formato de replicação no tempo de execução não é recomendado quando existem tabelas temporárias, porque as tabelas temporárias são registradas apenas quando se usa a replicação baseada em instruções, enquanto com a replicação baseada em linhas e a replicação mista, elas não são registradas.

A troca do formato de replicação enquanto a replicação estiver em andamento também pode causar problemas. Cada servidor MySQL pode definir seu próprio e único formato de registro binário (válido tanto se o `binlog_format` for definido com escopo global quanto com escopo de sessão). Isso significa que alterar o formato de registro em um servidor de origem de replicação não faz com que a réplica mude seu formato de registro para se adequar. Ao usar o modo `STATEMENT`, a variável de sistema `binlog_format` não é replicada. Ao usar o modo de registro `MIXED` ou `ROW`, ele é replicado, mas ignorado pela réplica.

A réplica não é capaz de converter entradas de log binário recebidas no formato de registro `ROW` para o formato `STATEMENT` para uso em seu próprio log binário. Portanto, a réplica deve usar o formato `ROW` ou `MIXED` se a fonte o fizer. Alterar o formato de registro binário na fonte de `STATEMENT` para `ROW` ou `MIXED` enquanto a replicação estiver em andamento para uma réplica com o formato `STATEMENT` pode causar falha na replicação com erros como "Erro ao executar o evento da linha: 'Não é possível executar a declaração: impossível escrever no log binário, pois a declaração está no formato de linha e BINLOG_FORMAT = STATEMENT.'" Alterar o formato de registro binário na réplica para o formato `STATEMENT` quando a fonte ainda estiver usando o formato `MIXED` ou `ROW` também causa o mesmo tipo de falha de replicação. Para alterar o formato com segurança, você deve parar a replicação e garantir que a mesma alteração seja feita tanto na fonte quanto na réplica.

Se você estiver usando tabelas `InnoDB` e o nível de isolamento de transação for `READ COMMITTED` ou `READ UNCOMMITTED`, apenas o registro baseado em linha pode ser usado. É *possível* alterar o formato de registro para `STATEMENT`, mas fazer isso em tempo de execução leva muito rapidamente a erros porque o `InnoDB` não pode mais realizar inserções.

Com o formato de log binário definido como `ROW`, muitas alterações são escritas no log binário usando o formato baseado em linha. No entanto, algumas alterações ainda usam o formato baseado em declaração. Exemplos incluem todas as declarações de linguagem de definição de dados (DDL), como `CREATE TABLE`, `ALTER TABLE` ou `DROP TABLE`.

Quando o registro binário baseado em linha é usado, a variável de sistema `binlog_row_event_max_size` e sua opção de inicialização correspondente `--binlog-row-event-max-size` definem um limite suave do tamanho máximo dos eventos de linha. O valor padrão é de 8192 bytes, e o valor só pode ser alterado na inicialização do servidor. Quando possível, as linhas armazenadas no log binário são agrupadas em eventos com um tamanho não superior ao valor deste ajuste. Se um evento não puder ser dividido, o tamanho máximo pode ser excedido.

A opção `--binlog-row-event-max-size` está disponível para servidores que são capazes de replicação baseada em linha. As linhas são armazenadas no log binário em lotes com um tamanho em bytes não superior ao valor desta opção. O valor deve ser um múltiplo de 256. O valor padrão é 8192.

Aviso

Ao usar o registro baseado em *declaração* para replicação, é possível que os dados na fonte e na replica se tornem diferentes se uma declaração for projetada de tal forma que a modificação de dados seja não determinística; ou seja, depende do otimizador de consultas. Geralmente, essa não é uma boa prática, mesmo fora da replicação. Para uma explicação detalhada sobre esse problema, consulte a Seção B.3.7, “Problemas Conhecidos no MySQL”.