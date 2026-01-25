### 10.9.8 Conversão Entre Conjuntos de Caracteres Unicode de 3 e 4 Bytes

Esta seção descreve problemas que você pode enfrentar ao converter dados de caracteres entre os conjuntos de caracteres `utf8mb3` e `utf8mb4`.

Nota

Esta discussão se concentra principalmente na conversão entre `utf8mb3` e `utf8mb4`, mas princípios semelhantes se aplicam à conversão entre o conjunto de caracteres `ucs2` e conjuntos de caracteres como `utf16` ou `utf32`.

Os conjuntos de caracteres `utf8mb3` e `utf8mb4` diferem da seguinte forma:

* `utf8mb3` suporta apenas caracteres no Basic Multilingual Plane (BMP). `utf8mb4` suporta adicionalmente caracteres suplementares que se encontram fora do BMP.
* `utf8mb3` usa um máximo de três bytes por caractere. `utf8mb4` usa um máximo de quatro bytes por caractere.

Nota

Esta discussão se refere aos nomes dos conjuntos de caracteres `utf8mb3` e `utf8mb4` para ser explícita sobre a referência a dados de conjuntos de caracteres UTF-8 de 3 e 4 bytes. A exceção é que, em definições de tabela, `utf8` é usado porque o MySQL converte instâncias de `utf8mb3` especificadas nessas definições para `utf8`, que é um alias para `utf8mb3`.

Uma vantagem de converter de `utf8mb3` para `utf8mb4` é que isso permite que aplicações usem caracteres suplementares. Uma desvantagem (tradeoff) é que isso pode aumentar os requisitos de espaço de armazenamento de dados.

Em termos de conteúdo da tabela, a conversão de `utf8mb3` para `utf8mb4` não apresenta problemas:

* Para um caractere BMP, `utf8mb4` e `utf8mb3` têm características de armazenamento idênticas: mesmos valores de código, mesma codificação, mesmo comprimento.
* Para um caractere suplementar, `utf8mb4` requer quatro bytes para armazená-lo, enquanto `utf8mb3` não pode armazenar o caractere. Ao converter colunas `utf8mb3` para `utf8mb4`, você não precisa se preocupar em converter caracteres suplementares porque não existem.

Em termos de estrutura da tabela, estas são as principais incompatibilidades potenciais:

* Para os tipos de dados de caracteres de comprimento variável (`VARCHAR` e os tipos `TEXT`), o comprimento máximo permitido em caracteres é menor para colunas `utf8mb4` do que para colunas `utf8mb3`.
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

O problema ao converter de `utf8mb3` para `utf8mb4` é que o comprimento máximo de uma coluna ou chave de Index permanece inalterado em termos de *bytes*. Portanto, é menor em termos de *caracteres*, pois o comprimento máximo de um caractere é de quatro bytes em vez de três. Para os tipos de dados `CHAR`, `VARCHAR` e `TEXT`, preste atenção a estes problemas ao converter suas tabelas MySQL:

* Verifique todas as definições de colunas `utf8mb3` e certifique-se de que não excedam o comprimento máximo para o storage engine.
* Verifique todos os Indexes em colunas `utf8mb3` e certifique-se de que não excedam o comprimento máximo para o storage engine. Às vezes, o máximo pode mudar devido a aprimoramentos no storage engine.

Se as condições precedentes se aplicarem, você deve reduzir o comprimento definido das colunas ou Indexes, ou continuar a usar `utf8mb3` em vez de `utf8mb4`.

Aqui estão alguns exemplos onde mudanças estruturais podem ser necessárias:

* Uma coluna `TINYTEXT` pode conter até 255 bytes, portanto, pode conter até 85 caracteres de 3 bytes ou 63 caracteres de 4 bytes. Suponha que você tenha uma coluna `TINYTEXT` que use `utf8mb3`, mas que precise ser capaz de conter mais de 63 caracteres. Você não pode convertê-la para `utf8mb4`, a menos que também altere o tipo de dado para um tipo mais longo, como `TEXT`.

  Similarmente, uma coluna `VARCHAR` muito longa pode precisar ser alterada para um dos tipos `TEXT` mais longos se você quiser convertê-la de `utf8mb3` para `utf8mb4`.

