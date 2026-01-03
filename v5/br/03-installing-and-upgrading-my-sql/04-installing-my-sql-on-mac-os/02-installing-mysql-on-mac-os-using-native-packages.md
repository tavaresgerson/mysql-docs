### 2.4.2 Instalando o MySQL no macOS usando pacotes nativos

O pacote está localizado dentro de um arquivo de imagem de disco (`.dmg`), que você precisa montar primeiro clicando duas vezes em seu ícone no Finder. Ele deve então montar a imagem e exibir seu conteúdo.

::: info Nota
Antes de prosseguir com a instalação, certifique-se de parar todas as instâncias do servidor MySQL em execução usando o aplicativo MySQL Manager (no macOS Server), o painel de preferências ou **mysqladmin shutdown** na linha de comando.
:::

Para instalar o MySQL usando o instalador de pacotes:

1. Baixe o arquivo de imagem de disco (`.dmg`) (a versão da comunidade está disponível [aqui](https://dev.mysql.com/downloads/mysql/)) que contém o instalador do pacote MySQL. Clique duas vezes no arquivo para montar a imagem de disco e ver seu conteúdo.

   **Figura 2.13: Instalador de Pacotes MySQL: Conteúdo do DMG**

   ![Conteúdo da imagem de disco macOS montado que contém o arquivo do pacote do MySQL Server.](images/mac-installer-dmg-contents.png)

2. Clique duas vezes no pacote do instalador do MySQL do disco. Ele é nomeado de acordo com a versão do MySQL que você baixou. Por exemplo, para o servidor MySQL 5.7.44, ele pode ser chamado de `mysql-5.7.44-macos-10.13-x86_64.pkg`.

3. A tela inicial de introdução do assistente faz referência à versão do servidor MySQL a ser instalada. Clique em Continuar para iniciar a instalação.

   **Figura 2.14 Guia do Instalador do Pacote MySQL: Introdução**

   ![Mostra que a instalação está pronta para começar, a versão do servidor MySQL está sendo instalada e inclui links para o manual do MySQL, mysql.com e oracle.com.](images/mac-installer-dmg-introduction.png)

4. A edição comunitária do MySQL exibe uma cópia da GNU General Public License relevante. Clique em Continuar e, em seguida, em Concordar para continuar.

5. Na página Tipo de Instalação, você pode clicar em Instalar para executar o assistente de instalação com todos os parâmetros padrão, clicar em Personalizar para alterar quais componentes serão instalados (servidor MySQL, Painel de Preferências, Suporte Launchd — todos habilitados por padrão).

   ::: info Nota
   Embora a opção "Alterar Local de Instalação" esteja visível, o local de instalação não pode ser alterado.
   :::

   **Figura 2.15: Assistente do Instalador do Pacote MySQL: Tipo de Instalação**

   ![O conteúdo é descrito no texto ao redor.](images/mac-installer-installation-type.png)

   **Figura 2.16: Assistente do Instalador do Pacote MySQL: Personalizar**

   ![Personalizar exibe três opções de nome de pacote: Servidor MySQL, Painel de Preferências e Suporte ao Launchd. Todas as três opções estão marcadas.](images/mac-installer-installation-customize.png)

6. Clique em Instalar para iniciar o processo de instalação.

7. Após a instalação bem-sucedida, o instalador exibe uma janela com sua senha de root temporária. Essa senha não pode ser recuperada, então você deve salvá-la para o login inicial no MySQL. Por exemplo:

   **Figura 2.17: Assistente do Instalador do Pacote MySQL: Senha de Root Temporária**

   ![O conteúdo é descrito no texto ao redor.](images/mac-installer-root-password.png)

   Nota

   O MySQL expira essa senha de root temporária após o login inicial e exige que você crie uma nova senha.

8. O resumo é a etapa final e faz referência a uma instalação bem-sucedida e completa do MySQL Server. Feche o assistente.

   **Figura 2.18: Assistente do Instalador do Pacote MySQL: Resumo**

   ![Mostra que a instalação foi um sucesso e inclui links para o manual do MySQL, mysql.com e oracle.com.](images/mac-installer-summary.png)

O servidor MySQL está agora instalado, mas não é carregado (ou iniciado) por padrão. Use o launchctl a partir da linha de comando ou inicie o MySQL clicando em "Iniciar" usando o painel de preferências do MySQL. Para obter informações adicionais, consulte a Seção 2.4.3, “Instalando um Daemon de Lançamento do MySQL”, e a Seção 2.4.4, “Instalando e Usando o Painel de Preferências do MySQL”. Use o Painel de Preferências do MySQL ou o launchd para configurar o MySQL para iniciar automaticamente ao inicializar.

Ao instalar usando o instalador de pacotes, os arquivos são instalados em um diretório dentro de `/usr/local` que corresponde ao nome da versão e plataforma de instalação. Por exemplo, o arquivo do instalador `mysql-5.7.44-macos10.13-x86_64.dmg` instala o MySQL em `/usr/local/mysql-5.7.44-macos10.13-x86_64/`. A tabela a seguir mostra a estrutura do diretório de instalação.

**Tabela 2.7. Estrutura de instalação do MySQL no macOS**

<table>
   <col style="width: 45%"/>
   <col style="width: 55%"/>
   <thead>
      <tr>
         <th>Diretório</th>
         <th>Conteúdo do diretório</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>[[<code>bin</code>]]</td>
         <td><strong>mysqld</strong> programas de servidor, cliente e utilitário</td>
      </tr>
      <tr>
         <td>[[<code>data</code>]]</td>
         <td>Arquivos de registro, bancos de dados</td>
      </tr>
      <tr>
         <td>[[<code>docs</code>]]</td>
         <td>Documentos auxiliares, como as Notas de Lançamento e informações de construção</td>
      </tr>
      <tr>
         <td>[[<code>include</code>]]</td>
         <td>Incluir arquivos (cabeçalho)</td>
      </tr>
      <tr>
         <td>[[<code>lib</code>]]</td>
         <td>Livrarias</td>
      </tr>
      <tr>
         <td>[[<code>man</code>]]</td>
         <td>Páginas de manual do Unix</td>
      </tr>
      <tr>
         <td>[[<code>mysql-test</code>]]</td>
         <td>Conjunto de testes do MySQL</td>
      </tr>
      <tr>
         <td>[[<code>share</code>]]</td>
         <td>Arquivos de suporte variados, incluindo mensagens de erro, arquivos de configuração de exemplo, SQL para instalação de banco de dados</td>
      </tr>
      <tr>
         <td>[[<code>support-files</code>]]</td>
         <td>Scripts e arquivos de configuração de amostra</td>
      </tr>
      <tr>
         <td>[[<code>/tmp/mysql.sock</code>]]</td>
         <td>Localização do soquete Unix do MySQL</td>
      </tr>
   </tbody>
</table>

Durante o processo de instalação do pacote, um link simbólico de `/usr/local/mysql` para o diretório específico da versão/plataforma criado durante a instalação é criado automaticamente.
