#### 15.4.1.2 Declaração de REESTABELECER MASTER

Nota

Essa declaração é substituída em versões posteriores do MySQL por `RESET BINARY LOGS AND GTIDS` e deve ser considerada obsoleta. Consulte a declaração RESET BINARY LOGS AND GTIDS, no *Manual do MySQL 8.4*, para obter mais informações.

```
RESET MASTER [TO binary_log_file_index_number]
```

Aviso

Use essa declaração com cautela para garantir que você não perca nenhum dado de arquivo de log binário desejado e o histórico de execução do GTID.

`RESET MASTER` requer o privilégio `RELOAD`.

Para um servidor onde o registro binário está habilitado (`log_bin` é `ON`), `RESET MASTER` exclui todos os arquivos de registro binário existentes e redefini o arquivo de índice do registro binário, restaurando o servidor ao seu estado anterior ao início do registro binário. Um novo arquivo de registro binário vazio é criado para que o registro binário possa ser reiniciado.

Para um servidor onde os GTIDs estão em uso (`gtid_mode` é `ON`), emitir `RESET MASTER` reinicia o histórico de execução do GTID. O valor da variável de sistema `gtid_purged` é definido como uma string vazia (`''`), o valor global (mas não o valor da sessão) da variável de sistema `gtid_executed` é definido como uma string vazia, e a tabela `mysql.gtid_executed` é limpa (veja a tabela mysql.gtid\_executed). Se o servidor habilitado para GTIDs tiver o registro binário habilitado, `RESET MASTER` também reinicia o log binário conforme descrito acima. Note que `RESET MASTER` é o método para reiniciar o histórico de execução do GTID, mesmo que o servidor habilitado para GTIDs seja uma replica onde o registro binário está desativado; `RESET REPLICA` não tem efeito no histórico de execução do GTID. Para obter mais informações sobre como reiniciar o histórico de execução do GTID, consulte Reiniciar o Histórico de Execução do GTID.

A emissão de `RESET MASTER` sem a cláusula opcional `TO` exclui todos os arquivos de log binário listados no arquivo de índice, reescreve o arquivo de índice do log binário para estar vazio e cria um novo arquivo de log binário a partir de `1`. Use a cláusula opcional `TO` para iniciar o arquivo de índice do log binário a partir de um número diferente de `1` após o reajuste.

Verifique se você está usando um valor razoável para o número de índice. Se você inserir um valor incorreto, pode corrigi-lo emitindo outra declaração `RESET MASTER` com ou sem a cláusula `TO`. Se você não corrigir um valor fora do intervalo, o servidor não poderá ser reiniciado.

O exemplo a seguir demonstra o uso da cláusula `TO`:

```
RESET MASTER TO 1234;

SHOW BINARY LOGS;
+-------------------+-----------+-----------+
| Log_name          | File_size | Encrypted |
+-------------------+-----------+-----------+
| source-bin.001234 |       154 | No        |
+-------------------+-----------+-----------+
```

Importante

Os efeitos de `RESET MASTER` sem a cláusula `TO` diferem dos de `PURGE BINARY LOGS` em 2 maneiras principais:

1. `RESET MASTER` remove *todos* os arquivos de log binários listados no arquivo de índice, deixando apenas um único arquivo de log binário vazio com um sufixo numérico de `.000001`, enquanto a numeração não é redefinida por `PURGE BINARY LOGS`.

2. `RESET MASTER` *não* deve ser usado enquanto houver réplicas em execução. O comportamento de `RESET MASTER` quando usado enquanto as réplicas estão em execução é indefinido (e, portanto, não é suportado), enquanto `PURGE BINARY LOGS` pode ser usado com segurança enquanto as réplicas estão em execução.

Veja também a Seção 15.4.1.1, “Declaração de PURGE BINARY LOGS”.

`RESET MASTER` sem a cláusula `TO` pode ser útil quando você configura uma fonte e uma replica pela primeira vez, para que você possa verificar a configuração da seguinte forma:

1. Inicie a fonte e a replica, e inicie a replicação (consulte a Seção 19.1.2, “Configurando a replicação com base na posição do arquivo de log binário”).

2. Execute algumas consultas de teste na fonte.

3. Verifique se as consultas foram replicadas para a replica.

4. Quando a replicação estiver funcionando corretamente, emita `STOP REPLICA` seguido de `RESET REPLICA` na replica, e, em seguida, verifique se não existem dados indesejados das consultas de teste na replica.

5. Remova os dados indesejados da fonte e, em seguida, emita `RESET MASTER` para limpar quaisquer entradas de log binário e identificadores associados a elas.

Após verificar a configuração, reiniciar a fonte e a réplica e garantir que nenhum dado indesejado ou arquivo de log binário gerado pelo teste permaneça na fonte ou na réplica, você pode iniciar a réplica e começar a replicar.
