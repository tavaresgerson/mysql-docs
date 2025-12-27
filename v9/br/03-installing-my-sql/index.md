# Capítulo 2 Instalando o MySQL

**Índice**

2.1 Orientações Gerais de Instalação:   2.1.1 Plataformas Compatíveis

    2.1.2 Qual Versão e Distribuição do MySQL Instalar

    2.1.3 Como Obter o MySQL

    2.1.4 Verificação da Integridade do Pacote Usando Cálculos de Checksum MD5 ou GnuPG

    2.1.5 Estruturas de Instalação Específicas ao Compilador

2.2 Instalando o MySQL no Unix/Linux Usando Binários Genéricos

2.3 Instalando o MySQL no Microsoft Windows:   2.3.1 Escolhendo um Pacote de Instalação

    2.3.2 Configuração: Usando o Configurator do MySQL

    2.3.3 Configuração: Manualmente

    2.3.4 Solução de Problemas com a Instalação de um Servidor MySQL no Microsoft Windows

    2.3.5 Procedimentos Pós-Instalação no Windows

    2.3.6 Restrições da Plataforma Windows

2.4 Instalando o MySQL no macOS:   2.4.1 Notas Gerais sobre a Instalação do MySQL no macOS

    2.4.2 Instalando o MySQL no macOS Usando Pacotes Nativos

    2.4.3 Instalando e Usando o Daemon de Inicialização do MySQL

    2.4.4 Instalando e Usando o Painel de Preferências do MySQL

2.5 Instalando o MySQL no Linux:   2.5.1 Instalando o MySQL no Linux Usando o Repositório MySQL Yum

    2.5.2 Instalando o MySQL no Linux Usando o Repositório APT

    2.5.3 Usando o Repositório SLES do MySQL

    2.5.4 Instalando o MySQL no Linux Usando Pacotes RPM da Oracle

    2.5.5 Instalando o MySQL no Linux Usando Pacotes Debian da Oracle

    2.5.6 Implantação do MySQL no Linux com Contenedores Docker

    2.5.7 Instalando o MySQL no Linux a partir dos Repositórios de Software Nativos

    2.5.8 Instalando o MySQL no Linux com Juju

    2.5.9 Gerenciando o Servidor MySQL com systemd

2.6 Instalando o MySQL Usando o Unbreakable Linux Network (ULN)

2.7 Instalando o MySQL no Solaris:   2.7.1 Instalando o MySQL no Solaris Usando um PKG Solaris

2.8 Instalação do MySQL a partir da fonte:   2.8.1 Métodos de instalação a partir da fonte

    2.8.2 Pré-requisitos para a instalação a partir da fonte

    2.8.3 Layout do MySQL para a instalação a partir da fonte

    2.8.4 Instalação do MySQL usando uma distribuição de fonte padrão

    2.8.5 Instalação do MySQL usando uma árvore de fonte de desenvolvimento

    2.8.6 Configuração do suporte à biblioteca SSL

    2.8.7 Opções de configuração de fonte do MySQL

    2.8.8 Lidando com problemas de compilação do MySQL

    2.8.9 Configuração e ferramentas de terceiros do MySQL

    2.8.10 Gerenciamento do conteúdo de documentação do Doxygen do MySQL

2.9 Configuração e teste pós-instalação:   2.9.1 Inicialização do diretório de dados

    2.9.2 Início do servidor

    2.9.3 Teste do servidor

    2.9.4 Proteção da conta inicial do MySQL

    2.9.5 Início e parada automáticas do MySQL

2.10 Notas sobre a instalação do Perl:   2.10.1 Instalação do Perl no Unix

    2.10.2 Instalação do ActiveState Perl no Windows

    2.10.3 Problemas ao usar a interface DBI/DBD do Perl

Este capítulo descreve como obter e instalar o MySQL. Um resumo do procedimento segue, e as seções subsequentes fornecem os detalhes. Se você planeja atualizar uma versão existente do MySQL para uma versão mais recente, em vez de instalar o MySQL pela primeira vez, consulte o Capítulo 3, *Atualizando o MySQL*, para obter informações sobre os procedimentos de atualização e sobre os problemas que você deve considerar antes de atualizar.

Se você estiver interessado em migrar para o MySQL a partir de outro sistema de banco de dados, consulte a Seção A.8, “MySQL 9.5 FAQ: Migração”, que contém respostas para algumas perguntas comuns sobre problemas de migração.

A instalação do MySQL geralmente segue os passos descritos aqui:

1. **Determine se o MySQL está em execução e é suportado na sua plataforma.**

