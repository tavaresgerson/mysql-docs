## 15.6 O Storage Engine BLACKHOLE

O `BLACKHOLE` storage engine atua como um "buraco negro" que aceita dados, mas os descarta e não os armazena. As recuperações (Retrievals) sempre retornam um resultado vazio:

```sql
mysql> CREATE TABLE test(i INT, c CHAR(10)) ENGINE = BLACKHOLE;
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO test VALUES(1,'record one'),(2,'record two');
Query OK, 2 rows affected (0.00 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM test;
Empty set (0.00 sec)
```

Para habilitar o `BLACKHOLE` storage engine se você estiver compilando o MySQL a partir do código-fonte (source), invoque o **CMake** com a opção `-DWITH_BLACKHOLE_STORAGE_ENGINE`.

Para examinar o código-fonte (source) do engine `BLACKHOLE`, procure no diretório `sql` de uma distribuição de código-fonte do MySQL.

Quando você cria uma tabela `BLACKHOLE`, o servidor cria um arquivo de formato de tabela no diretório do Database. O nome do arquivo começa com o nome da tabela e possui a extensão `.frm`. Não há outros arquivos associados à tabela.

O `BLACKHOLE` storage engine suporta todos os tipos de Indexes. Ou seja, você pode incluir declarações de Index na definição da tabela.

O comprimento máximo da Key é de 1000 bytes.

Você pode verificar se o `BLACKHOLE` storage engine está disponível com o comando `SHOW ENGINES`.

Operations `INSERT` em uma tabela `BLACKHOLE` não armazenam dados, mas se o Binary Logging baseado em statement estiver habilitado, os statements SQL são logados e replicados para os servidores Replica. Isso pode ser útil como um repetidor ou mecanismo de filtro.

Suponha que sua aplicação exija regras de filtragem do lado da Replica (replica-side filtering), mas que transferir todos os dados do Binary Log para a Replica primeiro resulte em excesso de tráfego. Nesses casos, é possível configurar no host Source um processo Replica "dummy" (fictício) cujo Storage Engine padrão é `BLACKHOLE`, conforme ilustrado a seguir:

**Figura 15.1 Replicação usando BLACKHOLE para Filtragem**

![Replicação usando BLACKHOLE para filtragem](images/blackhole-1.png)

O Source grava em seu Binary Log. O processo **mysqld** "dummy" atua como uma Replica, aplicando a combinação desejada de regras `replicate-do-*` e `replicate-ignore-*`, e grava um novo Binary Log filtrado próprio. (Consulte a Seção 16.1.6, “Opções e Variáveis de Replicação e Binary Logging”.) Este log filtrado é fornecido à Replica.

O processo dummy não armazena dados, portanto, há pouca sobrecarga (overhead) de processamento incorrida ao executar o processo **mysqld** adicional no host Source de replicação. Este tipo de configuração pode ser repetido com Replias de replicação adicionais.

Triggers `INSERT` para tabelas `BLACKHOLE` funcionam conforme esperado. No entanto, como a tabela `BLACKHOLE` não armazena dados, Triggers `UPDATE` e `DELETE` não são ativados: A cláusula `FOR EACH ROW` na definição do Trigger não se aplica porque não há linhas (rows).

Outros usos possíveis para o `BLACKHOLE` storage engine incluem:

* Verificação da sintaxe de arquivos dump.
* Medição da sobrecarga (overhead) do Binary Logging, comparando o desempenho usando `BLACKHOLE` com e sem o Binary Logging habilitado.
* O `BLACKHOLE` é essencialmente um storage engine "no-op" (sem operação), de modo que pode ser usado para encontrar gargalos de desempenho (performance bottlenecks) não relacionados ao próprio storage engine.

O engine `BLACKHOLE` é ciente de transações (transaction-aware), no sentido de que transações committed são gravadas no Binary Log e transações rolled-back não são.

**Engine Blackhole e Colunas Auto Increment**

O engine Blackhole é um engine no-op. Qualquer operação realizada em uma tabela usando BLACKHOLE não tem efeito. Isso deve ser considerado ao analisar o comportamento de colunas Primary Key que são auto increment. O engine não incrementa automaticamente os valores dos campos e não retém o estado da coluna auto increment. Isso tem implicações importantes na replicação.

Considere o seguinte cenário de replicação onde todas as três condições a seguir se aplicam:

1. Em um servidor Source existe uma tabela blackhole com um campo auto increment que é uma Primary Key.

2. Em uma Replica existe a mesma tabela, mas usando o engine MyISAM.

3. São realizadas operações `INSERT` na tabela do Source sem definir explicitamente o valor auto increment no próprio statement `INSERT` ou usando um statement `SET INSERT_ID`.

Neste cenário, a replicação falha com um erro de entrada duplicada na coluna Primary Key.

Na replicação baseada em statement (statement based replication), o valor de `INSERT_ID` no evento de contexto é sempre o mesmo. A replicação falha, portanto, por tentar inserir uma row com um valor duplicado para uma coluna Primary Key.

Na replicação baseada em row (row based replication), o valor que o engine retorna para a row será sempre o mesmo para cada `INSERT`. Isso resulta na Replica tentando reexecutar (replay) duas entradas de log de `INSERT` usando o mesmo valor para a coluna Primary Key, e assim a replicação falha.

**Filtragem de Colunas**

Ao usar replicação baseada em row (`binlog_format=ROW`), uma Replica onde as últimas colunas estão ausentes em uma tabela é suportada, conforme descrito na Seção 16.4.1.10, “Replicação com Definições de Tabela Diferentes no Source e na Replica”.

Essa filtragem funciona no lado da Replica (replica side); ou seja, as colunas são copiadas para a Replica antes de serem filtradas. Existem pelo menos dois casos em que não é desejável copiar as colunas para a Replica:

1. Se os dados forem confidenciais, de modo que o servidor Replica não deva ter acesso a eles.

2. Se o Source tiver muitas Replias, a filtragem antes do envio às Replias pode reduzir o tráfego de rede.

A filtragem de colunas do Source pode ser alcançada usando o engine `BLACKHOLE`. Isso é realizado de forma semelhante a como a filtragem de tabelas do Source é alcançada — usando o engine `BLACKHOLE` e a opção `--replicate-do-table` ou `--replicate-ignore-table`.

A configuração para o Source é:

```sql
CREATE TABLE t1 (public_col_1, ..., public_col_N,
                 secret_col_1, ..., secret_col_M) ENGINE=MyISAM;
```

A configuração para a Replica confiável é:

```sql
CREATE TABLE t1 (public_col_1, ..., public_col_N) ENGINE=BLACKHOLE;
```

A configuração para a Replica não confiável é:

```sql
CREATE TABLE t1 (public_col_1, ..., public_col_N) ENGINE=MyISAM;
```