* `InnoDB` tem um comprimento máximo de Index de 767 bytes para tabelas que usam o formato de linha `COMPACT` ou `REDUNDANT`, então para colunas `utf8mb3` ou `utf8mb4`, você pode indexar um máximo de 255 ou 191 caracteres, respectivamente. Se você atualmente tem colunas `utf8mb3` com Indexes maiores que 191 caracteres, você deve indexar um número menor de caracteres.

  Em uma tabela `InnoDB` que usa o formato de linha `COMPACT` ou `REDUNDANT`, estas definições de coluna e Index são legais:

  ```sql
  col1 VARCHAR(500) CHARACTER SET utf8, INDEX (col1(255))
  ```

  Para usar `utf8mb4` em vez disso, o Index deve ser menor:

  ```sql
  col1 VARCHAR(500) CHARACTER SET utf8mb4, INDEX (col1(191))
  ```

  Nota

  Para tabelas `InnoDB` que usam o formato de linha `COMPRESSED` ou `DYNAMIC`, você pode habilitar a opção `innodb_large_prefix` para permitir prefixos de chave de Index maiores que 767 bytes (até 3072 bytes). A criação de tais tabelas também requer os valores de opção `innodb_file_format=barracuda` e `innodb_file_per_table=true`.) Neste caso, habilitar a opção `innodb_large_prefix` permite indexar um máximo de 1024 ou 768 caracteres para colunas `utf8mb3` ou `utf8mb4`, respectivamente. Para informações relacionadas, consulte a Seção 14.23, “Limites do InnoDB”.

Os tipos de alterações precedentes são mais propensos a serem necessários apenas se você tiver colunas ou Indexes muito longos. Caso contrário, você deve ser capaz de converter suas tabelas de `utf8mb3` para `utf8mb4` sem problemas, usando `ALTER TABLE` conforme descrito anteriormente.

Os seguintes itens resumem outras incompatibilidades potenciais:

* `SET NAMES 'utf8mb4'` causa o uso do conjunto de caracteres de 4 bytes para conjuntos de caracteres de conexão. Enquanto nenhum caractere de 4 bytes for enviado do server, não deverá haver problemas. Caso contrário, aplicações que esperam receber um máximo de três bytes por caractere podem ter problemas. Inversamente, aplicações que esperam enviar caracteres de 4 bytes devem garantir que o server os entenda.

* Para Replication, se conjuntos de caracteres que suportam caracteres suplementares forem usados na source, todas as replicas também devem entendê-los.

  Além disso, tenha em mente o princípio geral de que, se uma tabela tiver definições diferentes na source e na replica, isso pode levar a resultados inesperados. Por exemplo, as diferenças no comprimento máximo da chave de Index tornam arriscado usar `utf8mb3` na source e `utf8mb4` na replica.

Se você converteu para `utf8mb4`, `utf16`, `utf16le` ou `utf32`, e então decidir converter de volta para `utf8mb3` ou `ucs2` (por exemplo, para fazer o downgrade para uma versão mais antiga do MySQL), estas considerações se aplicam:

* Dados `utf8mb3` e `ucs2` não devem apresentar problemas.

* O server deve ser recente o suficiente para reconhecer definições referentes ao conjunto de caracteres do qual você está convertendo.

* Para definições de objeto que se referem ao conjunto de caracteres `utf8mb4`, você pode despejá-los com **mysqldump** antes do downgrade, editar o arquivo dump para alterar instâncias de `utf8mb4` para `utf8`, e recarregar o arquivo no server mais antigo, desde que não haja caracteres de 4 bytes nos dados. O server mais antigo vê `utf8` nas definições de objeto do arquivo dump e cria novos objetos que usam o conjunto de caracteres `utf8` (de 3 bytes).