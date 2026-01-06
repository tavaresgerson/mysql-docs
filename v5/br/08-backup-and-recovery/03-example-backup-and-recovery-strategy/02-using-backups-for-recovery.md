### 7.3.2 Uso de backups para recuperação

Agora, vamos supor que tenhamos uma saída catastrófica e inesperada na quarta-feira às 8h, que exige a recuperação a partir de backups. Para recuperar, primeiro restauramos o último backup completo que temos (o do domingo às 13h). O arquivo de backup completo é apenas um conjunto de instruções SQL, então restaurá-lo é muito fácil:

```sql
$> mysql < backup_sunday_1_PM.sql
```

Neste momento, os dados são restaurados ao seu estado de domingo às 13h. Para restaurar as alterações feitas desde então, devemos usar os backups incrementais; ou seja, os arquivos de log binários `gbichot2-bin.000007` e `gbichot2-bin.000008`. Se necessário, baixe os arquivos dos locais onde foram feitos os backups e, em seguida, processe seu conteúdo da seguinte forma:

```sql
$> mysqlbinlog gbichot2-bin.000007 gbichot2-bin.000008 | mysql
```

Agora recuperamos os dados até o estado de terça-feira às 13h, mas ainda estamos faltando as alterações dessa data até a data do crash. Para não perder essas alterações, precisaríamos que o servidor MySQL armazenasse seus logs binários MySQL em um local seguro (discos RAID, SAN, etc.) diferente do local onde armazena seus arquivos de dados, para que esses logs não estivessem no disco destruído. (Ou seja, podemos iniciar o servidor com a opção `--log-bin` que especifica um local em um dispositivo físico diferente do onde reside o diretório de dados. Dessa forma, os logs ficam seguros mesmo se o dispositivo que contém o diretório for perdido.) Se tivéssemos feito isso, teríamos o arquivo `gbichot2-bin.000009` (e quaisquer arquivos subsequentes) à mão, e poderíamos aplicá-los usando **mysqlbinlog** e **mysql** para restaurar as alterações de dados mais recentes sem perda até o momento do crash:

```sql
$> mysqlbinlog gbichot2-bin.000009 ... | mysql
```

Para obter mais informações sobre o uso do **mysqlbinlog** para processar arquivos de log binário, consulte a Seção 7.5, “Recuperação Ponto no Tempo (Incremental) (Recuperação”).
