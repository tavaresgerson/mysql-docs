# Capítulo 2: Instalação e Atualização do MySQL

Este capítulo descreve como obter e instalar o MySQL. Um resumo do procedimento segue, e as seções subsequentes fornecem os detalhes. Se você planeja atualizar uma versão existente do MySQL para uma versão mais recente, em vez de instalar o MySQL pela primeira vez, consulte [Seção 2.10, “Atualizando o MySQL”][(upgrading.html "2.10 Upgrading MySQL")], para obter informações sobre os procedimentos de atualização e sobre os problemas que você deve considerar antes de atualizar.

Se você está interessado em migrar para o MySQL a partir de outro sistema de banco de dados, consulte [Seção A.8, “Perguntas frequentes sobre MySQL 5.7: Migração”][(faqs-migration.html "A.8 MySQL 5.7 FAQ: Migration")], que contém respostas para algumas perguntas comuns sobre questões de migração.

A instalação do MySQL geralmente segue os passos descritos aqui:

1. **Verifique se o MySQL está em execução e se é suportado na sua plataforma.**

Por favor, note que nem todas as plataformas são igualmente adequadas para executar o MySQL, e que nem todas as plataformas nas quais o MySQL é conhecido por ser executado são oficialmente suportadas pela Oracle Corporation. Para informações sobre as plataformas que são oficialmente suportadas, consulte <https://www.mysql.com/support/supportedplatforms/database.html> no site do MySQL.

2. **Escolha a distribuição que você deseja instalar.**

Várias versões do MySQL estão disponíveis, e a maioria está disponível em vários formatos de distribuição. Você pode escolher entre distribuições pré-embaladas que contêm programas binários (pré-compilados) ou código-fonte. Se estiver em dúvida, use uma distribuição binária. A Oracle também fornece acesso ao código-fonte do MySQL para aqueles que desejam ver desenvolvimentos recentes e testar novos códigos. Para determinar qual versão e tipo de distribuição você deve usar, consulte [Seção 2.1.2, “Qual versão do MySQL e distribuição instalar”][(which-version.html "2.1.2 Which MySQL Version and Distribution to Install")].

3. **Baixe a distribuição que você deseja instalar.**

Para obter instruções, consulte [Seção 2.1.3, “Como obter o MySQL”][(getting-mysql.html "2.1.3 How to Get MySQL")]. Para verificar a integridade da distribuição, use as instruções na [Seção 2.1.4, “Verificando a integridade do pacote usando verificações MD5 ou GnuPG”][(verifying-package-integrity.html "2.1.4 Verifying Package Integrity Using MD5 Checksums or GnuPG")].

4. **Instale a distribuição.**

Para instalar o MySQL a partir de uma distribuição binária, use as instruções na [Seção 2.2, “Instalando o MySQL em Unix/Linux Usando Binários Gerenciais”][(binary-installation.html "2.2 Installing MySQL on Unix/Linux Using Generic Binaries")]. Alternativamente, use o [Guia de Implantação Segura][(/doc/mysql-secure-deployment-guide/5.7/en/)], que fornece procedimentos para implantar uma distribuição binária gerencial do MySQL Enterprise Edition Server com recursos para gerenciar a segurança da sua instalação do MySQL.

Para instalar o MySQL a partir de uma distribuição de fonte ou da árvore de fonte de desenvolvimento atual, use as instruções em [Seção 2.8, “Instalando MySQL a partir de fonte”][(source-installation.html "2.8 Installing MySQL from Source")].

5. **Realize qualquer configuração pós-instalação necessária.**

Após instalar o MySQL, consulte a [Seção 2.9, “Configuração e Teste Pós-Instalação”][(postinstallation.html "2.9 Postinstallation Setup and Testing")] para obter informações sobre como garantir que o servidor MySQL esteja funcionando corretamente. Também consulte as informações fornecidas na [Seção 2.9.4, “Segurança da Conta Inicial do MySQL”][(default-privileges.html "2.9.4 Securing the Initial MySQL Account")]. Esta seção descreve como proteger a conta inicial do usuário do MySQL `root`, *que não tem senha*, até que você a atribua. A seção se aplica se você instalar o MySQL usando uma distribuição binária ou de fonte.

6. Se você deseja executar os scripts de benchmark do MySQL, o suporte Perl para MySQL deve estar disponível. Consulte [Seção 2.12, “Notas de instalação do Perl”][(perl-support.html "2.12 Perl Installation Notes")].

As instruções para instalar o MySQL em diferentes plataformas e ambientes estão disponíveis em uma base por plataforma:

* **Unix, Linux**

Para obter instruções sobre como instalar o MySQL na maioria das plataformas Linux e Unix usando um binário genérico (por exemplo, um pacote `.tar.gz`, veja [Seção 2.2, “Instalando MySQL em Unix/Linux Usando Binários Genéricos”][(binary-installation.html "2.2 Installing MySQL on Unix/Linux Using Generic Binaries")]].

Para obter informações sobre a construção do MySQL inteiramente a partir das distribuições do código-fonte ou dos repositórios de código-fonte, consulte [Seção 2.8, “Instalando MySQL a partir do código-fonte”][(source-installation.html "2.8 Installing MySQL from Source")]

Para obter ajuda específica sobre instalação, configuração e construção a partir de fontes, consulte a seção correspondente à plataforma:

+ Linux, incluindo notas sobre métodos específicos da distribuição, veja [Seção 2.5, “Instalando MySQL no Linux”][(linux-installation.html "2.5 Installing MySQL on Linux")].

+ Solaris, incluindo os formatos PKG e IPS, veja [Seção 2.7, “Instalando MySQL no Solaris”][(solaris-installation.html "2.7 Installing MySQL on Solaris")].

+ IBM AIX, veja [Seção 2.7, “Instalando MySQL no Solaris”][(solaris-installation.html "2.7 Installing MySQL on Solaris")]. * **Microsoft Windows**

Para obter instruções sobre como instalar o MySQL no Microsoft Windows, usando o Instalador MySQL ou o binário compactado, consulte [Seção 2.3, “Instalando o MySQL no Microsoft Windows”][(windows-installation.html "2.3 Installing MySQL on Microsoft Windows")].

Para obter detalhes e instruções sobre a construção do MySQL a partir do código-fonte usando o Microsoft Visual Studio, consulte [Seção 2.8, “Instalando MySQL a partir do código-fonte”][(source-installation.html "2.8 Installing MySQL from Source")].

* **macOS**

Para instalação no macOS, incluindo o uso de pacotes binários e formatos nativos PKG, consulte [Seção 2.4, “Instalando o MySQL no macOS”][(macos-installation.html "2.4 Installing MySQL on macOS")].

Para obter informações sobre como usar um Launch Daemon do macOS para iniciar e parar automaticamente o MySQL, consulte [Seção 2.4.3, “Instalando um Launch Daemon do MySQL”][(macos-installation-launchd.html "2.4.3 Installing a MySQL Launch Daemon")].

Para informações sobre o Painel de Preferências do MySQL, consulte [Seção 2.4.4, “Instalando e Usando o Painel de Preferências do MySQL”][(macos-installation-prefpane.html "2.4.4 Installing and Using the MySQL Preference Pane")].