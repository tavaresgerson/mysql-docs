#### 19.1.5.2 Configuração de uma Replicação de Múltiplas Fontes para Replicação Baseada em GTID

Se as fontes na topologia de replicação de múltiplas fontes tiverem dados existentes, pode-se economizar tempo ao provisionar a replica com os dados relevantes antes de iniciar a replicação. Em uma topologia de replicação de múltiplas fontes, a clonagem ou cópia do diretório de dados não pode ser usada para provisionar a replica com dados de todas as fontes, e você também pode querer replicar apenas bancos de dados específicos de cada fonte. Portanto, a melhor estratégia para provisionar essa replica é usar o **mysqldump** para criar um arquivo de dump apropriado em cada fonte, e depois usar o cliente **mysql** para importar o arquivo de dump na replica.

Se você estiver usando a replicação baseada em GTID, você precisa prestar atenção à declaração `SET @@GLOBAL.gtid_purged` que o **mysqldump** coloca na saída do dump. Essa declaração transfere os GTIDs para as transações executadas na fonte para a replica, e a replica requer essas informações. No entanto, para qualquer caso mais complexo do que provisionar uma nova replica vazia a partir de uma fonte, você precisa verificar qual efeito a declaração tem na versão do MySQL usada pela replica e lidar com a declaração de acordo. As orientações a seguir resumem as ações adequadas, mas para mais detalhes, consulte a documentação do **mysqldump**.

O comportamento da instrução `SET @@GLOBAL.gtid_purged` escrita pelo **mysqldump** é diferente nas versões do MySQL 8.0 em comparação com o MySQL 5.6 e 5.7. No MySQL 5.6 e 5.7, a instrução substitui o valor de `gtid_purged` na réplica, e, nessas versões, esse valor só pode ser alterado quando o registro de transações da réplica com GTIDs (o conjunto `gtid_executed`) estiver vazio. Em uma topologia de replicação de múltiplas fontes, você deve, portanto, remover a instrução `SET @@GLOBAL.gtid_purged` da saída do dump antes de refazer os arquivos de dump, porque você não pode aplicar um segundo ou arquivo de dump subsequente que inclua essa instrução. Além disso, note que, para o MySQL 5.6 e 5.7, essa limitação significa que todos os arquivos de dump das fontes devem ser aplicados em uma única operação em uma réplica com um conjunto `gtid_executed` vazio. Você pode limpar o histórico de execução do GTID de uma réplica emitindo `RESET MASTER` na réplica, mas se você tiver outras transações desejadas com GTIDs na réplica, escolha um método alternativo de provisionamento descrito na Seção 19.1.3.5, “Usando GTIDs para Failover e Scaleout”.

A partir do MySQL 8.0, a instrução `SET @@GLOBAL.gtid_purged` adiciona o conjunto de GTIDs do arquivo de dump ao conjunto existente de `gtid_purged` na replica. Portanto, a instrução pode ser deixada no resultado do dump ao reproduzir os arquivos de dump na replica, e os arquivos de dump podem ser reproduzidos em momentos diferentes. No entanto, é importante notar que o valor incluído pelo **mysqldump** para a instrução `SET @@GLOBAL.gtid_purged` inclui os GTIDs de todas as transações no conjunto de `gtid_executed` na fonte, mesmo aquelas que alteraram partes suprimidas do banco de dados, ou outros bancos de dados no servidor que não foram incluídos em um dump parcial. Se reproduzir um segundo ou um arquivo de dump subsequente na replica que contenha algum dos mesmos GTIDs (por exemplo, outro dump parcial da mesma fonte, ou um dump de outra fonte que tenha transações sobrepostas), qualquer instrução `SET @@GLOBAL.gtid_purged` no segundo arquivo de dump falhará e, portanto, deve ser removida do resultado do dump.

