#### 13.7.2.2 Instrução CHECK TABLE

```sql
CHECK TABLE tbl_name [, tbl_name] ... [option] ...

option: {
    FOR UPGRADE
  | QUICK
  | FAST
  | MEDIUM
  | EXTENDED
  | CHANGED
}
```

A [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") verifica uma ou mais tables em busca de erros. Para tables `MyISAM`, as estatísticas de Key também são atualizadas. A [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") também pode verificar views em busca de problemas, como tables referenciadas na definição da view que não existem mais.

Para verificar uma table, você deve ter algum privilégio sobre ela.

A [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") funciona para tables [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), [`ARCHIVE`](archive-storage-engine.html "15.5 The ARCHIVE Storage Engine") e [`CSV`](csv-storage-engine.html "15.4 The CSV Storage Engine").

Antes de executar [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") em tables `InnoDB`, consulte [Notas de Uso de CHECK TABLE para Tables InnoDB](check-table.html#check-table-innodb "CHECK TABLE Usage Notes for InnoDB Tables").

A [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") é suportada para tables particionadas, e você pode usar `ALTER TABLE ... CHECK PARTITION` para verificar uma ou mais Partitions; para mais informações, consulte [Seção 13.1.8, “Instrução ALTER TABLE”](alter-table.html "13.1.8 ALTER TABLE Statement"), e [Seção 22.3.4, “Manutenção de Partitions”](partitioning-maintenance.html "22.3.4 Maintenance of Partitions").

A [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") ignora colunas geradas virtuais que não estão indexadas.

* [Saída de CHECK TABLE](check-table.html#check-table-output "CHECK TABLE Output")
* [Verificando Compatibilidade de Versão](check-table.html#check-table-version-compatibility "Checking Version Compatibility")
* [Verificando Consistência de Dados](check-table.html#check-table-data-consistency "Checking Data Consistency")
* [Notas de Uso de CHECK TABLE para Tables InnoDB](check-table.html#check-table-innodb "CHECK TABLE Usage Notes for InnoDB Tables")
* [Notas de Uso de CHECK TABLE para Tables MyISAM](check-table.html#check-table-myisam "CHECK TABLE Usage Notes for MyISAM Tables")

##### Saída de CHECK TABLE

A [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") retorna um result set com as colunas mostradas na tabela a seguir.

<table summary="Colunas do result set de CHECK TABLE."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>O nome da table</td> </tr><tr> <td><code>Op</code></td> <td>Sempre <code>check</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>, <code>error</code>, <code>info</code>, <code>note</code>, ou <code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>Uma mensagem informativa</td> </tr> </tbody></table>

A instrução pode produzir muitas linhas de informação para cada table verificada. A última linha tem um valor `Msg_type` de `status` e o `Msg_text` normalmente deve ser `OK`. Para uma table `MyISAM`, se você não receber `OK` ou `Table is already up to date`, você deve normalmente executar um repair na table. Consulte [Seção 7.6, “Manutenção de Table MyISAM e Recuperação de Falhas”](myisam-table-maintenance.html "7.6 MyISAM Table Maintenance and Crash Recovery"). `Table is already up to date` significa que o storage engine para a table indicou que não havia necessidade de verificar a table.

##### Verificando Compatibilidade de Versão

A opção `FOR UPGRADE` verifica se as tables nomeadas são compatíveis com a versão atual do MySQL. Com `FOR UPGRADE`, o servidor verifica cada table para determinar se houve quaisquer alterações incompatíveis em qualquer um dos data types ou Indexes da table desde que ela foi criada. Caso não haja, a verificação é bem-sucedida. Caso contrário, se houver uma possível incompatibilidade, o servidor executa uma verificação completa na table (o que pode levar algum tempo). Se a verificação completa for bem-sucedida, o servidor marca o arquivo `.frm` da table com o número da versão atual do MySQL. Marcar o arquivo `.frm` garante que verificações futuras para a table com a mesma versão do servidor sejam rápidas.

Incompatibilidades podem ocorrer porque o formato de armazenamento para um data type foi alterado ou porque sua ordem de classificação foi alterada. Nosso objetivo é evitar essas alterações, mas ocasionalmente elas são necessárias para corrigir problemas que seriam piores do que uma incompatibilidade entre releases.

`FOR UPGRADE` descobre estas incompatibilidades:

* A ordem de Indexing para espaço final em colunas [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") para tables `InnoDB` e `MyISAM` mudou entre MySQL 4.1 e 5.0.

* O método de armazenamento do novo data type [`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC") mudou entre MySQL 5.0.3 e 5.0.5.

* Se sua table foi criada por uma versão do servidor MySQL diferente daquela que você está executando atualmente, `FOR UPGRADE` indica que a table possui um arquivo `.frm` com uma versão incompatível. Neste caso, o result set retornado por [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") contém uma linha com um valor `Msg_type` de `error` e um valor `Msg_text` de `` Table upgrade required. Please do "REPAIR TABLE `tbl_name`" to fix it! `` (Upgrade da table necessário. Por favor, execute "REPAIR TABLE `tbl_name`" para corrigi-la!)

* Alterações são, por vezes, feitas em character sets ou collations que exigem que os Indexes da table sejam reconstruídos. Para detalhes sobre tais alterações, consulte [Seção 2.10.3, “Alterações no MySQL 5.7”](upgrading-from-previous-series.html "2.10.3 Changes in MySQL 5.7"). Para informações sobre a reconstrução de tables, consulte [Seção 2.10.12, “Reconstruindo ou Reparando Tables ou Indexes”](rebuilding-tables.html "2.10.12 Rebuilding or Repairing Tables or Indexes").

* O data type [`YEAR(2)`](year.html "11.2.4 The YEAR Type") está obsoleto e seu suporte foi removido no MySQL 5.7.5. Para tables que contêm colunas [`YEAR(2)`](year.html "11.2.4 The YEAR Type"), [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") recomenda [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement"), que converte colunas [`YEAR(2)`](year.html "11.2.4 The YEAR Type") de 2 dígitos para colunas [`YEAR`](year.html "11.2.4 The YEAR Type") de 4 dígitos.

* A partir do MySQL 5.7.2, o tempo de criação de Trigger é mantido. Se executado em uma table que possui Triggers, [`CHECK TABLE ... FOR UPGRADE`](check-table.html "13.7.2.2 CHECK TABLE Statement") exibe este aviso para cada Trigger criado antes do MySQL 5.7.2:

  ```sql
  Trigger db_name.tbl_name.trigger_name does not have CREATED attribute.
  ```

  O aviso é apenas informativo. Nenhuma alteração é feita no Trigger.

* A partir do MySQL 5.7.7, uma table é relatada como precisando de reconstrução se contiver colunas temporais antigas no formato pré-5.6.4 (colunas [`TIME`](time.html "11.2.3 The TIME Type"), [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") e [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") sem suporte para precisão de segundos fracionários) e a system variable [`avoid_temporal_upgrade`](server-system-variables.html#sysvar_avoid_temporal_upgrade) estiver desabilitada. Isso ajuda o procedimento de upgrade do MySQL a detectar e atualizar tables contendo colunas temporais antigas. Se [`avoid_temporal_upgrade`](server-system-variables.html#sysvar_avoid_temporal_upgrade) estiver habilitada, `FOR UPGRADE` ignora as colunas temporais antigas presentes na table; consequentemente, o procedimento de upgrade não as atualiza.

  Para verificar tables que contenham tais colunas temporais e precisem de uma reconstrução, desabilite [`avoid_temporal_upgrade`](server-system-variables.html#sysvar_avoid_temporal_upgrade) antes de executar [`CHECK TABLE ... FOR UPGRADE`](check-table.html "13.7.2.2 CHECK TABLE Statement").

* Avisos são emitidos para tables que usam particionamento não-nativo porque o particionamento não-nativo está obsoleto no MySQL 5.7 e foi removido no MySQL 8.0. Consulte [Capítulo 22, *Particionamento*](partitioning.html "Chapter 22 Partitioning").

##### Verificando Consistência de Dados

A tabela a seguir mostra as outras opções de verificação que podem ser fornecidas. Essas opções são passadas para o storage engine, que pode usá-las ou ignorá-las.

<table summary="Outras opções de CHECK TABLE."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Tipo</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>QUICK</code></td> <td>Não faz o scan das linhas para verificar links incorretos. Aplica-se a tables e views <code>InnoDB</code> e <code>MyISAM</code>.</td> </tr><tr> <td><code>FAST</code></td> <td>Verifica apenas tables que não foram fechadas corretamente. Ignorado para <code>InnoDB</code>; aplica-se apenas a tables e views <code>MyISAM</code>.</td> </tr><tr> <td><code>CHANGED</code></td> <td>Verifica apenas tables que foram alteradas desde a última verificação ou que não foram fechadas corretamente. Ignorado para <code>InnoDB</code>; aplica-se apenas a tables e views <code>MyISAM</code>.</td> </tr><tr> <td><code>MEDIUM</code></td> <td>Faz o scan das linhas para verificar se os links excluídos são válidos. Isso também calcula um Key checksum para as linhas e o verifica com um checksum calculado para os Keys. Ignorado para <code>InnoDB</code>; aplica-se apenas a tables e views <code>MyISAM</code>.</td> </tr><tr> <td><code>EXTENDED</code></td> <td>Faz uma Key lookup completa para todos os Keys de cada linha. Isso garante que a table esteja 100% consistente, mas leva muito tempo. Ignorado para <code>InnoDB</code>; aplica-se apenas a tables e views <code>MyISAM</code>.</td> </tr></tbody></table>

Se nenhuma das opções `QUICK`, `MEDIUM` ou `EXTENDED` for especificada, o tipo de verificação padrão para tables `MyISAM` de formato dinâmico é `MEDIUM`. Isso tem o mesmo resultado que executar [**myisamchk --medium-check *`tbl_name`***](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") na table. O tipo de verificação padrão também é `MEDIUM` para tables `MyISAM` de formato estático, a menos que `CHANGED` ou `FAST` seja especificado. Nesse caso, o padrão é `QUICK`. O scan de linhas é ignorado para `CHANGED` e `FAST` porque as linhas raramente são corrompidas.

Você pode combinar opções de verificação, como no exemplo a seguir que faz uma verificação rápida na table para determinar se ela foi fechada corretamente:

```sql
CHECK TABLE test_table FAST QUICK;
```

Nota

Se [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") não encontrar problemas com uma table que está marcada como “corrompida” ou “não fechada corretamente”, a [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") pode remover a marcação.

Se uma table estiver corrompida, o problema provavelmente está nos Indexes e não na parte dos dados. Todos os tipos de verificação anteriores verificam os Indexes minuciosamente e, portanto, devem encontrar a maioria dos erros.

Para verificar uma table que você assume estar OK, não use opções de verificação ou use a opção `QUICK`. Esta última deve ser usada quando você está com pressa e pode correr o risco muito pequeno de que `QUICK` não encontre um erro no arquivo de dados. (Na maioria dos casos, sob uso normal, o MySQL deve encontrar qualquer erro no arquivo de dados. Se isso acontecer, a table é marcada como “corrompida” e não pode ser usada até ser reparada.)

`FAST` e `CHANGED` destinam-se principalmente a serem usados a partir de um script (por exemplo, para serem executados via **cron**) para verificar tables periodicamente. Na maioria dos casos, `FAST` é preferível a `CHANGED`. (O único caso em que não é preferível é quando você suspeita que encontrou um bug no código `MyISAM`.)

`EXTENDED` deve ser usado somente após você ter executado uma verificação normal, mas ainda receber erros de uma table quando o MySQL tenta atualizar uma linha ou encontrar uma linha por Key. Isso é muito improvável se uma verificação normal tiver sido bem-sucedida.

O uso de [`CHECK TABLE ... EXTENDED`](check-table.html "13.7.2.2 CHECK TABLE Statement") pode influenciar os planos de execução gerados pelo otimizador de Query.

Alguns problemas relatados por [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") não podem ser corrigidos automaticamente:

* `Found row where the auto_increment column has the value 0` (Linha encontrada onde a coluna auto_increment tem o valor 0).

  Isso significa que você tem uma linha na table onde a coluna Index `AUTO_INCREMENT` contém o valor 0. (É possível criar uma linha onde a coluna `AUTO_INCREMENT` é 0 configurando explicitamente a coluna para 0 com uma instrução [`UPDATE`](update.html "13.2.11 UPDATE Statement").)

  Isso não é um erro em si, mas pode causar problemas se você decidir fazer dump da table e restaurá-la ou executar um [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") na table. Neste caso, a coluna `AUTO_INCREMENT` muda de valor de acordo com as regras das colunas `AUTO_INCREMENT`, o que pode causar problemas como um erro de Key duplicado.

  Para se livrar do aviso, execute uma instrução [`UPDATE`](update.html "13.2.11 UPDATE Statement") para definir a coluna para algum valor diferente de 0.

##### Notas de Uso de CHECK TABLE para Tables InnoDB

As notas a seguir se aplicam a tables [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"):

* Se [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") encontrar uma page corrompida, o servidor é encerrado para evitar a propagação de erros (Bug #10132). Se a corrupção ocorrer em um Secondary Index, mas os dados da table forem legíveis, a execução de [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") ainda pode causar o encerramento do servidor.

* Se [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") encontrar um campo `DB_TRX_ID` ou `DB_ROLL_PTR` corrompido em um clustered Index, a [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") pode fazer com que o `InnoDB` acesse um registro de undo log inválido, resultando em um encerramento do servidor relacionado a [MVCC](glossary.html#glos_mvcc "MVCC").

* Se [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") encontrar erros em tables ou Indexes `InnoDB`, ela relata um erro e geralmente marca o Index e, às vezes, marca a table como corrompida, impedindo o uso posterior do Index ou da table. Tais erros incluem um número incorreto de entradas em um Secondary Index ou links incorretos.

* Se [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") encontrar um número incorreto de entradas em um Secondary Index, ela relata um erro, mas não causa o encerramento do servidor nem impede o acesso ao arquivo.

* A [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") inspeciona a estrutura da Index page e, em seguida, inspeciona cada Key entry. Ela não valida o Key pointer para um registro agrupado (clustered record) nem segue o caminho para os pointers [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types").

* Quando uma table `InnoDB` é armazenada em seu próprio [arquivo `.ibd`](glossary.html#glos_ibd_file ".ibd file"), as 3 primeiras [pages](glossary.html#glos_page "page") do arquivo `.ibd` contêm informações de cabeçalho (header) em vez de dados de table ou Index. A instrução [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") não detecta inconsistências que afetam apenas os dados do cabeçalho. Para verificar todo o conteúdo de um arquivo `.ibd` do `InnoDB`, use o comando [**innochecksum**](innochecksum.html "4.6.1 innochecksum — Offline InnoDB File Checksum Utility").

* Ao executar [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") em tables `InnoDB` grandes, outros Threads podem ser bloqueados durante a execução de [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement"). Para evitar timeouts, o threshold de espera de semáforo (600 segundos) é estendido em 2 horas (7200 segundos) para operações de [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement"). Se o `InnoDB` detectar esperas de semáforo de 240 segundos ou mais, ele começa a imprimir a saída do monitor `InnoDB` no error log. Se uma solicitação de Lock se estender além do threshold de espera de semáforo, o `InnoDB` aborta o processo. Para evitar totalmente a possibilidade de um timeout de espera de semáforo, execute [`CHECK TABLE QUICK`](check-table.html "13.7.2.2 CHECK TABLE Statement") em vez de [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement").

* A funcionalidade de [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") para Indexes `SPATIAL` do `InnoDB` inclui uma verificação de validade R-tree e uma verificação para garantir que a contagem de linhas R-tree corresponda ao clustered Index.

* A [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") suporta Secondary Indexes em colunas geradas virtuais, que são suportadas pelo `InnoDB`.

##### Notas de Uso de CHECK TABLE para Tables MyISAM

As notas a seguir se aplicam a tables [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"):

* A [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") atualiza as Key statistics para tables `MyISAM`.

* Se a saída de [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") não retornar `OK` ou `Table is already up to date`, você deve normalmente executar um repair na table. Consulte [Seção 7.6, “Manutenção de Table MyISAM e Recuperação de Falhas”](myisam-table-maintenance.html "7.6 MyISAM Table Maintenance and Crash Recovery").

* Se nenhuma das opções de [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") (`QUICK`, `MEDIUM` ou `EXTENDED`) for especificada, o tipo de verificação padrão para tables `MyISAM` de formato dinâmico é `MEDIUM`. Isso tem o mesmo resultado que executar [**myisamchk --medium-check *`tbl_name`***](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") na table. O tipo de verificação padrão também é `MEDIUM` para tables `MyISAM` de formato estático, a menos que `CHANGED` ou `FAST` seja especificado. Nesse caso, o padrão é `QUICK`. O scan de linhas é ignorado para `CHANGED` e `FAST` porque as linhas raramente são corrompidas.