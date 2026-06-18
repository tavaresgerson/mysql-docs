## 21.4 Configuração do NDB Cluster

21.4.1 Configuração de Teste Rápido do NDB Cluster

21.4.2 Visão Geral dos Parâmetros, Opções e Variáveis de Configuração do NDB Cluster

21.4.3 Arquivos de Configuração do NDB Cluster

21.4.4 Usando Interconexões de Alta Velocidade com o NDB Cluster

Um MySQL server que faz parte de um NDB Cluster difere em um aspecto principal de um MySQL server normal (não-clustered): ele emprega o storage engine `NDB`. Este engine também é, às vezes, referido como `NDBCLUSTER`, embora `NDB` seja o termo preferido.

Para evitar alocação desnecessária de recursos, o server é configurado por padrão com o storage engine `NDB` desabilitado. Para habilitar `NDB`, você deve modificar o arquivo de configuração `my.cnf` do server, ou iniciar o server com a opção `--ndbcluster`.

Este MySQL server faz parte do cluster, portanto, também deve saber como acessar um management node para obter os dados de configuração do cluster. O comportamento padrão é procurar o management node em `localhost`. No entanto, caso precise especificar que sua localização é em outro lugar, isso pode ser feito em `my.cnf`, ou com o **mysql** client. Antes que o storage engine `NDB` possa ser usado, pelo menos um management node deve estar operacional, assim como quaisquer data nodes desejados.

Para mais informações sobre `--ndbcluster` e outras opções do **mysqld** específicas para o NDB Cluster, consulte Seção 21.4.3.9.1, “Opções do MySQL Server para NDB Cluster”.

Para informações gerais sobre a instalação do NDB Cluster, consulte Seção 21.3, “Instalação do NDB Cluster”.