## 5.5 Plugins do MySQL Server

5.5.1 Instalação e Desinstalação de Plugins

5.5.2 Obter informações do plugin do servidor

5.5.3 Pool de Fios do MySQL Enterprise

5.5.4 O Plugin de Reescrita de Consultas do Reescritor

Tokens da versão 5.5.5

5.5.6 Serviços de Plugin do MySQL

O MySQL suporta uma API de plugins que permite a criação de plugins do servidor. Os plugins podem ser carregados no início do servidor ou carregados e descarregados durante a execução sem precisar reiniciar o servidor. Os plugins suportados por essa interface incluem, mas não estão limitados a, motores de armazenamento, tabelas do `INFORMATION_SCHEMA`, plugins de analisador de texto completo, suporte a particionamento e extensões do servidor.

As distribuições do MySQL incluem vários plugins que implementam extensões do servidor:

- Plugins para autenticação de tentativas de conexão de clientes com o MySQL Server. Os plugins estão disponíveis para vários protocolos de autenticação. Consulte Seção 6.2.13, “Autenticação Personalizável”.

- Um plugin de controle de conexão que permite que os administradores introduzam um atraso crescente após um certo número de tentativas consecutivas de conexão do cliente falhar. Veja Seção 6.4.2, “Plugins de Controle de Conexão”.

- Um plugin de validação de senha implementa políticas de força de senha e avalia a força de senhas potenciais. Veja Seção 6.4.3, “O Plugin de Validação de Senha”.

- Os plugins de replicação semiesincronizada implementam uma interface para as capacidades de replicação que permitem que a fonte prossiga enquanto pelo menos uma réplica responder a cada transação. Veja Seção 16.3.9, “Replicação Semiesincronizada”.

- A Replicação em Grupo permite que você crie um serviço MySQL distribuído altamente disponível em um grupo de instâncias do servidor MySQL, com consistência de dados, detecção e resolução de conflitos e serviços de participação em grupo integrados. Veja \[Capítulo 17, *Replicação em Grupo*] (group-replication.html).

- A Edição Empresarial do MySQL inclui um plugin de pool de threads que gerencia os threads de conexão para aumentar o desempenho do servidor, gerenciando eficientemente os threads de execução de instruções para um grande número de conexões de clientes. Veja Seção 5.5.3, “MySQL Enterprise Thread Pool”.

- A Edição Empresarial do MySQL inclui um plugin de auditoria para monitoramento e registro de atividades de conexão e consulta. Consulte Seção 6.4.5, “Auditoria do MySQL Empresarial”.

- A Edição Empresarial do MySQL inclui um plugin de firewall que implementa um firewall de nível de aplicativo para permitir que os administradores de banco de dados permitam ou negam a execução de instruções SQL com base na correspondência com listas de padrões de instruções aceitos. Consulte Seção 6.4.6, “Firewall Empresarial do MySQL”.

- Um plugin de reescrita de consultas examina as declarações recebidas pelo MySQL Server e, possivelmente, as reescreve antes de o servidor executá-las. Veja Seção 5.5.4, “O Plugin de Reescrita de Consultas de Reescrita”.

- O Version Tokens permite a criação e sincronização de tokens do servidor que as aplicações podem usar para evitar o acesso a dados incorretos ou desatualizados. O Version Tokens é baseado em uma biblioteca de plugins que implementa um plugin `version_tokens` e um conjunto de funções carregáveis. Veja Seção 5.5.5, “Version Tokens”.

- Os plugins de cartela de identificação fornecem armazenamento seguro para informações sensíveis. Veja Seção 6.4.4, “A Cartela de Identificação MySQL”.

- O X Plugin estende o MySQL Server para que ele possa funcionar como um repositório de documentos. Ao executar o X Plugin, o MySQL Server pode se comunicar com clientes usando o Protocolo X, que foi projetado para expor as capacidades de armazenamento compatíveis com ACID do MySQL como um repositório de documentos. Veja Seção 19.4, “X Plugin”.

- Os plugins de framework de testes testam os serviços do servidor. Para obter informações sobre esses plugins, consulte a seção Plugins para Serviços de Plugin de Teste da documentação do MySQL Server Doxygen, disponível em https://dev.mysql.com/doc/index-other.html.

As seções a seguir descrevem como instalar e desinstalar plugins e como determinar em tempo de execução quais plugins estão instalados e obter informações sobre eles. Para informações sobre como escrever plugins, consulte A API de Plugin do MySQL.
