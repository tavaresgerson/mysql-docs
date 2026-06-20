## 4.4 Programas relacionados à instalação

Os programas desta seção são usados durante a instalação ou atualização do MySQL.

### 4.4.1 comp_err — Arquivo de Mensagem de Erro de Compilação do MySQL

`comp_err` cria o arquivo `errmsg.sys` que é usado por `mysqld` para determinar as mensagens de erro a serem exibidas para diferentes códigos de erro. `comp_err` normalmente é executado automaticamente quando o MySQL é compilado. Ele compila o arquivo `errmsg.sys` a partir do arquivo de informações de erro em formato de texto localizado em `sql/share/errmsg-utf8.txt` nas distribuições de fonte do MySQL.

`comp_err` também gera os arquivos de cabeçalho `mysqld_error.h`, `mysqld_ername.h` e `sql_state.h`.

Para mais informações sobre como as mensagens de erro são definidas, consulte o Manual de Interno do MySQL.

Invoque `comp_err` da seguinte forma:

```sql
comp_err [options]
```

`comp_err` suporta as seguintes opções.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--charset=dir_name`, `-C dir_name`

  <table frame="box" rules="all" summary="Properties for charset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--charset</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>../share/charsets</code></td> </tr></tbody></table>

O diretório de conjuntos de caracteres. O padrão é `../sql/share/charsets`.

* `--debug=debug_options`, `-# debug_options`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug=options</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:O,/tmp/comp_err.trace</code></td> </tr></tbody></table>

Em builds de depuração, escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:O,file_name`. O padrão é `d:t:O,/tmp/comp_err.trace`.

Para compilações não de depuração, essa opção não funciona e faz com que o programa saia com uma mensagem explicativa.

Nota

A forma abreviada desta opção é `-#`, utilizando um caractere literal `#`.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

Imprima algumas informações de depuração quando o programa sair.

* `--header-file=file_name`, `-H file_name`

  <table frame="box" rules="all" summary="Properties for header-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--header-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>mysqld_error.h</code></td> </tr></tbody></table>

O nome do arquivo de cabeçalho de erro. O padrão é `mysqld_error.h`.

* `--in-file=file_name`, `-F file_name`

  <table frame="box" rules="all" summary="Properties for in-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--in-file=path</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O nome do arquivo de entrada que define as mensagens de erro. O padrão é `../sql/share/errmsg-utf8.txt`.

* `--name-file=file_name`, `-N file_name`

  <table frame="box" rules="all" summary="Properties for name-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--name-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>mysqld_ername.h</code></td> </tr></tbody></table>

O nome do arquivo de nome do erro. O padrão é `mysqld_ername.h`.

* `--out-dir=dir_name`, `-D dir_name`

  <table frame="box" rules="all" summary="Properties for out-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--out-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>../share/</code></td> </tr></tbody></table>

O nome do diretório de base de saída. O padrão é `../sql/share/`.

* `--out-file=file_name`, `-O file_name`

  <table frame="box" rules="all" summary="Properties for out-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--out-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>errmsg.sys</code></td> </tr></tbody></table>

O nome do arquivo de saída. O padrão é `errmsg.sys`.

* `--state-file=file_name`, `-S file_name`

  <table frame="box" rules="all" summary="Properties for state-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--state-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>sql_state.h</code></td> </tr></tbody></table>

O nome do arquivo de cabeçalho SQLSTATE. O padrão é `sql_state.h`.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for charset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--charset</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>../share/charsets</code></td> </tr></tbody></table>0

Exibir informações da versão e sair.

### 4.4.2 mysql_install_db — Inicializar o diretório de dados do MySQL

Nota

`mysql_install_db` é descontinuado a partir do MySQL 5.7.6, pois sua funcionalidade foi integrada ao `mysqld`, o servidor MySQL. Para inicializar uma instalação do MySQL, invoque `mysqld` com a opção `--initialize` ou `--initialize-insecure`. Para mais informações, consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”. Você deve esperar que `mysql_install_db` seja removido em um lançamento futuro do MySQL.

`mysql_install_db` lida com as tarefas de inicialização que devem ser realizadas antes que o servidor MySQL, `mysqld`, esteja pronto para uso:

* Inicializa o diretório de dados do MySQL e cria as tabelas do sistema que ele contém.

* Inicializa o espaço de tabela do sistema e as estruturas de dados relacionadas necessárias para gerenciar as tabelas `InnoDB`.

* Carrega as tabelas de ajuda do lado do servidor.
* Instala o esquema `sys`.
* Cria uma conta administrativa. Versões mais antigas do `mysql_install_db` podem criar contas de usuário anônimo.

#### Implantação Segura por Padrão

As versões atuais do `mysql_install_db` produzem uma implantação do MySQL que é segura por padrão, com as seguintes características:

* Uma conta administrativa única denominada `'root'@'localhost'` é criada com uma senha gerada aleatoriamente, que é marcada como expirada.

* Não são criadas contas de usuário anônimo. * Não é criada uma base de dados `test` acessível por todos os usuários.

* As opções `--admin-xxx` estão disponíveis para controlar as características da conta administrativa.

* A opção `--random-password-file` está disponível para controlar onde a senha aleatória é escrita.

* A opção `--insecure` está disponível para suprimir a geração aleatória de senhas.

Se `mysql_install_db` gerar uma senha administrativa aleatória, ela escreve a senha em um arquivo e exibe o nome do arquivo. A entrada de senha inclui um timestamp para indicar quando foi escrita. Por padrão, o arquivo é `.mysql_secret` no diretório home do usuário efetivo que está executando o script. `.mysql_secret` é criado com o modo 600 para ser acessível apenas ao usuário do sistema operacional para o qual é criado.

Importante

Quando o `mysql_install_db` gera uma senha aleatória para a conta administrativa, é necessário, após o `mysql_install_db` ter sido executado, iniciar o servidor, conectar-se usando a conta administrativa com a senha escrita no arquivo `.mysql_secret` e especificar uma nova senha administrativa. Até que isso seja feito, a conta administrativa não pode ser usada para nada mais. Para alterar a senha, você pode usar a declaração `SET PASSWORD` (por exemplo, com o cliente **mysql** ou **mysqladmin**). Após a redefinição da senha, remova o arquivo `.mysql_secret`; caso contrário, se você executar `mysql_secure_installation`, esse comando pode ver o arquivo e expirar a senha `root` novamente como parte da garantia de implantação segura.

#### Sintaxe de Invocação

Altere a localização para o diretório de instalação do MySQL e use esta sintaxe de invocação:

```sql
bin/mysql_install_db --datadir=path/to/datadir [other_options]
```

A opção `--datadir` é obrigatória. `mysql_install_db` cria o diretório de dados, que não deve já existir:

* Se o diretório de dados já existir, você está realizando uma operação de atualização (não uma operação de instalação) e deve executar `mysqld_upgrade`, não `mysql_install_db`. Veja a Seção 4.4.7, “mysql_upgrade — Verificar e atualizar tabelas do MySQL”.

