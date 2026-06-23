# Capítulo 8 Segurança

Ao pensar em segurança dentro de uma instalação MySQL, você deve considerar uma ampla gama de tópicos possíveis e como eles afetam a segurança do seu servidor MySQL e aplicativos relacionados:

* Fatores gerais que afetam a segurança. Esses incluem a escolha de senhas boas, não conceder privilégios desnecessários aos usuários, garantir a segurança dos aplicativos, prevenindo injeções SQL e corrupção de dados, entre outros. Veja a Seção 8.1, “Problemas Gerais de Segurança”.

* Segurança da própria instalação. Os arquivos de dados, os arquivos de registro e todos os arquivos da aplicação da sua instalação devem ser protegidos para garantir que não sejam legíveis ou modificáveis por partes não autorizadas. Para mais informações, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”.

* Controle de acesso e segurança dentro do próprio sistema de banco de dados, incluindo os usuários e bancos de dados concedidos acesso aos bancos de dados, visualizações e programas armazenados em uso dentro do banco de dados. Para mais informações, consulte a Seção 8.2, “Controle de Acesso e Gerenciamento de Conta”.

* As características oferecidas pelos plugins relacionados à segurança. Veja a Seção 8.4, “Componentes e plugins de segurança”.

* Segurança da rede do MySQL e do seu sistema. A segurança está relacionada às permissões para usuários individuais, mas você também pode querer restringir o MySQL para que ele esteja disponível apenas localmente no host do servidor MySQL ou para um conjunto limitado de outros hosts.

* Certifique-se de que você tenha backups adequados e apropriados de seus arquivos de banco de dados, configurações e arquivos de registro. Além disso, certifique-se de que você tenha uma solução de recuperação em vigor e teste se você é capaz de recuperar com sucesso as informações de seus backups. Veja o Capítulo 9, *Backup e Recuperação*.

Nota

Vários tópicos deste capítulo também são abordados no [Guia de Implantação Segura][(/doc/mysql-secure-deployment-guide/8.0/en/)], que fornece procedimentos para implantar uma distribuição binária genérica do MySQL Enterprise Edition Server com recursos para gerenciar a segurança da sua instalação do MySQL.