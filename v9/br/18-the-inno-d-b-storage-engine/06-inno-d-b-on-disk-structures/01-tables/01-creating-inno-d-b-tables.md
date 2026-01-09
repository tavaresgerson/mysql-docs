#### 17.6.1.1 Criando Tabelas InnoDB

As tabelas `InnoDB` são criadas usando a instrução `CREATE TABLE`; por exemplo:

```
CREATE TABLE t1 (a INT, b CHAR (20), PRIMARY KEY (a)) ENGINE=InnoDB;
```

A cláusula `ENGINE=InnoDB` não é necessária quando `InnoDB` é definido como o motor de armazenamento padrão, o que é o caso por padrão. No entanto, a cláusula `ENGINE` é útil se a instrução `CREATE TABLE` for reexecutada em uma instância diferente do servidor MySQL, onde o motor de armazenamento padrão não é `InnoDB` ou é desconhecido. Você pode determinar o motor de armazenamento padrão em uma instância do MySQL executando a seguinte instrução:

```
mysql> SELECT @@default_storage_engine;
+--------------------------+
| @@default_storage_engine |
+--------------------------+
| InnoDB                   |
+--------------------------+
```

As tabelas `InnoDB` são criadas em espaços de tabelas por arquivo padrão. Para criar uma tabela `InnoDB` no espaço de tabelas `InnoDB`, desative a variável `innodb_file_per_table` antes de criar a tabela. Para criar uma tabela `InnoDB` em um espaço de tabelas geral, use a sintaxe `CREATE TABLE ... TABLESPACE`. Para mais informações, consulte a Seção 17.6.3, “Espaços de Tabelas”.

##### Formatos de Linha

O formato de linha de uma tabela `InnoDB` determina como suas linhas são armazenadas fisicamente no disco. `InnoDB` suporta quatro formatos de linha, cada um com diferentes características de armazenamento. Os formatos de linha suportados incluem `REDUNDANT`, `COMPACT`, `DYNAMIC` e `COMPRESSED`. O formato de linha `DYNAMIC` é o padrão. Para informações sobre as características dos formatos de linha, consulte a Seção 17.10, “Formatos de Linha InnoDB”.

A variável `innodb_default_row_format` define o formato de linha padrão. O formato de linha de uma tabela também pode ser definido explicitamente usando a opção `ROW_FORMAT` da tabela em uma instrução `CREATE TABLE` ou `ALTER TABLE`. Consulte Definindo o Formato de Linha de uma Tabela.

##### Chaves Primárias

Recomenda-se que você defina uma chave primária para cada tabela que você criar. Ao selecionar colunas de chave primária, escolha colunas com as seguintes características:

* Colunas que são referenciadas pelas consultas mais importantes.
* Colunas que nunca ficam em branco.
* Colunas que nunca têm valores duplicados.
* Colunas que raramente, ou nunca, mudam de valor uma vez inseridas.

Por exemplo, em uma tabela que contém informações sobre pessoas, você não criaria uma chave primária em `(nome_de_sobrenome, nome_de_sobrenome)` porque mais de uma pessoa pode ter o mesmo nome, uma coluna de nome pode ficar em branco e, às vezes, as pessoas mudam seus nomes. Com tantas restrições, muitas vezes não há um conjunto óbvio de colunas para usar como chave primária, então você cria uma nova coluna com um ID numérico para servir como toda ou parte da chave primária. Você pode declarar uma coluna de autoincremento para que os valores crescentes sejam preenchidos automaticamente à medida que as linhas são inseridas:

```
# The value of ID can act like a pointer between related items in different tables.
CREATE TABLE t5 (id INT AUTO_INCREMENT, b CHAR (20), PRIMARY KEY (id));

# The primary key can consist of more than one column. Any autoinc column must come first.
CREATE TABLE t6 (id INT AUTO_INCREMENT, a INT, b CHAR (20), PRIMARY KEY (id,a));
```

Para mais informações sobre colunas de autoincremento, consulte a Seção 17.6.1.6, “Manipulação de AUTO_INCREMENT no InnoDB”.

Embora uma tabela funcione corretamente sem definir uma chave primária, a chave primária está envolvida com muitos aspectos do desempenho e é um aspecto crucial do design para qualquer tabela grande ou frequentemente usada. Recomenda-se que você sempre especifique uma chave primária na declaração `CREATE TABLE`. Se você criar a tabela, carregar dados e depois executar `ALTER TABLE` para adicionar uma chave primária mais tarde, essa operação é muito mais lenta do que definir a chave primária ao criar a tabela. Para mais informações sobre chaves primárias, consulte a Seção 17.6.2.1, “Índices Agrupados e Secundários”.

##### Visualizando as Propriedades da Tabela InnoDB

Para visualizar as propriedades de uma tabela `InnoDB`, execute a declaração `SHOW TABLE STATUS`:

```
mysql> SHOW TABLE STATUS FROM test LIKE 't%' \G;
*************************** 1. row ***************************
           Name: t1
         Engine: InnoDB
        Version: 10
     Row_format: Dynamic
           Rows: 0
 Avg_row_length: 0
    Data_length: 16384
Max_data_length: 0
   Index_length: 0
      Data_free: 0
 Auto_increment: NULL
    Create_time: 2021-02-18 12:18:28
    Update_time: NULL
     Check_time: NULL
      Collation: utf8mb4_0900_ai_ci
       Checksum: NULL
 Create_options:
        Comment:
```

Para informações sobre a saída de `SHOW TABLE STATUS`, consulte a Seção 15.7.7.39, “Declaração SHOW TABLE STATUS”.

Você também pode acessar as propriedades da tabela `InnoDB` fazendo uma consulta às tabelas de sistema do esquema de informações `InnoDB`:

Para obter mais informações, consulte a Seção 17.15.3, “Tabelas de Objetos do Schema InnoDB INFORMATION_SCHEMA”.