* Se o diretório de dados não existir, mas o `mysql_install_db` falhar, você deve remover qualquer diretório de dados parcialmente criado antes de executar novamente o `mysql_install_db`.

Como o servidor MySQL, `mysqld`, deve acessar o diretório de dados quando for executado posteriormente, você deve executar `mysql_install_db` a partir da mesma conta de sistema usada para executar `mysqld`, ou executá-lo como `root` e especificar a opção `--user` para indicar o nome do usuário sob o qual o `mysqld` é executado. Pode ser necessário especificar outras opções, como `--basedir`, se o `mysql_install_db` não usar o local correto para o diretório de instalação. Por exemplo:

```sql
bin/mysql_install_db --user=mysql \
    --basedir=/opt/mysql/mysql \
    --datadir=/opt/mysql/mysql/data
```

Nota

Após o `mysql_install_db` configurar o espaço de tabelas `InnoDB` do sistema, as alterações em algumas características do espaço de tabelas exigem a configuração de uma nova instância inteira. Isso inclui o nome do arquivo do primeiro arquivo no espaço de tabelas do sistema e o número de logs de desfazer. Se você não deseja usar os valores padrão, certifique-se de que as configurações dos parâmetros de configuração `innodb_data_file_path` e `innodb_log_file_size` estejam em vigor no arquivo de configuração do MySQL antes de executar `mysql_install_db`. Além disso, certifique-se de especificar, se necessário, outros parâmetros que afetam a criação e a localização dos arquivos `InnoDB`, como `innodb_data_home_dir` e `innodb_log_group_home_dir`.

Se essas opções estiverem no seu arquivo de configuração, mas esse arquivo não estiver em um local que o MySQL leia por padrão, especifique a localização do arquivo usando a opção `--defaults-extra-file` quando você executar `mysql_install_db`.

Nota

Se você definiu uma variável de ambiente personalizada `TMPDIR` ao realizar a instalação, e o diretório especificado não é acessível, `mysql_install_db` pode falhar. Se assim for, desative `TMPDIR` ou defina `TMPDIR` para apontar para o diretório temporário do sistema (geralmente `/tmp`).

#### Criação de Conta Administrativa

O `mysql_install_db` cria uma conta administrativa chamada `'root'@'localhost'` por padrão.

`mysql_install_db` oferece opções que permitem controlar vários aspectos da conta administrativa:

* Para alterar as partes do nome do usuário ou do host da conta, use `--login-path`, ou `--admin-user` e `--admin-host`.

* `--insecure` suprime a geração de uma senha aleatória.

* `--admin-auth-plugin` especifica o plugin de autenticação.

* `--admin-require-ssl` especifica se a conta deve usar conexões SSL.

Para mais informações, consulte as descrições dessas opções.

`mysql_install_db` atribui às linhas da tabela do sistema `mysql.user` um valor de coluna `plugin` não vazio para definir o plugin de autenticação. O valor padrão é `mysql_native_password`. O valor pode ser alterado usando a opção `--admin-auth-plugin`.

#### Arquivo padrão my.cnf

`mysql_install_db` não cria o arquivo padrão `my.cnf`.

Nota

A partir do MySQL 5.7.18, `my-default.cnf` não está mais incluído ou instalado pelos pacotes de distribuição.

Com uma exceção, as configurações no arquivo de opção padrão estão comentadas e não têm efeito. A exceção é que o arquivo define a variável de sistema `sql_mode` para `NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES`. Esta configuração produz uma configuração do servidor que resulta em erros em vez de avisos para dados incorretos em operações que modificam tabelas transacionais. Veja a Seção 5.1.10, “Modos SQL do servidor”.

#### Opções de Comando

`mysql_install_db` suporta as seguintes opções, que podem ser especificadas na linha de comando ou no grupo `[mysql_install_db]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.8 Opções de mysql_install_db**

<table frame="box" rules="all" summary="Command-line options available for mysql_install_db.">
<col style="width: 35%"/>
<col style="width: 64%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Descrição</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>--admin-auth-plugin</code></td>
<td>Plug-in de autenticação de conta administrativa</td>
</tr>
<tr>
<td><code>--admin-host</code></td>
<td>Parte do nome do host da conta administrativa</td>
</tr>
<tr>
<td><code>--admin-require-ssl</code></td>
<td>Exija SSL para a conta administrativa</td>
</tr>
<tr>
<td><code>--admin-user</code></td>
<td>Nome da conta administrativa parte do usuário</td>
</tr>
<tr>
<td><code>--basedir</code></td>
<td>Caminho para o diretório de base</td>
</tr>
<tr>
<td><code>--builddir</code></td>
<td>Caminho para construir o diretório (para compilações fora da fonte)</td>
</tr>
<tr>
<td><code>--datadir</code></td>
<td>Caminho para o diretório de dados</td>
</tr>
<tr>
<td><code>--defaults</code></td>
<td>Leia arquivos de opção padrão</td>
</tr>
<tr>
<td><code>--defaults-extra-file</code></td>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
</tr>
<tr>
<td><code>--defaults-file</code></td>
<td>Arquivo de opção de leitura apenas nomeado</td>
</tr>
<tr>
<td><code>--extra-sql-file</code></td>
<td>Arquivo SQL opcional para executar durante o bootstrap</td>
</tr>
<tr>
<td><code>--help</code></td>
<td>Exibir mensagem de ajuda e sair</td>
</tr>
<tr>
<td><code>--insecure</code></td>
<td>Não gere senha aleatória de conta administrativa</td>
</tr>
<tr>
<td><code>--lc-messages</code></td>
<td>Local para mensagens de erro</td>
</tr>
<tr>
<td><code>--lc-messages-dir</code></td>
<td>Diretório onde as mensagens de erro são instaladas</td>
</tr>
<tr>
<td><code>--login-file</code></td>
<td>Arquivo para leitura das informações do caminho de login</td>
</tr>
<tr>
<td><code>--login-path</code></td>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
</tr>
<tr>
<td><code>--mysqld-file</code></td>
<td>Caminho para o binário mysqld</td>
</tr>
<tr>
<td><code>--no-defaults</code></td>
<td>Não leia arquivos de opção</td>
</tr>
<tr>
<td><code>--random-password-file</code></td>
<td>Arquivo no qual escrever a senha aleatória da conta administrativa</td>
</tr>
<tr>
<td><code>--skip-sys-schema</code></td>
<td>Não instale ou atualize o esquema sys</td>
</tr>
<tr>
<td><code>--srcdir</code></td>
<td>Para uso interno</td>
</tr>
<tr>
<td><code>--user</code></td>
<td>Sistema operacional do usuário pelo qual o mysqld deve ser executado</td>
</tr>
<tr>
<td><code>--verbose</code></td>
<td>Modo verbosos</td>
</tr>
<tr>
<td><code>--version</code></td>
<td>Exibir informações da versão e sair</td>
</tr>
</tbody>
</table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--admin-auth-plugin=plugin_name`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

