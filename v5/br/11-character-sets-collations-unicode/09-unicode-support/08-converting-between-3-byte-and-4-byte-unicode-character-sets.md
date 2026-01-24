### 10.9.8 Convertendo Entre Character Sets Unicode de 3 Bytes e 4 Bytes

Esta seção descreve problemas que você pode enfrentar ao converter dados de caracteres entre os *character sets* `utf8mb3` e `utf8mb4`.

Nota

Esta discussão foca primariamente na conversão entre `utf8mb3` e `utf8mb4`, mas princípios similares se aplicam à conversão entre o *character set* `ucs2` e *character sets* como `utf16` ou `utf32`.

Os *character sets* `utf8mb3` e `utf8mb4` diferem da seguinte forma:

* `utf8mb3` suporta apenas caracteres no Basic Multilingual Plane (BMP). `utf8mb4` suporta adicionalmente caracteres suplementares que se encontram fora do BMP.

* `utf8mb3` utiliza um máximo de três *bytes* por caractere. `utf8mb4` utiliza um máximo de quatro *bytes* por caractere.

Nota

Esta discussão se refere aos nomes dos *character sets* `utf8mb3` e `utf8mb4` para ser explícita sobre a referência a dados de *character set* UTF-8 de 3 *bytes* e 4 *bytes*. A exceção é que, nas definições de tabela, `utf8` é usado porque o MySQL converte instâncias de `utf8mb3` especificadas em tais definições para `utf8`, que é um *alias* para `utf8mb3`.

Uma vantagem de converter de `utf8mb3` para `utf8mb4` é que isso permite que as aplicações usem caracteres suplementares. Uma desvantagem (*tradeoff*) é que isso pode aumentar os requisitos de espaço de armazenamento de dados.

Em termos de conteúdo da tabela, a conversão de `utf8mb3` para `utf8mb4` não apresenta problemas:

* Para um caractere BMP, `utf8mb4` e `utf8mb3` têm características de armazenamento idênticas: mesmos valores de código, mesma *encoding*, mesmo comprimento.

* Para um caractere suplementar, `utf8mb4` requer quatro *bytes* para armazená-lo, enquanto `utf8mb3` não pode armazenar o caractere. Ao converter colunas `utf8mb3` para `utf8mb4`, você não precisa se preocupar com a conversão de caracteres suplementares porque eles não existem.

Em termos de estrutura da tabela, estas são as principais incompatibilidades potenciais:

* Para os tipos de dados de caracteres de comprimento variável (*variable-length character data types*) (`VARCHAR` e os tipos `TEXT`), o comprimento máximo permitido em caracteres é menor para colunas `utf8mb4` do que para colunas `utf8mb3`.

* Para todos os tipos de dados de caracteres (`CHAR`, `VARCHAR` e os tipos `TEXT`), o número máximo de caracteres que podem ser indexados é menor para colunas `utf8mb4` do que para colunas `utf8mb3`.

Consequentemente, para converter tabelas de `utf8mb3` para `utf8mb4`, pode ser necessário alterar algumas definições de coluna ou Index.

As tabelas podem ser convertidas de `utf8mb3` para `utf8mb4` usando `ALTER TABLE`. Suponha que uma tabela tenha esta definição:

```sql
CREATE TABLE t1 (
  col1 CHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  col2 CHAR(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) CHARACTER SET utf8;
```

A seguinte instrução converte `t1` para usar `utf8mb4`:

```sql
ALTER TABLE t1
  DEFAULT CHARACTER SET utf8mb4,
  MODIFY col1 CHAR(10)
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  MODIFY col2 CHAR(10)
    CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL;
```

O ponto crucial ao converter de `utf8mb3` para `utf8mb4` é que o comprimento máximo de uma coluna ou *index key* permanece inalterado em termos de *bytes*. Portanto, é menor em termos de *caracteres* porque o comprimento máximo de um caractere é de quatro *bytes* em vez de três. Para os tipos de dados `CHAR`, `VARCHAR` e `TEXT`, atente-se a estes problemas ao converter suas tabelas MySQL:

* Verifique todas as definições de colunas `utf8mb3` e certifique-se de que elas não excedam o comprimento máximo para o *storage engine*.

* Verifique todos os Indexes nas colunas `utf8mb3` e certifique-se de que eles não excedam o comprimento máximo para o *storage engine*. Às vezes, o máximo pode mudar devido a aprimoramentos no *storage engine*.

Se as condições precedentes se aplicarem, você deve reduzir o comprimento definido das colunas ou Indexes, ou continuar a usar `utf8mb3` em vez de `utf8mb4`.

