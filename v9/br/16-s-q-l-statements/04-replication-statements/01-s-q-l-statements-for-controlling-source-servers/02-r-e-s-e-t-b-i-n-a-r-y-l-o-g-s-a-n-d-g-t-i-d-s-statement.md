#### 15.4.1.2 Declaração de RESETAR LOGS BINÁRIOS E GTIDS

```
RESET BINARY LOGS AND GTIDS [TO binary_log_file_index_number]
```

Aviso

Use esta declaração com cautela para garantir que você não perca nenhum dado de arquivo de log binário desejado e o histórico de execução de GTIDs.

`RESET BINARY LOGS AND GTIDS` requer o privilégio `RELOAD`.

Para um servidor onde o registro binário está habilitado (`log_bin` é `ON`), `RESET BINARY LOGS AND GTIDS` exclui todos os arquivos de log binário existentes e redefini o arquivo de índice de log binário, restaurando o servidor ao seu estado anterior ao início do registro binário. Um novo arquivo de log binário vazio é criado para que o registro binário possa ser reiniciado.

Para um servidor onde GTIDs estão em uso (`gtid_mode` é `ON`), emitir `RESET BINARY LOGS AND GTIDS` redefini o histórico de execução de GTIDs. O valor da variável de sistema `gtid_purged` é definido como uma string vazia (`''`), o valor global (mas não o valor de sessão) da variável de sistema `gtid_executed` é definido como uma string vazia, e a tabela `mysql.gtid\_executed` é limpa (veja tabela mysql.gtid\_executed). Se o servidor habilitado para GTIDs tiver o registro binário habilitado, `RESET BINARY LOGS AND GTIDS` também redefini o log binário conforme descrito acima. Note que `RESET BINARY LOGS AND GTIDS` é o método para redefinir o histórico de execução de GTIDs, mesmo que o servidor habilitado para GTIDs seja uma replica onde o registro binário está desabilitado; `RESET REPLICA` não tem efeito no histórico de execução de GTIDs. Para mais informações sobre a redefinição do histórico de execução de GTIDs, consulte Redefinir o Histórico de Execução de GTIDs.

Emitir `RESET BINARY LOGS AND GTIDS` sem a cláusula opcional `TO` exclui todos os arquivos de log binário listados no arquivo de índice, redefini o arquivo de índice de log binário para ser vazio e cria um novo arquivo de log binário começando em `1`. Use a cláusula opcional `TO` para iniciar o índice de arquivo de log binário a partir de um número diferente de `1` após o reset.

Verifique se você está usando um valor razoável para o número de índice. Se você inserir um valor incorreto, pode corrigi-lo emitindo outra declaração `RESET BINARY LOGS AND GTIDS` com ou sem a cláusula `TO`. Se você não corrigir um valor fora do intervalo, o servidor não poderá ser reiniciado.

O exemplo a seguir demonstra o uso da cláusula `TO`:

```
RESET BINARY LOGS AND GTIDS TO 1234;

SHOW BINARY LOGS;
+-------------------+-----------+-----------+
| Log_name          | File_size | Encrypted |
+-------------------+-----------+-----------+
| source-bin.001234 |       154 | No        |
+-------------------+-----------+-----------+
```

Importante

Os efeitos de `RESET BINARY LOGS AND GTIDS` sem a cláusula `TO` diferem dos de `PURGE BINARY LOGS` em duas maneiras principais:

1. `RESET BINARY LOGS AND GTIDS` remove *todos* os arquivos de log binário listados no arquivo de índice, deixando apenas um único arquivo de log binário vazio com um sufixo numérico de `.000001`, enquanto a numeração não é redefinida por `PURGE BINARY LOGS`.

2. `RESET BINARY LOGS AND GTIDS` *não* é destinado a ser usado enquanto houver réplicas em execução. O comportamento de `RESET BINARY LOGS AND GTIDS` quando usado enquanto houver réplicas em execução é indefinido (e, portanto, não é suportado), enquanto `PURGE BINARY LOGS` pode ser usado com segurança enquanto houver réplicas em execução.

Veja também a Seção 15.4.1.1, “Declaração PURGE BINARY LOGS”.

`RESET BINARY LOGS AND GTIDS` sem a cláusula `TO` pode ser útil ao configurar inicialmente uma fonte e uma réplica, para que você possa verificar a configuração da seguinte forma:

1. Inicie a fonte e a réplica, e inicie a replicação (veja a Seção 19.1.2, “Configuração da Replicação Baseada em Posição do Arquivo de Log Binário”).

2. Execute algumas consultas de teste na fonte.
3. Verifique se as consultas foram replicadas para a réplica.
4. Quando a replicação estiver funcionando corretamente, execute `STOP REPLICA` seguido de `RESET REPLICA` (ambos na réplica), e, em seguida, verifique se não existem dados indesejados das consultas de teste na réplica. Em seguida, execute `RESET BINARY LOGS AND GTIDS` (também na réplica) para remover os registros de log binário e os IDs de transação associados.
5. Remova os dados indesejados da fonte e, em seguida, execute `RESET BINARY LOGS AND GTIDS` para limpar quaisquer entradas de log binário e identificadores associados a elas.

Após verificar a configuração, reinicie a fonte e a réplica e garanta que nenhum dado indesejado ou arquivos de log binário gerados pelo teste permaneçam na fonte ou na réplica, você pode iniciar a replicação e começar a replicar.