#### 16.1.3.6 Restrições à replicação com GTIDs

Como a replicação baseada em GTID depende de transações, algumas funcionalidades que estão disponíveis no MySQL não são suportadas ao usá-la. Esta seção fornece informações sobre as restrições e limitações da replicação com GTIDs.

**Atualizações envolvendo motores de armazenamento não transacionais.** Ao usar GTIDs, as atualizações de tabelas usando motores de armazenamento não transacionais, como `MyISAM`, não podem ser feitas na mesma declaração ou transação que as atualizações de tabelas usando motores de armazenamento transacionais, como `InnoDB`.

Essa restrição ocorre porque as atualizações em tabelas que utilizam um mecanismo de armazenamento não transacional, misturadas com atualizações em tabelas que utilizam um mecanismo de armazenamento transacional, dentro da mesma transação, podem resultar em múltiplos GTIDs sendo atribuídos à mesma transação.

Esses problemas também podem ocorrer quando a fonte e a replica utilizam diferentes mecanismos de armazenamento para suas respectivas versões da mesma tabela, onde um mecanismo de armazenamento é transacional e o outro não. Além disso, esteja ciente de que gatilhos definidos para operar em tabelas não transacionais podem ser a causa desses problemas.

Em qualquer um dos casos mencionados, a correspondência um-para-um entre as transações e os GTIDs é quebrada, com o resultado de que a replicação baseada em GTID não pode funcionar corretamente.

**Instruções `CREATE TABLE ... SELECT`.** As instruções `CREATE TABLE ... SELECT` não são permitidas ao usar a replicação baseada em GTID. Quando o `binlog_format` está definido como `STATEMENT` (formato de log binário), uma instrução `CREATE TABLE ... SELECT` é registrada no log binário como uma transação com um único GTID, mas se o formato ROW for usado, a instrução é registrada como duas transações com dois GTIDs. Se uma fonte usar o formato `STATEMENT` e uma replica usar o formato `ROW`, a replica não poderá lidar com a transação corretamente, portanto, a instrução `CREATE TABLE ... SELECT` é desabilitada com GTIDs para evitar esse cenário.

Tabelas temporárias. As instruções `CREATE TEMPORARY TABLE` e `DROP TEMPORARY TABLE` não são suportadas dentro de transações, procedimentos, funções e gatilhos quando se usa GTIDs (ou seja, quando a variável de sistema `enforce_gtid_consistency` está definida como `ON`). É possível usar essas instruções com GTIDs ativados, mas apenas fora de qualquer transação e apenas com `autocommit=1`.

**Prevenção da execução de declarações não suportadas.** Para evitar a execução de declarações que possam causar o fracasso da replicação baseada em GTID, todos os servidores devem ser iniciados com a opção [`--enforce-gtid-consistency`](https://pt.wikipedia.org/wiki/Replicação_baseada_em_GTID#sysvar_enforce_gtid_consistency) ao habilitar GTIDs. Isso faz com que as declarações de qualquer um dos tipos discutidos anteriormente nesta seção falhem com um erro.

Observe que `--enforce-gtid-consistency` só tem efeito se a log de binário ocorrer para uma declaração. Se a log de binário estiver desativada no servidor ou se as declarações não forem escritas no log de binário porque são removidas por um filtro, a consistência do GTID não será verificada ou aplicada para as declarações que não foram registradas.

Para obter informações sobre outras opções de inicialização necessárias ao habilitar GTIDs, consulte Seção 16.1.3.4, “Configurando a Replicação Usando GTIDs”.

**Saltar transações.** `sql_slave_skip_counter` não é suportado ao usar GTIDs. Se você precisar pular transações, use o valor da variável de origem `gtid_executed` em vez disso. Para instruções, consulte Seção 16.1.7.3, “Saltar Transações”.

**Ignorar servidores.** A opção IGNORE_SERVER_IDS da declaração `CHANGE MASTER TO` é desaconselhada ao usar GTIDs, porque as transações que já foram aplicadas são ignoradas automaticamente. Antes de iniciar a replicação baseada em GTIDs, verifique e limpe todas as listas de IDs de servidor ignorados que foram previamente definidas nos servidores envolvidos. A declaração `SHOW SLAVE STATUS`, que pode ser emitida para canais individuais, exibe a lista de IDs de servidor ignorados, se houver. Se não houver lista, o campo `Replicate_Ignore_Server_Ids` está em branco.

Modo GTID e mysqldump. É possível importar um dump feito com **mysqldump** em um servidor MySQL que esteja rodando com o modo GTID habilitado, desde que não haja GTIDs no log binário do servidor de destino.

Modo GTID e mysql_upgrade. Quando o servidor estiver em execução com identificadores de transações globais (GTIDs) habilitados (`gtid_mode=ON`), não habilite o registro binário pelo **mysql_upgrade** (a opção `--write-binlog` (mysql-upgrade.html#option_mysql_upgrade_write-binlog)).
