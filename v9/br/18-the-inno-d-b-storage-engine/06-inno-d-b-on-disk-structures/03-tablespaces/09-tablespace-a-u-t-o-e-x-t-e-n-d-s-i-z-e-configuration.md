#### 17.6.3.9 Configuração do tamanho de espaço de tabelas AUTOEXTEND_SIZE

Por padrão, quando um espaço de tabelas por arquivo ou espaço de tabelas geral requer espaço adicional, o espaço de tabelas é estendido incrementalmente de acordo com as seguintes regras:

* Se o espaço de tabelas for menor que um intervalo em tamanho, ele é estendido uma página de cada vez.

* Se o espaço de tabelas for maior que 1 intervalo, mas menor que 32 intervalos em tamanho, ele é estendido um intervalo de cada vez.

* Se o espaço de tabelas for maior que 32 intervalos em tamanho, ele é estendido quatro intervalos de cada vez.

Para obter informações sobre o tamanho do intervalo, consulte a Seção 17.11.2, “Gestão de Espaço de Arquivo”.

A quantidade pela qual um espaço de tabelas por arquivo ou espaço de tabelas geral é estendido pode ser configurada especificando a opção `AUTOEXTEND_SIZE`. Configurar um tamanho de extensão maior pode ajudar a evitar fragmentação e facilitar a ingestão de grandes quantidades de dados.

Para configurar o tamanho de extensão para um espaço de tabelas por arquivo, especifique o tamanho da opção `AUTOEXTEND_SIZE` em uma declaração `CREATE TABLE` ou `ALTER TABLE`:

```
CREATE TABLE t1 (c1 INT) AUTOEXTEND_SIZE = 4M;

ALTER TABLE t1 AUTOEXTEND_SIZE = 8M;
```

Para configurar o tamanho de extensão para um espaço de tabelas geral, especifique o tamanho da opção `AUTOEXTEND_SIZE` em uma declaração `CREATE TABLESPACE` ou `ALTER TABLESPACE`:

```
CREATE TABLESPACE ts1 AUTOEXTEND_SIZE = 4M;

ALTER TABLESPACE ts1 AUTOEXTEND_SIZE = 8M;
```

Observação

A opção `AUTOEXTEND_SIZE` também pode ser usada ao criar um espaço de undo, mas o comportamento de extensão para espaços de undo difere. Para mais informações, consulte a Seção 17.6.3.4, “Espaços de Undo”.

O ajuste de configuração `AUTOEXTEND_SIZE` deve ser um múltiplo de 4M. Especificar um ajuste de `AUTOEXTEND_SIZE` que não seja um múltiplo de 4M retorna um erro.

O ajuste padrão de `AUTOEXTEND_SIZE` é 0, o que faz com que o espaço de tabelas seja estendido de acordo com o comportamento padrão descrito acima.

O tamanho máximo permitido de `AUTOEXTEND_SIZE` é de 4GB. O tamanho máximo do espaço de tabelas é descrito na Seção 17.21, “Limites do InnoDB”.

O ajuste mínimo de `AUTOEXTEND_SIZE` depende do tamanho da página do `InnoDB`, conforme mostrado na tabela a seguir:

<table summary="O tamanho mínimo de AUTOEXTEND_SIZE para cada tamanho de página do InnoDB"><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Tamanho de Página do InnoDB</th> <th>AUTOEXTEND_SIZE Mínimo</th> </tr></thead><tbody><tr> <td><code>4K</code></td> <td><code>4M</code></td> </tr><tr> <td><code>8K</code></td> <td><code>4M</code></td> </tr><tr> <td><code>16K</code></td> <td><code>4M</code></td> </tr><tr> <td><code>32K</code></td> <td><code>8M</code></td> </tr><tr> <td><code>64K</code></td> <td><code>16M</code></td> </tr></tbody></table>

O tamanho padrão de página do `InnoDB` é de 16K (16384 bytes). Para determinar o tamanho de página do `InnoDB` para sua instância do MySQL, consulte o ajuste `innodb_page_size`:

```
mysql> SELECT @@GLOBAL.innodb_page_size;
+---------------------------+
| @@GLOBAL.innodb_page_size |
+---------------------------+
|                     16384 |
+---------------------------+
```

Quando o ajuste `AUTOEXTEND_SIZE` para um espaço de tabelas é alterado, a primeira extensão que ocorre posteriormente aumenta o tamanho do espaço de tabelas para um múltiplo do ajuste `AUTOEXTEND_SIZE`. As extensões subsequentes têm o tamanho configurado.

Quando um espaço de tabelas ou um espaço de tabelas geral é criado com um ajuste `AUTOEXTEND_SIZE` não nulo, o espaço de tabelas é inicializado no tamanho especificado de `AUTOEXTEND_SIZE`.

A opção `ALTER TABLESPACE` não pode ser usada para configurar o `AUTOEXTEND_SIZE` de um espaço de tabelas por tabela. A opção `ALTER TABLE` deve ser usada.

Para tabelas criadas em espaços de tabelas por tabela, a opção `SHOW CREATE TABLE` exibe a opção `AUTOEXTEND_SIZE` apenas quando ela é configurada para um valor não nulo.

Para determinar o `AUTOEXTEND_SIZE` para qualquer espaço de tabelas do `InnoDB`, consulte a tabela do Esquema de Informações `INNODB_TABLESPACES`. Por exemplo:

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

Observação

Um `AUTOEXTEND_SIZE` de 0, que é o ajuste padrão, significa que o tablespace é estendido de acordo com o comportamento padrão de extensão de tablespace descrito acima.