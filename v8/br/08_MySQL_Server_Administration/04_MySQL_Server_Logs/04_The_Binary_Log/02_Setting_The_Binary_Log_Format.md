#### 7.4.4.2 Configuração do formato do log binário

Você pode selecionar o formato de registro binário explicitamente ao iniciar o servidor MySQL com `--binlog-format=type`. Os valores suportados para `type` são:

- `STATEMENT` faz com que o registro seja baseado em declarações.

- `ROW` faz com que o registro seja baseado em linhas. Esse é o padrão.

- `MIXED` faz com que o registro use um formato misto.

Definir o formato de registro binário não ativa o registro binário no servidor. A configuração só entra em vigor quando o registro binário estiver habilitado no servidor, o que ocorre quando a variável de sistema `log_bin` for definida como `ON`. A partir do MySQL 8.0, o registro binário está habilitado por padrão e só é desativado se você especificar a opção `--skip-log-bin` ou `--disable-log-bin` durante o início.

O formato de registro também pode ser alterado em tempo de execução, embora esteja ciente de que há várias situações em que você não pode fazer isso, conforme discutido mais adiante nesta seção. Defina o valor global da variável de sistema `binlog_format` para especificar o formato para clientes que se conectam após a alteração:

```
mysql> SET GLOBAL binlog_format = 'STATEMENT';
mysql> SET GLOBAL binlog_format = 'ROW';
mysql> SET GLOBAL binlog_format = 'MIXED';
```

Um cliente individual pode controlar o formato de registro para suas próprias declarações, definindo o valor da sessão de `binlog_format`:

```
mysql> SET SESSION binlog_format = 'STATEMENT';
mysql> SET SESSION binlog_format = 'ROW';
mysql> SET SESSION binlog_format = 'MIXED';
```

Para alterar o valor global `binlog_format`, são necessários privilégios suficientes para definir variáveis de sistema globais. Para alterar o valor da sessão `binlog_format`, são necessários privilégios suficientes para definir variáveis de sistema de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

Há várias razões pelas quais um cliente pode querer configurar o registro binário em uma base por sessão:

- Uma sessão que realiza muitas pequenas alterações no banco de dados pode querer usar o registro baseado em linhas.

- Uma sessão que realiza atualizações que correspondem a muitas linhas na cláusula `WHERE` pode querer usar o registro baseado em instruções, porque é mais eficiente registrar algumas instruções do que muitas linhas.

- Algumas declarações exigem muito tempo de execução na fonte, mas resultam em apenas algumas linhas sendo modificadas. Portanto, pode ser benéfico replicá-las usando o registro baseado em linhas.

Existem exceções quando você não pode alternar o formato de replicação em tempo de execução:

- O formato de replicação não pode ser alterado a partir de uma função armazenada ou de um gatilho.

- Se o mecanismo de armazenamento `NDB` estiver habilitado.

- Se uma sessão tiver tabelas temporárias abertas, o formato de replicação não pode ser alterado para a sessão (`SET @@SESSION.binlog_format`).

- Se houver tabelas temporárias abertas em qualquer canal de replicação, o formato de replicação não pode ser alterado globalmente (`SET @@GLOBAL.binlog_format` ou `SET @@PERSIST.binlog_format`).

- Se qualquer fio do aplicativo do canal de replicação estiver em execução, o formato de replicação não pode ser alterado globalmente (`SET @@GLOBAL.binlog_format` ou `SET @@PERSIST.binlog_format`).

Tentar alterar o formato de replicação em qualquer um desses casos (ou tentar definir o formato de replicação atual) resulta em um erro. No entanto, você pode usar `PERSIST_ONLY` (`SET @@PERSIST_ONLY.binlog_format`) para alterar o formato de replicação a qualquer momento, pois essa ação não modifica o valor da variável global de sistema em tempo de execução e só entra em vigor após o reinício do servidor.

Não é recomendado alterar o formato de replicação em tempo de execução quando houver tabelas temporárias, pois essas tabelas são registradas apenas quando a replicação é baseada em instruções, enquanto que, na replicação baseada em linhas e na replicação mista, elas não são registradas.

Mudar o formato de replicação enquanto a replicação estiver em andamento também pode causar problemas. Cada servidor MySQL pode definir seu próprio e apenas seu próprio formato de registro binário (válido independentemente de `binlog_format` estar definido com escopo global ou de sessão). Isso significa que alterar o formato de registro em um servidor de origem de replicação não faz com que a replica mude seu formato de registro para se adequar. Ao usar o modo `STATEMENT`, a variável de sistema `binlog_format` não é replicada. Quando usar o modo de registro `MIXED` ou `ROW`, ele é replicado, mas ignorado pela replica.

Uma replica não é capaz de converter entradas de log binário recebidas no formato de registro `ROW` para o formato `STATEMENT` para uso em seu próprio log binário. Portanto, a replica deve usar o formato `ROW` ou `MIXED` se a fonte o fizer. Alterar o formato de registro binário na fonte de `STATEMENT` para `ROW` ou `MIXED` durante a replicação para uma replica com o formato `STATEMENT` pode causar o fracasso da replicação com erros como "Erro ao executar o evento da linha: 'Não é possível executar a instrução: impossível escrever no log binário, pois a instrução está no formato da linha e BINLOG\_FORMAT = INSTRUMENTO'." Alterar o formato de registro binário na replica para o formato `STATEMENT` quando a fonte ainda está usando o formato `MIXED` ou `ROW` também causa o mesmo tipo de falha de replicação. Para alterar o formato com segurança, você deve parar a replicação e garantir que a mesma alteração seja feita tanto na fonte quanto na replica.

Se você estiver usando tabelas `InnoDB` e o nível de isolamento de transação for `READ COMMITTED` ou `READ UNCOMMITTED`, apenas o registro baseado em linhas pode ser usado. É *possível* alterar o formato de registro para `STATEMENT`, mas isso, feito em tempo de execução, leva rapidamente a erros porque o `InnoDB` não pode mais realizar inserções.

Com o formato de log binário definido como `ROW`, muitas alterações são escritas no log binário usando o formato baseado em linhas. No entanto, algumas alterações ainda usam o formato baseado em declarações. Exemplos incluem todas as declarações de DDL (linguagem de definição de dados) como `CREATE TABLE`, `ALTER TABLE` ou `DROP TABLE`.

Quando o registro binário baseado em linhas é usado, a variável de sistema `binlog_row_event_max_size` e sua opção de inicialização correspondente `--binlog-row-event-max-size` definem um limite suave para o tamanho máximo dos eventos de linha. O valor padrão é de 8192 bytes, e o valor só pode ser alterado na inicialização do servidor. Sempre que possível, as linhas armazenadas no log binário são agrupadas em eventos com um tamanho que não exceda o valor desta configuração. Se um evento não puder ser dividido, o tamanho máximo pode ser excedido.

A opção `--binlog-row-event-max-size` está disponível para servidores que são capazes de replicação baseada em linhas. As linhas são armazenadas no log binário em blocos com um tamanho em bytes que não exceda o valor desta opção. O valor deve ser um múltiplo de 256. O valor padrão é 8192.

Aviso

Ao usar o registro baseado em declarações para a replicação, é possível que os dados da fonte e da replica se tornem diferentes se uma declaração for projetada de tal forma que a modificação dos dados seja não determinística; ou seja, depende do otimizador de consultas. Geralmente, essa não é uma boa prática, mesmo fora da replicação. Para uma explicação detalhada sobre esse problema, consulte a Seção B.3.7, “Problemas Conhecidos no MySQL”.
