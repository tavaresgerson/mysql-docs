#### 16.4.1.29 Replicação e tabelas temporárias

A discussão nos parágrafos seguintes não se aplica quando [`binlog_format=ROW`](https://pt.wikipedia.org/wiki/Replicação_de_transações#Op%C3%A7%C3%B5es_bin%C3%A1rias-log.html#sysvar_binlog_format), pois, nesse caso, as tabelas temporárias não são replicadas; isso significa que nunca há tabelas temporárias na replica que possam ser perdidas em caso de um desligamento não planejado pela replica. O restante desta seção só se aplica quando se usa replicação baseada em instruções ou formato misto. A perda de tabelas temporárias replicadas na replica pode ser um problema, sempre que [`binlog_format`](https://pt.wikipedia.org/wiki/Replicação_de_transações#Op%C3%A7%C3%B4es_bin%C3%A1rias-log.html#sysvar_binlog_format) é `STATEMENT` ou `MIXED`, para instruções que envolvem tabelas temporárias que podem ser registradas com segurança usando o formato baseado em instruções. Para mais informações sobre replicação baseada em linhas e tabelas temporárias, consulte [Registro de tabelas temporárias baseadas em linhas](https://pt.wikipedia.org/wiki/Replicação_de_transações#Registro_de_linhas.html#registro_de_linhas).

**Desativação segura da replica quando se usa tabelas temporárias.** As tabelas temporárias são replicadas, exceto no caso em que você para o servidor de replica (não apenas os threads de replicação) e você já replicou tabelas temporárias que estão abertas para uso em atualizações que ainda não foram executadas na replica. Se você parar o servidor de replica, as tabelas temporárias necessárias para essas atualizações não estarão mais disponíveis quando a replica for reiniciada. Para evitar esse problema, não desligue a replica enquanto ela tiver tabelas temporárias abertas. Em vez disso, use o seguinte procedimento:

1. Emita uma declaração `STOP SLAVE SQL_THREAD`.

2. Use `SHOW STATUS` para verificar o valor da variável `Slave_open_temp_tables`.

3. Se o valor não for 0, reinicie o thread de replicação SQL com `START SLAVE SQL_THREAD` e repita o procedimento mais tarde.

4. Quando o valor for 0, execute o comando **mysqladmin shutdown** para interromper a replica.

**Tabelas temporárias e opções de replicação.** Por padrão, todas as tabelas temporárias são replicadas; isso acontece independentemente de existirem ou não as opções `--replicate-do-db`, `--replicate-do-table` ou `--replicate-wild-do-table` em vigor. No entanto, as opções `--replicate-ignore-table` e `--replicate-wild-ignore-table` são respeitadas para tabelas temporárias. A exceção é que, para permitir a remoção correta das tabelas temporárias no final de uma sessão, uma replica sempre replica uma instrução `DROP TEMPORARY TABLE IF EXISTS`, independentemente de quaisquer regras de exclusão que normalmente seriam aplicadas para a tabela especificada.

Uma prática recomendada ao usar replicação baseada em declarações ou em formato misto é designar um prefixo para uso exclusivo ao nomear tabelas temporárias que você não deseja replicar, e, em seguida, usar a opção `--replicate-wild-ignore-table` para corresponder a esse prefixo. Por exemplo, você pode dar nomes a todas essas tabelas começando com `norep` (como `norepmytable`, `norepyourtable`, e assim por diante), e, em seguida, usar `--replicate-wild-ignore-table=norep%` para impedir que sejam replicadas.
