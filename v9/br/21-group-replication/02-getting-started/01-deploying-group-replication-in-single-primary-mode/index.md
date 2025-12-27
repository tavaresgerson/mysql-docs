### 20.2.1 Implantação da Replicação em Grupo no Modo de Primordial Único

20.2.1.1 Implantação de Instâncias para a Replicação em Grupo

20.2.1.2 Configuração de uma Instância para a Replicação em Grupo

20.2.1.3 Credenciais de Usuário para a Recuperação Distribuída

20.2.1.4 Lançamento da Replicação em Grupo

20.2.1.5 Inicialização do Grupo

20.2.1.6 Adição de Instâncias ao Grupo

Cada uma das instâncias do servidor MySQL em um grupo pode ser executada em uma máquina hospedeira física independente, que é a maneira recomendada para implantar a Replicação em Grupo. Esta seção explica como criar um grupo de replicação com três instâncias do Servidor MySQL, cada uma executando em uma máquina hospedeira diferente. Consulte a Seção 20.2.2, “Implantação da Replicação em Grupo Localmente” para informações sobre a implantação de múltiplas instâncias do Servidor MySQL executando a Replicação em Grupo na mesma máquina hospedeira, por exemplo, para fins de teste.

**Figura 20.7 Arquitetura do Grupo**

![Três instâncias de servidor, S1, S2 e S3, são implantadas como um grupo interconectado, e os clientes comunicam-se com cada uma das instâncias de servidor.](images/gr-3-server-group.png)

Este tutorial explica como obter e implantar o Servidor MySQL com o plugin de Replicação em Grupo, como configurar cada instância do servidor antes de criar um grupo e como usar o monitoramento do Schema de Desempenho para verificar se tudo está funcionando corretamente.