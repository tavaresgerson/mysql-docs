## 5.1 O MySQL Server

[5.1.1 Configurando o Server](server-configuration.html)

[5.1.2 Padrões de Configuração do Server](server-configuration-defaults.html)

[5.1.3 Referência de Opções, System Variables e Status Variables do Server](server-option-variable-reference.html)

[5.1.4 Referência de System Variables do Server](server-system-variable-reference.html)

[5.1.5 Referência de Status Variables do Server](server-status-variable-reference.html)

[5.1.6 Opções de Comando do Server](server-options.html)

[5.1.7 System Variables do Server](server-system-variables.html)

[5.1.8 Usando System Variables](using-system-variables.html)

[5.1.9 Status Variables do Server](server-status-variables.html)

[5.1.10 SQL Modes do Server](sql-mode.html)

[5.1.11 Gerenciamento de Conexões](connection-management.html)

[5.1.12 Suporte a IPv6](ipv6-support.html)

[5.1.13 Suporte a Time Zone do MySQL Server](time-zone-support.html)

[5.1.14 Suporte a Ajuda Server-Side](server-side-help-support.html)

[5.1.15 Rastreamento de Estado de Sessão de Cliente pelo Server](session-state-tracking.html)

[5.1.16 O Processo de Shutdown do Server](server-shutdown.html)

[**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") é o MySQL Server. A discussão a seguir abrange estes tópicos de configuração do MySQL Server:

* Opções de Startup suportadas pelo server. Você pode especificar essas opções na linha de comando, através de arquivos de configuração, ou ambos.

* System Variables do Server. Essas variáveis refletem o estado atual e os valores das opções de startup, algumas das quais podem ser modificadas enquanto o server está em execução.

* Status Variables do Server. Essas variáveis contêm contadores e estatísticas sobre a operação em runtime.

* Como definir o SQL mode do server. Essa configuração modifica certos aspectos da sintaxe e da semântica SQL, por exemplo, para compatibilidade com código de outros Database Systems, ou para controlar o tratamento de erros em situações específicas.

* Como o server gerencia as conexões de cliente.
* Configurando e usando o suporte a IPv6.
* Configurando e usando o Time Zone support.
* Recursos de ajuda server-side.
* O processo de Shutdown do server. Existem considerações de performance e confiabilidade dependendo do tipo de tabela (transacional ou não transacional) e se você usa Replication.

Para listagens de variáveis e opções do MySQL Server que foram adicionadas, descontinuadas (deprecated) ou removidas no MySQL 5.7, veja [Section 1.4, “Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 5.7”](added-deprecated-removed.html "1.4 Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 5.7").

Nota

Nem todos os Storage Engines são suportados por todos os Binaries e configurações do MySQL Server. Para descobrir como determinar quais Storage Engines sua instalação do MySQL Server suporta, veja [Section 13.7.5.16, “SHOW ENGINES Statement”](show-engines.html "13.7.5.16 SHOW ENGINES Statement").