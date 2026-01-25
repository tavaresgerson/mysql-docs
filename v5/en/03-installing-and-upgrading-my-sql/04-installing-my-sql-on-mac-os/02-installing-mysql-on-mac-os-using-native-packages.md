### 2.4.2 Instalação do MySQL no macOS Usando Pacotes Nativos

O pacote está localizado dentro de um arquivo de imagem de disco (`.dmg`) que você precisa montar primeiro, dando um clique duplo em seu ícone no Finder. Ele deve então montar a imagem e exibir seu conteúdo.

Nota

Antes de prosseguir com a instalação, certifique-se de interromper todas as instâncias do MySQL Server em execução, usando o MySQL Manager Application (no macOS Server), o painel de preferência, ou o comando **mysqladmin shutdown** na linha de comando.

Para instalar o MySQL usando o instalador de pacote:

1. Baixe o arquivo de imagem de disco (`.dmg`) (a versão Community está disponível [aqui](https://dev.mysql.com/downloads/mysql/)) que contém o instalador do pacote MySQL. Dê um clique duplo no arquivo para montar a imagem de disco e visualizar seu conteúdo.

   **Figura 2.13 Instalador do Pacote MySQL: Conteúdo do DMG**

   ![Mounted macOS disk image contents that contains the MySQL Server package file.](images/mac-installer-dmg-contents.png)

2. Dê um clique duplo no pacote de instalação do MySQL a partir do disco. Ele é nomeado de acordo com a versão do MySQL que você baixou. Por exemplo, para o MySQL Server 5.7.44, ele pode ser nomeado `mysql-5.7.44-macos-10.13-x86_64.pkg`.

3. A tela de introdução inicial do assistente faz referência à versão do MySQL Server a ser instalada. Clique em Continuar (Continue) para iniciar a instalação.

   **Figura 2.14 Assistente de Instalação do Pacote MySQL: Introdução**

   ![Shows that the installation is ready to start, the MySQL server version being installed, and includes links to the MySQL manual, mysql.com, and oracle.com.](images/mac-installer-dmg-introduction.png)

4. A edição MySQL Community exibe uma cópia da Licença Pública Geral GNU relevante. Clique em Continuar (Continue) e, em seguida, em Concordar (Agree) para prosseguir.

5. Na página Tipo de Instalação (Installation Type), você pode clicar em Instalar (Install) para executar o assistente de instalação usando todos os padrões, ou clicar em Personalizar (Customize) para alterar quais componentes instalar (MySQL Server, Preference Pane, Launchd Support -- todos habilitados por padrão).

   Nota

   Embora a opção Alterar Local de Instalação (Change Install Location) esteja visível, o local de instalação não pode ser alterado.

   **Figura 2.15 Assistente de Instalação do Pacote MySQL: Tipo de Instalação**

   ![Content is described in the surrounding text.](images/mac-installer-installation-type.png)

   **Figura 2.16 Assistente de Instalação do Pacote MySQL: Personalizar**

   ![Customize shows three package name options: MySQL Server, Preference Pane, and Launchd Support. All three options are checked.](images/mac-installer-installation-customize.png)

6. Clique em Instalar (Install) para iniciar o processo de instalação.

7. Após uma instalação bem-sucedida, o instalador exibe uma janela com sua senha temporária do root. Ela não pode ser recuperada, portanto, você deve salvar esta senha para o login inicial no MySQL. Por exemplo:

   **Figura 2.17 Assistente de Instalação do Pacote MySQL: Senha Temporária do Root**

   ![Content is described in the surrounding text.](images/mac-installer-root-password.png)

   Nota

   O MySQL expira esta senha temporária do root após o login inicial e exige que você crie uma nova senha.

8. O Resumo (Summary) é a etapa final e faz referência a uma instalação bem-sucedida e completa do MySQL Server. Feche o assistente.

   **Figura 2.18 Assistente de Instalação do Pacote MySQL: Resumo**

   ![Shows that the installation was a success, and includes links to the MySQL manual, mysql.com, and oracle.com.](images/mac-installer-summary.png)

O MySQL Server está instalado, mas não é carregado (ou iniciado) por padrão. Use `launchctl` a partir da linha de comando, ou inicie o MySQL clicando em "Start" (Iniciar) usando o MySQL Preference Pane. Para obter informações adicionais, consulte a Seção 2.4.3, “Instalação de um MySQL Launch Daemon”, e a Seção 2.4.4, “Instalação e Uso do MySQL Preference Pane”. Use o MySQL Preference Pane ou `launchd` para configurar o MySQL para iniciar automaticamente na inicialização.

Ao instalar usando o instalador de pacote, os arquivos são instalados em um diretório dentro de `/usr/local` que corresponde ao nome da versão e da plataforma de instalação. Por exemplo, o arquivo instalador `mysql-5.7.44-macos10.13-x86_64.dmg` instala o MySQL em `/usr/local/mysql-5.7.44-macos10.13-x86_64/`. A tabela a seguir mostra o layout do diretório de instalação.

**Tabela 2.7 Layout da Instalação do MySQL no macOS**

| Diretório | Conteúdo do Diretório |
| :--- | :--- |
| `bin` | Server **mysqld**, Client e programas Utility |
| `data` | Log files, Databases |
| `docs` | Documentos auxiliares, como as Notas de Release e informações de build |
| `include` | Arquivos Include (header) |
| `lib` | Libraries |
| `man` | Páginas de manual Unix |
| `mysql-test` | Suite de testes MySQL |
| `share` | Arquivos de suporte diversos, incluindo mensagens de erro, arquivos de configuração de amostra, SQL para instalação de Database |
| `support-files` | Scripts e arquivos de configuração de amostra |
| `/tmp/mysql.sock` | Localização do Unix socket do MySQL |

Durante o processo do instalador de pacote, um link simbólico de `/usr/local/mysql` para o diretório específico de versão/plataforma criado durante a instalação é criado automaticamente.
