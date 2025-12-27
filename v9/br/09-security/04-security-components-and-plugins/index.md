## 8.4 Componentes e Plugins de Segurança

8.4.1 Plugins de Autenticação

8.4.2 O Componente de Controle de Conexão

8.4.3 Plugins de Controle de Conexão

8.4.4 O Componente de Validação de Senhas

8.4.5 O Keyring MySQL

8.4.6 Auditoria MySQL Enterprise

8.4.7 O Componente de Mensagem de Auditoria

8.4.8 Firewall MySQL Enterprise

O MySQL inclui vários componentes e plugins que implementam recursos de segurança:

* Plugins para autenticar tentativas de conexão de clientes ao MySQL Server. Os plugins estão disponíveis para vários protocolos de autenticação. Para discussão geral sobre o processo de autenticação, consulte a Seção 8.2.17, “Autenticação Personalizável”. Para características de plugins de autenticação específicos, consulte a Seção 8.4.1, “Plugins de Autenticação”.

* Um componente de validação de senha para implementar políticas de força de senha e avaliar a força de senhas potenciais. Consulte a Seção 8.4.4, “O Componente de Validação de Senhas”.

* Componentes e plugins de Keyring que fornecem armazenamento seguro para informações sensíveis. Consulte a Seção 8.4.5, “O Keyring MySQL”.

* (Apenas para a Edição MySQL Enterprise) MySQL Enterprise Audit, implementado usando um plugin do servidor, utiliza a API de Auditoria MySQL aberta para habilitar monitoramento e registro padrão, baseado em políticas, de atividades de conexão e consulta executadas em servidores MySQL específicos. Projetado para atender à especificação de auditoria da Oracle, o MySQL Enterprise Audit oferece uma solução de auditoria e conformidade fácil de usar, pronta para uso, para aplicativos que são regidos por diretrizes regulatórias internas e externas. Consulte a Seção 8.4.6, “MySQL Enterprise Audit”.

* Uma função permite que aplicativos adicionem seus próprios eventos de mensagem ao log de auditoria. Consulte a Seção 8.4.7, “O Componente de Mensagem de Auditoria”.

* (Apenas para a Edição Empresarial do MySQL) O MySQL Enterprise Firewall, um firewall de nível de aplicativo que permite que os administradores de banco de dados permitam ou negociem a execução de instruções SQL com base na correspondência com listas de padrões de instruções aceitos. Isso ajuda a proteger o MySQL Server contra ataques como injeção SQL ou tentativas de explorar aplicativos usando-os fora de suas características legítimas de carga de trabalho de consultas. Veja a Seção 8.4.8, “MySQL Enterprise Firewall”.

* (Apenas para a Edição Empresarial do MySQL) O MySQL Enterprise Data Masking, implementado como uma biblioteca de plugins que contém um plugin e um conjunto de funções. O mascaramento de dados oculta informações sensíveis substituindo valores reais por substitutos. As funções de mascaramento de dados do MySQL Enterprise permitem mascarar dados existentes usando vários métodos, como ofuscação (removendo características identificáveis), geração de dados aleatórios formatados e substituição ou substituição de dados. Veja a Seção 8.5, “MySQL Enterprise Data Masking”.