O plugin de autenticação a ser usado para a conta administrativa. O padrão é `mysql_native_password`.

* `--admin-host=host_name`

  <table frame="box" rules="all" summary="Properties for admin-host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

A parte do host a ser usada para o nome da conta administrativa. O padrão é `localhost`. Esta opção é ignorada se `--login-path` também for especificado.

* `--admin-require-ssl`

  <table frame="box" rules="all" summary="Properties for admin-require-ssl"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-require-ssl</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Se é necessário exigir SSL para a conta administrativa. O padrão não é exigir isso. Com esta opção ativada, a declaração que `mysql_install_db` usa para criar a conta inclui uma cláusula `REQUIRE SSL`. Como resultado, a conta administrativa deve usar conexões seguras ao se conectar ao servidor.

* `--admin-user=user_name`

  <table frame="box" rules="all" summary="Properties for admin-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-user=user_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

A parte do usuário para usar o nome da conta administrativa. O padrão é `root`. Esta opção é ignorada se `--login-path` também for especificado.

* `--basedir=dir_name`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O caminho para o diretório de instalação do MySQL.

* `--builddir=dir_name`

  <table frame="box" rules="all" summary="Properties for builddir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--builddir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

Para uso com `--srcdir` e compilações fora da fonte. Defina este valor para o local do diretório onde os arquivos compilados residem.

* `--datadir=dir_name`

  <table frame="box" rules="all" summary="Properties for datadir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O caminho para o diretório de dados do MySQL. Apenas o último componente do nome do caminho é criado se ele não existir; o diretório pai deve já existir ou ocorrerá um erro.

Nota

A opção `--datadir` é obrigatória e o diretório de dados não deve já existir.

* `--defaults`

  <table frame="box" rules="all" summary="Properties for defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Essa opção faz com que `mysql_install_db` invoque `mysqld` de tal forma que ele leia arquivos de opção nos locais padrão. Se fornecida como `--no-defaults`, e `--defaults-file` ou `--defaults-extra-file` não for especificado também, `mysql_install_db` passa `--no-defaults` para `mysqld`, para evitar que arquivos de opção sejam lidos. Isso pode ajudar se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opção.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Essa opção é passada por `mysql_install_db` para `mysqld`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Essa opção é passada por `mysql_install_db` para `mysqld`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--extra-sql-file=file_name`, `-f file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Esta opção nomeia um arquivo que contém declarações SQL adicionais a serem executadas após as declarações padrão de inicialização. A sintaxe de declaração aceita no arquivo é semelhante à do cliente de linha de comando **mysql**, incluindo suporte para comentários em C de várias linhas e manipulação de delimitadores para permitir a definição de programas armazenados.

* `--insecure`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Não gere uma senha aleatória para a conta administrativa.

Se o `--insecure` não for fornecido, é necessário, após a execução do `mysql_install_db`, iniciar o servidor, conectar-se com a conta administrativa com a senha escrita no arquivo `.mysql_secret` e especificar uma nova senha administrativa. Até que isso seja feito, a conta administrativa não pode ser usada para nada mais. Para alterar a senha, você pode usar a declaração `SET PASSWORD` (por exemplo, com o cliente **mysql** ou **mysqladmin**). Após a redefinição da senha, remova o arquivo `.mysql_secret`; caso contrário, se você executar o `mysql_secure_installation`, esse comando pode ver o arquivo e expirar a senha `root` novamente como parte da garantia de implantação segura.

* `--lc-messages=name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

O local a ser usado para mensagens de erro. O padrão é `en_US`. O argumento é convertido em um nome de idioma e combinado com o valor de `--lc-messages-dir` para produzir a localização do arquivo de mensagem de erro. Veja a Seção 10.12, “Definindo o idioma da mensagem de erro”.

* `--lc-messages-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

O diretório onde as mensagens de erro estão localizadas. O valor é usado juntamente com o valor de `--lc-messages` para produzir a localização do arquivo de mensagem de erro. Veja a Seção 10.12, “Definindo o idioma da mensagem de erro”.

* `--login-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

O arquivo a partir do qual ler o caminho de login se a opção `--login-path=file_name` for especificada. O arquivo padrão é `.mylogin.cnf`.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

Leia opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. O caminho de login padrão é `client`. (Para ler um arquivo diferente, use a opção `--login-file=name`. Um "caminho de login" é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

Se a opção `--login-path` for especificada, os valores do usuário, do host e da senha são tomados do caminho de login e usados para criar a conta administrativa. A senha deve ser definida no caminho de login ou ocorrerá um erro, a menos que a opção `--insecure` também seja especificada. Além disso, com `--login-path`, quaisquer opções `--admin-host` e `--admin-user` são ignoradas.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--mysqld-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

O nome do caminho do binário `mysqld` a ser executado. O valor da opção deve ser um nome de caminho absoluto ou ocorrerá um erro.

Se essa opção não for fornecida, `mysql_install_db` procura por `mysqld` nesses locais:

+ No diretório `bin`, sob o valor de opção `--basedir`, se essa opção foi dada.

+ No diretório `bin`, sob o valor da opção `--srcdir`, se essa opção foi dada.

+ No diretório `bin`, sob o valor da opção `--builddir`, se essa opção foi dada.

+ No diretório local e nos diretórios `bin` e `sbin` sob o diretório local.

+ Em `/usr/bin`, `/usr/sbin`, `/usr/local/bin`, `/usr/local/sbin`, `/opt/local/bin`, `/opt/local/sbin`.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

Para o comportamento desta opção, consulte a descrição de `--defaults`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--random-password-file=file_name`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

O nome do caminho do arquivo no qual será escrito a senha gerada aleatoriamente para a conta administrativa. O valor da opção deve ser um nome de caminho absoluto ou ocorrerá um erro. O padrão é `$HOME/.mysql_secret`.

* `--skip-sys-schema`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

`mysql_install_db` instala o esquema `sys`. A opção `--skip-sys-schema` suprime esse comportamento.

* `--srcdir=dir_name`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

Para uso interno. Esta opção especifica o diretório sob o qual `mysql_install_db` procura por arquivos de suporte, como o arquivo de mensagem de erro e o arquivo para preencher as tabelas de ajuda.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

O nome de usuário do sistema (login) que será usado para executar `mysqld`. Os arquivos e diretórios criados por `mysqld` são de propriedade deste usuário. Você deve ser o usuário do sistema `root` para usar esta opção. Por padrão, `mysqld` executa usando o seu nome de login atual; os arquivos e diretórios que ele cria são de sua propriedade.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

Modo detalhado. Imprima mais informações sobre o que o programa faz. Você pode usar essa opção para ver o comando `mysqld` que `mysql_install_db` invoca para iniciar o servidor no modo de bootstrap.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

Exibir informações da versão e sair.

