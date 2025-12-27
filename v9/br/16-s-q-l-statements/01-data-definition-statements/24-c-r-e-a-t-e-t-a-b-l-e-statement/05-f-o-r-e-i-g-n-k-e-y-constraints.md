#### 15.1.24.5 Restrições de Chave Estrangeira

O MySQL suporta chaves estrangeiras, que permitem a referência cruzada de dados relacionados entre tabelas, e restrições de chave estrangeira, que ajudam a manter os dados relacionados consistentes.

Uma relação de chave estrangeira envolve uma tabela pai que contém os valores iniciais das colunas, e uma tabela filho com valores de coluna que fazem referência aos valores das colunas pai. Uma restrição de chave estrangeira é definida na tabela filho.

A sintaxe essencial para definir uma restrição de chave estrangeira em uma declaração `CREATE TABLE` ou `ALTER TABLE` inclui o seguinte:

```
[CONSTRAINT [symbol]] FOREIGN KEY
    [index_name] (col_name, ...)
    REFERENCES tbl_name (col_name,...)
    [ON DELETE reference_option]
    [ON UPDATE reference_option]

reference_option:
    RESTRICT | CASCADE | SET NULL | NO ACTION | SET DEFAULT
```

O uso da restrição de chave estrangeira é descrito nos seguintes tópicos nesta seção:

* Identificadores
* Condições e Restrições
* Ações Referenciais
* Exemplos de Restrições de Chave Estrangeira
* Adicionando Restrições de Chave Estrangeira
* Excluindo Restrições de Chave Estrangeira
* Verificações de Chave Estrangeira
* Bloqueio
* Definições e Metadados de Chave Estrangeira
* Erros de Chave Estrangeira

##### Identificadores

O nome das restrições de chave estrangeira é regido pelas seguintes regras:

* O valor do *`CONSTRAINT` *`symbol`* é usado, se definido.

* Se a cláusula `CONSTRAINT` *`symbol`* não for definida, ou um símbolo não for incluído após a palavra-chave `CONSTRAINT`, um nome de restrição é gerado automaticamente.

* Se a cláusula `CONSTRAINT` *`symbol`* não for definida, ou um símbolo não for incluído após a palavra-chave `CONSTRAINT`, os motores de armazenamento `InnoDB` e `NDB` ignoram `FOREIGN_KEY index_name`.

* O valor `CONSTRAINT symbol`, se definido, deve ser único no banco de dados. Um símbolo duplicado resulta em um erro semelhante ao: ERROR 1005 (HY000): Can't create table 'test.fk1' (errno: 121).

* O NDB Cluster armazena nomes de chaves estrangeiras usando a mesma letra maiúscula com a qual são criados.

Os identificadores de tabela e coluna em uma cláusula `FOREIGN KEY ... REFERENCES` podem ser citados dentro de aspas duplas (` `). Alternativamente, aspas duplas (`"`) podem ser usadas se o modo `ANSI_QUOTES` do SQL estiver habilitado. A configuração da variável de sistema `lower_case_table_names` também é levada em consideração.

##### Condições e Restrições

As restrições de chave estrangeira estão sujeitas às seguintes condições e restrições:

* Tabelas pai e filho devem usar o mesmo mecanismo de armazenamento e não podem ser definidas como tabelas temporárias.

* A criação de uma restrição de chave estrangeira requer o privilégio `REFERENCES` na tabela pai.

