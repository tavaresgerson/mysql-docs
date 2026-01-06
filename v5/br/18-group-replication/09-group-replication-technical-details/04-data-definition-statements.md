### 17.9.4 Declarações de Definição de Dados

Em uma topologia de replicação em grupo, é preciso ter cuidado ao executar instruções de definição de dados, também conhecidas como linguagem de definição de dados (DDL). Como o MySQL não suporta DDL atômica ou transacional, não se pode executar otimisticamente instruções de DDL e, posteriormente, reverter se necessário. Consequentemente, a falta de atomicidade não se encaixa diretamente no paradigma de replicação otimista em que a replicação em grupo é baseada.

Portanto, é necessário ter mais cuidado ao replicar declarações de definição de dados. Alterações no esquema e alterações nos dados que o objeto contém precisam ser tratadas pelo mesmo servidor enquanto a operação de esquema ainda não estiver concluída e replicada em todos os lugares. Não fazer isso pode resultar em inconsistência de dados.

Nota

Se o grupo estiver configurado no modo de primário único, então isso não é um problema, porque todas as alterações são realizadas através do mesmo servidor, o primário.

Aviso

A execução de DDL no MySQL não é atômica ou transacional. O servidor executa e confirma sem garantir o acordo do grupo primeiro. Como tal, você deve encaminhar DDL e DML para o mesmo objeto através do mesmo servidor, enquanto o DDL está sendo executado e ainda não foi replicado em todos os lugares.
