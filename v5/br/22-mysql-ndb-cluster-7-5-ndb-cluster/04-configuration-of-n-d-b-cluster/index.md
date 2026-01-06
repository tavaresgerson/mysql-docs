## 21.4 Configuração do NDB Cluster

21.4.1 Configuração rápida do teste do cluster NDB

21.4.2 Visão geral dos parâmetros, opções e variáveis de configuração do NDB Cluster

21.4.3 Arquivos de configuração do cluster NDB

21.4.4 Uso de interconexões de alta velocidade com o NDB Cluster

Um servidor MySQL que faz parte de um NDB Cluster difere de um servidor MySQL normal (não agrupado) em um aspecto principal: ele utiliza o mecanismo de armazenamento `NDB`. Esse mecanismo também é às vezes chamado de `NDBCLUSTER`, embora `NDB` seja preferível.

Para evitar a alocação desnecessária de recursos, o servidor é configurado por padrão com o mecanismo de armazenamento `NDB` desativado. Para habilitar o `NDB`, você deve modificar o arquivo de configuração `my.cnf` do servidor ou iniciar o servidor com a opção `--ndbcluster`.

Esse servidor MySQL faz parte do clúster, então ele também deve saber como acessar um nó de gerenciamento para obter os dados da configuração do clúster. O comportamento padrão é procurar o nó de gerenciamento em `localhost`. No entanto, se você precisar especificar que sua localização é em outro lugar, isso pode ser feito em `my.cnf` ou com o cliente **mysql**. Antes que o mecanismo de armazenamento `NDB` possa ser usado, pelo menos um nó de gerenciamento deve estar operacional, assim como quaisquer nós de dados desejados.

Para obter mais informações sobre `--ndbcluster` e outras opções do **mysqld** específicas para o NDB Cluster, consulte Seção 21.4.3.9.1, “Opções do Servidor MySQL para NDB Cluster”.

Para obter informações gerais sobre a instalação do NDB Cluster, consulte Seção 21.3, “Instalação do NDB Cluster”.
