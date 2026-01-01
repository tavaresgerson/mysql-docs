### 2.4.1 Notas gerais sobre a instalação do MySQL no macOS

Você deve ter em mente os seguintes pontos e notas:

- A partir do macOS 10.14 (Mojave), o aplicativo Instalador do MySQL 5.7 do macOS requer permissão para controlar *Eventos do Sistema* para que possa exibir uma senha de root MySQL gerada (temporária). Escolher "Não Permitir" significa que essa senha não será exibida para uso.

  Se anteriormente foi desativado, a correção está habilitando o *System Events.app* para o *Installer.app* na aba \*Segurança e privacidade | \*Automação | *Privacidade*.

- Um daemon do launchd está instalado e inclui opções de configuração do MySQL. Considere editá-lo, se necessário, consulte a documentação abaixo para obter informações adicionais. Além disso, o macOS 10.10 removeu o suporte a itens de inicialização em favor dos demonios do launchd. O painel de preferências MySQL opcional nas Preferências do Sistema do macOS usa o daemon do launchd.

- Você pode precisar (ou querer) criar um usuário específico `mysql` para possuir o diretório e os dados do MySQL. Você pode fazer isso através do **Utilitário de Diretório**, e o usuário `mysql` já deve existir. Para uso no modo de usuário único, uma entrada para `_mysql` (observe o prefixo sublinhado) já deve existir no arquivo `/etc/passwd` do sistema.

- Como o instalador do pacote MySQL instala o conteúdo do MySQL em um diretório específico para a versão e a plataforma, você pode usá-lo para atualizar e migrar seu banco de dados entre versões. Você precisa copiar o diretório `data` da versão antiga para a nova versão ou especificar um valor alternativo para o `datadir` para definir a localização do diretório de dados. Por padrão, os diretórios do MySQL são instalados em `/usr/local/`.

- Você pode querer adicionar aliases ao arquivo de recursos do seu shell para facilitar o acesso a programas comumente usados, como **mysql** e **mysqladmin**, a partir da linha de comando. A sintaxe para **bash** é:

  ```sql
  alias mysql=/usr/local/mysql/bin/mysql
  alias mysqladmin=/usr/local/mysql/bin/mysqladmin
  ```

  Para o **tcsh**, use:

  ```sql
  alias mysql /usr/local/mysql/bin/mysql
  alias mysqladmin /usr/local/mysql/bin/mysqladmin
  ```

  Melhor ainda, adicione `/usr/local/mysql/bin` à sua variável de ambiente `PATH`. Você pode fazer isso modificando o arquivo de inicialização apropriado para o seu shell. Para mais informações, consulte a Seção 4.2.1, “Invocação de Programas MySQL”.

- Depois de copiar os arquivos do banco de dados MySQL da instalação anterior e ter iniciado com sucesso o novo servidor, você deve considerar a remoção dos arquivos da instalação antiga para economizar espaço em disco. Além disso, você também deve remover as versões mais antigas dos diretórios de Receita de Pacote localizados em `/Library/Receipts/mysql-VERSION.pkg`.
