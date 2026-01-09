#### 6.6.4.3 Opções de reparo do myisamchk

O **myisamchk** suporta as seguintes opções para operações de reparo de tabelas (operações realizadas quando uma opção como `--recover` ou `--safe-recover` é fornecida):

* `--backup`, `-B`

  <table frame="box" rules="all" summary="Propriedades para backup"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--backup</code></td> </tr></tbody></table>

  Faça um backup do arquivo `.MYD` como `nome_do_arquivo-hora.BAK`

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--correct-checksum`

  <table frame="box" rules="all" summary="Propriedades para correct-checksum"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--correct-checksum</code></td> </tr></tbody></table>

  Corrija as informações de verificação de checksum da tabela.

* `--data-file-length=len`, `-D len`

  <table frame="box" rules="all" summary="Propriedades para data-file-length"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--data-file-length=len</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr></tbody></table>

  O comprimento máximo do arquivo de dados (ao recriar o arquivo de dados quando ele estiver "cheio").

* `--extend-check`, `-e`

<table frame="box" rules="all" summary="Propriedades para extend-check">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--extend-check</code></td> </tr>
</table>

  Faça uma reparação que tenta recuperar todas as linhas possíveis do arquivo de dados. Normalmente, isso também encontra muitas linhas de lixo. Não use essa opção a menos que esteja desesperado.

  Veja também a descrição dessa opção nas opções de verificação de tabela.

  Para uma descrição do formato de saída, consulte a Seção 6.6.4.5, “Obter informações da tabela com myisamchk”.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Propriedades para force">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--force</code></td> </tr>
    <tr><th>Tipo</th> <td>Numérico</td> </tr>
  </table>

  Substitua os arquivos intermediários antigos (arquivos com nomes como `tbl_name.TMD`) em vez de abortar.

* `--keys-used=val`, `-k val`

  <table frame="box" rules="all" summary="Propriedades para keys-used">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--keys-used=val</code></td> </tr>
    <tr><th>Tipo</th> <td>Numérico</td> </tr>
  </table>

  Para **myisamchk**, o valor da opção é um bit que indica quais índices atualizar. Cada bit binário do valor da opção corresponde a um índice de tabela, onde o primeiro índice é o bit 0. Um valor de opção de 0 desativa as atualizações para todos os índices, o que pode ser usado para obter inserções mais rápidas. Os índices desativados podem ser reativados usando **myisamchk -r**.

* `--max-record-length=len`

<table frame="box" rules="all" summary="Propriedades para o formato de linha de comando">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--max-record-length=len</code></td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
</table>

  Ignorar linhas maiores que o comprimento especificado se o **myisamchk** não conseguir alocar memória para armazená-las.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Propriedades para quick">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--quick</code></td> </tr>
  </table>

  Realize uma reparação mais rápida modificando apenas o arquivo de índice, e não o arquivo de dados. Você pode especificar essa opção duas vezes para forçar o **myisamchk** a modificar o arquivo de dados original, caso haja chaves duplicadas.

* `--recover`, `-r`

  <table frame="box" rules="all" summary="Propriedades para recover">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--recover</code></td> </tr>
  </table>

  Realize uma reparação que pode corrigir quase qualquer problema, exceto chaves únicas que não são únicas (o que é um erro extremamente improvável com tabelas `MyISAM`). Se você deseja recuperar uma tabela, essa é a opção a tentar primeiro. Você deve tentar `--safe-recover` apenas se o **myisamchk** relatar que a tabela não pode ser recuperada usando `--recover`. (No improvável caso em que `--recover` falhe, o arquivo de dados permanece intacto.)

  Se você tiver muita memória, você deve aumentar o valor de `myisam_sort_buffer_size`.

* `--safe-recover`, `-o`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>0

  Faça uma reparação usando um método de recuperação antigo que lê todas as linhas em ordem e atualiza todas as árvores de índice com base nas linhas encontradas. Esse método de recuperação é uma ordem de magnitude mais lento que `--recover`, mas pode lidar com alguns casos muito improváveis que `--recover` não pode. Esse método de recuperação também usa muito menos espaço em disco que `--recover`. Normalmente, você deve reparar primeiro usando `--recover`, e depois com `--safe-recover` apenas se `--recover` falhar.

  Se você tiver muita memória, você deve aumentar o valor de `key_buffer_size`.

* `--set-collation=nome`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>1

  Especifique a collation a ser usada para ordenar índices de tabelas. O nome do conjunto de caracteres é implícito pela primeira parte do nome da collation.

* `--sort-recover`, `-n`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--character-sets-dir=caminho</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">[nenhum]</code></td>
  </tr>
  </tbody>
</table>2

  Forçar o **myisamchk** a usar o recurso de classificação para resolver as chaves, mesmo que os arquivos temporários sejam muito grandes.

* `--tmpdir=caminho_dir`, `-t caminho_dir`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--character-sets-dir=caminho</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">[nenhum]</code></td>
    </tr>
  </tbody>
</table>3

  O caminho do diretório a ser usado para armazenar arquivos temporários. Se não for definido, o **myisamchk** usa o valor da variável de ambiente `TMPDIR`. O `--tmpdir` pode ser definido como uma lista de caminhos de diretórios que são usados sucessivamente de forma round-robin para criar arquivos temporários. O caractere de separador entre os nomes de diretórios é a vírgula (`,`) no Unix e o ponto e vírgula (`;`) no Windows.

* `--unpack`, `-u`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--character-sets-dir=caminho</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">[nenhum]</code></td>
    </tr>
  </tbody>
</table>4

  Descompactar uma tabela que foi compactada com **myisampack**.