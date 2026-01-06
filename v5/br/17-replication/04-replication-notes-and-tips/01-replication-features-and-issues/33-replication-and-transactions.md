#### 16.4.1.33 Replicação e Transações

**Misturar declarações transacionais e não transacionais na mesma transação.** Em geral, você deve evitar transações que atualizem tanto tabelas transacionais quanto não transacionais em um ambiente de replicação. Além disso, você deve evitar usar qualquer declaração que acesse tanto tabelas transacionais (ou temporárias) quanto não transacionais e escreva em qualquer uma delas.

O servidor utiliza essas regras para o registro binário:

- Se as declarações iniciais de uma transação não forem transacionais, elas são escritas imediatamente no log binário. As declarações restantes da transação são armazenadas em cache e não são escritas no log binário até que a transação seja confirmada. (Se a transação for revertida, as declarações armazenadas em cache são escritas no log binário apenas se elas fizerem alterações não transacionais que não possam ser revertidas. Caso contrário, elas são descartadas.)

- Para o registro baseado em declarações, o registro de declarações não transacionais é afetado pela variável de sistema `binlog_direct_non_transactional_updates`. Quando essa variável está em `OFF` (o padrão), o registro é feito conforme descrito acima. Quando essa variável está em `ON`, o registro ocorre imediatamente para declarações não transacionais que ocorrem em qualquer lugar da transação (não apenas declarações não transacionais iniciais). Outras declarações são mantidas no cache da transação e registradas quando a transação é confirmada. O `binlog_direct_non_transactional_updates` não tem efeito para o registro binário em formato de linha ou misto.

**Declarações transacionais, não transacionais e mistas.** Para aplicar essas regras, o servidor considera uma declaração não transacional se ela alterar apenas tabelas não transacionais e transacional se ela alterar apenas tabelas transacionais. Uma declaração que faz referência a tabelas não transacionais e transacionais e atualiza *qualquer* das tabelas envolvidas é considerada uma declaração "mista". (Em algumas versões anteriores do MySQL, apenas uma declaração que atualizava *ambas* as tabelas não transacionais e transacionais era considerada mista.) As declarações mistas, como as declarações transacionais, são armazenadas em cache e registradas quando a transação é confirmada.

Uma declaração mista que atualiza uma tabela transacional é considerada insegura se a declaração também realizar uma das seguintes ações:

- Atualiza ou lê uma tabela temporária
- Leitura de uma tabela não transacional e o nível de isolamento de transação é menor que REPEATABLE\_READ

Uma declaração mista após a atualização de uma tabela transacional dentro de uma transação é considerada insegura se ela realizar qualquer uma das seguintes ações:

- Atualiza qualquer tabela e lê de qualquer tabela temporária
- Atualiza uma tabela não transacional e `binlog_direct_non_transactional_updates` está desativado (replicação-opções-binary-log.html#sysvar\_binlog\_direct\_non\_transactional\_updates)

Para mais informações, consulte Seção 16.2.1.3, “Determinação de declarações seguras e inseguras no registro binário”.

Nota

Uma declaração mista não está relacionada ao formato de registro binário misto.

Em situações em que as transações misturam atualizações de tabelas transacionais e não transacionais, a ordem das declarações no log binário está correta e todas as declarações necessárias são escritas no log binário, mesmo em caso de uma `ROLLBACK`. No entanto, quando uma segunda conexão atualiza a tabela não transakcional antes que a transação da primeira conexão seja concluída, as declarações podem ser registradas fora da ordem, porque a atualização da segunda conexão é escrita imediatamente após ser realizada, independentemente do estado da transação realizada pela primeira conexão.

**Usando diferentes motores de armazenamento na fonte e na replica.** É possível replicar tabelas transacionais na fonte usando tabelas não transacionais na replica. Por exemplo, você pode replicar uma tabela de origem `InnoDB` como uma tabela de replica `MyISAM`. No entanto, se você fizer isso, haverá problemas se a replica for interrompida no meio de um bloco `BEGIN` ... `COMMIT` porque a replica reinicia no início do bloco `BEGIN`.

Também é seguro replicar transações de tabelas de `MyISAM` na fonte para tabelas transacionais, como tabelas que usam o mecanismo de armazenamento `InnoDB`, na replica. Nesse caso, uma declaração `AUTOCOMMIT=1` emitida na fonte é replicada, aplicando assim o modo `AUTOCOMMIT` na replica.

Quando o tipo de mecanismo de armazenamento da replica não for transacional, as transações na fonte que misturam atualizações de tabelas transacionais e não transacionais devem ser evitadas, pois elas podem causar inconsistência dos dados entre a tabela transacional da fonte e a tabela não transacional da replica. Isso significa que tais transações podem levar a comportamentos específicos do mecanismo de armazenamento da fonte, com o possível efeito de a replicação sair de sincronia. O MySQL não emite um aviso sobre isso atualmente, portanto, deve-se ter cuidado extra ao replicar tabelas transacionais da fonte para tabelas não transacionais nas réplicas.

**Mudando o formato de registro binário dentro das transações.** As variáveis de sistema [`binlog_format`](https://pt.wikipedia.org/wiki/Replicação_de_transações#Op%C3%A7%C3%B5es_bin%C3%A1rias_de_registro) e [`binlog_checksum`](https://pt.wikipedia.org/wiki/Replicação_de_transações#Op%C3%A7%C3%B5es_bin%C3%A1rias_de_registro) são somente de leitura enquanto uma transação estiver em andamento.

Cada transação (incluindo as transações de `autocommit` é registrada no log binário como se começasse com uma declaração de `BEGIN` e termine com uma declaração de `COMMIT` ou `ROLLBACK`. Isso vale mesmo para declarações que afetam tabelas que usam um motor de armazenamento não transacional (como `MyISAM`).

Nota

Para as restrições que se aplicam especificamente às transações XA, consulte Seção 13.3.7.3, “Restrições em Transações XA”.
