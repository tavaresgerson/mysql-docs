# Capítulo 22 Particionamento

**Índice**

22.1 Visão Geral do Partitioning no MySQL

22.2 Tipos de Partitioning :   22.2.1 Partitioning por RANGE (Intervalo)

    22.2.2 Partitioning por LISTA

    22.2.3 Partitioning por COLUMNS

    22.2.4 Partitioning por HASH

    22.2.5 Partitioning por KEY (Chave)

    22.2.6 Subpartitioning

    22.2.7 Como o Partitioning do MySQL Lida com NULL

22.3 Gerenciamento de Partition :   22.3.1 Gerenciamento de Partitions RANGE e LIST

    22.3.2 Gerenciamento de Partitions HASH e KEY

    22.3.3 Trocando Partitions e Subpartitions com Tabelas

    22.3.4 Manutenção de Partitions

    22.3.5 Obtendo Informações sobre Partitions

22.4 Partition Pruning (Poda de Partition)

22.5 Seleção de Partition

22.6 Restrições e Limitações no Partitioning :   22.6.1 Chaves de Partitioning, Primary Keys e Unique Keys

    22.6.2 Limitações de Partitioning Relacionadas a Storage Engines

    22.6.3 Limitações de Partitioning Relacionadas a Funções

    22.6.4 Partitioning e Locking

Este capítulo aborda a implementação do MySQL de partitioning definido pelo usuário.

Nota

A partir do MySQL 5.7.17, o handler de partitioning genérico no MySQL Server está depreciado e será removido no MySQL 8.0, quando se espera que o storage engine usado para uma determinada tabela forneça seu próprio handler de partitioning ("nativo"). Atualmente, apenas os storage engines `InnoDB` e `NDB` fazem isso.

O uso de tabelas com partitioning não nativo resulta em um aviso `ER_WARN_DEPRECATED_SYNTAX`. No MySQL 5.7.17 até 5.7.20, o Server executa automaticamente um check na inicialização para identificar tabelas que usam partitioning não nativo; para quaisquer que sejam encontradas, o Server escreve uma mensagem em seu error log. Para desabilitar este check, use a opção `--disable-partition-engine-check`. No MySQL 5.7.21 e posteriores, este check *não* é executado; nessas versões, você deve iniciar o Server com `--disable-partition-engine-check=false`, se desejar que o Server verifique se há tabelas usando o handler de partitioning genérico (Bug #85830, Bug #25846957).

Para se preparar para a migração para o MySQL 8.0, qualquer tabela com partitioning não nativo deve ser alterada para usar um engine que forneça partitioning nativo, ou deve ser tornada não-partitioned. Por exemplo, para alterar uma tabela para `InnoDB`, execute esta instrução:

```sql
ALTER TABLE table_name ENGINE = INNODB;
```

Você pode determinar se o seu MySQL Server suporta partitioning verificando a saída da instrução `SHOW PLUGINS`, assim:

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

Você também pode verificar a tabela Information Schema `PLUGINS` com uma Query semelhante a esta:

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

Em ambos os casos, se você não vir o plugin `partition` listado com o valor `ACTIVE` para a coluna `Status` na saída (mostrado em negrito em cada um dos exemplos acima), então sua versão do MySQL não foi construída com suporte a partitioning.

Os binários do MySQL 5.7 Community fornecidos pela Oracle incluem suporte a partitioning. Para obter informações sobre o suporte a partitioning oferecido nos binários do MySQL Enterprise Edition, consulte Chapter 28, *MySQL Enterprise Edition*.

Para habilitar o partitioning se você estiver compilando o MySQL 5.7 a partir do código-fonte, a build deve ser configurada com a opção `-DWITH_PARTITION_STORAGE_ENGINE`. Para mais informações, consulte Section 2.8, “Installing MySQL from Source”.

Se seu binário MySQL for construído com suporte a partitioning, nada mais precisa ser feito para habilitá-lo (por exemplo, nenhuma entrada especial é necessária no seu arquivo `my.cnf`).

Se você deseja desabilitar o suporte a partitioning, você pode iniciar o MySQL Server com a opção `--skip-partition`. Quando o suporte a partitioning é desabilitado, você pode ver quaisquer tabelas partitioned existentes e descartá-las (embora fazer isso não seja aconselhável), mas você não pode manipulá-las ou acessar seus dados de outra forma.

Consulte Section 22.1, “Overview of Partitioning in MySQL”, para uma introdução aos conceitos de partitioning e partitioning.

O MySQL suporta vários tipos de partitioning, bem como subpartitioning; consulte Section 22.2, “Partitioning Types”, e Section 22.2.6, “Subpartitioning”.

Section 22.3, “Partition Management”, cobre métodos para adicionar, remover e alterar partitions em tabelas partitioned existentes.

Section 22.3.4, “Maintenance of Partitions”, discute comandos de manutenção de tabela para uso com tabelas partitioned.

A tabela `PARTITIONS` no Database `INFORMATION_SCHEMA` fornece informações sobre partitions e tabelas partitioned. Consulte Section 24.3.16, “The INFORMATION_SCHEMA PARTITIONS Table”, para mais informações; para alguns exemplos de Queries contra esta tabela, consulte Section 22.2.7, “How MySQL Partitioning Handles NULL”.

Para problemas conhecidos com partitioning no MySQL 5.7, consulte Section 22.6, “Restrictions and Limitations on Partitioning”.

Você também pode achar os seguintes recursos úteis ao trabalhar com tabelas partitioned.

**Recursos Adicionais.** Outras fontes de informação sobre partitioning definido pelo usuário no MySQL incluem o seguinte:

* [Fórum de Partitioning do MySQL](https://forums.mysql.com/list.php?106)

  Este é o fórum de discussão oficial para aqueles interessados ou que estão experimentando a tecnologia MySQL Partitioning. Ele apresenta anúncios e atualizações de desenvolvedores MySQL e outros. É monitorado por membros das Equipes de Desenvolvimento e Documentação de Partitioning.

* PlanetMySQL

  Um site de notícias MySQL que apresenta blogs relacionados ao MySQL, que deve ser de interesse para qualquer pessoa que use o MySQL. Encorajamos você a verificar aqui links para blogs mantidos por aqueles que trabalham com MySQL Partitioning, ou para ter seu próprio blog adicionado àqueles cobertos.

Os binários do MySQL 5.7 estão disponíveis em <https://dev.mysql.com/downloads/mysql/5.7.html>. No entanto, para as correções de Bug e adições de recursos de partitioning mais recentes, você pode obter o código-fonte em nosso repositório GitHub. Para habilitar o partitioning, a build deve ser configurada com a opção `-DWITH_PARTITION_STORAGE_ENGINE`. Para mais informações sobre como construir o MySQL, consulte Section 2.8, “Installing MySQL from Source”. Se você tiver problemas ao compilar uma build do MySQL 5.7 com partitioning habilitado, verifique o [Fórum de Partitioning do MySQL](https://forums.mysql.com/list.php?106) e peça assistência lá se não encontrar uma solução para o seu problema já publicada.