Por favor, note que nem todas as plataformas são igualmente adequadas para rodar o MySQL, e que nem todas as plataformas nas quais o MySQL é conhecido por rodar são oficialmente suportadas pela Oracle Corporation. Para obter informações sobre as plataformas oficialmente suportadas, consulte <https://www.mysql.com/support/supportedplatforms/database.html> no site do MySQL.

2. **Escolha qual trilha instalar.**

   O MySQL oferece uma série LTS, como o MySQL 8.4, e uma série de Inovação, como o 9.5. Elas atendem a diferentes casos de uso, conforme descrito na Seção 1.3, “Lançamentos do MySQL: Inovação e LTS”.

3. **Escolha qual distribuição instalar.**

   Várias versões do MySQL estão disponíveis, e a maioria está disponível em vários formatos de distribuição. Você pode escolher entre distribuições pré-embaladas contendo programas binários (pré-compilados) ou código-fonte. Quando tiver dúvidas, use uma distribuição binária. A Oracle também fornece acesso ao código-fonte do MySQL para aqueles que desejam ver desenvolvimentos recentes e testar novos códigos. Para determinar qual versão e tipo de distribuição você deve usar, consulte a Seção 2.1.2, “Qual versão e distribuição do MySQL instalar”.

4. **Baixe a distribuição que você deseja instalar.**

   Para obter instruções, consulte a Seção 2.1.3, “Como obter o MySQL”. Para verificar a integridade da distribuição, use as instruções na Seção 2.1.4, “Verificando a integridade do pacote usando verificações MD5 ou GnuPG”.

5. **Instale a distribuição.**

   Para instalar o MySQL a partir de uma distribuição binária, use as instruções na Seção 2.2, “Instalando o MySQL no Unix/Linux usando binários genéricos”. Alternativamente, use o Guia de Implantação Segura, que fornece procedimentos para implantar uma distribuição binária genérica do MySQL Enterprise Edition Server com recursos para gerenciar a segurança da sua instalação do MySQL.

Para instalar o MySQL a partir de uma distribuição de fonte ou da árvore de fontes de desenvolvimento atual, use as instruções na Seção 2.8, “Instalando o MySQL a partir da Fonte”.

6. **Realize qualquer configuração pós-instalação necessária.**

   Após instalar o MySQL, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”, para obter informações sobre como garantir que o servidor MySQL esteja funcionando corretamente. Também consulte as informações fornecidas na Seção 2.9.4, “Segurança da Conta Inicial do MySQL”. Esta seção descreve como proteger a conta inicial do usuário `root` do MySQL, *que não tem senha até que você a atribua*. A seção se aplica se você instalar o MySQL usando uma distribuição binária ou de fonte.

7. Se você quiser executar os scripts de benchmark do MySQL, o suporte do Perl para o MySQL deve estar disponível. Consulte a Seção 2.10, “Notas de Instalação do Perl”.

As instruções para instalar o MySQL em diferentes plataformas e ambientes estão disponíveis em uma base de plataforma:

* **Unix, Linux**

  Para instruções sobre como instalar o MySQL na maioria das plataformas Linux e Unix usando um binário genérico (por exemplo, um pacote `.tar.gz`), consulte a Seção 2.2, “Instalando o MySQL no Unix/Linux Usando Binários Genéricos”.

  Para informações sobre a construção do MySQL inteiramente a partir das distribuições de código-fonte ou dos repositórios de código-fonte, consulte a Seção 2.8, “Instalando o MySQL a partir da Fonte”

  Para ajuda específica da plataforma sobre instalação, configuração e construção a partir da fonte, consulte a seção correspondente da plataforma:

  + Linux, incluindo notas sobre métodos específicos da distribuição, consulte a Seção 2.5, “Instalando o MySQL no Linux”.

  + IBM AIX, consulte a Seção 2.7, “Instalando o MySQL no Solaris”.
* **Microsoft Windows**

Para obter instruções sobre como instalar o MySQL no Microsoft Windows, usando o instalador MSI ou o binário compactado, consulte a Seção 2.3, “Instalando o MySQL no Microsoft Windows”.

Para obter detalhes e instruções sobre a construção do MySQL a partir do código-fonte, consulte a Seção 2.8, “Instalando o MySQL a partir do Código-Fonte”.

* **macOS**

  Para instalação no macOS, incluindo o uso de pacotes binários e formatos nativos PKG, consulte a Seção 2.4, “Instalando o MySQL no macOS”.

  Para obter informações sobre o uso de um daemon de inicialização do macOS para iniciar e parar automaticamente o MySQL, consulte a Seção 2.4.3, “Instalando e Usando o Daemon de Inicialização do MySQL”.

  Para obter informações sobre o Painel de Preferências do MySQL, consulte a Seção 2.4.4, “Instalando e Usando o Painel de Preferências do MySQL”.