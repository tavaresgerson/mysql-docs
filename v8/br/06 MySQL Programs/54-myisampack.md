### 6.6.6 `myisampack` — Gerar tabelas MyISAM compactadas e de leitura somente

O utilitário `myisampack` compacta tabelas `MyISAM`. `myisampack` funciona comprimindo cada coluna da tabela separadamente. Normalmente, `myisampack` compacta o arquivo de dados de 40% a 70%.

Quando a tabela é usada posteriormente, o servidor lê na memória as informações necessárias para descomprimir as colunas. Isso resulta em um desempenho muito melhor ao acessar linhas individuais, porque você só precisa descomprimir exatamente uma linha.

O MySQL usa `mmap()` quando possível para realizar mapeamento de memória em tabelas compactadas. Se `mmap()` não funcionar, o MySQL retorna para operações normais de leitura/escrita de arquivos.

Por favor, note o seguinte:

* Se o servidor `mysqld` foi invocado com o bloqueio externo desativado, não é uma boa ideia invocar `myisampack` se a tabela for atualizada pelo servidor durante o processo de compactação. É mais seguro comprimir tabelas com o servidor parado.
* Após compactar uma tabela, ela se torna de leitura somente. Isso é geralmente intencional (como ao acessar tabelas compactadas em um CD).
* `myisampack` não suporta tabelas particionadas.

Invoque `myisampack` da seguinte forma:

```
myisampack [options] file_name ...
```

Cada argumento de nome de arquivo deve ser o nome de um arquivo de índice (`.MYI`). Se você não estiver no diretório do banco de dados, você deve especificar o nome do caminho do arquivo. É permitido omitir a extensão `.MYI`.

Após compactar uma tabela com `myisampack`, use `myisamchk -rq` para reconstruir seus índices. Seção 6.6.4, “`myisamchk` — Ferramenta de manutenção de tabelas MyISAM”.

`myisampack` suporta as seguintes opções. Também lê arquivos de opções e suporta as opções para processá-las descritas na Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.

*  `--help`, `-?`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair.
*  `--backup`, `-b`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--backup</code></td> </tr></tbody></table>

Faça um backup do arquivo de dados de cada tabela usando o nome `tbl_name.OLD`.
* `--character-sets-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.
* `--debug[=debug_options]`, `-# [debug_options]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>d:t:o</code></td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica de `debug_options` é `d:t:o,file_name`. O valor padrão é `d:t:o`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
* `--force`, `-f`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--force</code></td> </tr></tbody></table>

  Crie uma tabela compactada mesmo que ela fique maior que a original ou se o arquivo intermediário de uma invocação anterior do `myisampack` existir. (`myisampack` cria um arquivo intermediário chamado `tbl_name.TMD` no diretório do banco de dados enquanto comprime a tabela. Se você interromper o `myisampack`, o arquivo `.TMD` pode não ser excluído.) Normalmente, o `myisampack` sai com um erro se encontrar que `tbl_name.TMD` existe. Com `--force`, o `myisampack` compacta a tabela de qualquer forma.
* `--join=big_tbl_name`, `-j big_tbl_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--join=big_tbl_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Junte todas as tabelas nomeadas na linha de comando em uma única tabela compactada *`big_tbl_name`*. Todas as tabelas que devem ser combinadas *devem* ter estrutura idêntica (mesmos nomes de colunas e tipos, mesmos índices, e assim por diante).

* `big_tbl_name` não pode existir antes da operação de junção. Todas as tabelas de origem nomeadas na linha de comando que serão unidas em `big_tbl_name` devem existir. As tabelas de origem são lidas para a operação de junção, mas não são modificadas.
* `--silent`, `-s`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--silent</code></td> </tr></tbody></table>

  Modo silencioso. Escreva a saída apenas quando ocorrerem erros.
* `--test`, `-t`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--test</code></td> </tr></tbody></table>

  Não embale a tabela de fato, apenas teste o embalo.
* `--tmpdir=dir_name`, `-T dir_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--tmpdir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Use o diretório nomeado como a localização onde o `myisampack` cria arquivos temporários.
* `--verbose`, `-v`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo verbose. Escreva informações sobre o progresso da operação de embalo e seu resultado.
* `--version`, `-V`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--version</code></td> </tr></tbody></table>

  Exibir informações de versão e sair.
