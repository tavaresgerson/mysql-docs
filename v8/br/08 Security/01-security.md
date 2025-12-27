# Capítulo 8 Segurança

Ao pensar em segurança dentro de uma instalação MySQL, você deve considerar uma ampla gama de tópicos possíveis e como eles afetam a segurança do seu servidor MySQL e das aplicações relacionadas:

* Fatores gerais que afetam a segurança. Isso inclui escolher boas senhas, não conceder privilégios desnecessários aos usuários, garantir a segurança da aplicação impedindo injeções SQL e corrupção de dados, entre outros. Veja a Seção 8.1, “Problemas Gerais de Segurança”.
* Segurança da própria instalação. Os arquivos de dados, arquivos de log e todos os arquivos da aplicação da sua instalação devem ser protegidos para garantir que não sejam legíveis ou modificáveis por partes não autorizadas. Para mais informações, veja a Seção 2.9, “Configuração e Teste Pós-Instalação”.
* Controle de acesso e segurança dentro do próprio sistema de banco de dados, incluindo os usuários e bancos de dados que têm acesso aos bancos de dados, visualizações e programas armazenados em uso dentro do banco de dados. Para mais informações, veja a Seção 8.2, “Controle de Acesso e Gerenciamento de Contas”.
* As funcionalidades oferecidas pelos plugins relacionados à segurança. Veja a Seção 8.4, “Componentes e Plugins de Segurança”.
* Segurança da rede do MySQL e do seu sistema. A segurança está relacionada às concessões para usuários individuais, mas você também pode querer restringir o MySQL para que ele esteja disponível apenas localmente no host do servidor MySQL, ou para um conjunto limitado de outros hosts.
* Certifique-se de que você tem backups adequados e apropriados dos seus arquivos de banco de dados, configuração e arquivos de log. Além disso, certifique-se de que você tem uma solução de recuperação em vigor e teste se você é capaz de recuperar com sucesso as informações de seus backups. Veja o Capítulo 9, *Backup e Recuperação*.

::: info Nota

Vários tópicos neste capítulo também são abordados na Guia de Implantação Segura, que fornece procedimentos para implantar uma distribuição binária genérica do MySQL Enterprise Edition Server com recursos para gerenciar a segurança da sua instalação MySQL.