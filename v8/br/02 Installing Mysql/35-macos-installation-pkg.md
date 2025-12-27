### 2.4.2 Instalando o MySQL no macOS Usando Pacotes Nativos

O pacote está localizado em um arquivo de imagem de disco (`.dmg`) que você precisa montar clicando duas vezes em seu ícone no Finder. Ele deve então montar a imagem e exibir seu conteúdo.

::: info Nota

Antes de prosseguir com a instalação, certifique-se de parar todas as instâncias do servidor MySQL em execução usando a Aplicação do Gerenciador MySQL (no macOS Server), o painel de preferências ou `mysqladmin shutdown` na linha de comando.

:::

Para instalar o MySQL usando o instalador de pacotes:

1. Baixe o arquivo de imagem de disco (`.dmg`) (a versão comunitária está disponível aqui) que contém o instalador do pacote MySQL. Clique duas vezes no arquivo para montar a imagem de disco e ver seu conteúdo.

   Clique duas vezes no pacote do instalador MySQL da imagem de disco. Ele é nomeado de acordo com a versão do MySQL que você baixou. Por exemplo, para o servidor MySQL 8.4.6, pode ser chamado de `mysql-8.4.6-macos-10.13-x86_64.pkg`.
2. A tela inicial do assistente de instalação faz referência à versão do servidor MySQL a ser instalada. Clique em Continuar para iniciar a instalação.

   A edição comunitária do MySQL mostra uma cópia da GNU General Public License relevante. Clique em Continuar e, em seguida, em Concordo para continuar.
3. Na página Tipo de Instalação, você pode clicar em Instalar para executar o assistente de instalação usando todos os parâmetros padrão, clicar em Personalizar para alterar quais componentes serão instalados (servidor MySQL, MySQL Test, Painel de Preferências, Suporte Launchd -- todos, exceto MySQL Test, estão habilitados por padrão).

   ::: info Nota

Embora a opção Alterar Local de Instalação seja visível, o local de instalação não pode ser alterado.

:::

**Figura 2.5 Assistente de Instalação do Pacote MySQL: Personalizar**

![Personalizar mostra três opções de nome de pacote: MySQL Server, MySQL Test, Painel de Preferências e Suporte ao Launchd. Todas as três opções estão marcadas.](images/mac-installer-installation-type-customize.png)
4. Clique em Instalar para instalar o MySQL Server. O processo de instalação termina aqui se estiver atualizando uma instalação atual do MySQL Server, caso contrário, siga os passos de configuração adicionais do assistente para sua nova instalação do MySQL Server.
5. Após a instalação bem-sucedida do novo MySQL Server, complete a configuração definindo a senha do usuário root e habilitando (ou desabilitando) o servidor MySQL no início.
6. Defina uma senha para o usuário root e também alterne se o MySQL Server deve ser iniciado após a etapa de configuração ser concluída.
7. O Resumo é a etapa final e faz referência a uma instalação bem-sucedida e completa do MySQL Server. Feche o assistente.

O servidor MySQL foi instalado agora. Se você optou por não iniciar o MySQL, então use o launchctl a partir da linha de comando ou inicie o MySQL clicando em "Iniciar" usando o painel de preferências do MySQL. Para obter informações adicionais, consulte a Seção 2.4.3, “Instalando e Usando o Daemon de Inicialização do MySQL”, e a Seção 2.4.4, “Instalando e Usando o Painel de Preferências do MySQL”. Use o Painel de Preferências do MySQL ou o launchd para configurar o MySQL para iniciar automaticamente no boot.

Ao instalar usando o instalador de pacotes, os arquivos são instalados em um diretório dentro de `/usr/local` que corresponde ao nome da versão e plataforma de instalação. Por exemplo, o arquivo do instalador `mysql-8.4.6-macos10.15-x86_64.dmg` instala o MySQL em `/usr/local/mysql-8.4.6-macos10.15-x86_64/` com um link simbólico para `/usr/local/mysql`. A tabela a seguir mostra o layout deste diretório de instalação do MySQL.

::: info Nota

O processo de instalação do macOS não cria nem instala um arquivo de configuração MySQL `my.cnf` de amostra.

:::

**Tabela 2.8 Layout da Instalação do MySQL no macOS**

<table><thead><tr> <th>Diretório</th> <th>Conteúdo do Diretório</th> </tr></thead><tbody><tr> <td><code>bin</code></td> <td>Servidores, programas de cliente e utilitários do <code>mysqld</code></td> </tr><tr> <td><code>data</code></td> <td>Arquivos de log, bancos de dados, onde <code>/usr/local/mysql/data/mysqld.local.err</code> é o log de erro padrão</td> </tr><tr> <td><code>docs</code></td> <td>Documentos de ajuda, como as Notas de Lançamento e informações de compilação</td> </tr><tr> <td><code>include</code></td> <td>Arquivos de inclusão (cabeçalho)</td> </tr><tr> <td><code>lib</code></td> <td>Bibliotecas</td> </tr><tr> <td><code>man</code></td> <td>Páginas de manual do Unix</td> </tr><tr> <td><code>mysql-test</code></td> <td>Suíte de testes do MySQL ('MySQL Test' é desativado por padrão durante o processo de instalação ao usar o pacote de instalador (DMG))</td> </tr><tr> <td><code>share</code></td> <td>Arquivos de suporte variados, incluindo mensagens de erro, <code>dictionary.txt</code> e rewriter SQL</td> </tr><tr> <td><code>support-files</code></td> <td>Scripts de suporte, como <code>mysqld_multi.server</code>, <code>mysql.server</code> e <code>mysql-log-rotate</code>.</td> </tr><tr> <td><code>/tmp/mysql.sock</code></td> <td>Local do soquete Unix do MySQL</td> </tr></tbody></table>