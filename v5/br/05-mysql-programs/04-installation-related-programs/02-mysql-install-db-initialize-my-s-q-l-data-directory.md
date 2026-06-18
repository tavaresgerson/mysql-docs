### 4.4.2 mysql_install_db — Inicializar o diretório de dados do MySQL

::: info Nota
**mysql_install_db** está desatualizado a partir do MySQL 5.7.6, pois sua funcionalidade foi integrada ao **mysqld**, o servidor MySQL. Para inicializar uma instalação do MySQL, invocando **mysqld** com a opção `--initialize` ou `--initialize-insecure`. Para obter mais informações, consulte a Seção 2.9.1, “Inicializando o diretório de dados”. Você deve esperar que **mysql_install_db** seja removido em uma futura versão do MySQL.
:::

O **mysql_install_db** lida com tarefas de inicialização que devem ser realizadas antes que o servidor MySQL, **mysqld**, esteja pronto para uso:
- Ele inicializa o diretório de dados do MySQL e cria as tabelas do sistema que ele contém.
- Ele inicializa o espaço de tabela do sistema e as estruturas de dados relacionadas necessárias para gerenciar as tabelas do `InnoDB`.
- Carrega as tabelas de ajuda do lado do servidor.
- Ele instala o esquema `sys`.
- Ele cria uma conta administrativa. Versões mais antigas do **mysql_install_db** podem criar contas de usuário anônimo.

#### Implantação segura por padrão

As versões atuais do **mysql_install_db** produzem uma implantação do MySQL que é segura por padrão, com as seguintes características:
- Uma única conta administrativa chamada `'root'@'localhost'` é criada com uma senha gerada aleatoriamente, que está marcada como expirada.
- Não são criadas contas de usuários anônimos.
- Não é criado um banco de dados de `teste` acessível por todos os usuários.
- As opções `--admin-xxx` estão disponíveis para controlar as características da conta administrativa.
- A opção `--random-password-file` está disponível para controlar onde a senha aleatória é escrita.
- A opção `--insecure` está disponível para suprimir a geração aleatória de senhas.

Se o **mysql_install_db** gerar uma senha administrativa aleatória, ele escreve a senha em um arquivo e exibe o nome do arquivo. A entrada da senha inclui um timestamp para indicar quando foi escrita. Por padrão, o arquivo é `.mysql_secret` no diretório home do usuário efetivo que está executando o script. `.mysql_secret` é criado com o modo 600 para ser acessível apenas ao usuário do sistema operacional para o qual é criado.

Importante

Quando o **mysql_install_db** gera uma senha aleatória para a conta administrativa, é necessário iniciar o servidor após o **mysql_install_db** ter sido executado, conectar-se usando a conta administrativa com a senha escrita no arquivo `.mysql_secret` e especificar uma nova senha administrativa. Até que isso seja feito, a conta administrativa não pode ser usada para nada mais. Para alterar a senha, você pode usar a instrução `SET PASSWORD` (por exemplo, com o cliente **mysql** ou **mysqladmin**). Após redefinir a senha, remova o arquivo `.mysql_secret`; caso contrário, se você executar o **mysql_secure_installation**, esse comando pode ver o arquivo e expirar novamente a senha `root` como parte da garantia de implantação segura.

#### Sintaxe de Invocação

Altere a localização para o diretório de instalação do MySQL e use esta sintaxe de invocação:

```sh
bin/mysql_install_db --datadir=path/to/datadir [other_options]
```

A opção `--datadir` é obrigatória. O `mysql_install_db` cria o diretório de dados, que não pode já existir:

- Se o diretório de dados já existir, você está realizando uma operação de atualização (e não de instalação) e deve executar o **mysql_upgrade**, e não o **mysql_install_db**. Veja a Seção 4.4.7, “mysql_upgrade — Verificar e atualizar tabelas do MySQL”.

- Se o diretório de dados não existir, mas o **mysql_install_db** falhar, você deve remover qualquer diretório de dados parcialmente criado antes de executar novamente o **mysql_install_db**.

