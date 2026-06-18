### 19.1.2 Configuração da replicação com base na posição do arquivo de registro binário

19.1.2.1 Configuração da fonte de replicação

19.1.2.2 Configuração da replicação

19.1.2.3 Criando um Usuário para Replicação

19.1.2.4 Obter as coordenadas do log binário de origem de replicação

19.1.2.5 Escolher um Método para Instantâneos de Dados

19.1.2.6 Configuração de Replicas

19.1.2.7 Definindo a configuração de fonte no replicador

19.1.2.8 Adicionando réplicas a um ambiente de replicação

Esta seção descreve como configurar um servidor MySQL para usar a replicação com base na posição do arquivo de log binário. Existem vários métodos diferentes para configurar a replicação, e o método exato a ser usado depende de como você está configurando a replicação e se já tem dados no banco de dados na fonte que você deseja replicar.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação de Grupo do MySQL em um ambiente programático que permite implantar facilmente um clúster de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster se integra perfeitamente ao MySQL Router, que permite que suas aplicações se conectem ao clúster sem precisar escrever seu próprio processo de falha. Para casos de uso semelhantes que não exigem alta disponibilidade, no entanto, você pode usar o InnoDB ReplicaSet. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

Há algumas tarefas genéricas que são comuns a todas as configurações:

- Na fonte, você deve garantir que o registro binário esteja habilitado e configurar um ID de servidor único. Isso pode exigir o reinício do servidor. Consulte a Seção 19.1.2.1, “Configurando a configuração da fonte de replicação”.

- Em cada réplica que você deseja conectar à fonte, você deve configurar um ID de servidor único. Isso pode exigir o reinício do servidor. Consulte a Seção 19.1.2.2, “Definindo a Configuração da Réplica”.

- Opcionalmente, crie um usuário separado para que suas réplicas o utilizem durante a autenticação com a fonte ao ler o log binário para replicação. Veja a Seção 19.1.2.3, “Criando um Usuário para Replicação”.

- Antes de criar um instantâneo de dados ou iniciar o processo de replicação, no servidor de origem, você deve registrar a posição atual no log binário. Você precisa dessa informação ao configurar a replica, para que a replica saiba onde, dentro do log binário, começar a executar os eventos. Consulte a Seção 19.1.2.4, “Obtenção das coordenadas do log binário da fonte de replicação”.

- Se você já tem dados na fonte e deseja usá-los para sincronizar a replica, você precisa criar um instantâneo de dados para copiar os dados para a replica. O mecanismo de armazenamento que você está usando afeta a forma como você cria o instantâneo. Quando você está usando `MyISAM`, você deve parar de processar instruções na fonte para obter um bloqueio de leitura, depois obter suas coordenadas atuais do log binário e fazer o dump de seus dados, antes de permitir que a fonte continue executando instruções. Se você não parar a execução das instruções, o dump de dados e as informações de status da fonte tornam-se desajustados, resultando em bancos de dados inconsistentes ou corrompidos nas réplicas. Para mais informações sobre a replicação de uma fonte `MyISAM`, consulte a Seção 19.1.2.4, “Obtenção das coordenadas do log binário da fonte de replicação”. Se você estiver usando `InnoDB`, você não precisa de um bloqueio de leitura e uma transação que seja longa o suficiente para transferir o instantâneo de dados é suficiente. Para mais informações, consulte a Seção 17.19, “Replicação InnoDB e MySQL”.

- Configure a replica com as configurações para conectar-se à fonte, como o nome do host, as credenciais de login e o nome e a posição do arquivo de log binário. Consulte a Seção 19.1.2.7, “Definindo a Configuração da Fonte na Replica”.

- Implemente as medidas de segurança específicas para replicação nas fontes e réplicas conforme apropriado para o seu sistema. Consulte a Seção 19.3, “Segurança da Replicação”.

Nota

Certos passos durante o processo de configuração exigem o privilégio `SUPER`. Se você não tiver esse privilégio, pode não ser possível habilitar a replicação.

Após configurar as opções básicas, selecione seu cenário:

- Para configurar a replicação para uma instalação nova de uma fonte e réplicas que não contêm dados, consulte a Seção 19.1.2.6.1, “Configurando a Replicação com Novas Fontes e Réplicas”.

- Para configurar a replicação de uma nova fonte usando os dados de um servidor MySQL existente, consulte a Seção 19.1.2.6.2, “Configurando a Replicação com Dados Existentes”.

- Para adicionar réplicas a um ambiente de replicação existente, consulte a Seção 19.1.2.8, “Adicionar réplicas a um ambiente de replicação”.

Antes de administrar servidores de replicação do MySQL, leia todo este capítulo e tente todas as instruções mencionadas na Seção 15.4.1, “Instruções SQL para controle de servidores de origem”, e na Seção 15.4.2, “Instruções SQL para controle de servidores de réplica”. Além disso, familiarize-se com as opções de inicialização da replicação descritas na Seção 19.1.6, “Opções e variáveis de replicação e registro binário”.
