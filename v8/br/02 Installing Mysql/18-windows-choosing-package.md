### 2.3.1 Escolhendo um Pacote de Instalação

Para o MySQL 8.4, existem vários formatos de pacotes de instalação disponíveis ao instalar o MySQL no Windows. Os formatos de pacotes descritos nesta seção são:

*  Pacote de Instalação MySQL MSI
*  Arquivos ZIP noinstall MySQL
*  Imagens Docker MySQL

#### Pacote de Instalação MySQL MSI

Este pacote tem um nome de arquivo semelhante a `mysql-community-8.4.6.msi` ou `mysql-commercial-8.4.6.msi`, e instala o servidor MySQL juntamente com o MySQL Configurator. O MSI inclui um aplicativo MySQL Configurator que é recomendado para a maioria dos usuários para configurar, configurar e reconfigurar o servidor MySQL.

O MSI e o MySQL Configurator funcionam em todas as versões do MySQL suportadas pelo Windows (consulte <https://www.mysql.com/support/supportedplatforms/database.html>). Para instruções sobre como configurar o MySQL usando o MySQL Configurator, consulte a Seção 2.3.2, “Configuração: Usando o MySQL Configurator”.

#### Arquivos ZIP noinstall MySQL

Esses pacotes contêm os arquivos encontrados no pacote completo de instalação do MySQL Server, com exceção da GUI. Este formato não inclui um instalador automatizado, mas inclui o MySQL Configurator para configurar o servidor MySQL.

Os arquivos ZIP `noinstall` são divididos em dois arquivos comprimidos separados. O pacote principal é nomeado `mysql-VERSION-winx64.zip`. Este contém os componentes necessários para usar o MySQL no seu sistema. A suíte de testes MySQL opcional, a suíte de benchmarks MySQL e os componentes de binários/informação de depuração (incluindo arquivos PDB) estão em um arquivo comprimido separado nomeado `mysql-VERSION-winx64-debug-test.zip`.

Os arquivos (PDB) do Programa de Banco de Dados (PDB) (com a extensão de arquivo `pdb`) fornecem informações para depuração da sua instalação MySQL em caso de um problema. Esses arquivos estão incluídos nas distribuições de Arquivos ZIP (mas não nas distribuições MSI) do MySQL.

Para instalar o MySQL extraindo o arquivo ZIP em vez de usar o MSI, considere o seguinte:

1. Se você está atualizando de uma versão anterior, consulte a Seção 3.11, “Atualizando o MySQL no Windows”, antes de começar o processo de atualização.
2. Certifique-se de que você está logado como um usuário com privilégios de administrador.
3. Escolha um local de instalação. Tradicionalmente, o servidor MySQL é instalado em `C:\mysql`. Se você não instalar o MySQL em `C:\mysql`, você deve especificar o caminho para o diretório de instalação durante a inicialização ou em um arquivo de opção. Veja a Seção 2.3.3.2, “Criando um Arquivo de Opção”.

   ::: info Nota

   O MSI instala o MySQL em `C:\Program Files\MySQL\MySQL Server 8.4\`.

   :::

4. Extraia o arquivo de instalação para o local de instalação escolhido usando sua ferramenta de compactação de arquivos preferida. Algumas ferramentas podem extrair o arquivo para uma pasta dentro do local de instalação escolhido. Se isso ocorrer, você pode mover o conteúdo da subpasta para o local de instalação escolhido.
5. Configure o servidor MySQL usando o MySQL Configurator (recomendado) ou a Seção 2.3.3, “Configuração: Manualmente”.

#### Imagens Docker do MySQL

Para obter informações sobre o uso das imagens Docker do MySQL fornecidas pela Oracle na plataforma Windows, consulte a Seção 2.5.6.3, “Deployando o MySQL no Windows e em Outras Plataformas Não Linux com Docker”.

Aviso

As imagens Docker do MySQL fornecidas pela Oracle são construídas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que executam as imagens Docker do MySQL da Oracle nelas estão fazendo isso por conta própria.