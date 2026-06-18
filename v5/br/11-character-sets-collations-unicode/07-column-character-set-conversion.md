## 10.7 Conversão de Character Set de Coluna

Para converter uma coluna de string binária ou não binária para usar um `Character Set` específico, utilize `ALTER TABLE`. Para que a conversão ocorra com sucesso, uma das seguintes condições deve ser aplicada:

* Se a coluna tiver um tipo de dado binário (`BINARY`, `VARBINARY`, `BLOB`), todos os valores que ela contém devem ser codificados usando um único `Character Set` (o `Character Set` para o qual você está convertendo a coluna). Se você usar uma coluna binária para armazenar informações em múltiplos `Character Sets`, o MySQL não tem como saber quais valores usam qual `Character Set` e não pode converter os dados corretamente.

* Se a coluna tiver um tipo de dado não binário (`CHAR`, `VARCHAR`, `TEXT`), seu conteúdo deve ser codificado no `Character Set` da coluna, e não em algum outro `Character Set`. Se o conteúdo estiver codificado em um `Character Set` diferente, você pode converter a coluna para usar um tipo de dado binário primeiro e, em seguida, para uma coluna não binária com o `Character Set` desejado.

Suponha que uma tabela `t` tenha uma coluna binária chamada `col1` definida como `VARBINARY(50)`. Assumindo que a informação na coluna está codificada usando um único `Character Set`, você pode convertê-la para uma coluna não binária que possua esse `Character Set`. Por exemplo, se `col1` contém dados binários representando caracteres no `Character Set` `greek`, você pode convertê-la da seguinte forma:

```sql
ALTER TABLE t MODIFY col1 VARCHAR(50) CHARACTER SET greek;
```

Se sua coluna original tiver o tipo `BINARY(50)`, você pode convertê-la para `CHAR(50)`, mas os valores resultantes são preenchidos com bytes `0x00` no final, o que pode ser indesejável. Para remover esses bytes, use a função `TRIM()`:

```sql
UPDATE t SET col1 = TRIM(TRAILING 0x00 FROM col1);
```

Suponha que a tabela `t` tenha uma coluna não binária chamada `col1` definida como `CHAR(50) CHARACTER SET latin1`, mas você deseja convertê-la para usar `utf8` para que possa armazenar valores de diversos idiomas. A seguinte instrução realiza isso:

```sql
ALTER TABLE t MODIFY col1 CHAR(50) CHARACTER SET utf8;
```

A conversão pode resultar em perda de dados (lossy) se a coluna contiver caracteres que não existam em ambos os `Character Sets`.

Um caso especial ocorre se você tiver tabelas antigas (anteriores ao MySQL 4.1) onde uma coluna não binária contém valores que, na verdade, estão codificados em um `Character Set` diferente do `Character Set default` do servidor. Por exemplo, uma aplicação pode ter armazenado valores `sjis` em uma coluna, mesmo que o `Character Set default` do MySQL fosse diferente. É possível converter a coluna para usar o `Character Set` apropriado, mas uma etapa adicional é necessária. Suponha que o `Character Set default` do servidor fosse `latin1` e `col1` estivesse definida como `CHAR(50)`, mas seu conteúdo fossem valores `sjis`. O primeiro passo é converter a coluna para um tipo de dado binário, o que remove as informações de `Character Set` existentes sem realizar nenhuma conversão de caracteres:

```sql
ALTER TABLE t MODIFY col1 BLOB;
```

O próximo passo é converter a coluna para um tipo de dado não binário com o `Character Set` apropriado:

```sql
ALTER TABLE t MODIFY col1 CHAR(50) CHARACTER SET sjis;
```

Este procedimento exige que a tabela não tenha sido modificada previamente com instruções como `INSERT` ou `UPDATE` após um upgrade para o MySQL 4.1 ou superior. Nesse caso, o MySQL armazena novos valores na coluna usando `latin1`, e a coluna conterá uma mistura de valores `sjis` e `latin1` e não poderá ser convertida corretamente.

Se você especificou atributos ao criar uma coluna inicialmente, você também deve especificá-los ao alterar a tabela com `ALTER TABLE`. Por exemplo, se você especificou `NOT NULL` e um valor `DEFAULT` explícito, você também deve fornecê-los na instrução `ALTER TABLE`. Caso contrário, a definição da coluna resultante não incluirá esses atributos.

Para converter todas as colunas de caracteres em uma tabela, a instrução `ALTER TABLE ... CONVERT TO CHARACTER SET charset` pode ser útil. Consulte a Seção 13.1.8, “Instrução ALTER TABLE”.

Nota

Instruções `ALTER TABLE` que realizam alterações em `Character Sets` ou `Collations` de tabelas ou colunas devem ser executadas usando `ALGORITHM=COPY`. Para mais informações, consulte a Seção 14.13.1, “Online DDL Operations”.