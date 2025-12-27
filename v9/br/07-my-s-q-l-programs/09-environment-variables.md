## 6.9 Variáveis de Ambiente

Esta seção lista as variáveis de ambiente que são usadas diretamente ou indiretamente pelo MySQL. A maioria dessas variáveis também pode ser encontrada em outros lugares deste manual.

As opções na linha de comando têm precedência sobre os valores especificados em arquivos de opção e variáveis de ambiente, e os valores em arquivos de opção têm precedência sobre os valores em variáveis de ambiente. Em muitos casos, é preferível usar um arquivo de opção em vez de variáveis de ambiente para modificar o comportamento do MySQL. Consulte a Seção 6.2.2.2, “Usando Arquivos de Opção”.

<table summary="Variáveis de ambiente que são usadas diretamente ou indiretamente pelo MySQL">
<tr> <th>Variável</th> <th>Descrição</th> </tr>
<tr> <td><code class="literal">AUTHENTICATION_KERBEROS_CLIENT_LOG</code></td> <td>Nível de registro de autenticação Kerberos.</td> </tr>
<tr> <td><code class="literal">AUTHENTICATION_LDAP_CLIENT_LOG</code></td> <td>Nível de registro de autenticação LDAP no lado do cliente.</td> </tr>
<tr> <td><code class="literal">AUTHENTICATION_PAM_LOG</code></td> <td>Configurações de registro de depuração do plugin de autenticação PAM.</td> </tr>
<tr> <td><code class="literal">CC</code></td> <td>Nome do compilador C (para executar o <span class="command"><strong>CMake</strong></span>).</td> </tr>
<tr> <td><code class="literal">CXX</code></td> <td>Nome do compilador C++ (para executar o <span class="command"><strong>CMake</strong></span>).</td> </tr>
<tr> <td><code class="literal">CC</code></td> <td>Nome do compilador C (para executar o <span class="command"><strong>CMake</strong></span>).</td> </tr>
<tr> <td><code class="literal">DBI_USER</code></td> <td>Nome de usuário padrão para o DBI Perl.</td> </tr>
<tr> <td><code class="literal">DBI_TRACE</code></td> <td>Opções de registro de opções para o DBI Perl.</td> </tr>
<tr> <td><code class="literal">HOME</code></td> <td>Caminho padrão para o arquivo de histórico do <a class="link" href="mysql.html" title="6.5.1 mysql — The MySQL Command-Line Client"><span class="command"><strong>mysql</strong></span></a> é <code class="filename">$HOME/.mysql_history</code>.</td> </tr>
<tr> <td><code class="literal">LD_RUN_PATH</code></td> <td>Localização do arquivo <code class="filename">libmysqlclient.so</code>.</td> </tr>
<tr> <td><code class="literal">LIBMYSQL_ENABLE_CLEARTEXT_PLUGIN</code></td> <td>Habilitar o plugin de autenticação <code class="literal">mysql_clear_password</code>; veja <a class="xref" href="cleartext-pluggable-authentication.html" title="8.4.1.3 Client-Side Cleartext Pluggable Authentication">Seção 8.4.1.3, “Autenticação Cleartext Pluggable no Lado do Cliente”</a>.</td> </tr>
<tr> <td><code class="literal">LIBMYSQL_PLUGIN_DIR</code></td> <td>Diretório onde procurar plugins do cliente.</td> </tr>
<tr> <td><code class="literal">LIBMYSQL_PLUGINS</code></td> <td>Plugins do cliente a pré-carregar.</td> </tr>
<tr> <td><code class="literal">MYSQL_DEBUG</code></td> <td>Opções de registro de depuração quando se está em depuração.</td> </tr>
<tr> <td><code class="literal">MYSQL_GROUP_SUFFIX</code></td> <td>Valor do sufixo do grupo de opções (como especificar <a class="link" href="option-file-options.html#option_general_defaults-group-suffix"><code class="option">--defaults-group-suffix</code></a>).</td> </tr>
<tr> <td><code class="literal">MYSQL_HISTFILE</code></td> <td>Caminho para o arquivo de histórico do <a class="link" href="mysql.html" title="6.5.1 mysql — The MySQL Command-Line Client"><span class="command"><strong>mysql</strong></span></a> history file. Se esta variável for definida, seu valor substitui o padrão para <code class="filename">$HOME/.mysql_history</code>.</td> </tr>
<tr> <td><code class="literal">MYSQL_HISTIGNORE</code></td> <td>Padrões que especificam instruções que o <a class="link" href="mysql.html" title="6.5.1 mysql — The MySQL Command-Line Client"><span class="command"><strong>mysql</strong></span></a> deve ignorar no <code class="filename">$HOME/.mysql_history</code>, ou <code class="literal">syslog</code> se <a class="link" href="mysql-command-options.html#option_mysql_syslog"><code class="option">--syslog</code></a> for fornecido.</td> </tr>
<tr> <td><code class="literal">MYSQL_HOME</code></td> <td>Caminho para o diretório onde o arquivo <code class="filename">my.cnf</code> específico do servidor reside.</td> </tr>
<tr> <td><code class="

