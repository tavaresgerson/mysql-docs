## 7.6 Plugins do Servidor MySQL

O MySQL suporta uma API de plugins que permite a criação de plugins de servidor. Os plugins podem ser carregados no início do servidor, ou carregados e descarregados no tempo de execução sem reiniciar o servidor. Os plugins suportados por esta interface incluem, mas não estão limitados a, motores de armazenamento, tabelas `INFORMATION_SCHEMA`, plugins de parser de texto completo e extensões de servidor.

As distribuições do MySQL incluem vários plugins que implementam extensões de servidor:

- Plugins para autenticação de tentativas de clientes de se conectar ao MySQL Server. Plugins estão disponíveis para vários protocolos de autenticação. Veja Seção 8.2.17, "Pluggable Authentication".
- Um plugin de controle de conexão que permite aos administradores introduzir um atraso crescente após um certo número de tentativas de conexão com o cliente falhadas consecutivas.
- Um plugin de validação de senha implementa políticas de força de senha e avalia a força de senhas em potencial.
- Plugins de replicação semisíncrona implementam uma interface para recursos de replicação que permitem que a fonte prossiga enquanto pelo menos uma réplica tiver respondido a cada transação.
- A Replicação de Grupo permite criar um serviço MySQL distribuído altamente disponível em um grupo de instâncias de servidor MySQL, com consistência de dados, detecção e resolução de conflitos e serviços de associação a grupos todos embutidos.
- O MySQL Enterprise Edition inclui um plugin de pool de threads que gerencia os threads de conexão para aumentar o desempenho do servidor gerenciando eficientemente os threads de execução de instruções para um grande número de conexões de cliente.
- O MySQL Enterprise Edition inclui um plugin de auditoria para monitoramento e registro de conexão e atividade de consulta.
- O MySQL Enterprise Edition inclui um plugin de firewall que implementa um firewall de nível de aplicativo para permitir que os administradores de banco de dados permitam ou neguem a execução de instruções SQL com base na correspondência com os padrões de instruções aceitos.
- Os plugins de reescrita de consultas examinam as instruções recebidas pelo MySQL Server e possivelmente as reescrevem antes que o servidor as execute.
- Os tokens de versão permitem a criação e sincronização em torno de tokens de servidor que os aplicativos podem usar para evitar o acesso a dados incorretos ou desatualizados.
- Os plugins de Keyring fornecem armazenamento seguro para informações confidenciais.
- O X Plugin estende o MySQL Server para poder funcionar como um armazenamento de documentos. A execução do X Plugin permite que o MySQL Server se comunique com clientes usando o X Protocol, que é projetado para expor as capacidades de armazenamento compatíveis com ACID do MySQL como um armazenamento de documentos.
- Clone permite clonar dados de um servidor MySQL local ou remoto.
- Para obter informações sobre esses plugins, consulte a seção Plugins for Testing Plugin Services da documentação do MySQL Server Doxygen, disponível em \[<https://dev.mysql.com/doc/index-other.html>] (<https://dev.mysql.com/doc/index-other.html>).

As seções a seguir descrevem como instalar e desinstalar plugins, e como determinar no tempo de execução quais plugins estão instalados e obter informações sobre eles.
