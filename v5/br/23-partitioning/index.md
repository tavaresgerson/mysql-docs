# Capítulo 22 Partição

**Índice**

22.1 Visão geral da partição no MySQL

22.2 Tipos de Partição:   22.2.1 Partição RANGE

```
22.2.2 LIST Partitioning

22.2.3 COLUMNS Partitioning

22.2.4 HASH Partitioning

22.2.5 KEY Partitioning

22.2.6 Subpartitioning

22.2.7 How MySQL Partitioning Handles NULL
```

22.3 Gerenciamento de Partições:   22.3.1 Gerenciamento de Partições RANGE e LIST

```
22.3.2 Management of HASH and KEY Partitions

22.3.3 Exchanging Partitions and Subpartitions with Tables

22.3.4 Maintenance of Partitions

22.3.5 Obtaining Information About Partitions
```

22.4 Corte de Partições

22.5 Seleção de Partição

22.6 Restrições e Limitações para Partição :   22.6.1 Chaves de Partição, Chaves Primárias e Chaves Únicas

```
22.6.2 Partitioning Limitations Relating to Storage Engines

22.6.3 Partitioning Limitations Relating to Functions

22.6.4 Partitioning and Locking
```

Este capítulo discute a implementação de partição definida pelo usuário no MySQL.

Nota

A partir do MySQL 5.7.17, o manipulador de particionamento genérico no servidor MySQL é desatualizado e será removido no MySQL 8.0, quando o mecanismo de armazenamento usado para uma determinada tabela for esperado fornecer seu próprio manipulador de particionamento (“nativo”). Atualmente, apenas os mecanismos de armazenamento `InnoDB` e `NDB` fazem isso.

