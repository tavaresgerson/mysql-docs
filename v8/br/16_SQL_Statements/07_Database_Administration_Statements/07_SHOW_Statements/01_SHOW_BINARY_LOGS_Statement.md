#### 15.7.7.1 Declaração de registro binário de exibição

```
SHOW BINARY LOGS
SHOW MASTER LOGS
```

Lista os arquivos de log binário no servidor. Esta declaração é usada como parte do procedimento descrito na Seção 15.4.1.1, “Declaração PURGE BINARY LOGS”, que mostra como determinar quais logs podem ser apagados. `SHOW BINARY LOGS` requer o privilégio `REPLICATION CLIENT` (ou o privilégio desatualizado `SUPER`).

Os arquivos de log binários criptografados têm um cabeçalho de arquivo de 512 bytes que armazena as informações necessárias para a criptografia e descriptografia do arquivo. Isso está incluído no tamanho do arquivo exibido pelo `SHOW BINARY LOGS`. A coluna `Encrypted` mostra se o arquivo de log binário está criptografado ou não. A criptografia do log binário está ativa se `binlog_encryption=ON` estiver definido para o servidor. Os arquivos de log binários existentes não são criptografados ou descriptografados se a criptografia do log binário for ativada ou desativada enquanto o servidor estiver em execução.

```
mysql> SHOW BINARY LOGS;
+---------------+-----------+-----------+
| Log_name      | File_size | Encrypted |
+---------------+-----------+-----------+
| binlog.000015 |    724935 |       Yes |
| binlog.000016 |    733481 |       Yes |
+---------------+-----------+-----------+
```

`SHOW MASTER LOGS` é equivalente a `SHOW BINARY LOGS`.
