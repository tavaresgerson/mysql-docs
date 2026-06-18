### 2.4.2 Instalando o MySQL no macOS usando pacotes nativos

O pacote está localizado dentro de um arquivo de imagem de disco (`.dmg`) que você precisa montar primeiro clicando duas vezes em seu ícone no Finder. Ele deve então montar a imagem e exibir seu conteúdo.

Nota

Antes de prosseguir com a instalação, certifique-se de parar todas as instâncias do servidor MySQL em execução usando o aplicativo MySQL Manager (no macOS Server), o painel de preferências ou **mysqladmin shutdown** na linha de comando.

Para instalar o MySQL usando o instalador de pacotes:

1. Baixe o arquivo de imagem do disco (`.dmg`) (a versão da comunidade está disponível aqui) que contém o instalador do pacote MySQL. Clique duas vezes no arquivo para montar a imagem do disco e ver seu conteúdo.

   Clique duas vezes no pacote do instalador do MySQL do disco. Ele é nomeado de acordo com a versão do MySQL que você baixou. Por exemplo, para o servidor MySQL 8.0.44, ele pode ser chamado de `mysql-8.0.44-macos-10.13-x86_64.pkg`.

2. A tela inicial de introdução do assistente faz referência à versão do servidor MySQL a ser instalada. Clique em Continuar para iniciar a instalação.

   A edição comunitária do MySQL exibe uma cópia da GNU General Public License relevante. Clique em Continuar e, em seguida, em Concordar para continuar.

3. Na página Tipo de Instalação, você pode clicar em Instalar para executar o assistente de instalação com todos os parâmetros padrão, clicar em Personalizar para alterar quais componentes serão instalados (servidor MySQL, MySQL Test, Painel de Preferências, Suporte Launchd -- todos, exceto o MySQL Test, estão habilitados por padrão).

   Nota

   Embora a opção "Alterar Local de Instalação" esteja visível, o local de instalação não pode ser alterado.

   **Figura 2.13: Assistente do Instalador do Pacote MySQL: Tipo de Instalação**

   ![Content is described in the surrounding text.](images/mac-installer-installation-type-standard.png)

   **Figura 2.14: Assistente do Instalador do Pacote MySQL: Personalizar**

   ![Customize shows three package name options: MySQL Server, MySQL Test, Preference Pane, and Launchd Support. All three options are checked.](images/mac-installer-installation-type-customize.png)

4. Clique em Instalar para instalar o MySQL Server. O processo de instalação termina aqui se você estiver atualizando uma instalação atual do MySQL Server, caso contrário, siga os passos de configuração adicionais do assistente para sua nova instalação do MySQL Server.

5. Após a instalação bem-sucedida do novo MySQL Server, complete os passos de configuração escolhendo o tipo de criptografia padrão para as senhas, defina a senha do root e também habilite (ou desabilite) o servidor MySQL no momento do arranque.

6. O mecanismo de senha padrão do MySQL 8.0 é `caching_sha2_password` (Forte), e essa etapa permite que você o altere para `mysql_native_password` (Legado).

   **Figura 2.15: Assistente do Instalador do Pacote MySQL: Escolha um Tipo de Criptografia de Senha**

   ![Most content is described in the surrounding text. The installer refers to caching\_sha2\_password as "Use Strong Password Encryption" and mysql\_native\_password as a "Use Legacy Password Encryption".](images/mac-installer-configuration-password-type.png)

   A escolha do mecanismo de senha de legado altera o arquivo launchd gerado para definir `--default_authentication_plugin=mysql_native_password` sob `ProgramArguments`. A escolha da criptografia de senha forte não define `--default_authentication_plugin`, pois o valor padrão do servidor MySQL é usado, que é `caching_sha2_password`.

7. Defina uma senha para o usuário root e também alterne se o MySQL Server deve ser iniciado após a etapa de configuração ser concluída.

   **Figura 2.16: Assistente do Instalador do Pacote MySQL: Defina a Senha do Usuário Root**

   ![Content is described in the surrounding text.](images/mac-installer-configuration-password-define.png)

8. O resumo é a etapa final e faz referência a uma instalação bem-sucedida e completa do MySQL Server. Feche o assistente.

   **Figura 2.17: Assistente do Instalador do Pacote MySQL: Resumo**

   ![Shows that the installation was a success, and includes links to the MySQL manual, mysql.com, and oracle.com.](images/mac-installer-summary.png)

O servidor MySQL está agora instalado. Se você optou por não iniciar o MySQL, use o launchctl a partir da linha de comando ou inicie o MySQL clicando em "Iniciar" usando o painel de preferências do MySQL. Para obter informações adicionais, consulte a Seção 2.4.3, “Instalando e Usando o Daemon de Iniciação do MySQL”, e a Seção 2.4.4, “Instalando e Usando o Painel de Preferências do MySQL”. Use o Painel de Preferências do MySQL ou o launchd para configurar o MySQL para iniciar automaticamente ao inicializar.

Ao instalar usando o instalador de pacotes, os arquivos são instalados em um diretório dentro de `/usr/local` que corresponde ao nome da versão de instalação e da plataforma. Por exemplo, o arquivo instalador `mysql-8.0.44-macos10.15-x86_64.dmg` instala o MySQL em `/usr/local/mysql-8.0.44-macos10.15-x86_64/` com um symlink para `/usr/local/mysql`. A tabela a seguir mostra a estrutura desse diretório de instalação do MySQL.

Nota

O processo de instalação do macOS não cria nem instala um arquivo de configuração de amostra do MySQL `my.cnf`.

**Tabela 2.7. Estrutura de instalação do MySQL no macOS**

<table><thead><tr> <th>Diretório</th> <th>Conteúdo do diretório</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>support-files</code>]</td> <td><span><strong>mysqld</strong></span>programas de servidor, cliente e utilitário</td> </tr><tr> <td>[[PH_HTML_CODE_<code>support-files</code>]</td> <td>Arquivos de registro, bancos de dados, onde [[PH_HTML_CODE_<code>mysql.server</code>] é o registro de erro padrão</td> </tr><tr> <td>[[PH_HTML_CODE_<code>mysql-log-rotate</code>]</td> <td>Documentos auxiliares, como as Notas de Lançamento e informações de construção</td> </tr><tr> <td>[[PH_HTML_CODE_<code>/tmp/mysql.sock</code>]</td> <td>Incluir arquivos (cabeçalho)</td> </tr><tr> <td>[[<code>lib</code>]]</td> <td>Livrarias</td> </tr><tr> <td>[[<code>man</code>]]</td> <td>Páginas de manual do Unix</td> </tr><tr> <td>[[<code>mysql-test</code>]]</td> <td>Conjunto de testes do MySQL ('MySQL Test' está desativado por padrão durante o processo de instalação ao usar o pacote de instalador (DMG))</td> </tr><tr> <td>[[<code>share</code>]]</td> <td>Arquivos de suporte variados, incluindo mensagens de erro, [[<code>dictionary.txt</code>]] e reescritor SQL</td> </tr><tr> <td>[[<code>support-files</code>]]</td> <td>Scripts de suporte, como [[<code>data</code><code>support-files</code>], [[<code>mysql.server</code>]] e [[<code>mysql-log-rotate</code>]].</td> </tr><tr> <td>[[<code>/tmp/mysql.sock</code>]]</td> <td>Localização do soquete Unix do MySQL</td> </tr></tbody></table>
