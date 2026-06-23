# Capítulo 2: Instalação do MySQL

Este capítulo descreve como obter e instalar o MySQL. Um resumo do procedimento segue, e as seções subsequentes fornecem os detalhes. Se você planeja atualizar uma versão existente do MySQL para uma versão mais recente, em vez de instalar o MySQL pela primeira vez, consulte o Capítulo 3, *Atualizando o MySQL*, para informações sobre os procedimentos de atualização e sobre os problemas que você deve considerar antes de atualizar.

Se você está interessado em migrar para o MySQL a partir de outro sistema de banco de dados, consulte a Seção A.8, “Perguntas frequentes do MySQL 8.0: Migração”, que contém respostas para algumas perguntas comuns sobre questões de migração.

A instalação do MySQL geralmente segue os passos descritos aqui:

1. **Verifique se o MySQL está em execução e se é suportado na sua plataforma.**

Por favor, note que nem todas as plataformas são igualmente adequadas para executar o MySQL, e que nem todas as plataformas nas quais o MySQL é conhecido por ser executado são oficialmente suportadas pela Oracle Corporation. Para informações sobre as plataformas que são oficialmente suportadas, consulte <https://www.mysql.com/support/supportedplatforms/database.html> no site do MySQL.

2. **Escolha a distribuição que você deseja instalar.**

Várias versões do MySQL estão disponíveis, e a maioria está disponível em vários formatos de distribuição. Você pode escolher entre distribuições pré-embaladas que contêm programas binários (pré-compilados) ou código-fonte. Quando houver dúvida, use uma distribuição binária. A Oracle também fornece acesso ao código-fonte do MySQL para aqueles que desejam ver desenvolvimentos recentes e testar novos códigos. Para determinar qual versão e tipo de distribuição você deve usar, consulte a Seção 2.1.2, “Qual versão do MySQL e distribuição instalar”.

3. **Escolha qual faixa você quer instalar.**

O MySQL oferece um caminho de correção de bugs (como o MySQL 8.4) e um caminho de inovação (hoje é o MySQL 9.5) e cada caminho aborda diferentes casos de uso. Ambos os caminhos são considerados prontos para produção e incluem correções de bugs, enquanto as versões de inovação também incluem novas funcionalidades e potencial para comportamento modificado.

Uma atualização de trilha de correção de bugs inclui lançamentos pontuais, como o MySQL 8.4.*`x`* sendo atualizado para 8.4.*`y`, enquanto os lançamentos de trilha de inovação geralmente têm apenas lançamentos menores, como o MySQL 9.5.0 sendo atualizado para 9.6.0. No entanto, uma trilha de inovação tem a ocasional atualização pontuada.

4. **Baixe a distribuição que você deseja instalar.**

Para obter instruções, consulte a Seção 2.1.3, “Como obter o MySQL”. Para verificar a integridade da distribuição, use as instruções na Seção 2.1.4, “Verificando a integridade do pacote usando verificações MD5 ou GnuPG”.

5. **Instale a distribuição.**

Para instalar o MySQL a partir de uma distribuição binária, use as instruções na Seção 2.2, “Instalando o MySQL em Unix/Linux usando Binários Gerenciais”. Alternativamente, use o [Guia de Implantação Segura][(/doc/mysql-secure-deployment-guide/8.0/en/)], que fornece procedimentos para implantar uma distribuição binária gerencial do MySQL Enterprise Edition Server com recursos para gerenciar a segurança da sua instalação do MySQL.

Para instalar o MySQL a partir de uma distribuição de fonte ou da árvore de fonte de desenvolvimento atual, use as instruções na Seção 2.8, “Instalando o MySQL a partir de fonte”.

6. **Realize qualquer configuração pós-instalação necessária.**

Após instalar o MySQL, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”, para obter informações sobre como garantir que o servidor MySQL esteja funcionando corretamente. Também consulte as informações fornecidas na Seção 2.9.4, “Segurança da Conta Inicial do MySQL”. Esta seção descreve como proteger a conta inicial do usuário `root` do MySQL, *que não tem senha*, até que você a atribua. A seção se aplica se você instalar o MySQL usando uma distribuição binária ou de fonte.

7. Se você deseja executar os scripts de benchmark do MySQL, o suporte Perl para MySQL deve estar disponível. Veja a Seção 2.10, “Notas de instalação do Perl”.

As instruções para instalar o MySQL em diferentes plataformas e ambientes estão disponíveis em uma base por plataforma:

* **Unix, Linux**

Para obter instruções sobre como instalar o MySQL na maioria das plataformas Linux e Unix usando um binário genérico (por exemplo, um pacote `.tar.gz`, veja a Seção 2.2, “Instalando MySQL em Unix/Linux usando Binários Genéricos”.

Para obter informações sobre a construção do MySQL inteiramente a partir das distribuições do código-fonte ou dos repositórios de código-fonte, consulte a Seção 2.8, “Instalando o MySQL a partir do código-fonte”.

Para obter ajuda específica sobre instalação, configuração e construção a partir de fontes, consulte a seção correspondente à plataforma:

+ Linux, incluindo notas sobre métodos específicos da distribuição, veja a Seção 2.5, “Instalando MySQL no Linux”.

+ IBM AIX, veja a Seção 2.7, “Instalando MySQL no Solaris”.
* **Microsoft Windows**

Para obter instruções sobre como instalar o MySQL no Microsoft Windows, usando o Instalador MySQL ou o binário compactado, consulte a Seção 2.3, “Instalando o MySQL no Microsoft Windows”.

Para obter detalhes e instruções sobre como construir o MySQL a partir do código-fonte usando o Microsoft Visual Studio, consulte a Seção 2.8, “Instalando MySQL a partir do código-fonte”.

* **macOS**

Para a instalação no macOS, incluindo o uso de pacotes binários e formatos nativos PKG, consulte a Seção 2.4, “Instalando o MySQL no macOS”.

Para obter informações sobre como usar um Launch Daemon do macOS para iniciar e parar automaticamente o MySQL, consulte a Seção 2.4.3, “Instalando e usando o Launch Daemon do MySQL”.

Para obter informações sobre o Painel de Preferências do MySQL, consulte a Seção 2.4.4, “Instalando e usando o Painel de Preferências do MySQL”.