#### 14.6.1.4 Movimentando ou copiando tabelas InnoDB

Esta seção descreve técnicas para mover ou copiar algumas ou todas as tabelas do `InnoDB` para um servidor ou instância diferente. Por exemplo, você pode mover uma instância completa do MySQL para um servidor maior e mais rápido; você pode clonar uma instância completa do MySQL para um novo servidor de replica; você pode copiar tabelas individuais para outra instância para desenvolver e testar um aplicativo ou para um servidor de armazém de dados para produzir relatórios.

No Windows, o `InnoDB` sempre armazena os nomes de banco de dados e tabelas internamente em minúsculas. Para mover bancos de dados em formato binário do Unix para o Windows ou do Windows para o Unix, crie todos os bancos de dados e tabelas usando nomes em minúsculas. Uma maneira conveniente de realizar isso é adicionar a seguinte linha à seção `[mysqld]` do seu arquivo `my.cnf` ou `my.ini` antes de criar quaisquer bancos de dados ou tabelas:

```sql
[mysqld]
lower_case_table_names=1
```

As técnicas para mover ou copiar tabelas do `InnoDB` incluem:

- Importar tabelas
- MySQL Enterprise Backup
- Copiar arquivos de dados (método de backup frio)
- Restauração a partir de um backup lógico

##### Importar tabelas

Uma tabela que reside em um espaço de tabela por arquivo pode ser importada de outra instância do servidor MySQL ou de um backup usando o recurso *Espaço de tabela transportable*. Veja a Seção 14.6.1.3, “Importando tabelas InnoDB”.

##### MySQL Enterprise Backup

O produto MySQL Enterprise Backup permite fazer backup de um banco de dados MySQL em execução com mínima interrupção das operações, ao mesmo tempo em que produz um instantâneo consistente do banco de dados. Quando o MySQL Enterprise Backup está copiando tabelas, as leituras e escritas podem continuar. Além disso, o MySQL Enterprise Backup pode criar arquivos de backup comprimidos e fazer backup de subconjuntos de tabelas. Em conjunto com o log binário do MySQL, você pode realizar a recuperação em um ponto no tempo. O MySQL Enterprise Backup está incluído como parte da assinatura do MySQL Enterprise.

Para obter mais detalhes sobre o MySQL Enterprise Backup, consulte a Seção 28.1, “MySQL Enterprise Backup Overview”.

##### Copiar arquivos de dados (método de backup frio)

Você pode mover um banco de dados `InnoDB` simplesmente copiando todos os arquivos relevantes listados em "Backups Frio" na Seção 14.19.1, "Backup InnoDB".

Os arquivos de dados e log do `InnoDB` são compatíveis em binário em todas as plataformas que possuem o mesmo formato de número de ponto flutuante. Se os formatos de ponto flutuante forem diferentes, mas você não tiver usado os tipos de dados `FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE") em suas tabelas, o procedimento é o mesmo: simplesmente copie os arquivos relevantes.

Quando você move ou copia arquivos `.ibd` por tabela, o nome do diretório do banco de dados deve ser o mesmo nos sistemas de origem e destino. A definição da tabela armazenada no espaço de tabelas compartilhado `InnoDB` inclui o nome do banco de dados. Os IDs de transação e os números de sequência do log armazenados nos arquivos do espaço de tabelas também diferem entre os bancos de dados.

Para mover um arquivo `.ibd` e a tabela associada de um banco de dados para outro, use uma instrução `RENAME TABLE`:

```sql
RENAME TABLE db1.tbl_name TO db2.tbl_name;
```

Se você tiver um backup "limpo" de um arquivo `.ibd`, você pode restaurá-lo à instalação do MySQL de onde ele se originou da seguinte forma:

1. A tabela não deve ter sido excluída ou truncada desde que você copiou o arquivo `.ibd`, pois isso altera o ID da tabela armazenado dentro do espaço de tabelas.

2. Emita a seguinte instrução `ALTER TABLE` para excluir o arquivo `.ibd` atual:

   ```sql
   ALTER TABLE tbl_name DISCARD TABLESPACE;
   ```

3. Copie o arquivo de backup `.ibd` para o diretório do banco de dados apropriado.

4. Emita a seguinte instrução `ALTER TABLE` para informar ao `InnoDB` que deve usar o novo arquivo `.ibd` para a tabela:

   ```sql
   ALTER TABLE tbl_name IMPORT TABLESPACE;
   ```

   Nota

   O recurso `ALTER TABLE ... IMPORT TABLESPACE` não aplica restrições de chave estrangeira aos dados importados.

Nesse contexto, um backup de arquivo `.ibd` "limpo" é aquele para o qual são atendidas as seguintes exigências:

- Não há modificações não confirmadas por transações no arquivo `.ibd`.

- Não há entradas de buffer de inserção não unidas no arquivo `.ibd`.

- O Purge removeu todos os registros de índice marcados como excluídos do arquivo `.ibd`.

- O **mysqld** limpou todas as páginas modificadas do arquivo `.ibd` do pool de buffers para o arquivo.

Você pode fazer um backup limpo do arquivo `.ibd` usando o seguinte método:

1. Pare toda atividade do servidor **mysqld** e commit todas as transações.

2. Aguarde até que `SHOW ENGINE INNODB STATUS` mostre que não há transações ativas no banco de dados e que o estado da thread principal do `InnoDB` esteja em `Aguardando atividade do servidor`. Em seguida, você pode fazer uma cópia do arquivo `.ibd`.

Outro método para fazer uma cópia limpa de um arquivo `.ibd` é usar o produto MySQL Enterprise Backup:

1. Use o MySQL Enterprise Backup para fazer o backup da instalação do `InnoDB`.
2. Inicie um segundo servidor **mysqld** no backup e deixe-o limpar os arquivos `.ibd` no backup.

##### Restauração a partir de um backup lógico

Você pode usar uma ferramenta como **mysqldump** para realizar um backup lógico, que gera um conjunto de instruções SQL que podem ser executadas para reproduzir as definições originais dos objetos do banco de dados e os dados das tabelas para transferência para outro servidor SQL. Ao usar esse método, não importa se os formatos diferem ou se suas tabelas contêm dados de ponto flutuante.

Para melhorar o desempenho deste método, desative o `autocommit` ao importar dados. Realize um commit apenas após importar uma tabela inteira ou um segmento de uma tabela.
