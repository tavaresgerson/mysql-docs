#### 20.5.1.5 Configurando ações de membros

A partir do MySQL 8.0.26, a Replicação por Grupo tem a capacidade de definir ações que os membros de um grupo devem tomar em situações específicas. As ações dos membros podem ser habilitadas e desabilitadas individualmente usando funções. A configuração das ações dos membros de um servidor também pode ser redefinida para o padrão após ele ter deixado o grupo.

Os administradores (com o privilégio `GROUP_REPLICATION_ADMIN`) podem configurar uma ação de membro no primário do grupo usando a função `group_replication_enable_member_action` ou `group_replication_disable_member_action`. A configuração das ações de membro, que consiste em todas as ações de membro e se elas estão habilitadas ou desabilitadas, é então propagada para outros membros do grupo e membros que estão se juntando usando as mensagens de grupo da Replicação de Grupo. Portanto, todos os membros do grupo têm a mesma configuração de ações de membro. Você também pode configurar ações de membro em um servidor que não faz parte de um grupo, desde que o plugin de Replicação de Grupo esteja instalado. Nesse caso, a configuração das ações de membro não é propagada para nenhum outro servidor.

Se o servidor onde você usa as funções para configurar uma ação de membro faz parte de um grupo, ele deve ser o primário atual em um grupo no modo único primário e deve fazer parte da maioria. A alteração de configuração é rastreada internamente pelo Grupo de Replicação, mas não recebe um GTID e não é escrita no log binário, portanto, não é propagada para nenhum servidor fora do grupo, como as réplicas descendentes. O Grupo de Replicação incrementa o número de versão para a configuração de suas ações de membro toda vez que uma ação de membro é habilitada ou desabilitada.

A configuração das ações dos membros é propagada aos membros da seguinte forma:

- Ao iniciar um grupo, a configuração das ações dos membros do servidor que inicializa o grupo se torna a configuração do grupo.

- Se a versão mais baixa do servidor MySQL de um grupo suportar ações de membros, os membros que se juntam recebem a configuração das ações de membros do grupo durante o processo de troca de estado que ocorre quando eles se juntam. Nesse caso, o membro que se junta substitui sua própria configuração de ações de membros pela do grupo.

- Se um membro associado que suporta ações de membro se juntar a um grupo onde a versão mais baixa do MySQL Server não suporta ações de membro, ele não receberá uma configuração de ações de membro ao se juntar. Nesse caso, o membro associado redefinirá sua própria configuração para o padrão.

Um membro que não suporte ações de membro não pode se juntar a um grupo que tenha uma configuração de ações de membro, porque sua versão do MySQL Server é menor que a versão mais baixa que os membros do grupo existentes estão executando.

A tabela do Schema de Desempenho `replication_group_member_actions` lista as ações do membro que estão disponíveis na configuração, os eventos que as desencadeiam e se elas estão atualmente habilitadas ou não. As ações do membro têm uma prioridade de 1 a 100, com valores menores sendo executados primeiro. Se ocorrer um erro ao executar a ação do membro, o falha da ação do membro pode ser registrada, mas, caso contrário, ignorada. Se o falha da ação do membro for considerado crítico, ele pode ser tratado de acordo com a política especificada pela variável de sistema `group_replication_exit_state_action`.

A tabela `mysql.replication_group_configuration_version`, que pode ser visualizada usando a tabela do Schema de Desempenho `replication_group_configuration_version`, registra a versão atual da configuração das ações do membro. Sempre que uma ação do membro é habilitada ou desabilitada usando as funções, o número da versão é incrementado.

A função `group_replication_reset_member_actions` só pode ser usada em um servidor que não faça parte de um grupo. Ela redefere a configuração das ações de membro para as configurações padrão e redefere seu número de versão para 1. O servidor deve ser legível (com a variável de sistema `read_only` definida como `OFF`) e ter o plugin de replicação de grupo instalado. Você pode usar essa função para remover a configuração das ações de membro que um servidor usava quando fazia parte de um grupo, se você pretende usá-lo como um servidor autônomo sem ações de membro ou com ações de membro diferentes.

##### Ação do membro: `mysql_disable_super_read_only_if_primary`

A ação do membro `mysql_disable_super_read_only_if_primary` pode ser configurada para manter o grupo no modo de leitura super-somente quando um novo primário é eleito, de modo que o grupo aceite apenas transações replicadas e não aceite quaisquer escritas diretas dos clientes. Essa configuração significa que, quando o propósito de um grupo é fornecer um backup secundário para outro grupo para tolerância a desastres, você pode garantir que o grupo secundário permaneça sincronizado com o primeiro.

Por padrão, o modo de leitura apenas super é desativado no primário quando ele é eleito, para que o primário se torne de leitura e escrita e aceite atualizações de um servidor de origem de replicação e de clientes. Esta é a situação quando a ação do membro `mysql_disable_super_read_only_if_primary` é habilitada, que é sua configuração padrão. Se você definir a ação como desabilitada usando a função `group_replication_disable_member_action`, o primário permanecerá no modo de leitura apenas super após a eleição. Neste estado, ele não aceita atualizações de nenhum cliente, mesmo usuários que tenham o privilégio `CONNECTION_ADMIN` ou `SUPER`. Ele continua a aceitar atualizações realizadas por threads de replicação.
