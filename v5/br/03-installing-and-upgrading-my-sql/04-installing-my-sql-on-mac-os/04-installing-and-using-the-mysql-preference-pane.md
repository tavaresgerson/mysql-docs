### 2.4.4 Instalando e usando o painel de preferências do MySQL

O Pacote de Instalação do MySQL inclui uma janela de preferências do MySQL que permite iniciar, parar e controlar a inicialização automatizada durante o boot da sua instalação do MySQL.

Essa janela de preferências é instalada por padrão e está listada na janela *Preferências do Sistema* do seu sistema.

**Figura 2.21 Painel de Preferências do MySQL: Localização**

![](images/mac-installer-preference-pane-location.png)

Para instalar o Painel de Preferências do MySQL:

1. Baixe o arquivo de imagem de disco (`.dmg`) (a versão da comunidade está disponível [aqui](https://dev.mysql.com/downloads/mysql/)) que contém o instalador do pacote MySQL. Clique duas vezes no arquivo para montar a imagem de disco e ver seu conteúdo.

   **Figura 2.22: Instalador de Pacotes MySQL: Conteúdo do DMG**

   ![](images/mac-installer-dmg-contents.png)

2. Siga o processo de instalação do servidor MySQL, conforme descrito na documentação na Seção 2.4.2, “Instalando o MySQL no macOS usando pacotes nativos”.

3. Clique em Personalizar na etapa Tipo de instalação. A opção "Painel de preferências" está listada lá e ativada por padrão; certifique-se de que ela não esteja desmarcada.

   **Figura 2.23: Instalação do MySQL no macOS: Personalizar**

   ![](images/mac-installer-installation-customize.png)

4. Complete o processo de instalação do servidor MySQL.

::: info Nota
A janela de preferências do MySQL só inicia e para a instalação do MySQL instalada a partir da instalação do pacote MySQL que foram instalados na localização padrão.
:::

Depois que o painel de preferências do MySQL for instalado, você pode controlar sua instância do servidor MySQL usando o painel de preferências. Para usar o painel de preferências, abra as Preferências do Sistema... no menu Apple. Selecione o painel de preferências do MySQL clicando no ícone do MySQL na lista de painéis de preferências.

**Figura 2.24 Painel de Preferências do MySQL: Localização**

![](images/mac-installer-preference-pane-location.png)

**Figura 2.25 Painel de Preferências do MySQL: Uso**

![](images/mac-installer-preference-pane-usage.png)

O Painel de Preferências do MySQL mostra o status atual do servidor MySQL, mostrando parado (em vermelho) se o servidor não estiver em execução e em execução (em verde) se o servidor já tiver sido iniciado. O painel de preferências também mostra a configuração atual de se o servidor MySQL foi configurado para iniciar automaticamente.

- **Para iniciar o servidor MySQL usando a janela de preferências:**

  Clique em Iniciar o servidor MySQL. Você pode ser solicitado a fornecer o nome de usuário e a senha de um usuário com privilégios de administrador para iniciar o servidor MySQL.

- **Para parar o servidor MySQL usando o painel de preferências:**

  Clique em Parar o servidor MySQL. Você pode ser solicitado a fornecer o nome de usuário e a senha de um usuário com privilégios de administrador para parar o servidor MySQL.

- **Para iniciar automaticamente o servidor MySQL quando o sistema for inicializado:**

  Marque a caixa de seleção ao lado de Iniciar automaticamente o servidor MySQL ao iniciar o sistema.

- **Para desativar o início automático do servidor MySQL quando o sistema é inicializado:**

  Desmarque a caixa de seleção ao lado de Iniciar automaticamente o servidor MySQL ao iniciar o sistema.

Você pode fechar a janela **Preferências do Sistema...** assim que tiver concluído as configurações.
