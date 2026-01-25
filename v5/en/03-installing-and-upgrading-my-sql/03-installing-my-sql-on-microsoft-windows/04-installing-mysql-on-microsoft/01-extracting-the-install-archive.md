#### 2.3.4.1 Extraindo o Arquivo de Instalação

Para instalar o MySQL manualmente, faça o seguinte:

1. Se você estiver fazendo upgrade de uma versão anterior, consulte a Seção 2.10.8, “Atualizando o MySQL no Windows”, antes de iniciar o processo de upgrade.

2. Certifique-se de estar autenticado como um usuário com privilégios de administrador.

3. Escolha um local de instalação. Tradicionalmente, o servidor MySQL é instalado em `C:\mysql`. Se você não instalar o MySQL em `C:\mysql`, você deve especificar o path para o diretório de instalação durante o startup ou em um option file. Consulte a Seção 2.3.4.2, “Criando um Option File”.

   Note

   O MySQL Installer instala o MySQL em `C:\Program Files\MySQL`.

4. Extraia o arquivo de instalação para o local de instalação escolhido, utilizando sua ferramenta de compressão de arquivo de preferência. Algumas ferramentas podem extrair o archive para uma pasta dentro do local de instalação escolhido. Se isso ocorrer, você pode mover o conteúdo da subpasta para o local de instalação escolhido.