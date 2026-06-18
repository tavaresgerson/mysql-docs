## 8.4 Componentes de segurança e plugins

8.4.1 Plugins de autenticação

8.4.2 Plugins de controle de conexão

8.4.3 O componente de validação de senha

8.4.4 O Keyring do MySQL

8.4.5 Auditoria do MySQL Enterprise

8.4.6 O componente de mensagem de auditoria

8.4.7 Firewall empresarial do MySQL

O MySQL inclui vários componentes e plugins que implementam recursos de segurança:

- Plugins para autenticação de tentativas de conexão de clientes com o MySQL Server. Os plugins estão disponíveis para vários protocolos de autenticação. Para uma discussão geral sobre o processo de autenticação, consulte a Seção 8.2.17, “Autenticação Personalizável”. Para características de plugins de autenticação específicos, consulte a Seção 8.4.1, “Plugins de Autenticação”.

- Um componente de validação de senha para implementar políticas de força de senha e avaliar a força de senhas potenciais. Veja a Seção 8.4.3, “O Componente de Validação de Senha”.

- Plugins de cartela de identificação que oferecem armazenamento seguro para informações sensíveis. Veja a Seção 8.4.4, “O MySQL Keyring”.

- (Apenas para a Edição Empresarial do MySQL) O MySQL Enterprise Audit, implementado usando um plugin do servidor, utiliza a API de auditoria MySQL aberta para habilitar o monitoramento padrão e baseado em políticas e o registro da atividade de conexão e consulta executada em servidores MySQL específicos. Projetado para atender à especificação de auditoria da Oracle, o MySQL Enterprise Audit oferece uma solução de auditoria e conformidade fácil de usar, pronta para uso, para aplicativos que são regidos por diretrizes regulatórias internas e externas. Veja a Seção 8.4.5, “MySQL Enterprise Audit”.

- Uma função permite que as aplicações adicionem seus próprios eventos de mensagem ao log de auditoria. Veja a Seção 8.4.6, “O Componente de Mensagem de Auditoria”.

- (Apenas para a Edição Empresarial do MySQL) O Firewall Empresarial do MySQL, um firewall de nível de aplicativo que permite que os administradores de banco de dados permitam ou negam a execução de instruções SQL com base na correspondência com listas de padrões de instruções aceitos. Isso ajuda a proteger o MySQL Server contra ataques como injeção SQL ou tentativas de explorar aplicativos usando-os fora de suas características legítimas de carga de trabalho de consultas. Veja a Seção 8.4.7, “Firewall Empresarial do MySQL”.

- (Apenas para a Edição Empresarial do MySQL) O MySQL Enterprise Data Masking e De-Identification, implementado como uma biblioteca de plugins que contém um plugin e um conjunto de funções. O mascaramento de dados oculta informações sensíveis substituindo valores reais por substitutos. As funções de mascaramento de dados do MySQL Enterprise permitem mascarar dados existentes usando vários métodos, como ofuscação (removendo características identificadoras), geração de dados aleatórios formatados e substituição ou substituição de dados. Veja a Seção 8.5, “MySQL Enterprise Data Masking e De-Identification”.
