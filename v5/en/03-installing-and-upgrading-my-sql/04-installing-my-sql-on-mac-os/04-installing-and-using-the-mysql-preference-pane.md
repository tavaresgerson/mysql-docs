### 2.4.4 Instalando e Usando o Painel de Preferências do MySQL

O Pacote de Instalação do MySQL inclui um Painel de Preferências do MySQL (*MySQL preference pane*) que permite iniciar, parar e controlar a inicialização automática (*automated startup*) durante o *boot* da sua instalação do MySQL.

Este Painel de Preferências é instalado por padrão e está listado na janela *Preferências do Sistema* (*System Preferences*) do seu sistema.

**Figura 2.21 Painel de Preferências do MySQL: Localização**

![Content is described in the surrounding text.](images/mac-installer-preference-pane-location.png)

Para instalar o Painel de Preferências do MySQL:

1. Faça o download da imagem de disco (arquivo `.dmg`) (a versão Community está disponível [aqui](https://dev.mysql.com/downloads/mysql/)) que contém o instalador do pacote MySQL. Dê um clique duplo no arquivo para montar a imagem de disco e ver seu conteúdo.

   **Figura 2.22 Instalador do Pacote MySQL: Conteúdo do DMG**

   ![Content is described in the surrounding text.](images/mac-installer-dmg-contents.png)

2. Siga o processo de instalação do MySQL Server, conforme descrito na documentação na Seção 2.4.2, “Instalando o MySQL no macOS Usando Pacotes Nativos”.

3. Clique em Customize (Personalizar) na etapa Tipo de Instalação. A opção "Preference Pane" (Painel de Preferências) está listada ali e habilitada por padrão; certifique-se de que não esteja desmarcada.

   **Figura 2.23 Instalador do MySQL no macOS: Personalizar (Customize)**

   ![Content is described in the surrounding text.](images/mac-installer-installation-customize.png)

4. Conclua o processo de instalação do MySQL Server.

Nota

O Painel de Preferências do MySQL (*MySQL preference pane*) apenas inicia e para instalações do MySQL que foram instaladas a partir do pacote de instalação do MySQL e que estão no local padrão.

Uma vez que o Painel de Preferências do MySQL (*MySQL preference pane*) tenha sido instalado, você pode controlar sua instância do MySQL Server usando o Painel de Preferências. Para usar o Painel de Preferências, abra *System Preferences...* (Preferências do Sistema...) no menu Apple. Selecione o Painel de Preferências do MySQL clicando no ícone do MySQL dentro da lista de painéis de preferência.

**Figura 2.24 Painel de Preferências do MySQL: Localização**

![Content is described in the surrounding text.](images/mac-installer-preference-pane-location.png)

**Figura 2.25 Painel de Preferências do MySQL: Uso**

![Content is described in the surrounding text.](images/mac-installer-preference-pane-usage.png)

O Painel de Preferências do MySQL exibe o status atual do MySQL Server, mostrando *stopped* (parado, em vermelho) se o *Server* não estiver em execução e *running* (em execução, em verde) se o *Server* já tiver sido iniciado. O Painel de Preferências também exibe a configuração atual sobre se o MySQL Server está configurado para iniciar automaticamente.

* **Para iniciar o MySQL Server usando o Painel de Preferências:**

  Clique em Start MySQL Server (Iniciar MySQL Server). Pode ser solicitado o nome de usuário e a senha de um usuário com privilégios de administrador para iniciar o MySQL Server.

* **Para parar o MySQL Server usando o Painel de Preferências:**

  Clique em Stop MySQL Server (Parar MySQL Server). Pode ser solicitado o nome de usuário e a senha de um usuário com privilégios de administrador para parar o MySQL Server.

* **Para iniciar o MySQL Server automaticamente quando o sistema inicializar (*boots*):**

  Marque a caixa de seleção ao lado de Automatically Start MySQL Server on Startup (Iniciar MySQL Server Automaticamente na Inicialização).

* **Para desabilitar a inicialização automática do MySQL Server quando o sistema inicializar (*boots*):**

  Desmarque a caixa de seleção ao lado de Automatically Start MySQL Server on Startup (Iniciar MySQL Server Automaticamente na Inicialização).

Você pode fechar a janela **System Preferences...** (Preferências do Sistema...) assim que tiver concluído suas configurações.
