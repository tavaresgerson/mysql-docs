#### 15.7.7.2 Declaração de LOGS BINÁRIOS

```
SHOW BINARY LOGS
```

Lista os arquivos de log binários no servidor. Esta declaração é usada como parte do procedimento descrito na Seção 15.4.1.1, “Declaração de PURGE BINARY LOGS”, que mostra como determinar quais logs podem ser apagados. `SHOW BINARY LOGS` requer o privilégio `REPLICATION CLIENT` (ou o privilégio `SUPER` desatualizado).

Arquivos de log binários criptografados têm um cabeçalho de arquivo de 512 bytes que armazena informações necessárias para a criptografia e descriptografia do arquivo. Isso está incluído no tamanho do arquivo exibido por `SHOW BINARY LOGS`. A coluna `Encrypted` mostra se o arquivo de log binário está criptografado ou não. A criptografia de log binário está ativa se `binlog_encryption=ON` estiver definido para o servidor. Arquivos de log binários existentes não são criptografados ou descriptografados se a criptografia de log binário for ativada ou desativada enquanto o servidor estiver em execução.

```
mysql> SHOW BINARY LOGS;
+---------------+-----------+-----------+
| Log_name      | File_size | Encrypted |
+---------------+-----------+-----------+
| binlog.000015 |    724935 |       Yes |
| binlog.000016 |    733481 |       Yes |
+---------------+-----------+-----------+
```