* As colunas correspondentes na chave estrangeira e na chave referenciada devem ter tipos de dados semelhantes. *O tamanho e o sinal dos tipos de precisão fixa, como `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e `DECIMAL` - DECIMAL, NUMERIC") devem ser os mesmos*. O comprimento dos tipos de string não precisa ser o mesmo. Para colunas de string não binárias (caracteres), o conjunto de caracteres e a collation devem ser os mesmos.

* O MySQL suporta referências de chave estrangeira entre uma coluna e outra dentro de uma tabela. (Uma coluna não pode ter uma referência de chave estrangeira a si mesma.) Nesses casos, um "registro de tabela filho" refere-se a um registro dependente dentro da mesma tabela.

* O MySQL requer índices em chaves estrangeiras e chaves referenciadas para que as verificações de chave estrangeira possam ser rápidas e não exijam uma varredura da tabela. Na tabela de referência, deve haver um índice onde as colunas da chave estrangeira estão listadas como as colunas *primeiras* na mesma ordem. Tal índice é criado automaticamente na tabela de referência se ela não existir. Esse índice pode ser desativado silenciosamente mais tarde se você criar outro índice que possa ser usado para impor a restrição de chave estrangeira. *`index_name`*, se fornecido, é usado conforme descrito anteriormente.

* Anteriormente, o `InnoDB` permitia que uma chave estrangeira referenciasse qualquer coluna de índice ou grupo de colunas, mesmo um índice não único ou parcial, uma extensão do SQL padrão. Isso ainda é permitido para compatibilidade reversa, mas agora é desaconselhado; além disso, ele deve ser habilitado definindo `restrict_fk_on_non_standard_key`. Se isso for feito, ainda deve haver um índice na tabela referenciada onde as colunas referenciadas sejam as colunas *primeiras* na mesma ordem. Colunas ocultas que o `InnoDB` adiciona a um índice também são consideradas nesses casos (veja Seção 17.6.2.1, “Índices Agrupados e Secundários”). Você deve esperar que o suporte para o uso de chaves não padrão seja removido em uma versão futura do MySQL e migrar para o uso de chaves padrão.

`NDB` sempre requer uma chave explícita única (ou chave primária) em qualquer coluna referenciada como chave estrangeira.

* Prefixos de índice em colunas de chave estrangeira não são suportados. Consequentemente, colunas `BLOB` e `TEXT` não podem ser incluídas em uma chave estrangeira porque índices nessas colunas devem sempre incluir um comprimento de prefixo.

* O `InnoDB` atualmente não suporta chaves estrangeiras para tabelas com particionamento definido pelo usuário. Isso inclui tanto as tabelas pai quanto as tabelas filho.

Esta restrição não se aplica a tabelas `NDB` que são particionadas por `KEY` ou `LINEAR KEY` (os únicos tipos de particionamento definidos pelo usuário suportados pelo motor de armazenamento `NDB`); essas podem ter referências de chave estrangeira ou serem os alvos de tais referências.

* Uma tabela em uma relação de chave estrangeira não pode ser alterada para usar outro motor de armazenamento. Para alterar o motor de armazenamento, você deve primeiro descartar quaisquer restrições de chave estrangeira.

* Uma restrição de chave estrangeira não pode referenciar uma coluna gerada virtualmente.

Para obter informações sobre como a implementação do MySQL de restrições de chave estrangeira difere do padrão SQL, consulte a Seção 1.7.2.3, “Diferenças nas Restrições de Chave Estrangeira”.

##### Ações Referenciais

Quando uma operação de `UPDATE` ou `DELETE` afeta um valor de chave na tabela pai que tem linhas correspondentes na tabela filho, o resultado depende da *ação referencial* especificada pela cláusula `ON UPDATE` e `ON DELETE` da cláusula `FOREIGN KEY`. As ações referenciais incluem:

* `CASCADE`: Deletar ou atualizar a linha da tabela pai e deletar ou atualizar automaticamente as linhas correspondentes na tabela filho. Ambos os `ON DELETE CASCADE` e `ON UPDATE CASCADE` são suportados. Entre duas tabelas, não defina várias cláusulas `ON UPDATE CASCADE` que atuem na mesma coluna na tabela pai ou na tabela filho.

  Se uma cláusula `FOREIGN KEY` for definida em ambas as tabelas em uma relação de chave estrangeira, tornando ambas as tabelas pai e filho, uma cláusula `ON UPDATE CASCADE` ou `ON DELETE CASCADE` definida para uma cláusula `FOREIGN KEY` deve ser definida para a outra para que as operações em cascata sejam bem-sucedidas. Se uma cláusula `ON UPDATE CASCADE` ou `ON DELETE CASCADE` for definida apenas para uma cláusula `FOREIGN KEY`, as operações em cascata falham com um erro.

  Nota

  As ações de chave estrangeira em cascata não ativam gatilhos.

* `SET NULL`: Deletar ou atualizar a linha da tabela pai e definir a(s) coluna(s) da chave estrangeira na tabela filho para `NULL`. Ambas as cláusulas `ON DELETE SET NULL` e `ON UPDATE SET NULL` são suportadas.

  Se você especificar uma ação `SET NULL`, *assegure-se de que não declarou as colunas na tabela filho como `NOT NULL`*.

* `RESTRICT`: Rejeita a operação de exclusão ou atualização para a tabela pai. Especificar `RESTRICT` (ou `NO ACTION`) é o mesmo que omitir a cláusula `ON DELETE` ou `ON UPDATE`.

* `NO ACTION`: Uma palavra-chave do SQL padrão. Para `InnoDB`, isso é equivalente a `RESTRICT`; a operação de exclusão ou atualização para a tabela pai é rejeitada imediatamente se houver um valor de chave estrangeira relacionado na tabela referenciada. O `NDB` suporta verificações diferidas, e `NO ACTION` especifica uma verificação diferida; quando isso é usado, as verificações de restrição não são realizadas até o momento do commit. Note que, para tabelas `NDB`, isso faz com que todas as verificações de chave estrangeira feitas tanto para as tabelas pai quanto para a filha sejam diferidas.

* `SET DEFAULT`: Esta ação é reconhecida pelo analisador MySQL, mas tanto o `InnoDB` quanto o `NDB` rejeitam definições de tabela que contêm cláusulas `ON DELETE SET DEFAULT` ou `ON UPDATE SET DEFAULT`.

Para motores de armazenamento que suportam chaves estrangeiras, o MySQL rejeita qualquer operação `INSERT` ou `UPDATE` que tente criar um valor de chave estrangeira em uma tabela filha se não houver um valor de chave candidata correspondente na tabela pai.

Para um `ON DELETE` ou `ON UPDATE` que não é especificado, a ação padrão é sempre `NO ACTION`.

Como padrão, uma cláusula `ON DELETE NO ACTION` ou `ON UPDATE NO ACTION` especificada explicitamente não aparece na saída `SHOW CREATE TABLE` ou nas tabelas descarregadas com **mysqldump**. `RESTRICT`, que é uma palavra-chave não padrão equivalente, aparece na saída `SHOW CREATE TABLE` e nas tabelas descarregadas com **mysqldump**.

Para tabelas `NDB`, o `ON UPDATE CASCADE` não é suportado quando a referência é à chave primária da tabela pai.

Para tabelas `NDB`, o `ON DELETE CASCADE` não é suportado quando a tabela filha contém uma ou mais colunas de qualquer um dos tipos `TEXT` ou `BLOB`. (Bug #89511, Bug
#27484882)

O `InnoDB` executa operações em cascata usando um algoritmo de busca de primeira passagem nos registros do índice que corresponde à restrição de chave estrangeira.

Uma restrição de chave estrangeira em uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE`, nem pode usar `SET NULL` ou `SET DEFAULT` como ações referenciais `ON DELETE`.

