#### 2.3.3.2 Configurando Caminhos Alternativos para o Server com o MySQL Installer

Você pode alterar o caminho de instalação padrão, o *data path*, ou ambos ao instalar o MySQL *server*. Depois que o *server* é instalado, os caminhos não podem ser alterados sem remover e reinstalar a *server instance*.

Nota

A partir do MySQL Installer 1.4.39, se você mover o *data directory* de um *server* instalado manualmente, o MySQL Installer identifica a mudança e pode processar uma operação de reconfiguração sem erros.

**Para alterar caminhos para o MySQL server**

1. Identifique o MySQL *server* a ser alterado e habilite o link Advanced Options (Opções Avançadas) da seguinte forma:

   1. Navegue até a página Select Products (Selecionar Produtos) fazendo um dos seguintes:

      1. Se este for um *setup* inicial do MySQL Installer, selecione o *setup type* `Custom` e clique em Next.

      2. Se o MySQL Installer estiver instalado no seu computador, clique em Add (Adicionar) no *dashboard*.

   2. Clique em Edit (Editar) para aplicar um filtro na lista de produtos mostrada em Available Products (Produtos Disponíveis) (consulte Localizando Produtos para Instalar).

   3. Com a *server instance* selecionada, use a seta para mover o *server* selecionado para a lista Products To Be Installed (Produtos a Serem Instalados).

   4. Clique no *server* para selecioná-lo. Ao selecionar o *server*, o link Advanced Options (Opções Avançadas) é habilitado abaixo da lista de produtos a serem instalados (consulte a figura a seguir).

2. Clique em Advanced Options (Opções Avançadas) para abrir uma caixa de diálogo onde você pode inserir nomes de caminhos alternativos. Após a validação dos nomes dos caminhos, clique em Next para continuar com as etapas de *configuration*.

   **Figura 2.9 Alterar o Caminho do MySQL Server**

   ![O conteúdo é descrito no texto circundante.](images/mi-path-advanced-options-annotated.png)
