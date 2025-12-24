### 2.3.2 Configuração: Usando o configurador MySQL

O MySQL Configurator é um aplicativo autônomo projetado para facilitar a complexidade de configurar um servidor MySQL para executar o MySQL no Microsoft Windows.

#### Métodos para iniciar o configurador do MySQL

O MySQL Configurator pode configurar e reconfigurar o servidor MySQL; e os métodos para iniciar o MySQL Configurator são:

- O MSI do servidor MySQL solicita a execução do MySQL Configurator imediatamente após a instalação do servidor MySQL.
- Do menu Iniciar: o MSI cria um item do menu Iniciar do configurador MySQL.
- Da linha de comando: o `mysql-configurator.exe` executável está localizado no mesmo diretório que `mysqld.exe` e outros binários do MySQL instalados com o servidor MySQL.

  Normalmente, esse local está em `C:\Program Files\MySQL\MySQL Server X.Y\bin` se instalado via MSI, ou um diretório personalizado para o arquivo Zip.
