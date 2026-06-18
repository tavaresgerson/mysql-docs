### 7.6.7 O Plugin Clone

7.6.7.1 Instalação do Plugin Clone

7.6.7.2 Clonagem de Dados Localmente

7.6.7.3 Clonagem de Dados Remotas

7.6.7.4 Clonagem e DDL Concorrente

7.6.7.5 Clonagem de Dados Criptografados

7.6.7.6 Clonagem de Dados Compactos

7.6.7.7 Clonagem para Replicação

7.6.7.8 Diretórios e Arquivos Criados Durante uma Operação de Clonagem

7.6.7.9 Gerenciamento de falhas na operação de clonagem remota

7.6.7.10 Monitoramento de operações de clonagem

7.6.7.11 Parar uma operação de clonagem

7.6.7.12 Referência de variável de sistema de clonagem

7.6.7.13 Clonar variáveis do sistema

7.6.7.14 Limitações do Plugin de Clonagem

O plugin de clonagem, introduzido no MySQL 8.0.17, permite clonar dados localmente ou a partir de uma instância remota do servidor MySQL. Os dados clonados são um instantâneo físico dos dados armazenados no `InnoDB` que incluem esquemas, tabelas, espaços de tabelas e metadados do dicionário de dados. Os dados clonados compreendem um diretório de dados totalmente funcional, que permite o uso do plugin de clonagem para provisionamento do servidor MySQL.

**Figura 7.1 Operação de Clonagem Local**

![The CLONE LOCAL statement clones the data directory on a local MySQL Server instance to another local directory, which is referred to as the clone directory.](images/clone-local.png)

Uma operação de clonagem local copia dados da instância do servidor MySQL onde a operação de clonagem é iniciada para um diretório no mesmo servidor ou nó onde a instância do servidor MySQL está em execução.

**Figura 7.2: Operação de Clonagem Remota**

![The CLONE INSTANCE statement issued from the local recipient MySQL Server instance clones the data directory from the remote donor MySQL server instance to the data directory on the local recipient MySQL Server instance.](images/clone-remote.png)

Uma operação de clonagem remota envolve uma instância local do servidor MySQL (o “destinatário”) onde a operação de clonagem é iniciada e uma instância remota do servidor MySQL (o “doador”) onde os dados de origem estão localizados. Quando uma operação de clonagem remota é iniciada no destinatário, os dados clonados são transferidos pela rede do doador para o destinatário. Por padrão, uma operação de clonagem remota remove os dados criados pelo usuário (esquemas, tabelas, espaços de tabelas) e logs binários do diretório de dados do destinatário antes de clonar os dados do doador. Opcionalmente, você pode clonar os dados para um diretório diferente no destinatário para evitar a remoção de dados do diretório de dados atual do destinatário.

Não há diferença em relação aos dados que são clonados por uma operação de clonagem local em comparação com uma operação de clonagem remota. Ambas as operações clonam o mesmo conjunto de dados.

O plugin de clonagem suporta a replicação. Além de clonar dados, uma operação de clonagem extrai e transfere as coordenadas de replicação do doador e aplica-as no destinatário, o que permite usar o plugin de clonagem para provisionar membros e réplicas da Replicação em Grupo. Usar o plugin de clonagem para provisionamento é consideravelmente mais rápido e eficiente do que replicar um grande número de transações (consulte a Seção 7.6.7.7, “Clonagem para Replicação”). Os membros da Replicação em Grupo também podem ser configurados para usar o plugin de clonagem como um método alternativo de recuperação, de modo que os membros escolham automaticamente a maneira mais eficiente de recuperar os dados do grupo a partir dos membros de semente. Para obter mais informações, consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”.

O plugin de clonagem suporta a clonagem de dados criptografados e compactados por página. Consulte a Seção 7.6.7.5, “Clonagem de Dados Criptografados”, e a Seção 7.6.7.6, “Clonagem de Dados Compactados”.

O plugin de clonagem deve ser instalado antes que você possa usá-lo. Para obter instruções de instalação, consulte a Seção 7.6.7.1, “Instalando o Plugin de Clonagem”. Para obter instruções de clonagem, consulte a Seção 7.6.7.2, “Clonando Dados Localmente” e a Seção 7.6.7.3, “Clonando Dados Remotas”.

As tabelas e a instrumentação do esquema de desempenho são fornecidas para monitorar as operações de clonagem. Consulte a Seção 7.6.7.10, “Monitoramento de Operações de Clonagem”.
