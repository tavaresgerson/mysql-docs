#### 13.1.18.5 Restrições de Chave Estrangeira

O MySQL suporta chaves estrangeiras, que permitem a referência cruzada de dados relacionados entre tabelas, e restrições de chave estrangeira, que ajudam a manter os dados relacionados consistentes.

Uma relação de chave estrangeira envolve uma tabela pai que contém os valores iniciais da coluna e uma tabela filho com valores de coluna que fazem referência aos valores da coluna pai. Uma restrição de chave estrangeira é definida na tabela filho.

A sintaxe essencial para definir uma restrição de chave estrangeira em uma instrução `CREATE TABLE` ou `ALTER TABLE` inclui o seguinte:

```sql
[CONSTRAINT [symbol FOREIGN KEY
    [index_name] (col_name, ...)
    REFERENCES tbl_name (col_name,...)
    [ON DELETE reference_option]
    [ON UPDATE reference_option]

reference_option:
    RESTRICT | CASCADE | SET NULL | NO ACTION | SET DEFAULT
```

O uso de restrições de chave estrangeira é descrito nos seguintes tópicos desta seção:

- Identificadores
- Condições e Restrições
- Ações Referenciais
- Exemplos de restrições de chave estrangeira
- Adicionar restrições de chave estrangeira
- Excluir restrições de chave estrangeira
- Verificação de Chaves Estrangeiras
- Definições de Chaves Estrangeiras e Metadados
- Erros de Chave Estrangeira

##### Identificador(es)

A nomenclatura das restrições de chave estrangeira é regida pelas seguintes regras:

- O valor do símbolo `CONSTRAINT` *`symbol`* é usado, se definido.

- Se a cláusula `CONSTRAINT` *`símbolo`* não for definida ou se um símbolo não for incluído após a palavra-chave `CONSTRAINT`:

  - Para as tabelas do InnoDB, um nome de restrição é gerado automaticamente.

  - Para as tabelas `NDB`, o valor `FOREIGN KEY *` `index_name`\* é usado, se definido. Caso contrário, um nome de restrição é gerado automaticamente.

- O valor do símbolo `CONSTRAINT`, se definido, deve ser único no banco de dados. Um símbolo *duplicado* resulta em um erro semelhante ao seguinte: ERRO 1005 (HY000): Não é possível criar a tabela 'test.fk1' (erro de número 121).

