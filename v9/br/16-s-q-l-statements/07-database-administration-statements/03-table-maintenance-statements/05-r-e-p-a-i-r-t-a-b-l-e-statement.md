#### 15.7.3.5 Declaração de REPAIR TABLE

```
REPAIR [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
    [QUICK] [EXTENDED] [USE_FRM]
```

`REPAIR TABLE` repara uma tabela possivelmente corrompida, apenas para certos motores de armazenamento.

Esta declaração requer privilégios de `SELECT` e `INSERT` para a tabela.

Embora normalmente você nunca deva precisar executar `REPAIR TABLE`, se um desastre ocorrer, esta declaração é muito provável que retorne todos os seus dados de uma tabela `MyISAM`. Se suas tabelas forem corrompidas frequentemente, tente encontrar a razão para isso, para eliminar a necessidade de usar `REPAIR TABLE`. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”, e a Seção 18.2.4, “Problemas de tabela MyISAM”.

`REPAIR TABLE` verifica a tabela para ver se é necessário um upgrade. Se for o caso, ele executa o upgrade, seguindo as mesmas regras que `CHECK TABLE ... FOR UPGRADE`. Veja a Seção 15.7.3.2, “Declaração CHECK TABLE”, para mais informações.

Importante

* Faça um backup de uma tabela antes de realizar uma operação de reparo de tabela; em algumas circunstâncias, a operação pode causar perda de dados. As possíveis causas incluem, mas não estão limitadas a, erros no sistema de arquivos. Veja o Capítulo 9, *Backup e Recuperação*.

* Se o servidor sair durante uma operação de `REPAIR TABLE`, é essencial, após reiniciá-lo, executar imediatamente outra declaração `REPAIR TABLE` para a tabela antes de realizar qualquer outra operação nela. No pior dos casos, você pode ter um novo arquivo de índice limpo sem informações sobre o arquivo de dados, e então a próxima operação que você realizar pode sobrescrever o arquivo de dados. Esse é um cenário improvável, mas possível, que sublinha o valor de fazer um backup primeiro.

* No caso de uma tabela na fonte ser corrompida e você executar `REPAIR TABLE` nela, quaisquer alterações resultantes na tabela original não são propagadas para réplicas.

* Suporte ao Motor de Armazenamento e Partição de `REPAIR TABLE`
* Opções de `REPAIR TABLE`
* Saída de `REPAIR TABLE`
* Considerações para a Reparação de Tabelas

##### Suporte ao Motor de Armazenamento e Partição de `REPAIR TABLE`

`REPAIR TABLE` funciona para tabelas `MyISAM`, `ARCHIVE` e `CSV`. Para tabelas `MyISAM`, ele tem o mesmo efeito que **myisamchk --recover *`tbl_name`*** por padrão. Esta declaração não funciona com visualizações.

`REPAIR TABLE` é suportado para tabelas particionadas. No entanto, a opção `USE_FRM` não pode ser usada com esta declaração em uma tabela particionada.

Você pode usar `ALTER TABLE ... REPAIR PARTITION` para reparar uma ou mais partições; para mais informações, consulte a Seção 15.1.11, “Instrução ALTER TABLE”, e a Seção 26.3.4, “Manutenção de Partições”.

##### Opções de `REPAIR TABLE`

* `NO_WRITE_TO_BINLOG` ou `LOCAL`

  Por padrão, o servidor escreve as declarações de `REPAIR TABLE` no log binário para que sejam replicadas para réplicas. Para suprimir o registro, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

* `QUICK`

  Se você usar a opção `QUICK`, `REPAIR TABLE` tenta reparar apenas o arquivo de índice e não o arquivo de dados. Esse tipo de reparo é como o feito por **myisamchk --recover --quick**.

* `EXTENDED`

  Se você usar a opção `EXTENDED`, o MySQL cria a linha de índice linha por linha em vez de criar um índice de cada vez com ordenação. Esse tipo de reparo é como o feito por **myisamchk --safe-recover**.

