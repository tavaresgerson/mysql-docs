### 4.4.2 mysql_install_db — Inicializa o Data Directory do MySQL

Nota

O **mysql_install_db** está descontinuado a partir do MySQL 5.7.6 porque sua funcionalidade foi integrada ao **mysqld**, o MySQL server. Para inicializar uma instalação MySQL, invoque o **mysqld** com a opção `--initialize` ou `--initialize-insecure`. Para mais informações, consulte a Seção 2.9.1, “Inicializando o Data Directory”. Você deve esperar que o **mysql_install_db** seja removido em uma futura release do MySQL.

O **mysql_install_db** lida com tarefas de inicialização que devem ser realizadas antes que o MySQL server, **mysqld**, esteja pronto para uso:

*   Inicializa o Data Directory do MySQL e cria as system tables que ele contém.

*   Inicializa o system tablespace e estruturas de dados relacionadas necessárias para gerenciar tabelas `InnoDB`.

*   Carrega as help tables (tabelas de ajuda) do lado do server.
*   Instala o schema `sys`.
*   Cria uma administrative account (conta administrativa). Versões mais antigas do **mysql_install_db** podem criar anonymous-user accounts (contas de usuário anônimo).

#### Secure-by-Default Deployment

Versões atuais do **mysql_install_db** produzem um deploy do MySQL seguro por padrão, com estas características:

*   Uma única administrative account chamada `'root'@'localhost'` é criada com uma password gerada aleatoriamente, que é marcada como expirada.

*   Nenhuma anonymous-user account é criada.
*   Nenhum Database `test` acessível por todos os users é criado.

*   Opções `--admin-xxx` estão disponíveis para controlar as características da administrative account.

*   A opção `--random-password-file` está disponível para controlar onde a password aleatória é escrita.

*   A opção `--insecure` está disponível para suprimir a geração de password aleatória.

Se o **mysql_install_db** gerar uma password administrativa aleatória, ele a escreve em um arquivo e exibe o nome do arquivo. A entrada da password inclui um timestamp para indicar quando foi escrita. Por padrão, o arquivo é `.mysql_secret` no home directory do user efetivo que está executando o script. O `.mysql_secret` é criado com modo 600 para ser acessível apenas ao user do sistema operacional para o qual foi criado.

Importante

Quando o **mysql_install_db** gera uma password aleatória para a administrative account, é necessário, após a execução do **mysql_install_db**, iniciar o server, conectar usando a administrative account com a password escrita no arquivo `.mysql_secret` e especificar uma nova password administrativa. Até que isso seja feito, a administrative account não pode ser usada para mais nada. Para alterar a password, você pode usar a instrução `SET PASSWORD` (por exemplo, com o client **mysql** ou **mysqladmin**). Após redefinir a password, remova o arquivo `.mysql_secret`; caso contrário, se você executar o **mysql_secure_installation**, esse comando pode ver o arquivo e expirar a password do `root` novamente como parte da garantia de um deploy seguro.

#### Sintaxe de Invocação

Mude a localização para o diretório de instalação do MySQL e use esta sintaxe de invocação:

```sql
bin/mysql_install_db --datadir=path/to/datadir [other_options]
```

A opção `--datadir` é obrigatória. O **mysql_install_db** cria o Data Directory, que não deve existir previamente:

*   Se o Data Directory já existe, você está realizando uma operação de upgrade (não uma operação de instalação) e deve executar o **mysql_upgrade**, não o **mysql_install_db**. Consulte a Seção 4.4.7, “mysql_upgrade — Checa e Atualiza Tabelas MySQL”.

*   Se o Data Directory não existir, mas o **mysql_install_db** falhar, você deve remover qualquer Data Directory parcialmente criado antes de executar o **mysql_install_db** novamente.

Como o MySQL server, **mysqld**, deve acessar o Data Directory quando for executado posteriormente, você deve executar o **mysql_install_db** a partir da mesma system account usada para executar o **mysqld**, ou executá-lo como `root` e especificar a opção `--user` para indicar o user name sob o qual o **mysqld** será executado. Pode ser necessário especificar outras opções, como `--basedir`, se o **mysql_install_db** não usar o local correto para o diretório de instalação. Por exemplo:

```sql
bin/mysql_install_db --user=mysql \
    --basedir=/opt/mysql/mysql \
    --datadir=/opt/mysql/mysql/data
```

Nota

