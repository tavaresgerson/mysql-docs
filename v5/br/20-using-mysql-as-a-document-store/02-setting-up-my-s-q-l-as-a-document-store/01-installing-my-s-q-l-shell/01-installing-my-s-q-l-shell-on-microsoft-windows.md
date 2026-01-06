#### 19.2.1.1 Instalar o MySQL Shell no Microsoft Windows

Importante

A versão da Comunidade do MySQL Shell exige o Visual C++ Redistributable para o Visual Studio 2013 (disponível no Centro de Baixadas da Microsoft) para funcionar; certifique-se de que ele esteja instalado no seu sistema Windows antes de instalar o MySQL Shell.

Nota

Atualmente, o MySQL Shell não vem com um instalador MSI. Consulte Instalação manual do MySQL Shell para o procedimento de instalação manual.

Para instalar o MySQL Shell no Microsoft Windows usando o instalador MSI, faça o seguinte:

1. Baixe o pacote **Windows (x86, 64 bits), MSI Installer** em <http://dev.mysql.com/downloads/shell/>.

2. Quando solicitado, clique em Executar.

3. Siga os passos do Assistente de Configuração.

   **Figura 19.1 Instalação do MySQL Shell no Windows**

   ![Instalação do MySQL Shell no Windows](images/x-installation-mysql-shell-win.png)

Se você instalou o MySQL sem habilitar o Plugin X, depois decidir que deseja instalar o Plugin X, ou se você estiver instalando o MySQL *sem* usar o Instalador do MySQL, consulte Instalar o Plugin X.

##### Instalando binários do MySQL Shell

Para instalar os binários do MySQL Shell:

1. Descompacte o conteúdo do arquivo Zip para o diretório de produtos do MySQL, por exemplo, `C:\Program Files\MySQL\`.

2. Para poder iniciar o MySQL Shell a partir de um prompt de comando, adicione o diretório bin `C:\Program Files\MySQL\mysql-shell-1.0.8-rc-windows-x86-64bit\bin` à variável de sistema `PATH`.
