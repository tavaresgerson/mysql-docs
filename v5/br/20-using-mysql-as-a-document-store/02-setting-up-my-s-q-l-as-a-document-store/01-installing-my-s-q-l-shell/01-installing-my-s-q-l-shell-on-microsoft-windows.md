#### 19.2.1.1 Instalando o MySQL Shell no Microsoft Windows

Importante

A versão Community do MySQL Shell requer o Visual C++ Redistributable for Visual Studio 2013 (disponível no Microsoft Download Center) para funcionar; certifique-se de que ele esteja instalado no seu sistema Windows antes de instalar o MySQL Shell.

Nota

O MySQL Shell atualmente não é fornecido com um MSI Installer. Consulte Instalando os Binaries do MySQL Shell para o procedimento de instalação manual.

Para instalar o MySQL Shell no Microsoft Windows usando o MSI Installer, faça o seguinte:

1. Faça o download do pacote **Windows (x86, 64-bit), MSI Installer** em <http://dev.mysql.com/downloads/shell/>.

2. Quando solicitado, clique em Run (Executar).
3. Siga os passos no Assistente de Configuração (Setup Wizard).

   **Figura 19.1 Instalação do MySQL Shell no Windows**

   ![Installation of MySQL Shell on Windows](images/x-installation-mysql-shell-win.png)

Se você instalou o MySQL sem habilitar o X Plugin, e depois decidir que deseja instalar o X Plugin, ou se você estiver instalando o MySQL *sem* usar o MySQL Installer, consulte Instalando o X Plugin.

##### Instalando os Binaries do MySQL Shell

Para instalar os binaries do MySQL Shell:

1. Descompacte o conteúdo do arquivo Zip para o diretório de produtos MySQL, por exemplo `C:\Program Files\MySQL\`.

2. Para poder iniciar o MySQL Shell a partir de um prompt de comando, adicione o diretório `bin`, por exemplo `C:\Program Files\MySQL\mysql-shell-1.0.8-rc-windows-x86-64bit\bin`, à variável de sistema `PATH`.