* `--wait`, `-w`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--wait</code></td> </tr></tbody></table>

  Aguarde e tente novamente se a tabela estiver em uso. Se o servidor `mysqld` foi invocado com o bloqueio externo desativado, não é uma boa ideia invocar o `myisampack` se a tabela pode ser atualizada pelo servidor durante o processo de embalo.

A seguinte sequência de comandos ilustra uma sessão típica de compactação de tabela:

```
$> ls -l station.*
-rw-rw-r--   1 jones    my         994128 Apr 17 19:00 station.MYD
-rw-rw-r--   1 jones    my          53248 Apr 17 19:00 station.MYI

$> myisamchk -dvv station

MyISAM file:     station
Isam-version:  2
Creation time: 1996-03-13 10:08:58
Recover time:  1997-02-02  3:06:43
Data records:              1192  Deleted blocks:              0
Datafile parts:            1192  Deleted data:                0
Datafile pointer (bytes):     2  Keyfile pointer (bytes):     2
Max datafile length:   54657023  Max keyfile length:   33554431
Recordlength:               834
Record format: Fixed length

table description:
Key Start Len Index   Type                 Root  Blocksize    Rec/key
1   2     4   unique  unsigned long        1024       1024          1
2   32    30  multip. text                10240       1024          1

Field Start Length Type
1     1     1
2     2     4
3     6     4
4     10    1
5     11    20
6     31    1
7     32    30
8     62    35
9     97    35
10    132   35
11    167   4
12    171   16
13    187   35
14    222   4
15    226   16
16    242   20
17    262   20
18    282   20
19    302   30
20    332   4
21    336   4
22    340   1
23    341   8
24    349   8
25    357   8
26    365   2
27    367   2
28    369   4
29    373   4
30    377   1
31    378   2
32    380   8
33    388   4
34    392   4
35    396   4
36    400   4
37    404   1
38    405   4
39    409   4
40    413   4
41    417   4
42    421   4
43    425   4
44    429   20
45    449   30
46    479   1
47    480   1
48    481   79
49    560   79
50    639   79
51    718   79
52    797   8
53    805   1
54    806   1
55    807   20
56    827   4
57    831   4

$> myisampack station.MYI
Compressing station.MYI: (1192 records)
- Calculating statistics

normal:     20  empty-space:   16  empty-zero:     12  empty-fill:  11
pre-space:   0  end-space:     12  table-lookups:   5  zero:         7
Original trees:  57  After join: 17
- Compressing file
87.14%
Remember to run myisamchk -rq on compressed tables

$> myisamchk -rq station
- check record delete-chain
- recovering (with sort) MyISAM-table 'station'
Data records: 1192
- Fixing index 1
- Fixing index 2

$> mysqladmin -uroot flush-tables

$> ls -l station.*
-rw-rw-r--   1 jones    my         127874 Apr 17 19:00 station.MYD
-rw-rw-r--   1 jones    my          55296 Apr 17 19:04 station.MYI

$> myisamchk -dvv station

MyISAM file:     station
Isam-version:  2
Creation time: 1996-03-13 10:08:58
Recover time:  1997-04-17 19:04:26
Data records:               1192  Deleted blocks:              0
Datafile parts:             1192  Deleted data:                0
Datafile pointer (bytes):      3  Keyfile pointer (bytes):     1
Max datafile length:    16777215  Max keyfile length:     131071
Recordlength:                834
Record format: Compressed

table description:
Key Start Len Index   Type                 Root  Blocksize    Rec/key
1   2     4   unique  unsigned long       10240       1024          1
2   32    30  multip. text                54272       1024          1

Field Start Length Type                         Huff tree  Bits
1     1     1      constant                             1     0
2     2     4      zerofill(1)                          2     9
3     6     4      no zeros, zerofill(1)                2     9
4     10    1                                           3     9
5     11    20     table-lookup                         4     0
6     31    1                                           3     9
7     32    30     no endspace, not_always              5     9
8     62    35     no endspace, not_always, no empty    6     9
9     97    35     no empty                             7     9
10    132   35     no endspace, not_always, no empty    6     9
11    167   4      zerofill(1)                          2     9
12    171   16     no endspace, not_always, no empty    5     9
13    187   35     no endspace, not_always, no empty    6     9
14    222   4      zerofill(1)                          2     9
15    226   16     no endspace, not_always, no empty    5     9
16    242   20     no endspace, not_always              8     9
17    262   20     no endspace, no empty                8     9
18    282   20     no endspace, no empty                5     9
19    302   30     no endspace, no empty                6     9
20    332   4      always zero                          2     9
21    336   4      always zero                          2     9
22    340   1                                           3     9
23    341   8      table-lookup                         9     0
24    349   8      table-lookup                        10     0
25    357   8      always zero                          2     9
26    365   2                                           2     9
27    367   2      no zeros, zerofill(1)                2     9
28    369   4      no zeros, zerofill(1)                2     9
29    373   4      table-lookup                        11     0
30    377   1                                           3     9
31    378   2      no zeros, zerofill(1)                2     9
32    380   8      no zeros                             2     9
33    388   4      always zero                          2     9
34    392   4      table-lookup                        12     0
35    396   4      no zeros, zerofill(1)               13     9
36    400   4      no zeros, zerofill(1)                2     9
37    404   1                                           2     9
38    405   4      no zeros                             2     9
39    409   4      always zero                          2     9
40    413   4      no zeros                             2     9
41    417   4      always zero                          2     9
42    421   4      no zeros                             2     9
43    425   4      always zero                          2     9
44    429   20     no empty                             3     9
45    449   30     no empty                             3     9
46    479   1                                          14     4
47    480   1                                          14     4
48    481   79     no endspace, no empty               15     9
49    560   79     no empty                             2     9
50    639   79     no empty                             2     9
51    718   79     no endspace                         16     9
52    797   8      no empty                             2     9
53    805   1                                          17     1
54    806   1                                           3     9
55    807   20     no empty                             3     9
56    827   4      no zeros, zerofill(2)                2     9
57    831   4      no zeros, zerofill(1)                2     9
```

