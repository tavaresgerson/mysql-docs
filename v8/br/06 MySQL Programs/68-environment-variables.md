## 6.9 Variáveis de Ambiente

Esta seção lista as variáveis de ambiente que são usadas diretamente ou indiretamente pelo MySQL. A maioria dessas variáveis também pode ser encontrada em outros lugares deste manual.

As opções na linha de comando têm precedência sobre os valores especificados em arquivos de opção e variáveis de ambiente, e os valores em arquivos de opção têm precedência sobre os valores em variáveis de ambiente. Em muitos casos, é preferível usar um arquivo de opção em vez de variáveis de ambiente para modificar o comportamento do MySQL. Consulte a Seção 6.2.2.2, “Usando Arquivos de Opção”.

<table>
   <thead>
      <tr>
         <th>Variável</th>
         <th>Descrição</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>AUTHENTICATION_KERBEROS_CLIENT_LOG</code></td>
         <td>Nível de registro de autenticação Kerberos.</td>
      </tr>
      <tr>
         <td><code>AUTHENTICATION_LDAP_CLIENT_LOG</code></td>
         <td>Nível de registro de autenticação LDAP no lado do cliente.</td>
      </tr>
      <tr>
         <td><code>AUTHENTICATION_PAM_LOG</code></td>
         <td>Configurações de registro de depuração do plugin de autenticação PAM.</td>
      </tr>
      <tr>
         <td><code>CC</code></td>
         <td>Nome do compilador C (para executar o <code>CMake</code>).</td>
      </tr>
      <tr>
         <td><code>CXX</code></td>
         <td>Nome do compilador C++ (para executar o <code>CMake</code>).</td>
      </tr>
      <tr>
         <td><code>CC</code></td>
         <td>Nome do compilador C (para executar o <code>CMake</code>).</td>
      </tr>
      <tr>
         <td><code>DBI_USER</code></td>
         <td>Nome de usuário padrão para o DBI do Perl.</td>
      </tr>
      <tr>
         <td><code>DBI_TRACE</code></td>
         <td>Opções de registro de depuração para o DBI do Perl.</td>
      </tr>
      <tr>
         <td><code>HOME</code></td>
         <td>O caminho padrão para o arquivo de histórico do <code>mysql</code> é <code>$HOME/.mysql_history</code>.</td>
      </tr>
      <tr>
         <td><code>LD_RUN_PATH</code></td>
         <td>Localização do arquivo <code>libmysqlclient.so</code>.</td>
      </tr>
      <tr>
         <td><code>LIBMYSQL_ENABLE_CLEARTEXT_PLUGIN</code></td>
         <td>Habilitar o plugin de autenticação Cleartext; consulte a Seção 8.4.1.4, “Autenticação Pluggable de Texto Claro no Lado do Cliente”.</td>
      </tr>
      <tr>
         <td><code>LIBMYSQL_PLUGIN_DIR</code></td>
         <td>Diretório onde procurar por plugins do cliente.</td>
      </tr>
      <tr>
         <td><code>LIBMYSQL_PLUGINS</code></td>
         <td>Plugins do cliente a pré-carregar.</td>
      </tr>
      <tr>
         <td><code>MYSQL_DEBUG</code></td>
         <td>Opções de registro de depuração ao depurar.</td>
      </tr>
      <tr>
         <td><code>MYSQL_GROUP_SUFFIX</code></td>
         <td>Valor do sufixo do grupo de opções (como especificar <code>--defaults-group-suffix</code>).</td>
      </tr>
      <tr>
         <td><code>MYSQL_HISTFILE</code></td>
         <td>Caminho para o arquivo de histórico do <code>mysql</code>. Se esta variável for definida, seu valor substitui o padrão para <code>$HOME/.mysql_history</code>.</td>
      </tr>
      <tr>
         <td><code>MYSQL_HISTIGNORE</code></td>
         <td>Padrões que especificam instruções que o <code>mysql</code> não deve registrar no <code>$HOME/.mysql_history</code>, ou no <code>syslog</code> se a opção <code>--syslog</code> for fornecida.</td>
      </tr>
      <tr>
         <td><code>MYSQL_HOME</code></td>
         <td>Caminho para o diretório onde reside o arquivo <code>my.cnf</code> específico do servidor.</td>
      </tr>
      <tr>
         <td><code>MYSQL_HOST</code></td>
         <td>Nome de host padrão usado pelo cliente de linha de comando do <code>mysql</code>.</td>
      </tr>
      <tr>
         <td><code>MYSQL_PS1</code></td>
         <td>Prompt de comando a ser usado no cliente de linha de comando do <code>mysql</code>.</td>
      </tr>
      <tr>
         <td><code>MYSQL_PWD</code></td>
         <td>Senha padrão para a conexão com o <code>mysqld</code>. O uso desta senha é inseguro. Consulte a nota a seguir.</td>
      </tr>
      <tr>
         <td><code>MYSQL_TCP_PORT</code></td>
         <td>Número de porta TCP/IP padrão.</td>
      </tr>
      <tr>
         <td><code>MYSQL_TEST_LOGIN_FILE</code></td>
         <td>Nome do arquivo de caminho de login <code>.mylogin.cnf</code>.</td>
      </tr>
      <tr>
         <td><code>MYSQL_TEST_TRACE_CRASH</code></td>
         <td>Se o plugin de registro de depuração do protocolo de teste deve causar falha no cliente. Consulte a nota a seguir.</td>
      </tr>
      <tr>
         <td><code>MYSQL_TEST_TRACE_DEBUG</code></td>
         <td>Se o plugin de registro de depuração do protocolo de teste deve produzir saída. Consulte a nota a seguir.</td>
      </tr>
      <tr>
         <td><code>MYSQL_UNIX_PORT</code></td>

