#### 13.7.2.5 Instrução REPAIR TABLE

```sql
REPAIR [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
    [QUICK] [EXTENDED] [USE_FRM]
```

`REPAIR TABLE` repara uma tabela possivelmente corrompida, apenas para certos Storage Engines.

Esta instrução requer privilégios `SELECT` e `INSERT` para a tabela.

Embora normalmente você nunca deva precisar executar `REPAIR TABLE`, se ocorrer um desastre, esta instrução é muito provável que recupere todos os seus dados de uma tabela `MyISAM`. Se suas tabelas se corrompem frequentemente, tente encontrar o motivo para eliminar a necessidade de usar `REPAIR TABLE`. Consulte Seção B.3.3.3, “What to Do If MySQL Keeps Crashing”, e Seção 15.2.4, “MyISAM Table Problems”.

`REPAIR TABLE` verifica a tabela para ver se um upgrade é necessário. Se for, ele executa o upgrade, seguindo as mesmas regras que `CHECK TABLE ... FOR UPGRADE`. Consulte Seção 13.7.2.2, “CHECK TABLE Statement”, para mais informações.

Importante

* Faça um backup de uma tabela antes de realizar uma operação de reparo de tabela; em algumas circunstâncias, a operação pode causar perda de dados. Causas possíveis incluem, mas não se limitam a, erros do sistema de arquivos. Consulte Capítulo 7, *Backup and Recovery*.

* Se o servidor sair durante uma operação `REPAIR TABLE`, é essencial que, após reiniciá-lo, você execute imediatamente outra instrução `REPAIR TABLE` para a tabela antes de realizar quaisquer outras operações nela. No pior caso, você pode ter um novo arquivo Index limpo sem informações sobre o arquivo de dados, e então a próxima operação que você realizar pode sobrescrever o arquivo de dados. Este é um cenário improvável, mas possível, que sublinha o valor de fazer um backup primeiro.

* Caso uma tabela na origem seja corrompida e você execute `REPAIR TABLE` nela, quaisquer alterações resultantes na tabela original *não* são propagadas para as réplicas.

* Suporte a Storage Engine e Partitioning do REPAIR TABLE
* Opções do REPAIR TABLE
* Saída do REPAIR TABLE
* Considerações sobre o Reparo de Tabela

##### Suporte a Storage Engine e Partitioning do REPAIR TABLE

`REPAIR TABLE` funciona para tabelas `MyISAM`, `ARCHIVE` e `CSV`. Para tabelas `MyISAM`, por padrão, tem o mesmo efeito que **myisamchk --recover *`tbl_name`***. Esta instrução não funciona com views.

`REPAIR TABLE` é suportado para tabelas partitioned. No entanto, a opção `USE_FRM` não pode ser usada com esta instrução em uma tabela partitioned.

Você pode usar `ALTER TABLE ... REPAIR PARTITION` para reparar uma ou mais Partitions; para mais informações, consulte Seção 13.1.8, “ALTER TABLE Statement”, e Seção 22.3.4, “Maintenance of Partitions”.

##### Opções do REPAIR TABLE

* `NO_WRITE_TO_BINLOG` ou `LOCAL`

  Por padrão, o servidor escreve instruções `REPAIR TABLE` no Binary Log para que sejam replicadas para as réplicas. Para suprimir o logging, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

* `QUICK`

  Se você usar a opção `QUICK`, `REPAIR TABLE` tenta reparar apenas o arquivo Index, e não o arquivo de dados. Este tipo de reparo é semelhante ao realizado por **myisamchk --recover --quick**.

* `EXTENDED`

  Se você usar a opção `EXTENDED`, o MySQL cria a linha Index por linha em vez de criar um Index de cada vez com ordenação (sorting). Este tipo de reparo é semelhante ao realizado por **myisamchk --safe-recover**.