O `myisampack` exibe os seguintes tipos de informações:

* `normal`

  O número de colunas para as quais não é usado embalo extra.
* `empty-space`

  O número de colunas que contêm valores que são apenas espaços. Esses ocupam um bit.
* `empty-zero`

O número de colunas que contêm valores que são apenas zeros binários. Essas ocupam um bit.
* `empty-fill`

  O número de colunas inteiras que não ocupam a faixa completa de bytes do seu tipo. Essas são alteradas para um tipo menor. Por exemplo, uma coluna `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (oito bytes) pode ser armazenada como uma coluna `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (um byte) se todos os seus valores estiverem no intervalo de `-128` a `127`.
* `pre-space`

  O número de colunas decimais que são armazenadas com espaços iniciais. Neste caso, cada valor contém um contador para o número de espaços iniciais.
* `end-space`

  O número de colunas que têm muitos espaços finais. Neste caso, cada valor contém um contador para o número de espaços finais.
* `table-lookup`

  A coluna tinha apenas um pequeno número de valores diferentes, que foram convertidos para um `ENUM` antes da compressão de Huffman.
* `zero`

  O número de colunas para as quais todos os valores são zero.
* `Arvores originais`

  O número inicial de árvores de Huffman.
* `Após a união`

  O número de árvores de Huffman distintas que restam após a união de árvores para economizar um pouco de espaço no cabeçalho.

Após a compressão de uma tabela, as linhas `Field` exibidas por `myisamchk -dvv` incluem informações adicionais sobre cada coluna:

* `Type`

  O tipo de dados. O valor pode conter qualquer um dos seguintes descritores:

  + `constant`

    Todas as linhas têm o mesmo valor.
  + `no endspace`

    Não armazene espaços finais.
  + `no endspace, not_always`

    Não armazene espaços finais e não realize compressão de espaços finais para todos os valores.
  + `no endspace, no empty`

    Não armazene espaços finais. Não armazene valores vazios.
  + `table-lookup`

    A coluna foi convertida para um `ENUM`.
  + `zerofill(N)`

    Os *`N`* bytes mais significativos no valor são sempre 0 e não são armazenados.
  + `no zeros`

    Não armazene zeros.
  + `always zero`

    Valores zero são armazenados usando um bit.
* `Huff tree`

O número da árvore de Huffman associada à coluna.
* `Bits`

O número de bits usados na árvore de Huffman.

Depois de executar `myisampack`, use `myisamchk` para recrutar novamente os índices. Neste momento, você também pode ordenar os blocos de índice e criar estatísticas necessárias para que o otimizador do MySQL funcione de forma mais eficiente:

```
myisamchk -rq --sort-index --analyze tbl_name.MYI
```

Depois de instalar a tabela compactada no diretório do banco de dados MySQL, você deve executar `mysqladmin flush-tables` para forçar o `mysqld` a começar a usar a nova tabela.

Para descompactar uma tabela compactada, use a opção `--unpack` no `myisamchk`.