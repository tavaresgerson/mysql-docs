## 11.6 Atributos de consulta

A parte mais visível de uma instrução SQL é o texto da instrução. A partir do MySQL 8.0.23, os clientes também podem definir atributos de consulta que se aplicam à próxima instrução enviada ao servidor para execução:

- Os atributos são definidos antes de enviar a declaração.

- Os atributos existem até o término da execução da declaração, momento em que o conjunto de atributos é limpo.

- Embora os atributos existam, eles podem ser acessados no lado do servidor.

Exemplos das maneiras pelas quais os atributos de consulta podem ser usados:

- Uma aplicação web produz páginas que geram consultas de banco de dados, e para cada consulta, deve rastrear o URL da página que a gerou.

- Uma aplicação passa informações de processamento adicionais com cada consulta, para uso de um plugin, como um plugin de auditoria ou um plugin de reescrita de consultas.

O MySQL suporta essas funcionalidades sem o uso de soluções alternativas, como comentários formatados especialmente incluídos em strings de consulta. O restante desta seção descreve como usar o suporte a atributos de consulta, incluindo os pré-requisitos que devem ser atendidos.

- Definindo e Acessando Atributos de Consulta
- Pré-requisitos para usar atributos de consulta
- Consulta Funções carregáveis de atributo

### Definindo e Acessando Atributos de Consulta

Aplicações que utilizam a API C do MySQL definem atributos de consulta chamando a função `mysql_bind_param()`. Veja mysql\_bind\_param(). Outros conectores do MySQL também podem fornecer suporte para atributos de consulta. Veja a documentação dos conectores individuais.

O cliente **mysql** possui um comando `query_attributes` que permite definir até 32 pares de nomes e valores de atributos. Veja a Seção 6.5.1.2, “Comandos do Cliente mysql”.

Os nomes dos atributos da consulta são transmitidos usando o conjunto de caracteres indicado pela variável de sistema `character_set_client`.

Para acessar os atributos de consulta dentro das instruções SQL para as quais os atributos foram definidos, instale o componente `query_attributes` conforme descrito nos Pré-requisitos para Usar Atributos de Consulta. O componente implementa uma função carregável `mysql_query_attribute_string()` que recebe um argumento de nome de atributo e retorna o valor do atributo como uma string, ou `NULL` se o atributo não existir. Veja Funções Carregáveis de Atributos de Consulta.

Os exemplos a seguir utilizam o comando do cliente **mysql** `query_attributes` para definir pares de nome/valor de atributos e a função `mysql_query_attribute_string()` para acessar os valores dos atributos por nome.

Este exemplo define dois atributos chamados `n1` e `n2`. O primeiro `SELECT` mostra como recuperar esses atributos e também demonstra que a recuperação de um atributo inexistente (`n3`) retorna `NULL`. O segundo `SELECT` mostra que os atributos não persistem entre as declarações.

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

Como mostrado pela segunda declaração `SELECT`, os atributos definidos antes de uma declaração específica estão disponíveis apenas para essa declaração e são apagados após a execução da declaração. Para usar um valor de atributo em várias declarações, atribua-o a uma variável. O exemplo a seguir mostra como fazer isso e ilustra que os valores dos atributos estão disponíveis em declarações subsequentes por meio das variáveis, mas não ao chamar `mysql_query_attribute_string()`:

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

Os atributos também podem ser salvos para uso posterior, armazenando-os em uma tabela:

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

- Se várias operações de definição de atributos ocorrerem antes de enviar uma declaração para o servidor para execução, a operação de definição mais recente será aplicada e substituirá os atributos definidos em operações anteriores.

- Se vários atributos forem definidos com o mesmo nome, as tentativas de recuperar o valor do atributo terão um resultado indefinido.

- Um atributo definido com um nome vazio não pode ser recuperado pelo nome.

- Os atributos não estão disponíveis para declarações preparadas com `PREPARE`.

- A função `mysql_query_attribute_string()` não pode ser usada em declarações DDL.

- Os atributos não são replicados. As declarações que invocam a função `mysql_query_attribute_string()` não obterão o mesmo valor em todos os servidores.

### Pré-requisitos para usar atributos de consulta

Para acessar os atributos de consulta dentro das instruções SQL para as quais os atributos foram definidos, o componente `query_attributes` deve ser instalado. Faça isso usando esta instrução:

```
INSTALL COMPONENT "file://component_query_attributes";
```

A instalação do componente é uma operação única que não precisa ser feita a cada inicialização do servidor. `INSTALL COMPONENT` carrega o componente e também o registra na tabela do sistema `mysql.component` para que ele seja carregado durante as subsequentes inicializações do servidor.

O componente `query_attributes` acessa os atributos da consulta para implementar uma função `mysql_query_attribute_string()`. Veja a Seção 7.5.4, “Componentes de Atributos de Consulta”.

Para desinstalar o componente `query_attributes`, use esta declaração:

```
UNINSTALL COMPONENT "file://component_query_attributes";
```

`UNINSTALL COMPONENT` descarrega o componente e o desregistra da tabela de sistema `mysql.component`, para que ele não seja carregado durante as próximas inicializações do servidor.

Como a instalação e desinstalação do componente `query_attributes` instalam e desinstalam a função `mysql_query_attribute_string()` que o componente implementa, não é necessário usar `CREATE FUNCTION` ou `DROP FUNCTION` para fazer isso.

### Consulta Funções carregáveis de atributo

- `mysql_query_attribute_string(name)`

  As aplicações podem definir atributos que se aplicam à próxima consulta enviada ao servidor. A função `mysql_query_attribute_string()`, disponível a partir do MySQL 8.0.23, retorna um valor de atributo como uma string, dado o nome do atributo. Essa função permite que uma consulta acesse e incorpore valores dos atributos que se aplicam a ela.

  `mysql_query_attribute_string()` é instalado instalando o componente `query_attributes`. Veja a Seção 11.6, “Atributos da Consulta”, que também discute o propósito e o uso dos atributos da consulta.

  Argumentos:

  - `name`: O nome do atributo.

  Valor de retorno:

  Retorna o valor do atributo como uma string para sucesso, ou `NULL` se o atributo não existir.

  Exemplo:

  O exemplo a seguir usa o comando do cliente **mysql** `query_attributes` para definir atributos de consulta que podem ser recuperados pelo `mysql_query_attribute_string()`. O `SELECT` mostra que a recuperação de um atributo inexistente (`n3`) retorna `NULL`.

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