Aqui estão alguns exemplos onde mudanças estruturais podem ser necessárias:

* Uma coluna `TINYTEXT` pode armazenar até 255 *bytes*, então ela pode armazenar até 85 caracteres de 3 *bytes* ou 63 caracteres de 4 *bytes*. Suponha que você tenha uma coluna `TINYTEXT` que usa `utf8mb3` mas deve ser capaz de conter mais de 63 caracteres. Você não pode convertê-la para `utf8mb4` a menos que você também altere o tipo de dado para um tipo mais longo, como `TEXT`.

  Similarmente, uma coluna `VARCHAR` muito longa pode precisar ser alterada para um dos tipos `TEXT` mais longos se você quiser convertê-la de `utf8mb3` para `utf8mb4`.

* `InnoDB` tem um comprimento máximo de Index de 767 *bytes* para tabelas que usam o formato de linha (`row format`) `COMPACT` ou `REDUNDANT`, portanto, para colunas `utf8mb3` ou `utf8mb4`, você pode indexar um máximo de 255 ou 191 caracteres, respectivamente. Se você atualmente tem colunas `utf8mb3` com Indexes mais longos que 191 caracteres, você deve indexar um número menor de caracteres.

  Em uma tabela `InnoDB` que usa o formato de linha `COMPACT` ou `REDUNDANT`, estas definições de coluna e Index são válidas:

  ```sql
  col1 VARCHAR(500) CHARACTER SET utf8, INDEX (col1(255))
  ```

  Para usar `utf8mb4` em vez disso, o Index deve ser menor:

  ```sql
  col1 VARCHAR(500) CHARACTER SET utf8mb4, INDEX (col1(191))
  ```

  Nota

  Para tabelas `InnoDB` que usam o formato de linha `COMPRESSED` ou `DYNAMIC`, você pode habilitar a opção `innodb_large_prefix` para permitir prefixos de *index key* mais longos que 767 *bytes* (até 3072 *bytes*). A criação dessas tabelas também requer os valores de opção `innodb_file_format=barracuda` e `innodb_file_per_table=true`.) Neste caso, habilitar a opção `innodb_large_prefix` permite indexar um máximo de 1024 ou 768 caracteres para colunas `utf8mb3` ou `utf8mb4`, respectivamente. Para informações relacionadas, consulte a Seção 14.23, “Limites do InnoDB”.

Os tipos de alterações precedentes são mais prováveis de serem exigidos apenas se você tiver colunas ou Indexes muito longos. Caso contrário, você deve conseguir converter suas tabelas de `utf8mb3` para `utf8mb4` sem problemas, usando `ALTER TABLE` conforme descrito anteriormente.

Os itens a seguir resumem outras incompatibilidades potenciais:

* `SET NAMES 'utf8mb4'` causa o uso do *character set* de 4 *bytes* para *character sets* de conexão. Enquanto nenhum caractere de 4 *bytes* for enviado do *server*, não deve haver problemas. Caso contrário, aplicações que esperam receber um máximo de três *bytes* por caractere podem ter problemas. Por outro lado, aplicações que esperam enviar caracteres de 4 *bytes* devem garantir que o *server* os entenda.

* Para Replication, se *character sets* que suportam caracteres suplementares forem usados na origem (*source*), todas as réplicas (*replicas*) também devem entendê-los.

  Além disso, tenha em mente o princípio geral de que, se uma tabela tiver definições diferentes na origem (*source*) e na réplica (*replica*), isso pode levar a resultados inesperados. Por exemplo, as diferenças no comprimento máximo do *index key* tornam arriscado usar `utf8mb3` na origem e `utf8mb4` na réplica.

Se você converteu para `utf8mb4`, `utf16`, `utf16le` ou `utf32`, e então decidir converter de volta para `utf8mb3` ou `ucs2` (por exemplo, para fazer *downgrade* para uma versão mais antiga do MySQL), estas considerações se aplicam:

* Dados `utf8mb3` e `ucs2` não devem apresentar problemas.

* O *server* deve ser recente o suficiente para reconhecer definições referentes ao *character set* a partir do qual você está convertendo.

* Para definições de objetos que se referem ao *character set* `utf8mb4`, você pode despejá-los (*dump them*) com **mysqldump** antes de fazer o *downgrade*, editar o arquivo de *dump* para alterar as instâncias de `utf8mb4` para `utf8`, e recarregar o arquivo no *server* mais antigo, desde que não haja caracteres de 4 *bytes* nos dados. O *server* mais antigo vê `utf8` nas definições de objeto do arquivo de *dump* e cria novos objetos que usam o *character set* `utf8` (de 3 *bytes*).