Como o servidor MySQL, **mysqld**, deve acessar o diretório de dados quando for executado mais tarde, você deve executar **mysql_install_db** a partir da mesma conta de sistema usada para executar **mysqld**, ou executá-lo como `root` e especificar a opção `--user` para indicar o nome do usuário sob o qual o **mysqld** será executado. Pode ser necessário especificar outras opções, como `--basedir`, se o **mysql_install_db** não estiver usando a localização correta para o diretório de instalação. Por exemplo:

```sh
bin/mysql_install_db --user=mysql \
    --basedir=/opt/mysql/mysql \
    --datadir=/opt/mysql/mysql/data
```

::: info Nota
Após o **mysql_install_db** configurar o espaço de tabelas `InnoDB`, alterações em algumas características do espaço de tabelas exigem a criação de uma nova instância. Isso inclui o nome do arquivo do primeiro arquivo no espaço de tabelas do sistema e o número de logs de desfazer. Se você não quiser usar os valores padrão, certifique-se de que as configurações dos parâmetros de configuração `innodb_data_file_path` e `innodb_log_file_size` estejam no arquivo de configuração do MySQL antes de executar o **mysql_install_db**. Além disso, certifique-se de especificar outros parâmetros necessários que afetam a criação e a localização dos arquivos `InnoDB`, como `innodb_data_home_dir` e `innodb_log_group_home_dir`.

Se essas opções estiverem no seu arquivo de configuração, mas esse arquivo não estiver em um local que o MySQL lê por padrão, especifique a localização do arquivo usando a opção `--defaults-extra-file` quando executar o **mysql_install_db**.
:::


::: info Nota
Se você definiu uma variável de ambiente `TMPDIR` personalizada durante a instalação e o diretório especificado não é acessível, o **mysql_install_db** pode falhar. Nesse caso, desative `TMPDIR` ou defina `TMPDIR` para apontar para o diretório temporário do sistema (geralmente `/tmp`).
:::

#### Criação de Conta Administrativa

O comando **mysql_install_db** cria uma conta administrativa com o nome `'root'@'localhost'` por padrão.

O **mysql_install_db** oferece opções que permitem controlar vários aspectos da conta administrativa:
- Para alterar as partes do nome de usuário ou do host da conta, use `--login-path` ou `--admin-user` e `--admin-host`.
- `--insecure` suprime a geração de uma senha aleatória.
- `--admin-auth-plugin` especifica o plugin de autenticação.
- `--admin-require-ssl` especifica se a conta deve usar conexões SSL.

Para mais informações, consulte as descrições dessas opções.

O comando **mysql_install_db** atribui ao registro da tabela de sistema `mysql.user` um valor não nulo para a coluna `plugin` para definir o plugin de autenticação. O valor padrão é `mysql_native_password`. O valor pode ser alterado usando a opção `--admin-auth-plugin`.

#### Arquivo padrão my.cnf

O comando **mysql_install_db** não cria o arquivo padrão `my.cnf`.

::: info Nota
A partir do MySQL 5.7.18, o `my-default.cnf` não está mais incluído ou instalado pelos pacotes de distribuição.
:::

Com uma exceção, as configurações no arquivo de opção padrão estão comentadas e não têm efeito. A exceção é que o arquivo define a variável de sistema `sql_mode` para `NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES`. Essa configuração produz uma configuração do servidor que resulta em erros em vez de avisos para dados incorretos em operações que modificam tabelas transacionais. Veja a Seção 5.1.10, “Modos SQL do Servidor”.

#### Opções de comando

O **mysql_install_db** suporta as seguintes opções, que podem ser especificadas na linha de comando ou no grupo **[mysql_install_db]** de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.8 Opções de mysql_install_db**

