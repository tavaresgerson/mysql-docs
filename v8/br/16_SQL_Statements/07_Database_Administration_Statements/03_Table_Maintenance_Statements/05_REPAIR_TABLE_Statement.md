#### 15.7.3.5. Declaração de REPARO DE TÁBUA

```
REPAIR [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
    [QUICK] [EXTENDED] [USE_FRM]
```

`REPAIR TABLE` repara uma tabela possivelmente corrompida, apenas para determinados motores de armazenamento.

Esta declaração requer privilégios `SELECT` e `INSERT` para a tabela.

Embora normalmente você nunca deva precisar executar `REPAIR TABLE`, se um desastre ocorrer, essa declaração provavelmente recuperará todos os seus dados de uma tabela `MyISAM`. Se suas tabelas forem corrompidas com frequência, tente encontrar a razão para isso, para eliminar a necessidade de usar `REPAIR TABLE`. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”, e a Seção 18.2.4, “Problemas com tabelas MyISAM”.

`REPAIR TABLE` verifica a tabela para determinar se é necessário um upgrade. Se for o caso, ele executa o upgrade, seguindo as mesmas regras que `CHECK TABLE ... FOR UPGRADE`. Consulte a Seção 15.7.3.2, “Instrução CHECK TABLE”, para obter mais informações.

Importante

- Faça um backup de uma tabela antes de realizar uma operação de reparo de tabela; em algumas circunstâncias, a operação pode causar perda de dados. As possíveis causas incluem, mas não estão limitadas a, erros no sistema de arquivos. Consulte o Capítulo 9, *Backup e Recuperação*.

- Se o servidor sair durante uma operação `REPAIR TABLE`, é essencial, após o reinício, que você execute imediatamente outra instrução `REPAIR TABLE` para a tabela antes de realizar qualquer outra operação nela. No pior dos casos, você pode ter um novo arquivo de índice limpo sem informações sobre o arquivo de dados, e então a próxima operação que você realizar pode sobrescrever o arquivo de dados. Esse é um cenário improvável, mas possível, que destaca o valor de fazer um backup primeiro.

- Caso uma tabela na fonte seja corrompida e você execute `REPAIR TABLE` nela, quaisquer alterações resultantes na tabela original não serão propagadas às réplicas.

- Suporte ao motor de armazenamento e particionamento da tabela de reparo

- Opções de REPARAR TÁBUA

- REPARAR TÁBLIA Saída

- Considerações sobre a reparação de mesas

##### Suporte ao motor de armazenamento e particionamento da tabela de reparo

O comando `REPAIR TABLE` funciona para as tabelas `MyISAM`, `ARCHIVE` e `CSV`. Para as tabelas `MyISAM`, ele tem o mesmo efeito que **myisamchk --recover `tbl_name`** por padrão. Esta declaração não funciona com vistas.

O `REPAIR TABLE` é suportado para tabelas particionadas. No entanto, a opção `USE_FRM` não pode ser usada com essa declaração em uma tabela particionada.

Você pode usar `ALTER TABLE ... REPAIR PARTITION` para reparar uma ou mais partições; para mais informações, consulte a Seção 15.1.9, “Instrução ALTER TABLE”, e a Seção 26.3.4, “Manutenção de Partições”.

##### Opções de REPARAR TÁBUA

- `NO_WRITE_TO_BINLOG` ou `LOCAL`

  Por padrão, o servidor escreve as instruções `REPAIR TABLE` no log binário para que elas sejam replicadas para as réplicas. Para suprimir o registro, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

- `QUICK`

  Se você usar a opção `QUICK`, o `REPAIR TABLE` tenta reparar apenas o arquivo de índice e não o arquivo de dados. Esse tipo de reparo é semelhante ao realizado pelo **myisamchk --recover --quick**.

- `EXTENDED`

  Se você usar a opção `EXTENDED`, o MySQL cria a linha do índice linha por linha, em vez de criar um índice de cada vez com classificação. Esse tipo de reparo é semelhante ao realizado pelo **myisamchk --safe-recover**.

