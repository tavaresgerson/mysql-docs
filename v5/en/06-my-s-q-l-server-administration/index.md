# Capítulo 5 Administração do Servidor MySQL

**Sumário**

[5.1 O Servidor MySQL](mysqld-server.html) :   [5.1.1 Configurando o Servidor](server-configuration.html)

    [5.1.2 Padrões de Configuração do Servidor](server-configuration-defaults.html)

    [5.1.3 Referência de Opções do Servidor, Variáveis de Sistema e Variáveis de Status](server-option-variable-reference.html)

    [5.1.4 Referência de Variáveis de Sistema do Servidor](server-system-variable-reference.html)

    [5.1.5 Referência de Variáveis de Status do Servidor](server-status-variable-reference.html)

    [5.1.6 Opções de Comando do Servidor](server-options.html)

    [5.1.7 Variáveis de Sistema do Servidor](server-system-variables.html)

    [5.1.8 Usando Variáveis de Sistema](using-system-variables.html)

    [5.1.9 Variáveis de Status do Servidor](server-status-variables.html)

    [5.1.10 Modos SQL do Servidor](sql-mode.html)

    [5.1.11 Gerenciamento de Conexões](connection-management.html)

    [5.1.12 Suporte a IPv6](ipv6-support.html)

    [5.1.13 Suporte a Fuso Horário do Servidor MySQL](time-zone-support.html)

    [5.1.14 Suporte a Ajuda do Lado do Servidor](server-side-help-support.html)

    [5.1.15 Rastreamento de Estado de Sessão do Cliente pelo Servidor](session-state-tracking.html)

    [5.1.16 O Processo de Desligamento do Servidor](server-shutdown.html)

[5.2 O Diretório de Dados do MySQL](data-directory.html)

[5.3 O Database de Sistema mysql](system-schema.html)

[5.4 Logs do Servidor MySQL](server-logs.html) :   [5.4.1 Selecionando Destinos de Saída para o General Query Log e Slow Query Log](log-destinations.html)

    [5.4.2 O Error Log](error-log.html)

    [5.4.3 O General Query Log](query-log.html)

    [5.4.4 O Binary Log](binary-log.html)

    [5.4.5 O Slow Query Log](slow-query-log.html)

    [5.4.6 O DDL Log](ddl-log.html)

    [5.4.7 Manutenção de Log do Servidor](log-file-maintenance.html)

[5.5 Plugins do Servidor MySQL](server-plugins.html) :   [5.5.1 Instalando e Desinstalando Plugins](plugin-loading.html)

    [5.5.2 Obtendo Informações de Plugins do Servidor](obtaining-plugin-information.html)

    [5.5.3 Thread Pool do MySQL Enterprise](thread-pool.html)

    [5.5.4 O Plugin de Reescrita de Query Rewriter](rewriter-query-rewrite-plugin.html)

    [5.5.5 Tokens de Versão](version-tokens.html)

    [5.5.6 Serviços de Plugin do MySQL](plugin-services.html)

[5.6 Funções Carregáveis do Servidor MySQL](server-loadable-functions.html) :   [5.6.1 Instalando e Desinstalando Funções Carregáveis](function-loading.html)

    [5.6.2 Obtendo Informações Sobre Funções Carregáveis](obtaining-loadable-function-information.html)

[5.7 Executando Múltiplas Instâncias MySQL em Uma Máquina](multiple-servers.html) :   [5.7.1 Configurando Múltiplos Diretórios de Dados](multiple-data-directories.html)

    [5.7.2 Executando Múltiplas Instâncias MySQL no Windows](multiple-windows-servers.html)

    [5.7.3 Executando Múltiplas Instâncias MySQL no Unix](multiple-unix-servers.html)

    [5.7.4 Usando Programas Cliente em um Ambiente Multi-Servidor](multiple-server-clients.html)

[5.8 Debugging do MySQL](debugging-mysql.html) :   [5.8.1 Debugging de um Servidor MySQL](debugging-server.html)

    [5.8.2 Debugging de um Cliente MySQL](debugging-client.html)

    [5.8.3 O Pacote DBUG](dbug-package.html)

    [5.8.4 Rastreando mysqld Usando DTrace](dba-dtrace-server.html)

O Servidor MySQL ([**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL")) é o programa principal que realiza a maior parte do trabalho em uma instalação MySQL. Este capítulo fornece uma visão geral do Servidor MySQL e cobre a administração geral do servidor:

* Configuração do Servidor
* O diretório de dados, particularmente o Database de sistema `mysql`

* Os arquivos de log do servidor
* Gerenciamento de múltiplos servidores em uma única máquina

Para informações adicionais sobre tópicos administrativos, consulte também:

* [Capítulo 6, *Segurança*](security.html "Capítulo 6 Segurança")
* [Capítulo 7, *Backup e Recuperação*](backup-and-recovery.html "Capítulo 7 Backup e Recuperação")
* [Capítulo 16, *Replicação*](replication.html "Capítulo 16 Replicação")