Para obter informações sobre o arquivo de histórico do **mysql**, consulte a Seção 6.5.1.3, “Registro do cliente do **mysql”].

O uso de `MYSQL_PWD` para especificar uma senha do MySQL deve ser considerado *extremamente inseguro* e não deve ser usado. Algumas versões do **ps** incluem uma opção para exibir o ambiente dos processos em execução. Em alguns sistemas, se você definir `MYSQL_PWD`, sua senha é exposta a qualquer outro usuário que execute o **ps**. Mesmo em sistemas sem essa versão do **ps**, não é prudente assumir que não existem outros métodos pelos quais os usuários possam examinar os ambientes dos processos.

`MYSQL_PWD` está desatualizado a partir do MySQL 9.5; espere que ele seja removido em uma versão futura do MySQL.

`MYSQL_TEST_LOGIN_FILE` é o nome do caminho do arquivo de login (o arquivo criado pelo **mysql\_config\_editor**). Se não for definido, o valor padrão é o diretório `%APPDATA%\MySQL\.mylogin.cnf` no Windows e `$HOME/.mylogin.cnf` em sistemas que não são do Windows. Consulte a Seção 6.6.7, “**mysql\_config\_editor** — Ferramenta de configuração do MySQL”.

As variáveis `MYSQL_TEST_TRACE_DEBUG` e `MYSQL_TEST_TRACE_CRASH` controlam o plugin de registro do cliente do protocolo de teste, se o MySQL for compilado com esse plugin habilitado. Para mais informações, consulte o uso do plugin de registro do protocolo de teste.

Os valores padrão de `UMASK` e `UMASK_DIR` são `0640` e `0750`, respectivamente. O MySQL assume que o valor para `UMASK` ou `UMASK_DIR` está em octal se começar com um zero. Por exemplo, definir `UMASK=0600` é equivalente a `UMASK=384` porque 0600 octal é 384 decimal.

As variáveis `UMASK` e `UMASK_DIR`, apesar de seus nomes, são usadas como modos, não como máscaras:

* Se `UMASK` for definido, o **mysqld** usa `($UMASK | 0600)` como o modo para a criação de arquivos, para que os arquivos recém-criados tenham um modo na faixa de 0600 a 0666 (todos os valores em octal).

* Se `UMASK_DIR` estiver definido, o **mysqld** usa `($UMASK_DIR | 0700)` como o modo base para a criação de diretórios, que é então e-bitado com `~(~$UMASK & 0666)`, para que os diretórios recém-criados tenham um modo na faixa de 0700 a 0777 (todos os valores octal). A operação E pode remover permissões de leitura e escrita do modo do diretório, mas não as de execução.

Veja também a Seção B.3.3.1, “Problemas com Permissões de Arquivo”.

Pode ser necessário definir `PKG_CONFIG_PATH` se você usar **pkg-config** para construir programas do MySQL. Veja Construindo Programas de Cliente de API C Usando pkg-config.