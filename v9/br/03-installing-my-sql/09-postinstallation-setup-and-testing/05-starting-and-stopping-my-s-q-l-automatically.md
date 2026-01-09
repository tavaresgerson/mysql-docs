### 2.9.5 Iniciar e Parar o MySQL Automaticamente

Esta seção discute os métodos para iniciar e parar o servidor MySQL.

Geralmente, você inicia o servidor **mysqld** de uma das seguintes maneiras:

* Inicie o **mysqld** diretamente. Isso funciona em qualquer plataforma.

* No Windows, você pode configurar um serviço MySQL que seja executado automaticamente quando o Windows for iniciado. Veja a Seção 2.3.3.8, “Iniciando o MySQL como um Serviço do Windows”.

* Em sistemas Unix e semelhantes ao Unix, você pode iniciar o **mysqld_safe**, que tenta determinar as opções adequadas para o **mysqld** e, em seguida, executa-o com essas opções. Veja a Seção 6.3.2, “mysqld_safe — Script de Inicialização do Servidor MySQL”.

* Em sistemas Linux que suportam systemd, você pode usá-lo para controlar o servidor. Veja a Seção 2.5.9, “Gerenciando o Servidor MySQL com systemd”.

* Em sistemas que usam diretórios de execução estilo System V (ou seja, `/etc/init.d` e diretórios específicos de nível de execução), inicie o **mysql.server**. Esse script é usado principalmente no início e no desligamento do sistema. Ele geralmente é instalado com o nome `mysql`. O script **mysql.server** inicia o servidor invocando o **mysqld_safe**. Veja a Seção 6.3.3, “mysql.server — Script de Inicialização do Servidor MySQL”.

* No macOS, instale um daemon launchd para habilitar o início automático do MySQL no início do sistema. O daemon inicia o servidor invocando o **mysqld_safe**. Para detalhes, veja a Seção 2.4.3, “Instalando e Usando o Daemon de Lançamento MySQL”. Um Painel de Preferências MySQL também fornece controle para iniciar e parar o MySQL através das Preferências do Sistema. Veja a Seção 2.4.4, “Instalando e Usando o Painel de Preferências MySQL”.

* No Solaris, use a estrutura de gerenciamento de serviços (SMF) para iniciar e controlar o início do MySQL.

systemd, os scripts **mysqld_safe** e **mysql.server**, o Solaris SMF e o item de inicialização do macOS (ou Painel de Preferências do MySQL) podem ser usados para iniciar o servidor manualmente ou automaticamente no momento do inicialização do sistema. systemd, **mysql.server** e o item de inicialização também podem ser usados para parar o servidor.

A tabela a seguir mostra quais opções agrupam os scripts de inicialização do servidor e os grupos de opções do servidor lidos a partir de arquivos de opções.

**Tabela 2.16 Scripts de Inicialização do MySQL e Grupos de Opções de Servidor Suportado**

<table summary="Scripts de inicialização do MySQL e os grupos de opções de servidor que eles suportam."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Script</th> <th>Grupos de Opções</th> </tr></thead><tbody><tr> <td><span><strong>mysqld</strong></span></td> <td><code>[mysqld]</code>, <code>[server]</code>, <code>[mysqld-<em class="replaceable"><code>major_version</code></em>]</code></td> </tr><tr> <td><span><strong>mysqld_safe</strong></span></td> <td><code>[mysqld]</code>, <code>[server]</code>, <code>[mysqld_safe]</code></td> </tr><tr> <td><span><strong>mysql.server</strong></span></td> <td><code>[mysqld]</code>, <code>[mysql.server]</code>, <code>[server]</code></td> </tr></tbody></table>

`[mysqld-major_version]` significa que grupos com nomes como `[mysqld-9.4]` e `[mysqld-9.5]` são lidos por servidores com versões 9.4.x, 9.5.x, e assim por diante. Esse recurso pode ser usado para especificar opções que só podem ser lidas por servidores dentro de uma determinada série de lançamentos.

Para compatibilidade reversa, **mysql.server** também lê o grupo `[mysql_server]` e **mysqld_safe** também lê o grupo `[safe_mysqld]`. Para estar atualizado, você deve atualizar seus arquivos de opções para usar os grupos `[mysql.server]` e `[mysqld_safe]` em vez disso.

Para mais informações sobre arquivos de configuração do MySQL e sua estrutura e conteúdo, consulte a Seção 6.2.2.2, “Usando arquivos de opção”.