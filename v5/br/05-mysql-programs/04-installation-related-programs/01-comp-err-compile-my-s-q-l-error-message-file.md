### 4.4.1 comp\_err — Arquivo de Mensagem de Erro de Compilação do MySQL

O **comp\_err** cria o arquivo `errmsg.sys`, que é usado pelo **mysqld** para determinar as mensagens de erro a serem exibidas para diferentes códigos de erro. O **comp\_err** é normalmente executado automaticamente quando o MySQL é compilado. Ele compila o arquivo `errmsg.sys` a partir do arquivo de informações de erro em formato de texto localizado em `sql/share/errmsg-utf8.txt` nas distribuições de código-fonte do MySQL.

O **comp\_err** também gera os arquivos de cabeçalho `mysqld_error.h`, `mysqld_ername.h` e `sql_state.h`.

Para obter mais informações sobre como as mensagens de erro são definidas, consulte o Manual de Interno do MySQL.

Invoque **comp\_err** da seguinte forma:

```sql
comp_err [options]
```

**comp\_err** suporta as seguintes opções.

- `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">false</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--charset=nome_pasta`, `-C nome_pasta`

  <table frame="box" rules="all" summary="Propriedades para charset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--charset</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">../share/charsets</code>]]</td> </tr></tbody></table>

  O diretório do conjunto de caracteres. O padrão é `../sql/share/charsets`.

- `--debug=opções_de_depuração`, `-# opções_de_depuração`

  <table frame="box" rules="all" summary="Propriedades para depuração"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--debug=options</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">d:t:O,/tmp/comp_err.trace</code>]]</td> </tr></tbody></table>

  Em builds de depuração, escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:O,nome_do_arquivo`. O padrão é `d:t:O,/tmp/comp_err.trace`.

  Para compilações não de depuração, essa opção não funciona e faz o programa sair com uma mensagem explicativa.

  Nota

  A forma abreviada dessa opção é `-#`, usando um caractere literal `#`.

- `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Propriedades para debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--debug-info</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">false</code>]]</td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

- `--header-file=file_name`, `-H file_name`

  <table frame="box" rules="all" summary="Propriedades para arquivo de cabeçalho"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--header-file=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">mysqld_error.h</code>]]</td> </tr></tbody></table>

  O nome do arquivo de cabeçalho de erro. O padrão é `mysqld_error.h`.

- `--in-file=file_name`, `-F file_name`

  <table frame="box" rules="all" summary="Propriedades para dentro do arquivo"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--in-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  O nome do arquivo de entrada que define as mensagens de erro. O padrão é `../sql/share/errmsg-utf8.txt`.

- `--name-file=file_name`, `-N file_name`

  <table frame="box" rules="all" summary="Propriedades para nome-arquivo"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--name-file=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">mysqld_ername.h</code>]]</td> </tr></tbody></table>

  O nome do arquivo de nome de erro. O padrão é `mysqld_ername.h`.

- `--out-dir=dir_name`, `-D dir_name`

  <table frame="box" rules="all" summary="Propriedades para fora do diretório"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--out-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">../share/</code>]]</td> </tr></tbody></table>

  O nome do diretório de base de saída. O padrão é `../sql/share/`.

- `--out-file=file_name`, `-O file_name`

  <table frame="box" rules="all" summary="Propriedades para arquivo externo"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--out-file=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">errmsg.sys</code>]]</td> </tr></tbody></table>

  O nome do arquivo de saída. O padrão é `errmsg.sys`.

- `--state-file=file_name`, `-S file_name`

  <table frame="box" rules="all" summary="Propriedades para arquivo do estado"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--state-file=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">sql_state.h</code>]]</td> </tr></tbody></table>

  O nome do arquivo de cabeçalho SQLSTATE. O padrão é `sql_state.h`.

- `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para charset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--charset</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">../share/charsets</code>]]</td> </tr></tbody></table>0

  Exibir informações da versão e sair.
