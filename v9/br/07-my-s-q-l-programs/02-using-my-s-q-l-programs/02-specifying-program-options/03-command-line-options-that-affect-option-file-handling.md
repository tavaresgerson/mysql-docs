#### 6.2.2.3 Opções de linha de comando que afetam o manuseio de arquivos de opção

A maioria dos programas MySQL que suportam arquivos de opção lida com as seguintes opções. Como essas opções afetam o manuseio de arquivos de opção, elas devem ser fornecidas na linha de comando e não em um arquivo de opção. Para funcionar corretamente, cada uma dessas opções deve ser fornecida antes de outras, com essas exceções:

* `--print-defaults` pode ser usado imediatamente após `--defaults-file`, `--defaults-extra-file`, `--login-path` ou `--no-login-paths`.

* No Windows, se o servidor for iniciado com as opções `--defaults-file` e `--install`, `--install` deve ser a primeira. Veja a Seção 2.3.3.8, “Iniciar o MySQL como um serviço do Windows”.

Ao especificar nomes de arquivos como valores de opção, evite o uso do caractere meta `~` do shell, pois ele pode não ser interpretado como você espera.

**Tabela 6.3 Resumo das opções de arquivo de opção**

<table frame="box" rules="all" summary="Opções da linha de comando disponíveis para manipulação de arquivos de opções."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="option-file-options.html#option_general_defaults-extra-file">--defaults-extra-file</a></td> <td>Leia o arquivo de opção nomeado além dos arquivos de opção usuais</td> </tr><tr><td><a class="link" href="option-file-options.html#option_general_defaults-file">--defaults-file</a></td> <td>Leia apenas o arquivo de opção nomeado</td> </tr><tr><td><a class="link" href="option-file-options.html#option_general_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td> </tr><tr><td><a class="link" href="option-file-options.html#option_general_login-path">--login-path</a></td> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> </tr><tr><td><a class="link" href="option-file-options.html#option_general_no-defaults">--no-defaults</a></td> <td>Leia sem arquivos de opção</td> </tr><tr><td><a class="link" href="option-file-options.html#option_general_no-login-paths">--no-login-paths</a></td> <td>Não leia opções do arquivo de caminho de login</td> </tr></tbody></table>

* `--defaults-extra-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da Linha de Comando</th> <td><code class="literal">--defaults-extra-file=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>

Leia este arquivo de opções após o arquivo de opções globais, mas (em Unix) antes do arquivo de opções do usuário e (em todas as plataformas) antes do arquivo de caminho de login. (Para informações sobre a ordem em que os arquivos de opções são usados, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”.) Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Veja a introdução desta seção sobre as restrições sobre a posição em que esta opção pode ser especificada.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--defaults-file=filename</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Leia apenas o arquivo de opções fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. *`file_name`* será interpretado em relação ao diretório atual se for fornecido como um nome de caminho relativo em vez de um nome de caminho completo.

  Exceções: Mesmo com `--defaults-file`, o **mysqld** lê `mysqld-auto.cnf` e os programas cliente lêem `.mylogin.cnf`.

  Veja a introdução desta seção sobre as restrições sobre a posição em que esta opção pode ser especificada.

* `--defaults-group-suffix=str`

<table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Leia não apenas os grupos de opções habituais, mas também grupos com os nomes habituais e um sufixo de *`str`*. Por exemplo, o cliente **mysql** normalmente lê os grupos `[client]` e `[mysql]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, o **mysql** também lê os grupos `[client_other]` e `[mysql_other]`.

* `--login-path=name`

  <table frame="box" rules="all" summary="Propriedades para login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Leia opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Um programa cliente lê o grupo de opções correspondente ao caminho de login nomeado, além dos grupos de opções que o programa lê por padrão. Considere este comando:

  ```
  mysql --login-path=mypath
  ```

Por padrão, o cliente **mysql** lê os grupos de opções `[client]` e `[mysql]`. Portanto, para o comando mostrado, o **mysql** lê `[client]` e `[mysql]` de outros arquivos de opções, e `[client]`, `[mysql]` e `[mypath]` do arquivo de caminho de login.

Os programas cliente lêem o arquivo de caminho de login mesmo quando a opção `--no-defaults` é usada, a menos que `--no-login-paths` seja definida.

Para especificar um nome alternativo de arquivo de caminho de login, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`.

Veja a introdução desta seção sobre as restrições sobre a posição em que essa opção pode ser especificada.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para no-login-paths"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--no-login-paths</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">false</code></td> </tr></tbody></table>

  Ignora a leitura de opções do arquivo de caminho de login. Os programas cliente sempre leem o arquivo de caminho de login sem essa opção, mesmo quando a opção `--no-defaults` é usada.

  Veja `--login-path` para informações relacionadas.

  Veja a introdução desta seção sobre as restrições sobre a posição em que essa opção pode ser especificada.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--no-defaults</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">false</code></td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas.

A exceção é que os programas cliente leem o arquivo de caminho de login `.mylogin.cnf`, se existir, mesmo quando o `--no-defaults` é usado, a menos que o `--no-login-paths` seja definido. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo que o `--no-defaults` esteja presente. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--print-defaults</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">false</code></td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções. Os valores das senhas são mascarados.

  Veja a introdução desta seção sobre as restrições sobre a posição em que essa opção pode ser especificada.