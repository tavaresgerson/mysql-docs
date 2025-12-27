### 7.6.6 O Plugin de Clonagem

7.6.6.1 Instalando o Plugin de Clonagem

7.6.6.2 Clonando Dados Localmente

7.6.6.3 Clonando Dados Remotas

7.6.6.4 Clonagem e DDL Concurrentes

7.6.6.5 Clonagem de Dados Encriptados

7.6.6.6 Clonagem de Dados Compactos

7.6.6.7 Clonagem para Replicação

7.6.6.8 Diretórios e Arquivos Criados Durante uma Operação de Clonagem

7.6.6.9 Gerenciamento de Falhas na Operação de Clonagem Remota

7.6.6.10 Monitoramento de Operações de Clonagem

7.6.6.11 Parando uma Operação de Clonagem

7.6.6.12 Referência à Variável de Sistema Clone

7.6.6.13 Variáveis de Sistema Clone

7.6.6.14 Limitações do Plugin de Clonagem

O plugin de clonagem permite a clonagem de dados localmente ou a partir de uma instância remota do servidor MySQL. Os dados clonados são um instantâneo físico dos dados armazenados no `InnoDB` que incluem esquemas, tabelas, espaços de tabelas e metadados do dicionário de dados. Os dados clonados compreendem um diretório de dados totalmente funcional, o que permite o uso do plugin de clonagem para provisionamento do servidor MySQL.

**Figura 7.1 Operação de Clonagem Local**

![A declaração CLONE LOCAL clona o diretório de dados em uma instância local do servidor MySQL para outro diretório local, que é referido como o diretório de clonagem.](images/clone-local.png)

Uma operação de clonagem local clona dados da instância do servidor MySQL onde a operação de clonagem é iniciada para um diretório no mesmo servidor ou nó onde a instância do servidor MySQL está em execução.

**Figura 7.2 Operação de Clonagem Remota**

![A declaração CLONE INSTANCE emitida a partir da instância receptora local do servidor MySQL clona o diretório de dados da instância do servidor MySQL doador remoto para o diretório de dados na instância receptora local do servidor MySQL.](images/clone-remote.png)

Uma operação de clonagem remota envolve uma instância local do servidor MySQL (o “receptor”) onde a operação de clonagem é iniciada, e uma instância remota do servidor MySQL (o “doador”) onde os dados de origem estão localizados. Quando uma operação de clonagem remota é iniciada no receptor, os dados clonados são transferidos pela rede do doador para o receptor. Por padrão, uma operação de clonagem remota remove os dados criados pelo usuário (esquemas, tabelas, espaços de tabelas) e logs binários do diretório de dados do receptor antes de clonar os dados do doador. Opcionalmente, você pode clonar os dados para um diretório diferente no receptor para evitar a remoção de dados do diretório de dados atual do receptor.

Não há diferença em relação aos dados clonados por uma operação de clonagem local em comparação com uma operação de clonagem remota. Ambas as operações clonam o mesmo conjunto de dados.

O plugin de clonagem suporta a replicação. Além de clonar dados, uma operação de clonagem extrai e transfere as coordenadas de replicação do doador e as aplica no receptor, o que permite usar o plugin de clonagem para provisionar membros e réplicas da replicação de grupo. Usar o plugin de clonagem para provisionamento é consideravelmente mais rápido e eficiente do que replicar um grande número de transações (veja a Seção 7.6.6.7, “Clonagem para Replicação”). Os membros da replicação de grupo também podem ser configurados para usar o plugin de clonagem como um método alternativo de recuperação, de modo que os membros escolham automaticamente a maneira mais eficiente de recuperar os dados do grupo a partir dos membros de semente. Para mais informações, consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”.

O plugin de clonagem suporta a clonagem de dados criptografados e compactados por página. Veja a Seção 7.6.6.5, “Clonagem de Dados Criptografados”, e a Seção 7.6.6.6, “Clonagem de Dados Compactados”.

O plugin de clonagem deve ser instalado antes que você possa usá-lo. Para obter instruções de instalação, consulte a Seção 7.6.6.1, “Instalando o Plugin de Clonagem”. Para obter instruções de clonagem, consulte a Seção 7.6.6.2, “Clonando Dados Localmente” e a Seção 7.6.6.3, “Clonando Dados Remotas”.

As tabelas e a instrumentação do Schema de Desempenho são fornecidas para monitorar as operações de clonagem. Consulte a Seção 7.6.6.10, “Monitorando Operações de Clonagem”.