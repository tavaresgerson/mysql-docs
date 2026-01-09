### 6.4.1 comp_err — Arquivo de Mensagem de Erro do MySQL

O **comp_err** cria o arquivo `errmsg.sys` que é usado pelo **mysqld** para determinar as mensagens de erro a serem exibidas para diferentes códigos de erro. O **comp_err** normalmente é executado automaticamente quando o MySQL é compilado. Ele compila o arquivo `errmsg.sys` a partir das informações de erro no formato de texto nas distribuições de código-fonte do MySQL:

As informações de erro vêm dos arquivos `messages_to_error_log.txt` e `messages_to_clients.txt` no diretório `share`.

Para mais informações sobre a definição de mensagens de erro, consulte os comentários dentro desses arquivos, juntamente com o arquivo `errmsg_readme.txt`.

O **comp_err** também gera os arquivos de cabeçalho `mysqld_error.h`, `mysqld_ername.h` e `mysqld_errmsg.h`.

Inicie o **comp_err** da seguinte forma:

```
comp_err [options]
```

O **comp_err** suporta as seguintes opções.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair.

* `--charset=dir_name`, `-C dir_name`

  <table frame="box" rules="all" summary="Propriedades para charset"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--charset</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>../share/charsets</code></td> </tr></tbody></table>

  O diretório do conjunto de caracteres. O padrão é `../sql/share/charsets`.

* `--debug=debug_options`, `-# debug_options`

<table frame="box" rules="all" summary="Propriedades para depuração">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--debug=opções</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>d:t:O,/tmp/comp_err.trace</code></td>
  </tr>
</table>

  <table frame="box" rules="all" summary="Propriedades para debug-info">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--debug-info</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Booleano</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>false</code></td>
    </tr>
  </table>

  Imprima algumas informações de depuração quando o programa sair.

* `--errmsg-file=file_name`, `-H file_name`

  <table frame="box" rules="all" summary="Propriedades para errmsg-file">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--errmsg-file=nome</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Nome do arquivo de mensagens de erro</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>mysqld_errmsg.h</code></td>
    </tr>
  </table>

  O nome do arquivo de mensagens de erro. O padrão é `mysqld_errmsg.h`.

* `--header-file=file_name`, `-H file_name`

<table frame="box" rules="all" summary="Propriedades para o arquivo de cabeçalho">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--header-file=nome</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo de cabeçalho de erro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>mysqld_error.h</code></td>
  </tr>
</table>

  O nome do arquivo de cabeçalho de erro. O padrão é `mysqld_error.h`.

* `--in-file-errlog=nome_do_arquivo`, `-e nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para in-file-errlog">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--in-file-errlog</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Nome do arquivo</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>../share/messages_to_error_log.txt</code></td>
    </tr>
  </table>

  O nome do arquivo de entrada que define os erros destinados a serem escritos no log de erros. O padrão é `../share/messages_to_error_log.txt`.

* `--in-file-toclient=nome_do_arquivo`, `-c nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para in-file-toclient">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--in-file-toclient=caminho</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Nome do arquivo</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>../share/messages_to_clients.txt</code></td>
    </tr>
  </table>

  O nome do arquivo de entrada que define os erros destinados a serem escritos nos clientes. O padrão é `../share/messages_to_clients.txt`.

* `--name-file=nome_do_arquivo`, `-N nome_do_arquivo`

<table frame="box" rules="all" summary="Propriedades para nome-arquivo">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--nome-arquivo=nome</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>mysqld_ername.h</code></td>
  </tr>
  </tbody>
</table>

  O nome do arquivo de nome de erro. O padrão é `mysqld_ername.h`.

* `--diretório_saída=diretório_nome`, `-D diretório_nome`

  <table frame="box" rules="all" summary="Propriedades para diretório_saída">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--diretório_saída=caminho</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code>../share/</code></td>
    </tr>
  </tbody>
</table>

  O nome do diretório de saída base. O padrão é `../sql/share/`.

* `--arquivo_saída=nome_arquivo`, `-O nome_arquivo`

  <table frame="box" rules="all" summary="Propriedades para charset">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--charset</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code>../share/charsets</code></td>
    </tr>
  </tbody>
</table>

  0

  O nome do arquivo de saída. O padrão é `errmsg.sys`.

* `--versão`, `-V`

  <table frame="box" rules="all" summary="Propriedades para charset">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--charset</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code>../share/charsets</code></td>
    </tr>
  </tbody>
</table>

  Exibir informações de versão e sair.