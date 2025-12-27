### 2.3.2 Configuração: Usando o Configurável MySQL

2.3.2.1 Configuração do Servidor MySQL com o Configurável MySQL

2.3.2.2 CLI do Configurável MySQL

O Configurável MySQL é uma aplicação autônoma projetada para facilitar a complexidade da configuração de um servidor MySQL para executar o MySQL no Microsoft Windows. Ele vem junto com o servidor MySQL, tanto no arquivo MSI quanto no arquivo Zip autônomo.

#### Métodos para Iniciar o Configurável MySQL

O Configurável MySQL pode tanto configurar quanto reconfigurar o servidor MySQL; e os métodos para iniciar o Configurável MySQL são:

* O prompt do MSI do servidor MySQL solicita a execução do Configurável MySQL imediatamente após ele instalar o servidor MySQL.

* No Menu Iniciar: o MSI cria um item de menu de inicialização do Configurável MySQL.

* Da linha de comando: o executável `mysql-configurator.exe` está localizado no mesmo diretório que o `mysqld.exe` e outros binários MySQL instalados com o servidor MySQL.

Normalmente, esse local está em `C:\Program Files\MySQL\MySQL Server X.Y\bin` se instalado via MSI, ou um diretório personalizado para o arquivo Zip.