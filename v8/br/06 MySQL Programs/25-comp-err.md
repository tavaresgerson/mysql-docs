### 6.4.1 comp\_err  Compilar arquivo de mensagem de erro do MySQL

**comp\_err** cria o arquivo `errmsg.sys` que é usado por `mysqld` para determinar as mensagens de erro a serem exibidas para diferentes códigos de erro. **comp\_err** normalmente é executado automaticamente quando o MySQL é construído. Ele compila o arquivo `errmsg.sys` a partir de informações de erro de formato de texto nas distribuições de origem do MySQL:

As informações de erro vêm dos arquivos `messages_to_error_log.txt` e `messages_to_clients.txt` no diretório `share`.

Para mais informações sobre a definição de mensagens de erro, consulte os comentários dentro desses arquivos, juntamente com o arquivo `errmsg_readme.txt`.

**comp\_err** também gera os arquivos de cabeçalho `mysqld_error.h`, `mysqld_ername.h`, e `mysqld_errmsg.h`.

Invocar **comp\_err** assim:

```
comp_err [options]
```

\*\* comp\_err \*\* suporta as seguintes opções.

- `--help`, `-?`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Mostra uma mensagem de ajuda e sai.

- `--charset=dir_name`, `-C dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--charset</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>../share/charsets</code>]]</td> </tr></tbody></table>

O diretório do conjunto de caracteres. O padrão é `../sql/share/charsets`.

- `--debug=debug_options`, `-# debug_options`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug=options</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>d:t:O,/tmp/comp_err.trace</code>]]</td> </tr></tbody></table>

Escreva um log de depuração. Uma string típica `debug_options` é `d:t:O,file_name`. O padrão é `d:t:O,/tmp/comp_err.trace`.

- `--debug-info`, `-T`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug-info</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Imprima algumas informações de depuração quando o programa sair.

- `--errmsg-file=file_name`, `-H file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--errmsg-file=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>mysqld_errmsg.h</code>]]</td> </tr></tbody></table>

O nome do arquivo da mensagem de erro. O padrão é `mysqld_errmsg.h`.

- `--header-file=file_name`, `-H file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--header-file=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>mysqld_error.h</code>]]</td> </tr></tbody></table>

O nome do arquivo de cabeçalho do erro. O padrão é `mysqld_error.h`.

- `--in-file-errlog=file_name`, `-e file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--in-file-errlog</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>../share/messages_to_error_log.txt</code>]]</td> </tr></tbody></table>

O nome do arquivo de entrada que define as mensagens de erro a serem escritas no registo de erros. O padrão é `../share/messages_to_error_log.txt`.

- `--in-file-toclient=file_name`, `-c file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--in-file-toclient=path</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>../share/messages_to_clients.txt</code>]]</td> </tr></tbody></table>

O nome do arquivo de entrada que define as mensagens de erro destinadas a ser escritas para clientes. O padrão é `../share/messages_to_clients.txt`.

- `--name-file=file_name`, `-N file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--name-file=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>mysqld_ername.h</code>]]</td> </tr></tbody></table>

O nome do arquivo de nome de erro. O padrão é `mysqld_ername.h`.

- `--out-dir=dir_name`, `-D dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--out-dir=path</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>../share/</code>]]</td> </tr></tbody></table>

O nome do diretório base de saída. O padrão é `../sql/share/`.

- `--out-file=file_name`, `-O file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--out-file=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>errmsg.sys</code>]]</td> </tr></tbody></table>

O nome do arquivo de saída. O padrão é `errmsg.sys`.

- `--version`, `-V`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--version</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Informações de versão e saída.
