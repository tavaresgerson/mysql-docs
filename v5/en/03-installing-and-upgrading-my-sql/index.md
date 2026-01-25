# Capítulo 2 Instalação e Upgrade do MySQL

**Sumário**

2.1 Orientação Geral de Instalação :   2.1.1 Plataformas Suportadas

    2.1.2 Qual Versão e Distribuição do MySQL Instalar

    2.1.3 Como Obter o MySQL

    2.1.4 Verificação da Integridade do Pacote Usando Checksums MD5 ou GnuPG

    2.1.5 Layouts de Instalação

    2.1.6 Características de Build Específicas do Compilador

2.2 Instalando o MySQL em Unix/Linux Usando Binários Genéricos

2.3 Instalando o MySQL no Microsoft Windows :   2.3.1 Layout de Instalação do MySQL no Microsoft Windows

    2.3.2 Escolhendo um Pacote de Instalação

    2.3.3 MySQL Installer para Windows

    2.3.4 Instalando o MySQL no Microsoft Windows Usando um Arquivo ZIP `noinstall`

    2.3.5 Solução de Problemas em uma Instalação do MySQL Server no Microsoft Windows

    2.3.6 Procedimentos Pós-instalação no Windows

    2.3.7 Restrições da Plataforma Windows

2.4 Instalando o MySQL no macOS :   2.4.1 Notas Gerais sobre a Instalação do MySQL no macOS

    2.4.2 Instalando o MySQL no macOS Usando Pacotes Nativos

    2.4.3 Instalando um Launch Daemon do MySQL

    2.4.4 Instalando e Usando o Painel de Preferências do MySQL (Preference Pane)

2.5 Instalando o MySQL no Linux :   2.5.1 Instalando o MySQL no Linux Usando o Repositório Yum do MySQL

    2.5.2 Substituindo uma Distribuição de Terceiros do MySQL Usando o Repositório Yum do MySQL

    2.5.3 Instalando o MySQL no Linux Usando o Repositório APT do MySQL

    2.5.4 Instalando o MySQL no Linux Usando o Repositório SLES do MySQL

    2.5.5 Instalando o MySQL no Linux Usando Pacotes RPM da Oracle

    2.5.6 Instalando o MySQL no Linux Usando Pacotes Debian da Oracle

    2.5.7 Implantando o MySQL no Linux com Docker

    2.5.8 Instalando o MySQL no Linux a Partir dos Repositórios de Software Nativos

    2.5.9 Instalando o MySQL no Linux com Juju

    2.5.10 Gerenciando o MySQL Server com systemd

2.6 Instalando o MySQL Usando a Unbreakable Linux Network (ULN)

2.7 Instalando o MySQL no Solaris :   2.7.1 Instalando o MySQL no Solaris Usando um PKG Solaris

2.8 Instalando o MySQL a Partir do Código Fonte (Source) :   2.8.1 Métodos de Instalação a Partir do Source

    2.8.2 Pré-requisitos de Instalação a Partir do Source

    2.8.3 Layout do MySQL para Instalação a Partir do Source

    2.8.4 Instalando o MySQL Usando uma Distribuição Source Padrão

    2.8.5 Instalando o MySQL Usando uma Árvore Source de Desenvolvimento

    2.8.6 Configurando o Suporte à Library SSL

    2.8.7 Opções de Configuração do Source do MySQL

    2.8.8 Lidando com Problemas de Compilação do MySQL

    2.8.9 Configuração do MySQL e Ferramentas de Terceiros

2.9 Configuração e Teste Pós-instalação :   2.9.1 Inicializando o Data Directory

    2.9.2 Iniciando o Server

    2.9.3 Testando o Server

    2.9.4 Protegendo a Conta Inicial do MySQL

    2.9.5 Iniciando e Parando o MySQL Automaticamente

2.10 Upgrade do MySQL :   2.10.1 Antes de Começar

    2.10.2 Caminhos de Upgrade

    2.10.3 Alterações no MySQL 5.7

    2.10.4 Fazendo Upgrade de Instalações Binárias ou Baseadas em Pacotes do MySQL no Unix/Linux

    2.10.5 Fazendo Upgrade do MySQL com o Repositório Yum do MySQL

    2.10.6 Fazendo Upgrade do MySQL com o Repositório APT do MySQL

    2.10.7 Fazendo Upgrade do MySQL com o Repositório SLES do MySQL

    2.10.8 Fazendo Upgrade do MySQL no Windows

    2.10.9 Fazendo Upgrade de uma Instalação Docker do MySQL

    2.10.10 Fazendo Upgrade do MySQL com Pacotes RPM Baixados Diretamente

    2.10.11 Solução de Problemas de Upgrade

    2.10.12 Reconstruindo ou Reparando Tables ou Indexes

    2.10.13 Copiando Databases MySQL para Outra Máquina

2.11 Downgrade do MySQL :   2.11.1 Antes de Começar

    2.11.2 Caminhos de Downgrade

    2.11.3 Notas de Downgrade

    2.11.4 Fazendo Downgrade de Instalações Binárias e Baseadas em Pacotes no Unix/Linux

    2.11.5 Solução de Problemas de Downgrade

2.12 Notas de Instalação do Perl :   2.12.1 Instalando o Perl no Unix

    2.12.2 Instalando o ActiveState Perl no Windows

    2.12.3 Problemas ao Usar a Interface DBI/DBD do Perl

