#### 13.4.1.2 Instrução RESET MASTER

```sql
RESET MASTER
```

Aviso

Use esta instrução com cautela para garantir que você não perca dados de arquivos de binary log desejados e o histórico de execução de GTID.

`RESET MASTER` requer o privilégio `RELOAD`.

Para um servidor onde o binary logging está habilitado (`log_bin` é `ON`), `RESET MASTER` exclui todos os arquivos de binary log existentes e reinicia o arquivo Index do binary log, redefinindo o servidor para seu estado antes do início do binary logging. Um novo arquivo de binary log vazio é criado para que o binary logging possa ser reiniciado.

Para um servidor onde GTIDs estão em uso (`gtid_mode` é `ON`), a emissão de `RESET MASTER` reinicia o histórico de execução de GTID. O valor da System Variable `gtid_purged` é definido como uma string vazia (`''`), o valor global (mas não o valor da Session) da System Variable `gtid_executed` é definido como uma string vazia, e a tabela `mysql.gtid_executed` é limpa (veja Tabela mysql.gtid_executed). Se o servidor habilitado para GTID tiver o binary logging ativado, `RESET MASTER` também reinicia o binary log, conforme descrito acima. Note que `RESET MASTER` é o método para reiniciar o histórico de execução de GTID, mesmo se o servidor habilitado para GTID for uma Replica onde o binary logging estiver desabilitado; `RESET SLAVE` não tem efeito sobre o histórico de execução de GTID. Para mais informações sobre como reiniciar o histórico de execução de GTID, veja Reiniciando o Histórico de Execução de GTID.

Importante

Os efeitos de `RESET MASTER` diferem dos de `PURGE BINARY LOGS` em 2 aspectos principais:

1. `RESET MASTER` remove *todos* os arquivos de binary log listados no arquivo Index, deixando apenas um único arquivo de binary log vazio com o sufixo numérico `.000001`, enquanto a numeração não é reiniciada por `PURGE BINARY LOGS`.

2. `RESET MASTER` *não* se destina a ser usado enquanto qualquer Replica estiver em execução. O comportamento de `RESET MASTER` quando usado enquanto Replicas estão em execução é indefinido (e, portanto, não suportado), enquanto `PURGE BINARY LOGS` pode ser usado com segurança enquanto Replicas estão em execução.

Veja também Seção 13.4.1.1, “Instrução PURGE BINARY LOGS”.

`RESET MASTER` pode ser útil quando você configura o Source e a Replica pela primeira vez, para que você possa verificar a configuração da seguinte forma:

1. Inicie o Source e a Replica, e inicie a Replication (veja Seção 16.1.2, “Configurando Replication Baseada na Posição do Arquivo de Binary Log”).

2. Execute algumas Queries de teste no Source.
3. Verifique se as Queries foram replicadas para a Replica.
4. Quando a Replication estiver funcionando corretamente, emita `STOP SLAVE` seguido por `RESET SLAVE` na Replica, e então verifique se quaisquer dados indesejados não existem mais na Replica.

5. Emita `RESET MASTER` no Source para limpar as Queries de teste.

Após verificar a configuração, reiniciar o Source e a Replica e garantir que nenhum dado indesejado ou arquivos de binary log gerados por testes permaneçam no Source ou na Replica, você pode iniciar a Replica e começar a Replication.