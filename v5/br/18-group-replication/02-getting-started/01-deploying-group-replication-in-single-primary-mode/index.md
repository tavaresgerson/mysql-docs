### 17.2.1 Implantação da Replicação em Grupo no Modo de Primordial Único

17.2.1.1 Implantação de Instâncias para Replicação em Grupo

17.2.1.2 Configurando uma Instância para Replicação em Grupo

17.2.1.3 Credenciais do usuário

17.2.1.4 Lançamento da Replicação em Grupo

17.2.1.5 Impulsionar o grupo

17.2.1.6 Adicionando Instâncias ao Grupo

Cada uma das instâncias do servidor MySQL em um grupo pode ser executada em uma máquina hospedeira física independente, que é a maneira recomendada para implantar a Replicação de Grupo. Esta seção explica como criar um grupo de replicação com três instâncias do Servidor MySQL, cada uma executando em uma máquina hospedeira diferente. Consulte Seção 17.2.2, “Implantação Local da Replicação de Grupo” para obter informações sobre a implantação de múltiplas instâncias do servidor MySQL executando a Replicação de Grupo na mesma máquina hospedeira, por exemplo, para fins de teste.

**Figura 17.4 Arquitetura de Grupo**

![Três instâncias de servidor, S1, S2 e S3, são implantadas como um grupo interconectado, e os clientes se comunicam com cada uma das instâncias de servidor](images/gr-3-server-group.png)

Este tutorial explica como obter e implantar o MySQL Server com o plugin de replicação por grupo, como configurar cada instância do servidor antes de criar um grupo e como usar o monitoramento do Schema de Desempenho para verificar se tudo está funcionando corretamente.
