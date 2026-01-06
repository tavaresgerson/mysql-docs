#### 4.6.3.3 Opções de reparo do myisamchk

O **myisamchk** suporta as seguintes opções para operações de reparo de tabelas (operações realizadas quando uma opção como `--recover` ou `--safe-recover` é fornecida):

- `--backup`, `-B`

  <table frame="box" rules="all" summary="Propriedades para backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backup</code>]]</td> </tr></tbody></table>

  Faça um backup do arquivo `.MYD` como `nome_do_arquivo-hora.BAK`

- `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 10.15, “Configuração de Conjunto de Caracteres”.

- `--correct-checksum`

  <table frame="box" rules="all" summary="Propriedades para verificação de checksum correta"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--correct-checksum</code>]]</td> </tr></tbody></table>

  Corrija as informações do checksum da tabela.

- `--data-file-length=len`, `-D len`

  <table frame="box" rules="all" summary="Propriedades para comprimento do arquivo de dados"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--data-file-length=len</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  O comprimento máximo do arquivo de dados (quando o arquivo de dados é recriado quando está "cheio").

- `--extend-check`, `-e`

  <table frame="box" rules="all" summary="Propriedades para extend-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--extend-check</code>]]</td> </tr></tbody></table>

  Faça uma reparação que tenta recuperar todas as linhas possíveis do arquivo de dados. Normalmente, isso também encontra muitas linhas de lixo. Não use essa opção a menos que esteja desesperado.

  Veja também a descrição desta opção na tabela de opções de verificação.

  Para uma descrição do formato de saída, consulte a Seção 4.6.3.5, “Obtendo informações da tabela com myisamchk”.

- `--force`, `-f`

  <table frame="box" rules="all" summary="Propriedades para força"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--force</code>]]</td> </tr></tbody></table>

  Sobrepor arquivos intermediários antigos (arquivos com nomes como `tbl_name.TMD`) em vez de abortar.

- `--keys-used=val`, `-k val`

  <table frame="box" rules="all" summary="Propriedades para chaves usadas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--keys-used=val</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Para o **myisamchk**, o valor da opção é um valor binário que indica quais índices devem ser atualizados. Cada bit binário do valor da opção corresponde a um índice de tabela, onde o primeiro índice é o bit 0. Um valor de opção de 0 desativa as atualizações para todos os índices, o que pode ser usado para obter inserções mais rápidas. Os índices desativados podem ser reativados usando **myisamchk -r**.

- `--max-record-length=len`

  <table frame="box" rules="all" summary="Propriedades para max-record-length"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--max-record-length=len</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Pule linhas maiores que o comprimento especificado se o **myisamchk** não puder alocar memória para armazená-las.

- `--parallel-recover`, `-p`

  <table frame="box" rules="all" summary="Propriedades para recuperação paralela"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--parallel-recover</code>]]</td> </tr></tbody></table>

  Nota

  Esta opção foi descontinuada no MySQL 5.7.38 e removida no MySQL 5.7.39.

  Use a mesma técnica que `-r` e `-n`, mas crie todas as chaves em paralelo, usando diferentes threads. *Este é um código de qualidade beta. Use por sua conta e risco!*

- `--quick`, `-q`

  <table frame="box" rules="all" summary="Propriedades para rápido"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--quick</code>]]</td> </tr></tbody></table>

  Obtenha uma reparação mais rápida modificando apenas o arquivo de índice, e não o arquivo de dados. Você pode especificar essa opção duas vezes para forçar o **myisamchk** a modificar o arquivo de dados original, caso haja chaves duplicadas.

- `--recover`, `-r`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>0

  Faça uma reparação que possa corrigir quase qualquer problema, exceto chaves únicas que não são únicas (o que é um erro extremamente improvável com tabelas `MyISAM`). Se você quiser recuperar uma tabela, essa é a opção a ser testada primeiro. Você deve tentar `--safe-recover` apenas se o `myisamchk` relatar que a tabela não pode ser recuperada usando `--recover`. (No caso improvável de o `--recover` falhar, o arquivo de dados permanece intacto.)

  Se você tiver muita memória, deve aumentar o valor de `myisam_sort_buffer_size`.

- `--safe-recover`, `-o`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>1

  Faça uma reparação usando um método de recuperação antigo que lê todas as linhas em ordem e atualiza todas as árvores de índice com base nas linhas encontradas. Isso é uma ordem de magnitude mais lento que `--recover`, mas pode lidar com alguns casos muito improváveis que `--recover` não pode. Esse método de recuperação também usa muito menos espaço em disco que `--recover`. Normalmente, você deve reparar primeiro usando `--recover`, e depois com `--safe-recover` apenas se `--recover` falhar.

  Se você tiver muita memória, deve aumentar o valor de `key_buffer_size`.

- `--set-collation=nome`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>2

  Especifique a correspondência a ser usada para ordenar índices de tabela. O nome do conjunto de caracteres é implícito pela primeira parte do nome da correspondência.

- `--sort-recover`, `-n`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>3

  Forçar o **myisamchk** a usar a classificação para resolver as chaves, mesmo que os arquivos temporários sejam muito grandes.

- `--tmpdir=dir_name`, `-t dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>4

  O caminho do diretório a ser usado para armazenar arquivos temporários. Se este não for definido, o **myisamchk** usa o valor da variável de ambiente `TMPDIR`. O argumento `--tmpdir` pode ser definido como uma lista de caminhos de diretórios que são usados sucessivamente de forma round-robin para criar arquivos temporários. O caractere de separação entre os nomes dos diretórios é o colon (`:`) no Unix e o ponto e vírgula (`;`) no Windows.

- `--unpack`, `-u`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>5

  Descompactar uma tabela que foi compactada com **myisampack**.
