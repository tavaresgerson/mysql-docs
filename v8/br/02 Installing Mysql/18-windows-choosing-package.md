### 2.3.1 Escolha de um pacote de instalação

Para o MySQL 8.4, existem vários formatos de pacotes de instalação para escolher ao instalar o MySQL no Windows. Os formatos de pacotes descritos nesta seção são:

- Instalação do MySQL MSI
- Arquivos ZIP noinstall do MySQL
- Imagens do Docker do MySQL

#### Instalação do MySQL MSI

Este pacote tem um nome de arquivo semelhante a `mysql-community-8.4.6.msi` ou `mysql-commercial-8.4.6.msi`, e instala o servidor MySQL juntamente com o MySQL Configurator. O MSI inclui um aplicativo MySQL Configurator que é recomendado para a maioria dos usuários para configurar e reconfigurar o servidor MySQL.

O MSI e o MySQL Configurator funcionam em todas as versões do Windows compatíveis com o MySQL (ver <https://www.mysql.com/support/supportedplatforms/database.html>). Para instruções sobre como configurar o MySQL usando o MySQL Configurator, consulte a Seção 2.3.2,  Configuração: Usando o MySQL Configurator.

#### Arquivos ZIP noinstall do MySQL

Esses pacotes contêm os arquivos encontrados no pacote de instalação completo do MySQL Server, com exceção da GUI. Este formato não inclui um instalador automatizado, mas inclui o MySQL Configurator para configurar o servidor MySQL.

Os arquivos ZIP `noinstall` são divididos em dois arquivos comprimidos separados. O pacote principal é chamado `mysql-VERSION-winx64.zip`. Este contém os componentes necessários para usar o MySQL em seu sistema. O conjunto de testes opcional do MySQL, o conjunto de benchmark do MySQL e os componentes de depuração de binários / informações (incluindo arquivos PDB) estão em um arquivo comprimido separado chamado `mysql-VERSION-winx64-debug-test.zip`.

Program Database (PDB) arquivos (com extensão de nome de arquivo `pdb`) fornecer informações para depurar sua instalação do MySQL em caso de um problema. Estes arquivos estão incluídos nas distribuições de arquivo ZIP (mas não distribuições MSI) do MySQL.

Para instalar o MySQL extraindo o arquivo Zip em vez de usar o MSI, considere o seguinte:

1. Se você estiver atualizando de uma versão anterior, consulte a Seção 3.11, "Atualização do MySQL no Windows", antes de iniciar o processo de atualização.

2. Certifique-se de que você está logado como um usuário com privilégios de administrador.

3. Escolha um local de instalação. Tradicionalmente, o servidor MySQL é instalado em `C:\mysql`. Se você não instalar o MySQL em `C:\mysql`, você deve especificar o caminho para o diretório de instalação durante a inicialização ou em um arquivo de opção. Veja Seção 2.3.3.2, Criando um Arquivo de Opção.

   ::: info Note

   O MSI instala o MySQL sob `C:\Program Files\MySQL\MySQL Server 8.4\`.

   :::

4. Extrair o arquivo de instalação para o local de instalação escolhido usando sua ferramenta de compressão de arquivos preferida. Algumas ferramentas podem extrair o arquivo para uma pasta dentro do local de instalação escolhido. Se isso ocorrer, você pode mover o conteúdo da sub pasta para o local de instalação escolhido.

5. Configure o servidor MySQL usando o MySQL Configurator (recomendado) ou a Seção 2.3.3, Configuração: Manualmente.

#### Imagens do Docker do MySQL

Para obter informações sobre o uso das imagens do MySQL Docker fornecidas pela Oracle na plataforma Windows, consulte a Seção 2.5.6.3, "Deploying MySQL on Windows and Other Non-Linux Platforms with Docker".

Aviso

As imagens do MySQL Docker fornecidas pela Oracle são criadas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que executam as imagens do MySQL Docker da Oracle nelas o fazem por sua própria conta e risco.
