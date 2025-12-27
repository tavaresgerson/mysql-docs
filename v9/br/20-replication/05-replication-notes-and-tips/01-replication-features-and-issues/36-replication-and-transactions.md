#### 19.5.1.36 Replicação e Transações

**Misturar declarações transacionais e não transacionais dentro da mesma transação.** No MySQL 9.5 (e versões posteriores), as transações que atualizam tanto tabelas transacionais quanto tabelas não transacionais ou não compostáveis são desaconselhadas, e isso gera uma mensagem de aviso de descontinuidade tanto para o cliente quanto para o log de erro. No MySQL 9.5, apenas os motores de armazenamento `InnoDB` e `BLACKHOLE` são transacionais e compostáveis; `NDBCLUSTER` é transacional, mas não compostável. Isso significa que as únicas combinações de motores de armazenamento que **não** geram a mensagem de aviso de descontinuidade são as listadas aqui:

* `InnoDB` e `BLACKHOLE`
* `MyISAM` e `Merge`
* `performance_schema` e qualquer outro motor de armazenamento

* `TempTable` e qualquer outro motor de armazenamento

Em geral, você deve evitar transações que atualizem tanto tabelas transacionais quanto não transacionais em um ambiente de replicação. Você também deve evitar usar qualquer declaração que acesse tanto tabelas transacionais (ou temporárias) quanto não transacionais e escreva em qualquer uma delas.

O servidor usa essas regras para o registro binário:

* Se as declarações iniciais em uma transação forem não transacionais, elas são escritas no log binário imediatamente. As declarações restantes na transação são armazenadas em cache e não são escritas no log binário até que a transação seja confirmada. (Se a transação for revertida, as declarações armazenadas em cache são escritas no log binário apenas se elas fizerem alterações não transacionais que não possam ser revertidas. Caso contrário, elas são descartadas.)

* Para o registro baseado em declarações, o registro de declarações não transacionais é afetado pela variável de sistema `binlog_direct_non_transactional_updates`. Quando essa variável está em `OFF` (o padrão), o registro ocorre conforme descrito. Quando essa variável está em `ON`, o registro ocorre imediatamente para declarações não transacionais que ocorrem em qualquer lugar da transação (não apenas declarações não transacionais iniciais). Outras declarações são mantidas no cache da transação e registradas quando a transação é confirmada. `binlog_direct_non_transactional_updates` não tem efeito para o registro binário de formato de linha ou misto.

**Declarações transacionais, não transacionais e mistas.** Para aplicar essas regras, o servidor considera uma declaração não transacional se ela alterar apenas tabelas não transacionais e transacional se ela alterar apenas tabelas transacionais. Uma declaração que referencia tanto tabelas não transacionais quanto transacionais e atualiza *qualquer* das tabelas envolvidas é considerada uma declaração “mista”. Declarações mistas, como declarações transacionais, são armazenadas no cache e registradas quando a transação é confirmada.

Uma declaração mista que atualiza uma tabela transacional é considerada insegura se a declaração também realizar uma das seguintes ações:

* Atualizar ou ler uma tabela temporária
* Ler uma tabela não transacional e o nível de isolamento de transação for menor que REPEATABLE_READ

Uma declaração mista que segue a atualização de uma tabela transacional dentro de uma transação é considerada insegura se ela realizar uma das seguintes ações:

* Atualizar qualquer tabela e ler de qualquer tabela temporária
* Atualizar uma tabela não transacional e `binlog_direct_non_transactional_updates` estiver em `OFF`

Para mais informações, consulte a Seção 19.2.1.3, “Determinação de declarações seguras e insegura em registro binário”.

Nota

Uma declaração mista não está relacionada ao formato de registro binário misto.

Em situações em que as transações misturam atualizações para tabelas transacionais e não transacionais, a ordem das declarações no log binário está correta e todas as declarações necessárias são escritas no log binário, mesmo em caso de `ROLLBACK`. No entanto, quando uma segunda conexão atualiza a tabela não transakcional antes que a transação da primeira conexão seja concluída, as declarações podem ser registradas fora da ordem porque a atualização da segunda conexão é escrita imediatamente após ser realizada, independentemente do estado da transação sendo realizada pela primeira conexão.

**Usando diferentes motores de armazenamento na fonte e na replica.** É possível replicar tabelas transacionais na fonte usando tabelas não transacionais na replica. Por exemplo, você pode replicar uma tabela `InnoDB` da fonte como uma tabela `MyISAM` da replica. No entanto, se você fizer isso, há problemas se a replica for parada no meio de um bloco `BEGIN`...`COMMIT` porque a replica reinicia no início do bloco `BEGIN`.

Também é seguro replicar transações de tabelas `MyISAM` na fonte para tabelas transacionais, como tabelas que usam o motor de armazenamento `InnoDB`, na replica. Nesse caso, uma declaração `AUTOCOMMIT=1` emitida na fonte é replicada, aplicando assim o modo `AUTOCOMMIT` na replica.

Quando o tipo de mecanismo de armazenamento da replica não for transacional, as transações na fonte que misturam atualizações de tabelas transacionais e não transacionais devem ser evitadas, pois podem causar inconsistência dos dados entre a tabela transacional da fonte e a tabela não transacional da replica. Isso significa que tais transações podem levar a comportamentos específicos do mecanismo de armazenamento da fonte com o possível efeito de des sincronia na replicação. O MySQL não emite um aviso sobre isso, portanto, deve-se ter cuidado extra ao replicar tabelas transacionais da fonte para tabelas não transacionais nas réplicas.

**Mudando o formato de registro binário dentro das transações.** As variáveis de sistema `binlog_format` e `binlog_checksum` são de leitura somente enquanto uma transação estiver em andamento.

Cada transação (incluindo transações `autocommit`) é registrada no log binário como se começasse com uma declaração `BEGIN` e termine com uma declaração `COMMIT` ou `ROLLBACK`. Isso vale mesmo para declarações que afetam tabelas que usam um mecanismo de armazenamento não transacional (como `MyISAM`).

Nota

Para restrições que se aplicam especificamente às transações XA, consulte a Seção 15.3.8.3, “Restrições para transações XA”.