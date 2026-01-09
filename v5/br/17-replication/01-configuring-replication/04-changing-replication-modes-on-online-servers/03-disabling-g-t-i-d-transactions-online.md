#### 16.1.4.3 Desativar transações GTID online

Esta seção descreve como desativar as transações GTID em servidores que já estão online. Esse procedimento não requer a desativação do servidor e é adequado para uso em produção. No entanto, se você tiver a possibilidade de desativar os servidores ao desativar o modo GTID, esse processo será mais fácil.

O processo é semelhante ao de habilitar transações GTID enquanto o servidor estiver online, mas invertendo os passos. A única coisa que difere é o momento em que você espera que as transações registradas sejam replicadas.

Antes de começar, certifique-se de que os servidores atendam às seguintes condições prévias:

- *Todos os* servidores em sua topologia devem usar o MySQL 5.7.6 ou uma versão posterior. Você não pode desabilitar as transações GTID online em nenhum servidor individual, a menos que *todos* os servidores que estão na topologia estejam usando essa versão.

- Todos os servidores têm `gtid_mode` definido como `ON`.

1. Execute o seguinte em cada réplica, e, se você estiver usando replicação de múltiplas fontes, faça isso para cada canal e inclua a cláusula `FOR CHANNEL` (PARA CANAL):

   ```sql
   STOP SLAVE [FOR CHANNEL 'channel'];
   CHANGE MASTER TO MASTER_AUTO_POSITION = 0, MASTER_LOG_FILE = file, \
   MASTER_LOG_POS = position [FOR CHANNEL 'channel'];
   START SLAVE [FOR CHANNEL 'channel'];
   ```

2. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = ON_PERMISSIVE;
   ```

3. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = OFF_PERMISSIVE;
   ```

4. Em cada servidor, aguarde até que a variável @@GLOBAL.GTID_OWNED seja igual à string vazia. Isso pode ser verificado usando:

   ```sql
   SELECT @@GLOBAL.GTID_OWNED;
   ```

   Em uma réplica, teoricamente é possível que ela esteja vazia e, em seguida, voltar a ser preenchida. Isso não é um problema, basta que ela esteja vazia apenas uma vez.

5. Aguarde até que todas as transações que atualmente existem em qualquer log binário sejam replicadas para todas as réplicas. Consulte Seção 16.1.4.4, “Verificação da Replicação de Transações Anônimas” para um método de verificar se todas as transações anônimas foram replicadas para todos os servidores.

6. Se você usar logs binários para qualquer outra finalidade que não seja a replicação, por exemplo, para fazer backup ou restauração em um ponto no tempo: espere até que não precise mais dos logs binários antigos com transações GTID.

   Por exemplo, após a etapa 5 ser concluída, você pode executar `FLUSH LOGS` no servidor onde está fazendo o backup. Em seguida, você pode tomar um backup explicitamente ou esperar pela próxima iteração de qualquer rotina de backup periódica que você tenha configurado.

   Idealmente, espere o servidor limpar todos os logs binários que existiam quando o passo 5 foi concluído. Além disso, espere que qualquer backup feito antes do passo 5 expire.

   Importante

   Este é o único ponto importante durante este procedimento. É importante entender que os logs que contêm transações GTID não podem ser usados após a próxima etapa. Antes de prosseguir, você deve ter certeza de que as transações GTID não existem em nenhuma parte da topologia.

7. Em cada servidor, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = OFF;
   ```

8. Em cada servidor, defina [`gtid_mode=OFF`](https://pt.wikipedia.org/wiki/Replicação_de_dados#Op%C3%A7%C3%B5es_de_gtids) em `my.cnf`.

   Se você quiser definir `enforce_gtid_consistency=OFF`, você pode fazer isso agora. Após defini-lo, você deve adicionar `enforce_gtid_consistency=OFF` ao seu arquivo de configuração.

Se você quiser fazer uma downgrade para uma versão anterior do MySQL, pode fazê-lo agora, usando o procedimento de downgrade normal.
