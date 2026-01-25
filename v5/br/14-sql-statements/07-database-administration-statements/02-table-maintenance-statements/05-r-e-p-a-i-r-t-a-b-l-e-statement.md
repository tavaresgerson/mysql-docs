#### 13.7.2.5 Instrução REPAIR TABLE

```sql
REPAIR [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
    [QUICK] [EXTENDED] [USE_FRM]
```

[`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") repara uma tabela possivelmente corrompida, apenas para certos Storage Engines.

Esta instrução requer privilégios [`SELECT`](privileges-provided.html#priv_select) e [`INSERT`](privileges-provided.html#priv_insert) para a tabela.

Embora normalmente você nunca deva precisar executar [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement"), se ocorrer um desastre, esta instrução é muito provável que recupere todos os seus dados de uma tabela `MyISAM`. Se suas tabelas se corrompem frequentemente, tente encontrar o motivo para eliminar a necessidade de usar [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement"). Consulte [Seção B.3.3.3, “What to Do If MySQL Keeps Crashing”](crashing.html "B.3.3.3 What to Do If MySQL Keeps Crashing"), e [Seção 15.2.4, “MyISAM Table Problems”](myisam-table-problems.html "15.2.4 MyISAM Table Problems").

[`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") verifica a tabela para ver se um upgrade é necessário. Se for, ele executa o upgrade, seguindo as mesmas regras que [`CHECK TABLE ... FOR UPGRADE`](check-table.html "13.7.2.2 CHECK TABLE Statement"). Consulte [Seção 13.7.2.2, “CHECK TABLE Statement”](check-table.html "13.7.2.2 CHECK TABLE Statement"), para mais informações.

Importante

* Faça um backup de uma tabela antes de realizar uma operação de reparo de tabela; em algumas circunstâncias, a operação pode causar perda de dados. Causas possíveis incluem, mas não se limitam a, erros do sistema de arquivos. Consulte [Capítulo 7, *Backup and Recovery*](backup-and-recovery.html "Capítulo 7 Backup and Recovery").

* Se o servidor sair durante uma operação [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement"), é essencial que, após reiniciá-lo, você execute imediatamente outra instrução [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") para a tabela antes de realizar quaisquer outras operações nela. No pior caso, você pode ter um novo arquivo Index limpo sem informações sobre o arquivo de dados, e então a próxima operação que você realizar pode sobrescrever o arquivo de dados. Este é um cenário improvável, mas possível, que sublinha o valor de fazer um backup primeiro.

* Caso uma tabela na origem seja corrompida e você execute [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") nela, quaisquer alterações resultantes na tabela original *não* são propagadas para as réplicas.

* [Suporte a Storage Engine e Partitioning do REPAIR TABLE](repair-table.html#repair-table-support "REPAIR TABLE Storage Engine and Partitioning Support")
* [Opções do REPAIR TABLE](repair-table.html#repair-table-options "REPAIR TABLE Options")
* [Saída do REPAIR TABLE](repair-table.html#repair-table-output "REPAIR TABLE Output")
* [Considerações sobre o Reparo de Tabela](repair-table.html#repair-table-table-repair-considerations "Table Repair Considerations")

##### Suporte a Storage Engine e Partitioning do REPAIR TABLE

[`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") funciona para tabelas [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), [`ARCHIVE`](archive-storage-engine.html "15.5 The ARCHIVE Storage Engine") e [`CSV`](csv-storage-engine.html "15.4 The CSV Storage Engine"). Para tabelas [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), por padrão, tem o mesmo efeito que [**myisamchk --recover *`tbl_name`***](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"). Esta instrução não funciona com views.

[`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") é suportado para tabelas partitioned. No entanto, a opção `USE_FRM` não pode ser usada com esta instrução em uma tabela partitioned.

Você pode usar `ALTER TABLE ... REPAIR PARTITION` para reparar uma ou mais Partitions; para mais informações, consulte [Seção 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement"), e [Seção 22.3.4, “Maintenance of Partitions”](partitioning-maintenance.html "22.3.4 Maintenance of Partitions").

##### Opções do REPAIR TABLE

* `NO_WRITE_TO_BINLOG` ou `LOCAL`

  Por padrão, o servidor escreve instruções [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") no Binary Log para que sejam replicadas para as réplicas. Para suprimir o logging, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

* `QUICK`

  Se você usar a opção `QUICK`, [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") tenta reparar apenas o arquivo Index, e não o arquivo de dados. Este tipo de reparo é semelhante ao realizado por [**myisamchk --recover --quick**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility").

* `EXTENDED`

  Se você usar a opção `EXTENDED`, o MySQL cria a linha Index por linha em vez de criar um Index de cada vez com ordenação (sorting). Este tipo de reparo é semelhante ao realizado por [**myisamchk --safe-recover**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility").

* `USE_FRM`

  A opção `USE_FRM` está disponível para uso se o arquivo Index `.MYI` estiver faltando ou se seu cabeçalho estiver corrompido. Esta opção informa ao MySQL para não confiar nas informações no arquivo `.MYI` e para recriá-lo usando informações do arquivo `.frm`. Este tipo de reparo não pode ser feito com [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility").

  Cuidado

  Use a opção `USE_FRM` *apenas* se você não puder usar os modos `REPAIR` regulares. Dizer ao servidor para ignorar o arquivo `.MYI` torna metadados importantes da tabela armazenados no `.MYI` indisponíveis para o processo de reparo, o que pode ter consequências prejudiciais:

  + O valor atual de `AUTO_INCREMENT` é perdido.

  + A ligação para registros excluídos na tabela é perdida, o que significa que o espaço livre para registros excluídos permanece desocupado a partir de então.

  + O cabeçalho `.MYI` indica se a tabela está compactada. Se o servidor ignorar esta informação, ele não poderá determinar que uma tabela está compactada e o reparo pode causar alteração ou perda do conteúdo da tabela. Isso significa que `USE_FRM` não deve ser usado com tabelas compactadas. Isso não deveria ser necessário, de qualquer forma: tabelas compactadas são somente leitura (read only), então não devem ser corrompidas.

  Se você usar `USE_FRM` para uma tabela que foi criada por uma versão diferente do servidor MySQL do que a que você está executando atualmente, [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") não tenta reparar a tabela. Neste caso, o Result Set retornado por [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") contém uma linha com um valor `Msg_type` de `error` e um valor `Msg_text` de `Failed repairing incompatible .FRM file`.

  Se `USE_FRM` for usado, [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") não verifica a tabela para ver se um upgrade é necessário.

##### Saída do REPAIR TABLE

[`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") retorna um Result Set com as colunas mostradas na tabela a seguir.

<table summary="Colunas do Result Set do REPAIR TABLE."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>O nome da tabela</td> </tr><tr> <td><code>Op</code></td> <td>Sempre <code>repair</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>, <code>error</code>, <code>info</code>, <code>note</code>, ou <code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>Uma mensagem informativa</td> </tr> </tbody></table>

A instrução [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") pode produzir muitas linhas de informação para cada tabela reparada. A última linha tem um valor `Msg_type` de `status` e `Msg_text` normalmente deve ser `OK`. Para uma tabela `MyISAM`, se você não receber `OK`, você deve tentar repará-la com [**myisamchk --safe-recover**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"). ([`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") não implementa todas as opções de [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"). Com [**myisamchk --safe-recover**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"), você também pode usar opções que [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") não suporta, como [`--max-record-length`](myisamchk-repair-options.html#option_myisamchk_max-record-length").)

A instrução [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") captura e lança quaisquer Errors que ocorram durante a cópia de estatísticas da tabela do arquivo corrompido antigo para o arquivo recém-criado. Por exemplo, se o ID do usuário proprietário do arquivo `.frm`, `.MYD` ou `.MYI` for diferente do ID do usuário do processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") gera um Error "cannot change ownership of the file" (não é possível alterar a propriedade do arquivo) a menos que [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") seja iniciado pelo usuário `root`.

##### Considerações sobre o Reparo de Tabela

[`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") realiza o upgrade de uma tabela se ela contiver colunas temporais antigas no formato pré-5.6.4 (colunas [`TIME`](time.html "11.2.3 The TIME Type"), [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") e [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") sem suporte para precisão de segundos fracionários) e se a variável de sistema [`avoid_temporal_upgrade`](server-system-variables.html#sysvar_avoid_temporal_upgrade) estiver desativada. Se [`avoid_temporal_upgrade`](server-system-variables.html#sysvar_avoid_temporal_upgrade) estiver ativada, [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") ignora as colunas temporais antigas presentes na tabela e não realiza o upgrade.

Para fazer o upgrade de tabelas que contenham tais colunas temporais, desative [`avoid_temporal_upgrade`](server-system-variables.html#sysvar_avoid_temporal_upgrade) antes de executar [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement").

Você pode aumentar o desempenho do [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") definindo certas variáveis de sistema. Consulte [Seção 8.6.3, “Optimizing REPAIR TABLE Statements”](repair-table-optimization.html "8.6.3 Optimizing REPAIR TABLE Statements").