Para fontes do MySQL 8.0.17, como alternativa para remover a declaração `SET @@GLOBAL.gtid_purged`, você pode definir a opção `--set-gtid-purged` do **mysqldump** para `COMMENTED` para incluir a declaração, mas com comentários, para que ela não seja executada ao carregar o arquivo de dump. Se você está provisionando a replica com dois dumps parciais da mesma fonte e o GTID definido no segundo dump é o mesmo do primeiro (portanto, nenhuma nova transação foi executada na fonte entre os dumps), você pode definir a opção `--set-gtid-purged` do **mysqldump** para `OFF` ao gerar o segundo arquivo de dump, para omitir a declaração.

No exemplo de provisionamento a seguir, assumimos que a declaração `SET @@GLOBAL.gtid_purged` não pode ser deixada na saída do dump e deve ser removida dos arquivos e tratada manualmente. Também assumimos que não existem transações desejadas com GTIDs na replica antes do início do provisionamento.

1. Para criar arquivos de dump para um banco de dados chamado `db1` em `source1` e um banco de dados chamado `db2` em `source2`, execute o **mysqldump** para `source1` da seguinte forma:

   ```
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db1 > dumpM1.sql
   ```

   Em seguida, execute o **mysqldump** para `source2` da seguinte forma:

   ```
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db2 > dumpM2.sql
   ```

2. Registre o valor `gtid_purged` que o **mysqldump** adicionou a cada um dos arquivos de dump. Por exemplo, para arquivos de dump criados no MySQL 5.6 ou 5.7, você pode extrair o valor da seguinte maneira:

   ```
   cat dumpM1.sql | grep GTID_PURGED | cut -f2 -d'=' | cut -f2 -d$'\''
   cat dumpM2.sql | grep GTID_PURGED | cut -f2 -d'=' | cut -f2 -d$'\''
   ```

   A partir do MySQL 8.0, onde o formato mudou, você pode extrair o valor da seguinte forma:

   ```
   cat dumpM1.sql | grep GTID_PURGED | perl -p0 -e 's#/\*.*?\*/##sg' | cut -f2 -d'=' | cut -f2 -d$'\''
   cat dumpM2.sql | grep GTID_PURGED | perl -p0 -e 's#/\*.*?\*/##sg' | cut -f2 -d'=' | cut -f2 -d$'\''
   ```

   O resultado em cada caso deve ser um conjunto de GTID, por exemplo:

   ```
   source1:   2174B383-5441-11E8-B90A-C80AA9429562:1-1029
   source2:   224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695
   ```

3. Remova a linha de cada arquivo de dump que contém a declaração `SET @@GLOBAL.gtid_purged`. Por exemplo:

   ```
   sed '/GTID_PURGED/d' dumpM1.sql > dumpM1_nopurge.sql
   sed '/GTID_PURGED/d' dumpM2.sql > dumpM2_nopurge.sql
   ```

4. Use o cliente **mysql** para importar cada arquivo de dump editado na replica. Por exemplo:

   ```
   mysql -u<user> -p<password> < dumpM1_nopurge.sql
   mysql -u<user> -p<password> < dumpM2_nopurge.sql
   ```

5. Na replica, emita `RESET MASTER` para limpar o histórico de execução do GTID (assumindo, como explicado acima, que todos os arquivos de dump foram importados e que não há transações desejadas com GTIDs na replica). Em seguida, emita uma declaração `SET @@GLOBAL.gtid_purged` para definir o valor `gtid_purged` para a união de todos os conjuntos de GTID de todos os arquivos de dump, conforme registrado no Passo 2. Por exemplo:

   ```
   mysql> RESET MASTER;
   mysql> SET @@GLOBAL.gtid_purged = "2174B383-5441-11E8-B90A-C80AA9429562:1-1029, 224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695";
   ```

   Se houver, ou houverem, transações sobrepostas entre os conjuntos de GTID nos arquivos de dump, você pode usar as funções armazenadas descritas na Seção 19.1.3.8, “Exemplos de Funções Armazenadas para Manipular GTIDs”, para verificar isso previamente e calcular a união de todos os conjuntos de GTID.
