### 17.9.4 Declarações de Definição de Dados

Em uma topologia de Group Replication, é necessário ter cautela ao executar declarações de definição de dados, também comumente conhecidas como data definition language (DDL). Dado que o MySQL não suporta DDL atômica ou transacional, não se pode executar declarações DDL de forma otimista e posteriormente reverter (roll back) se for necessário. Consequentemente, a falta de atomicidade não se encaixa diretamente no paradigma de replicação otimista no qual o Group Replication se baseia.

Portanto, mais atenção deve ser dada ao replicar declarações de definição de dados. Alterações de Schema e alterações nos dados que o objeto contém precisam ser tratadas através do mesmo server enquanto a operação de Schema ainda não foi concluída e replicada em todos os lugares. A falha em fazer isso pode resultar em inconsistência de dados.

Nota

Se o grupo for implementado no modo single-primary, isso não é um problema, pois todas as alterações são realizadas através do mesmo server, o primary.

Atenção

A execução de DDL no MySQL não é atômica nem transacional. O server executa e faz o commit sem garantir o acordo do grupo primeiro. Como tal, você deve rotear DDL e DML para o mesmo objeto através do mesmo server, enquanto o DDL estiver em execução e ainda não tiver sido replicado em todos os lugares.