- `USE_FRM`

  A opção `USE_FRM` está disponível para uso se o arquivo de índice `.MYI` estiver ausente ou se seu cabeçalho estiver corrompido. Esta opção informa ao MySQL que não deve confiar nas informações no cabeçalho do arquivo `.MYI` e que deve recriá-lo usando informações do dicionário de dados. Esse tipo de reparo não pode ser feito com **myisamchk**.

  Cuidado

  Use a opção `USE_FRM` *apenas* se você não puder usar os modos regulares `REPAIR`. Informar ao servidor para ignorar o arquivo `.MYI` torna os metadados importantes da tabela armazenados no `.MYI` indisponíveis para o processo de reparo, o que pode ter consequências prejudiciais:

  - O valor atual do `AUTO_INCREMENT` foi perdido.

  - O link para os registros excluídos na tabela é perdido, o que significa que o espaço livre para os registros excluídos permanece desocupado a partir daí.

  - O cabeçalho `.MYI` indica se a tabela está comprimida. Se o servidor ignorar essa informação, ele não poderá determinar se uma tabela está comprimida e a reparação pode causar alterações ou perda do conteúdo da tabela. Isso significa que `USE_FRM` não deve ser usado com tabelas comprimidas. Isso não deveria ser necessário, de qualquer forma: as tabelas comprimidas são apenas de leitura, então elas não deveriam ficar corrompidas.

  Se você usar `USE_FRM` para uma tabela criada por uma versão diferente do servidor MySQL daquela que você está executando atualmente, `REPAIR TABLE` não tentará reparar a tabela. Nesse caso, o conjunto de resultados retornado por `REPAIR TABLE` contém uma linha com um valor `Msg_type` de `error` e um valor `Msg_text` de `Failed repairing incompatible .FRM file`.

  Se `USE_FRM` for usado, `REPAIR TABLE` não verifica a tabela para ver se é necessário um upgrade.

##### REPARAR TÁBLIA Saída

`REPAIR TABLE` retorna um conjunto de resultados com as colunas mostradas na tabela a seguir.

<table summary="Colunas do conjunto de resultados da tabela REPAIR."><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td>[[<code>Table</code>]]</td> <td>O nome da tabela</td> </tr><tr> <td>[[<code>Op</code>]]</td> <td>Sempre [[<code>repair</code>]]</td> </tr><tr> <td>[[<code>Msg_type</code>]]</td> <td>[[<code>status</code>]], [[<code>error</code>]], [[<code>info</code>]], [[<code>note</code>]] ou [[<code>warning</code>]]</td> </tr><tr> <td>[[<code>Msg_text</code>]]</td> <td>Uma mensagem informativa</td> </tr></tbody></table>

A declaração `REPAIR TABLE` pode gerar muitas linhas de informações para cada tabela reparada. A última linha tem um valor `Msg_type` de `status` e `Msg_test` normalmente deve ser `OK`. Para uma tabela `MyISAM`, se você não conseguir `OK`, deve tentar repará-la com **myisamchk --safe-recover**. (`REPAIR TABLE` não implementa todas as opções do **myisamchk**. Com **myisamchk --safe-recover**, você também pode usar opções que o **myisamchk** não suporta, como `REPAIR TABLE`.)

A tabela `REPAIR TABLE` captura e lança quaisquer erros que ocorram durante a cópia das estatísticas da tabela do arquivo antigo corrompido para o arquivo recém-criado. Por exemplo, se o ID do usuário do proprietário do arquivo `.MYD` ou `.MYI` for diferente do ID do usuário do processo **mysqld**, o `REPAIR TABLE` gera um erro de "não é possível alterar a propriedade do arquivo" a menos que **mysqld** seja iniciado pelo usuário `root`.

##### Considerações sobre a reparação de mesas

`REPAIR TABLE` atualiza uma tabela se ela contiver colunas temporais antigas no formato pré-5.6.4 (colunas `TIME`, `DATETIME` e `TIMESTAMP` sem suporte para precisão de frações de segundo) e a variável de sistema `avoid_temporal_upgrade` estiver desativada. Se `avoid_temporal_upgrade` estiver ativada, `REPAIR TABLE` ignora as colunas temporais antigas presentes na tabela e não as atualiza.

Para atualizar tabelas que contêm colunas temporais, desative `avoid_temporal_upgrade` antes de executar `REPAIR TABLE`.

Você pode aumentar o desempenho do `REPAIR TABLE` configurando certas variáveis do sistema. Veja a Seção 10.6.3, “Otimizando instruções REPAIR TABLE”.
