#### 16.1.5.2 Configuração de uma Replicação de Múltiplas Fontes para Replicação Baseada em GTID

Se as fontes na topologia de replicação de múltiplas fontes tiverem dados existentes, pode-se economizar tempo ao provisionar a replica com os dados relevantes antes de iniciar a replicação. Em uma topologia de replicação de múltiplas fontes, a cópia do diretório de dados não pode ser usada para provisionar a replica com dados de todas as fontes, e você também pode querer replicar apenas bancos de dados específicos de cada fonte. Portanto, a melhor estratégia para provisionar essa replica é usar **mysqldump** para criar um arquivo de dump apropriado em cada fonte, e depois usar o cliente **mysql** para importar o arquivo de dump na replica.

Se você estiver usando a replicação baseada em GTID, você precisa prestar atenção à declaração `SET @@GLOBAL.gtid_purged` que o **mysqldump** coloca na saída do dump. Essa declaração transfere os GTIDs para as transações executadas na fonte para a replica, e a replica requer essas informações. No entanto, para qualquer caso mais complexo do que provisionar uma nova replica vazia a partir de uma fonte, você precisa verificar qual efeito a declaração tem na versão do MySQL da replica e lidar com a declaração de acordo. As orientações a seguir resumem as ações adequadas, mas para mais detalhes, consulte a documentação do **mysqldump**.

No MySQL 5.6 e 5.7, a instrução `SET @@GLOBAL.gtid_purged` escrita pelo **mysqldump** substitui o valor de `gtid_purged` na replica. Além disso, nesses lançamentos, esse valor só pode ser alterado quando o registro de transações com GTIDs da replica (o valor de `gtid_executed` é definido) estiver vazio. Em uma topologia de replicação de múltiplas fontes, você deve, portanto, remover a instrução `SET @@GLOBAL.gtid_purged` da saída do dump antes de refazer os arquivos de dump, porque você não pode aplicar um segundo ou arquivo de dump subsequente que inclua essa instrução. Como alternativa para remover a instrução `SET @@GLOBAL.gtid_purged`, se você está provisionando a replica com dois dumps parciais da mesma fonte e o GTID definido no segundo dump é o mesmo do primeiro (portanto, nenhuma nova transação foi executada na fonte entre os dumps), você pode definir a opção `--set-gtid-purged` do **mysqldump** para `OFF` ao emitir o segundo arquivo de dump, para omitir a instrução.

Para o MySQL 5.6 e 5.7, essas limitações significam que todos os arquivos de dump das fontes devem ser aplicados em uma única operação em uma replica com um conjunto de configuração vazio de `gtid_executed`. Você pode limpar o histórico de execução do GTID de uma replica emitindo `RESET MASTER` na replica, mas se você tiver outras transações desejadas com GTIDs na replica, escolha um método alternativo de provisionamento descrito na Seção 16.1.3.5, “Uso de GTIDs para Failover e Scaleout”.

No exemplo de provisionamento a seguir, assumimos que a instrução `SET @@GLOBAL.gtid_purged` precisa ser removida dos arquivos e gerenciada manualmente. Também assumimos que não existem transações desejadas com GTIDs na replica antes do início do provisionamento.

1. Para criar arquivos de dump para um banco de dados chamado `db1` em `source1` e um banco de dados chamado `db2` em `source2`, execute **mysqldump** para `source1` da seguinte forma:

   ```sql
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db1 > dumpM1.sql
   ```

   Em seguida, execute **mysqldump** para `source2` da seguinte forma:

   ```sql
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db2 > dumpM2.sql
   ```

2. Registre o valor de `gtid_purged` que o **mysqldump** adicionou a cada um dos arquivos de dump. Por exemplo, para arquivos de dump criados no MySQL 5.6 ou 5.7, você pode extrair o valor da seguinte forma:

   ```sql
   cat dumpM1.sql | grep GTID_PURGED | cut -f2 -d'=' | cut -f2 -d$'\''
   cat dumpM2.sql | grep GTID_PURGED | cut -f2 -d'=' | cut -f2 -d$'\''
   ```

   O resultado em cada caso deve ser um conjunto de GTID, por exemplo:

   ```sql
   source1:   2174B383-5441-11E8-B90A-C80AA9429562:1-1029
   source2:   224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695
   ```

3. Remova a linha de cada arquivo de dump que contém a declaração `SET @@GLOBAL.gtid_purged`. Por exemplo:

   ```sql
   sed '/GTID_PURGED/d' dumpM1.sql > dumpM1_nopurge.sql
   sed '/GTID_PURGED/d' dumpM2.sql > dumpM2_nopurge.sql
   ```

4. Use o cliente **mysql** para importar cada arquivo de dump editado na replica. Por exemplo:

   ```sql
   mysql -u<user> -p<password> < dumpM1_nopurge.sql
   mysql -u<user> -p<password> < dumpM2_nopurge.sql
   ```

5. Na replica, execute a instrução `RESET MASTER` para limpar o histórico de execução do GTID (assumindo, como explicado acima, que todos os arquivos de dump foram importados e que não há transações desejadas com GTIDs na replica). Em seguida, execute a instrução `SET @@GLOBAL.gtid_purged` para definir o valor de `gtid_purged` para a união de todos os conjuntos de GTID de todos os arquivos de dump, conforme registrado no Passo 2. Por exemplo:

   ```sql
   mysql> RESET MASTER;
   mysql> SET @@GLOBAL.gtid_purged = "2174B383-5441-11E8-B90A-C80AA9429562:1-1029, 224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695";
   ```

   Se houver, ou houverem, transações sobrepostas entre os conjuntos de GTID nos arquivos de dump, você pode usar as funções armazenadas descritas em Seção 16.1.3.7, “Exemplos de Funções Armazenadas para Manipular GTIDs” para verificar isso previamente e calcular a união de todos os conjuntos de GTID.