O uso de tabelas com particionamento não nativo resulta em um aviso `ER_WARN_DEPRECATED_SYNTAX`. No MySQL 5.7.17 a 5.7.20, o servidor realiza automaticamente uma verificação no início para identificar tabelas que usam particionamento não nativo; para quaisquer que sejam encontradas, o servidor escreve uma mensagem em seu log de erro. Para desabilitar essa verificação, use a opção `--disable-partition-engine-check`. No MySQL 5.7.21 e versões posteriores, essa verificação *não* é realizada; nessas versões, você deve iniciar o servidor com `--disable-partition-engine-check=false`, se desejar que o servidor verifique tabelas que usam o manipulador de particionamento genérico (Bug #85830, Bug #25846957).

Para se preparar para a migração para o MySQL 8.0, qualquer tabela com particionamento não nativo deve ser alterada para usar um mecanismo que ofereça particionamento nativo ou ser desparticionada. Por exemplo, para alterar uma tabela para `InnoDB`, execute a seguinte instrução:

```sql
ALTER TABLE table_name ENGINE = INNODB;
```

Você pode determinar se o seu servidor MySQL suporta particionamento verificando a saída da instrução `SHOW PLUGINS`, da seguinte forma:

```sql
mysql> SHOW PLUGINS;
+------------+----------+----------------+---------+---------+
| Name       | Status   | Type           | Library | License |
+------------+----------+----------------+---------+---------+
| binlog     | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| partition  | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| ARCHIVE    | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| BLACKHOLE  | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| CSV        | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| FEDERATED  | DISABLED | STORAGE ENGINE | NULL    | GPL     |
| MEMORY     | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| InnoDB     | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| MRG_MYISAM | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| MyISAM     | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| ndbcluster | DISABLED | STORAGE ENGINE | NULL    | GPL     |
+------------+----------+----------------+---------+---------+
11 rows in set (0.00 sec)
```

Você também pode verificar a tabela Schema de Informações `PLUGINS` com uma consulta semelhante a esta:

```sql
mysql> SELECT
    ->     PLUGIN_NAME as Name,
    ->     PLUGIN_VERSION as Version,
    ->     PLUGIN_STATUS as Status
    -> FROM INFORMATION_SCHEMA.PLUGINS
    -> WHERE PLUGIN_TYPE='STORAGE ENGINE';
+--------------------+---------+--------+
| Name               | Version | Status |
+--------------------+---------+--------+
| binlog             | 1.0     | ACTIVE |
| CSV                | 1.0     | ACTIVE |
| MEMORY             | 1.0     | ACTIVE |
| MRG_MYISAM         | 1.0     | ACTIVE |
| MyISAM             | 1.0     | ACTIVE |
| PERFORMANCE_SCHEMA | 0.1     | ACTIVE |
| BLACKHOLE          | 1.0     | ACTIVE |
| ARCHIVE            | 3.0     | ACTIVE |
| InnoDB             | 5.7     | ACTIVE |
| partition          | 1.0     | ACTIVE |
+--------------------+---------+--------+
10 rows in set (0.00 sec)
```

Em qualquer caso, se você não vir o plugin `partition` listado com o valor `ACTIVE` na coluna `Status` no resultado (mostrado em texto em negrito em cada um dos exemplos dados), então sua versão do MySQL não foi construída com suporte a partição.

Os binários da Comunidade do MySQL 5.7 fornecidos pela Oracle incluem suporte para particionamento. Para obter informações sobre o suporte para particionamento oferecido nos binários da MySQL Enterprise Edition, consulte [Capítulo 28, *MySQL Enterprise Edition*] (mysql-enterprise.html).

Para habilitar a partição ao compilar o MySQL 5.7 a partir da fonte, a compilação deve ser configurada com a opção `-DWITH_PARTITION_STORAGE_ENGINE`. Para mais informações, consulte Seção 2.8, “Instalando o MySQL a partir da fonte”.

Se o seu binário MySQL foi construído com suporte a partição, nada mais precisa ser feito para ativá-lo (por exemplo, não são necessárias entradas especiais no seu arquivo `my.cnf`).

Se você quiser desabilitar o suporte de particionamento, pode iniciar o MySQL Server com a opção `--skip-partition`. Quando o suporte de particionamento é desativado, você pode ver todas as tabelas particionadas existentes e excluí-las (embora isso não seja aconselhável), mas não poderá manipulá-las ou acessar seus dados de outra forma.

Consulte Seção 22.1, “Visão geral da partição no MySQL” para uma introdução sobre partição e conceitos de partição.

O MySQL suporta vários tipos de particionamento, bem como subparticionamento; veja Seção 22.2, “Tipos de particionamento” e Seção 22.2.6, “Subparticionamento”.

A seção 22.3, “Gestão de Partições” (partitioning-management.html), aborda os métodos de adição, remoção e alteração de partições em tabelas particionadas existentes.

Seção 22.3.4, “Manutenção de Partições”, discute comandos de manutenção de tabelas para uso com tabelas particionadas.

A tabela `PARTITIONS` no banco de dados `INFORMATION_SCHEMA` fornece informações sobre partições e tabelas particionadas. Consulte Seção 24.3.16, “A tabela INFORMATION_SCHEMA PARTITIONS” para obter mais informações; para alguns exemplos de consultas contra esta tabela, consulte Seção 22.2.7, “Como o MySQL lida com NULLs na partição”.

Para problemas conhecidos com a partição no MySQL 5.7, consulte Seção 22.6, “Restrições e Limitações na Partição”.

Você também pode achar os seguintes recursos úteis ao trabalhar com tabelas particionadas.

**Recursos adicionais.** Outras fontes de informações sobre particionamento definido pelo usuário no MySQL incluem o seguinte:

- Fórum de Partição do MySQL (<https://forums.mysql.com/list.php?106>)

  Este é o fórum de discussão oficial para aqueles interessados ou que estão experimentando a tecnologia de Partição do MySQL. Ele apresenta anúncios e atualizações dos desenvolvedores do MySQL e outros. É monitorado por membros das equipes de Desenvolvimento e Documentação de Partição.

- PlanetMySQL

  Um site de notícias do MySQL que apresenta blogs relacionados ao MySQL, que deve ser de interesse para qualquer pessoa que use o meu MySQL. Incentivamos você a verificar aqui os links para blogs mantidos por aqueles que trabalham com Partição do MySQL, ou para que seu próprio blog seja adicionado aos que são cobertos.

Os binários do MySQL 5.7 estão disponíveis em <https://dev.mysql.com/downloads/mysql/5.7.html>. No entanto, para as últimas correções de bugs e adições de recursos de particionamento, você pode obter o código-fonte do nosso repositório do GitHub. Para habilitar a particionamento, a compilação deve ser configurada com a opção `-DWITH_PARTITION_STORAGE_ENGINE`. Para obter mais informações sobre a compilação do MySQL, consulte Seção 2.8, “Instalando o MySQL a partir do código-fonte”. Se você tiver problemas para compilar uma compilação do MySQL 5.7 com particionamento, verifique o [Fórum de Partição do MySQL](https://forums.mysql.com/list.php?106) e peça ajuda lá, se não encontrar uma solução para o seu problema já postado.
