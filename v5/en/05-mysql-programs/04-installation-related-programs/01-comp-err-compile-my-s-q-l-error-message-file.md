### 4.4.1 comp_err — Compila o Arquivo de Mensagens de Erro do MySQL

**comp_err** cria o arquivo `errmsg.sys`, que é usado pelo **mysqld** para determinar as mensagens de erro a serem exibidas para diferentes códigos de erro. O **comp_err** normalmente é executado automaticamente quando o MySQL é construído (built). Ele compila o arquivo `errmsg.sys` a partir do arquivo de informação de erro em formato de texto localizado em `sql/share/errmsg-utf8.txt` nas distribuições de código-fonte do MySQL.

O **comp_err** também gera os arquivos de cabeçalho (`header files`) `mysqld_error.h`, `mysqld_ername.h` e `sql_state.h`.

Para mais informações sobre como as mensagens de erro são definidas, consulte o Manual de Internos do MySQL (MySQL Internals Manual).

Invoque o **comp_err** desta forma:

```sql
comp_err [options]
```

O **comp_err** suporta as seguintes opções.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

* `--charset=dir_name`, `-C dir_name`

  <table frame="box" rules="all" summary="Propriedades para charset"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--charset</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>../share/charsets</code></td> </tr></tbody></table>

  O diretório do conjunto de caracteres (`character set`). O padrão é `../sql/share/charsets`.

* `--debug=debug_options`, `-# debug_options`

  <table frame="box" rules="all" summary="Propriedades para debug"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--debug=options</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>d:t:O,/tmp/comp_err.trace</code></td> </tr></tbody></table>

  Em builds de debug, escreve um log de depuração. Uma string *`debug_options`* típica é `d:t:O,file_name`. O padrão é `d:t:O,/tmp/comp_err.trace`.

  Para builds que não são de debug, esta opção não é funcional e faz com que o programa saia com uma mensagem explicativa.

  Nota

  A forma curta desta opção é `-#`, usando o caractere literal `#`.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Propriedades para debug-info"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--debug-info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Imprime algumas informações de depuração (debugging information) quando o programa é encerrado.

* `--header-file=file_name`, `-H file_name`

  <table frame="box" rules="all" summary="Propriedades para header-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--header-file=name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>mysqld_error.h</code></td> </tr></tbody></table>

  O nome do arquivo de cabeçalho de erro (`error header file`). O padrão é `mysqld_error.h`.

* `--in-file=file_name`, `-F file_name`

  <table frame="box" rules="all" summary="Propriedades para in-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--in-file=path</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O nome do arquivo de entrada que define as mensagens de erro. O padrão é `../sql/share/errmsg-utf8.txt`.

* `--name-file=file_name`, `-N file_name`

  <table frame="box" rules="all" summary="Propriedades para name-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--name-file=name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>mysqld_ername.h</code></td> </tr></tbody></table>

  O nome do arquivo de nomes de erro. O padrão é `mysqld_ername.h`.

* `--out-dir=dir_name`, `-D dir_name`

  <table frame="box" rules="all" summary="Propriedades para out-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--out-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>../share/</code></td> </tr></tbody></table>

  O nome do diretório base de saída. O padrão é `../sql/share/`.

* `--out-file=file_name`, `-O file_name`

  <table frame="box" rules="all" summary="Propriedades para out-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--out-file=name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>errmsg.sys</code></td> </tr></tbody></table>

  O nome do arquivo de saída. O padrão é `errmsg.sys`.

* `--state-file=file_name`, `-S file_name`

  <table frame="box" rules="all" summary="Propriedades para state-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--state-file=name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>sql_state.h</code></td> </tr></tbody></table>

  O nome para o arquivo de cabeçalho SQLSTATE. O padrão é `sql_state.h`.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para charset"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--charset</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>../share/charsets</code></td> </tr></tbody></table>

  Exibe informações de versão e sai.