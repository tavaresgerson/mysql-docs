#### 19.1.5.2 Configuração de uma Replicação de Múltiplas Fontes para Replicação Baseada em GTID

Se as fontes na topologia de replicação de múltiplas fontes tiverem dados existentes, pode ser mais rápido configurar a replica com os dados relevantes antes de iniciar a replicação. Em uma topologia de replicação de múltiplas fontes, a clonagem ou cópia do diretório de dados não pode ser usada para configurar a replica com dados de todas as fontes, e você também pode querer replicar apenas bancos de dados específicos de cada fonte. Portanto, a melhor estratégia para configurar uma replica desse tipo é usar o **mysqldump** para criar um arquivo de dump apropriado em cada fonte, e depois usar o cliente **mysql** para importar o arquivo de dump na replica.

Se você estiver usando replicação baseada em GTID, você precisa prestar atenção à declaração `SET @@GLOBAL.gtid_purged` que o **mysqldump** coloca na saída do dump. Essa declaração transfere os GTIDs para as transações executadas na fonte para a replica, e a replica requer essas informações. No entanto, para qualquer caso mais complexo do que configurar uma nova replica vazia a partir de uma fonte, você precisa verificar qual efeito a declaração tem na versão do MySQL usada pela replica e lidar com a declaração de acordo. As seguintes orientações resumem as ações adequadas, mas para mais detalhes, consulte a documentação do **mysqldump**.

`SET @@GLOBAL.gtid_purged` adiciona o GTID definido no arquivo de dump à lista existente de `gtid_purged` na replica. Portanto, a instrução pode ser deixada na saída do dump quando você reproduzir os arquivos de dump na replica, e os arquivos de dump podem ser reproduzidos em momentos diferentes. No entanto, é importante notar que o valor que o **mysqldump** inclui para a instrução `SET @@GLOBAL.gtid_purged` inclui os GTIDs de todas as transações na lista `gtid_executed` na fonte, mesmo aquelas que alteraram partes suprimidas do banco de dados, ou outros bancos de dados no servidor que não foram incluídos em um dump parcial. Se você reproduzir um segundo ou um arquivo de dump subsequente na replica que contenha algum dos mesmos GTIDs (por exemplo, outro dump parcial da mesma fonte, ou um dump de outra fonte que tenha transações sobrepostas), qualquer instrução `SET @@GLOBAL.gtid_purged` no segundo arquivo de dump falhará e, portanto, deve ser removida da saída do dump.

Como alternativa para remover a instrução `SET @@GLOBAL.gtid_purged`, você pode usar o **mysqldump** com `--set-gtid-purged=COMMENTED` para incluir a instrução em comentários SQL, para que ela não seja executada ao carregar o arquivo de dump. Se você está provisionando a replica com dois dumps parciais da mesma fonte e o conjunto de GTIDs no segundo dump é o mesmo do primeiro (para que nenhuma nova transação tenha sido executada na fonte entre os dumps), você pode definir `--set-gtid-purged=OFF` ao exportar o segundo arquivo de dump, para omitir a instrução.

No exemplo de provisionamento a seguir, assumimos que a instrução `SET @@GLOBAL.gtid_purged` não pode ser deixada na saída do dump e deve ser removida dos arquivos e manuseada manualmente. Também assumimos que não existem transações desejadas com GTIDs na replica antes do início da provisionação.

1. Para criar arquivos de dump para um banco de dados chamado `db1` em `source1` e um banco de dados chamado `db2` em `source2`, execute **mysqldump** para `source1` da seguinte forma:

   ```
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db1 > dumpM1.sql
   ```

   Em seguida, execute **mysqldump** para `source2` da seguinte forma:

   ```
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db2 > dumpM2.sql
   ```

2. Registre o valor de `gtid_purged` que o **mysqldump** adicionou a cada um dos arquivos de dump. Você pode extrair o valor assim:

   ```
   cat dumpM1.sql | grep GTID_PURGED | perl -p0 -e 's#/\*.*?\*/##sg' | cut -f2 -d'=' | cut -f2 -d$'\''
   cat dumpM2.sql | grep GTID_PURGED | perl -p0 -e 's#/\*.*?\*/##sg' | cut -f2 -d'=' | cut -f2 -d$'\''
   ```

   O resultado em cada caso deve ser um conjunto de GTIDs, por exemplo:

   ```
   source1:   2174B383-5441-11E8-B90A-C80AA9429562:1-1029
   source2:   224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695
   ```

3. Remova a linha de cada arquivo de dump que contém a instrução `SET @@GLOBAL.gtid_purged`. Por exemplo:

   ```
   sed '/GTID_PURGED/d' dumpM1.sql > dumpM1_nopurge.sql
   sed '/GTID_PURGED/d' dumpM2.sql > dumpM2_nopurge.sql
   ```

4. Use o cliente **mysql** para importar cada arquivo de dump editado na replica. Por exemplo:

   ```
   mysql -u<user> -p<password> < dumpM1_nopurge.sql
   mysql -u<user> -p<password> < dumpM2_nopurge.sql
   ```

5. Na replica, execute `RESET BINARY LOGS AND GTIDS` para limpar o histórico de execução de GTIDs (assumindo, como explicado acima, que todos os arquivos de dump foram importados e que não existem transações desejadas com GTIDs na replica). Em seguida, execute uma instrução `SET @@GLOBAL.gtid_purged` para definir o valor de `gtid_purged` para a união de todos os conjuntos de GTIDs de todos os arquivos de dump, conforme você registrou no Passo 2. Por exemplo:

   ```
   mysql> RESET BINARY LOGS AND GTIDS;
   mysql> SET @@GLOBAL.gtid_purged = "2174B383-5441-11E8-B90A-C80AA9429562:1-1029, 224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695";
   ```

   Se houver, ou houverem, transações sobrepostas entre os conjuntos de GTIDs nos arquivos de dump, você pode usar as funções armazenadas descritas na Seção 19.1.3.8, “Exemplos de Função Armazenada para Manipular GTIDs” para verificar isso previamente e calcular a união de todos os conjuntos de GTIDs.