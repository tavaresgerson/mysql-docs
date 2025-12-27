### 19.4.1 Uso da Replicação para Backups

19.4.1.1 Fazer Backups de uma Replicação Usando mysqldump

19.4.1.2 Fazer Backups de Dados Brutos de uma Replicação

19.4.1.3 Fazer Backups de uma Fonte ou Replicação Tornando-a Apenas de Leitura

Para usar a replicação como solução de backup, replique os dados da fonte para uma replicação e, em seguida, faça um backup da replicação. A replicação pode ser pausada e desligada sem afetar o funcionamento em andamento da fonte, permitindo assim produzir um instantâneo eficaz dos dados “ativos” que, de outra forma, exigiriam o desligamento da fonte.

A forma como você faz um backup de um banco de dados depende do seu tamanho e se você está fazendo o backup apenas dos dados ou dos dados e do estado da replicação, para que você possa reconstruir a replicação no caso de falha. Portanto, há duas opções:

* Se você está usando a replicação como solução para permitir que você faça o backup dos dados na fonte e o tamanho do seu banco de dados não for muito grande, a ferramenta **mysqldump** pode ser adequada. Veja a Seção 19.4.1.1, “Fazendo Backups de uma Replicação Usando mysqldump”.

* Para bancos de dados maiores, onde **mysqldump** seria impraticável ou ineficiente, você pode fazer o backup dos arquivos de dados brutos. Usar a opção de arquivos de dados brutos também significa que você pode fazer o backup dos logs binários e de retransmissão que permitem a recriação da replicação no caso de falha da replicação. Para mais informações, veja a Seção 19.4.1.2, “Fazendo Backups de Dados Brutos de uma Replicação”.

Outra estratégia de backup, que pode ser usada para servidores de fonte ou replicação, é colocar o servidor em um estado de leitura apenas. O backup é realizado contra o servidor de leitura apenas, que é então alterado de volta ao seu estado operacional usual de leitura/escrita. Veja a Seção 19.4.1.3, “Fazendo Backups de uma Fonte ou Replicação Tornando-a Apenas de Leitura”.