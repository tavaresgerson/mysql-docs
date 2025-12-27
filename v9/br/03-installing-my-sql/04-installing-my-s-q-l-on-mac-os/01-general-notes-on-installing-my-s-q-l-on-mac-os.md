### 2.4.1 Notas Gerais sobre a Instalação do MySQL no macOS

Você deve ter em mente os seguintes pontos e notas:

* **Outras instalações do MySQL**: O procedimento de instalação não reconhece instalações do MySQL por gerenciadores de pacotes, como o Homebrew. O processo de instalação e atualização é para pacotes do MySQL fornecidos por nós. Se houver outras instalações, considere interromper essas antes de executar este instalador para evitar conflitos de porta.

  **Homebrew**: Por exemplo, se você instalou o MySQL Server usando o Homebrew na localização padrão, o instalador do MySQL será instalado em um local diferente e não atualizará a versão do Homebrew. Nesse cenário, você acabará com várias instalações do MySQL que, por padrão, tentam usar as mesmas portas. Interrompa as outras instâncias do MySQL Server antes de executar este instalador, como executando *brew services stop mysql* para interromper o serviço MySQL do Homebrew.

* **Launchd**: Um daemon do Launchd é instalado que altera as opções de configuração do MySQL. Considere editá-lo, se necessário, consulte a documentação abaixo para obter informações adicionais. Além disso, o macOS 10.10 removeu o suporte a itens de inicialização em favor dos daemon do Launchd. O painel de preferências MySQL opcional no macOS System Preferences usa o daemon do Launchd.

* **Usuários**: Você pode precisar (ou querer) criar um usuário específico `mysql` para possuir o diretório e os dados do MySQL. Você pode fazer isso através do **Directory Utility**, e o usuário `mysql` já deve existir. Para uso no modo de usuário único, uma entrada para `_mysql` (note o prefixo sublinhado) já deve existir no arquivo `/etc/passwd` do sistema.

* **Dados**: Como o instalador do pacote MySQL instala o conteúdo do MySQL em um diretório específico da versão e da plataforma, você pode usá-lo para atualizar e migrar seu banco de dados entre versões. Você precisa copiar o diretório `data` da versão antiga para a nova versão ou especificar um valor alternativo para o `datadir` para definir a localização do diretório de dados. Por padrão, os diretórios do MySQL são instalados em `/usr/local/`.

* **Aliases**: Você pode querer adicionar aliases ao arquivo de recursos do seu shell para facilitar o acesso a programas comumente usados, como **mysql** e **mysqladmin**, a partir da linha de comando. A sintaxe para **bash** é:

  ```
  alias mysql=/usr/local/mysql/bin/mysql
  alias mysqladmin=/usr/local/mysql/bin/mysqladmin
  ```

  Para **tcsh**, use:

  ```
  alias mysql /usr/local/mysql/bin/mysql
  alias mysqladmin /usr/local/mysql/bin/mysqladmin
  ```

  Ainda melhor, adicione `/usr/local/mysql/bin` à sua variável de ambiente `PATH`. Você pode fazer isso modificando o arquivo de inicialização apropriado para o seu shell. Para mais informações, consulte a Seção 6.2.1, “Invocação de Programas do MySQL”.

* **Remoção**: Após copiar os arquivos do banco de dados MySQL da instalação anterior e iniciar com sucesso o novo servidor, você deve considerar a remoção dos arquivos de instalação antigos para economizar espaço em disco. Além disso, você também deve remover versões mais antigas dos diretórios do Pacto de Pacote localizados em `/Library/Receipts/mysql-VERSION.pkg`.