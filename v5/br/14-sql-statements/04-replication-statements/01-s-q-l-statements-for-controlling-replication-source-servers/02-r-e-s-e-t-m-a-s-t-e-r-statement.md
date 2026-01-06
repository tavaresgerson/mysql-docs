#### 13.4.1.2 Declaração de REESTABELECER MASTER

```sql
RESET MASTER
```

Aviso

Use essa declaração com cautela para garantir que você não perca nenhum dado de arquivo de log binário desejado e o histórico de execução do GTID.

O comando `RESET MASTER` requer o privilégio `RELOAD`.

Para um servidor onde o registro binário está habilitado (`log_bin` está ativado), o comando `RESET MASTER` exclui todos os arquivos de registro binário existentes e redefini o arquivo de índice do registro binário, restaurando o servidor ao estado anterior ao início do registro binário. Um novo arquivo de registro binário vazio é criado para que o registro binário possa ser reiniciado.

Para um servidor onde os GTIDs estão em uso (`gtid_mode` é `ON`), emitir `RESET MASTER` redefiniu o histórico de execução do GTID. O valor da variável de sistema `gtid_purged` é definido como uma string vazia (`''`), o valor global (mas não o valor da sessão) da variável de sistema `gtid_executed` é definido como uma string vazia e a tabela `mysql.gtid_executed` é limpa (veja mysql.gtid\_executed Table). Se o servidor habilitado para GTIDs tiver o registro binário habilitado, `RESET MASTER` também redefiniu o log binário conforme descrito acima. Note que `RESET MASTER` é o método para redefinir o histórico de execução do GTID, mesmo que o servidor habilitado para GTIDs seja uma replica onde o registro binário está desativado; `RESET SLAVE` não tem efeito no histórico de execução do GTID. Para mais informações sobre a redefinição do histórico de execução do GTID, consulte Resetting the GTID Execution History.

Importante

Os efeitos de `RESET MASTER` diferem dos de `PURGE BINARY LOGS` de duas maneiras principais:

1. `RESET MASTER` remove *todos* os arquivos de log binários listados no arquivo de índice, deixando apenas um único arquivo de log binário vazio com um sufixo numérico de `.000001`, enquanto a numeração não é redefinida por `PURGE BINARY LOGS`.

2. `RESET MASTER` *não* é destinado a ser usado enquanto houver réplicas em execução. O comportamento de `RESET MASTER` quando usado enquanto as réplicas estão em execução é indefinido (e, portanto, não é suportado), enquanto `PURGE BINARY LOGS` pode ser usado com segurança enquanto as réplicas estão em execução.

Veja também Seção 13.4.1.1, “Declaração de PURGE BINARY LOGS”.

`RESET MASTER` pode ser útil quando você configura a fonte e a replica pela primeira vez, para que você possa verificar a configuração da seguinte forma:

1. Inicie a fonte e a replica, e inicie a replicação (consulte Seção 16.1.2, “Configurando a replicação com base na posição do arquivo de log binário”).

2. Execute algumas consultas de teste na fonte.

3. Verifique se as consultas foram replicadas para a replica.

4. Quando a replicação estiver funcionando corretamente, execute o comando `STOP SLAVE` seguido de `RESET SLAVE` na replica, e, em seguida, verifique se os dados indesejados não existem mais na replica.

5. Emita a instrução `RESET MASTER` na fonte para limpar as consultas de teste.

Após verificar a configuração, reiniciar a fonte e a réplica e garantir que nenhum dado indesejado ou arquivo de log binário gerado pelo teste permaneça na fonte ou na réplica, você pode iniciar a réplica e começar a replicar.
