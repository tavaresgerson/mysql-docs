#### 14.6.1.4 Movendo ou Copiando Tabelas InnoDB

Esta seção descreve técnicas para mover ou copiar algumas ou todas as tabelas `InnoDB` para um servidor ou instância diferente. Por exemplo, você pode mover uma instância MySQL inteira para um servidor maior e mais rápido; você pode clonar uma instância MySQL inteira para um novo servidor de replica; você pode copiar Tables individuais para outra instância para desenvolver e testar uma aplicação, ou para um servidor de *data warehouse* para produzir relatórios.

No Windows, o `InnoDB` sempre armazena nomes de Database e Table internamente em letras minúsculas. Para mover Databases em formato binário de Unix para Windows ou de Windows para Unix, crie todos os Databases e Tables usando nomes em letras minúsculas. Uma maneira conveniente de conseguir isso é adicionar a seguinte linha à seção `[mysqld]` do seu arquivo `my.cnf` ou `my.ini` antes de criar quaisquer Databases ou Tables:

```sql
[mysqld]
lower_case_table_names=1
```

As técnicas para mover ou copiar tabelas `InnoDB` incluem:

* Importando Tables
* MySQL Enterprise Backup
* Copiando Arquivos de Dados (Método de Cold Backup)
* Restaurando de um Logical Backup

##### Importando Tables

Uma Table que reside em um tablespace *file-per-table* pode ser importada de outra instância de servidor MySQL ou de um Backup usando o recurso *Transportable Tablespace*. Consulte a Seção 14.6.1.3, “Importando Tabelas InnoDB”.

##### MySQL Enterprise Backup

O produto MySQL Enterprise Backup permite que você faça Backup de um Database MySQL em execução com o mínimo de interrupção nas operações, enquanto produz um *snapshot* consistente do Database. Quando o MySQL Enterprise Backup está copiando Tables, as leituras (*reads*) e escritas (*writes*) podem continuar. Além disso, o MySQL Enterprise Backup pode criar arquivos de Backup compactados e fazer Backup de subconjuntos de Tables. Em conjunto com o Binary Log do MySQL, você pode realizar a recuperação pontual (*point-in-time recovery*). O MySQL Enterprise Backup está incluído como parte da assinatura MySQL Enterprise.

Para mais detalhes sobre o MySQL Enterprise Backup, consulte a Seção 28.1, “Visão Geral do MySQL Enterprise Backup”.

##### Copiando Arquivos de Dados (Método de Cold Backup)

Você pode mover um Database `InnoDB` simplesmente copiando todos os arquivos relevantes listados em "Cold Backups" na Seção 14.19.1, “Backup do InnoDB”.

Os arquivos de dados e Log do `InnoDB` são binariamente compatíveis em todas as plataformas que possuem o mesmo formato de número de ponto flutuante. Se os formatos de ponto flutuante diferirem, mas você não tiver usado os tipos de dados `FLOAT` ou `DOUBLE` em suas Tables, o procedimento é o mesmo: basta copiar os arquivos relevantes.

Ao mover ou copiar arquivos `.ibd` *file-per-table*, o nome do diretório do Database deve ser o mesmo nos sistemas de origem e destino. A Table Definition armazenada no tablespace compartilhado do `InnoDB` inclui o nome do Database. Os Transaction IDs e Log Sequence Numbers armazenados nos arquivos de tablespace também diferem entre os Databases.

Para mover um arquivo `.ibd` e a Table associada de um Database para outro, use uma instrução `RENAME TABLE`:

```sql
RENAME TABLE db1.tbl_name TO db2.tbl_name;
```

Se você tiver um Backup "limpo" de um arquivo `.ibd`, você pode restaurá-lo na instalação MySQL da qual se originou da seguinte forma:

1. A Table não deve ter sido descartada (`dropped`) ou truncada (`truncated`) desde que você copiou o arquivo `.ibd`, pois fazer isso altera o Table ID armazenado dentro do tablespace.

2. Execute esta instrução `ALTER TABLE` para deletar o arquivo `.ibd` atual:

   ```sql
   ALTER TABLE tbl_name DISCARD TABLESPACE;
   ```

3. Copie o arquivo `.ibd` do Backup para o diretório apropriado do Database.

4. Execute esta instrução `ALTER TABLE` para informar ao `InnoDB` que use o novo arquivo `.ibd` para a Table:

   ```sql
   ALTER TABLE tbl_name IMPORT TABLESPACE;
   ```

   Nota: O recurso `ALTER TABLE ... IMPORT TABLESPACE` não impõe restrições de Foreign Key nos dados importados.

Neste contexto, um Backup de arquivo `.ibd` "limpo" é aquele para o qual os seguintes requisitos são satisfeitos:

* Não há modificações não confirmadas por Transactions no arquivo `.ibd`.

* Não há entradas de *insert buffer* não mescladas no arquivo `.ibd`.

* O *Purge* removeu todos os registros Index marcados para exclusão do arquivo `.ibd`.

* O **mysqld** descarregou (*flushed*) todas as páginas modificadas do arquivo `.ibd` do Buffer Pool para o arquivo.

Você pode criar um arquivo `.ibd` de Backup limpo usando o seguinte método:

1. Pare toda a atividade do servidor **mysqld** e confirme todas as Transactions (*commit all transactions*).

2. Espere até que `SHOW ENGINE INNODB STATUS` mostre que não há Transactions ativas no Database e que o status do *main thread* do `InnoDB` seja `Waiting for server activity`. Então, você pode fazer uma cópia do arquivo `.ibd`.

Outro método para fazer uma cópia limpa de um arquivo `.ibd` é usar o produto MySQL Enterprise Backup:

1. Use o MySQL Enterprise Backup para fazer Backup da instalação do `InnoDB`.
2. Inicie um segundo servidor **mysqld** no Backup e deixe-o limpar os arquivos `.ibd` no Backup.

##### Restaurando de um Logical Backup

Você pode usar um utilitário como o **mysqldump** para realizar um *Logical Backup*, que produz um conjunto de instruções SQL que podem ser executadas para reproduzir as definições originais dos objetos de Database e os dados da Table para transferência para outro servidor SQL. Usando este método, não importa se os formatos diferem ou se suas Tables contêm dados de ponto flutuante.

Para melhorar o desempenho deste método, desabilite o `autocommit` ao importar dados. Execute um *commit* somente após importar uma Table inteira ou um segmento de uma Table.