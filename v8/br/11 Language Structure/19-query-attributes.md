## 11.6 Atributos de Consulta

A parte mais visível de uma instrução SQL é o texto da instrução. Os clientes também podem definir atributos de consulta que se aplicam à próxima instrução enviada ao servidor para execução:

* Os atributos são definidos antes de enviar a instrução.
* Os atributos existem até o término da execução da instrução, momento em que o conjunto de atributos é limpo.
* Enquanto os atributos existem, eles podem ser acessados no lado do servidor.

Exemplos de como os atributos de consulta podem ser usados:

* Um aplicativo web produz páginas que geram consultas de banco de dados, e para cada consulta, deve rastrear o URL da página que a gerou.
* Um aplicativo passa informações de processamento extras com cada consulta, para uso por um plugin, como um plugin de auditoria ou plugin de reescrita de consulta.

O MySQL suporta essas capacidades sem o uso de soluções alternativas, como comentários especialmente formatados incluídos nas strings de consulta. O restante desta seção descreve como usar o suporte a atributos de consulta, incluindo os pré-requisitos que devem ser atendidos.

* Definindo e Acessando Atributos de Consulta
* Pré-requisitos para Usar Atributos de Consulta
* Funções Carregáveis de Atributo de Consulta

### Definindo e Acessando Atributos de Consulta

Aplicações que usam a API C do MySQL definem atributos de consulta chamando a função  `mysql_bind_param()`. Veja  mysql_bind_param(). Outros conectores MySQL também podem fornecer suporte a atributos de consulta. Veja a documentação dos conectores individuais.

O cliente `mysql` tem um comando `query_attributes` que permite definir até 32 pares de nomes e valores de atributos. Veja a Seção 6.5.1.2, “Comandos do Cliente MySQL”.

Os nomes dos atributos de consulta são transmitidos usando o conjunto de caracteres indicado pela variável de sistema `character_set_client`.

Para acessar os atributos de consulta dentro de instruções SQL para as quais atributos foram definidos, instale o componente `query_attributes` conforme descrito em Pré-requisitos para usar atributos de consulta. O componente implementa uma função carregável `mysql_query_attribute_string()` que recebe um argumento de nome de atributo e retorna o valor do atributo como uma string, ou `NULL` se o atributo não existir. Veja Funções carregáveis de atributos de consulta.

Os seguintes exemplos usam o comando `query_attributes` do cliente `mysql` para definir pares de nome/valor de atributo, e a função `mysql_query_attribute_string()` para acessar os valores dos atributos por nome.

Este exemplo define dois atributos chamados `n1` e `n2`. O primeiro `SELECT` mostra como recuperar esses atributos, e também demonstra que recuperar um atributo inexistente (`n3`) retorna `NULL`. O segundo `SELECT` mostra que os atributos não persistem entre as instruções.

```
mysql> query_attributes n1 v1 n2 v2;
mysql> SELECT
         mysql_query_attribute_string('n1') AS 'attr 1',
         mysql_query_attribute_string('n2') AS 'attr 2',
         mysql_query_attribute_string('n3') AS 'attr 3';
+--------+--------+--------+
| attr 1 | attr 2 | attr 3 |
+--------+--------+--------+
| v1     | v2     | NULL   |
+--------+--------+--------+

mysql> SELECT
         mysql_query_attribute_string('n1') AS 'attr 1',
         mysql_query_attribute_string('n2') AS 'attr 2';
+--------+--------+
| attr 1 | attr 2 |
+--------+--------+
| NULL   | NULL   |
+--------+--------+
```

Como mostrado pela segunda instrução `SELECT`, os atributos definidos antes de uma determinada instrução estão disponíveis apenas para aquela instrução e são apagados após a execução da instrução. Para usar um valor de atributo em várias instruções, atribua-o a uma variável. O exemplo seguinte mostra como fazer isso e ilustra que os valores dos atributos estão disponíveis em instruções subsequentes por meio das variáveis, mas não chamando `mysql_query_attribute_string()`:

```
mysql> query_attributes n1 v1 n2 v2;
mysql> SET
         @attr1 = mysql_query_attribute_string('n1'),
         @attr2 = mysql_query_attribute_string('n2');

mysql> SELECT
         @attr1, mysql_query_attribute_string('n1') AS 'attr 1',
         @attr2, mysql_query_attribute_string('n2') AS 'attr 2';
+--------+--------+--------+--------+
| @attr1 | attr 1 | @attr2 | attr 2 |
+--------+--------+--------+--------+
| v1     | NULL   | v2     | NULL   |
+--------+--------+--------+--------+
```

