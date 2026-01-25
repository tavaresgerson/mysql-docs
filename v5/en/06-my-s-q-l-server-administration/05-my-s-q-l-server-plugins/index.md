## 5.5 Plugins do MySQL Server

[5.5.1 Instalando e Desinstalando Plugins](plugin-loading.html)

[5.5.2 Obtendo Informações de Plugins do Server](obtaining-plugin-information.html)

[5.5.3 Thread Pool do MySQL Enterprise](thread-pool.html)

[5.5.4 O Plugin de Reescrita de Query Rewriter](rewriter-query-rewrite-plugin.html)

[5.5.5 Version Tokens](version-tokens.html)

[5.5.6 Serviços de Plugin do MySQL](plugin-services.html)

O MySQL suporta uma API de plugin que permite a criação de plugins do Server. Os Plugins podem ser carregados na inicialização do Server, ou carregados e descarregados em tempo de execução (runtime) sem reiniciar o Server. Os plugins suportados por esta interface incluem, mas não se limitam a, storage engines, tabelas `INFORMATION_SCHEMA`, plugins de parser full-text, suporte a particionamento e extensões do Server.

As distribuições do MySQL incluem vários plugins que implementam extensões do Server:

* Plugins para autenticar tentativas de Clients de se conectarem ao MySQL Server. Plugins estão disponíveis para diversos protocolos de autenticação. Consulte [Seção 6.2.13, “Autenticação Pluggable”](pluggable-authentication.html "6.2.13 Autenticação Pluggable").

* Um plugin de connection control que permite aos administradores introduzir um atraso crescente após um certo número de tentativas consecutivas falhas de conexão de Client. Consulte [Seção 6.4.2, “Plugins de Connection Control”](connection-control-plugin.html "6.4.2 Plugins de Connection Control").

* Um plugin de validação de senha (password-validation plugin) implementa políticas de força de senha e avalia a força de senhas potenciais. Consulte [Seção 6.4.3, “O Plugin de Validação de Senha”](validate-password.html "6.4.3 O Plugin de Validação de Senha").

* Plugins de Semisynchronous Replication implementam uma interface para recursos de Replication que permitem que a source prossiga desde que pelo menos uma réplica tenha respondido a cada transaction. Consulte [Seção 16.3.9, “Semisynchronous Replication”](replication-semisync.html "16.3.9 Semisynchronous Replication").

* O Group Replication permite criar um serviço MySQL distribuído de alta disponibilidade em um grupo de instâncias do MySQL Server, com consistência de dados, detecção e resolução de conflitos, e serviços de associação de grupo (group membership) todos integrados. Consulte [Capítulo 17, *Group Replication*](group-replication.html "Capítulo 17 Group Replication").

* O MySQL Enterprise Edition inclui um plugin de Thread Pool que gerencia connection threads para aumentar a performance do Server, gerenciando eficientemente os statement execution threads para um grande número de conexões de Client. Consulte [Seção 5.5.3, “Thread Pool do MySQL Enterprise”](thread-pool.html "5.5.3 Thread Pool do MySQL Enterprise").

* O MySQL Enterprise Edition inclui um plugin de audit para monitoramento e logging de atividades de conexão e Query. Consulte [Seção 6.4.5, “MySQL Enterprise Audit”](audit-log.html "6.4.5 MySQL Enterprise Audit").

* O MySQL Enterprise Edition inclui um plugin de firewall que implementa um firewall de nível de aplicação para permitir que administradores de Database permitam ou neguem a execução de SQL statements com base na correspondência contra allowlists (listas de permissão) de padrões de statement aceitos. Consulte [Seção 6.4.6, “MySQL Enterprise Firewall”](firewall.html "6.4.6 MySQL Enterprise Firewall").

* Um plugin de Query Rewrite examina statements recebidos pelo MySQL Server e possivelmente os reescreve antes que o Server os execute. Consulte [Seção 5.5.4, “O Plugin de Reescrita de Query Rewriter”](rewriter-query-rewrite-plugin.html "5.5.4 O Plugin de Reescrita de Query Rewriter").

* Version Tokens permite a criação e sincronização em torno de server tokens que as aplicações podem usar para prevenir o acesso a dados incorretos ou desatualizados. Version Tokens é baseado em uma plugin library que implementa um plugin `version_tokens` e um conjunto de funções carregáveis. Consulte [Seção 5.5.5, “Version Tokens”](version-tokens.html "5.5.5 Version Tokens").

* Plugins Keyring fornecem armazenamento seguro para informações sensíveis. Consulte [Seção 6.4.4, “O Keyring do MySQL”](keyring.html "6.4.4 O Keyring do MySQL").

* O X Plugin estende o MySQL Server para que ele possa funcionar como um document store. A execução do X Plugin permite que o MySQL Server se comunique com Clients usando o X Protocol, que é projetado para expor as capacidades de armazenamento compatíveis com ACID do MySQL como um document store. Consulte [Seção 19.4, “X Plugin”](x-plugin.html "19.4 X Plugin").

* Plugins de test framework testam os serviços do Server. Para obter informações sobre esses plugins, consulte a seção Plugins for Testing Plugin Services da documentação Doxygen do MySQL Server, disponível em [https://dev.mysql.com/doc/index-other.html](/doc/index-other.html).

As seções a seguir descrevem como instalar e desinstalar plugins, e como determinar em tempo de execução (runtime) quais plugins estão instalados e obter informações sobre eles. Para obter informações sobre a escrita de plugins, consulte [A API de Plugin do MySQL](/doc/extending-mysql/5.7/en/plugin-api.html).