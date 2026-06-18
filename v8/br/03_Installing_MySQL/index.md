# Capítulo 2: Instalando o MySQL

**Índice**

2.1 Orientações Gerais de Instalação:   2.1.1 Plataformas Compatíveis

```
2.1.2 Which MySQL Version and Distribution to Install

2.1.3 How to Get MySQL

2.1.4 Verifying Package Integrity Using MD5 Checksums or GnuPG

2.1.5 Installation Layouts

2.1.6 Compiler-Specific Build Characteristics
```

2.2 Instalando o MySQL no Unix/Linux usando binários genéricos

2.3 Instalando o MySQL no Microsoft Windows:   2.3.1 Configuração de instalação do MySQL no Microsoft Windows

```
2.3.2 Choosing an Installation Package

2.3.3 MySQL Installer for Windows

2.3.4 Installing MySQL on Microsoft Windows Using a `noinstall` ZIP Archive

2.3.5 Troubleshooting a Microsoft Windows MySQL Server Installation

2.3.6 Windows Postinstallation Procedures

2.3.7 Windows Platform Restrictions
```

2.4 Instalando o MySQL no macOS:   2.4.1 Notas gerais sobre a instalação do MySQL no macOS

```
2.4.2 Installing MySQL on macOS Using Native Packages

2.4.3 Installing and Using the MySQL Launch Daemon

2.4.4 Installing and Using the MySQL Preference Pane
```

2.5 Instalando o MySQL no Linux:   2.5.1 Instalando o MySQL no Linux Usando o Repositório Yum do MySQL

```
2.5.2 Installing MySQL on Linux Using the MySQL APT Repository

2.5.3 Installing MySQL on Linux Using the MySQL SLES Repository

2.5.4 Installing MySQL on Linux Using RPM Packages from Oracle

2.5.5 Installing MySQL on Linux Using Debian Packages from Oracle

2.5.6 Deploying MySQL on Linux with Docker Containers

2.5.7 Installing MySQL on Linux from the Native Software Repositories

2.5.8 Installing MySQL on Linux with Juju

2.5.9 Managing MySQL Server with systemd
```

2.6 Instalação do MySQL usando Unbreakable Linux Network (ULN)

2.7 Instalando o MySQL no Solaris:   2.7.1 Instalando o MySQL no Solaris Usando um PKG Solaris

2.8 Instalando o MySQL a partir da fonte:   2.8.1 Métodos de instalação a partir da fonte

```
2.8.2 Source Installation Prerequisites

2.8.3 MySQL Layout for Source Installation

2.8.4 Installing MySQL Using a Standard Source Distribution

2.8.5 Installing MySQL Using a Development Source Tree

2.8.6 Configuring SSL Library Support

2.8.7 MySQL Source-Configuration Options

2.8.8 Dealing with Problems Compiling MySQL

2.8.9 MySQL Configuration and Third-Party Tools

2.8.10 Generating MySQL Doxygen Documentation Content
```

2.9 Configuração e Teste Pós-Instalação:   2.9.1 Inicialização do Diretório de Dados

```
2.9.2 Starting the Server

2.9.3 Testing the Server

2.9.4 Securing the Initial MySQL Account

2.9.5 Starting and Stopping MySQL Automatically
```

2.10 Notas de instalação do Perl:   2.10.1 Instalação do Perl no Unix

```
2.10.2 Installing ActiveState Perl on Windows

2.10.3 Problems Using the Perl DBI/DBD Interface
```

Este capítulo descreve como obter e instalar o MySQL. Um resumo do procedimento segue, e as seções posteriores fornecem os detalhes. Se você planeja atualizar uma versão existente do MySQL para uma versão mais recente, em vez de instalar o MySQL pela primeira vez, consulte o Capítulo 3, *Atualizando o MySQL*, para obter informações sobre os procedimentos de atualização e sobre os problemas que você deve considerar antes de atualizar.

Se você estiver interessado em migrar para o MySQL a partir de outro sistema de banco de dados, consulte a Seção A.8, “Perguntas frequentes do MySQL 8.0: Migração”, que contém respostas para algumas perguntas comuns sobre questões de migração.

A instalação do MySQL geralmente segue os passos descritos aqui:

1. **Verifique se o MySQL está rodando e é suportado na sua plataforma.**

   Por favor, note que nem todas as plataformas são igualmente adequadas para executar o MySQL e que nem todas as plataformas nas quais o MySQL é conhecido por funcionar são oficialmente suportadas pela Oracle Corporation. Para obter informações sobre as plataformas oficialmente suportadas, consulte <https://www.mysql.com/support/supportedplatforms/database.html> no site do MySQL.

