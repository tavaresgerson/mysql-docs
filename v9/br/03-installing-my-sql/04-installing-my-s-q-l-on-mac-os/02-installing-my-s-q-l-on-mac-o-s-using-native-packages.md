### 2.4.2 Instalando o MySQL no macOS Usando Pacotes Nativos

O pacote está localizado dentro de um arquivo de imagem de disco (`.dmg`) que você precisa montar clicando duas vezes em seu ícone no Finder. Ele deve então montar a imagem e exibir seu conteúdo.

Observação

Antes de prosseguir com a instalação, certifique-se de parar todas as instâncias do servidor MySQL em execução usando a Aplicação do Gerenciador MySQL (no macOS Server), o painel de preferências ou **mysqladmin shutdown** na linha de comando.

Para instalar o MySQL usando o instalador de pacotes:

1. Baixe o arquivo de imagem de disco (`.dmg`) (a versão comunitária está disponível [aqui](https://dev.mysql.com/downloads/mysql/)) que contém o instalador do pacote MySQL. Clique duas vezes no arquivo para montar a imagem de disco e ver seu conteúdo.

   Clique duas vezes no pacote do instalador MySQL do disco. Ele é nomeado de acordo com a versão do MySQL que você baixou. Por exemplo, para o servidor MySQL 9.5.0, pode ser chamado de `mysql-9.5.0-macos-10.13-x86_64.pkg`.

2. A tela inicial do assistente de instalação faz referência à versão do servidor MySQL a ser instalada. Clique em Continuar para começar a instalação.

   A edição comunitária do MySQL mostra uma cópia da GNU General Public License relevante. Clique em Continuar e, em seguida, em Concordar para continuar.

3. Na página Tipo de Instalação, você pode clicar em Instalar para executar o assistente de instalação usando todos os parâmetros padrão, clicar em Personalizar para alterar quais componentes serão instalados (servidor MySQL, MySQL Test, Painel de Preferências, Suporte Launchd -- todos, exceto MySQL Test, estão habilitados por padrão).

   Observação

Embora a opção Alterar Local de Instalação seja visível, o local de instalação não pode ser alterado.

**Figura 2.5 Assistente de Instalação do Pacotes MySQL: Personalizar**

![Personalizar mostra três opções de nome de pacote: MySQL Server, MySQL Test, Painel de Preferências e Suporte ao Launchd. Todas as três opções estão marcadas.](images/mac-installer-installation-type-customize.png)

4. Clique em Instalar para instalar o MySQL Server. O processo de instalação termina aqui se você estiver atualizando uma instalação atual do MySQL Server, caso contrário, siga os passos de configuração adicionais do assistente para sua nova instalação do MySQL Server.

5. Após a instalação bem-sucedida do novo MySQL Server, complete a configuração definindo a senha do usuário root e habilitando (ou desabilitando) o servidor MySQL no início.

6. Defina uma senha para o usuário root e também alterne se o MySQL Server deve ser iniciado após a etapa de configuração ser concluída.

7. O Resumo é a etapa final e faz referência a uma instalação bem-sucedida e completa do MySQL Server. Feche o assistente.

O servidor MySQL foi instalado agora. Se você optou por não iniciar o MySQL, então use o launchctl a partir da linha de comando ou inicie o MySQL clicando em "Iniciar" usando o painel de preferências do MySQL. Para obter informações adicionais, consulte a Seção 2.4.3, “Instalando e Usando o Daemon de Iniciação do MySQL”, e a Seção 2.4.4, “Instalando e Usando o Painel de Preferências do MySQL”. Use o Painel de Preferências do MySQL ou o launchd para configurar o MySQL para iniciar automaticamente no boot.

Ao instalar usando o instalador de pacotes, os arquivos são instalados em um diretório dentro de `/usr/local` que corresponde ao nome da versão e plataforma de instalação. Por exemplo, o arquivo do instalador `mysql-9.5.0-macos10.15-x86_64.dmg` instala o MySQL em `/usr/local/mysql-9.5.0-macos10.15-x86_64/` com um link simbólico para `/usr/local/mysql`. A tabela a seguir mostra o layout deste diretório de instalação do MySQL.

Nota

O processo de instalação do macOS não cria nem instala um arquivo de configuração de amostra `my.cnf` do MySQL.

**Tabela 2.8 Estrutura da Instalação do MySQL no macOS**

<table><col style="width: 45%"/><col style="width: 55%"/><thead><tr> <th>Diretório</th> <th>Conteúdo do Diretório</th> </tr></thead><tbody><tr> <td><code class="filename">bin</code></td> <td>Programas do servidor, cliente e utilitários do MySQL</td> </tr><tr> <td><code class="filename">data</code></td> <td>Arquivos de log, bancos de dados, onde <code class="filename">/usr/local/mysql/data/mysqld.local.err</code> é o log de erro padrão</td> </tr><tr> <td><code class="filename">docs</code></td> <td>Documentos de ajuda, como as Notas de Lançamento e informações de compilação</td> </tr><tr> <td><code class="filename">include</code></td> <td>Arquivos de inclusão (cabeçalho)</td> </tr><tr> <td><code class="filename">lib</code></td> <td>Bibliotecas</td> </tr><tr> <td><code class="filename">man</code></td> <td>Páginas do manual do Unix</td> </tr><tr> <td><code class="filename">mysql-test</code></td> <td>Suíte de testes do MySQL ('MySQL Test' está desativado por padrão durante o processo de instalação ao usar o pacote de instalador (DMG))</td> </tr><tr> <td><code class="filename">share</code></td> <td>Arquivos de suporte diversos, incluindo mensagens de erro, <code class="filename">dictionary.txt</code> e rewriter SQL</td> </tr><tr> <td><code class="filename">support-files</code></td> <td>Scripts de suporte, como <code class="filename">mysqld_multi.server</code>, <code class="filename">mysql.server</code> e <code class="filename">mysql-log-rotate</code>.</td> </tr><tr> <td><code class="filename">/tmp/mysql.sock</code></td> <td>Localização do soquete Unix do MySQL</td> </tr></tbody></table>