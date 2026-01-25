### 7.3.2 Usando Backups para Recovery

Agora, suponha que tenhamos uma saída inesperada catastrófica na quarta-feira às 8h da manhã que exige o recovery a partir de backups. Para realizar o recovery, primeiro restauramos o último backup completo que temos (o de domingo às 13h). O arquivo de backup completo é apenas um conjunto de instruções SQL, então restaurá-lo é muito fácil:

```sql
$> mysql < backup_sunday_1_PM.sql
```

Neste ponto, os dados são restaurados ao seu estado de domingo às 13h. Para restaurar as alterações feitas desde então, devemos usar os backups incrementais; ou seja, os arquivos de Binary Log `gbichot2-bin.000007` e `gbichot2-bin.000008`. Busque os arquivos, se necessário, de onde eles foram armazenados em backup e, em seguida, processe seu conteúdo desta forma:

```sql
$> mysqlbinlog gbichot2-bin.000007 gbichot2-bin.000008 | mysql
```

Agora, fizemos o recovery dos dados para o seu estado de terça-feira às 13h, mas ainda faltam as alterações daquela data até a data da falha. Para não perdê-las, seria necessário que o servidor MySQL armazenasse seus Binary Logs em um local seguro (discos RAID, SAN, ...) diferente do local onde ele armazena seus arquivos de dados, de modo que esses logs não estivessem no disco destruído. (Ou seja, podemos iniciar o servidor com uma opção `--log-bin` que especifique um local em um dispositivo físico diferente daquele onde o diretório de dados reside. Dessa forma, os logs estarão seguros mesmo que o dispositivo contendo o diretório seja perdido.) Se tivéssemos feito isso, teríamos o arquivo `gbichot2-bin.000009` (e quaisquer arquivos subsequentes) à disposição, e poderíamos aplicá-los usando **mysqlbinlog** e **mysql** para restaurar as alterações de dados mais recentes sem perda, até o momento da falha:

```sql
$> mysqlbinlog gbichot2-bin.000009 ... | mysql
```

Para mais informações sobre como usar **mysqlbinlog** para processar arquivos de Binary Log, consulte a Seção 7.5, “Point-in-Time (Incremental) Recovery”.