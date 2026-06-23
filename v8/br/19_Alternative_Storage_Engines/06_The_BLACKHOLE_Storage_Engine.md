## 18.6 O Motor de Armazenamento BLACKHOLE

O motor de armazenamento `BLACKHOLE` age como um "buraco negro" que aceita dados, mas os descarta e não os armazena. As recuperações sempre retornam um resultado vazio:

```
mysql> CREATE TABLE test(i INT, c CHAR(10)) ENGINE = BLACKHOLE;
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO test VALUES(1,'record one'),(2,'record two');
Query OK, 2 rows affected (0.00 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM test;
Empty set (0.00 sec)
```

Para habilitar o mecanismo de armazenamento `BLACKHOLE` se você construir o MySQL a partir do código-fonte, invoque o **CMake** com a opção `-DWITH_BLACKHOLE_STORAGE_ENGINE`.

Para examinar a fonte do motor `BLACKHOLE`, procure no diretório `sql` de uma distribuição de fonte MySQL.

Quando você cria uma tabela `BLACKHOLE`, o servidor cria a definição da tabela no dicionário de dados global. Não há arquivos associados à tabela.

O motor de armazenamento `BLACKHOLE` suporta todos os tipos de índices. Isso significa que você pode incluir declarações de índice na definição da tabela.

O comprimento máximo da chave é de 3072 bytes a partir do MySQL 8.0.27. Antes do 8.0.27, o comprimento máximo da chave é de 1000 bytes.

O motor de armazenamento `BLACKHOLE` não suporta particionamento.

Você pode verificar se o motor de armazenamento `BLACKHOLE` está disponível com a declaração `SHOW ENGINES`(show-engines.html "15.7.7.16 SHOW ENGINES Statement").

Os registros inseridos em uma tabela `BLACKHOLE` não armazenam nenhum dado, mas, se a autenticação de registro binário estiver habilitada, as instruções SQL são registradas e replicadas para os servidores replicados. Isso pode ser útil como um mecanismo de repetição ou filtro.

Suponha que sua aplicação precise de regras de filtragem no lado da replica, mas transferir todos os dados do log binário para a replica primeiro resulta em muito tráfego. Nesse caso, é possível configurar no servidor de origem de replicação um processo de replica "fantoche" cujo mecanismo de armazenamento padrão é `BLACKHOLE`, representado da seguinte forma:

**Figura 18.1 Replicação usando BLACKHOLE para Filtragem**

![The replication source server uses a source mysqld process and a dummy mysqld process. On the replica, the mysqld process replicates from the dummy mysqld process.](images/blackhole-1.png)

A fonte escreve para seu log binário. O processo **mysqld** “fantoche” atua como uma réplica, aplicando a combinação desejada das regras `replicate-do-*` e `replicate-ignore-*`, e escreve um novo log binário filtrado próprio. (Veja a Seção 19.1.6, “Opções e Variáveis de Replicação e Registro Binário”). Este log filtrado é fornecido à réplica.

O processo fictício não armazena, na verdade, nenhum dado, portanto, há pouco sobrecarga de processamento ao executar o processo adicional **mysqld** no servidor de origem de replicação. Esse tipo de configuração pode ser repetido com réplicas adicionais.

Os gatilhos para as tabelas `BLACKHOLE` de `INSERT` funcionam como esperado. No entanto, como a tabela `BLACKHOLE` não armazena dados reais, os gatilhos `UPDATE` e `DELETE` não são ativados: A cláusula `FOR EACH ROW` na definição do gatilho não se aplica porque não há linhas.

Outros usos possíveis para o mecanismo de armazenamento `BLACKHOLE` incluem:

* Verificação da sintaxe do arquivo de dumping. * Medição do overhead do registro binário, comparando o desempenho com e sem o registro binário habilitado.

* `BLACKHOLE` é essencialmente um motor de armazenamento "sem operação", portanto, ele pode ser usado para encontrar gargalos de desempenho que não estão relacionados ao próprio motor de armazenamento.

O motor `BLACKHOLE` é sensível a transações, no sentido de que as transações comprometidas são escritas no log binário e as transações revertidas não o são.

**Motor Blackhole e Colunas de Incremento Automático**

O motor `BLACKHOLE` é um motor sem operação. Quaisquer operações realizadas em uma tabela usando `BLACKHOLE` não têm efeito. Isso deve ser levado em consideração ao considerar o comportamento das colunas de chave primária que auto-incrementam. O motor não incrementa automaticamente os valores do campo e não retém o estado do campo de auto-incremento. Isso tem implicações importantes na replicação.

Considere o seguinte cenário de replicação, onde todas as três condições a seguir se aplicam:

1. Em um servidor fonte, há uma tabela blackhole com um campo de autoincremento que é uma chave primária.

2. Em uma replica, a mesma tabela existe, mas usando o motor MyISAM. 3. As inserções são realizadas na tabela da fonte sem definir explicitamente o valor de auto incremento na própria declaração `INSERT` ou através do uso de uma declaração `SET INSERT_ID`.

Nesse cenário, a replicação falha com um erro de entrada duplicada na coluna da chave primária.

Na replicação com valor baseado em declaração, o valor de `INSERT_ID` no evento de contexto é sempre o mesmo. Portanto, a replicação falha porque tenta inserir uma linha com um valor duplicado para uma coluna de chave primária.

Na replicação baseada em linha, o valor que o motor retorna para a linha sempre será o mesmo para cada inserção. Isso resulta na replicação tentando refazer duas entradas de registro de inserção usando o mesmo valor para a coluna da chave primária, e, portanto, a replicação falha.

**Filtragem de Coluna**

Ao usar a replicação baseada em linhas (`binlog_format=ROW`), é suportada uma replica onde as últimas colunas estão ausentes de uma tabela, conforme descrito na seção 19.5.1.9, “Replicação com definições de tabela diferentes na fonte e na replica”.

Esse filtro funciona no lado da réplica, ou seja, as colunas são copiadas para a réplica antes de serem filtradas. Há pelo menos dois casos em que não é desejável copiar as colunas para a réplica:

1. Se os dados forem confidenciais, o servidor de replicação não deve ter acesso a eles.

2. Se a fonte tiver muitas réplicas, filtrar antes de enviar para as réplicas pode reduzir o tráfego de rede.

A filtragem da coluna de fonte pode ser realizada usando o motor `BLACKHOLE`. Isso é feito de maneira semelhante à forma como a filtragem da tabela de fonte é realizada — usando o motor `BLACKHOLE` e a opção `--replicate-do-table` ou `--replicate-ignore-table`.

O setup para a fonte é:

```
CREATE TABLE t1 (public_col_1, ..., public_col_N,
                 secret_col_1, ..., secret_col_M) ENGINE=MyISAM;
```

O conjunto para a réplica confiável é:

```
CREATE TABLE t1 (public_col_1, ..., public_col_N) ENGINE=BLACKHOLE;
```

A configuração para a réplica não confiável é:

```
CREATE TABLE t1 (public_col_1, ..., public_col_N) ENGINE=MyISAM;
```