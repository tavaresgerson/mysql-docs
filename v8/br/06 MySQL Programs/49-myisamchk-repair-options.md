#### 6.6.4.3 Opções de reparo do `myisamchk`

O `myisamchk` suporta as seguintes opções para operações de reparo de tabelas (operações realizadas quando uma opção como `--recover` ou `--safe-recover` é fornecida):

*  `--backup`, `-B`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--backup</code></td> </tr></tbody></table>

  Faça um backup do arquivo `.MYD` como `file_name-time.BAK`
*  `--character-sets-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres estão instalados. Veja a Seção 12.15, “Configuração de conjuntos de caracteres”.
*  `--correct-checksum`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--correct-checksum</code></td> </tr></tbody></table>

  Corrija as informações de verificação de checksum da tabela.
*  `--data-file-length=len`, `-D len`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--data-file-length=len</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  O comprimento máximo do arquivo de dados (ao recriar o arquivo de dados quando ele estiver "cheio").
*  `--extend-check`, `-e`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--extend-check</code></td> </tr></tbody></table>

  Realize uma reparação que tenta recuperar todas as linhas possíveis do arquivo de dados. Normalmente, isso também encontra muitas linhas de lixo. Não use esta opção a menos que esteja desesperado.

  Veja também a descrição desta opção nas opções de verificação de tabela.

  Para uma descrição do formato de saída, veja a Seção 6.6.4.5, “Obter informações da tabela com o myisamchk”.
*  `--force`, `-f`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--force</code></td> </tr></tbody></table>

  Substitua arquivos intermediários antigos (arquivos com nomes como `tbl_name.TMD`) em vez de abortar.
*  `--keys-used=val`, `-k val`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--keys-used=val</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Para `myisamchk`, o valor da opção é um valor numérico que indica quais índices devem ser atualizados. Cada bit binário do valor da opção corresponde a um índice de tabela, onde o primeiro índice é o bit 0. Um valor de opção de 0 desativa as atualizações para todos os índices, o que pode ser usado para obter inserções mais rápidas. Os índices desativados podem ser reativados usando `myisamchk -r`.
*  `--max-record-length=len`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--max-record-length=len</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  Ignorar linhas maiores que o comprimento dado se o `myisamchk` não puder alocar memória para mantê-las.
*  `--quick`, `-q`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--quick</code></td> </tr></tbody></table>

  Altere a reparação mais rapidamente, modificando apenas o arquivo de índice, e não o arquivo de dados. Você pode especificar esta opção duas vezes para forçar o `myisamchk` a modificar o arquivo de dados original, caso haja chaves duplicadas.
*  `--recover`, `-r`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--recover</code></td> </tr></tbody></table>

  Realize uma reparação que pode corrigir quase qualquer problema, exceto chaves únicas que não são únicas (o que é um erro extremamente improvável com tabelas `MyISAM`). Se você deseja recuperar uma tabela, esta é a opção a tentar primeiro. Você deve tentar `--safe-recover` apenas se o `myisamchk` relatar que a tabela não pode ser recuperada usando `--recover`. (No caso improvável de `--recover` falhar, o arquivo de dados permanece intacto.)

  Se você tiver muita memória, deve aumentar o valor de `myisam_sort_buffer_size`.
*  `--safe-recover`, `-o`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--safe-recover</code></td> </tr></tbody></table>

Faça uma reparação usando um método de recuperação antigo que lê todas as linhas em ordem e atualiza todas as árvores de índice com base nas linhas encontradas. Isso é uma ordem de magnitude mais lento que `--recover`, mas pode lidar com alguns casos muito improváveis que `--recover` não pode. Esse método de recuperação também usa muito menos espaço em disco que `--recover`. Normalmente, você deve reparar primeiro usando `--recover` e, em seguida, com `--safe-recover` apenas se `--recover` falhar.

Se você tiver muita memória, deve aumentar o valor de `key_buffer_size`.
*  `--set-collation=name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--set-collation=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Especifique a collation a ser usada para ordenar índices de tabelas. O nome do conjunto de caracteres é implícito pela primeira parte do nome da collation.
*  `--sort-recover`, `-n`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--sort-recover</code></td> </tr></tbody></table>

  Força o `myisamchk` a usar a ordenação para resolver as chaves, mesmo que os arquivos temporários sejam muito grandes.
*  `--tmpdir=dir_name`, `-t dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tmpdir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O caminho do diretório a ser usado para armazenar arquivos temporários. Se isso não for definido, `myisamchk` usa o valor da variável de ambiente `TMPDIR`. `--tmpdir` pode ser definido como uma lista de caminhos de diretórios que são usados sucessivamente de forma round-robin para criar arquivos temporários. O caractere de separador entre os nomes de diretórios é a vírgula (`,`) no Unix e o ponto e vírgula (`;`) no Windows.
*  `--unpack`, `-u`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--unpack</code></td> </tr></tbody></table>

  Despakete uma tabela que foi compactada com `myisampack`.