### 2.4.2 Instalar o MySQL no macOS usando pacotes nativos

O pacote está localizado dentro de um arquivo de imagem de disco (`.dmg`) que você primeiro precisa montar clicando duas vezes em seu ícone no Finder. Ele deve então montar a imagem e exibir seu conteúdo.

::: info Note

Antes de prosseguir com a instalação, certifique-se de parar todas as instâncias do servidor MySQL em execução usando o aplicativo MySQL Manager (no macOS Server), o painel de preferências ou **mysqladmin shutdown** na linha de comando.

:::

Para instalar o MySQL usando o instalador de pacotes:

1. Baixe o arquivo de imagem de disco (`.dmg`) (a versão da comunidade está disponível aqui) que contém o instalador do pacote MySQL. Clique duas vezes no arquivo para montar a imagem de disco e ver seu conteúdo.

   Clique duas vezes no pacote de instalação do MySQL no disco. Ele é nomeado de acordo com a versão do MySQL que você baixou. Por exemplo, para o servidor MySQL 8.4.6 ele pode ser nomeado `mysql-8.4.6-macos-10.13-x86_64.pkg`.
2. A tela de introdução do assistente inicial faz referência à versão do servidor MySQL para instalar. Clique em Continuar para iniciar a instalação.

   A edição da comunidade MySQL mostra uma cópia da Licença Pública Geral GNU relevante. Clique em Continuar e, em seguida, concorde para continuar.
3. A partir da página Tipo de Instalação você pode clicar em Instalar para executar o assistente de instalação usando todos os padrões, clique em Personalizar para alterar quais componentes instalar (servidor MySQL, Teste MySQL, Painel de Preferências, Suporte de Lançamento - todos, exceto o Teste MySQL estão habilitados por padrão).

   ::: info Note

   Embora a opção Alterar localização de instalação esteja visível, a localização de instalação não pode ser alterada.

   :::

   \*\* Figura 2.5 Assistente de Instalação de Pacote MySQL: Personalizar\*\*

   ![Customize shows three package name options: MySQL Server, MySQL Test, Preference Pane, and Launchd Support. All three options are checked.](images/mac-installer-installation-type-customize.png)
4. Clique em Instalar para instalar o MySQL Server. O processo de instalação termina aqui se você atualizar uma instalação atual do MySQL Server, caso contrário, siga as etapas de configuração adicionais do assistente para sua nova instalação do MySQL Server.
5. Após uma nova instalação bem-sucedida do MySQL Server, complete a configuração definindo a senha raiz e ativando (ou desativando) o servidor MySQL na inicialização.
6. Defina uma senha para o usuário raiz, e também alternar se o MySQL Server deve iniciar após a etapa de configuração é concluída.
7. Resumo é o passo final e refere uma instalação bem sucedida e completa do MySQL Server. Feche o assistente.

O servidor MySQL está agora instalado. Se você optou por não iniciar o MySQL, use o launchctl da linha de comando ou inicie o MySQL clicando em "Iniciar" usando o painel de preferências do MySQL. Para informações adicionais, consulte a Seção 2.4.3, Instalar e usar o Daemon de Lançamento do MySQL, e a Seção 2.4.4, Instalar e usar o Painel de Preferências do MySQL. Use o Painel de Preferências do MySQL ou o launchd para configurar o MySQL para iniciar automaticamente na inicialização.

Ao instalar usando o instalador de pacotes, os arquivos são instalados em um diretório dentro do `/usr/local` correspondendo ao nome da versão e plataforma de instalação. Por exemplo, o arquivo de instalador `mysql-8.4.6-macos10.15-x86_64.dmg` instala o MySQL em `/usr/local/mysql-8.4.6-macos10.15-x86_64/` com um link simbólico para `/usr/local/mysql`. A tabela a seguir mostra o layout deste diretório de instalação do MySQL.

::: info Note

O processo de instalação do macOS não cria nem instala um arquivo de configuração de exemplo `my.cnf` do MySQL.

:::

**Tabela 2.8 Layout de instalação do MySQL no macOS**

<table><thead><tr> <th>Repertório</th> <th>Conteúdo do diretório</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>support-files</code>]</td> <td><span><strong>- O quê ?</strong></span>Programas de servidor, de cliente e de utilidade</td> </tr><tr> <td>[[PH_HTML_CODE_<code>support-files</code>]</td> <td>Arquivos de log, bancos de dados, onde [[PH_HTML_CODE_<code>mysql.server</code>] é o log de erro padrão</td> </tr><tr> <td>[[PH_HTML_CODE_<code>mysql-log-rotate</code>]</td> <td>Documentos auxiliares, como as notas de lançamento e informações de construção</td> </tr><tr> <td>[[PH_HTML_CODE_<code>/tmp/mysql.sock</code>]</td> <td>Incluir arquivos de cabeçalho</td> </tr><tr> <td>[[<code>lib</code>]]</td> <td>Bibliotecas</td> </tr><tr> <td>[[<code>man</code>]]</td> <td>Páginas do manual do Unix</td> </tr><tr> <td>[[<code>mysql-test</code>]]</td> <td>O conjunto de testes MySQL ("MySQL Test" está desativado por defeito durante o processo de instalação quando se utiliza o pacote de instalação (DMG))</td> </tr><tr> <td>[[<code>share</code>]]</td> <td>Vários arquivos de suporte, incluindo mensagens de erro, [[<code>dictionary.txt</code>]], e reescritor SQL</td> </tr><tr> <td>[[<code>support-files</code>]]</td> <td>Suporte a scripts, como [[<code>data</code><code>support-files</code>], [[<code>mysql.server</code>]], e [[<code>mysql-log-rotate</code>]].</td> </tr><tr> <td>[[<code>/tmp/mysql.sock</code>]]</td> <td>Localização do soquete MySQL Unix</td> </tr></tbody></table>
