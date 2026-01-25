#### 16.1.5.2 Provisionamento de uma Replica Multi-Source para Replication Baseada em GTID

Se os Sources em uma topologia de Replication multi-source tiverem dados existentes, pode economizar tempo provisionar a Replica com os dados relevantes antes de iniciar a Replication. Em uma topologia de Replication multi-source, copiar o diretório de dados não pode ser usado para provisionar a Replica com dados de todos os Sources, e você também pode querer replicar apenas Databases específicos de cada Source. A melhor estratégia para provisionar tal Replica é, portanto, usar o [**mysqldump**] para criar um dump file apropriado em cada Source, e então usar o cliente [**mysql**] para importar o dump file na Replica.

Se você estiver usando Replication baseada em GTID, você precisa prestar atenção à instrução `SET @@GLOBAL.gtid_purged` que o [**mysqldump**] insere na saída do dump. Esta instrução transfere os GTIDs para as transações executadas no Source para a Replica, e a Replica exige essa informação. No entanto, para qualquer caso mais complexo do que o provisionamento de uma nova Replica vazia a partir de um Source, você precisa verificar o efeito que a instrução tem na versão MySQL da Replica e lidar com a instrução de acordo. A orientação a seguir resume as ações adequadas, mas para mais detalhes, consulte a documentação do [**mysqldump**].

No MySQL 5.6 e 5.7, a instrução `SET @@GLOBAL.gtid_purged` escrita pelo [**mysqldump**] substitui o valor de [`gtid_purged`] na Replica. Também nessas releases, esse valor só pode ser alterado quando o registro de transações com GTIDs da Replica (o set [`gtid_executed`]) estiver vazio. Em uma topologia de Replication multi-source, você deve, portanto, remover a instrução `SET @@GLOBAL.gtid_purged` da saída do dump antes de reexecutar os dump files, pois você não pode aplicar um segundo ou subsequente dump file incluindo esta instrução. Como alternativa a remover a instrução `SET @@GLOBAL.gtid_purged`, se você estiver provisionando a Replica com dois dumps parciais do mesmo Source, e o GTID set no segundo dump for o mesmo que o primeiro (portanto, nenhuma nova transação foi executada no Source entre os dumps), você pode definir a opção `--set-gtid-purged` do [**mysqldump**] como `OFF` ao gerar o segundo dump file, para omitir a instrução.

Para MySQL 5.6 e 5.7, essas limitações significam que todos os dump files dos Sources devem ser aplicados em uma única operação em uma Replica com um set [`gtid_executed`] vazio. Você pode limpar o histórico de execução de GTID de uma Replica emitindo [`RESET MASTER`] na Replica, mas se você tiver outras transações desejadas com GTIDs na Replica, escolha um método alternativo de provisionamento dentre aqueles descritos na [Section 16.1.3.5, “Using GTIDs for Failover and Scaleout”].

No exemplo de provisionamento a seguir, assumimos que a instrução `SET @@GLOBAL.gtid_purged` precisa ser removida dos arquivos e tratada manualmente. Também assumimos que não há transações desejadas com GTIDs na Replica antes do início do provisionamento.

1. Para criar dump files para um Database chamado `db1` no `source1` e um Database chamado `db2` no `source2`, execute [**mysqldump**] para o `source1` da seguinte forma:

   ```sql
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db1 > dumpM1.sql
   ```

   Em seguida, execute [**mysqldump**] para o `source2` da seguinte forma:

   ```sql
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db2 > dumpM2.sql
   ```

2. Registre o valor [`gtid_purged`] que [**mysqldump**] adicionou a cada um dos dump files. Por exemplo, para dump files criados no MySQL 5.6 ou 5.7, você pode extrair o valor assim:

   ```sql
   cat dumpM1.sql | grep GTID_PURGED | cut -f2 -d'=' | cut -f2 -d$'\''
   cat dumpM2.sql | grep GTID_PURGED | cut -f2 -d'=' | cut -f2 -d$'\''
   ```

   O resultado em cada caso deve ser um GTID set, por exemplo:

   ```sql
   source1:   2174B383-5441-11E8-B90A-C80AA9429562:1-1029
   source2:   224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695
   ```

3. Remova a linha de cada dump file que contém a instrução `SET @@GLOBAL.gtid_purged`. Por exemplo:

   ```sql
   sed '/GTID_PURGED/d' dumpM1.sql > dumpM1_nopurge.sql
   sed '/GTID_PURGED/d' dumpM2.sql > dumpM2_nopurge.sql
   ```

4. Use o cliente [**mysql**] para importar cada dump file editado para a Replica. Por exemplo:

   ```sql
   mysql -u<user> -p<password> < dumpM1_nopurge.sql
   mysql -u<user> -p<password> < dumpM2_nopurge.sql
   ```

5. Na Replica, execute [`RESET MASTER`] para limpar o histórico de execução de GTID (assumindo, conforme explicado acima, que todos os dump files foram importados e que não há transações desejadas com GTIDs na Replica). Em seguida, execute uma instrução `SET @@GLOBAL.gtid_purged` para definir o valor [`gtid_purged`] como a união de todos os GTID sets de todos os dump files, conforme registrado na Etapa 2. Por exemplo:

   ```sql
   mysql> RESET MASTER;
   mysql> SET @@GLOBAL.gtid_purged = "2174B383-5441-11E8-B90A-C80AA9429562:1-1029, 224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695";
   ```

   Se houver, ou puder haver, transações sobrepostas entre os GTID sets nos dump files, você pode usar as stored functions descritas na [Section 16.1.3.7, “Stored Function Examples to Manipulate GTIDs”] para verificar isso antecipadamente e calcular a união de todos os GTID sets.