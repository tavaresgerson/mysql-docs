### 16.3.1 Uso da replicação para backups

16.3.1.1 Fazer backup de uma réplica usando mysqldump

16.3.1.2 Fazer backup de dados brutos de uma réplica

16.3.1.3 Fazer backup de uma fonte ou réplica tornando-a apenas de leitura

Para usar a replicação como solução de backup, replique os dados da fonte para uma replica e, em seguida, faça o backup da replica. A replica pode ser pausada e desligada sem afetar o funcionamento da operação em andamento da fonte, permitindo que você produza um instantâneo eficaz dos dados "ativos" que, de outra forma, exigiriam o desligamento da fonte.

A forma como você faz o backup de um banco de dados depende do seu tamanho e se você está fazendo o backup apenas dos dados ou dos dados e do estado da replica, para que você possa reconstruir a replica em caso de falha. Portanto, há duas opções:

- Se você está usando a replicação como uma solução para fazer backup dos dados na fonte e o tamanho do seu banco de dados não for muito grande, a ferramenta **mysqldump** pode ser adequada. Veja Seção 16.3.1.1, “Fazendo backup de uma réplica usando mysqldump”.

- Para bancos de dados maiores, onde o **mysqldump** seria impraticável ou ineficiente, você pode fazer backup dos arquivos de dados brutos. Ao usar a opção de arquivos de dados brutos, você também pode fazer backup dos logs binários e de retransmissão, o que permite recriar a replica em caso de falha da replica. Para mais informações, consulte Seção 16.3.1.2, “Fazendo backup de dados brutos de uma replica”.

Outra estratégia de backup, que pode ser usada para servidores de origem ou replica, é colocar o servidor em estado de leitura apenas. O backup é realizado contra o servidor de leitura apenas, que é então alterado de volta ao seu estado operacional normal de leitura/escrita. Veja Seção 16.3.1.3, “Fazendo um backup de uma origem ou replica tornando-a de leitura apenas”.