### 4.4.3 mysql_plugin — Configurar plugins do servidor MySQL

Nota

O **mysql\_plugin** é descontinuado a partir do MySQL 5.7.11 e removido no MySQL 8.0. As alternativas incluem carregar plugins na inicialização do servidor usando a opção `--plugin-load` ou `--plugin-load-add`, ou em tempo real usando a declaração `INSTALL PLUGIN`.

O utilitário **mysql\_plugin** permite que os administradores do MySQL gerenciem quais plugins um servidor MySQL carrega. Ele oferece uma alternativa para especificar manualmente a opção `--plugin-load` no início da inicialização do servidor ou usar as declarações `INSTALL PLUGIN` e `UNINSTALL PLUGIN` no runtime.

Dependendo se o **mysql\_plugin** é invocado para habilitar ou desabilitar plugins, ele insere ou exclui linhas na tabela `mysql.plugin` que serve como um registro de plugins. (Para realizar essa operação, o **mysql\_plugin** invoca o servidor MySQL no modo de inicialização. Isso significa que o servidor não deve estar em execução.) Para inicializações normais do servidor, o servidor carrega e habilita plugins listados em `mysql.plugin` automaticamente. Para controle adicional sobre a ativação do plugin, use as opções de `--plugin_name` nomeadas para plugins específicos, conforme descrito na Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Cada invocação do **mysql_plugin** lê um arquivo de configuração para determinar como configurar os plugins contidos em um único arquivo de biblioteca de plugins. Para invocar o **mysql_plugin**, use a seguinte sintaxe:

```sql
mysql_plugin [options] plugin {ENABLE|DISABLE}
```

*`plugin`* é o nome do plugin a ser configurado. `ENABLE` ou `DISABLE` (não sensível ao caso) especifica se os componentes da biblioteca de plugins nomeados no arquivo de configuração devem ser habilitados ou desabilitados. A ordem dos argumentos *`plugin`* e `ENABLE` ou `DISABLE` não importa.

Por exemplo, para configurar componentes de um arquivo de biblioteca de plugins chamado `myplugins.so` no Linux ou `myplugins.dll` no Windows, especifique um valor *`plugin`* de `myplugins`. Suponha que essa biblioteca de plugins contenha três plugins, `plugin1`, `plugin2` e `plugin3`, todos dos quais devem ser configurados sob o controle de **mysql\_plugin**. Por convenção, os arquivos de configuração têm um sufixo de `.ini` e o mesmo nome de base que a biblioteca de plugins, então o nome padrão do arquivo de configuração para essa biblioteca de plugins é `myplugins.ini`. O conteúdo do arquivo de configuração parece assim:

```sql
myplugins
plugin1
plugin2
plugin3
```

A primeira linha do arquivo `myplugins.ini` é o nome do arquivo da biblioteca, sem qualquer extensão, como `.so` ou `.dll`. As linhas restantes são os nomes dos componentes que devem ser habilitados ou desabilitados. Cada valor no arquivo deve estar em uma linha separada. As linhas nas quais o primeiro caractere é `'#'` são consideradas comentários e ignoradas.

Para habilitar os plugins listados no arquivo de configuração, invoque o **mysql\_plugin** da seguinte maneira:

```sql
mysql_plugin myplugins ENABLE
```

Para desativar os plugins, use `DISABLE` em vez de `ENABLE`.

Um erro ocorre se o **mysql_plugin** não conseguir encontrar o arquivo de configuração ou o arquivo da biblioteca do plugin, ou se o **mysql_plugin** não conseguir iniciar o servidor MySQL.

O **mysql\_plugin** suporta as seguintes opções, que podem ser especificadas na linha de comando ou no grupo `[mysqld]` de qualquer arquivo de opção. Para opções especificadas em um grupo `[mysqld]`, o **mysql\_plugin** reconhece as opções `--basedir`, `--datadir` e `--plugin-dir` e ignora outras. Para informações sobre arquivos de opção usados por programas MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opção”.

**Tabela 4.9 Opções do mysql_plugin**