* `USE_FRM`

  A opção `USE_FRM` está disponível para uso se o arquivo Index `.MYI` estiver faltando ou se seu cabeçalho estiver corrompido. Esta opção informa ao MySQL para não confiar nas informações no arquivo `.MYI` e para recriá-lo usando informações do arquivo `.frm`. Este tipo de reparo não pode ser feito com **myisamchk**.

  Cuidado

  Use a opção `USE_FRM` *apenas* se você não puder usar os modos `REPAIR` regulares. Dizer ao servidor para ignorar o arquivo `.MYI` torna metadados importantes da tabela armazenados no `.MYI` indisponíveis para o processo de reparo, o que pode ter consequências prejudiciais:

  + O valor atual de `AUTO_INCREMENT` é perdido.

  + A ligação para registros excluídos na tabela é perdida, o que significa que o espaço livre para registros excluídos permanece desocupado a partir de então.

  + O cabeçalho `.MYI` indica se a tabela está compactada. Se o servidor ignorar esta informação, ele não poderá determinar que uma tabela está compactada e o reparo pode causar alteração ou perda do conteúdo da tabela. Isso significa que `USE_FRM` não deve ser usado com tabelas compactadas. Isso não deveria ser necessário, de qualquer forma: tabelas compactadas são somente leitura (read only), então não devem ser corrompidas.

  Se você usar `USE_FRM` para uma tabela que foi criada por uma versão diferente do servidor MySQL do que a que você está executando atualmente, `REPAIR TABLE` não tenta reparar a tabela. Neste caso, o Result Set retornado por `REPAIR TABLE` contém uma linha com um valor `Msg_type` de `error` e um valor `Msg_text` de `Failed repairing incompatible .FRM file`.

  Se `USE_FRM` for usado, `REPAIR TABLE` não verifica a tabela para ver se um upgrade é necessário.

##### Saída do REPAIR TABLE

`REPAIR TABLE` retorna um Result Set com as colunas mostradas na tabela a seguir.

<table summary="Colunas do Result Set do REPAIR TABLE."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>O nome da tabela</td> </tr><tr> <td><code>Op</code></td> <td>Sempre <code>repair</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>, <code>error</code>, <code>info</code>, <code>note</code>, ou <code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>Uma mensagem informativa</td> </tr> </tbody></table>

A instrução `REPAIR TABLE` pode produzir muitas linhas de informação para cada tabela reparada. A última linha tem um valor `Msg_type` de `status` e `Msg_text` normalmente deve ser `OK`. Para uma tabela `MyISAM`, se você não receber `OK`, você deve tentar repará-la com **myisamchk --safe-recover**. (`REPAIR TABLE` não implementa todas as opções de **myisamchk**. Com **myisamchk --safe-recover**, você também pode usar opções que `REPAIR TABLE` não suporta, como `--max-record-length`.)

A instrução `REPAIR TABLE` captura e lança quaisquer Errors que ocorram durante a cópia de estatísticas da tabela do arquivo corrompido antigo para o arquivo recém-criado. Por exemplo, se o ID do usuário proprietário do arquivo `.frm`, `.MYD` ou `.MYI` for diferente do ID do usuário do processo **mysqld**, `REPAIR TABLE` gera um Error "cannot change ownership of the file" (não é possível alterar a propriedade do arquivo) a menos que **mysqld** seja iniciado pelo usuário `root`.

##### Considerações sobre o Reparo de Tabela

`REPAIR TABLE` realiza o upgrade de uma tabela se ela contiver colunas temporais antigas no formato pré-5.6.4 (colunas `TIME`, `DATETIME` e `TIMESTAMP` sem suporte para precisão de segundos fracionários) e se a variável de sistema `avoid_temporal_upgrade` estiver desativada. Se `avoid_temporal_upgrade` estiver ativada, `REPAIR TABLE` ignora as colunas temporais antigas presentes na tabela e não realiza o upgrade.

Para fazer o upgrade de tabelas que contenham tais colunas temporais, desative `avoid_temporal_upgrade` antes de executar `REPAIR TABLE`.

Você pode aumentar o desempenho do `REPAIR TABLE` definindo certas variáveis de sistema. Consulte Seção 8.6.3, “Optimizing REPAIR TABLE Statements”.