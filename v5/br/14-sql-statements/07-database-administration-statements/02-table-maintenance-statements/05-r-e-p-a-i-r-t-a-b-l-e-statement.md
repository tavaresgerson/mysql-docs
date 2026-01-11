#### 13.7.2.5 Declaração de REPARO DE TÁBUA

```sql
REPAIR [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
    [QUICK] [EXTENDED] [USE_FRM]
```

`REPAIR TABLE` repara uma tabela possivelmente corrompida, apenas para determinados motores de armazenamento.

Esta declaração requer privilégios de `SELECT` e `INSERT` para a tabela.

Embora normalmente você nunca deva precisar executar `REPAIR TABLE`, se um desastre acontecer, essa declaração provavelmente recuperará todos os seus dados de uma tabela `MyISAM`. Se suas tabelas forem corrompidas com frequência, tente encontrar a razão para isso, para eliminar a necessidade de usar `REPAIR TABLE`. Veja Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar” e Seção 15.2.4, “Problemas com tabelas MyISAM”.

`REPAIR TABLE` verifica a tabela para ver se é necessário um upgrade. Se for o caso, ele executa o upgrade, seguindo as mesmas regras que `CHECK TABLE ... FOR UPGRADE`. Consulte Seção 13.7.2.2, “Instrução CHECK TABLE” para obter mais informações.

Importante

- Faça um backup de uma tabela antes de realizar uma operação de reparo de tabela; em algumas circunstâncias, a operação pode causar perda de dados. As possíveis causas incluem, mas não estão limitadas a, erros no sistema de arquivos. Consulte [Capítulo 7, *Backup e Recuperação*] (backup-and-recovery.html).

- Se o servidor sair durante uma operação de `REPAIR TABLE`, é essencial, após o reinício, executar imediatamente outra instrução `REPAIR TABLE` para a tabela antes de realizar qualquer outra operação nela. No pior dos casos, você pode ter um novo arquivo de índice limpo sem informações sobre o arquivo de dados, e então a próxima operação que você realizar pode sobrescrever o arquivo de dados. Esse é um cenário improvável, mas possível, que destaca o valor de fazer um backup primeiro.

- Caso uma tabela na fonte seja corrompida e você execute `REPAIR TABLE` nela, quaisquer alterações resultantes na tabela original *não serão* propagadas às réplicas.

- Suporte ao motor de armazenamento e particionamento da tabela de reparo

- Opções de reparo da tabela

- SAIBA MAIS SOBRE A TABELA

- Considerações sobre a reparação de tabelas

##### Suporte ao motor de armazenamento e particionamento da tabela de reparo

`REPAIR TABLE` funciona para tabelas de `MyISAM`, `ARCHIVE` e `CSV`. Para tabelas de `MyISAM`, ele tem o mesmo efeito que **myisamchk --recover *`tbl_name`*** por padrão. Esta declaração não funciona com visualizações.

A opção `REPAIR TABLE` é suportada para tabelas particionadas. No entanto, a opção `USE_FRM` não pode ser usada com essa instrução em uma tabela particionada.

Você pode usar `ALTER TABLE ... REPAIR PARTITION` para reparar uma ou mais partições; para mais informações, consulte Seção 13.1.8, “Instrução ALTER TABLE” e Seção 22.3.4, “Manutenção de Partições”.

##### Opções de REPARAR TÁBUA

- `NO_WRITE_TO_BINLOG` ou `LOCAL`

  Por padrão, o servidor escreve as instruções `REPAIR TABLE` no log binário para que elas sejam replicadas para as réplicas. Para suprimir o registro, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

- `RÁPIDO`

  Se você usar a opção `QUICK`, o `REPAIR TABLE` tenta reparar apenas o arquivo de índice e não o arquivo de dados. Esse tipo de reparo é semelhante ao realizado por **myisamchk --recover --quick**.

- `EXTENDIDO`

  Se você usar a opção `EXTENDED`, o MySQL cria a linha do índice linha por linha, em vez de criar um índice de cada vez com classificação. Esse tipo de reparo é semelhante ao realizado pelo **myisamchk --safe-recover**.

