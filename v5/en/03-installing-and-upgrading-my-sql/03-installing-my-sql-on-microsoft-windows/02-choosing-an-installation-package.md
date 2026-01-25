### 2.3.2 Escolhendo um Pacote de Instalação

Para o MySQL 5.7, há múltiplos formatos de pacotes de instalação para escolher ao instalar o MySQL no Windows. Os formatos de pacotes descritos nesta seção são:

* MySQL Installer
* MySQL noinstall ZIP Archives
* MySQL Docker Images

Arquivos Program Database (PDB) (com a extensão de nome de arquivo `pdb`) fornecem informações para depurar sua instalação do MySQL no caso de um problema. Esses arquivos estão incluídos nas distribuições ZIP Archive (mas não nas distribuições MSI) do MySQL.

#### MySQL Installer

Este pacote tem um nome de arquivo similar a `mysql-installer-community-5.7.44.0.msi` ou `mysql-installer-commercial-5.7.44.0.msi`, e usa MSIs para instalar automaticamente o MySQL server e outros produtos. O MySQL Installer baixa e aplica atualizações para si mesmo, e para cada um dos produtos instalados. Ele também configura o MySQL server instalado (incluindo uma configuração de teste de cluster InnoDB tipo sandbox) e o MySQL Router. O MySQL Installer é recomendado para a maioria dos usuários.

O MySQL Installer pode instalar e gerenciar (adicionar, modificar, atualizar e remover) muitos outros produtos MySQL, incluindo:

* Aplicações – MySQL Workbench, MySQL for Visual Studio, MySQL Utilities, MySQL Shell, MySQL Router

* Connectors – MySQL Connector/C++, MySQL Connector/NET, Connector/ODBC, MySQL Connector/Python, MySQL Connector/J, MySQL Connector/Node.js

* Documentação – MySQL Manual (formato PDF), samples e exemplos

O MySQL Installer opera em todas as versões do Windows suportadas pelo MySQL (consulte <https://www.mysql.com/support/supportedplatforms/database.html>).

Nota

Como o MySQL Installer não é um componente nativo do Microsoft Windows e depende do .NET, ele não funciona em instalações com opções mínimas, como a versão Server Core do Windows Server.

Para obter instruções sobre como instalar o MySQL usando o MySQL Installer, consulte a Seção 2.3.3, “MySQL Installer para Windows”.

#### MySQL noinstall ZIP Archives

Estes pacotes contêm os arquivos encontrados no pacote de instalação completo do MySQL Server, com exceção da GUI. Este formato não inclui um instalador automatizado e deve ser instalado e configurado manualmente.

Os arquivos ZIP Archive `noinstall` são divididos em dois arquivos compactados separados. O pacote principal é nomeado `mysql-VERSION-winx64.zip` para 64-bit e `mysql-VERSION-win32.zip` para 32-bit. Este contém os componentes necessários para usar o MySQL em seu sistema. Opcionalmente, o conjunto de testes do MySQL, o conjunto de benchmarks do MySQL e os componentes de binários/informações de depuração (incluindo arquivos PDB) estão em um arquivo compactado separado nomeado `mysql-VERSION-winx64-debug-test.zip` para 64-bit e `mysql-VERSION-win32-debug-test.zip` para 32-bit.

Se você optar por instalar um ZIP Archive `noinstall`, consulte a Seção 2.3.4, “Instalando o MySQL no Microsoft Windows Usando um ZIP Archive `noinstall`”.

#### MySQL Docker Images

Para obter informações sobre como usar as Imagens Docker do MySQL fornecidas pela Oracle na plataforma Windows, consulte a Seção 2.5.7.3, “Fazendo o Deploy do MySQL no Windows e Outras Plataformas Não-Linux com Docker”.

Aviso

As Imagens Docker do MySQL fornecidas pela Oracle são construídas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que executam as Imagens Docker do MySQL da Oracle nelas o fazem por sua conta e risco.