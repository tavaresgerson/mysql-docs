#### 4.2.2.3 Opções de Linha de Comando que Afetam o Tratamento de Option Files

A maioria dos programas MySQL que suportam option files trata as seguintes opções. Como essas opções afetam o tratamento de option files, elas devem ser fornecidas na command line e não em um option file. Para funcionar corretamente, cada uma dessas opções deve ser fornecida antes de outras opções, com estas exceções:

* `--print-defaults` pode ser usado imediatamente após `--defaults-file`, `--defaults-extra-file` ou `--login-path`.

* No Windows, se o server for iniciado com as opções `--defaults-file` e `--install`, `--install` deve vir primeiro. Veja Seção 2.3.4.8, “Iniciando MySQL como um Serviço Windows”.

Ao especificar nomes de arquivos como valores de opção, evite o uso do metacaractere `~` do shell, pois ele pode não ser interpretado como você espera.

**Table 4.3 Resumo das Opções de Option File**

<table frame="box" rules="all" summary="Opções de command-line disponíveis para tratamento de option files."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--defaults-extra-file</td> <td>Lê o option file nomeado além dos option files usuais</td> </tr><tr><td>--defaults-file</td> <td>Lê apenas o option file nomeado</td> </tr><tr><td>--defaults-group-suffix</td> <td>Valor do sufixo do grupo de opções</td> </tr><tr><td>--login-path</td> <td>Lê opções de login path de .mylogin.cnf</td> </tr><tr><td>--no-defaults</td> <td>Não lê nenhum option file</td> </tr></tbody></table>

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato da Command-Line</th> <td><code>--defaults-extra-file=filename</code></td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê este option file após o option file global, mas (no Unix) antes do option file do usuário e (em todas as plataformas) antes do login path file. (Para informações sobre a ordem em que os option files são usados, veja Seção 4.2.2.2, “Usando Option Files”.) Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um path name absoluto, ele será interpretado em relação ao diretório atual.

  Veja a introdução desta seção sobre restrições na posição em que esta opção pode ser especificada.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato da Command-Line</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê apenas o option file fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. *`file_name`* é interpretado em relação ao diretório atual se fornecido como um path name relativo, e não como um path name completo.

  Exceção: Mesmo com `--defaults-file`, programas cliente leem `.mylogin.cnf`.

  Veja a introdução desta seção sobre restrições na posição em que esta opção pode ser especificada.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato da Command-Line</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o cliente **mysql** normalmente lê os grupos `[client]` e `[mysql]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysql** também lê os grupos `[client_other]` e `[mysql_other]`.

* `--login-path=name`

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato da Command-Line</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Lê opções do login path nomeado no arquivo de login path `.mylogin.cnf`. Um “login path” é um grupo de opções que contém opções especificando a qual server MySQL conectar e com qual conta autenticar. Para criar ou modificar um arquivo de login path, use o utilitário **mysql_config_editor**. Veja Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

  Um programa cliente lê o grupo de opções correspondente ao login path nomeado, além dos grupos de opções que o programa lê por padrão. Considere este comando:

  ```sql
  mysql --login-path=mypath
  ```

  Por padrão, o cliente **mysql** lê os grupos de opções `[client]` e `[mysql]`. Assim, para o comando mostrado, **mysql** lê `[client]` e `[mysql]` de outros option files, e `[client]`, `[mysql]` e `[mypath]` do login path file.

  Programas cliente leem o login path file mesmo quando a opção `--no-defaults` é utilizada.

  Para especificar um nome de login path file alternativo, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`.

  Veja a introdução desta seção sobre restrições na posição em que esta opção pode ser especificada.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para no-defaults"><tbody><tr><th>Formato da Command-Line</th> <td><code>--no-defaults</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Não lê nenhum option file. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um option file, `--no-defaults` pode ser usado para impedir que elas sejam lidas.

  A exceção é que programas cliente leem o login path file `.mylogin.cnf`, se ele existir, mesmo quando `--no-defaults` é usado. Isso permite que passwords sejam especificadas de maneira mais segura do que na command line, mesmo que `--no-defaults` esteja presente. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para print-defaults"><tbody><tr><th>Formato da Command-Line</th> <td><code>--print-defaults</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Imprime o nome do programa e todas as opções que ele obtém dos option files. Valores de Password são mascarados.

  Veja a introdução desta seção sobre restrições na posição em que esta opção pode ser especificada.