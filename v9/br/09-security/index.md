# Capítulo 8 Segurança

**Índice**

8.1 Questões Gerais de Segurança:   8.1.1 Diretrizes de Segurança

    8.1.2 Mantendo Senhas Seguras

    8.1.3 Tornando o MySQL Seguro Contra Ataque

    8.1.4 Opções e Variáveis de Segurança do mysqld

    8.1.5 Como Executar o MySQL como Usuário Normal

    8.1.6 Considerações de Segurança para LOAD DATA LOCAL

    8.1.7 Diretrizes de Segurança para Programação de Clientes

8.2 Controle de Acesso e Gerenciamento de Contas:   8.2.1 Nomes de Usuários e Senhas de Contas

    8.2.2 Privilegios Fornecidos pelo MySQL

    8.2.3 Tabelas de Concessão

    8.2.4 Especificando Nomes de Contas

    8.2.5 Especificando Nomes de Papéis

    8.2.6 Controle de Acesso, Etapa 1: Verificação de Conexão

    8.2.7 Controle de Acesso, Etapa 2: Verificação de Solicitação

    8.2.8 Adicionando Contas, Atribuindo Privilegios e Removendo Contas

    8.2.9 Contas Reservadas

    8.2.10 Usando Papéis

    8.2.11 Categorias de Contas

    8.2.12 Restrição de Privilegios Usando Revocações Parciais

    8.2.13 Quando as Alterações de Privilegio Se Tornam Efetivas

    8.2.14 Atribuindo Senhas de Contas

    8.2.15 Gerenciamento de Senhas

    8.2.16 Manipulação do Servidor de Senhas Expirantes

    8.2.17 Autenticação Pluggable

    8.2.18 Autenticação Multifator

    8.2.19 Usuários de Proxy

    8.2.20 Bloqueio de Contas

    8.2.21 Definindo Limites de Recursos de Contas

    8.2.22 Solução de Problemas para Conectar-se ao MySQL

    8.2.23 Auditoria de Atividade de Conta Baseada em SQL

8.3 Uso de Conexões Encriptadas:   8.3.1 Configurando o MySQL para Usar Conexões Encriptadas

    8.3.2 Protocolos e Cifras TLS de Conexão Encriptada

    8.3.3 Criando Certificados e Chaves SSL e RSA

    8.3.4 Conectando-se ao MySQL Remotamente a partir do Windows com SSH

    8.3.5 Reutilizando Sessões SSL

8.4 Componentes e Plugins de Segurança:   8.4.1 Plugins de Autenticação

    8.4.2 O Componente de Controle de Conexão

8.4.3 Plugins de Controle de Conexão

    8.4.4 O Componente de Validação de Senhas

    8.4.5 O Carrinho de Chaves MySQL

    8.4.6 Auditoria do MySQL Enterprise

    8.4.7 O Componente de Mensagem de Auditoria

    8.4.8 O Firewall do MySQL Enterprise

8.5 Mascagem de Dados do MySQL Enterprise:   8.5.1 Componentes de Mascagem de Dados versus o Plugin de Mascagem de Dados

    8.5.2 Componentes de Mascagem de Dados do MySQL Enterprise

    8.5.3 Plugin de Mascagem de Dados do MySQL Enterprise

8.6 Encriptação do MySQL Enterprise:   8.6.1 Instalação e Atualização da Encriptação do MySQL Enterprise

    8.6.2 Configuração da Encriptação do MySQL Enterprise

    8.6.3 Uso e Exemplos da Encriptação do MySQL Enterprise

    8.6.4 Referência de Funções do Componente de Encriptação do MySQL Enterprise

    8.6.5 Descrições das Funções do Componente de Encriptação do MySQL Enterprise

8.7 SELinux:   8.7.1 Verificar se o SELinux está Ativado

    8.7.2 Alterar o Modo SELinux

    8.7.3 Políticas SELinux do Servidor MySQL

    8.7.4 Contexto de Arquivo SELinux

    8.7.5 Contexto de Porta TCP SELinux

    8.7.6 Solução de Problemas com o SELinux

8.8 Suporte FIPS

Ao pensar sobre segurança dentro de uma instalação do MySQL, você deve considerar uma ampla gama de tópicos possíveis e como eles afetam a segurança do seu servidor MySQL e das aplicações relacionadas:

* Fatores gerais que afetam a segurança. Isso inclui a escolha de boas senhas, não conceder privilégios desnecessários aos usuários, garantir a segurança da aplicação ao prevenir injeções SQL e corrupção de dados, entre outros. Veja a Seção 8.1, “Problemas Gerais de Segurança”.

* Segurança da própria instalação. Os arquivos de dados, arquivos de log e todos os arquivos da aplicação da sua instalação devem ser protegidos para garantir que não sejam legíveis ou modificáveis por partes não autorizadas. Para mais informações, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”.

* Controle de acesso e segurança dentro do próprio sistema de banco de dados, incluindo os usuários e bancos de dados que têm acesso aos bancos de dados, visualizações e programas armazenados em uso dentro do banco de dados. Para mais informações, consulte a Seção 8.2, “Controle de Acesso e Gerenciamento de Contas”.

* As funcionalidades oferecidas pelos plugins relacionados à segurança. Consulte a Seção 8.4, “Componentes e Plugins de Segurança”.

* Segurança da rede do MySQL e do seu sistema. A segurança está relacionada às concessões para usuários individuais, mas você também pode querer restringir o MySQL para que ele esteja disponível apenas localmente no host do servidor MySQL ou para um conjunto limitado de outros hosts.

* Certifique-se de ter backups adequados e apropriados dos seus arquivos de banco de dados, arquivos de configuração e log. Além disso, certifique-se de que você tem uma solução de recuperação em vigor e teste se consegue recuperar com sucesso as informações de seus backups. Consulte o Capítulo 9, *Backup e Recuperação*.

Nota

Vários tópicos neste capítulo também são abordados na Guia de Implantação Segura, que fornece procedimentos para implantar uma distribuição binária genérica do MySQL Enterprise Edition Server com recursos para gerenciar a segurança da sua instalação do MySQL.