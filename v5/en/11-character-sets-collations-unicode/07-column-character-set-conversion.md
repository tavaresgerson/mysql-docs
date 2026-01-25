## 10.7 Conversão do Character Set de Colunas

Para converter uma coluna de string binária ou não binária para usar um determinado character set, utilize `ALTER TABLE`. Para que a conversão seja bem-sucedida, uma das seguintes condições deve ser aplicada:

* Se a coluna tiver um data type binário (`BINARY`, `VARBINARY`, `BLOB`), todos os valores que ela contém devem ser codificados usando um único character set (o character set para o qual você está convertendo a coluna). Se você usar uma coluna binária para armazenar informações em múltiplos character sets, o MySQL não tem como saber quais valores usam qual character set e não pode converter os dados corretamente.

* Se a coluna tiver um data type não binário (`CHAR`, `VARCHAR`, `TEXT`), seu conteúdo deve ser codificado no character set da coluna, e não em outro character set qualquer. Se o conteúdo estiver codificado em um character set diferente, você pode converter a coluna para usar um data type binário primeiro e, em seguida, convertê-la para uma coluna não binária com o character set desejado.

Suponha que uma tabela `t` tenha uma coluna binária chamada `col1` definida como `VARBINARY(50)`. Assumindo que a informação na coluna esteja codificada usando um único character set, você pode convertê-la para uma coluna não binária que tenha esse character set. Por exemplo, se `col1` contém dados binários representando caracteres no character set `greek`, você pode convertê-la da seguinte forma:

```sql
ALTER TABLE t MODIFY col1 VARCHAR(50) CHARACTER SET greek;
```

Se sua coluna original tem o tipo `BINARY(50)`, você poderia convertê-la para `CHAR(50)`, mas os valores resultantes são preenchidos (padded) com bytes `0x00` no final, o que pode ser indesejável. Para remover esses bytes, use a função `TRIM()`:

```sql
UPDATE t SET col1 = TRIM(TRAILING 0x00 FROM col1);
```

Suponha que a tabela `t` tenha uma coluna não binária chamada `col1` definida como `CHAR(50) CHARACTER SET latin1`, mas você deseja convertê-la para usar `utf8` para que possa armazenar valores de muitos idiomas. A seguinte instrução realiza isso:

```sql
ALTER TABLE t MODIFY col1 CHAR(50) CHARACTER SET utf8;
```

A conversão pode resultar em perda de dados (lossy) se a coluna contiver caracteres que não estão presentes em ambos os character sets.

Um caso especial ocorre se você tiver tabelas antigas, anteriores ao MySQL 4.1, onde uma coluna não binária contém valores que estão, na verdade, codificados em um character set diferente do character set default do servidor. Por exemplo, um aplicativo pode ter armazenado valores `sjis` em uma coluna, mesmo que o character set default do MySQL fosse diferente. É possível converter a coluna para usar o character set apropriado, mas uma etapa adicional é necessária. Suponha que o character set default do servidor fosse `latin1` e `col1` seja definida como `CHAR(50)`, mas seu conteúdo sejam valores `sjis`. O primeiro passo é converter a coluna para um data type binário, o que remove as informações de character set existentes sem realizar qualquer conversão de caracteres:

```sql
ALTER TABLE t MODIFY col1 BLOB;
```

O próximo passo é converter a coluna para um data type não binário com o character set apropriado:

```sql
ALTER TABLE t MODIFY col1 CHAR(50) CHARACTER SET sjis;
```

Este procedimento requer que a tabela não tenha sido modificada por instruções como `INSERT` ou `UPDATE` após uma atualização para o MySQL 4.1 ou superior. Nesse caso, o MySQL armazena novos valores na coluna usando `latin1`, e a coluna contém uma mistura de valores `sjis` e `latin1` e não pode ser convertida corretamente.

Se você especificou atributos ao criar uma coluna inicialmente, você também deve especificá-los ao alterar a tabela com `ALTER TABLE`. Por exemplo, se você especificou `NOT NULL` e um valor `DEFAULT` explícito, você também deve fornecê-los na instrução `ALTER TABLE`. Caso contrário, a definição de coluna resultante não incluirá esses atributos.

Para converter todas as colunas de caracteres em uma tabela, a instrução `ALTER TABLE ... CONVERT TO CHARACTER SET charset` pode ser útil. Consulte a Seção 13.1.8, “Instrução ALTER TABLE”.

Nota

Instruções `ALTER TABLE` que realizam alterações em character sets ou collations de tabelas ou colunas devem ser executadas usando `ALGORITHM=COPY`. Para mais informações, consulte a Seção 14.13.1, “Online DDL Operations”.