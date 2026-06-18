### 6.4.1 comp\_err — Arquivo de Mensagem de Erro de Compilação do MySQL

O **comp\_err** cria o arquivo `errmsg.sys` que é usado pelo **mysqld** para determinar as mensagens de erro a serem exibidas para diferentes códigos de erro. O **comp\_err** é normalmente executado automaticamente quando o MySQL é compilado. Ele compila o arquivo `errmsg.sys` a partir das informações de erro no formato de texto nas distribuições de código-fonte do MySQL:

- A partir do MySQL 8.0.19, as informações de erro vêm dos arquivos `messages_to_error_log.txt` e `messages_to_clients.txt` no diretório `share`.

  Para obter mais informações sobre a definição de mensagens de erro, consulte os comentários dentro desses arquivos, juntamente com o arquivo `errmsg_readme.txt`.

- Antes do MySQL 8.0.19, as informações de erro vêm do arquivo `errmsg-utf8.txt` no diretório `sql/share`.

O **comp\_err** também gera os arquivos de cabeçalho `mysqld_error.h`, `mysqld_ername.h` e `mysqld_errmsg.h`.

Invoque **comp\_err** da seguinte forma:

```
comp_err [options]
```

**comp\_err** suporta as seguintes opções.

- `--help`, `-?`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--charset=dir_name`, `-C dir_name`

  <table summary="Propriedades para charset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--charset</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>../share/charsets</code>]]</td> </tr></tbody></table>

  O diretório de conjuntos de caracteres. O padrão é `../sql/share/charsets`.

- `--debug=debug_options`, `-# debug_options`

  <table summary="Propriedades para depuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug=options</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>d:t:O,/tmp/comp_err.trace</code>]]</td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica `debug_options` é `d:t:O,file_name`. O padrão é `d:t:O,/tmp/comp_err.trace`.

- `--debug-info`, `-T`

  <table summary="Propriedades para debug-info"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug-info</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

- `--errmsg-file=file_name`, `-H file_name`

  <table summary="Propriedades para errmsg-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--errmsg-file=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>mysqld_errmsg.h</code>]]</td> </tr></tbody></table>

  O nome do arquivo da mensagem de erro. O padrão é `mysqld_errmsg.h`. Esta opção foi adicionada no MySQL 8.0.18.

- `--header-file=file_name`, `-H file_name`

  <table summary="Propriedades para arquivo de cabeçalho"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--header-file=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>mysqld_error.h</code>]]</td> </tr></tbody></table>

  O nome do arquivo de cabeçalho de erro. O padrão é `mysqld_error.h`.

- `--in-file=file_name`, `-F file_name`

  <table summary="Propriedades para dentro do arquivo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--in-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  O nome do arquivo de entrada. O padrão é `../share/errmsg-utf8.txt`.

  Essa opção foi removida no MySQL 8.0.19 e substituída pelas opções `--in-file-errlog` e `--in-file-toclient`.

- `--in-file-errlog=file_name`, `-e file_name`

  <table summary="Propriedades para o log de erros do arquivo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--in-file-errlog</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>../share/messages_to_error_log.txt</code>]]</td> </tr></tbody></table>

  O nome do arquivo de entrada que define as mensagens de erro destinadas a serem escritas no log de erro. O padrão é `../share/messages_to_error_log.txt`.

  Essa opção foi adicionada no MySQL 8.0.19.

- `--in-file-toclient=file_name`, `-c file_name`

  <table summary="Propriedades para in-file-to-client"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--in-file-toclient=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>../share/messages_to_clients.txt</code>]]</td> </tr></tbody></table>

  O nome do arquivo de entrada que define as mensagens de erro destinadas a serem escritas aos clientes. O padrão é `../share/messages_to_clients.txt`.

  Essa opção foi adicionada no MySQL 8.0.19.

- `--name-file=file_name`, `-N file_name`

  <table summary="Propriedades para nome-arquivo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--name-file=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>mysqld_ername.h</code>]]</td> </tr></tbody></table>

  O nome do arquivo de nome do erro. O padrão é `mysqld_ername.h`.

- `--out-dir=dir_name`, `-D dir_name`

  <table summary="Propriedades para charset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--charset</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>../share/charsets</code>]]</td> </tr></tbody></table>0

  O nome do diretório de base de saída. O padrão é `../sql/share/`.

- `--out-file=file_name`, `-O file_name`

  <table summary="Propriedades para charset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--charset</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>../share/charsets</code>]]</td> </tr></tbody></table>1

  O nome do arquivo de saída. O padrão é `errmsg.sys`.

- `--version`, `-V`

  <table summary="Propriedades para charset"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--charset</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>../share/charsets</code>]]</td> </tr></tbody></table>2

  Exibir informações da versão e sair.
