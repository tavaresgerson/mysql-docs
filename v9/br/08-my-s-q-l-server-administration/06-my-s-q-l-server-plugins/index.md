## 7.6 Plugins do Servidor MySQL

7.6.1 Instalando e Desinstalando Plugins

7.6.2 Obtendo Informações sobre Plugins do Servidor

7.6.3 Pool de Fios do MySQL Enterprise

7.6.4 O Plugin de Reescrita de Consultas Rewriter Query

7.6.5 O Plugin ddl\_rewriter

7.6.6 O Plugin Clone

7.6.7 O Plugin Proxy Bridge Keyring

7.6.8 Serviços de Plugins MySQL

O MySQL suporta uma API de plugins que permite a criação de plugins do servidor. Os plugins podem ser carregados no início do servidor ou carregados e descarregados em tempo de execução sem reiniciar o servidor. Os plugins suportados por essa interface incluem, mas não estão limitados a, motores de armazenamento, tabelas do `INFORMATION_SCHEMA`, plugins de processamento de texto completo e extensões do servidor.

As distribuições do MySQL incluem vários plugins que implementam extensões do servidor:

* Plugins para autenticar tentativas de clientes de se conectarem ao MySQL Server. Os plugins estão disponíveis para vários protocolos de autenticação. Veja a Seção 8.2.17, “Autenticação Conectada”.

* Um plugin de controle de conexão que permite que os administradores introduzam um atraso crescente após um certo número de tentativas consecutivas de conexão de clientes falhas. Veja a Seção 8.4.3, “Plugins de Controle de Conexão”.

  O plugin de controle de conexão está desatualizado e sujeito à remoção em uma futura versão do MySQL. Os usuários são incentivados a migrar para o componente Controle de Conexão; veja a Seção 8.4.2, “O Componente Controle de Conexão”, para mais informações.

* Um plugin de validação de senha implementa políticas de força de senha e avalia a força de senhas potenciais. Veja a Seção 8.4.4, “O Componente Validação de Senha”.

* Os plugins de replicação semiesincronizada implementam uma interface para as capacidades de replicação que permitem que a fonte prossiga enquanto pelo menos uma réplica responder a cada transação. Veja a Seção 19.4.10, “Replicação Semiesincronizada”.

* A Replicação em Grupo permite que você crie um serviço MySQL distribuído altamente disponível em um grupo de instâncias de servidor MySQL, com consistência de dados, detecção e resolução de conflitos e serviços de participação em grupo todos embutidos. Veja o Capítulo 20, *Replicação em Grupo*.

* A Edição Empresarial do MySQL inclui um plugin de pool de threads que gerencia os threads de conexão para aumentar o desempenho do servidor, gerenciando eficientemente os threads de execução de instruções para um grande número de conexões de clientes. Veja a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

* A Edição Empresarial do MySQL inclui um plugin de auditoria para monitoramento e registro de atividades de conexão e consulta. Veja a Seção 8.4.6, “MySQL Enterprise Audit”.

* A Edição Empresarial do MySQL inclui um plugin de firewall que implementa um firewall de nível de aplicativo para permitir que os administradores de banco de dados permitam ou negam a execução de instruções SQL com base na correspondência com listas de permissões de padrões de instruções aceitos. Veja a Seção 8.4.8, “MySQL Enterprise Firewall”.

* Os plugins de reescrita de consultas examinam as instruções recebidas pelo MySQL Server e, possivelmente, as reescrevem antes de o servidor executá-las. Veja a Seção 7.6.4, “O Plugin de Reescrita de Consultas Rewriter”, e a Seção 7.6.5, “O Plugin ddl\_rewriter”.

* Tokens de Versão permite a criação e sincronização de tokens de servidor que as aplicações podem usar para evitar o acesso a dados incorretos ou desatualizados. Tokens de Versão é baseado em uma biblioteca de plugins que implementa um plugin `version_tokens` e um conjunto de funções carregáveis. Veja Tokens de Versão.

* Os plugins de cartela de identificação fornecem armazenamento seguro para informações sensíveis. Veja a Seção 8.4.5, “O MySQL Keyring”.

* O X Plugin estende o MySQL Server para que ele possa funcionar como um repositório de documentos. A execução do X Plugin permite que o MySQL Server comunique-se com clientes usando o Protocolo X, que foi projetado para expor as capacidades de armazenamento compatíveis com ACID do MySQL como um repositório de documentos. Veja a Seção 22.5, “X Plugin”.

* O Clone permite clonar dados `InnoDB` de uma instância de servidor MySQL local ou remota. Veja a Seção 7.6.6, “O Plugin Clone”.

* Os plugins de framework de teste testam os serviços do servidor. Para obter informações sobre esses plugins, consulte a seção Plugins para Serviços de Teste do Doxygen da documentação do MySQL Server, disponível em https://dev.mysql.com/doc/index-other.html.

As seções a seguir descrevem como instalar e desinstalar plugins e como determinar em tempo de execução quais plugins estão instalados e obter informações sobre eles. Para obter informações sobre a escrita de plugins, consulte A API de Plugin do MySQL.