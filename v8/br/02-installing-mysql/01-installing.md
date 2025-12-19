# Capítulo 2 Instalação do MySQL

Este capítulo descreve como obter e instalar o MySQL. Um resumo do procedimento segue e seções posteriores fornecem os detalhes. Se você planeja atualizar uma versão existente do MySQL para uma versão mais nova em vez de instalar o MySQL pela primeira vez, consulte o Capítulo 3, \* Atualização do MySQL \*, para obter informações sobre procedimentos de atualização e sobre problemas que você deve considerar antes da atualização.

Se você estiver interessado em migrar para o MySQL a partir de outro sistema de banco de dados, consulte a Seção A.8, MySQL 8.4 FAQ: Migração, que contém respostas a algumas perguntas comuns sobre questões de migração.

A instalação do MySQL geralmente segue as etapas descritas aqui:

1. \*\* Determine se o MySQL é executado e suportado na sua plataforma. \*\*

   Por favor, note que nem todas as plataformas são igualmente adequadas para executar o MySQL, e que nem todas as plataformas em que o MySQL é conhecido para executar são oficialmente suportadas pela Oracle Corporation.
2. \*\* Escolha qual trilha instalar. \*\*

   O MySQL oferece uma série LTS, como o MySQL 8.4, e uma série Innovation.
3. \*\* Escolha qual distribuição instalar. \*\*

   Várias versões do MySQL estão disponíveis, e a maioria está disponível em vários formatos de distribuição. Você pode escolher entre distribuições pré-empacotadas contendo programas binários (pré-compilados) ou código-fonte. Em caso de dúvida, use uma distribuição binária. A Oracle também fornece acesso ao código-fonte do MySQL para aqueles que querem ver desenvolvimentos recentes e testar novos códigos. Para determinar qual versão e tipo de distribuição você deve usar, consulte a Seção 2.1.2, Qual versão do MySQL e distribuição para instalar.
4. \*\* Descarregue a distribuição que deseja instalar. \*\*

   Para obter instruções, consulte a Seção 2.1.3, "Como obter o MySQL" Para verificar a integridade da distribuição, use as instruções da Seção 2.1.4, "Verificar a integridade do pacote usando somas de verificação MD5 ou GnuPG".
5. \*\* Instalar a distribuição. \*\*

   Para instalar o MySQL a partir de uma distribuição binária, use as instruções na Seção 2.2, Instalar o MySQL no Unix/Linux Usando Binários Genéricos. Alternativamente, use o Guia de Implantação Segura, que fornece procedimentos para implantar uma distribuição binária genérica do MySQL Enterprise Edition Server com recursos para gerenciar a segurança de sua instalação do MySQL.

   Para instalar o MySQL a partir de uma distribuição de origem ou da árvore de origem de desenvolvimento atual, use as instruções na Seção 2.8, Instalar o MySQL a partir da Fonte.
6. \*\* Realizar todas as configurações necessárias após a instalação. \*\*

   Depois de instalar o MySQL, consulte a Seção 2.9, Postinstallation Setup and Testing, para obter informações sobre como certificar-se de que o servidor MySQL está funcionando corretamente. Também consulte as informações fornecidas na Seção 2.9.4, Securing the Initial MySQL Account. Esta seção descreve como proteger a conta de usuário inicial do MySQL `root`, *que não tem senha até você atribuir uma*. A seção se aplica se você instalar o MySQL usando uma distribuição binária ou de origem.
7. Se você quiser executar os scripts de benchmark do MySQL, o suporte do Perl para o MySQL deve estar disponível.

Instruções para instalar o MySQL em diferentes plataformas e ambientes está disponível em uma plataforma por plataforma:

- \*\* Unix, Linux \*\*

  Para obter instruções sobre a instalação do MySQL na maioria das plataformas Linux e Unix usando um binário genérico (por exemplo, um pacote `.tar.gz`), consulte a Seção 2.2, Instalar o MySQL no Unix/Linux Usando Binários Genéricos.

  Para obter informações sobre a construção do MySQL inteiramente a partir das distribuições de código-fonte ou dos repositórios de código-fonte, consulte a Seção 2.8, Instalar o MySQL a partir do Source

  Para ajuda específica da plataforma sobre instalação, configuração e construção a partir da fonte, consulte a seção de plataforma correspondente:

  - Linux, incluindo notas sobre métodos específicos de distribuição, ver Seção 2.5, "Instalar MySQL no Linux".
  - IBM AIX, ver Seção 2.7, "Instalar MySQL no Solaris".
- - Microsoft Windows \*

  Para obter instruções sobre a instalação do MySQL no Microsoft Windows, usando o instalador MSI ou o binário Zipped, consulte a Seção 2.3, Instalar o MySQL no Microsoft Windows.

  Para detalhes e instruções sobre a construção do MySQL a partir do código-fonte, consulte a Seção 2.8, "Instalar o MySQL a partir do código-fonte".
- **macOS**

  Para a instalação no macOS, incluindo o uso do pacote binário e dos formatos PKG nativos, consulte a Seção 2.4, "Instalar o MySQL no macOS".

  Para obter informações sobre o uso de um Daemon de Lançamento do macOS para iniciar e parar automaticamente o MySQL, consulte a Seção 2.4.3, "Instalar e usar o Daemon de Lançamento do MySQL".

  Para obter informações sobre o painel de preferências do MySQL, consulte a secção 2.4.4, "Instalar e utilizar o painel de preferências do MySQL".