Os atributos também podem ser salvos para uso posterior armazenando-os em uma tabela:

```
mysql> CREATE TABLE t1 (c1 CHAR(20), c2 CHAR(20));

mysql> query_attributes n1 v1 n2 v2;
mysql> INSERT INTO t1 (c1, c2) VALUES(
         mysql_query_attribute_string('n1'),
         mysql_query_attribute_string('n2')
       );

mysql> SELECT * FROM t1;
+------+------+
| c1   | c2   |
+------+------+
| v1   | v2   |
+------+------+
```

Os atributos de consulta estão sujeitos a essas limitações e restrições:

* Se várias operações de definição de atributos ocorrerem antes de enviar uma declaração ao servidor para execução, a operação de definição mais recente se aplica e substitui os atributos definidos em operações anteriores.
* Se vários atributos forem definidos com o mesmo nome, as tentativas de recuperar o valor do atributo terão um resultado indefinido.
* Um atributo definido com um nome vazio não pode ser recuperado pelo nome.
* Os atributos não estão disponíveis para declarações preparadas com `PREPARE`.
* A função `mysql_query_attribute_string()` não pode ser usada em declarações DDL.
* Os atributos não são replicados. As declarações que invocam a função `mysql_query_attribute_string()` não obterão o mesmo valor em todos os servidores.

### Pré-requisitos para Usar Atributos de Consulta

Para acessar atributos de consulta dentro de declarações SQL para as quais atributos foram definidos, o componente `query_attributes` deve estar instalado. Faça isso usando esta declaração:

```
INSTALL COMPONENT "file://component_query_attributes";
```

A instalação do componente é uma operação única que não precisa ser feita a cada inicialização do servidor. `INSTALL COMPONENT` carrega o componente e também o registra na tabela `mysql.component` do sistema para que ele seja carregado durante as inicializações subsequentes do servidor.

O componente `query_attributes` acessa os atributos de consulta para implementar uma função `mysql_query_attribute_string()`. Veja a Seção 7.5.4, “Componentes de Atributo de Consulta”.

Para desinstalar o componente `query_attributes`, use esta declaração:

```
UNINSTALL COMPONENT "file://component_query_attributes";
```

 `UNINSTALL COMPONENT` descarrega o componente e o desregistra da tabela `mysql.component` do sistema para que ele não seja carregado durante as inicializações subsequentes do servidor.

Como a instalação e a desinstalação do componente `query_attributes` instalam e desinstalam a função `mysql_query_attribute_string()` que o componente implementa, não é necessário usar `CREATE FUNCTION` ou `DROP FUNCTION` para fazer isso.

### Funções Carregáveis de Atributo de Consulta

*  `mysql_query_attribute_string(name)`

As aplicações podem definir atributos que se aplicam à próxima consulta enviada ao servidor. A função `mysql_query_attribute_string()` retorna um valor de atributo como uma string, dado o nome do atributo. Esta função permite que uma consulta acesse e incorpore valores dos atributos que se aplicam a ela.

`mysql_query_attribute_string()` é instalado ao instalar o componente `query_attributes`. Veja a Seção 11.6, “Atributos de consulta”, que também discute o propósito e o uso dos atributos de consulta.

Argumentos:

+ *`name`*: O nome do atributo.

Valor de retorno:

Retorna o valor do atributo como uma string para sucesso, ou `NULL` se o atributo não existir.

Exemplo:

O exemplo seguinte usa o comando `query_attributes` do cliente `mysql` para definir atributos de consulta que podem ser recuperados por `mysql_query_attribute_string()`. A consulta `SELECT` mostra que a recuperação de um atributo inexistente (`n3`) retorna `NULL`.

```
  mysql> query_attributes n1 v1 n2 v2;
  mysql> SELECT
      ->   mysql_query_attribute_string('n1') AS 'attr 1',
      ->   mysql_query_attribute_string('n2') AS 'attr 2',
      ->   mysql_query_attribute_string('n3') AS 'attr 3';
  +--------+--------+--------+
  | attr 1 | attr 2 | attr 3 |
  +--------+--------+--------+
  | v1     | v2     | NULL   |
  +--------+--------+--------+
  ```