Os identificadores de tabela e coluna em uma cláusula `FOREIGN KEY ... REFERENCES` podem ser citados dentro de aspas duplas (\`\`\`). Alternativamente, aspas duplas (`"`) podem ser usadas se o modo SQL `ANSI_QUOTES` estiver habilitado. A configuração da variável de sistema `lower_case_table_names` também é levada em consideração.

##### Condições e Restrições

As restrições de chave estrangeira estão sujeitas às seguintes condições e restrições:

- As tabelas pai e filho devem usar o mesmo mecanismo de armazenamento e não podem ser definidas como tabelas temporárias.

- Para criar uma restrição de chave estrangeira, é necessário o privilégio `REFERENCES` na tabela pai.

- As colunas correspondentes na chave estrangeira e na chave referenciada devem ter tipos de dados semelhantes. *O tamanho e o sinal dos tipos de precisão fixa, como `INTEGER` e `DECIMAL`, devem ser os mesmos*. O comprimento dos tipos de string não precisa ser o mesmo. Para colunas de string não binárias (caracteres), o conjunto de caracteres e a ordenação devem ser os mesmos.

- O MySQL suporta referências de chave estrangeira entre uma coluna e outra dentro de uma tabela. (Uma coluna não pode ter uma referência de chave estrangeira para si mesma.) Nesses casos, um "registro de tabela filho" refere-se a um registro dependente na mesma tabela.

- O MySQL requer índices em chaves estrangeiras e chaves referenciadas para que as verificações de chave estrangeira possam ser rápidas e não exijam uma varredura da tabela. Na tabela de referência, deve haver um índice onde as colunas da chave estrangeira estejam listadas como as *primeiras* colunas na mesma ordem. Esse índice é criado automaticamente na tabela de referência se ela não existir. Esse índice pode ser removido silenciosamente mais tarde se você criar outro índice que possa ser usado para impor a restrição de chave estrangeira. *`index_name`*, se fornecido, é usado conforme descrito anteriormente.

- O `InnoDB` permite que uma chave estrangeira faça referência a qualquer coluna de índice ou grupo de colunas. No entanto, na tabela referenciada, deve haver um índice onde as colunas referenciadas sejam as *primeiras* colunas na mesma ordem. As colunas ocultas que o `InnoDB` adiciona a um índice também são consideradas (veja Seção 14.6.2.1, “Indekses Clusterizados e Secundários”).

  O `NDB` exige uma chave única explícita (ou chave primária) em qualquer coluna referenciada como chave estrangeira. O `InnoDB` não exige isso, o que é uma extensão do SQL padrão.

- Os prefixos de índice em colunas de chave estrangeira não são suportados. Consequentemente, as colunas `BLOB` e `TEXT` não podem ser incluídas em uma chave estrangeira porque os índices nessas colunas devem sempre incluir um comprimento de prefixo.

- O `InnoDB` atualmente não suporta chaves estrangeiras para tabelas com particionamento definido pelo usuário. Isso inclui tanto as tabelas pai quanto as tabelas filho.

  Essa restrição não se aplica às tabelas `NDB` que são particionadas por `KEY` ou `LINEAR KEY` (os únicos tipos de particionamento de usuário suportados pelo motor de armazenamento `NDB`); essas podem ter referências de chave estrangeira ou serem os alvos dessas referências.

- Uma tabela em uma relação de chave estrangeira não pode ser alterada para usar outro mecanismo de armazenamento. Para alterar o mecanismo de armazenamento, você deve primeiro descartar quaisquer restrições de chave estrangeira.

- Uma restrição de chave estrangeira não pode referenciar uma coluna gerada virtualmente.

- Antes da versão 5.7.16, uma restrição de chave estrangeira não pode referenciar um índice secundário definido em uma coluna gerada virtualmente.

Para obter informações sobre como a implementação do MySQL de restrições de chave estrangeira difere do padrão SQL, consulte Seção 1.6.2.3, “Diferenças nas Restrições FOREIGN KEY”.

##### Ações Referenciais

Quando uma operação de `UPDATE` ou `DELETE` afeta um valor de chave na tabela pai que tem linhas correspondentes na tabela filho, o resultado depende da ação referencial especificada pelos subcláusulas `ON UPDATE` e `ON DELETE` da cláusula `FOREIGN KEY`. As ações referenciais incluem:

- `CASCADE`: Exclua ou atualize a linha da tabela pai e exclua ou atualize automaticamente as linhas correspondentes na tabela filho. Ambos os `ON DELETE CASCADE` e `ON UPDATE CASCADE` são suportados. Entre duas tabelas, não defina várias cláusulas `ON UPDATE CASCADE` que atuem na mesma coluna na tabela pai ou na tabela filho.

  Se uma cláusula `FOREIGN KEY` for definida em ambas as tabelas em uma relação de chave estrangeira, tornando ambas as tabelas pai e filho, uma subcláusula `ON UPDATE CASCADE` ou `ON DELETE CASCADE` definida para uma cláusula `FOREIGN KEY` deve ser definida para a outra para que as operações em cascata sejam bem-sucedidas. Se uma subcláusula `ON UPDATE CASCADE` ou `ON DELETE CASCADE` for definida apenas para uma cláusula `FOREIGN KEY`, as operações em cascata falharão com um erro.

  Nota

  As ações de chave estrangeira em cascata não ativam gatilhos.

- `SET NULL`: Exclua ou atualize a linha da tabela pai e defina a(s) coluna(s) da chave estrangeira na tabela filha para `NULL`. As cláusulas `ON DELETE SET NULL` e `ON UPDATE SET NULL` são suportadas.

  Se você especificar uma ação `SET NULL`, *tenha certeza de que não declarou as colunas da tabela filha como `NOT NULL`*.

- `RESTRICT`: Rejeita a operação de exclusão ou atualização para a tabela pai. Especificar `RESTRICT` (ou `NO ACTION`) é o mesmo que omitir a cláusula `ON DELETE` ou `ON UPDATE`.

- `NO ACTION`: Uma palavra-chave do SQL padrão. Para o `InnoDB`, isso é equivalente a `RESTRICT`; a operação de exclusão ou atualização para a tabela pai é imediatamente rejeitada se houver um valor de chave estrangeira relacionada na tabela referenciada. O `NDB` suporta verificações diferidas, e `NO ACTION` especifica uma verificação diferida; quando isso é usado, as verificações de restrição não são realizadas até o momento do commit. Note que, para tabelas `NDB`, isso faz com que todas as verificações de chave estrangeira feitas tanto para as tabelas pai quanto para as tabelas filho sejam diferidas.

- `SET DEFAULT`: Esta ação é reconhecida pelo analisador MySQL, mas tanto o `InnoDB` quanto o `NDB` rejeitam definições de tabelas que contêm cláusulas `ON DELETE SET DEFAULT` ou `ON UPDATE SET DEFAULT`.

Para os motores de armazenamento que suportam chaves estrangeiras, o MySQL rejeita qualquer operação de `INSERT` ou `UPDATE` que tente criar um valor de chave estrangeira em uma tabela filha se não houver um valor de chave candidata correspondente na tabela pai.

Para uma ação `ON DELETE` ou `ON UPDATE` que não seja especificada, a ação padrão é sempre `RESTRICT`.

Para tabelas de `NDB`, o `ON UPDATE CASCADE` não é suportado quando a referência é à chave primária da tabela pai.

A partir da NDB 7.5.14 e da NDB 7.6.10: Para as tabelas `NDB` (`mysql-cluster.html`), o `ON DELETE CASCADE` não é suportado quando a tabela filha contém uma ou mais colunas de qualquer um dos tipos `TEXT` (`blob.html`) ou `BLOB` (`blob.html`). (Bug #89511, Bug #27484882)

O `InnoDB` executa operações em cascata usando um algoritmo de busca em primeira instância nos registros do índice que corresponde à restrição de chave estrangeira.

Uma restrição de chave estrangeira em uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE`, nem pode usar `SET NULL` ou `SET DEFAULT` como ações referenciais `ON DELETE`.

Uma restrição de chave estrangeira na coluna base de uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE` ou `ON DELETE`.

No MySQL 5.7.13 e versões anteriores, o `InnoDB` não permite definir uma restrição de chave estrangeira com uma ação de referência em cascata na coluna base de uma coluna virtual gerada com índice. Essa restrição é removida no MySQL 5.7.14.

No MySQL 5.7.13 e versões anteriores, o `InnoDB` não permite definir ações de referência em cascata em colunas de chave estrangeira não virtual que estejam explicitamente incluídas em um índice virtual. Essa restrição é removida no MySQL 5.7.14.

##### Exemplos de restrição de chave estrangeira

Este exemplo simples relaciona as tabelas `parent` e `child` por meio de uma chave estrangeira de uma única coluna:

```sql
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

Este é um exemplo mais complexo, no qual uma tabela `product_order` possui chaves estrangeiras para duas outras tabelas. Uma chave estrangeira faz referência a um índice de duas colunas na tabela `product`. A outra faz referência a um índice de uma coluna na tabela `customer`:

```sql
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

##### Adicionar restrições de chave estrangeira

Você pode adicionar uma restrição de chave estrangeira a uma tabela existente usando a seguinte sintaxe de `ALTER TABLE` (alter-table.html):

```sql
ALTER TABLE tbl_name
    ADD [CONSTRAINT [symbol FOREIGN KEY
    [index_name] (col_name, ...)
    REFERENCES tbl_name (col_name,...)
    [ON DELETE reference_option]
    [ON UPDATE reference_option]
```

A chave estrangeira pode ser auto-referencial (referindo-se à mesma tabela). Quando você adiciona uma restrição de chave estrangeira a uma tabela usando `ALTER TABLE`, *não se esqueça de criar um índice primeiro nas colunas referenciadas pela chave estrangeira.*

##### Deixar de aplicar restrições de chave estrangeira

Você pode descartar uma restrição de chave estrangeira usando a seguinte sintaxe de `ALTER TABLE` (alter-table.html):

```sql
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol;
```

Se a cláusula `FOREIGN KEY` definiu um nome de `CONSTRAINT` quando você criou a restrição, você pode referenciar esse nome para descartar a restrição de chave estrangeira. Caso contrário, um nome de restrição foi gerado internamente, e você deve usar esse valor. Para determinar o nome da restrição de chave estrangeira, use `SHOW CREATE TABLE`:

```sql
mysql> SHOW CREATE TABLE child\G
*************************** 1. row ***************************
       Table: child
Create Table: CREATE TABLE `child` (
  `id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  KEY `par_ind` (`parent_id`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
  REFERENCES `parent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1

mysql> ALTER TABLE child DROP FOREIGN KEY `child_ibfk_1`;
```

A adição e a remoção de uma chave estrangeira na mesma instrução `ALTER TABLE` são suportadas para `ALTER TABLE ... ALGORITHM=INPLACE`. Não são suportadas para `ALTER TABLE ... ALGORITHM=COPY`.

##### Verificação de Chaves Estrangeiras

Nas tabelas MySQL, as tabelas InnoDB e NDB suportam a verificação de restrições de chave estrangeira. A verificação de chave estrangeira é controlada pela variável `foreign_key_checks`, que está habilitada por padrão. Normalmente, você deixa essa variável habilitada durante o funcionamento normal para impor a integridade referencial. A variável `foreign_key_checks` tem o mesmo efeito nas tabelas `NDB` que nas tabelas `InnoDB`.

A variável `foreign_key_checks` é dinâmica e suporta escopos globais e de sessão. Para obter informações sobre o uso de variáveis de sistema, consulte Seção 5.1.8, “Usando Variáveis de Sistema”.

Desativar a verificação de chave estrangeira é útil quando:

- Excluir uma tabela que é referenciada por uma restrição de chave estrangeira. Uma tabela referenciada só pode ser excluída após a desativação de `foreign_key_checks`. Ao excluir uma tabela, as restrições definidas na tabela também são excluídas.

- Recarregar tabelas em uma ordem diferente da exigida por suas relações de chave estrangeira. Por exemplo, **mysqldump** produz definições corretas das tabelas no arquivo de dump, incluindo restrições de chave estrangeira para tabelas filhas. Para facilitar o recarregamento dos arquivos de dump para tabelas com relações de chave estrangeira, o **mysqldump** inclui automaticamente uma declaração na saída do dump que desabilita `foreign_key_checks`. Isso permite que você importe as tabelas em qualquer ordem, caso o arquivo de dump contenha tabelas que não estejam corretamente ordenadas para chaves estrangeiras. Desabilitar `foreign_key_checks` também acelera a operação de importação, evitando verificações de chave estrangeira.

- Execute as operações de `LOAD DATA` para evitar a verificação de chaves estrangeiras.

- Realizar uma operação de alteração de tabela (`ALTER TABLE`) em uma tabela que possui uma relação de chave estrangeira.

Quando `foreign_key_checks` está desativado, as restrições de chave estrangeira são ignoradas, com as seguintes exceções:

- Recriar uma tabela que foi previamente excluída retorna um erro se a definição da tabela não estiver em conformidade com as restrições de chave estrangeira que fazem referência à tabela. A tabela deve ter os nomes e tipos de coluna corretos. Deve também ter índices nas chaves referenciadas. Se esses requisitos não forem atendidos, o MySQL retorna o erro 1005, que se refere ao erro: 150 na mensagem de erro, o que significa que uma restrição de chave estrangeira não foi formada corretamente.

- Altere uma tabela e será exibido um erro (errno: 150) se a definição de chave estrangeira não estiver corretamente formada para a tabela alterada.

- Remover um índice exigido por uma restrição de chave estrangeira. A restrição de chave estrangeira deve ser removida antes de remover o índice.

- Criar uma restrição de chave estrangeira onde uma coluna faz referência a um tipo de coluna que não corresponde.

Desativar `foreign_key_checks` tem essas implicações adicionais:

- É permitido excluir um banco de dados que contenha tabelas com chaves estrangeiras que são referenciadas por tabelas fora do banco de dados.

- É permitido excluir uma tabela com chaves estrangeiras referenciadas por outras tabelas.

- Ativar `foreign_key_checks` não dispara uma varredura dos dados da tabela, o que significa que as linhas adicionadas a uma tabela enquanto `foreign_key_checks` está desativado não são verificadas quanto à consistência quando `foreign_key_checks` é reativado.

##### Definições de Chave Estrangeira e Metadados

Para visualizar a definição de uma chave estrangeira, use `SHOW CREATE TABLE`:

```sql
mysql> SHOW CREATE TABLE child\G
*************************** 1. row ***************************
       Table: child
Create Table: CREATE TABLE `child` (
  `id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  KEY `par_ind` (`parent_id`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
  REFERENCES `parent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1
```

Você pode obter informações sobre chaves estrangeiras a partir da tabela do esquema de informações `KEY_COLUMN_USAGE`. Um exemplo de consulta contra essa tabela é mostrado aqui:

```sql
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
       WHERE REFERENCED_TABLE_SCHEMA IS NOT NULL;
+--------------+------------+-------------+-----------------+
| TABLE_SCHEMA | TABLE_NAME | COLUMN_NAME | CONSTRAINT_NAME |
+--------------+------------+-------------+-----------------+
| test         | child      | parent_id   | child_ibfk_1    |
+--------------+------------+-------------+-----------------+
```

Você pode obter informações específicas sobre as chaves estrangeiras `InnoDB` nas tabelas `INNODB_SYS_FOREIGN` e `INNODB_SYS_FOREIGN_COLS`. Exemplos de consultas estão aqui:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN \G
*************************** 1. row ***************************
      ID: test/child_ibfk_1
FOR_NAME: test/child
REF_NAME: test/parent
  N_COLS: 1
    TYPE: 1

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN_COLS \G
*************************** 1. row ***************************
          ID: test/child_ibfk_1
FOR_COL_NAME: parent_id
REF_COL_NAME: id
         POS: 0
```

##### Erros de Chave Estrangeira

Em caso de erro de chave estrangeira envolvendo tabelas `InnoDB` (geralmente o erro 150 no MySQL Server), as informações sobre o último erro de chave estrangeira podem ser obtidas verificando a saída de `SHOW ENGINE INNODB STATUS`.

```sql
mysql> SHOW ENGINE INNODB STATUS\G
...
------------------------
LATEST FOREIGN KEY ERROR
------------------------
2014-10-16 18:35:18 0x7fc2a95c1700 Transaction:
TRANSACTION 1814, ACTIVE 0 sec inserting
mysql tables in use 1, locked 1
4 lock struct(s), heap size 1136, 3 row lock(s), undo log entries 3
MySQL thread id 2, OS thread handle 140474041767680, query id 74 localhost
root update
INSERT INTO child VALUES
    (NULL, 1)
    , (NULL, 2)
    , (NULL, 3)
    , (NULL, 4)
    , (NULL, 5)
    , (NULL, 6)
Foreign key constraint fails for table `mysql`.`child`:
,
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent`
  (`id`) ON DELETE CASCADE ON UPDATE CASCADE
Trying to add in child table, in index par_ind tuple:
DATA TUPLE: 2 fields;
 0: len 4; hex 80000003; asc     ;;
 1: len 4; hex 80000003; asc     ;;

But in parent table `mysql`.`parent`, in index PRIMARY,
the closest match we can find is record:
PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 80000004; asc     ;;
 1: len 6; hex 00000000070a; asc       ;;
 2: len 7; hex aa0000011d0134; asc       4;;
...
```

Aviso

Os mensagens de erro `ER_NO_REFERENCED_ROW_2` e `ER_ROW_IS_REFERENCED_2` para operações de chave estrangeira exibem informações sobre as tabelas pai, mesmo que o usuário não tenha privilégios de acesso à tabela pai. Para ocultar informações sobre as tabelas pai, inclua os manipuladores de condição apropriados no código do aplicativo e nos programas armazenados.
