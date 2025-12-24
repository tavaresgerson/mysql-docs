### 2.4.1 Notas gerais sobre a instalação do MySQL no macOS

Deverá ter em mente os seguintes pontos e notas:

- \*\* Outras instalações do MySQL \*\*: O procedimento de instalação não reconhece as instalações do MySQL por gestores de pacotes como o Homebrew. O processo de instalação e atualização é para pacotes do MySQL fornecidos por nós. Se outras instalações estiverem presentes, considere pará-las antes de executar este instalador para evitar conflitos de porta.

  **Homebrew**: Por exemplo, se você instalou o MySQL Server usando o Homebrew em seu local padrão, o instalador do MySQL instala em um local diferente e não atualizará a versão do Homebrew. Neste cenário, você acabaria com várias instalações do MySQL que, por padrão, tentam usar as mesmas portas. Pare as outras instâncias do MySQL Server antes de executar este instalador, como executar \* brew services stop mysql \* para parar o serviço MySQL do Homebrew.
- \*\* Launchd \*\*: Um demônio de lançamento está instalado que altera as opções de configuração do MySQL. Considere editá-lo, se necessário, consulte a documentação abaixo para obter informações adicionais.
- \*\* Usuários \*\*: Você pode precisar (ou querer) criar um usuário específico para possuir o diretório e os dados do MySQL. Você pode fazer isso através do Utilitário do Diretório \*\*, e o usuário `mysql` já deve existir. Para uso em modo de usuário único, uma entrada para `_mysql` (note o prefixo sublinhado) já deve existir dentro do arquivo do sistema `/etc/passwd`.
- \*\* Dados \*\*: Como o instalador do pacote MySQL instala o conteúdo do MySQL em um diretório específico de versão e plataforma, você pode usá-lo para atualizar e migrar seu banco de dados entre versões. Você precisa copiar o diretório `data` da versão antiga para a nova versão, ou especificar um valor alternativo `datadir` para definir o local do diretório de dados. Por padrão, os diretórios MySQL são instalados sob `/usr/local/`.
- **Aliases**: Você pode adicionar aliases ao arquivo de recursos do shell para facilitar o acesso a programas comumente usados, como `mysql` e `mysqladmin` da linha de comando. A sintaxe para `bash` é:

  ```
  alias mysql=/usr/local/mysql/bin/mysql
  alias mysqladmin=/usr/local/mysql/bin/mysqladmin
  ```

  Para `tcsh`, utilizar:

  ```
  alias mysql /usr/local/mysql/bin/mysql
  alias mysqladmin /usr/local/mysql/bin/mysqladmin
  ```

  Melhor ainda, adicione `/usr/local/mysql/bin` à sua variável de ambiente `PATH`. Você pode fazer isso modificando o arquivo de inicialização apropriado para o seu shell. Para mais informações, veja Seção 6.2.1, Invocando Programas MySQL.
- **Removendo**: Depois de ter copiado os arquivos de banco de dados MySQL da instalação anterior e ter iniciado com sucesso o novo servidor, você deve considerar remover os arquivos de instalação antigos para economizar espaço em disco. Além disso, você também deve remover versões antigas dos diretórios de recebimento de pacotes localizados em `/Library/Receipts/mysql-VERSION.pkg`.
