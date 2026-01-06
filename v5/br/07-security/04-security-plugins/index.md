## 6.4 Plugins de segurança

6.4.1 Plugins de autenticação

6.4.2 Plugins de controle de conexão

6.4.3 O Plugin de Validação de Senha

6.4.4 O Keyring do MySQL

6.4.5 Auditoria do MySQL Enterprise

6.4.6 Firewall Empresarial MySQL

O MySQL inclui vários plugins que implementam recursos de segurança:

- Plugins para autenticação de tentativas de conexão de clientes com o MySQL Server. Há plugins disponíveis para vários protocolos de autenticação. Para uma discussão geral sobre o processo de autenticação, consulte Seção 6.2.13, “Autenticação Personalizável”. Para características de plugins de autenticação específicos, consulte Seção 6.4.1, “Plugins de Autenticação”.

- Um plugin de validação de senha para implementar políticas de força de senha e avaliar a força de senhas potenciais. Veja Seção 6.4.3, “O Plugin de Validação de Senha”.

- Plugins de cartela de identificação que oferecem armazenamento seguro para informações sensíveis. Veja Seção 6.4.4, “A Cartela de Identificação MySQL”.

- (Apenas para a Edição Empresarial do MySQL) O MySQL Enterprise Audit, implementado usando um plugin do servidor, utiliza a API de auditoria MySQL aberta para habilitar o monitoramento padrão e baseado em políticas e o registro da atividade de conexão e consulta executada em servidores MySQL específicos. Projetado para atender à especificação de auditoria da Oracle, o MySQL Enterprise Audit oferece uma solução de auditoria e conformidade fácil de usar, pronta para uso, para aplicativos que são regidos por diretrizes regulatórias internas e externas. Veja Seção 6.4.5, “MySQL Enterprise Audit”.

- (Apenas para a Edição Empresarial do MySQL) O MySQL Enterprise Firewall, um firewall de nível de aplicativo que permite que os administradores de banco de dados permitam ou negociem a execução de instruções SQL com base na correspondência com listas de padrões de instruções aceitos. Isso ajuda a proteger o MySQL Server contra ataques como injeção SQL ou tentativas de explorar aplicativos usando-os fora de suas características legítimas de carga de trabalho de consultas. Consulte Seção 6.4.6, “MySQL Enterprise Firewall”.

- (Apenas para a Edição Empresarial do MySQL) O MySQL Enterprise Data Masking e De-Identificação, implementado como uma biblioteca de plugins que contém um plugin e um conjunto de funções. O mascaramento de dados oculta informações sensíveis substituindo valores reais por substitutos. As funções de mascaramento de dados do MySQL Enterprise permitem mascarar dados existentes usando vários métodos, como ofuscação (removendo características identificadoras), geração de dados aleatórios formatados e substituição ou substituição de dados. Veja Seção 6.5, “MySQL Enterprise Data Masking e De-Identificação”.
