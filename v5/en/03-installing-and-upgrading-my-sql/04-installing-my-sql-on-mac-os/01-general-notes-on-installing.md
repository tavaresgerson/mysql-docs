### 2.4.1 Notas Gerais sobre a Instalação do MySQL no macOS

Você deve ter em mente os seguintes pontos e observações:

*   A partir do macOS 10.14 (Majave), o aplicativo *macOS MySQL 5.7 Installer* requer permissão para controlar *System Events* para que possa exibir uma senha root (temporária) gerada do MySQL. Escolher "Don't Allow" (Não Permitir) significa que essa senha não estará visível para uso.

    Se desautorizado anteriormente, a solução é habilitar *System Events.app* para *Installer.app* em *Security & Privacy* | *Automation* | aba *Privacy*.

*   Um *launchd daemon* é instalado e inclui opções de configuração do MySQL. Considere editá-lo se necessário; consulte a documentação abaixo para obter informações adicionais. Além disso, o macOS 10.10 removeu o suporte a itens de inicialização em favor de *launchd daemons*. O painel de preferências opcional do MySQL em *macOS System Preferences* utiliza o *launchd daemon*.

*   Você pode precisar (ou querer) criar um usuário `mysql` específico para ser proprietário do diretório e dos dados do MySQL. Você pode fazer isso através do **Directory Utility**, e o usuário `mysql` já deve existir. Para uso no modo de usuário único (*single user mode*), uma entrada para `_mysql` (observe o prefixo underscore) já deve existir dentro do arquivo de sistema `/etc/passwd`.

*   Como o *package installer* do MySQL instala o conteúdo do MySQL em um diretório específico de versão e plataforma, você pode usar isso para fazer upgrade e migrar seu *Database* entre versões. Você precisa copiar o diretório `data` da versão antiga para a nova versão, ou especificar um valor `datadir` alternativo para definir a localização do *data directory*. Por padrão, os diretórios do MySQL são instalados em `/usr/local/`.

*   Você pode querer adicionar *aliases* ao arquivo de recurso do seu *shell* para facilitar o acesso a programas comumente usados, como **mysql** e **mysqladmin**, a partir da linha de comando. A sintaxe para **bash** é:

    ```sql
  alias mysql=/usr/local/mysql/bin/mysql
  alias mysqladmin=/usr/local/mysql/bin/mysqladmin
  ```

    Para **tcsh**, use:

    ```sql
  alias mysql /usr/local/mysql/bin/mysql
  alias mysqladmin /usr/local/mysql/bin/mysqladmin
  ```

    Melhor ainda, adicione `/usr/local/mysql/bin` à sua variável de ambiente `PATH`. Você pode fazer isso modificando o arquivo de inicialização apropriado para o seu *shell*. Para mais informações, consulte Seção 4.2.1, "Invocando Programas MySQL".

*   Depois de ter copiado os arquivos do *Database* MySQL da instalação anterior e iniciado o novo *server* com sucesso, você deve considerar remover os arquivos de instalação antigos para economizar espaço em disco. Além disso, você também deve remover as versões mais antigas dos diretórios *Package Receipt* localizados em `/Library/Receipts/mysql-VERSION.pkg`.