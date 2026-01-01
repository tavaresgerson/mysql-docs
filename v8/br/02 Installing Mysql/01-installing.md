# Capítulo 2: Instalando o MySQL

Este capítulo descreve como obter e instalar o MySQL. Um resumo do procedimento segue, e as seções posteriores fornecem os detalhes. Se você planeja atualizar uma versão existente do MySQL para uma versão mais recente, em vez de instalar o MySQL pela primeira vez, consulte o Capítulo 3, *Atualizando o MySQL*, para obter informações sobre os procedimentos de atualização e sobre os problemas que você deve considerar antes de atualizar.

Se você estiver interessado em migrar para o MySQL a partir de outro sistema de banco de dados, que contém respostas para algumas perguntas comuns sobre problemas de migração.

A instalação do MySQL geralmente segue os passos descritos aqui:

1. **Determine se o MySQL está em execução e é suportado na sua plataforma.**
   Por favor, note que nem todas as plataformas são igualmente adequadas para executar o MySQL, e que nem todas as plataformas nas quais o MySQL é conhecido por ser executado são oficialmente suportadas pela Oracle Corporation. Para obter informações sobre as plataformas que são oficialmente suportadas, consulte <https://www.mysql.com/support/supportedplatforms/database.html> no site do MySQL.

2. **Escolha qual versão instalar.**
   O MySQL oferece uma série LTS, como o MySQL 8.4, e uma série de Inovação. Elas abordam diferentes casos de uso, conforme descrito na Seção 1.3, “Lançamentos do MySQL: Inovação e LTS”.

3. **Escolha qual distribuição instalar.**
   Várias versões do MySQL estão disponíveis, e a maioria está disponível em vários formatos de distribuição. Você pode escolher entre distribuições pré-embaladas contendo programas binários (pré-compilados) ou código-fonte. Quando houver dúvida, use uma distribuição binária. A Oracle também fornece acesso ao código-fonte do MySQL para aqueles que desejam ver desenvolvimentos recentes e testar novos códigos. Para determinar qual versão e tipo de distribuição você deve usar, consulte a Seção 2.1.2, “Qual Versão e Distribuição do MySQL Instalar”.

4. **Baixe a distribuição que você deseja instalar.**
Para obter instruções, consulte a Seção 2.1.3, “Como obter o MySQL”. Para verificar a integridade da distribuição, use as instruções na Seção 2.1.4, “Verificação da integridade do pacote usando verificações MD5 ou GnuPG”.

5. **Instale a distribuição.**
   Para instalar o MySQL a partir de uma distribuição binária, use as instruções na Seção 2.2, “Instalando o MySQL no Unix/Linux usando binários genéricos”. Alternativamente, use o Guia de implantação segura, que fornece procedimentos para implantar uma distribuição binária genérica do MySQL Enterprise Edition Server com recursos para gerenciar a segurança da sua instalação do MySQL.

   Para instalar o MySQL a partir de uma distribuição de código-fonte ou da árvore de código-fonte de desenvolvimento atual, use as instruções na Seção 2.8, “Instalando o MySQL a partir de código-fonte”.

6. **Realize qualquer configuração pós-instalação necessária.**
   Após instalar o MySQL, consulte a Seção 2.9, “Configuração e teste pós-instalação”, para obter informações sobre como garantir que o servidor MySQL esteja funcionando corretamente. Também consulte as informações fornecidas na Seção 2.9.4, “Segurança da conta inicial do MySQL”. Esta seção descreve como proteger a conta inicial do usuário `root` do MySQL, *que não tem senha até que você a atribua*. A seção se aplica independentemente de você instalar o MySQL usando uma distribuição binária ou de código-fonte.

7. Se você quiser executar os scripts de benchmark do MySQL, o suporte do Perl para o MySQL deve estar disponível.

As instruções para instalar o MySQL em diferentes plataformas e ambientes estão disponíveis em uma base de plataforma por plataforma:

* **Unix, Linux**
   Para instruções sobre como instalar o MySQL na maioria das plataformas Linux e Unix usando um binário genérico (por exemplo, um pacote `.tar.gz`).

   Para informações sobre a construção do MySQL inteiramente a partir das distribuições de código-fonte ou dos repositórios de código-fonte.

   Para ajuda específica da plataforma sobre instalação, configuração e construção a partir de código-fonte, consulte a seção da plataforma correspondente:

   + Linux, incluindo notas sobre métodos específicos da distribuição, consulte a Seção 2.5, “Instalando o MySQL no Linux”.
  + IBM AIX, consulte a Seção 2.7, “Instalando o MySQL no Solaris”.

* **Microsoft Windows**
  Para instruções sobre a instalação do MySQL no Microsoft Windows, usando o instalador MSI ou o binário compactado, consulte a Seção 2.3, “Instalando o MySQL no Microsoft Windows”.

  Para detalhes e instruções sobre a construção do MySQL a partir do código-fonte, consulte a Seção 2.8, “Instalando o MySQL a partir do Código-Fonte”.

* **macOS**
  Para instalação no macOS, incluindo o uso de pacotes binários e formatos nativos PKG, consulte a Seção 2.4, “Instalando o MySQL no macOS”.

  Para informações sobre o uso de um Daemon de Inicialização do macOS para iniciar e parar automaticamente o MySQL, consulte a Seção 2.4.3, “Instalando e Usando o Daemon de Inicialização do MySQL”.

  Para informações sobre o Painel de Preferências do MySQL, consulte a Seção 2.4.4, “Instalando e Usando o Painel de Preferências do MySQL”.
