### 4.4.1 comp_err — Arquivo de Mensagem de Erro de Compilação do MySQL

O **comp_err** cria o arquivo `errmsg.sys`, que é usado pelo **mysqld** para determinar as mensagens de erro a serem exibidas para diferentes códigos de erro. O **comp_err** é normalmente executado automaticamente quando o MySQL é compilado. Ele compila o arquivo `errmsg.sys` a partir do arquivo de informações de erro em formato de texto localizado em `sql/share/errmsg-utf8.txt` nas distribuições de código-fonte do MySQL.

O **comp_err** também gera os arquivos de cabeçalho `mysqld_error.h`, `mysqld_ername.h` e `sql_state.h`.

Para obter mais informações sobre como as mensagens de erro são definidas, consulte o Manual de Interno do MySQL.

Invoque **comp_err** da seguinte forma:

```sh
comp_err [options]
```

**comp_err** suporta as seguintes opções.

- `--help`, `-?`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--charset=nome_pasta`, `-C nome_pasta`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--charset</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>../share/charsets</code></td> </tr></tbody></table>

  O diretório do conjunto de caracteres. O padrão é `../sql/share/charsets`.

- `--debug=opções_de_depuração`, `-# opções_de_depuração`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug=options</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>d:t:O,/tmp/comp_err.trace</code></td> </tr></tbody></table>

  Em builds de depuração, escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:O,nome_do_arquivo`. O padrão é `d:t:O,/tmp/comp_err.trace`.

  Para compilações não de depuração, essa opção não funciona e faz o programa sair com uma mensagem explicativa.

  ::: info Nota
  A forma abreviada dessa opção é `-#`, usando um caractere literal `#`.
  :::

- `--debug-info`, `-T`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug-info</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

- `--header-file=file_name`, `-H file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--header-file=name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>mysqld_error.h</code></td> </tr></tbody></table>

  O nome do arquivo de cabeçalho de erro. O padrão é `mysqld_error.h`.

- `--in-file=file_name`, `-F file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--in-file=path</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O nome do arquivo de entrada que define as mensagens de erro. O padrão é `../sql/share/errmsg-utf8.txt`.

- `--name-file=file_name`, `-N file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--name-file=name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>mysqld_ername.h</code></td> </tr></tbody></table>

  O nome do arquivo de nome de erro. O padrão é `mysqld_ername.h`.

- `--out-dir=dir_name`, `-D dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--out-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>../share/</code></td> </tr></tbody></table>

  O nome do diretório de base de saída. O padrão é `../sql/share/`.

- `--out-file=file_name`, `-O file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--out-file=name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>errmsg.sys</code></td> </tr></tbody></table>

  O nome do arquivo de saída. O padrão é `errmsg.sys`.

- `--state-file=file_name`, `-S file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--state-file=name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>sql_state.h</code></td> </tr></tbody></table>

  O nome do arquivo de cabeçalho SQLSTATE. O padrão é `sql_state.h`.

- `--version`, `-V`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--charset</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>../share/charsets</code></td> </tr></tbody></table>

  Exibir informações da versão e sair.