Após o **mysql_install_db** configurar o system tablespace `InnoDB`, alterações em algumas características do tablespace exigem a configuração de uma nova instância completa. Isso inclui o nome do primeiro arquivo no system tablespace e o número de undo logs. Se você não deseja usar os valores padrão, certifique-se de que as configurações para os parâmetros de configuração `innodb_data_file_path` e `innodb_log_file_size` estejam presentes no arquivo de configuração do MySQL antes de executar o **mysql_install_db**. Além disso, certifique-se de especificar, conforme necessário, outros parâmetros que afetam a criação e localização de arquivos `InnoDB`, como `innodb_data_home_dir` e `innodb_log_group_home_dir`.

Se essas opções estiverem no seu arquivo de configuração, mas esse arquivo não estiver em um local que o MySQL lê por padrão, especifique o local do arquivo usando a opção `--defaults-extra-file` ao executar o **mysql_install_db**.

Nota

Se você definiu uma variável de ambiente `TMPDIR` customizada ao realizar a instalação, e o diretório especificado não estiver acessível, o **mysql_install_db** pode falhar. Se isso ocorrer, desfaça a configuração de `TMPDIR` (unset) ou defina `TMPDIR` para apontar para o diretório temporário do sistema (geralmente `/tmp`).

#### Criação da Administrative Account

O **mysql_install_db** cria uma administrative account chamada `'root'@'localhost'` por padrão.

O **mysql_install_db** fornece opções que permitem controlar vários aspectos da administrative account:

*   Para alterar as partes de user ou host do nome da account, use `--login-path`, ou `--admin-user` e `--admin-host`.

*   `--insecure` suprime a geração de uma password aleatória.

*   `--admin-auth-plugin` especifica o authentication plugin.

*   `--admin-require-ssl` especifica se a account deve usar conexões SSL.

Para mais informações, consulte as descrições dessas opções.

O **mysql_install_db** atribui às linhas da system table `mysql.user` um valor de coluna `plugin` não vazio para definir o authentication plugin. O valor padrão é `mysql_native_password`. O valor pode ser alterado usando a opção `--admin-auth-plugin`.

#### Arquivo my.cnf Padrão

O **mysql_install_db** não cria um arquivo `my.cnf` padrão.

Nota

A partir do MySQL 5.7.18, o `my-default.cnf` não está mais incluído ou instalado por pacotes de distribuição.

Com uma exceção, as configurações no arquivo de opção padrão são comentadas e não têm efeito. A exceção é que o arquivo define a system variable `sql_mode` para `NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES`. Essa configuração produz uma configuração de server que resulta em errors em vez de warnings para dados inválidos em operações que modificam tabelas transacionais. Consulte a Seção 5.1.10, “Server SQL Modes”.

#### Opções de Comando

O **mysql_install_db** suporta as seguintes opções, que podem ser especificadas na linha de comando ou no grupo `[mysql_install_db]` de um arquivo de opção. Para obter informações sobre os arquivos de opção usados pelos programas MySQL, consulte a Seção 4.2.2.2, “Usando Arquivos de Opção”.

**Tabela 4.8 Opções do mysql_install_db**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysql_install_db."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Opção Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--admin-auth-plugin</td> <td>Authentication plugin da administrative account</td> </tr><tr><td>--admin-host</td> <td>Parte do host do nome da administrative account</td> </tr><tr><td>--admin-require-ssl</td> <td>Exigir SSL para a administrative account</td> </tr><tr><td>--admin-user</td> <td>Parte do user do nome da administrative account</td> </tr><tr><td>--basedir</td> <td>Path para o base directory</td> </tr><tr><td>--builddir</td> <td>Path para o build directory (para builds fora da source)</td> </tr><tr><td>--datadir</td> <td>Path para o Data Directory</td> </tr><tr><td>--defaults</td> <td>Lê arquivos de opção padrão</td> </tr><tr><td>--defaults-extra-file</td> <td>Lê o arquivo de opção nomeado além dos arquivos de opção usuais</td> </tr><tr><td>--defaults-file</td> <td>Lê apenas o arquivo de opção nomeado</td> </tr><tr><td>--extra-sql-file</td> <td>Arquivo SQL opcional para executar durante o bootstrap</td> </tr><tr><td>--help</td> <td>Exibe a mensagem de ajuda e sai</td> </tr><tr><td>--insecure</td> <td>Não gera password aleatória da administrative account</td> </tr><tr><td>--lc-messages</td> <td>Locale para mensagens de erro</td> </tr><tr><td>--lc-messages-dir</td> <td>Diretório onde as mensagens de erro estão instaladas</td> </tr><tr><td>--login-file</td> <td>Arquivo para ler informações do login path</td> </tr><tr><td>--login-path</td> <td>Lê opções do login path a partir de .mylogin.cnf</td> </tr><tr><td>--mysqld-file</td> <td>Path para o binário mysqld</td> </tr><tr><td>--no-defaults</td> <td>Não lê arquivos de opção</td> </tr><tr><td>--random-password-file</td> <td>Arquivo no qual escrever a password aleatória da administrative account</td> </tr><tr><td>--skip-sys-schema</td> <td>Não instala ou faz upgrade do schema sys</td> </tr><tr><td>--srcdir</td> <td>Para uso interno</td> </tr><tr><td>--user</td> <td>User do sistema operacional sob o qual executar o mysqld</td> </tr><tr><td>--verbose</td> <td>Modo Verbose (detalhado)</td> </tr><tr><td>--version</td> <td>Exibe informações de versão e sai</td> </tr></tbody></table>

