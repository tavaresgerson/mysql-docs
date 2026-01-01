#### 2.3.3.2 Configurando caminhos alternativos de servidor com o instalador do MySQL

Você pode alterar o caminho de instalação padrão, o caminho de dados ou ambos ao instalar o servidor MySQL. Após a instalação do servidor, os caminhos não podem ser alterados sem remover e reinstalar a instância do servidor.

Nota

A partir do MySQL Installer 1.4.39, se você mover manualmente o diretório de dados de um servidor instalado, o MySQL Installer identifica a mudança e pode processar uma operação de reconfiguração sem erros.

**Para alterar caminhos para o servidor MySQL**

1. Identifique o servidor MySQL para alterar e habilite o link Opções Avançadas da seguinte forma:

   1. Acesse a página Selecionar Produtos fazendo um dos seguintes:

      1. Se esta for uma configuração inicial do Instalador do MySQL, selecione o tipo de configuração `Custom` e clique em Próximo.

      2. Se o Instalador do MySQL estiver instalado no seu computador, clique em Adicionar no painel de controle.

   2. Clique em Editar para aplicar um filtro na lista de produtos exibida em Produtos disponíveis (consulte Localizar produtos para instalação).

   3. Com a instância do servidor selecionada, use a seta para mover o servidor selecionado para a lista de Produtos a serem instalados.

   4. Clique no servidor para selecioná-lo. Quando você selecionar o servidor, o link Opções Avançadas será ativado abaixo da lista de produtos a serem instalados (veja a figura a seguir).

2. Clique em Opções Avançadas para abrir uma caixa de diálogo onde você pode inserir nomes de caminho alternativos. Após os nomes de caminho serem validados, clique em Próximo para continuar com os passos de configuração.

   **Figura 2.9 Mudar o caminho do servidor MySQL**

   ![O conteúdo é descrito no texto ao redor.](images/mi-path-advanced-options-annotated.png)
