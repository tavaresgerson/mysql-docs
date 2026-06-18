#### 17.6.3.9 Configuração do espaço de tabela AUTOEXTEND\_SIZE

Por padrão, quando um espaço de tabela ou um espaço de tabela geral requer espaço adicional, o espaço de tabela é ampliado de forma incremental de acordo com as seguintes regras:

- Se o tablespace for menor que um extent em tamanho, ele será estendido uma página de cada vez.

- Se o espaço de tabelas for maior que 1 extensão, mas menor que 32 extensões, ele será estendido uma extensão de cada vez.

- Se o tablespace tiver mais de 32 extensões, ele será estendido em quatro extensões de cada vez.

Para obter informações sobre o tamanho do espaço de armazenamento, consulte a Seção 17.11.2, “Gestão do Espaço de Armazenamento do Arquivo”.

A partir do MySQL 8.0.23, o valor pelo qual um arquivo por tabela ou um espaço de tabela geral é estendido pode ser configurado especificando a opção `AUTOEXTEND_SIZE`. Configurar um tamanho de extensão maior pode ajudar a evitar a fragmentação e facilitar a ingestão de grandes quantidades de dados.

Para configurar o tamanho da extensão para um espaço de tabela por arquivo, especifique o tamanho `AUTOEXTEND_SIZE` em uma declaração `CREATE TABLE` ou `ALTER TABLE`:

```
CREATE TABLE t1 (c1 INT) AUTOEXTEND_SIZE = 4M;
```

```
ALTER TABLE t1 AUTOEXTEND_SIZE = 8M;
```

Para configurar o tamanho da extensão para um espaço de tabelas geral, especifique o tamanho `AUTOEXTEND_SIZE` em uma declaração `CREATE TABLESPACE` ou `ALTER TABLESPACE`:

```
CREATE TABLESPACE ts1 AUTOEXTEND_SIZE = 4M;
```

```
ALTER TABLESPACE ts1 AUTOEXTEND_SIZE = 8M;
```

Nota

A opção `AUTOEXTEND_SIZE` também pode ser usada ao criar um espaço de tabelas de desfazer, mas o comportamento da extensão para espaços de tabelas de desfazer difere. Para mais informações, consulte a Seção 17.6.3.4, “Espaços de tabelas de desfazer”.

A configuração `AUTOEXTEND_SIZE` deve ser um múltiplo de 4M. Especificar uma configuração `AUTOEXTEND_SIZE` que não seja um múltiplo de 4M retorna um erro.

A configuração padrão `AUTOEXTEND_SIZE` é 0, o que faz com que o espaço de tabela seja estendido de acordo com o comportamento padrão descrito acima.

O tamanho máximo permitido do `AUTOEXTEND_SIZE` é de 4 GB. O tamanho máximo do espaço de tabela é descrito na Seção 17.22, “Limites do InnoDB”.

O ajuste mínimo `AUTOEXTEND_SIZE` depende do tamanho da página `InnoDB`, conforme mostrado na tabela a seguir:

<table summary="O tamanho mínimo de página AUTOEXTEND_SIZE para cada InnoDB"><thead><tr> <th>Tamanho da página do InnoDB</th> <th>MINIMO AUTOEXTEND_SIZE</th> </tr></thead><tbody><tr> <td>[[<code>4K</code>]]</td> <td>[[<code>4M</code>]]</td> </tr><tr> <td>[[<code>8K</code>]]</td> <td>[[<code>4M</code>]]</td> </tr><tr> <td>[[<code>16K</code>]]</td> <td>[[<code>4M</code>]]</td> </tr><tr> <td>[[<code>32K</code>]]</td> <td>[[<code>8M</code>]]</td> </tr><tr> <td>[[<code>64K</code>]]</td> <td>[[<code>16M</code>]]</td> </tr></tbody></table>

O tamanho padrão da página `InnoDB` é de 16K (16384 bytes). Para determinar o tamanho da página `InnoDB` para sua instância do MySQL, consulte a configuração `innodb_page_size`:

```
mysql> SELECT @@GLOBAL.innodb_page_size;
+---------------------------+
| @@GLOBAL.innodb_page_size |
+---------------------------+
|                     16384 |
+---------------------------+
```

Quando a configuração `AUTOEXTEND_SIZE` para um espaço de tabelas é alterada, a primeira extensão que ocorre posteriormente aumenta o tamanho do espaço de tabelas para um múltiplo da configuração `AUTOEXTEND_SIZE`. As extensões subsequentes têm o tamanho configurado.

Quando um espaço de tabela por arquivo ou espaço de tabela geral é criado com um valor não nulo de `AUTOEXTEND_SIZE`, o espaço de tabela é inicializado no tamanho especificado de `AUTOEXTEND_SIZE`.

`ALTER TABLESPACE` não pode ser usado para configurar o `AUTOEXTEND_SIZE` de um espaço de tabelas por arquivo. Deve ser usado `ALTER TABLE`.

Para tabelas criadas em espaços de tabelas por arquivo, `SHOW CREATE TABLE` exibe a opção `AUTOEXTEND_SIZE` apenas quando ela é configurada para um valor diferente de zero.

Para determinar o `AUTOEXTEND_SIZE` para qualquer espaço de tabela `InnoDB`, consulte a tabela do esquema de informações `INNODB_TABLESPACES`. Por exemplo:

```
mysql> SELECT NAME, AUTOEXTEND_SIZE FROM INFORMATION_SCHEMA.INNODB_TABLESPACES
       WHERE NAME LIKE 'test/t1';
+---------+-----------------+
| NAME    | AUTOEXTEND_SIZE |
+---------+-----------------+
| test/t1 |         4194304 |
+---------+-----------------+

mysql> SELECT NAME, AUTOEXTEND_SIZE FROM INFORMATION_SCHEMA.INNODB_TABLESPACES
       WHERE NAME LIKE 'ts1';
+------+-----------------+
| NAME | AUTOEXTEND_SIZE |
+------+-----------------+
| ts1  |         4194304 |
+------+-----------------+
```

Nota

Um `AUTOEXTEND_SIZE` de 0, que é o ajuste padrão, significa que o tablespace é estendido de acordo com o comportamento padrão de extensão de tablespace descrito acima.