Este capítulo descreve como obter e instalar o MySQL. Um resumo do procedimento segue abaixo, e as seções posteriores fornecem os detalhes. Se você planeja fazer o upgrade de uma versão existente do MySQL para uma mais nova, em vez de instalar o MySQL pela primeira vez, consulte a Seção 2.10, “Upgrade do MySQL”, para obter informações sobre procedimentos de upgrade e sobre questões que você deve considerar antes de realizar o upgrade.

Se você estiver interessado em migrar para o MySQL a partir de outro sistema de Database, consulte a Seção A.8, “MySQL 5.7 FAQ: Migration”, que contém respostas para algumas perguntas comuns sobre questões de migração.

A instalação do MySQL geralmente segue as etapas descritas aqui:

1. **Determine se o MySQL é executável e suportado em sua plataforma.**

   Observe que nem todas as plataformas são igualmente adequadas para executar o MySQL, e que nem todas as plataformas nas quais se sabe que o MySQL é executado são oficialmente suportadas pela Oracle Corporation. Para obter informações sobre as plataformas oficialmente suportadas, consulte <https://www.mysql.com/support/supportedplatforms/database.html> no website do MySQL.

2. **Escolha qual distribuição instalar.**

   Várias versões do MySQL estão disponíveis, e a maioria está disponível em diversos formatos de distribuição. Você pode escolher entre distribuições pré-empacotadas contendo programas binários (pré-compilados) ou código source. Em caso de dúvida, use uma distribuição binária. A Oracle também fornece acesso ao código source do MySQL para aqueles que desejam acompanhar desenvolvimentos recentes e testar novos códigos. Para determinar qual versão e tipo de distribuição você deve usar, consulte a Seção 2.1.2, “Qual Versão e Distribuição do MySQL Instalar”.

3. **Faça o Download da distribuição que você deseja instalar.**

   Para obter instruções, consulte a Seção 2.1.3, “Como Obter o MySQL”. Para verificar a integridade da distribuição, use as instruções na Seção 2.1.4, “Verificação da Integridade do Pacote Usando Checksums MD5 ou GnuPG”.

4. **Instale a distribuição.**

   Para instalar o MySQL a partir de uma distribuição binária, use as instruções na Seção 2.2, “Instalando o MySQL em Unix/Linux Usando Binários Genéricos”. Alternativamente, use o Secure Deployment Guide, que fornece procedimentos para implantar uma distribuição binária genérica do MySQL Enterprise Edition Server com recursos para gerenciar a segurança de sua instalação MySQL.

   Para instalar o MySQL a partir de uma distribuição source ou da árvore source de desenvolvimento atual, use as instruções na Seção 2.8, “Instalando o MySQL a Partir do Código Fonte (Source)”.

5. **Execute qualquer configuração pós-instalação necessária.**

   Após instalar o MySQL, consulte a Seção 2.9, “Configuração e Teste Pós-instalação” para obter informações sobre como garantir que o MySQL Server esteja funcionando corretamente. Consulte também as informações fornecidas na Seção 2.9.4, “Protegendo a Conta Inicial do MySQL”. Esta seção descreve como proteger a conta de usuário `root` inicial do MySQL, *que não possui password* até que você atribua um. A seção se aplica se você instalar o MySQL usando uma distribuição binária ou source.

6. Se você deseja executar os scripts de benchmark do MySQL, o suporte Perl para MySQL deve estar disponível. Consulte a Seção 2.12, “Notas de Instalação do Perl”.

Instruções para instalar o MySQL em diferentes plataformas e ambientes estão disponíveis plataforma por plataforma:

* **Unix, Linux**

  Para obter instruções sobre como instalar o MySQL na maioria das plataformas Linux e Unix usando um binário genérico (por exemplo, um pacote `.tar.gz`), consulte a Seção 2.2, “Instalando o MySQL em Unix/Linux Usando Binários Genéricos”.

  Para obter informações sobre como fazer o build do MySQL inteiramente a partir de distribuições de código source ou dos repositórios de código source, consulte a Seção 2.8, “Instalando o MySQL a Partir do Código Fonte (Source)”.

  Para ajuda específica da plataforma sobre instalação, configuração e build a partir do source, consulte a seção de plataforma correspondente:

  + Linux, incluindo notas sobre métodos específicos de distribuição, consulte a Seção 2.5, “Instalando o MySQL no Linux”.

  + Solaris, incluindo os formatos PKG e IPS, consulte a Seção 2.7, “Instalando o MySQL no Solaris”.

  + IBM AIX, consulte a Seção 2.7, “Instalando o MySQL no Solaris”.
* **Microsoft Windows**

  Para obter instruções sobre como instalar o MySQL no Microsoft Windows, usando o MySQL Installer ou o binário Zipped, consulte a Seção 2.3, “Instalando o MySQL no Microsoft Windows”.

  Para detalhes e instruções sobre como fazer o build do MySQL a partir do código source usando o Microsoft Visual Studio, consulte a Seção 2.8, “Instalando o MySQL a Partir do Código Fonte (Source)”.

* **macOS**

  Para instalação no macOS, incluindo o uso do pacote binário e dos formatos PKG nativos, consulte a Seção 2.4, “Instalando o MySQL no macOS”.

  Para obter informações sobre o uso de um macOS Launch Daemon para iniciar e parar o MySQL automaticamente, consulte a Seção 2.4.3, “Instalando um Launch Daemon do MySQL”.

  Para obter informações sobre o Painel de Preferências (Preference Pane) do MySQL, consulte a Seção 2.4.4, “Instalando e Usando o Painel de Preferências do MySQL (Preference Pane)”.