- `USE_FRM`

  A opção `USE_FRM` está disponível para uso se o arquivo de índice `.MYI` estiver ausente ou se seu cabeçalho estiver corrompido. Esta opção informa ao MySQL para não confiar nas informações no cabeçalho do arquivo `.MYI` e para recriá-lo usando informações do arquivo `.frm`. Esse tipo de reparo não pode ser feito com **myisamchk**.

  Cuidado

  Use a opção `USE_FRM` *apenas* se você não puder usar os modos regulares de `REPAIR`. Informar ao servidor para ignorar o arquivo `.MYI` torna os metadados importantes das tabelas armazenados no `.MYI` indisponíveis para o processo de reparo, o que pode ter consequências prejudiciais:

  - O valor atual de `AUTO_INCREMENT` é perdido.

  - O link para os registros excluídos na tabela é perdido, o que significa que o espaço livre para os registros excluídos permanece desocupado a partir daí.

  - O cabeçalho `.MYI` indica se a tabela está comprimida. Se o servidor ignorar essa informação, ele não poderá determinar se uma tabela está comprimida e a reparação pode causar alterações ou perda do conteúdo da tabela. Isso significa que o `USE_FRM` não deve ser usado com tabelas comprimidas. Isso não deveria ser necessário, de qualquer forma: as tabelas comprimidas são apenas de leitura, então elas não deveriam ficar corrompidas.

  Se você usar `USE_FRM` para uma tabela criada por uma versão diferente do servidor MySQL daquela que você está executando atualmente, o `REPAIR TABLE` não tentará reparar a tabela. Nesse caso, o conjunto de resultados retornado pelo `REPAIR TABLE` contém uma linha com um valor `Msg_type` de `error` e um valor `Msg_text` de `Falha ao reparar o arquivo .FRM incompatível`.

  Se `USE_FRM` for usado, o comando `REPAIR TABLE` (reparar tabela) não verifica a tabela para ver se é necessário um upgrade.

##### REPARAR TÁBLIA Saída

`REPAIR TABLE` retorna um conjunto de resultados com as colunas mostradas na tabela a seguir.

<table summary="Colunas do conjunto de resultados da tabela REPAIR."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>O nome da tabela</td> </tr><tr> <td><code>Op</code></td> <td>Sempre <code>repair</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>, <code>error</code>, <code>info</code>, <code>note</code> ou <code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>Uma mensagem informativa</td> </tr></tbody></table>

A instrução `REPAIR TABLE` pode gerar muitas linhas de informações para cada tabela reparada. A última linha tem um valor `Msg_type` de `status` e `Msg_test` normalmente deve ser `OK`. Para uma tabela `MyISAM`, se você não obtiver `OK`, deve tentar repará-la com **myisamchk --safe-recover**. (`REPAIR TABLE` não implementa todas as opções de **myisamchk**. Com **myisamchk --safe-recover**, você também pode usar opções que `REPAIR TABLE` não suporta, como `--max-record-length`.)

A tabela `[REPAIR TABLE]` (repair-table.html) captura e exibe quaisquer erros que ocorram durante a cópia das estatísticas da tabela do arquivo antigo corrompido para o arquivo recém-criado. Por exemplo, se o ID do usuário do proprietário do arquivo `.frm`, `.MYD` ou `.MYI` for diferente do ID do usuário do processo **mysqld**, a `[REPAIR TABLE]` (repair-table.html) gera um erro de "não é possível alterar a propriedade do arquivo" a menos que o **mysqld** seja iniciado pelo usuário `root`.

##### Considerações sobre a reparação de mesas

`REPAIR TABLE` atualiza uma tabela se ela contiver colunas temporais antigas no formato pré-5.6.4 (`TIME`, `DATETIME` e `TIMESTAMP` colunas sem suporte para precisão de frações de segundo) e a variável de sistema `avoid_temporal_upgrade` estiver desabilitada. Se `avoid_temporal_upgrade` estiver habilitada, `REPAIR TABLE` ignora as colunas temporais antigas presentes na tabela e não as atualiza.

Para atualizar tabelas que contêm colunas temporais, desative `avoid_temporal_upgrade` antes de executar `REPAIR TABLE`.

Você pode aumentar o desempenho de `REPAIR TABLE` configurando certas variáveis do sistema. Veja Seção 8.6.3, “Otimizando instruções REPAIR TABLE”.