<table><thead><tr><th>Nome da Opção</th><th>Descrição</th></tr></thead><tbody><tr><td>--admin-auth-plugin</td><td>Plugin de autenticação de conta administrativa</td></tr><tr><td>--admin-host</td><td>Parte do nome do host da conta administrativa</td></tr><tr><td>--admin-require-ssl</td><td>Exigir SSL para a conta administrativa</td></tr><tr><td>--admin-user</td><td>Nome do usuário da conta administrativa parte da palavra</td></tr><tr><td>--basedir</td><td>Caminho para o diretório de base</td></tr><tr><td>--builddir</td><td>Caminho para construir o diretório (para compilações fora da fonte)</td></tr><tr><td>--datadir</td><td>Caminho para o diretório de dados</td></tr><tr><td>--defaults</td><td>Ler arquivos de opção padrão</td></tr><tr><td>--defaults-extra-file</td><td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td></tr><tr><td>--defaults-file</td><td>Arquivo de opção de leitura apenas nomeado</td></tr><tr><td>--extra-sql-file</td><td>Arquivo SQL opcional para executar durante o bootstrap</td></tr><tr><td>--help</td><td>Exibir mensagem de ajuda e sair</td></tr><tr><td>--insecure</td><td>Não gere senhas aleatórias para contas administrativas</td></tr><tr><td>--lc-messages</td><td>Local para mensagens de erro</td></tr><tr><td>--lc-messages-dir</td><td>Diretório onde as mensagens de erro são instaladas</td></tr><tr><td>--login-file</td><td>Arquivo para leitura de informações de caminho de login</td></tr><tr><td>--login-path</td><td>Leia as opções de caminho de login a partir de .mylogin.cnf</td></tr><tr><td>--mysqld-file</td><td>Caminho para o binário mysqld</td></tr><tr><td>--no-defaults</td><td>Não ler arquivos de opção</td></tr><tr><td>--random-password-file</td><td>Arquivo no qual você deve escrever a senha aleatória da conta administrativa</td></tr><tr><td>--skip-sys-schema</td><td>Não instale ou atualize o esquema sys</td></tr><tr><td>--srcdir</td><td>Para uso interno</td></tr><tr><td>--user</td><td>Sistema operacional do usuário sob o qual executar o mysqld</td></tr><tr><td>--verbose</td><td>Modo verbosos</td></tr><tr><td>--version</td><td>Exibir informações da versão e sair</td></tr></tbody></table>

- `--help`, `-?`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--admin-auth-plugin=plugin_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O plugin de autenticação a ser usado para a conta administrativa. O padrão é `mysql_native_password`.

- `--admin-host=nome_do_host`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A parte do host a ser usada para o nome da conta administrativa. O padrão é `localhost`. Esta opção é ignorada se `--login-path` também for especificado.

- `--admin-require-ssl`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-require-ssl</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Se é necessário exigir SSL para a conta administrativa. O padrão é não exigir. Com essa opção ativada, a declaração que o **mysql_install_db** usa para criar a conta inclui uma cláusula `REQUIRE SSL`. Como resultado, a conta administrativa deve usar conexões seguras ao se conectar ao servidor.

- `--admin-user=nome_do_usuário`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-user=user_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A parte do usuário para usar no nome da conta administrativa. O padrão é `root`. Esta opção é ignorada se `--login-path` também for especificado.

- `--basedir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O caminho para o diretório de instalação do MySQL.

- `--builddir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--builddir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Para uso com `--srcdir` e compilações fora da fonte. Defina para o local do diretório onde os arquivos compilados residem.

- `--datadir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O caminho para o diretório de dados do MySQL. Apenas o último componente do nome do caminho é criado se ele não existir; o diretório pai deve já existir ou ocorrerá um erro.

  Nota

  A opção `--datadir` é obrigatória e o diretório de dados não pode já existir.

- `--defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Essa opção faz com que o **mysql_install_db** invocando o **mysqld** de tal forma que ele leia os arquivos de opções nos locais padrão. Se fornecido como `--no-defaults` e `--defaults-file` ou `--defaults-extra-file` não for especificado também, o **mysql_install_db** passa `--no-defaults` para o **mysqld**, para evitar que os arquivos de opções sejam lidos. Isso pode ajudar se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções.

