### 2.9.5 Iniciando e Parando o MySQL Automaticamente

Esta seção discute métodos para iniciar e parar o MySQL Server.

Geralmente, você inicia o **mysqld** server de uma destas maneiras:

* Invocando o **mysqld** diretamente. Isso funciona em qualquer plataforma.

* No Windows, você pode configurar um serviço MySQL que é executado automaticamente quando o Windows inicia. Consulte a Seção 2.3.4.8, “Iniciando o MySQL como um Serviço do Windows”.

* Em sistemas Unix e semelhantes ao Unix, você pode invocar o **mysqld_safe**, que tenta determinar as Options apropriadas para o **mysqld** e, em seguida, o executa com essas Options. Consulte a Seção 4.3.2, “mysqld_safe — Script de Inicialização do MySQL Server”.

* Em sistemas Linux que suportam systemd, você pode usá-lo para controlar o Server. Consulte a Seção 2.5.10, “Gerenciando o MySQL Server com systemd”.

* Em sistemas que usam diretórios de execução no estilo System V (ou seja, `/etc/init.d` e diretórios específicos de run-level), invoque o **mysql.server**. Este script é usado principalmente na inicialização e desligamento do sistema (startup and shutdown). Ele geralmente é instalado com o nome `mysql`. O script **mysql.server** inicia o Server invocando o **mysqld_safe**. Consulte a Seção 4.3.3, “mysql.server — Script de Inicialização do MySQL Server”.

* No macOS, instale um launchd daemon para habilitar a inicialização automática do MySQL no startup do sistema. O daemon inicia o Server invocando o **mysqld_safe**. Para detalhes, consulte a Seção 2.4.3, “Instalando um MySQL Launch Daemon”. Um MySQL Preference Pane também fornece controle para iniciar e parar o MySQL através das System Preferences. Consulte a Seção 2.4.4, “Instalando e Usando o MySQL Preference Pane”.

* No Solaris, use a estrutura de gerenciamento de serviços (service management framework - SMF) para iniciar e controlar o startup do MySQL.

O systemd, os scripts **mysqld_safe** e **mysql.server**, o SMF do Solaris e o Startup Item do macOS (ou MySQL Preference Pane) podem ser usados para iniciar o Server manualmente ou automaticamente no momento do startup do sistema. O systemd, **mysql.server** e o Startup Item também podem ser usados para parar o Server.

A tabela a seguir mostra quais grupos de Options o Server e os scripts de inicialização leem dos arquivos de Option.

**Tabela 2.15 Scripts de Inicialização do MySQL e Grupos de Options do Server Suportados**

<table summary="Scripts de inicialização do MySQL e os grupos de Options do Server que eles suportam."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Script</th> <th>Grupos de Options</th> </tr></thead><tbody><tr> <td><span><strong>mysqld</strong></span></td> <td><code>[mysqld]</code>, <code>[server]</code>, <code>[mysqld-<em><code>major_version</code></em>]</code></td> </tr><tr> <td><span><strong>mysqld_safe</strong></span></td> <td><code>[mysqld]</code>, <code>[server]</code>, <code>[mysqld_safe]</code></td> </tr><tr> <td><span><strong>mysql.server</strong></span></td> <td><code>[mysqld]</code>, <code>[mysql.server]</code>, <code>[server]</code></td> </tr> </tbody></table>

`[mysqld-major_version]` significa que grupos com nomes como `[mysqld-5.6]` e `[mysqld-5.7]` são lidos por Servers com as versões 5.6.x, 5.7.x, e assim por diante. Este recurso pode ser usado para especificar Options que podem ser lidas apenas por Servers dentro de uma determinada série de release.

Para compatibilidade retroativa (backward compatibility), o **mysql.server** também lê o grupo `[mysql_server]` e o **mysqld_safe** também lê o grupo `[safe_mysqld]`. Para estar atualizado, você deve atualizar seus arquivos de Option para usar os grupos `[mysql.server]` e `[mysqld_safe]` em vez disso.

Para mais informações sobre arquivos de configuração do MySQL e sua estrutura e conteúdo, consulte a Seção 4.2.2.2, “Usando Arquivos de Option”.
