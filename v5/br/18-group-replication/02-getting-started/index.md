## 17.2 Primeiros Passos

[17.2.1 Implantando o Group Replication no Modo Single-Primary](group-replication-deploying-in-single-primary-mode.html)

[17.2.2 Implantando o Group Replication Localmente](group-replication-deploying-locally.html)

O MySQL Group Replication é fornecido como um plugin para o servidor MySQL; cada servidor em um grupo requer a configuração e instalação do plugin. Esta seção fornece um tutorial detalhado com os passos necessários para criar um grupo de replicação com pelo menos três membros.

Dica

Uma maneira alternativa de implantar múltiplas instâncias do MySQL é usando o InnoDB Cluster, que utiliza o Group Replication e o envolve em um ambiente programático que permite trabalhar facilmente com grupos de instâncias do servidor MySQL no [MySQL Shell 8.0](/doc/mysql-shell/8.0/en/). Além disso, o InnoDB Cluster se integra perfeitamente ao MySQL Router e simplifica a implantação do MySQL com alta disponibilidade. Consulte [MySQL AdminAPI](/doc/mysql-shell/8.0/en/admin-api-userguide.html).