*   `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

*   `--admin-auth-plugin=plugin_name`

  <table frame="box" rules="all" summary="Propriedades para admin-auth-plugin"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  O authentication plugin a ser usado para a administrative account. O padrão é `mysql_native_password`.

*   `--admin-host=host_name`

  <table frame="box" rules="all" summary="Propriedades para admin-host"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  A parte do host a ser usada para o nome da administrative account. O padrão é `localhost`. Esta opção é ignorada se `--login-path` também for especificada.

*   `--admin-require-ssl`

  <table frame="box" rules="all" summary="Propriedades para admin-require-ssl"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-require-ssl</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Se deve exigir SSL para a administrative account. O padrão é não exigir. Com esta opção habilitada, a instrução que o **mysql_install_db** usa para criar a account inclui uma cláusula `REQUIRE SSL`. Como resultado, a administrative account deve usar secure connections (conexões seguras) ao se conectar ao server.

*   `--admin-user=user_name`

  <table frame="box" rules="all" summary="Propriedades para admin-user"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-user=user_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  A parte do user a ser usada para o nome da administrative account. O padrão é `root`. Esta opção é ignorada se `--login-path` também for especificada.

*   `--basedir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  O path para o diretório de instalação do MySQL.

*   `--builddir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para builddir"><tbody><tr><th>Command-Line Format</th> <td><code>--builddir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  Para uso com `--srcdir` e builds fora da source (out-of-source builds). Defina este valor para a localização do diretório onde residem os arquivos construídos.

*   `--datadir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para datadir"><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  O path para o Data Directory do MySQL. Apenas o último componente do path name é criado se não existir; o diretório pai já deve existir ou ocorrerá um error.

  Nota

  A opção `--datadir` é obrigatória e o Data Directory não deve existir previamente.

*   `--defaults`

  <table frame="box" rules="all" summary="Propriedades para defaults"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Esta opção faz com que o **mysql_install_db** invoque o **mysqld** de forma que ele leia os arquivos de opção dos locais padrão. Se fornecido como `--no-defaults`, e `--defaults-file` ou `--defaults-extra-file` também não for especificado, o **mysql_install_db** passará `--no-defaults` para o **mysqld**, para evitar que arquivos de opção sejam lidos. Isso pode ajudar se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opção.

*   `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do user. Se o arquivo não existir ou estiver inacessível, ocorrerá um error. Se *`file_name`* não for um path name absoluto, ele será interpretado em relação ao diretório atual.

  Esta opção é passada pelo **mysql_install_db** para o **mysqld**.

  Para informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”.

*   `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um error. Se *`file_name`* não for um path name absoluto, ele será interpretado em relação ao diretório atual.

  Esta opção é passada pelo **mysql_install_db** para o **mysqld**.

  Para informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”.

