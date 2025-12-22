#### 6.2.2.3 Opções de linha de comando que afetam o tratamento de arquivos de opções

A maioria dos programas do MySQL que suportam arquivos de opção lidam com as seguintes opções. Como essas opções afetam o manuseio do arquivo de opção, elas devem ser dadas na linha de comando e não em um arquivo de opção. Para funcionar corretamente, cada uma dessas opções deve ser dada antes de outras opções, com estas exceções:

- `--print-defaults` pode ser usado imediatamente após `--defaults-file`, `--defaults-extra-file`, `--login-path`, ou `--no-login-paths`.
- No Windows, se o servidor for iniciado com as opções `--defaults-file` e `--install`, `--install` deve ser o primeiro. Veja Seção 2.3.3.8, Início do MySQL como um Serviço Windows.

Ao especificar nomes de arquivo como valores de opção, evite o uso do metacaráter de shell `~` porque ele pode não ser interpretado como você espera.

**Tabela 6.3 Resumo do processo de opção**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--defaults-extra-file</td> <td>Leia arquivo de opção nomeado além dos arquivos de opção habituais</td> </tr><tr><td>--defaults-file</td> <td>Arquivo de opções nomeadas somente para leitura</td> </tr><tr><td>--defaults-group-suffix</td> <td>Valor do sufixo do grupo de opções</td> </tr><tr><td>--login-path</td> <td>Leia as opções de caminho de login em .mylogin.cnf</td> </tr><tr><td>- Não há padrões</td> <td>Não ler arquivos de opções</td> </tr><tr><td>--não-login-caminhos</td> <td>Não ler opções do arquivo de caminho de acesso</td> </tr></tbody></table>

- `--defaults-extra-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-extra-file=filename</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

Leia este arquivo de opção depois do arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário e (em todas as plataformas) antes do arquivo de caminho de login. (Para informações sobre a ordem em que os arquivos de opção são usados, veja Seção 6.2.2.2, "Utilizando arquivos de opção") Se o arquivo não existir ou for inacessível, ocorre um erro. Se \* `file_name` \* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual.

Ver a introdução desta secção no que respeita às restrições relativas à posição em que esta opção pode ser especificada.

- `--defaults-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-file=filename</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

Leia apenas o arquivo de opção dado. Se o arquivo não existir ou for inacessível, ocorre um erro. `file_name` é interpretado em relação ao diretório atual se for dado como um nome de caminho relativo em vez de um nome de caminho completo.

Exceções: Mesmo com `--defaults-file`, `mysqld` lê `mysqld-auto.cnf` e programas cliente lê `.mylogin.cnf`.

Ver a introdução desta secção no que respeita às restrições relativas à posição em que esta opção pode ser especificada.

- `--defaults-group-suffix=str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também os grupos com os nomes usuais e um sufixo de \* `str` *. Por exemplo, o cliente \*\* mysql*\* normalmente lê os grupos `[client]` e `[mysql]`. Se esta opção for dada como `--defaults-group-suffix=_other`, \*\* mysql\*\* também lê os grupos `[client_other]` e `[mysql_other]`.

- `--login-path=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

Leia opções do caminho de login nomeado no arquivo de caminho de login. Um caminho de login é um grupo de opções que contém opções que especificam a qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

Um programa cliente lê o grupo de opções correspondente ao caminho de login nomeado, além dos grupos de opções que o programa lê por padrão. Considere este comando:

```
mysql --login-path=mypath
```

Por padrão, o cliente `mysql` lê os grupos de opções `[client]` e `[mysql]`. Assim, para o comando mostrado, `mysql` lê `[client]` e `[mysql]` de outros arquivos de opções e `[client]`, `[mysql]`, e `[mypath]` do arquivo de caminho de login.

Os programas cliente lêem o arquivo de caminho de login mesmo quando a opção `--no-defaults` é usada, a menos que `--no-login-paths` esteja definido.

Para especificar um nome de arquivo de caminho de login alternativo, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`.

Ver a introdução desta secção no que respeita às restrições relativas à posição em que esta opção pode ser especificada.

- `--no-login-paths`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-login-paths</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Salta opções de leitura do arquivo de caminho de login. Programas cliente sempre ler o arquivo de caminho de login sem esta opção, mesmo quando a opção `--no-defaults` é usada.

Ver `--login-path` para informações relacionadas.

Ver a introdução desta secção no que respeita às restrições relativas à posição em que esta opção pode ser especificada.

- `--no-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-defaults</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedi-las de serem lidas.

A exceção é que os programas do cliente leem o arquivo de caminho de login `.mylogin.cnf`, se existir, mesmo quando `--no-defaults` é usado, a menos que `--no-login-paths` esteja definido. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo que `--no-defaults` esteja presente. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

- `--print-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--print-defaults</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém dos arquivos de opções.

Ver a introdução desta secção no que respeita às restrições relativas à posição em que esta opção pode ser especificada.
