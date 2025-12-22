#### 6.6.4.3 Opções de reparação

`myisamchk` suporta as seguintes opções para operações de reparo de tabela (operações executadas quando uma opção como `--recover` ou `--safe-recover` é dada):

- `--backup`, `-B`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--backup</code>]]</td> </tr></tbody></table>

Fazer uma cópia de segurança do arquivo `.MYD` como `file_name-time.BAK`

- `--character-sets-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

O diretório onde estão instalados os conjuntos de caracteres.

- `--correct-checksum`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--correct-checksum</code>]]</td> </tr></tbody></table>

Corrigir as informações relativas à soma de verificação para a tabela.

- `--data-file-length=len`, `-D len`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--data-file-length=len</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

O comprimento máximo do ficheiro de dados (quando se recria o ficheiro de dados quando este é full).

- `--extend-check`, `-e`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--extend-check</code>]]</td> </tr></tbody></table>

Faça um reparo que tente recuperar todas as linhas possíveis do arquivo de dados. Normalmente, isso também encontra muitas linhas de lixo. Não use essa opção a menos que esteja desesperado.

Ver também a descrição desta opção em Opções de verificação de tabela.

Para uma descrição do formato de saída, ver secção 6.6.4.5, "Obtenção de informações de tabela com myisamchk".

- `--force`, `-f`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--force</code>]]</td> </tr></tbody></table>

Sobrescreva arquivos intermediários antigos (arquivos com nomes como `tbl_name.TMD`) em vez de abortar.

- `--keys-used=val`, `-k val`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--keys-used=val</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

Para `myisamchk`, o valor da opção é um valor de bit que indica quais índices devem ser atualizados. Cada bit binário do valor da opção corresponde a um índice de tabela, onde o primeiro índice é o bit 0. Um valor de opção de 0 desativa atualizações para todos os índices, que podem ser usados para obter inserções mais rápidas. Índices desativados podem ser reativados usando **isammychk -r**.

- `--max-record-length=len`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-record-length=len</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr></tbody></table>

Salte linhas maiores do que o comprimento dado se `myisamchk` não puder alocar memória para mantê-las.

- `--quick`, `-q`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--quick</code>]]</td> </tr></tbody></table>

Conseguir uma reparação mais rápida modificando apenas o arquivo de índice, não o arquivo de dados. Pode especificar esta opção duas vezes para forçar `myisamchk` a modificar o arquivo de dados original em caso de chaves duplicadas.

- `--recover`, `-r`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--recover</code>]]</td> </tr></tbody></table>

Faça um reparo que pode corrigir quase qualquer problema, exceto chaves únicas que não são únicas (o que é um erro extremamente improvável com tabelas `MyISAM`). Se você quiser recuperar uma tabela, esta é a opção para tentar primeiro. Você deve tentar `--safe-recover` apenas se `myisamchk` informar que a tabela não pode ser recuperada usando `--recover`. (No caso improvável de `--recover` falhar, o arquivo de dados permanece intacto.)

Se você tem muita memória, você deve aumentar o valor de `myisam_sort_buffer_size`.

- `--safe-recover`, `-o`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--safe-recover</code>]]</td> </tr></tbody></table>

Faça um reparo usando um método de recuperação antigo que lê todas as linhas em ordem e atualiza todas as árvores de índice com base nas linhas encontradas. Este é uma ordem de magnitude mais lenta do que o `--recover`, mas pode lidar com um par de casos muito improváveis que o `--recover` não pode. Este método de recuperação também usa muito menos espaço em disco do que o `--recover`.

Se você tem muita memória, você deve aumentar o valor de `key_buffer_size`.

- `--set-collation=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--set-collation=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Especifique a coleta a utilizar para classificar os índices das tabelas. O nome do conjunto de caracteres é implícito na primeira parte do nome da coleta.

- `--sort-recover`, `-n`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--sort-recover</code>]]</td> </tr></tbody></table>

Forçar `myisamchk` a usar a classificação para resolver as chaves mesmo que os arquivos temporários sejam muito grandes.

- `--tmpdir=dir_name`, `-t dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tmpdir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O caminho do diretório a ser usado para armazenar arquivos temporários. Se isso não for definido, `myisamchk` usa o valor da variável de ambiente `TMPDIR` . `--tmpdir` pode ser definido para uma lista de caminhos de diretório que são usados sucessivamente em modo round-robin para criar arquivos temporários. O caractere de separador entre nomes de diretório é o ponto e vírgula (`:`) no Unix e o ponto e vírgula (`;`) no Windows.

- `--unpack`, `-u`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--unpack</code>]]</td> </tr></tbody></table>

Desempacotar uma mesa que estava cheia de **myisampack**.
