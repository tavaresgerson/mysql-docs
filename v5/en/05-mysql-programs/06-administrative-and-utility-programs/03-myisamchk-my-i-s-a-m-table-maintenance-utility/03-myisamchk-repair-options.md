#### 4.6.3.3 Opções de Reparo do myisamchk

O **myisamchk** suporta as seguintes opções para operações de reparo de tabela (operações executadas quando uma opção como `--recover` ou `--safe-recover` é fornecida):

* `--backup`, `-B`

  <table frame="box" rules="all" summary="Propriedades para backup"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--backup</code></td> </tr></tbody></table>

  Cria um backup do arquivo `.MYD` como `nome_do_arquivo-tempo.BAK`.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O diretório onde os *character sets* estão instalados. Consulte a Seção 10.15, “Configuração de Character Set”.

* `--correct-checksum`

  <table frame="box" rules="all" summary="Propriedades para correct-checksum"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--correct-checksum</code></td> </tr></tbody></table>

  Corrige a informação de checksum para a tabela.

* `--data-file-length=len`, `-D len`

  <table frame="box" rules="all" summary="Propriedades para data-file-length"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--data-file-length=len</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  O comprimento máximo do *data file* (ao recriar o arquivo de dados quando ele está "cheio").

* `--extend-check`, `-e`

  <table frame="box" rules="all" summary="Propriedades para extend-check"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--extend-check</code></td> </tr></tbody></table>

  Realiza um reparo que tenta recuperar todas as linhas possíveis do *data file*. Normalmente, isso também encontra muitas linhas lixo (*garbage rows*). Não use esta opção a menos que você esteja desesperado.

  Veja também a descrição desta opção em opções de verificação de tabela.

  Para uma descrição do formato de saída, consulte a Seção 4.6.3.5, “Obtendo Informações de Tabela com myisamchk”.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Propriedades para force"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--force</code></td> </tr></tbody></table>

  Sobrescreve arquivos intermediários antigos (arquivos com nomes como `nome_tbl.TMD`) em vez de abortar.

* `--keys-used=val`, `-k val`

  <table frame="box" rules="all" summary="Propriedades para keys-used"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--keys-used=val</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Para o **myisamchk**, o valor da opção é um valor de *bit* que indica quais Indexes atualizar. Cada *bit* binário do valor da opção corresponde a um Index da tabela, onde o primeiro Index é o bit 0. Um valor de opção 0 desabilita as atualizações para todos os Indexes, o que pode ser usado para obter Inserts mais rápidos. Indexes desativados podem ser reativados usando **myisamchk -r**.

* `--max-record-length=len`

  <table frame="box" rules="all" summary="Propriedades para max-record-length"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--max-record-length=len</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Pula linhas maiores que o comprimento fornecido se o **myisamchk** não puder alocar memória para contê-las.

* `--parallel-recover`, `-p`

  <table frame="box" rules="all" summary="Propriedades para parallel-recover"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--parallel-recover</code></td> </tr></tbody></table>

  Nota

  Esta opção está obsoleta no MySQL 5.7.38 e foi removida no MySQL 5.7.39.

  Usa a mesma técnica que `-r` e `-n`, mas cria todas as *keys* em paralelo, usando diferentes Threads. *Este é um código com qualidade beta. Use por sua conta e risco!*

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Propriedades para quick"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--quick</code></td> </tr></tbody></table>

  Alcança um reparo mais rápido modificando apenas o arquivo de Index, e não o *data file*. Você pode especificar esta opção duas vezes para forçar o **myisamchk** a modificar o *data file* original em caso de *duplicate keys*.

* `--recover`, `-r`

  <table frame="box" rules="all" summary="Propriedades para recover"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--recover</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Realiza um reparo que pode corrigir quase todos os problemas, exceto *unique keys* que não são únicas (o que é um erro extremamente improvável com tabelas `MyISAM`). Se você deseja recuperar uma tabela, esta é a opção a ser tentada primeiro. Você só deve tentar `--safe-recover` se o **myisamchk** relatar que a tabela não pode ser recuperada usando `--recover`. (No caso improvável de `--recover` falhar, o *data file* permanece intacto.)

  Se você tiver muita memória, você deve aumentar o valor de `myisam_sort_buffer_size`.

* `--safe-recover`, `-o`

  <table frame="box" rules="all" summary="Propriedades para safe-recover"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--safe-recover</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Realiza um reparo usando um método de recuperação antigo que lê todas as linhas em ordem e atualiza todas as árvores de Index baseadas nas linhas encontradas. Isso é uma ordem de magnitude mais lento do que `--recover`, mas pode lidar com alguns casos muito improváveis que o `--recover` não consegue. Este método de recuperação também usa muito menos espaço em disco do que `--recover`. Normalmente, você deve reparar primeiro usando `--recover`, e depois com `--safe-recover` apenas se o `--recover` falhar.

  Se você tiver muita memória, você deve aumentar o valor de `key_buffer_size`.

* `--set-collation=name`

  <table frame="box" rules="all" summary="Propriedades para set-collation"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--set-collation=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Especifica a *collation* a ser usada para ordenar os Indexes da tabela. O nome do *character set* é implícito pela primeira parte do nome da *collation*.

* `--sort-recover`, `-n`

  <table frame="box" rules="all" summary="Propriedades para sort-recover"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--sort-recover</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Força o **myisamchk** a usar ordenação (*sorting*) para resolver as *keys*, mesmo que os arquivos temporários sejam muito grandes.

* `--tmpdir=dir_name`, `-t dir_name`

  <table frame="box" rules="all" summary="Propriedades para tmpdir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--tmpdir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O caminho do diretório a ser usado para armazenar arquivos temporários. Se não for definido, o **myisamchk** usa o valor da variável de ambiente `TMPDIR`. `--tmpdir` pode ser definido como uma lista de caminhos de diretórios que são usados sucessivamente, em modo *round-robin*, para a criação de arquivos temporários. O caractere separador entre os nomes dos diretórios é o ponto e vírgula (`:`) no Unix e o ponto e vírgula (`;`) no Windows.

* `--unpack`, `-u`

  <table frame="box" rules="all" summary="Propriedades para unpack"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--unpack</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Desempacota (*Unpack*) uma tabela que foi empacotada com **myisampack**.