2. **Escolha qual distribuição você quer instalar.**

   Várias versões do MySQL estão disponíveis, e a maioria está disponível em vários formatos de distribuição. Você pode escolher entre distribuições pré-embaladas que contêm programas binários (pré-compilados) ou código-fonte. Se tiver dúvidas, use uma distribuição binária. A Oracle também fornece acesso ao código-fonte do MySQL para aqueles que desejam ver desenvolvimentos recentes e testar novos códigos. Para determinar qual versão e tipo de distribuição você deve usar, consulte a Seção 2.1.2, “Qual versão e distribuição do MySQL instalar”.

3. **Escolha qual faixa instalar.**

   O MySQL oferece uma trilha de correções de bugs (como o MySQL 8.4) e uma trilha de inovação (hoje é o MySQL 9.5), e cada trilha aborda diferentes casos de uso. Ambas as trilhas são consideradas prontas para produção e incluem correções de bugs, enquanto as versões de inovação também incluem novos recursos e potencial para comportamento modificado.

   Uma atualização de trilha de correção de bugs inclui lançamentos pontuais, como o MySQL 8.4.`x` sendo atualizado para 8.4.`y`, enquanto os lançamentos de trilhas de inovação geralmente têm apenas lançamentos menores, como o MySQL 9.5.0 sendo atualizado para 9.6.0. No entanto, uma trilha de inovação tem, ocasionalmente, um lançamento pontual.

4. **Faça o download da distribuição que você deseja instalar.**

   Para obter instruções, consulte a Seção 2.1.3, “Como obter o MySQL”. Para verificar a integridade da distribuição, use as instruções na Seção 2.1.4, “Verificar a integridade do pacote usando verificações MD5 ou GnuPG”.

5. **Instale a distribuição.**

   Para instalar o MySQL a partir de uma distribuição binária, use as instruções na Seção 2.2, “Instalando o MySQL no Unix/Linux Usando Binários Genéricos”. Como alternativa, use o Guia de Implantação Segura, que fornece procedimentos para implantar uma distribuição binária genérica do MySQL Enterprise Edition Server com recursos para gerenciar a segurança da sua instalação do MySQL.

   Para instalar o MySQL a partir de uma distribuição de código-fonte ou da árvore de código-fonte de desenvolvimento atual, use as instruções na Seção 2.8, “Instalando o MySQL a partir de código-fonte”.

6. **Realize qualquer configuração pós-instalação necessária.**

   Após instalar o MySQL, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”, para obter informações sobre como garantir que o servidor MySQL esteja funcionando corretamente. Consulte também as informações fornecidas na Seção 2.9.4, “Segurança da Conta Inicial do MySQL”. Esta seção descreve como proteger a conta inicial do usuário `root` do MySQL, *que não tem senha* até que você a atribua. A seção se aplica se você instalar o MySQL usando uma distribuição binária ou de fonte.

7. Se você quiser executar os scripts de benchmark do MySQL, o suporte do Perl para o MySQL deve estar disponível. Veja a Seção 2.10, “Notas de Instalação do Perl”.

As instruções para instalar o MySQL em diferentes plataformas e ambientes estão disponíveis em uma base de plataforma por plataforma:

- **Unix, Linux**

  Para obter instruções sobre como instalar o MySQL na maioria das plataformas Linux e Unix usando um binário genérico (por exemplo, um pacote `.tar.gz`), consulte a Seção 2.2, “Instalando o MySQL no Unix/Linux usando Binários Genéricos”.

  Para obter informações sobre a construção do MySQL inteiramente a partir das distribuições do código-fonte ou dos repositórios de código-fonte, consulte a Seção 2.8, “Instalando o MySQL a partir do código-fonte”.

  Para obter ajuda específica sobre instalação, configuração e construção a partir da fonte, consulte a seção da plataforma correspondente:

  - Linux, incluindo notas sobre métodos específicos da distribuição, consulte a Seção 2.5, “Instalando o MySQL no Linux”.

  - IBM AIX, consulte a Seção 2.7, “Instalando o MySQL no Solaris”.

- **Microsoft Windows**

  Para obter instruções sobre como instalar o MySQL no Microsoft Windows, usando o Instalador do MySQL ou o binário compactado, consulte a Seção 2.3, “Instalando o MySQL no Microsoft Windows”.

  Para obter detalhes e instruções sobre como construir o MySQL a partir do código-fonte usando o Microsoft Visual Studio, consulte a Seção 2.8, “Instalando o MySQL a partir do código-fonte”.

- **macOS**

  Para a instalação no macOS, incluindo o uso dos formatos de pacote binário e PKG nativo, consulte a Seção 2.4, “Instalando o MySQL no macOS”.

  Para obter informações sobre como usar um daemon de inicialização do macOS para iniciar e parar automaticamente o MySQL, consulte a Seção 2.4.3, “Instalando e usando o daemon de inicialização do MySQL”.

  Para obter informações sobre o Painel de Preferências do MySQL, consulte a Seção 2.4.4, “Instalando e Usando o Painel de Preferências do MySQL”.
