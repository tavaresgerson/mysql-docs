## 18.6 O Motor de Armazenamento BLACKHOLE

O motor de armazenamento `BLACKHOLE` atua como um "buraco negro" que aceita dados, mas os descarta e não os armazena. As consultas sempre retornam um resultado vazio:

```
mysql> CREATE TABLE test(i INT, c CHAR(10)) ENGINE = BLACKHOLE;
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO test VALUES(1,'record one'),(2,'record two');
Query OK, 2 rows affected (0.00 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM test;
Empty set (0.00 sec)
```

Para habilitar o motor de armazenamento `BLACKHOLE` ao construir o MySQL a partir do código-fonte, invocando o **CMake** com a opção `-DWITH_BLACKHOLE_STORAGE_ENGINE`.

Para examinar a fonte do motor `BLACKHOLE`, procure no diretório `sql` de uma distribuição de código-fonte do MySQL.

Ao criar uma tabela `BLACKHOLE`, o servidor cria a definição da tabela no dicionário de dados global. Não há arquivos associados à tabela.

O motor de armazenamento `BLACKHOLE` suporta todos os tipos de índices. Ou seja, você pode incluir declarações de índice na definição da tabela.

O comprimento máximo da chave é de 3072 bytes.

O motor de armazenamento `BLACKHOLE` não suporta particionamento.

Você pode verificar se o motor de armazenamento `BLACKHOLE` está disponível com a instrução `SHOW ENGINES`.

As inserções em uma tabela `BLACKHOLE` não armazenam nenhum dado, mas se a logon binária com base em declarações de consulta estiver habilitada, as instruções SQL são registradas e replicadas para os servidores replicados. Isso pode ser útil como um mecanismo de repetição ou filtro.

Suponha que sua aplicação exija regras de filtragem no lado da replica, mas transferir todos os dados do log binário para a replica primeiro resulta em muito tráfego. Nesse caso, é possível configurar no servidor de origem da replicação um processo de replica "falsa" cujo motor de armazenamento padrão é `BLACKHOLE`, conforme descrito a seguir:

**Figura 18.1 Replicação usando BLACKHOLE para Filtragem**

![O servidor de origem da replicação usa um processo mysqld de origem e um processo mysqld "falsa". Na replica, o processo mysqld replica do processo mysqld "falsa".](images/blackhole-1.png)

A fonte escreve para seu log binário. O processo "fantoche" **mysqld** atua como uma réplica, aplicando a combinação desejada de regras `replicate-do-*` e `replicate-ignore-*`, e escreve um novo log binário filtrado de sua própria autoria. (Veja a Seção 19.1.6, “Opções e Variáveis de Registro Binário e Replicação”.) Esse log filtrado é fornecido à réplica.

O processo fictício não armazena realmente nenhum dado, portanto, há pouco overhead de processamento causado pelo funcionamento do processo adicional **mysqld** no servidor de origem da replicação. Esse tipo de configuração pode ser repetido com réplicas adicionais.

Os gatilhos `INSERT` para tabelas `BLACKHOLE` funcionam conforme o esperado. No entanto, como a tabela `BLACKHOLE` não armazena realmente nenhum dado, os gatilhos `UPDATE` e `DELETE` não são ativados: A cláusula `FOR EACH ROW` na definição do gatilho não se aplica porque não há linhas.

Outros usos possíveis para o mecanismo de armazenamento `BLACKHOLE` incluem:

* Verificação da sintaxe do arquivo de dump.
* Medição do overhead do registro binário, comparando o desempenho usando `BLACKHOLE` com e sem o registro binário habilitado.

* `BLACKHOLE` é essencialmente um mecanismo de armazenamento "sem efeito" (no-op), então ele poderia ser usado para encontrar gargalos de desempenho não relacionados ao próprio mecanismo de armazenamento.

O mecanismo `BLACKHOLE` é sensível a transações, no sentido de que transações comprometidas são escritas no log binário e transações anuladas não são.

**Motor Blackhole e Colunas de Incremento Automático**

O motor `BLACKHOLE` é um motor sem efeito. Quaisquer operações realizadas em uma tabela usando `BLACKHOLE` não têm efeito. Isso deve ser levado em consideração ao considerar o comportamento das colunas de chave primária que autoincrementam. O motor não incrementa automaticamente os valores dos campos e não mantém o estado do campo de autoincremento. Isso tem implicações importantes na replicação.

Considere o seguinte cenário de replicação onde todas as três das seguintes condições se aplicam:

1. Em um servidor de origem, existe uma tabela `BLACKHOLE` com um campo de autoincremento que é uma chave primária.

2. Em uma replica, a mesma tabela existe, mas usando o motor MyISAM.
3. Inserções são realizadas na tabela da origem sem explicitamente definir o valor de autoincremento na própria instrução `INSERT` ou através do uso de uma instrução `SET INSERT_ID`.

Neste cenário, a replicação falha com um erro de entrada duplicada na coluna da chave primária.

Na replicação baseada em declarações, o valor de `INSERT_ID` no evento de contexto é sempre o mesmo. Portanto, a replicação falha devido à tentativa de inserir uma linha com um valor duplicado para uma coluna de chave primária.

Na replicação baseada em linhas, o valor que o motor retorna para a linha sempre será o mesmo para cada inserção. Isso resulta na replicação tentando reproduzir duas entradas do log de inserção usando o mesmo valor para a coluna de chave primária, e assim a replicação falha.

**Filtragem de Colunas**

Ao usar replicação baseada em linhas (`binlog_format=ROW`), uma replica onde as últimas colunas estão ausentes de uma tabela é suportada, conforme descrito na seção 19.5.1.9, “Replicação com Definições de Tabela Diferentes na Fonte e na Replica”.

Esse filtro funciona no lado da replica, ou seja, as colunas são copiadas para a replica antes de serem filtradas. Existem pelo menos dois casos em que não é desejável copiar as colunas para a replica:

1. Se os dados são confidenciais, para que o servidor da replica não tenha acesso a eles.

2. Se a fonte tem muitas réplicas, filtrar antes de enviar para as réplicas pode reduzir o tráfego de rede.

O filtro de colunas da fonte pode ser realizado usando o motor `BLACKHOLE`. Isso é feito de maneira semelhante à forma como o filtro da tabela de origem é realizado - usando o motor `BLACKHOLE` e a opção `--replicate-do-table` ou `--replicate-ignore-table`.

A configuração para a fonte é:

```
CREATE TABLE t1 (public_col_1, ..., public_col_N,
                 secret_col_1, ..., secret_col_M) ENGINE=MyISAM;
```

A configuração para a replica de confiança é:

```
CREATE TABLE t1 (public_col_1, ..., public_col_N) ENGINE=BLACKHOLE;
```

A configuração para a replica não confiável é:

```
CREATE TABLE t1 (public_col_1, ..., public_col_N) ENGINE=MyISAM;
```