Uma restrição de chave estrangeira na coluna base de uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE` ou `ON DELETE`.

##### Exemplos de Restrições de Chave Estrangeira

Este exemplo simples relaciona as tabelas `parent` e `child` por meio de uma chave estrangeira de uma única coluna:

```
CREATE TABLE parent (
    id INT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE child (
    id INT,
    parent_id INT,
    INDEX par_ind (parent_id),
    FOREIGN KEY (parent_id)
        REFERENCES parent(id)
        ON DELETE CASCADE
) ENGINE=INNODB;
```

O MySQL 9.5 suporta cláusulas `REFERENCE` inline, bem como chaves primárias de tabela pai implícitas, então a segunda instrução `CREATE TABLE` pode ser reescrita como mostrado aqui:

```
CREATE TABLE child (
    id INT,
    parent_id INT NOT NULL REFERENCES parent ON DELETE CASCADE,
    INDEX par_ind (parent_id)
) ENGINE=INNODB;
```

Este é um exemplo mais complexo em que uma tabela `product_order` tem chaves estrangeiras para outras duas tabelas. Uma chave estrangeira referencia um índice de duas colunas na tabela `product`. A outra referencia um índice de uma coluna na tabela `customer`:

```
CREATE TABLE product (
    category INT NOT NULL, id INT NOT NULL,
    price DECIMAL,
    PRIMARY KEY(category, id)
)   ENGINE=INNODB;

CREATE TABLE customer (
    id INT NOT NULL,
    PRIMARY KEY (id)
)   ENGINE=INNODB;

CREATE TABLE product_order (
    no INT NOT NULL AUTO_INCREMENT,
    product_category INT NOT NULL,
    product_id INT NOT NULL,
    customer_id INT NOT NULL,

    PRIMARY KEY(no),
    INDEX (product_category, product_id),
    INDEX (customer_id),

    FOREIGN KEY (product_category, product_id)
      REFERENCES product(category, id)
      ON UPDATE CASCADE ON DELETE RESTRICT,

    FOREIGN KEY (customer_id)
      REFERENCES customer(id)
)   ENGINE=INNODB;
```

##### Adicionando Restrições de Chave Estrangeira

Você pode adicionar uma restrição de chave estrangeira a uma tabela existente usando a seguinte sintaxe `ALTER TABLE`:

```
ALTER TABLE tbl_name
    ADD [CONSTRAINT [symbol]] FOREIGN KEY
    [index_name] (col_name, ...)
    REFERENCES tbl_name (col_name,...)
    [ON DELETE reference_option]
    [ON UPDATE reference_option]
```

A chave estrangeira pode ser autoreferencial (referenciando a mesma tabela). Quando você adiciona uma restrição de chave estrangeira a uma tabela usando `ALTER TABLE`, *lembre-se de criar primeiro um índice nas colunas referenciadas pela chave estrangeira.*

##### Removendo Restrições de Chave Estrangeira

Você pode remover uma restrição de chave estrangeira usando a seguinte sintaxe `ALTER TABLE`:

```
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol;
```

Se a cláusula `FOREIGN KEY` definiu um nome de `CONSTRAINT` quando você criou a restrição, você pode referenciar esse nome para descartar a restrição de chave estrangeira. Caso contrário, um nome de restrição foi gerado internamente, e você deve usar esse valor. Para determinar o nome da restrição de chave estrangeira, use `SHOW CREATE TABLE`:

```
mysql> SHOW CREATE TABLE child\G
*************************** 1. row ***************************
       Table: child
Create Table: CREATE TABLE `child` (
  `id` int DEFAULT NULL,
  `parent_id` int NOT NULL,
  KEY `par_ind` (`parent_id`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
  REFERENCES `parent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

mysql> ALTER TABLE child DROP FOREIGN KEY `child_ibfk_1`;
```

A adição e o descarte de uma chave estrangeira na mesma instrução `ALTER TABLE` são suportados para `ALTER TABLE ... ALGORITHM=INPLACE`. Não é suportado para `ALTER TABLE ... ALGORITHM=COPY`.

##### Verificação de Chave Estrangeira

Em MySQL, as tabelas InnoDB e NDB suportam a verificação de restrições de chave estrangeira. A verificação de chave estrangeira é controlada pela variável `foreign_key_checks`, que é habilitada por padrão. Normalmente, você deixa essa variável habilitada durante o funcionamento normal para impor a integridade referencial. A variável `foreign_key_checks` tem o mesmo efeito em tabelas `NDB` quanto em tabelas `InnoDB`.

A variável `foreign_key_checks` é dinâmica e suporta escopos globais e de sessão. Para obter informações sobre o uso de variáveis de sistema, consulte a Seção 7.1.9, “Usando Variáveis de Sistema”.

Desabilitar a verificação de chave estrangeira é útil quando:

* Descartar uma tabela que é referenciada por uma restrição de chave estrangeira. Uma tabela referenciada só pode ser descartada após a desabilitação de `foreign_key_checks`. Ao descartar uma tabela, as restrições definidas na tabela também são descartadas.

* Recarregar tabelas em uma ordem diferente da exigida por suas relações de chave estrangeira. Por exemplo, o **mysqldump** produz definições corretas das tabelas no arquivo de dump, incluindo restrições de chave estrangeira para tabelas filhas. Para facilitar o recarregamento de arquivos de dump para tabelas com relações de chave estrangeira, o **mysqldump** inclui automaticamente uma declaração na saída do dump que desabilita `foreign_key_checks`. Isso permite que você importe as tabelas em qualquer ordem, caso o arquivo de dump contenha tabelas que não estejam corretamente ordenadas para chaves estrangeiras. Desabilitar `foreign_key_checks` também acelera a operação de importação, evitando verificações de chave estrangeira.

* Executar operações `LOAD DATA`, para evitar verificações de chave estrangeira.

* Realizar uma operação `ALTER TABLE` em uma tabela que tenha uma relação de chave estrangeira.

Quando `foreign_key_checks` é desativado, as restrições de chave estrangeira são ignoradas, com as seguintes exceções:

* Recriar uma tabela que foi previamente excluída retorna um erro se a definição da tabela não atender às restrições de chave estrangeira que referenciam a tabela. A tabela deve ter os nomes e tipos de coluna corretos. Também deve ter índices nas chaves referenciadas. Se esses requisitos não forem atendidos, o MySQL retorna o Erro 1005 que se refere ao errno: 150 na mensagem de erro, o que significa que uma restrição de chave estrangeira não foi formada corretamente.

* Alterar uma tabela retorna um erro (errno: 150) se uma definição de chave estrangeira for incorretamente formada para a tabela alterada.

* Excluir um índice exigido por uma restrição de chave estrangeira. A restrição de chave estrangeira deve ser removida antes de excluir o índice.

* Criar uma restrição de chave estrangeira onde uma coluna referencia um tipo de coluna não correspondente.

Desabilitar `foreign_key_checks` tem essas implicações adicionais:

* É permitido excluir um banco de dados que contenha tabelas com chaves estrangeiras referenciadas por tabelas externas ao banco de dados.

* É permitido excluir uma tabela com chaves estrangeiras referenciadas por outras tabelas.

* Ativação de `foreign_key_checks` não desencadeia uma varredura dos dados da tabela, o que significa que as linhas adicionadas a uma tabela enquanto `foreign_key_checks` está desativado não são verificadas para consistência quando `foreign_key_checks` é reativado.

##### Bloqueio

O MySQL estende os bloqueios de metadados, conforme necessário, para tabelas relacionadas por uma restrição de chave estrangeira. A extensão dos bloqueios de metadados impede que operações DML e DDL conflitantes sejam executadas simultaneamente em tabelas relacionadas. Essa funcionalidade também permite atualizações do metadados de chave estrangeira quando uma tabela pai é modificada. Em versões anteriores do MySQL, os metadados de chave estrangeira, que são de propriedade da tabela filho, não podiam ser atualizados com segurança.

Se uma tabela for bloqueada explicitamente com `LOCK TABLES`, quaisquer tabelas relacionadas por uma restrição de chave estrangeira são abertas e bloqueadas implicitamente. Para verificações de chave estrangeira, um bloqueio de leitura compartilhado (`LOCK TABLES READ`) é tomado em tabelas relacionadas. Para atualizações em cascata, um bloqueio de escrita sem nada compartilhado (`LOCK TABLES WRITE`) é tomado em tabelas relacionadas que estão envolvidas na operação.

##### Definições e Metadados de Chave Estrangeira

Para visualizar uma definição de chave estrangeira, use `SHOW CREATE TABLE`:

```
mysql> SHOW CREATE TABLE child\G
*************************** 1. row ***************************
       Table: child
Create Table: CREATE TABLE `child` (
  `id` int DEFAULT NULL,
  `parent_id` int NOT NULL,
  KEY `par_ind` (`parent_id`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
  REFERENCES `parent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

Você pode obter informações sobre chaves estrangeiras da tabela `KEY_COLUMN_USAGE` do Schema de Informações. Um exemplo de consulta para essa tabela é mostrado aqui:

```
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
       WHERE REFERENCED_TABLE_SCHEMA IS NOT NULL;
+--------------+------------+-------------+-----------------+
| TABLE_SCHEMA | TABLE_NAME | COLUMN_NAME | CONSTRAINT_NAME |
+--------------+------------+-------------+-----------------+
| test         | child      | parent_id   | child_ibfk_1    |
+--------------+------------+-------------+-----------------+
```

Você pode obter informações específicas sobre chaves estrangeiras de `InnoDB` das tabelas `INNODB_FOREIGN` e `INNODB_FOREIGN_COLS`. Exemplos de consultas são mostrados aqui:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN \G
*************************** 1. row ***************************
      ID: test/child_ibfk_1
FOR_NAME: test/child
REF_NAME: test/parent
  N_COLS: 1
    TYPE: 1

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN_COLS \G
*************************** 1. row ***************************
          ID: test/child_ibfk_1
FOR_COL_NAME: parent_id
REF_COL_NAME: id
         POS: 0
```

##### Erros de Chave Estrangeira

Em caso de erro de chave estrangeira envolvendo tabelas `InnoDB` (geralmente o erro 150 no MySQL Server), as informações sobre o último erro de chave estrangeira podem ser obtidas verificando a saída de `SHOW ENGINE INNODB STATUS`.

```
mysql> SHOW ENGINE INNODB STATUS\G
...
------------------------
LATEST FOREIGN KEY ERROR
------------------------
2018-04-12 14:57:24 0x7f97a9c91700 Transaction:
TRANSACTION 7717, ACTIVE 0 sec inserting
mysql tables in use 1, locked 1
4 lock struct(s), heap size 1136, 3 row lock(s), undo log entries 3
MySQL thread id 8, OS thread handle 140289365317376, query id 14 localhost root update
INSERT INTO child VALUES (NULL, 1), (NULL, 2), (NULL, 3), (NULL, 4), (NULL, 5), (NULL, 6)
Foreign key constraint fails for table `test`.`child`:
,
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`id`) ON DELETE
  CASCADE ON UPDATE CASCADE
Trying to add in child table, in index par_ind tuple:
DATA TUPLE: 2 fields;
 0: len 4; hex 80000003; asc     ;;
 1: len 4; hex 80000003; asc     ;;

But in parent table `test`.`parent`, in index PRIMARY,
the closest match we can find is record:
PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 80000004; asc     ;;
 1: len 6; hex 000000001e19; asc       ;;
 2: len 7; hex 81000001110137; asc       7;;
...
```

Aviso

Se um usuário tiver privilégios de nível de tabela para todas as tabelas pai, os erros `ER_NO_REFERENCED_ROW_2` e `ER_ROW_IS_REFERENCED_2` para operações de chave estrangeira exibem informações sobre as tabelas pai. Se um usuário não tiver privilégios de nível de tabela para todas as tabelas pai, mensagens de erro mais genéricas são exibidas em vez disso (`ER_NO_REFERENCED_ROW` e `ER_ROW_IS_REFERENCED`).

Uma exceção é que, para programas armazenados definidos para executar com privilégios `DEFINER`, o usuário contra o qual os privilégios são avaliados é o usuário na cláusula `DEFINER` do programa, e não o usuário que está invocando. Se esse usuário tiver privilégios de nível de tabela para as tabelas pai, as informações da tabela pai ainda são exibidas. Neste caso, é responsabilidade do criador do programa armazenado ocultar as informações, incluindo manipuladores de condição apropriados.