*   `--extra-sql-file=file_name`, `-f file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Esta opção nomeia um arquivo contendo instruções SQL adicionais a serem executadas após as instruções de bootstrapping padrão. A sintaxe de instrução aceita no arquivo é semelhante à do client **mysql** de linha de comando, incluindo suporte para comentários C-style de várias linhas e tratamento de delimiter para permitir a definição de stored programs.

*   `--insecure`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Não gera uma password aleatória para a administrative account.

  Se `--insecure` *não* for fornecida, é necessário após a execução do **mysql_install_db** iniciar o server, conectar usando a administrative account com a password escrita no arquivo `.mysql_secret` e especificar uma nova password administrativa. Até que isso seja feito, a administrative account não pode ser usada para mais nada. Para alterar a password, você pode usar a instrução `SET PASSWORD` (por exemplo, com o client **mysql** ou **mysqladmin**). Após redefinir a password, remova o arquivo `.mysql_secret`; caso contrário, se você executar o **mysql_secure_installation**, esse comando pode ver o arquivo e expirar a password do `root` novamente como parte da garantia de um deploy seguro.

*   `--lc-messages=name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  O locale a ser usado para mensagens de erro. O padrão é `en_US`. O argumento é convertido em um nome de idioma e combinado com o valor de `--lc-messages-dir` para produzir a localização do arquivo de mensagens de erro. Consulte a Seção 10.12, “Configurando o Idioma da Mensagem de Erro”.

*   `--lc-messages-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  O diretório onde as mensagens de erro estão localizadas. O valor é usado juntamente com o valor de `--lc-messages` para produzir a localização do arquivo de mensagens de erro. Consulte a Seção 10.12, “Configurando o Idioma da Mensagem de Erro”.

*   `--login-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  O arquivo do qual ler o login path se a opção `--login-path=file_name` for especificada. O arquivo padrão é `.mylogin.cnf`.

*   `--login-path=name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Lê opções do login path nomeado no arquivo login path `.mylogin.cnf`. O login path padrão é `client`. (Para ler um arquivo diferente, use a opção `--login-file=name`.) Um “login path” é um grupo de opções que especificam a qual MySQL server conectar e com qual account autenticar. Para criar ou modificar um arquivo login path, use o utility **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — Utility de Configuração do MySQL”.

  Se a opção `--login-path` for especificada, os valores de user, host e password são retirados do login path e usados para criar a administrative account. A password deve ser definida no login path ou ocorrerá um error, a menos que a opção `--insecure` também seja especificada. Além disso, com `--login-path`, quaisquer opções `--admin-host` e `--admin-user` são ignoradas.

  Para informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”.

*   `--mysqld-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  O path name do binário **mysqld** a ser executado. O valor da opção deve ser um path name absoluto ou ocorrerá um error.

  Se esta opção não for fornecida, o **mysql_install_db** procura o **mysqld** nestes locais:

  + No diretório `bin` sob o valor da opção `--basedir`, se essa opção foi fornecida.

  + No diretório `bin` sob o valor da opção `--srcdir`, se essa opção foi fornecida.

  + No diretório `bin` sob o valor da opção `--builddir`, se essa opção foi fornecida.

  + No diretório local e nos diretórios `bin` e `sbin` sob o diretório local.

  + Em `/usr/bin`, `/usr/sbin`, `/usr/local/bin`, `/usr/local/sbin`, `/opt/local/bin`, `/opt/local/sbin`.

*   `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Para o comportamento desta opção, consulte a descrição de `--defaults`.

  Para informações adicionais sobre esta e outras opções de arquivo de opção, consulte a Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”.

*   `--random-password-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para admin-auth-plugin"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  O path name do arquivo no qual escrever a password gerada aleatoriamente para a administrative account. O valor da opção deve ser um path name absoluto ou ocorrerá um error. O padrão é `$HOME/.mysql_secret`.

*   `--skip-sys-schema`

  <table frame="box" rules="all" summary="Propriedades para admin-auth-plugin"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  O **mysql_install_db** instala o schema `sys`. A opção `--skip-sys-schema` suprime este comportamento.

*   `--srcdir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para admin-auth-plugin"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Para uso interno. Esta opção especifica o diretório sob o qual o **mysql_install_db** procura arquivos de suporte, como o arquivo de mensagens de erro e o arquivo para popular as help tables.

*   `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para admin-auth-plugin"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  O user name (login) do sistema para executar o **mysqld**. Arquivos e diretórios criados pelo **mysqld** pertencem a este user. Você deve ser o user `root` do sistema para usar esta opção. Por padrão, o **mysqld** é executado usando seu user name de login atual; arquivos e diretórios que ele cria pertencem a você.

*   `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para admin-auth-plugin"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Modo Verbose (detalhado). Imprime mais informações sobre o que o programa faz. Você pode usar esta opção para ver o comando **mysqld** que o **mysql_install_db** invoca para iniciar o server em modo bootstrap.

*   `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para admin-auth-plugin"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Exibe informações de versão e sai.