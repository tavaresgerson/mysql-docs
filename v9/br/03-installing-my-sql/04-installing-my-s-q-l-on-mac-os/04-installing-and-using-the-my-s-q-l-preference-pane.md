### 2.4.4 Instalando e Usando o Painel de Preferências do MySQL

O Pacote de Instalação do MySQL inclui um painel de preferências do MySQL que permite iniciar, parar e controlar a inicialização automatizada durante o boot da sua instalação do MySQL.

Este painel de preferências é instalado por padrão e está listado na janela *Preferências do Sistema* do seu sistema.

**Figura 2.8 Painel de Preferências do MySQL: Localização**

![Mostra "MySQL" digitado na caixa de pesquisa das Preferências do Sistema do macOS, e um ícone "MySQL" destacado na parte inferior esquerda.](images/mac-installer-preference-pane-location.png)

O painel de preferências do MySQL é instalado com o mesmo arquivo DMG que instala o MySQL Server. Tipicamente, é instalado com o MySQL Server, mas também pode ser instalado por si só.

Para instalar o painel de preferências do MySQL:

1. Siga o processo de instalação do servidor MySQL, conforme descrito na documentação na Seção 2.4.2, “Instalando o MySQL no macOS Usando Pacotes Nativos”.

2. Clique em Personalizar na etapa de Tipo de Instalação. A opção "Painel de Preferências" está listada lá e habilitada por padrão; certifique-se de que ela não esteja desmarcada. As outras opções, como MySQL Server, podem ser selecionadas ou desmarcadas.

   **Figura 2.9 Guia do Instalação do Pacote do MySQL: Personalizar**

   ![Personalizar mostra três opções de nome de pacote: MySQL Server, MySQL Test, Painel de Preferências e Suporte ao Launchd. Todas as três opções estão marcadas.](images/mac-installer-installation-type-customize.png)

3. Complete o processo de instalação.

Nota

O painel de preferências do MySQL só inicia e para a instalação do MySQL instalada a partir da instalação do pacote do MySQL que foi instalado na localização padrão.

Uma vez que o painel de preferências do MySQL tenha sido instalado, você pode controlar sua instância do servidor MySQL usando este painel de preferências.

A página Instâncias inclui uma opção para iniciar ou parar o MySQL e o botão "Inicializar Banco de Dados" recria o diretório `data/`. A desinstalação desinstala o MySQL Server e, opcionalmente, o painel de preferências do MySQL e as informações do launchd.

**Figura 2.10 Painel de Preferências do MySQL: Instâncias**

![O lado esquerdo mostra uma lista de instâncias do MySQL separadas pelas seções "Instância Ativa", "Instâncias Instaladas" e "Diretórios de Dados". O lado direito mostra um botão "Parar o Servidor MySQL", uma caixa de seleção intitulada "Iniciar o MySQL quando o computador for iniciado" e os botões "Inicializar Banco de Dados" e "Desinstalar".](images/mac-installer-preference-pane-instances.png)

A página Configuração mostra as opções do MySQL Server, incluindo o caminho para o arquivo de configuração do MySQL.

**Figura 2.11 Painel de Preferências do MySQL: Configuração**

![O conteúdo é descrito no texto ao redor.](images/mac-installer-preference-pane-configuration.png)

O Painel de Preferências do MySQL mostra o status atual do servidor MySQL, mostrando parado (em vermelho) se o servidor não estiver em execução e em execução (em verde) se o servidor já tiver sido iniciado. O painel de preferências também mostra a configuração atual de se o servidor MySQL foi configurado para iniciar automaticamente.