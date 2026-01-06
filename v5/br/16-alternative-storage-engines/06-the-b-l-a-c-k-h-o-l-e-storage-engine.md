## 15.6 O Motor de Armazenamento BLACKHOLE

O mecanismo de armazenamento `BLACKHOLE` atua como um "buraco negro" que aceita dados, mas os descarta e não os armazena. As consultas sempre retornam um resultado vazio:

```sql
mysql> CREATE TABLE test(i INT, c CHAR(10)) ENGINE = BLACKHOLE;
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO test VALUES(1,'record one'),(2,'record two');
Query OK, 2 rows affected (0.00 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM test;
Empty set (0.00 sec)
```

Para habilitar o mecanismo de armazenamento `BLACKHOLE` se você construir o MySQL a partir do código-fonte, invocando o **CMake** com a opção `-DWITH_BLACKHOLE_STORAGE_ENGINE`.

Para examinar a fonte do motor `BLACKHOLE`, procure no diretório `sql` de uma distribuição de fonte MySQL.

Quando você cria uma tabela `BLACKHOLE`, o servidor cria um arquivo de formato de tabela no diretório do banco de dados. O arquivo começa com o nome da tabela e tem a extensão `.frm`. Não há outros arquivos associados à tabela.

O mecanismo de armazenamento `BLACKHOLE` suporta todos os tipos de índices. Isso significa que você pode incluir declarações de índice na definição da tabela.

O comprimento máximo da chave é de 1000 bytes.

Você pode verificar se o mecanismo de armazenamento `BLACKHOLE` está disponível com a instrução `SHOW ENGINES`.

As inserções em uma tabela `BLACKHOLE` não armazenam nenhum dado, mas, se a logon binária com base em declarações estiver habilitada, as declarações SQL são registradas e replicadas para os servidores replicados. Isso pode ser útil como um mecanismo de repetição ou filtro.

Suponha que sua aplicação precise de regras de filtragem no lado da replica, mas transferir todos os dados do log binário para a replica primeiro resulta em muito tráfego. Nesse caso, é possível configurar no host de origem um processo de replica "falsa" cujo mecanismo de armazenamento padrão é `BLACKHOLE`, conforme descrito a seguir:

**Figura 15.1 Replicação usando BLACKHOLE para Filtragem**

![Replicação usando o BLACKHOLE para filtragem](images/blackhole-1.png)

A fonte escreve para seu log binário. O processo **mysqld** "falso" atua como uma réplica, aplicando a combinação desejada de regras `replicate-do-*` e `replicate-ignore-*`, e escreve um novo log binário filtrado próprio. (Veja a Seção 16.1.6, “Opções e Variáveis de Registro Binário e Replicação”.) Esse log filtrado é fornecido à réplica.

O processo fictício não armazena dados reais, portanto, há pouco overhead de processamento ao executar o processo adicional **mysqld** no host da fonte de replicação. Esse tipo de configuração pode ser repetido com réplicas adicionais de replicação.

Os gatilhos `INSERT` para as tabelas `BLACKHOLE` funcionam conforme o esperado. No entanto, como a tabela `BLACKHOLE` não armazena dados reais, os gatilhos `UPDATE` e `DELETE` não são ativados: A cláusula `FOR EACH ROW` na definição do gatilho não se aplica porque não há linhas.

Outros usos possíveis para o motor de armazenamento `BLACKHOLE` incluem:

- Verificação da sintaxe do arquivo de dumping.

- Medição do overhead do registro binário, comparando o desempenho com e sem o registro binário ativado.

- O `BLACKHOLE` é essencialmente um motor de armazenamento "sem operação", então ele pode ser usado para encontrar gargalos de desempenho que não estejam relacionados ao próprio motor de armazenamento.

O motor `BLACKHOLE` é sensível a transações, no sentido de que as transações confirmadas são escritas no log binário e as transações revertidas não são.

**Motor Blackhole e Colunas de Incremento Automático**

O motor Blackhole é um motor sem efeito. Quaisquer operações realizadas em uma tabela usando BLACKHOLE não têm efeito. Isso deve ser levado em consideração ao considerar o comportamento das colunas de chave primária que autoincrementam. O motor não incrementa automaticamente os valores do campo e não mantém o estado da coluna de autoincremento. Isso tem implicações importantes na replicação.

Considere o seguinte cenário de replicação, onde todas as três condições a seguir se aplicam:

1. Em um servidor fonte, há uma tabela blackhole com um campo de incremento automático que é uma chave primária.

2. Em uma réplica, a mesma tabela existe, mas usando o motor MyISAM.

3. Os registros são inseridos na tabela da fonte sem que o valor de incremento automático seja explicitamente definido na própria instrução `INSERT` ou através do uso de uma instrução `SET INSERT_ID`.

Nesse cenário, a replicação falha com um erro de entrada duplicada na coluna da chave primária.

Na replicação com base em declaração, o valor de `INSERT_ID` no evento de contexto é sempre o mesmo. Portanto, a replicação falha ao tentar inserir uma linha com um valor duplicado para uma coluna de chave primária.

Na replicação baseada em linha, o valor que o motor retorna para a linha sempre será o mesmo para cada inserção. Isso faz com que a replica tente refazer duas entradas de log de inserção usando o mesmo valor para a coluna da chave primária, e, assim, a replicação falha.

**Filtragem de Colunas**

Ao usar a replicação baseada em linhas (`binlog_format=ROW`), é suportada uma replica onde as últimas colunas estão ausentes de uma tabela, conforme descrito na seção Seção 16.4.1.10, “Replicação com definições de tabela diferentes na fonte e na replica”.

Esse filtro funciona no lado da replica, ou seja, as colunas são copiadas para a replica antes de serem filtradas. Existem pelo menos dois casos em que não é desejável copiar as colunas para a replica:

1. Se os dados forem confidenciais, o servidor de replicação não deve ter acesso a eles.

2. Se a fonte tiver muitas réplicas, filtrar antes de enviar para as réplicas pode reduzir o tráfego de rede.

A filtragem de colunas de origem pode ser realizada usando o motor `BLACKHOLE`. Isso é feito de maneira semelhante à filtragem de tabelas de origem, usando o motor `BLACKHOLE` e a opção `--replicate-do-table` ou `--replicate-ignore-table`.

A configuração para a fonte é:

```sql
CREATE TABLE t1 (public_col_1, ..., public_col_N,
                 secret_col_1, ..., secret_col_M) ENGINE=MyISAM;
```

A configuração para a replica confiável é:

```sql
CREATE TABLE t1 (public_col_1, ..., public_col_N) ENGINE=BLACKHOLE;
```

A configuração para a réplica não confiável é:

```sql
CREATE TABLE t1 (public_col_1, ..., public_col_N) ENGINE=MyISAM;
```
