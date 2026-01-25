## 6.4 Plugins de Segurança

[6.4.1 Plugins de Autenticação](authentication-plugins.html)

[6.4.2 Plugins de Controle de Conexão](connection-control-plugin.html)

[6.4.3 O Plugin de Validação de Senha](validate-password.html)

[6.4.4 O Keyring do MySQL](keyring.html)

[6.4.5 MySQL Enterprise Audit](audit-log.html)

[6.4.6 MySQL Enterprise Firewall](firewall.html)

O MySQL inclui vários plugins que implementam recursos de segurança:

* Plugins para autenticar tentativas de clientes de se conectar ao MySQL Server. Plugins estão disponíveis para vários protocolos de autenticação. Para uma discussão geral sobre o processo de autenticação, consulte [Seção 6.2.13, “Autenticação Plugável”](pluggable-authentication.html "6.2.13 Autenticação Plugável"). Para características de plugins de autenticação específicos, consulte [Seção 6.4.1, “Plugins de Autenticação”](authentication-plugins.html "6.4.1 Plugins de Autenticação").

* Um plugin de validação de senha para implementar políticas de força de senha e avaliar a força de senhas potenciais. Consulte [Seção 6.4.3, “O Plugin de Validação de Senha”](validate-password.html "6.4.3 O Plugin de Validação de Senha").

* Plugins de Keyring que fornecem armazenamento seguro para informações confidenciais. Consulte [Seção 6.4.4, “O Keyring do MySQL”](keyring.html "6.4.4 O Keyring do MySQL").

* (Apenas MySQL Enterprise Edition) O MySQL Enterprise Audit, implementado usando um plugin de server, utiliza a MySQL Audit API aberta para permitir o monitoramento padrão baseado em política e o logging da atividade de conexão e Query executada em servers MySQL específicos. Projetado para atender à especificação de auditoria da Oracle, o MySQL Enterprise Audit fornece uma solução de auditoria e conformidade pronta para uso (out of box) e fácil de usar para aplicações que são regidas por diretrizes regulatórias internas e externas. Consulte [Seção 6.4.5, “MySQL Enterprise Audit”](audit-log.html "6.4.5 MySQL Enterprise Audit").

* (Apenas MySQL Enterprise Edition) O MySQL Enterprise Firewall, um firewall de nível de aplicação que permite aos administradores de Database permitir ou negar a execução de SQL statement com base na correspondência com listas de padrões de statement aceitos. Isso ajuda a proteger (harden) o MySQL Server contra ataques como SQL injection ou tentativas de explorar aplicações usando-as fora das características legítimas de sua carga de trabalho de Query. Consulte [Seção 6.4.6, “MySQL Enterprise Firewall”](firewall.html "6.4.6 MySQL Enterprise Firewall").

* (Apenas MySQL Enterprise Edition) MySQL Enterprise Data Masking and De-Identification, implementado como uma biblioteca de plugins contendo um plugin e um conjunto de funções. O Data masking oculta informações confidenciais substituindo valores reais por substitutos. As funções do MySQL Enterprise Data Masking and De-Identification permitem mascarar dados existentes usando vários métodos, como ofuscação (remoção de características de identificação), geração de dados aleatórios formatados e substituição ou troca de dados. Consulte [Seção 6.5, “MySQL Enterprise Data Masking and De-Identification”](data-masking.html "6.5 MySQL Enterprise Data Masking and De-Identification").