## Configuração do NDB Cluster

25.4.1 Configuração Rápida do NDB Cluster

25.4.2 Visão Geral dos Parâmetros, Opções e Variáveis de Configuração do NDB Cluster

25.4.3 Arquivos de Configuração do NDB Cluster

25.4.4 Uso de Interconexões de Alta Velocidade com o NDB Cluster

Um servidor MySQL que faz parte de um NDB Cluster difere de um servidor MySQL normal (não clusterizado) em um aspecto principal: ele utiliza o mecanismo de armazenamento `NDB`. Esse mecanismo também é às vezes referido como `NDBCLUSTER`, embora `NDB` seja preferido.

Para evitar a alocação desnecessária de recursos, o servidor é configurado por padrão com o mecanismo de armazenamento `NDB` desativado. Para ativar o `NDB`, você deve modificar o arquivo de configuração `my.cnf` do servidor ou iniciar o servidor com a opção `--ndbcluster`.

Este servidor MySQL faz parte do cluster, então ele também deve saber como acessar um nó de gerenciamento para obter os dados de configuração do cluster. O comportamento padrão é procurar o nó de gerenciamento em `localhost`. No entanto, se você precisar especificar que sua localização é em outro lugar, isso pode ser feito no `my.cnf` ou com o cliente **mysql**. Antes que o mecanismo de armazenamento `NDB` possa ser usado, pelo menos um nó de gerenciamento deve estar operacional, assim como qualquer nó de dados desejado.

Para obter mais informações sobre `--ndbcluster` e outras opções do **mysqld** específicas para o NDB Cluster, consulte a Seção 25.4.3.9.1, “Opções do Servidor MySQL para NDB Cluster”.

Para informações gerais sobre a instalação do NDB Cluster, consulte a Seção 25.3, “Instalação do NDB Cluster”.