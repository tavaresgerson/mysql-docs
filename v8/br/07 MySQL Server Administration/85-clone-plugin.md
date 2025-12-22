### 7.6.7 O Plug-in Clone

O plugin clone permite clonar dados localmente ou a partir de uma instância remota do servidor MySQL. Os dados clonados são um instantâneo físico de dados armazenados no `InnoDB` que inclui esquemas, tabelas, espaços de tabela e metadados do dicionário de dados. Os dados clonados compreendem um diretório de dados totalmente funcional, que permite o uso do plugin clone para o provisionamento do servidor MySQL.

**Figura 7.1 Operação de clonagem local**

![The CLONE LOCAL statement clones the data directory on a local MySQL Server instance to another local directory, which is referred to as the clone directory.](images/clone-local.png)

Uma operação de clonagem local clona dados da instância do servidor MySQL onde a operação de clonagem é iniciada para um diretório no mesmo servidor ou nó onde a instância do servidor MySQL é executada.

**Figura 7.2 Operação de clonagem remota**

![The CLONE INSTANCE statement issued from the local recipient MySQL Server instance clones the data directory from the remote donor MySQL server instance to the data directory on the local recipient MySQL Server instance.](images/clone-remote.png)

Uma operação de clonagem remota envolve uma instância do servidor MySQL local (o recipiente) onde a operação de clonagem é iniciada, e uma instância do servidor MySQL remoto (o doador) onde os dados de origem estão localizados. Quando uma operação de clonagem remota é iniciada no destinatário, os dados clonados são transferidos pela rede do doador para o destinatário. Por padrão, uma operação de clonagem remota remove os dados existentes criados pelo usuário (esquemas, tabelas, tablespaces) e registros binários do diretório de dados do destinatário antes de clonar dados do doador. Opcionalmente, você pode clonar dados para um diretório diferente no destinatário para evitar a remoção de dados do diretório de dados do destinatário atual.

Não há diferença em relação aos dados que são clonados por uma operação de clonagem local em comparação com uma operação de clonagem remota.

O plugin de clonagem suporta replicação. Além de dados de clonagem, uma operação de clonagem extrai e transfere coordenadas de replicação do doador e aplica-as ao destinatário, o que permite o uso do plugin de clonagem para provisionamento de membros e réplicas de replicação de grupo. O uso do plugin de clonagem para provisionamento é consideravelmente mais rápido e mais eficiente do que replicar um grande número de transações (ver Seção 7.6.7.7, "Clonagem para Replicação"). Os membros de replicação de grupo também podem ser configurados para usar o plugin de clonagem como um método alternativo de recuperação, de modo que os membros escolham automaticamente a maneira mais eficiente de recuperar dados de grupo de membros de semente. Para mais informações, consulte a Seção 20.5.4.2, "Clonagem para Recuperação Distribuída".

O plugin de clonagem suporta a clonagem de dados criptografados e compactados por página. Veja a Seção 7.6.7.5, "Clonagem de Dados Criptografados" e a Seção 7.6.7.6, "Clonagem de Dados Comprimidos".

Para instruções de instalação, consulte a Seção 7.6.7.1, Instalar o Plugin Clone. Para instruções de clonagem, consulte a Seção 7.6.7.2, Clonar Dados Localmente, e a Seção 7.6.7.3, Clonar Dados Remotos.

São fornecidos quadros e instrumentos do esquema de desempenho para a monitorização das operações de clonagem.
