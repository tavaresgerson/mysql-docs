## 10.7 Conversão do Conjunto de Caracteres da Coluna

Para converter uma coluna de string binária ou não binária para usar um conjunto de caracteres específico, use `ALTER TABLE`. Para que a conversão seja bem-sucedida, uma das seguintes condições deve ser atendida:

- Se a coluna tiver um tipo de dados binário (`BINARY`, `VARBINARY`, `BLOB`), todos os valores que ela contém devem ser codificados usando um único conjunto de caracteres (o conjunto de caracteres para o qual você está convertendo a coluna). Se você usar uma coluna binária para armazenar informações em múltiplos conjuntos de caracteres, o MySQL não tem como saber quais valores usam qual conjunto de caracteres e não pode converter os dados corretamente.

- Se a coluna tiver um tipo de dados não binário (`CHAR`, `VARCHAR`, `TEXT`), seus conteúdos devem ser codificados no conjunto de caracteres da coluna, e não em algum outro conjunto de caracteres. Se os conteúdos forem codificados em um conjunto de caracteres diferente, você pode converter a coluna para usar um tipo de dados binário primeiro e, em seguida, para uma coluna não binária com o conjunto de caracteres desejado.

Suponha que uma tabela `t` tenha uma coluna binária chamada `col1`, definida como `VARBINARY(50)`. Supondo que as informações na coluna sejam codificadas usando um único conjunto de caracteres, você pode convertê-las em uma coluna não binária que tenha esse conjunto de caracteres. Por exemplo, se `col1` contém dados binários que representam caracteres no conjunto de caracteres `greek`, você pode convertê-los da seguinte forma:

```sql
ALTER TABLE t MODIFY col1 VARCHAR(50) CHARACTER SET greek;
```

Se a coluna original tiver um tipo de `BINARY(50)`, você pode convertê-la para `CHAR(50)`, mas os valores resultantes serão preenchidos com bytes `0x00` no final, o que pode ser indesejável. Para remover esses bytes, use a função `TRIM()`:

```sql
UPDATE t SET col1 = TRIM(TRAILING 0x00 FROM col1);
```

Suponha que a tabela `t` tenha uma coluna não binária chamada `col1`, definida como `CHAR(50) CHARACTER SET latin1`, mas você deseja convertê-la para usar `utf8` para que possa armazenar valores de várias línguas. A seguinte instrução realiza isso:

```sql
ALTER TABLE t MODIFY col1 CHAR(50) CHARACTER SET utf8;
```

A conversão pode ser com perda de qualidade se a coluna contiver caracteres que não estão em ambos os conjuntos de caracteres.

Um caso especial ocorre se você tiver tabelas antigas anteriores ao MySQL 4.1, onde uma coluna não binária contém valores que são, na verdade, codificados em um conjunto de caracteres diferente do conjunto de caracteres padrão do servidor. Por exemplo, um aplicativo pode ter armazenado valores `sjis` em uma coluna, mesmo que o conjunto de caracteres padrão do MySQL fosse diferente. É possível converter a coluna para usar o conjunto de caracteres apropriado, mas é necessário um passo adicional. Suponha que o conjunto de caracteres padrão do servidor fosse `latin1` e `col1` fosse definido como `CHAR(50)` mas seus conteúdos fossem valores `sjis`. O primeiro passo é converter a coluna para um tipo de dados binário, o que remove as informações do conjunto de caracteres existente sem realizar nenhuma conversão de caracteres:

```sql
ALTER TABLE t MODIFY col1 BLOB;
```

O próximo passo é converter a coluna para um tipo de dados não binário com o conjunto de caracteres adequado:

```sql
ALTER TABLE t MODIFY col1 CHAR(50) CHARACTER SET sjis;
```

Esse procedimento exige que a tabela não tenha sido modificada anteriormente com instruções como `INSERT` ou `UPDATE` após uma atualização para o MySQL 4.1 ou superior. Nesse caso, o MySQL armazena novos valores na coluna usando `latin1`, e a coluna contém uma mistura de valores `sjis` e `latin1` e não pode ser convertida corretamente.

Se você especificou atributos ao criar uma coluna inicialmente, você também deve especificá-los ao alterar a tabela com `ALTER TABLE`. Por exemplo, se você especificou `NOT NULL` e um valor `DEFAULT` explícito, você também deve fornecê-los na instrução `ALTER TABLE`. Caso contrário, a definição da coluna resultante não incluirá esses atributos.

Para converter todas as colunas de caracteres em uma tabela, a instrução `ALTER TABLE ... CONVERT TO CHARACTER SET charset` pode ser útil. Veja a Seção 13.1.8, “Instrução ALTER TABLE”.

Nota

As instruções `ALTER TABLE` que realizam alterações nos conjuntos de caracteres ou nas colunas de uma tabela ou de um banco de dados devem ser executadas usando `ALGORITHM=COPY`. Para obter mais informações, consulte a Seção 14.13.1, “Operações DDL online”.
