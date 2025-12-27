### 7.6.7 O Plugin de Clonagem

O plugin de clonagem permite clonar dados localmente ou a partir de uma instância remota do servidor MySQL. Os dados clonados são um instantâneo físico dos dados armazenados no `InnoDB` que incluem esquemas, tabelas, espaços de tabelas e metadados do dicionário de dados. Os dados clonados compreendem um diretório de dados totalmente funcional, o que permite usar o plugin de clonagem para provisionamento do servidor MySQL.

**Figura 7.1 Operação de Clonagem Local**

![A declaração CLONE LOCAL clona o diretório de dados em uma instância local do servidor MySQL para outro diretório local, que é referido como o diretório de clonagem.](images/clone-local.png)

Uma operação de clonagem local clona dados da instância do servidor MySQL onde a operação de clonagem é iniciada para um diretório no mesmo servidor ou nó onde a instância do servidor MySQL está em execução.

**Figura 7.2 Operação de Clonagem Remota**

![A declaração CLONE INSTANCE emitida a partir da instância local do servidor MySQL destinatário clona o diretório de dados da instância remota do servidor MySQL doador para o diretório de dados na instância local do servidor MySQL destinatário.](images/clone-remote.png)

Uma operação de clonagem remota envolve uma instância local do servidor MySQL (o “destinatário”) onde a operação de clonagem é iniciada, e uma instância remota do servidor MySQL (o “doador”) onde os dados de origem estão localizados. Quando uma operação de clonagem remota é iniciada no destinatário, os dados clonados são transferidos pela rede do doador para o destinatário. Por padrão, uma operação de clonagem remota remove dados criados pelo usuário (esquemas, tabelas, espaços de tabelas) e logs binários do diretório de dados do destinatário antes de clonar dados do doador. Opcionalmente, você pode clonar dados para um diretório diferente no destinatário para evitar a remoção de dados do diretório de dados atual do destinatário.

Não há diferença em relação aos dados clonados por uma operação de clonagem local em comparação com uma operação de clonagem remota. Ambas as operações clonam o mesmo conjunto de dados.

O plugin de clonagem suporta a replicação. Além de clonar dados, uma operação de clonagem extrai e transfere as coordenadas de replicação do doador e aplica-as no destinatário, o que permite usar o plugin de clonagem para provisionamento de membros e réplicas da Replicação em Grupo. Usar o plugin de clonagem para provisionamento é consideravelmente mais rápido e eficiente do que replicar um grande número de transações (veja a Seção 7.6.7.7, “Clonagem para Replicação”). Os membros da Replicação em Grupo também podem ser configurados para usar o plugin de clonagem como um método alternativo de recuperação, de modo que os membros escolham automaticamente a maneira mais eficiente de recuperar os dados do grupo a partir dos membros de semente. Para mais informações, consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”.

O plugin de clonagem suporta a clonagem de dados criptografados e compactados por página. Veja as Seções 7.6.7.5, “Clonagem de Dados Criptografados” e 7.6.7.6, “Clonagem de Dados Compactados”.

O plugin de clonagem deve ser instalado antes que você possa usá-lo. Para instruções de instalação, consulte a Seção 7.6.7.1, “Instalando o Plugin de Clonagem”. Para instruções de clonagem, consulte as Seções 7.6.7.2, “Clonagem de Dados Localmente” e 7.6.7.3, “Clonagem de Dados Remota”.

As tabelas e a instrumentação do Schema de Desempenho são fornecidas para monitorar as operações de clonagem. Veja a Seção 7.6.7.10, “Monitoramento de Operações de Clonagem”.