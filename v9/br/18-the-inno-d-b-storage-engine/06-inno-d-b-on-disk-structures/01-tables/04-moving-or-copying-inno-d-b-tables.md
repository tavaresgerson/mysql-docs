#### 17.6.1.4 Movimentando ou Copiando Tabelas InnoDB

Esta seção descreve técnicas para mover ou copiar algumas ou todas as tabelas `InnoDB` para um servidor ou instância diferente. Por exemplo, você pode mover uma instância inteira do MySQL para um servidor maior e mais rápido; você pode clonar uma instância inteira do MySQL para um novo servidor de replica; você pode copiar tabelas individuais para outra instância para desenvolver e testar um aplicativo ou para um servidor de armazém de dados para produzir relatórios.

No Windows, `InnoDB` sempre armazena os nomes de bancos de dados e tabelas internamente em minúsculas. Para mover bancos de dados em formato binário de Unix para Windows ou de Windows para Unix, crie todos os bancos de dados e tabelas usando nomes em minúsculas. Uma maneira conveniente de realizar isso é adicionar a seguinte linha à seção `[mysqld]` do seu arquivo `my.cnf` ou `my.ini` antes de criar quaisquer bancos de dados ou tabelas:

```
[mysqld]
lower_case_table_names=1
```

Observação

É proibido iniciar o servidor com um ajuste `lower_case_table_names` diferente do ajuste usado quando o servidor foi inicializado.

As técnicas para mover ou copiar tabelas `InnoDB` incluem:

* Importar Tabelas
* Backup do MySQL Enterprise
* Copiar Arquivos de Dados (Método de Backup Frio)")
* Restaurar de um Backup Lógico

O produto MySQL Enterprise Backup permite fazer backup de um banco de dados MySQL em execução com mínima interrupção nas operações, ao mesmo tempo em que produz um instantâneo consistente do banco de dados. Quando o MySQL Enterprise Backup está copiando tabelas, as leituras e escritas podem continuar. Além disso, o MySQL Enterprise Backup pode criar arquivos de backup comprimidos e fazer backup de subconjuntos de tabelas. Em conjunto com o log binário do MySQL, você pode realizar a recuperação em um ponto específico no tempo. O MySQL Enterprise Backup está incluído como parte da assinatura do MySQL Enterprise.

Para obter mais detalhes sobre o MySQL Enterprise Backup, consulte a Seção 32.1, “MySQL Enterprise Backup Overview”.

##### Copiando Arquivos de Dados (Método de Backup Frio)

Você pode mover um banco de dados `InnoDB` simplesmente copiando todos os arquivos relevantes listados em "Backups Frios" na Seção 17.18.1, “Backup InnoDB”.

Os arquivos de dados e log do `InnoDB` são binariamente compatíveis em todas as plataformas que possuem o mesmo formato de número de ponto flutuante. Se os formatos de ponto flutuante diferirem, mas você não tenha usado os tipos de dados `FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE") em suas tabelas, então o procedimento é o mesmo: simplesmente copie os arquivos relevantes.

Ao mover ou copiar arquivos `.ibd` por tabela, o nome do diretório do banco de dados deve ser o mesmo nos sistemas de origem e destino. A definição da tabela armazenada no espaço de tabela compartilhado `InnoDB` inclui o nome do banco de dados. Os IDs de transação e os números de sequência de log armazenados nos arquivos do espaço de tabela também diferem entre os bancos de dados.

Para mover um arquivo `.ibd` e a tabela associada de um banco de dados para outro, use uma declaração `RENAME TABLE`:

```
RENAME TABLE db1.tbl_name TO db2.tbl_name;
```

Se você tiver um backup "limpo" de um arquivo `.ibd`, você pode restaurá-lo à instalação do MySQL de onde ele se originou da seguinte forma:

1. A tabela não deve ter sido excluída ou truncada desde que você copiou o arquivo `.ibd`, pois isso altera o ID da tabela armazenado no tablespace.

2. Edite a seguinte instrução `ALTER TABLE` para excluir o arquivo `.ibd` atual:

   ```
   ALTER TABLE tbl_name DISCARD TABLESPACE;
   ```

3. Copie o arquivo de backup `.ibd` para o diretório do banco de dados apropriado.

4. Edite a seguinte instrução `ALTER TABLE` para informar ao `InnoDB` que deve usar o novo arquivo `.ibd` para a tabela:

   ```
   ALTER TABLE tbl_name IMPORT TABLESPACE;
   ```

   Observação

   O recurso `ALTER TABLE ... IMPORT TABLESPACE` não aplica restrições de chave estrangeira aos dados importados.

Neste contexto, um backup de arquivo `.ibd` "limpo" é aquele para o qual os seguintes requisitos são atendidos:

* Não há modificações não confirmadas por transações no arquivo `.ibd`.

* Não há entradas de buffer de inserção não unidas no arquivo `.ibd`.

* A purga removeu todos os registros de índice marcados para exclusão do arquivo `.ibd`.

* O **mysqld** esvaziou todas as páginas modificadas do arquivo `.ibd` do pool de buffers para o arquivo.

Você pode fazer um backup de arquivo `.ibd` limpo usando o seguinte método:

1. Parar todas as atividades do servidor **mysqld** e confirmar todas as transações.

2. Aguardar até que o `SHOW ENGINE INNODB STATUS` mostre que não há transações ativas no banco de dados e que o estado do fio principal do `InnoDB` é `Aguardando atividade do servidor`. Em seguida, você pode fazer uma cópia do arquivo `.ibd`.

Outro método para fazer uma cópia limpa de um arquivo `.ibd` é usar o produto MySQL Enterprise Backup:

1. Use o MySQL Enterprise Backup para fazer backup da instalação do `InnoDB`.

2. Inicie um segundo servidor **mysqld** no backup e deixe-o limpar os arquivos `.ibd` no backup.

##### Restauração a partir de um backup lógico

Você pode usar uma ferramenta como o **mysqldump** para realizar um backup lógico, que produz um conjunto de instruções SQL que podem ser executadas para reproduzir as definições originais dos objetos do banco de dados e os dados das tabelas para transferência para outro servidor SQL. Ao usar esse método, não importa se os formatos diferem ou se suas tabelas contêm dados de ponto flutuante.

Para melhorar o desempenho desse método, desative o `autocommit` ao importar dados. Realize um commit apenas após importar uma tabela inteira ou um segmento de uma tabela.