### 16.1.2 Configuração da replicação com base na posição do arquivo de registro binário

16.1.2.1 Configuração da fonte de replicação

16.1.2.2 Criando um Usuário para Replicação

16.1.2.3 Obter as coordenadas do log binário da fonte de replicação

16.1.2.4 Escolhendo um Método para Instantâneos de Dados

16.1.2.5 Configurando Replicas

16.1.2.6 Adicionando réplicas a uma topologia de replicação

Esta seção descreve como configurar um servidor MySQL para usar a replicação com base na posição do arquivo de log binário. Existem vários métodos diferentes para configurar a replicação, e o método exato a ser usado depende de como você está configurando a replicação e se já tem dados no banco de dados na fonte.

Há algumas tarefas genéricas que são comuns a todas as configurações:

- Na fonte, você deve habilitar o registro binário e configurar um ID de servidor único. Isso pode exigir o reinício do servidor. Consulte Seção 16.1.2.1, “Configurando a Configuração da Fonte de Replicação”.

- Em cada réplica que você deseja conectar à fonte, você deve configurar um ID de servidor único. Isso pode exigir o reinício do servidor. Consulte Seção 16.1.2.5.1, “Definindo a Configuração da Réplica”.

- Opcionalmente, crie um usuário separado para que suas réplicas o utilizem durante a autenticação com a fonte ao ler o log binário para replicação. Veja Seção 16.1.2.2, “Criando um Usuário para Replicação”.

- Antes de criar um instantâneo de dados ou iniciar o processo de replicação, no servidor de origem, você deve registrar a posição atual no log binário. Você precisa dessa informação ao configurar a replica para que ela saiba onde, no log binário, começar a executar os eventos. Consulte Seção 16.1.2.3, “Obtenção das coordenadas do log binário da fonte de replicação”.

- Se você já tem dados na fonte e deseja usá-los para sincronizar a replica, você precisa criar um instantâneo de dados para copiar os dados para a replica. O mecanismo de armazenamento que você está usando tem um impacto sobre como você cria o instantâneo. Quando você está usando `MyISAM`, você deve parar de processar instruções na fonte para obter um bloqueio de leitura, depois obter suas coordenadas atuais do log binário e fazer o dump de seus dados, antes de permitir que a fonte continue executando instruções. Se você não parar a execução das instruções, o dump de dados e as informações de status da fonte não correspondem, resultando em bancos de dados inconsistentes ou corrompidos nas réplicas. Para mais informações sobre a replicação de uma fonte `MyISAM`, consulte Seção 16.1.2.3, “Obtenção das coordenadas do log binário da fonte de replicação”. Se você está usando `InnoDB`, você não precisa de um bloqueio de leitura e uma transação que seja longa o suficiente para transferir o instantâneo de dados é suficiente. Para mais informações, consulte Seção 14.20, “Replicação InnoDB e MySQL”.

- Configure a replica com as configurações para conectar-se à fonte, como o nome do host, as credenciais de login e o nome e a posição do arquivo de log binário. Consulte Seção 16.1.2.5.2, “Definindo a Configuração da Fonte na Replica”.

Nota

Certos passos durante o processo de configuração exigem o privilégio `SUPER`. Se você não tiver esse privilégio, pode não ser possível habilitar a replicação.

Após configurar as opções básicas, selecione seu cenário:

- Para configurar a replicação para uma instalação nova de uma fonte e réplicas que não contêm dados, consulte Seção 16.1.2.5.3, “Configurando a replicação entre uma nova fonte e réplicas”.

- Para configurar a replicação de uma nova fonte usando os dados de um servidor MySQL existente, consulte Seção 16.1.2.5.4, “Configurando a Replicação com Dados Existentes”.

- Para adicionar réplicas a um ambiente de replicação existente, consulte Seção 16.1.2.6, “Adicionar réplicas a uma topologia de replicação”.

Antes de administrar servidores de replicação do MySQL, leia todo este capítulo e tente todas as instruções mencionadas em Seção 13.4.1, “Instruções SQL para controle de servidores de origem de replicação” e Seção 13.4.2, “Instruções SQL para controle de servidores de réplica”. Além disso, familiarize-se com as opções de inicialização de replicação descritas em Seção 16.1.6, “Opções e variáveis de replicação e registro binário”.
