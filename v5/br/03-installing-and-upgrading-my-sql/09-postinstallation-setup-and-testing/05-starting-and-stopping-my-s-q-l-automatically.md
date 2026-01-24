### 2.9.5 Iniciar e parar o MySQL automaticamente

Esta seção discute os métodos para iniciar e parar o servidor MySQL.

Geralmente, você inicia o servidor **mysqld** de uma das seguintes maneiras:

- Invoque o **mysqld** diretamente. Isso funciona em qualquer plataforma.

- No Windows, você pode configurar um serviço MySQL que seja executado automaticamente quando o Windows for iniciado. Veja a Seção 2.3.4.8, “Iniciar o MySQL como um Serviço do Windows”.

- Em sistemas Unix e similares, você pode invocar o **mysqld_safe**, que tenta determinar as opções adequadas para o **mysqld** e, em seguida, executa-o com essas opções. Veja a Seção 4.3.2, “mysqld_safe — Script de inicialização do servidor MySQL”.

- Em sistemas Linux que suportam o systemd, você pode usá-lo para controlar o servidor. Veja a Seção 2.5.10, “Gerenciando o servidor MySQL com o systemd”.

- Em sistemas que utilizam diretórios de execução no estilo System V (ou seja, `/etc/init.d` e diretórios específicos de nível de execução), invoque **mysql.server**. Este script é usado principalmente no início e no desligamento do sistema. Ele geralmente é instalado com o nome `mysql`. O script **mysql.server** inicia o servidor invocando **mysqld_safe**. Veja a Seção 4.3.3, “mysql.server — Script de inicialização do servidor MySQL”.

- No macOS, instale um daemon launchd para habilitar o início automático do MySQL ao iniciar o sistema. O daemon inicia o servidor invocando **mysqld_safe**. Para obter detalhes, consulte a Seção 2.4.3, “Instalando um daemon de inicialização do MySQL”. Um Painel de Preferências do MySQL também oferece controle para iniciar e parar o MySQL através das Preferências do Sistema. Consulte a Seção 2.4.4, “Instalando e Usando o Painel de Preferências do MySQL”.

- No Solaris, use o sistema de gerenciamento de serviços (SMF) para iniciar e controlar o início do MySQL.

O systemd, os scripts **mysqld_safe** e **mysql.server**, o Solaris SMF e o item de inicialização do macOS (ou Painel de Preferências do MySQL) podem ser usados para iniciar o servidor manualmente ou automaticamente no momento do início do sistema. O systemd, **mysql.server** e o item de inicialização também podem ser usados para parar o servidor.

A tabela a seguir mostra quais grupos de opções agrupam os scripts de inicialização e de servidor lidos a partir de arquivos de opção.

**Tabela 2.15 Scripts de inicialização do MySQL e grupos de opções de servidor suportados**

<table summary="MySQL startup scripts and the server option groups they support."><col style="width: 20%"/><col style="width: 80%"/><thead><tr><th>Script</th><th>Option Groups</th></tr></thead><tbody><tr><td><span><strong>mysqld</strong></span></td><td><code>[mysqld]</code>, <code>[server]</code>, <code>[mysqld-<em><code>major_version</code></em>]</code></td></tr><tr><td><span><strong>mysqld_safe</strong></span></td><td><code>[mysqld]</code>, <code>[server]</code>, <code>[mysqld_safe]</code></td></tr><tr><td><span><strong>mysql.server</strong></span></td><td><code>[mysqld]</code>, <code>[mysql.server]</code>, <code>[server]</code></td></tr></tbody></table>

`[mysqld-major_version]` significa que grupos com nomes como `[mysqld-5.6]` e `[mysqld-5.7]` são lidos por servidores com versões 5.6.x, 5.7.x, e assim por diante. Esse recurso pode ser usado para especificar opções que só podem ser lidas por servidores dentro de uma determinada série de lançamentos.

Para compatibilidade reversa, o **mysql.server** também lê o grupo `[mysql_server]` e o **mysqld_safe** também lê o grupo `[safe_mysqld]`. Para ficar atualizado, você deve atualizar seus arquivos de opções para usar os grupos `[mysql.server]` e `[mysqld_safe]` em vez disso.

Para obter mais informações sobre os arquivos de configuração do MySQL e sua estrutura e conteúdo, consulte a Seção 4.2.2.2, “Usando arquivos de opção”.
