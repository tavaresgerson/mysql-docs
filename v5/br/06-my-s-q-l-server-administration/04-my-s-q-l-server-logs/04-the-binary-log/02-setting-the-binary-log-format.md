#### 5.4.4.2 Definindo o formato do log binário

Você pode selecionar o formato de registro binário explicitamente ao iniciar o servidor MySQL com [`--binlog-format=type`](https://pt.wikipedia.org/wiki/Replicação_\(banco_de_dados\)#Op%C3%A7%C3%B5es_de_registro_bin%C3%A1rio.3F). Os valores suportados para *`type`* são:

- `STATEMENT` faz com que o registro seja baseado em declarações.

- `ROW` faz com que o registro seja baseado em linha.

- `MIXED` faz com que o registro use o formato misto.

Definir o formato de registro binário não ativa o registro binário para o servidor. A configuração só entra em vigor quando o registro binário estiver habilitado no servidor, o que ocorre quando a variável de sistema `log_bin` estiver definida como `ON`. No MySQL 5.7, o registro binário não está habilitado por padrão, e você o habilita usando a opção `--log-bin`.

O formato de registro também pode ser alterado em tempo de execução, embora esteja ciente de que há várias situações em que você não pode fazer isso, conforme discutido mais adiante nesta seção. Defina o valor global da variável de sistema [`binlog_format`](https://pt.wikipedia.org/wiki/Binlog#Op%C3%A7%C3%B5es_de_replic%C3%A3o.html#sysvar_binlog_format) para especificar o formato para clientes que se conectam após a alteração:

```sql
mysql> SET GLOBAL binlog_format = 'STATEMENT';
mysql> SET GLOBAL binlog_format = 'ROW';
mysql> SET GLOBAL binlog_format = 'MIXED';
```

Um cliente individual pode controlar o formato de registro para suas próprias declarações, definindo o valor da sessão de `binlog_format`:

```sql
mysql> SET SESSION binlog_format = 'STATEMENT';
mysql> SET SESSION binlog_format = 'ROW';
mysql> SET SESSION binlog_format = 'MIXED';
```

Para alterar o valor global [`binlog_format`](https://pt.wikipedia.org/wiki/Binlog_format), é necessário ter privilégios suficientes para definir variáveis de sistema globais. Para alterar o valor da sessão [`binlog_format`](https://pt.wikipedia.org/wiki/Binlog_format), é necessário ter privilégios suficientes para definir variáveis de sistema de sessão restritas. Consulte [Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”](https://pt.wikipedia.org/wiki/Privilégios_de_variáveis_de_sistema).

Há várias razões pelas quais um cliente pode querer configurar o registro binário em uma base por sessão:

- Uma sessão que realiza muitas pequenas alterações no banco de dados pode querer usar o registro baseado em linhas.

- Uma sessão que realiza atualizações que correspondem a muitas linhas na cláusula `WHERE` pode querer usar o registro baseado em instruções, porque é mais eficiente registrar algumas instruções do que muitas linhas.

- Algumas declarações exigem muito tempo de execução na fonte, mas resultam em apenas algumas linhas sendo modificadas. Portanto, pode ser benéfico replicá-las usando o registro baseado em linhas.

Existem exceções quando você não pode alternar o formato de replicação em tempo de execução:

- De uma função armazenada ou de um gatilho.

- Se o mecanismo de armazenamento `NDB` estiver habilitado.

- Se a sessão estiver no modo de replicação baseada em linhas e tiver tabelas temporárias abertas.

Tentar mudar o formato em qualquer um desses casos resulta em um erro.

Não é recomendado alterar o formato de replicação em tempo de execução quando houver tabelas temporárias, pois essas tabelas são registradas apenas quando a replicação é baseada em instruções, enquanto que, na replicação baseada em linhas, elas não são registradas. Com a replicação mista, as tabelas temporárias geralmente são registradas; exceções ocorrem com funções carregáveis e com a função `UUID()`.

Alterar o formato de replicação enquanto a replicação estiver em andamento também pode causar problemas. Cada servidor MySQL pode definir seu próprio formato de registro binário (se `binlog_format` estiver definido com escopo global ou de sessão). Isso significa que alterar o formato de registro em um servidor de origem de replicação não faz com que a réplica mude seu formato de registro para corresponder. Ao usar o modo `STATEMENT`, a variável de sistema `binlog_format` não é replicada. Ao usar o modo de registro `MIXED` ou `ROW`, ele é replicado, mas ignorado pela réplica.

Uma replica não é capaz de converter entradas de log binário recebidas no formato de registro `ROW` para o formato `STATEMENT` para uso em seu próprio log binário. Portanto, a replica deve usar o formato `ROW` ou `MIXED` se a fonte o fizer. Alterar o formato de registro binário na fonte do formato `STATEMENT` para `ROW` ou `MIXED` durante a replicação para uma replica com o formato `STATEMENT` pode causar falha na replicação com erros como "Erro ao executar o evento da linha: 'Não é possível executar a declaração: impossível escrever no log binário, pois a declaração está no formato de linha e BINLOG\_FORMAT = STATEMENT.'" Alterar o formato de registro binário na replica para o formato `STATEMENT` quando a fonte ainda estiver usando o formato `MIXED` ou `ROW` também causa o mesmo tipo de falha de replicação. Para alterar o formato com segurança, você deve parar a replicação e garantir que a mesma alteração seja feita tanto na fonte quanto na replica.

Se você estiver usando tabelas de `InnoDB` e o nível de isolamento de transação for `READ COMMITTED` ou `READ UNCOMMITTED`, apenas o registro baseado em linhas pode ser usado. É *possível* alterar o formato de registro para `STATEMENT`, mas isso pode levar a erros muito rapidamente, pois o `InnoDB` não consegue mais realizar inserções.

Com o formato de log binário definido como `ROW`, muitas alterações são escritas no log binário usando o formato baseado em linhas. No entanto, algumas alterações ainda usam o formato baseado em declarações. Exemplos incluem todas as declarações de DDL (linguagem de definição de dados), como `CREATE TABLE`, `ALTER TABLE` ou `DROP TABLE`.

A opção \[`--binlog-row-event-max-size`]\(<https://pt.wikipedia.org/wiki/Op%C3%A9rnia_(MySQL)_(MySQL_8.0#Op%C3%A9rnia_mysqld_binlog-row-event-max-size)> é disponível para servidores que são capazes de replicação baseada em linhas. As linhas são armazenadas no log binário em blocos com um tamanho em bytes que não exceda o valor desta opção. O valor deve ser um múltiplo de 256. O valor padrão é 8192.

Aviso

Ao usar o registro baseado em *declarações* para replicação, é possível que os dados da fonte e da replica se tornem diferentes se uma declaração for projetada de tal forma que a modificação dos dados seja não determinística; ou seja, depende da vontade do otimizador de consultas. Geralmente, essa não é uma boa prática, mesmo fora da replicação. Para uma explicação detalhada sobre esse problema, consulte Seção B.3.7, “Problemas Conhecidos no MySQL”.