Para obter informações sobre o arquivo de histórico `mysql`, consulte a Seção 6.5.1.3, “Registro do cliente do MySQL”.

O uso de `MYSQL_PWD` para especificar uma senha do MySQL deve ser considerado *extremamente inseguro* e não deve ser usado. Algumas versões do `ps` incluem uma opção para exibir o ambiente dos processos em execução. Em alguns sistemas, se você definir `MYSQL_PWD`, sua senha é exposta a qualquer outro usuário que execute o `ps`. Mesmo em sistemas sem essa versão do `ps`, não é aconselhável assumir que não existem outros métodos pelos quais os usuários possam examinar os ambientes dos processos.

`MYSQL_PWD` está desatualizado a partir do MySQL 8.4; espere que ele seja removido em uma versão futura do MySQL.

`MYSQL_TEST_LOGIN_FILE` é o nome do caminho do arquivo de caminho de login (o arquivo criado pelo `mysql_config_editor`). Se não for definido, o valor padrão é o diretório `%APPDATA%\MySQL\.mylogin.cnf` no Windows e `$HOME/.mylogin.cnf` em sistemas não do Windows. Consulte a Seção 6.6.7, “mysql_config_editor — Ferramenta de configuração do MySQL”.

As variáveis `MYSQL_TEST_TRACE_DEBUG` e `MYSQL_TEST_TRACE_CRASH` controlam o plugin de registro do cliente do protocolo de teste, se o MySQL for compilado com esse plugin habilitado. Para mais informações, consulte Usar o plugin de registro do protocolo de teste.

Os valores padrão de `UMASK` e `UMASK_DIR` são `0640` e `0750`, respectivamente. O MySQL assume que o valor para `UMASK` ou `UMASK_DIR` está em octal se começar com um zero. Por exemplo, definir `UMASK=0600` é equivalente a `UMASK=384` porque 0600 octal é 384 decimal.

As variáveis `UMASK` e `UMASK_DIR`, apesar de seus nomes, são usadas como modos, não máscaras:

* Se `UMASK` estiver definido, o `mysqld` usa `($UMASK | 0600)` como o modo para a criação de arquivos, de modo que os arquivos recém-criados tenham um modo na faixa de 0600 a 0666 (todos os valores octal).
* Se `UMASK_DIR` estiver definido, o `mysqld` usa `($UMASK_DIR | 0700)` como o modo base para a criação de diretórios, que é então e-bitado com `~(~$UMASK & 0666)`, de modo que os diretórios recém-criados tenham um modo na faixa de 0700 a 0777 (todos os valores octal). A operação de E-bitação pode remover permissões de leitura e escrita do modo do diretório, mas não as de execução.

Veja também a Seção B.3.3.1, “Problemas com Permissões de Arquivos”.
* Se você usar `pkg-config` para construir programas do MySQL, pode ser necessário definir `PKG_CONFIG_PATH`. Consulte Construção de Programas de Cliente de API C Usando pkg-config.