- `--defaults-extra-file=nome_do_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Essa opção é passada pelo **mysql_install_db** para o **mysqld**.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=nome_do_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Essa opção é passada pelo **mysql_install_db** para o **mysqld**.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--extra-sql-file=file_name`, `-f file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Esta opção nomeia um arquivo que contém instruções SQL adicionais a serem executadas após as instruções padrão de inicialização. A sintaxe da instrução aceita no arquivo é semelhante à do cliente de linha de comando **mysql**, incluindo suporte para comentários em C de várias linhas e manipulação de delimitadores para permitir a definição de programas armazenados.

- `--insecure`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Não crie uma senha aleatória para a conta administrativa.

  Se `--insecure` não for fornecido, é necessário iniciar o servidor após a execução de **mysql_install_db**, conectar-se usando a conta administrativa com a senha escrita no arquivo `.mysql_secret` e especificar uma nova senha administrativa. Até que isso seja feito, a conta administrativa não pode ser usada para nada mais. Para alterar a senha, você pode usar a instrução `SET PASSWORD` (por exemplo, com o cliente **mysql** ou **mysqladmin**). Após redefinir a senha, remova o arquivo `.mysql_secret`; caso contrário, se você executar **mysql_secure_installation**, esse comando pode ver o arquivo e expirar a senha `root` novamente como parte da garantia de implantação segura.

- `--lc-messages=nome`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O local a ser usado para mensagens de erro. O padrão é `en_US`. O argumento é convertido para um nome de idioma e combinado com o valor de `--lc-messages-dir` para produzir a localização do arquivo de mensagem de erro. Veja a Seção 10.12, “Definindo o Idioma da Mensagem de Erro”.

- `--lc-messages-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O diretório onde as mensagens de erro estão localizadas. O valor é usado juntamente com o valor de `--lc-messages` para produzir a localização do arquivo de mensagem de erro. Veja a Seção 10.12, “Definindo o Idioma da Mensagem de Erro”.

- `--login-file=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O arquivo a partir do qual ler o caminho de login se a opção `--login-path=file_name` for especificada. O arquivo padrão é `.mylogin.cnf`.

- `--login-path=nome`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. O caminho de login padrão é `client`. (Para ler um arquivo diferente, use a opção `--login-file=nome`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

  Se a opção `--login-path` for especificada, os valores de usuário, host e senha são obtidos do caminho de login e usados para criar a conta administrativa. A senha deve ser definida no caminho de login ou ocorrerá um erro, a menos que a opção `--insecure` também seja especificada. Além disso, com `--login-path`, as opções `--admin-host` e `--admin-user` são ignoradas.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--mysqld-file=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O nome do caminho do binário **mysqld** a ser executado. O valor da opção deve ser um nome de caminho absoluto ou ocorrerá um erro.

  Se essa opção não for fornecida, o **mysql_install_db** procura por **mysqld** nesses locais:

  - No diretório `bin` sob o valor da opção `--basedir`, se essa opção foi fornecida.

  - No diretório `bin` sob o valor da opção `--srcdir`, se essa opção foi fornecida.

  - No diretório `bin` sob o valor da opção `--builddir`, se essa opção foi fornecida.

  - No diretório local e nos diretórios `bin` e `sbin` sob o diretório local.

  - Em `/usr/bin`, `/usr/sbin`, `/usr/local/bin`, `/usr/local/sbin`, `/opt/local/bin`, `/opt/local/sbin`.

- `--no-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Para saber como essa opção funciona, consulte a descrição de `--defaults`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--random-password-file=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome do caminho do arquivo no qual será escrito a senha gerada aleatoriamente para a conta administrativa. O valor da opção deve ser um nome de caminho absoluto ou ocorrerá um erro. O padrão é `$HOME/.mysql_secret`.

- `--skip-sys-schema`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O comando **mysql_install_db** instala o esquema `sys`. A opção `--skip-sys-schema` suprime esse comportamento.

- `--srcdir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Para uso interno. Esta opção especifica o diretório em que o **mysql_install_db** procura por arquivos de suporte, como o arquivo de mensagem de erro e o arquivo para preenchimento das tabelas de ajuda.

- `--user=user_name`, `-u user_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome de usuário do sistema (login) a ser usado para executar o **mysqld**. Os arquivos e diretórios criados pelo **mysqld** são de propriedade deste usuário. Você deve ser o usuário `root` do sistema para usar esta opção. Por padrão, o **mysqld** é executado usando o nome de login atual; os arquivos e diretórios que ele cria são de sua propriedade.

- `--verbose`, `-v`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Modo verbose. Imprima mais informações sobre o que o programa faz. Você pode usar essa opção para ver o comando **mysqld** que o **mysql_install_db** invoca para iniciar o servidor no modo de bootstrap.

- `--version`, `-V`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Exibir informações da versão e sair.
