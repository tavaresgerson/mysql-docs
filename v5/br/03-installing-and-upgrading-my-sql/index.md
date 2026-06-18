# Capítulo 2: Instalação e Atualização do MySQL

Este capítulo descreve como obter e instalar o MySQL. Um resumo do procedimento segue, e as seções posteriores fornecem os detalhes. Se você planeja atualizar uma versão existente do MySQL para uma versão mais recente, em vez de instalar o MySQL pela primeira vez, consulte a Seção 2.10, “Atualizando o MySQL”, para obter informações sobre os procedimentos de atualização e sobre os problemas que você deve considerar antes de atualizar.

Se você estiver interessado em migrar para o MySQL a partir de outro sistema de banco de dados, consulte a Seção A.8, “Perguntas frequentes do MySQL 5.7: Migração”, que contém respostas para algumas perguntas comuns sobre questões de migração.

A instalação do MySQL geralmente segue os passos descritos aqui:

1. **Verifique se o MySQL está rodando e é suportado na sua plataforma.**

   Por favor, note que nem todas as plataformas são igualmente adequadas para executar o MySQL e que nem todas as plataformas nas quais o MySQL é conhecido por funcionar são oficialmente suportadas pela Oracle Corporation. Para obter informações sobre as plataformas oficialmente suportadas, consulte <https://www.mysql.com/support/supportedplatforms/database.html> no site do MySQL.

2. **Escolha qual distribuição você quer instalar.**

   Várias versões do MySQL estão disponíveis, e a maioria está disponível em vários formatos de distribuição. Você pode escolher entre distribuições pré-embaladas que contêm programas binários (pré-compilados) ou código-fonte. Se tiver dúvidas, use uma distribuição binária. A Oracle também fornece acesso ao código-fonte do MySQL para aqueles que desejam ver desenvolvimentos recentes e testar novos códigos. Para determinar qual versão e tipo de distribuição você deve usar, consulte a Seção 2.1.2, “Qual versão e distribuição do MySQL instalar”.

3. **Faça o download da distribuição que você deseja instalar.**

   Para obter instruções, consulte a Seção 2.1.3, “Como obter o MySQL”. Para verificar a integridade da distribuição, use as instruções na Seção 2.1.4, “Verificar a integridade do pacote usando verificações MD5 ou GnuPG”.

4. **Instale a distribuição.**

   Para instalar o MySQL a partir de uma distribuição binária, use as instruções na Seção 2.2, “Instalando o MySQL no Unix/Linux Usando Binários Genéricos”. Como alternativa, use o Guia de Implantação Segura, que fornece procedimentos para implantar uma distribuição binária genérica do MySQL Enterprise Edition Server com recursos para gerenciar a segurança da sua instalação do MySQL.

   Para instalar o MySQL a partir de uma distribuição de código-fonte ou da árvore de código-fonte de desenvolvimento atual, use as instruções na Seção 2.8, “Instalando o MySQL a partir de código-fonte”.

5. **Realize qualquer configuração pós-instalação necessária.**

   Após instalar o MySQL, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”, para obter informações sobre como garantir que o servidor MySQL esteja funcionando corretamente. Consulte também as informações fornecidas na Seção 2.9.4, “Segurança da Conta Inicial do MySQL”. Esta seção descreve como proteger a conta inicial do usuário `root` do MySQL, *que não tem senha* até que você a atribua. A seção se aplica se você instalar o MySQL usando uma distribuição binária ou de fonte.

6. Se você quiser executar os scripts de benchmark do MySQL, o suporte do Perl para o MySQL deve estar disponível. Veja a Seção 2.12, “Notas de Instalação do Perl”.

As instruções para instalar o MySQL em diferentes plataformas e ambientes estão disponíveis em uma base de plataforma por plataforma:

- **Unix, Linux**

  Para obter instruções sobre como instalar o MySQL na maioria das plataformas Linux e Unix usando um binário genérico (por exemplo, um pacote `.tar.gz`), consulte a Seção 2.2, “Instalando o MySQL no Unix/Linux usando Binários Genéricos”.

  Para obter informações sobre a construção do MySQL inteiramente a partir das distribuições do código-fonte ou dos repositórios de código-fonte, consulte a Seção 2.8, “Instalando o MySQL a partir do código-fonte”.

  Para obter ajuda específica sobre instalação, configuração e construção a partir da fonte, consulte a seção da plataforma correspondente:

  - Linux, incluindo notas sobre métodos específicos da distribuição, consulte a Seção 2.5, “Instalando o MySQL no Linux”.

  - Solaris, incluindo os formatos PKG e IPS, consulte a Seção 2.7, “Instalando o MySQL no Solaris”.

  - IBM AIX, consulte a Seção 2.7, “Instalando o MySQL no Solaris”.

- **Microsoft Windows**

  Para obter instruções sobre como instalar o MySQL no Microsoft Windows, usando o Instalador do MySQL ou o binário compactado, consulte a Seção 2.3, “Instalando o MySQL no Microsoft Windows”.

  Para obter detalhes e instruções sobre como construir o MySQL a partir do código-fonte usando o Microsoft Visual Studio, consulte a Seção 2.8, “Instalando o MySQL a partir do código-fonte”.

- **macOS**

  Para a instalação no macOS, incluindo o uso dos formatos de pacote binário e PKG nativo, consulte a Seção 2.4, “Instalando o MySQL no macOS”.

  Para obter informações sobre como usar um daemon de inicialização do macOS para iniciar e parar automaticamente o MySQL, consulte a Seção 2.4.3, “Instalando um daemon de inicialização do MySQL”.

  Para obter informações sobre o Painel de Preferências do MySQL, consulte a Seção 2.4.4, “Instalando e Usando o Painel de Preferências do MySQL”.
