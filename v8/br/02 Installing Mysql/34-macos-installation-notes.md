### 2.4.1 Notas Gerais sobre a Instalação do MySQL no macOS

Você deve ter em mente os seguintes pontos e notas:

* **Outras instalações do MySQL**: O procedimento de instalação não reconhece instalações do MySQL por gerenciadores de pacotes, como o Homebrew. O processo de instalação e atualização é para os pacotes do MySQL fornecidos por nós. Se outras instalações estiverem presentes, considere interromper essas instalações antes de executar este instalador para evitar conflitos de porta.

**Homebrew**: Por exemplo, se você instalou o MySQL Server usando o Homebrew na localização padrão, o instalador do MySQL será instalado em um local diferente e não atualizará a versão do Homebrew. Nesse cenário, você acabará com várias instalações do MySQL que, por padrão, tentam usar as mesmas portas. Parar as outras instâncias do MySQL Server antes de executar esse instalador, como executar *brew services stop mysql* para parar o serviço MySQL do Homebrew.
* **Launchd**: Um daemon do Launchd é instalado, que altera as opções de configuração do MySQL. Considere editá-lo, se necessário, consulte a documentação abaixo para obter informações adicionais. Além disso, o macOS 10.10 removeu o suporte a itens de inicialização em favor dos daemon do Launchd. O painel de preferências MySQL opcional no macOS System Preferences usa o daemon do Launchd.
* **Usuários**: Você pode precisar (ou querer) criar um usuário específico `mysql` para possuir o diretório e os dados do MySQL. Você pode fazer isso através do **Directory Utility**, e o usuário `mysql` já deve existir. Para uso no modo de usuário único, uma entrada para `_mysql` (note o prefixo sublinhado) deve já existir no arquivo `/etc/passwd` do sistema.
* **Dados**: Como o instalador do pacote do MySQL instala o conteúdo do MySQL em um diretório específico da versão e plataforma, você pode usá-lo para atualizar e migrar seu banco de dados entre versões. Você precisa copiar o diretório `data` da versão antiga para a nova versão, ou especificar um valor alternativo para `datadir` para definir a localização do diretório de dados. Por padrão, os diretórios do MySQL são instalados em `/usr/local/`.
* **Aliases**: Você pode querer adicionar aliases ao arquivo de recursos do seu shell para facilitar o acesso a programas comumente usados, como `mysql` e `mysqladmin`, a partir da linha de comando. A sintaxe para o `bash` é:

  ```
  alias mysql=/usr/local/mysql/bin/mysql
  alias mysqladmin=/usr/local/mysql/bin/mysqladmin
  ```

  Para o `tcsh`, use:

  ```
  alias mysql /usr/local/mysql/bin/mysql
  alias mysqladmin /usr/local/mysql/bin/mysqladmin
  ```

Melhor ainda, adicione `/usr/local/mysql/bin` à sua variável de ambiente `PATH`. Você pode fazer isso modificando o arquivo de inicialização apropriado para o seu shell. Para mais informações, consulte a Seção 6.2.1, “Invocação de Programas MySQL”.
* **Remoção**: Após ter copiado os arquivos do banco de dados MySQL da instalação anterior e ter iniciado com sucesso o novo servidor, você deve considerar a remoção dos arquivos da instalação antiga para economizar espaço em disco. Além disso, você também deve remover as versões mais antigas dos diretórios de Receita de Pacote localizados em `/Library/Receipts/mysql-VERSION.pkg`.