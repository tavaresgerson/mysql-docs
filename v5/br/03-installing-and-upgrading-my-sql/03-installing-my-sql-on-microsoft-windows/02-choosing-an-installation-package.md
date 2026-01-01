### 2.3.2 Escolhendo um pacote de instalação

Para o MySQL 5.7, há vários formatos de pacote de instalação disponíveis para escolher ao instalar o MySQL no Windows. Os formatos de pacote descritos nesta seção são:

- Instalador do MySQL
- Arquivos de compactação MySQL noinstall
- Imagens Docker do MySQL

Os arquivos do Banco de Dados do Programa (PDB) (com a extensão de nome de arquivo `pdb`) fornecem informações para depuração da sua instalação do MySQL em caso de um problema. Esses arquivos estão incluídos nas distribuições de Arquivo ZIP (mas não nas distribuições MSI) do MySQL.

#### Instalador do MySQL

Este pacote tem um nome de arquivo semelhante a `mysql-installer-community-5.7.44.0.msi` ou `mysql-installer-commercial-5.7.44.0.msi` e usa MSI para instalar automaticamente o servidor MySQL e outros produtos. O MySQL Installer baixa e aplica atualizações em si mesmo e em cada um dos produtos instalados. Ele também configura o servidor MySQL instalado (incluindo uma configuração de teste de cluster InnoDB sandbox) e o MySQL Router. O MySQL Installer é recomendado para a maioria dos usuários.

O Instalador do MySQL pode instalar e gerenciar (adicionar, modificar, atualizar e remover) muitos outros produtos do MySQL, incluindo:

- Aplicações – MySQL Workbench, MySQL para Visual Studio, MySQL Utilities, MySQL Shell, MySQL Router

- Conectores – MySQL Connector/C++, MySQL Connector/NET, Connector/ODBC, MySQL Connector/Python, MySQL Connector/J, MySQL Connector/Node.js

- Documentação – Manual do MySQL (formato PDF), amostras e exemplos

O Instalador do MySQL funciona em todas as versões do Windows suportadas pelo MySQL (consulte <https://www.mysql.com/support/supportedplatforms/database.html>).

Nota

Como o Instalador do MySQL não é um componente nativo do Microsoft Windows e depende do .NET, ele não funciona em instalações com opções mínimas, como a versão Server Core do Windows Server.

Para obter instruções sobre como instalar o MySQL usando o Instalador do MySQL, consulte a Seção 2.3.3, “Instalador do MySQL para Windows”.

#### Arquivos de compactação MySQL noinstall

Esses pacotes contêm os arquivos encontrados no pacote de instalação completo do MySQL Server, com exceção da interface gráfica. Esse formato não inclui um instalador automatizado e deve ser instalado e configurado manualmente.

Os arquivos ZIP `noinstall` são divididos em dois arquivos comprimidos separados. O pacote principal é chamado `mysql-VERSION-winx64.zip` para 64 bits e `mysql-VERSION-win32.zip` para 32 bits. Este contém os componentes necessários para usar o MySQL no seu sistema. A suíte de testes opcionais do MySQL, a suíte de benchmarks do MySQL e os componentes binários/informacionais de depuração (incluindo arquivos PDB) estão em um arquivo comprimido separado chamado `mysql-VERSION-winx64-debug-test.zip` para 64 bits e `mysql-VERSION-win32-debug-test.zip` para 32 bits.

Se você optar por instalar um arquivo ZIP `noinstall`, consulte a Seção 2.3.4, “Instalando o MySQL no Microsoft Windows usando um arquivo ZIP \`noinstall’”.

#### Imagens Docker do MySQL

Para obter informações sobre o uso das imagens Docker do MySQL fornecidas pela Oracle na plataforma Windows, consulte a Seção 2.5.7.3, “Implantação do MySQL no Windows e em outras plataformas não Linux com Docker”.

::: warning Aviso
As imagens Docker do MySQL fornecidas pela Oracle são construídas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que executam as imagens Docker do MySQL da Oracle nelas estão fazendo isso por conta própria.
:::