<table frame="box" rules="all" summary="Command-line options available for mysql_plugin."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--basedir</td> <td>O diretório de base do servidor</td> </tr><tr><td>--datadir</td> <td>O diretório de dados do servidor</td> </tr><tr><td>--help</td> <td>Exibir mensagem de ajuda e sair</td> </tr><tr><td>--my-print-defaults</td> <td>Caminho para my_print_defaults</td> </tr><tr><td>--mysqld</td> <td>Caminho para o servidor</td> </tr><tr><td>--no-defaults</td> <td>Não leia o arquivo de configuração</td> </tr><tr><td>--plugin-dir</td> <td>Diretório onde os plugins são instalados</td> </tr><tr><td>--plugin-ini</td> <td>O arquivo de configuração do plugin</td> </tr><tr><td>--print-defaults</td> <td>Mostrar configurações padrão do arquivo de configuração</td> </tr><tr><td>--verbose</td> <td>Modo verbosos</td> </tr><tr><td>--version</td> <td>Exibir informações da versão e sair</td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--basedir=dir_name`, `-b dir_name`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O diretório de base do servidor.

* `--datadir=dir_name`, `-d dir_name`

  <table frame="box" rules="all" summary="Properties for datadir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O diretório de dados do servidor.

* `--my-print-defaults=file_name`, `-b file_name`

  <table frame="box" rules="all" summary="Properties for my-print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--my-print-defaults=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

O caminho para o programa **my\_print\_defaults**.

* `--mysqld=file_name`, `-b file_name`

  <table frame="box" rules="all" summary="Properties for mysqld"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqld=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

O caminho para o servidor `mysqld`.

* `--no-defaults`, `-p`

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

Não leia valores do arquivo de configuração. Esta opção permite que um administrador ignore a leitura dos valores padrão do arquivo de configuração.

Com o **mysql_plugin**, essa opção não precisa ser dada primeiro na linha de comando, ao contrário da maioria dos outros programas MySQL que suportam `--no-defaults`.

* `--plugin-dir=dir_name`, `-p dir_name`

  <table frame="box" rules="all" summary="Properties for plugin-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O diretório de plugins do servidor.

* `--plugin-ini=file_name`, `-i file_name`

  <table frame="box" rules="all" summary="Properties for plugin-ini"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--plugin-ini=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

O arquivo de configuração do **mysql\_plugin**. Os nomes de caminho relativos são interpretados em relação ao diretório atual. Se esta opção não for fornecida, o padrão é `plugin.ini` no diretório do plugin, onde *`plugin`* é o argumento *`plugin`* na linha de comando.

* `--print-defaults`, `-P`

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

Exibir os valores padrão do arquivo de configuração. Esta opção faz com que o **mysql\_plugin** imprima os padrões para `--basedir`, `--datadir` e `--plugin-dir` se forem encontrados no arquivo de configuração. Se não for encontrado nenhum valor para uma variável, nada é mostrado.

Com o **mysql_plugin**, essa opção não precisa ser dada primeiro na linha de comando, ao contrário da maioria dos outros programas MySQL que suportam `--print-defaults`.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Modo detalhado. Imprima mais informações sobre o que o programa faz. Essa opção pode ser usada várias vezes para aumentar a quantidade de informações.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Exibir informações da versão e sair.

### 4.4.4 mysql\_secure\_installation — Melhorar a segurança da instalação do MySQL

Este programa permite que você melhore a segurança da sua instalação do MySQL das seguintes maneiras:

* Você pode definir uma senha para contas de `root`. * Você pode remover contas de `root` que são acessíveis de fora do host local.

* Você pode remover contas de usuários anônimos. * Você pode remover o banco de dados `test` (que, por padrão, pode ser acessado por todos os usuários, incluindo usuários anônimos) e privilégios que permitem que qualquer pessoa acesse bancos de dados com nomes que comecem com `test_`.

`mysql_secure_installation` ajuda você a implementar recomendações de segurança semelhantes às descritas na Seção 2.9.4, “Segurando a Conta Inicial do MySQL”.

O uso normal é conectar-se ao servidor MySQL local; invocar `mysql_secure_installation` sem argumentos:

```sql
mysql_secure_installation
```

Quando executado, `mysql_secure_installation` solicita que você determine quais ações realizar.

O plugin `validate_password` pode ser usado para verificar a força da senha. Se o plugin não estiver instalado, o `mysql_secure_installation` solicita ao usuário se ele deve instalá-lo. Quaisquer senhas inseridas posteriormente são verificadas usando o plugin se ele estiver habilitado.

A maioria das opções do cliente MySQL padrão, como `--host` e `--port`, pode ser usada na linha de comando e em arquivos de opção. Por exemplo, para se conectar ao servidor local via IPv6 usando a porta 3307, use este comando:

```sql
mysql_secure_installation --host=::1 --port=3307
```

`mysql_secure_installation` suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql_secure_installation]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.10 Opções de mysql_secure_installation**

<table frame="box" rules="all" summary="Command-line options available for mysql_secure_installation.">
<col style="width: 31%"/>
<col style="width: 56%"/>
<col style="width: 12%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Accepted but always ignored. Whenever mysql_secure_installation is invoked, the user is prompted for a password, regardless</td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
</tr>
<tr>
<th><code>--use-default</code></th>
<td>Execute sem interatividade do usuário</td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
</tr>
</tbody>
</table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, `mysql_secure_installation` normalmente lê os grupos `[client]` e `[mysql_secure_installation]`. Se esta opção for dada como `--defaults-group-suffix=_other`, `mysql_secure_installation` também lê os grupos `[client_other]` e `[mysql_secure_installation_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>

Conecte-se ao servidor MySQL no host fornecido.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--password=password`, `-p password`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password=password</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Essa opção é aceita, mas ignorada. Se essa opção for usada ou não, `mysql_secure_installation` sempre solicita uma senha ao usuário.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for port"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--port=port_num</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3306</code></td> </tr></tbody></table>

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de comando para conexões criptografadas.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos e cifras TLS de conexão criptografada”.

Essa opção foi adicionada no MySQL 5.7.10.

* `--use-default`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Execute não interativamente. Esta opção pode ser usada para operações de instalação sem supervisão.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

### 4.4.5 mysql_ssl_rsa_setup — Criar arquivos SSL/RSA

Este programa cria os arquivos de certificado SSL e chave e os arquivos de par de chave RSA necessários para suportar conexões seguras usando SSL e troca segura de senhas usando RSA em conexões não criptografadas, se esses arquivos estiverem ausentes. `mysql_ssl_rsa_setup` também pode ser usado para criar novos arquivos SSL se os existentes tiverem expirado.

Nota

`mysql_ssl_rsa_setup` utiliza o comando **openssl**, portanto, seu uso depende de ter o OpenSSL instalado em sua máquina.

Outra maneira de gerar arquivos SSL e RSA, para distribuições MySQL compiladas usando OpenSSL, é fazer com que o servidor os gere automaticamente. Veja a Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”.

Importante

`mysql_ssl_rsa_setup` ajuda a reduzir a barreira para o uso do SSL, tornando mais fácil gerar os arquivos necessários. No entanto, os certificados gerados por `mysql_ssl_rsa_setup` são autoassinados, o que não é muito seguro. Depois de ganhar experiência usando os arquivos criados por `mysql_ssl_rsa_setup`, considere obter um certificado CA de uma autoridade de certificados registrada.

Invoque `mysql_ssl_rsa_setup` da seguinte forma:

```sql
mysql_ssl_rsa_setup [options]
```

As opções típicas são `--datadir` para especificar onde criar os arquivos e `--verbose` para ver os comandos do **openssl** que o `mysql_ssl_rsa_setup` executa.

`mysql_ssl_rsa_setup` tenta criar arquivos SSL e RSA usando um conjunto padrão de nomes de arquivos. Funciona da seguinte forma:

1. `mysql_ssl_rsa_setup` verifica o binário **openssl** nos locais especificados pela variável de ambiente `PATH`. Se **openssl** não for encontrado, `mysql_ssl_rsa_setup` não faz nada. Se **openssl** estiver presente, `mysql_ssl_rsa_setup` procura os arquivos SSL e RSA padrão no diretório de dados MySQL especificado pela opção `--datadir`, ou no diretório de dados incorporado se a opção `--datadir` não for fornecida.

2. `mysql_ssl_rsa_setup` verifica o diretório de dados em busca de arquivos SSL com os seguintes nomes:

   ```sql
   ca.pem
   server-cert.pem
   server-key.pem
   ```

3. Se algum desses arquivos estiver presente, `mysql_ssl_rsa_setup` não cria arquivos SSL. Caso contrário, ele invoca o **openssl** para criá-los, além de alguns arquivos adicionais:

   ```sql
   ca.pem               Self-signed CA certificate
   ca-key.pem           CA private key
   server-cert.pem      Server certificate
   server-key.pem       Server private key
   client-cert.pem      Client certificate
   client-key.pem       Client private key
   ```

Esses arquivos permitem conexões seguras com o cliente usando SSL; veja a Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

4. `mysql_ssl_rsa_setup` verifica o diretório de dados em busca de arquivos RSA com os seguintes nomes:

   ```sql
   private_key.pem      Private member of private/public key pair
   public_key.pem       Public member of private/public key pair
   ```

5. Se algum desses arquivos estiver presente, o `mysql_ssl_rsa_setup` não cria arquivos RSA. Caso contrário, ele invoca o **openssl** para criá-los. Esses arquivos permitem a troca segura de senhas usando RSA em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password`; veja a Seção 6.4.1.5, “Autenticação Conectada SHA-256”.

Para informações sobre as características dos arquivos criados por `mysql_ssl_rsa_setup`, consulte a Seção 6.3.3.1, “Criando certificados e chaves SSL e RSA usando MySQL”.

Ao iniciar, o servidor MySQL utiliza automaticamente os arquivos SSL criados pelo `mysql_ssl_rsa_setup` para habilitar o SSL se não forem fornecidas opções SSL explícitas, exceto o `--ssl` (possivelmente juntamente com o `ssl_cipher`). Se você prefere designar os arquivos explicitamente, invoque clientes com as opções `--ssl-ca`, `--ssl-cert` e `--ssl-key` ao iniciar para nomear os arquivos `ca.pem`, `server-cert.pem` e `server-key.pem`, respectivamente.

O servidor também utiliza automaticamente os arquivos RSA criados por `mysql_ssl_rsa_setup` para habilitar o RSA se não forem fornecidas opções explícitas de RSA.

Se o servidor estiver habilitado para SSL, os clientes usam SSL por padrão para a conexão. Para especificar explicitamente os arquivos de certificado e chave, use as opções `--ssl-ca`, `--ssl-cert` e `--ssl-key` para nomear os arquivos `ca.pem`, `client-cert.pem` e `client-key.pem`, respectivamente. No entanto, pode ser necessário realizar algumas configurações adicionais no cliente, pois o `mysql_ssl_rsa_setup`, por padrão, cria esses arquivos no diretório de dados. As permissões para o diretório de dados normalmente permitem acesso apenas à conta do sistema que executa o servidor MySQL, portanto, os programas do cliente não podem usar arquivos localizados lá. Para tornar os arquivos disponíveis, copie-os para um diretório que seja legível (mas *não* gravável) pelos clientes:

* Para clientes locais, o diretório de instalação do MySQL pode ser usado. Por exemplo, se o diretório de dados for um subdiretório do diretório de instalação e sua localização atual for o diretório de dados, você pode copiar os arquivos da seguinte forma:

  ```sql
  cp ca.pem client-cert.pem client-key.pem ..
  ```

* Para clientes remotos, distribua os arquivos por meio de um canal seguro para garantir que não sejam adulterados durante o trânsito.

Se os arquivos SSL usados para uma instalação do MySQL expiraram, você pode usar `mysql_ssl_rsa_setup` para criar novos:

1. Parar o servidor. 2. Renomear ou remover os arquivos SSL existentes. Você pode querer fazer um backup deles primeiro. (Os arquivos RSA não expiram, então você não precisa removê-los. `mysql_ssl_rsa_setup` vê que eles existem e não os sobrescreve.)

3. Execute `mysql_ssl_rsa_setup` com a opção `--datadir` para especificar onde criar os novos arquivos.

4. Reinicie o servidor.

`mysql_ssl_rsa_setup` suporta as seguintes opções de linha de comando, que podem ser especificadas na linha de comando ou nos grupos `[mysql_ssl_rsa_setup]`, `[mysql_install_db]` e `[mysqld]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.11 Opções de mysql_ssl_rsa_setup**

<table frame="box" rules="all" summary="Command-line options available for mysql_ssl_rsa_setup.">
<col style="width: 35%"/>
<col style="width: 64%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Descrição</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>--datadir</code></td>
<td>Caminho para o diretório de dados</td>
</tr>
<tr>
<td><code>--help</code></td>
<td>Exibir mensagem de ajuda e sair</td>
</tr>
<tr>
<td><code>--suffix</code></td>
<td>Sufixo para o atributo Nome comum do certificado X.509</td>
</tr>
<tr>
<td><code>--uid</code></td>
<td>Nome do usuário eficaz a ser usado para permissões de arquivo</td>
</tr>
<tr>
<td><code>--verbose</code></td>
<td>Modo verbosos</td>
</tr>
<tr>
<td><code>--version</code></td>
<td>Exibir informações da versão e sair</td>
</tr>
</tbody>
</table>

* `--help`, `?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--datadir=dir_name`

  <table frame="box" rules="all" summary="Properties for datadir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O caminho para o diretório que `mysql_ssl_rsa_setup` deve verificar para arquivos SSL e RSA padrão e em qual deve criar arquivos se eles estiverem ausentes. O padrão é o diretório de dados incorporado.

* `--suffix=str`

  <table frame="box" rules="all" summary="Properties for suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--suffix=str</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

O sufixo para o atributo Nome Comum em certificados X.509. O valor do sufixo é limitado a 17 caracteres. O padrão é baseado no número da versão do MySQL.

* `--uid=name`, `-v`

  <table frame="box" rules="all" summary="Properties for uid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--uid=name</code></td> </tr></tbody></table>

O nome do usuário que deve ser o proprietário de quaisquer arquivos criados. O valor é um nome de usuário, não um ID de usuário numérico. Na ausência desta opção, os arquivos criados por `mysql_ssl_rsa_setup` são propriedade do usuário que os executa. Esta opção é válida apenas se você executar o programa como `root` em um sistema que suporte a chamada de sistema `chown()`.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

Modo detalhado. Produza mais informações sobre o que o programa faz. Por exemplo, o programa mostra os comandos do **openssl** que ele executa e produz saída para indicar se ele ignora a criação de arquivos SSL ou RSA porque algum arquivo padrão já existe.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for version"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr></tbody></table>

Exibir informações da versão e sair.

### 4.4.6 mysql_tzinfo_to_sql — Carregar as tabelas de fuso horário

O programa `mysql_tzinfo_to_sql` carrega as tabelas de fuso horário no banco de dados `mysql`. Ele é usado em sistemas que possuem um banco de dados zoneinfo (o conjunto de arquivos que descrevem os fusos horários). Exemplos desses sistemas são Linux, FreeBSD, Solaris e macOS. Um local provável para esses arquivos é o diretório `/usr/share/zoneinfo` (`/usr/share/lib/zoneinfo` em Solaris). Se o seu sistema não possui um banco de dados zoneinfo, você pode usar o pacote para download descrito na Seção 5.1.13, “Suporte de Fuso Horário do MySQL Server”.

`mysql_tzinfo_to_sql` pode ser invocado de várias maneiras:

```sql
mysql_tzinfo_to_sql tz_dir
mysql_tzinfo_to_sql tz_file tz_name
mysql_tzinfo_to_sql --leap tz_file
```

Para a sintaxe de invocação inicial, passe o nome do caminho do diretório zoneinfo para `mysql_tzinfo_to_sql` e envie a saída para o programa **mysql**. Por exemplo:

```sql
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root mysql
```

`mysql_tzinfo_to_sql` lê os arquivos de fuso horário do sistema e gera declarações SQL a partir deles. O **mysql** processa essas declarações para carregar as tabelas de fuso horário.

A segunda sintaxe faz com que `mysql_tzinfo_to_sql` carregue um único arquivo de fuso horário *`tz_file`* que corresponde a um nome de fuso horário *`tz_name`*:

```sql
mysql_tzinfo_to_sql tz_file tz_name | mysql -u root mysql
```

Se o seu fuso horário precisar de considerar segundos intercalares, invoque `mysql_tzinfo_to_sql` usando a terceira sintaxe, que inicializa as informações sobre o segundo intercalar. *`tz_file`* é o nome do seu arquivo de fuso horário:

```sql
mysql_tzinfo_to_sql --leap tz_file | mysql -u root mysql
```

Após executar o `mysql_tzinfo_to_sql`, é melhor reiniciar o servidor para que ele não continue a usar quaisquer dados de fuso horário armazenados anteriormente.

### 4.4.7 mysql_upgrade — Verificar e atualizar tabelas do MySQL

Cada vez que você atualizar o MySQL, você deve executar `mysqld_upgrade`, que procura incompatibilidades com o servidor MySQL atualizado:

* Atualiza as tabelas do sistema no esquema `mysql` para que você possa aproveitar novos privilégios ou capacidades que possam ter sido adicionadas.

* Atualiza o esquema de desempenho e o esquema `sys`.

* Examina os esquemas do usuário.

Se o `mysqld_upgrade` encontrar que uma tabela tem uma possível incompatibilidade, ele realiza uma verificação da tabela e, se problemas forem encontrados, tenta uma reparação da tabela. Se a tabela não puder ser reparada, consulte a Seção 2.10.12, “Reestruturação ou reparação de tabelas ou índices”, para estratégias de reparação manual de tabelas.

`mysqld_upgrade` comunica diretamente com o servidor MySQL, enviando-lhe as instruções SQL necessárias para realizar uma atualização.

Importante

No MySQL 5.7.11, o valor padrão `--early-plugin-load` é o nome do arquivo da biblioteca de plugins `keyring_file`, fazendo com que o plugin seja carregado por padrão. No MySQL 5.7.12 e versões posteriores, o valor padrão `--early-plugin-load` é vazio; para carregar o plugin `keyring_file`, você deve especificar explicitamente a opção com um valor que nomeie o arquivo da biblioteca de plugins `keyring_file`.

A criptografia do tablespace `InnoDB` exige que o plugin de chave seja carregado antes da inicialização do `InnoDB`, portanto, essa mudança no valor padrão do `--early-plugin-load` introduz uma incompatibilidade para atualizações de 5.7.11 para 5.7.12 ou superior. Os administradores que criptografaram os tablespaces `InnoDB` devem tomar ação explícita para garantir o carregamento contínuo do plugin de chave: Inicie o servidor com uma opção de `--early-plugin-load` que nomeie o arquivo da biblioteca do plugin. Para informações adicionais, consulte a Seção 6.4.4.1, “Instalação do Plugin de Chave”.

Importante

Se você atualizar para o MySQL 5.7.2 ou posterior a partir de uma versão anterior a 5.7.2, uma mudança na tabela `mysql.user` requer uma sequência especial de etapas para realizar uma atualização usando `mysqld_upgrade`. Para obter detalhes, consulte a Seção 2.10.3, “Alterações no MySQL 5.7”.

Nota

Em Windows, você deve executar `mysqld_upgrade` com privilégios de administrador. Você pode fazer isso executando um Prompt de Comando como Administrador e executando o comando. Se não fizer isso, o upgrade pode não ser executado corretamente.

Cuidado

Você deve sempre fazer um backup da sua instalação MySQL atual *antes* de realizar uma atualização. Veja a Seção 7.2, “Métodos de backup de banco de dados”.

Algumas incompatibilidades de atualização podem exigir um tratamento especial *antes* de atualizar sua instalação do MySQL e executar o `mysqld_upgrade`. Consulte a Seção 2.10, “Atualizando o MySQL”, para obter instruções sobre como determinar se tais incompatibilidades se aplicam à sua instalação e como lidar com elas.

Use `mysqld_upgrade` da seguinte forma:

1. Certifique-se de que o servidor está em execução.
2. Inicie `mysqld_upgrade` para atualizar as tabelas do sistema no esquema `mysql` e verifique e repare as tabelas em outros esquemas:

   ```sql
   mysql_upgrade [options]
   ```

3. Parar o servidor e reiniciá-lo para que quaisquer alterações nas tabelas do sistema sejam efetivas.

Se você tem várias instâncias do servidor MySQL a serem atualizadas, invoque `mysqld_upgrade` com os parâmetros de conexão apropriados para se conectar a cada um dos servidores desejados. Por exemplo, com servidores que rodam no host local nas partes 3306 a 3308, atualize cada um deles conectando-se à porta apropriada:

```sql
mysql_upgrade --protocol=tcp -P 3306 [other_options]
mysql_upgrade --protocol=tcp -P 3307 [other_options]
mysql_upgrade --protocol=tcp -P 3308 [other_options]
```

Para conexões de host local em Unix, a opção `--protocol=tcp` força uma conexão usando TCP/IP em vez do arquivo de soquete Unix.

Por padrão, `mysqld_upgrade` funciona como o usuário `root` do MySQL. Se a senha do `root` expirar quando você executar `mysqld_upgrade`, ela exibirá uma mensagem informando que sua senha expirou e que o `mysqld_upgrade` falhou como resultado. Para corrigir isso, reconfigure a senha do `root` para que ela não expire e execute novamente `mysqld_upgrade`. Primeiro, conecte-se ao servidor como `root`:

```sql
$> mysql -u root -p
Enter password: ****  <- enter root password here
```

Redefinir a senha usando `ALTER USER`:

```sql
mysql> ALTER USER USER() IDENTIFIED BY 'root-password';
```

Em seguida, saia do **mysql** e execute `mysqld_upgrade` novamente:

```sql
$> mysql_upgrade [options]
```

Nota

Se você executar o servidor com a variável de sistema `disabled_storage_engines` definida para desabilitar determinados motores de armazenamento (por exemplo, `MyISAM`,) `mysqld_upgrade` pode falhar com um erro como este:

```sql
mysql_upgrade: [ERROR] 3161: Storage engine MyISAM is disabled
(Table creation is disallowed).
```

Para lidar com isso, reinicie o servidor com `disabled_storage_engines` desativado. Depois disso, você deve ser capaz de executar `mysqld_upgrade` com sucesso. Após isso, reinicie o servidor com `disabled_storage_engines` definido para seu valor original.

A menos que invocado com a opção `--upgrade-system-tables`, o `mysqld_upgrade` processa todas as tabelas em todos os esquemas do usuário conforme necessário. O verificação de tabelas pode levar um longo tempo para ser concluída. Cada tabela é bloqueada e, portanto, indisponível para outras sessões enquanto está sendo processada. As operações de verificação e reparo podem ser demoradas, especialmente para tabelas grandes. O verificação de tabelas usa a opção `FOR UPGRADE` da declaração `CHECK TABLE`. Para obter detalhes sobre o que essa opção implica, consulte a Seção 13.7.2.2, “Declaração CHECK TABLE”.

`mysqld_upgrade` marca todas as tabelas verificadas e reparadas com o número atual da versão do MySQL. Isso garante que, na próxima vez que você executar `mysqld_upgrade` com a mesma versão do servidor, pode ser determinado se há alguma necessidade de verificar ou reparar novamente uma determinada tabela.

`mysqld_upgrade` salva o número da versão do MySQL em um arquivo chamado `mysql_upgrade_info` no diretório de dados. Isso é usado para verificar rapidamente se todas as tabelas foram verificadas para esta versão, para que o verificação de tabela possa ser ignorada. Para ignorar este arquivo e realizar a verificação independentemente, use a opção `--force`.

`mysqld_upgrade` verifica as linhas da tabela do sistema `mysql.user` e, para qualquer linha com uma coluna `plugin` vazia, define essa coluna para `'mysql_native_password'` ou `'mysql_old_password'`, dependendo do formato de hash do valor da coluna `Password`.

O suporte para hashing de senha pré-4.1 e `mysql_old_password` foi removido, então `mysqld_upgrade` define valores vazios de `plugin` para `'mysql_native_password'` se as credenciais utilizarem um formato de hash compatível com esse plugin. As linhas com um hash de senha pré-4.1 devem ser atualizadas manualmente. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

`mysqld_upgrade` não atualiza os conteúdos das tabelas de fuso horário ou das tabelas de ajuda. Para obter instruções de atualização, consulte a Seção 5.1.13, “Suporte de Fuso Horário do MySQL Server”, e a Seção 5.1.14, “Suporte de Ajuda do Servidor”.

A menos que invocado com a opção `--skip-sys-schema`, o `mysqld_upgrade` instala o esquema `sys` se ele não estiver instalado, e o atualiza para a versão atual, caso contrário. Um erro ocorre se um esquema `sys` existir, mas não tiver nenhuma `version` de exibição, assumindo que sua ausência indica um esquema criado pelo usuário:

```sql
A sys schema exists with no sys.version view. If
you have a user created sys schema, this must be renamed for the
upgrade to succeed.
```

Para fazer uma atualização neste caso, remova ou renomeie primeiro o esquema existente `sys`.

`mysqld_upgrade` verifica tabelas `InnoDB` particionadas que foram criadas usando o manipulador de particionamento genérico e tenta atualizá-las para particionamento nativo `InnoDB`. (Bug #76734, Bug #20727344) Você pode atualizar essas tabelas individualmente no cliente **mysql** usando a declaração SQL `ALTER TABLE ... UPGRADE PARTITIONING`.

`mysqld_upgrade` suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql_upgrade]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.12 Opções de mysql_upgrade**

<table frame="box" rules="all" summary="Command-line options available for mysql_upgrade.">
<col style="width: 31%"/>
<col style="width: 56%"/>
<col style="width: 12%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
</tr>
<tr>
<th><code>--compress</code></th>
<td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
</tr>
<tr>
<th><code>--default-character-set</code></th>
<td>Especificar o conjunto de caracteres padrão</td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
</tr>
<tr>
<th><code>--force</code></th>
<td>Force execution even if mysql_upgrade has already been executed for current MySQL version</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
</tr>
<tr>
<th><code>--max-allowed-packet</code></th>
<td>Comprimento máximo do pacote para enviar ou receber do servidor</td>
<td></td>
</tr>
<tr>
<th><code>--net-buffer-length</code></th>
<td>Buffer size for TCP/IP and socket communication</td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
</tr>
<tr>
<th><code>--skip-sys-schema</code></th>
<td>Não instale ou atualize o sys schema</td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
</tr>
<tr>
<th><code>--upgrade-system-tables</code></th>
<td>Atualize apenas as tabelas do sistema, não os esquemas do usuário</td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Verbose mode</td>
<td></td>
</tr>
<tr>
<th><code>--version-check</code></th>
<td>Verifique a versão correta do servidor</td>
<td></td>
</tr>
<tr>
<th><code>--write-binlog</code></th>
<td>Escreva todas as declarações no log binário</td>
<td></td>
</tr>
</tbody>
</table>

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma breve mensagem de ajuda e sair.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 10.15, “Configuração de Conjunto de Caracteres”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 4.2.6, “Controle de Compressão de Conexão”.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=#]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:O,/tmp/mysql_upgrade.trace</code></td> </tr></tbody></table>

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:O,/tmp/mysql_upgrade.trace`.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for debug-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>

Imprima algumas informações de depuração quando o programa sair.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação substituível”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for default-character-set"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-character-set=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 10.15, “Configuração do Conjunto de Caracteres”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, `mysqld_upgrade` normalmente lê os grupos `[client]` e `[mysql_upgrade]`. Se esta opção for dada como `--defaults-group-suffix=_other`, `mysqld_upgrade` também lê os grupos `[client_other]` e `[mysql_upgrade_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--force`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Ignore o arquivo `mysql_upgrade_info` e force a execução mesmo que `mysqld_upgrade` já tenha sido executado para a versão atual do MySQL.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

Conecte-se ao servidor MySQL no host fornecido.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

O tamanho máximo do buffer para comunicação cliente/servidor. O valor padrão é de 24 MB. Os valores mínimo e máximo são de 4 KB e 2 GB.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

O tamanho inicial do buffer para comunicação cliente/servidor. O valor padrão é de 1 MB a 1 KB. Os valores mínimo e máximo são de 4 KB e 16 MB.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, `mysqld_upgrade` solicita uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que `mysqld_upgrade` não deve solicitar uma senha, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

Em Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas `mysqld_upgrade` não o encontrar. Veja a Seção 6.2.13, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--skip-sys-schema`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

Por padrão, `mysqld_upgrade` instala o esquema `sys` se ele não estiver instalado e, caso contrário, o atualiza para a versão atual. A opção `--skip-sys-schema` suprime esse comportamento.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de comando para conexões criptografadas.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos e cifras TLS de conexão criptografada”.

Essa opção foi adicionada no MySQL 5.7.10.

* `--upgrade-system-tables`, `-s`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

Atualize apenas as tabelas do sistema no esquema `mysql`, não atualize os esquemas de usuários.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>0

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor. O nome de usuário padrão é `root`.

* `--verbose`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>1

Modo detalhado. Imprima mais informações sobre o que o programa faz.

* `--version-check`, `-k`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>2

Verifique a versão do servidor a que o `mysqld_upgrade` está se conectando para verificar se é a mesma versão para a qual o `mysqld_upgrade` foi construído. Se não for, o `mysqld_upgrade` sai. Esta opção é habilitada por padrão; para desabilitar a verificação, use `--skip-version-check`.

* `--write-binlog`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>3

Por padrão, o registro binário por `mysqld_upgrade` é desativado. Inicie o programa com `--write-binlog` se quiser que suas ações sejam escritas no registro binário.

Quando o servidor estiver em execução com identificadores de transação global (GTIDs) habilitados (`gtid_mode=ON`,) não habilite o registro binário por `mysqld_upgrade`.