* `USE_FRM`

  A opção `USE_FRM` está disponível para uso se o arquivo de índice `.MYI` estiver ausente ou se seu cabeçalho estiver corrompido. Esta opção diz ao MySQL para não confiar nas informações no cabeçalho do arquivo `.MYI` e para recriá-lo usando informações do dicionário de dados. Esse tipo de reparo não pode ser feito com **myisamchk**.

  Cuidado

Use a opção `USE_FRM` *apenas* se você não puder usar os modos regulares de `REPAIR`. Informar ao servidor para ignorar o arquivo `.MYI` torna os metadados importantes da tabela armazenados no `.MYI` indisponíveis para o processo de reparo, o que pode ter consequências prejudiciais:

+ O valor atual do `AUTO_INCREMENT` é perdido.

+ O link para os registros excluídos na tabela é perdido, o que significa que o espaço livre para os registros excluídos permanece desocupado posteriormente.

+ O cabeçalho `.MYI` indica se a tabela está compactada. Se o servidor ignorar essa informação, ele não poderá determinar que uma tabela está compactada e o reparo pode causar alterações ou perda de conteúdo da tabela. Isso significa que `USE_FRM` não deve ser usado com tabelas compactadas. Isso não deveria ser necessário, de qualquer forma: Tabelas compactadas são apenas de leitura, então elas não deveriam se corromper.

Se você usar `USE_FRM` para uma tabela criada por uma versão diferente do servidor MySQL do que a que você está executando atualmente, o `REPAIR TABLE` não tentará reparar a tabela. Nesse caso, o conjunto de resultados retornado pelo `REPAIR TABLE` contém uma linha com um valor `Msg_type` de `error` e um valor `Msg_text` de `Failed repairing incompatible .FRM file`.

Se `USE_FRM` for usado, o `REPAIR TABLE` não verifica a tabela para ver se é necessário um upgrade.

##### Saída do REPAIR TABLE

O `REPAIR TABLE` retorna um conjunto de resultados com as colunas mostradas na tabela a seguir.

<table summary="Colunas do conjunto de resultados da instrução REPAIR TABLE."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code class="literal">Tabela</code></td> <td>O nome da tabela</td> </tr><tr> <td><code class="literal">Op</code></td> <td>Sempre <code class="literal">reparar</code></td> </tr><tr> <td><code class="literal">Msg_type</code></td> <td><code class="literal">status</code>, <code class="literal">error</code>, <code class="literal">info</code>, <code class="literal">note</code>, ou <code class="literal">warning</code></td> </tr><tr> <td><code class="literal">Msg_text</code></td> <td>Uma mensagem informativa</td> </tr></tbody></table>

A instrução `REPAIR TABLE` pode gerar muitas linhas de informações para cada tabela reparada. A última linha tem um valor de `Msg_type` de `status` e `Msg_test` normalmente deve ser `OK`. Para uma tabela `MyISAM`, se você não conseguir `OK`, deve tentar repará-la com **myisamchk --safe-recover**. (`REPAIR TABLE` não implementa todas as opções de **myisamchk**. Com **myisamchk --safe-recover**, você também pode usar opções que `REPAIR TABLE` não suporta, como `--max-record-length`.)

A tabela `REPAIR TABLE` captura e lança quaisquer erros que ocorram durante a cópia das estatísticas da tabela do arquivo antigo corrompido para o arquivo recém-criado. Por exemplo, se o ID do usuário do proprietário do arquivo `.MYD` ou `.MYI` for diferente do ID do usuário do processo **mysqld**, a `REPAIR TABLE` gera um erro de "não é possível alterar a propriedade do arquivo" a menos que **mysqld** seja iniciado pelo usuário `root`.

##### Considerações sobre a Reparação da Tabela

Você pode aumentar o desempenho da `REPAIR TABLE` configurando certas variáveis de sistema. Veja a Seção 10.6.3, “Otimizando Instruções REPAIR TABLE”.

`REPAIR TABLE` atualiza uma tabela se ela contiver colunas temporais antigas no formato anterior a 5.6.4; especificamente, as colunas `TIME`, `DATETIME` e `TIMESTAMP` que não tinham suporte para precisão de frações de segundo.