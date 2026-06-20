# Capítulo 22 Partição

Este capítulo discute a implementação da partição definida pelo usuário do MySQL.

Nota

A partir do MySQL 5.7.17, o manipulador de particionamento genérico no servidor MySQL é descontinuado e é removido no MySQL 8.0, quando o mecanismo de armazenamento usado para uma tabela específica é esperado para fornecer seu próprio manipulador de particionamento (“nativo”). Atualmente, apenas os mecanismos de armazenamento `InnoDB` e `NDB` fazem isso.

O uso de tabelas com particionamento não nativo resulta em um aviso `ER_WARN_DEPRECATED_SYNTAX`. No MySQL 5.7.17 a 5.7.20, o servidor realiza automaticamente uma verificação no início para identificar tabelas que usam particionamento não nativo; para quaisquer que sejam encontradas, o servidor escreve uma mensagem em seu log de erro. Para desabilitar essa verificação, use a opção `--disable-partition-engine-check`. No MySQL 5.7.21 e posterior, essa verificação *não* é realizada; nessas versões, você deve iniciar o servidor com `--disable-partition-engine-check=false`, se desejar que o servidor verifique tabelas que usam o manipulador de particionamento genérico (Bug #85830, Bug #25846957).

Para se preparar para a migração para o MySQL 8.0, qualquer tabela com particionamento não nativo deve ser alterada para usar um motor que forneça particionamento nativo, ou ser feita sem particionamento. Por exemplo, para alterar uma tabela para `InnoDB`, execute esta declaração:

```sql
ALTER TABLE table_name ENGINE = INNODB;
```

Você pode determinar se seu servidor MySQL suporta particionamento verificando a saída da declaração `SHOW PLUGINS`, da seguinte forma:

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

Em qualquer caso, se você não ver o plugin `partition` listado com o valor `ACTIVE` para a coluna `Status` no resultado (mostrado em texto em negrito em cada um dos exemplos dados anteriormente), então sua versão do MySQL não foi construída com suporte a particionamento.

Os binários da Comunidade do MySQL 5.7 fornecidos pela Oracle incluem suporte para particionamento. Para informações sobre o suporte para particionamento oferecido nos binários da Edição Empresarial do MySQL, consulte o Capítulo 28, *MySQL Edição Empresarial*.

Para habilitar a partição se você estiver compilando o MySQL 5.7 a partir de fonte, a compilação deve ser configurada com a opção `-DWITH_PARTITION_STORAGE_ENGINE`. Para mais informações, consulte a Seção 2.8, “Instalando o MySQL a partir de fonte”.

Se o binário do MySQL foi construído com suporte a partição, nada mais precisa ser feito para ativá-lo (por exemplo, não são necessárias entradas especiais no seu arquivo `my.cnf`).

Se você deseja desabilitar o suporte de particionamento, pode iniciar o MySQL Server com a opção `--skip-partition`. Quando o suporte de particionamento é desativado, você pode ver todas as tabelas particionadas existentes e excluí-las (embora isso não seja aconselhável), mas não pode manipulá-las ou acessar seus dados de outra forma.

Veja a Seção 22.1, “Visão geral da partição no MySQL”, para uma introdução aos conceitos de partição e partição.

O MySQL suporta vários tipos de particionamento, bem como subparticionamento; veja a Seção 22.2, “Tipos de particionamento”, e a Seção 22.2.6, “Subparticionamento”.

A Seção 22.3, “Gestão de Partições”, abrange métodos para adicionar, remover e alterar partições em tabelas particionadas existentes.

A Seção 22.3.4, “Manutenção de Partições”, discute comandos de manutenção de tabelas para uso com tabelas particionadas.

A tabela `PARTITIONS` no banco de dados `INFORMATION_SCHEMA` fornece informações sobre partições e tabelas particionadas. Consulte a Seção 24.3.16, “A tabela INFORMATION_SCHEMA PARTITIONS”, para obter mais informações; para alguns exemplos de consultas contra esta tabela, consulte a Seção 22.2.7, “Como o MySQL de Partição lida com NULL”.

Para questões conhecidas sobre particionamento no MySQL 5.7, consulte a Seção 22.6, “Restrições e Limitações sobre Particionamento”.

Você também pode achar que os recursos a seguir são úteis ao trabalhar com tabelas particionadas.

**Recursos adicionais.** Outras fontes de informações sobre partição definida pelo usuário no MySQL incluem as seguintes:

* [Fórum de Partição MySQL][(https://forums.mysql.com/list.php?106)]

Este é o fórum de discussão oficial para aqueles interessados ou que estão experimentando a tecnologia de Partição MySQL. Ele apresenta anúncios e atualizações dos desenvolvedores do MySQL e outros. É monitorado por membros das equipes de Desenvolvimento e Documentação de Partição.

* PlanetMySQL

Um site de notícias do MySQL que apresenta blogs relacionados ao MySQL, que deve ser de interesse para qualquer pessoa que use o meu MySQL. Incentivamos você a verificar aqui os links para blogs mantidos por aqueles que trabalham com Partição do MySQL, ou para ter seu próprio blog adicionado aos que são cobertos.

Os binários do MySQL 5.7 estão disponíveis em <https://dev.mysql.com/downloads/mysql/5.7.html>. No entanto, para as últimas correções de bugs e adições de recursos de particionamento, você pode obter a fonte em nosso repositório do GitHub. Para habilitar a particionamento, a compilação deve ser configurada com a opção `-DWITH_PARTITION_STORAGE_ENGINE`. Para mais informações sobre a compilação do MySQL, consulte a Seção 2.8, “Instalando MySQL a partir da fonte”. Se você tiver problemas para compilar uma compilação de MySQL com particionamento habilitado, verifique o [Fórum de Particionamento do MySQL][(https://forums.mysql.com/list.php?106)] e peça assistência lá, se você não encontrar uma solução para o seu problema já postado.