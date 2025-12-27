### 12.9.8 Conversão entre conjuntos de caracteres Unicode de 3 e 4 bytes

Esta seção descreve os problemas que você pode enfrentar ao converter dados de caracteres entre os conjuntos de caracteres `utf8mb3` e `utf8mb4`.

Nota

Esta discussão foca principalmente na conversão entre `utf8mb3` e `utf8mb4`, mas princípios semelhantes se aplicam à conversão entre o conjunto de caracteres `ucs2` e conjuntos de caracteres como `utf16` ou `utf32`.

Os conjuntos de caracteres `utf8mb3` e `utf8mb4` diferem da seguinte forma:

* `utf8mb3` suporta apenas caracteres na Planilha Multilíngue Básica (BMP). `utf8mb4` suporta adicionalmente caracteres suplementares que estão fora da BMP.

* `utf8mb3` usa um máximo de três bytes por caractere. `utf8mb4` usa um máximo de quatro bytes por caractere.

Nota

Esta discussão refere-se aos nomes dos conjuntos de caracteres `utf8mb3` e `utf8mb4` para ser explícito ao se referir aos dados de conjuntos de caracteres UTF-8 de 3 e 4 bytes.

Uma vantagem da conversão de `utf8mb3` para `utf8mb4` é que isso permite que as aplicações usem caracteres suplementares. Uma compensação é que isso pode aumentar os requisitos de espaço de armazenamento de dados.

Em termos de conteúdo da tabela, a conversão de `utf8mb3` para `utf8mb4` não apresenta problemas:

* Para um caractere da BMP, `utf8mb4` e `utf8mb3` têm características de armazenamento idênticas: mesmos valores de código, mesma codificação, mesma comprimento.

* Para um caractere suplementar, `utf8mb4` requer quatro bytes para armazená-lo, enquanto `utf8mb3` não pode armazenar o caractere de forma alguma. Ao converter colunas `utf8mb3` para `utf8mb4`, você não precisa se preocupar em converter caracteres suplementares porque não há nenhum.

Em termos de estrutura da tabela, essas são as principais incompatibilidades potenciais:

* Para os tipos de dados de caracteres de comprimento variável (`VARCHAR` e os tipos `TEXT`), o comprimento máximo permitido em caracteres é menor para as colunas `utf8mb4` do que para as colunas `utf8mb3`.

* Para todos os tipos de dados de caracteres (`CHAR`, `VARCHAR` e os tipos `TEXT`), o número máximo de caracteres que podem ser indexados é menor para as colunas `utf8mb4` do que para as colunas `utf8mb3`.

Consequentemente, para converter tabelas de `utf8mb3` para `utf8mb4`, pode ser necessário alterar algumas definições de colunas ou índices.

Tabelas podem ser convertidas de `utf8mb3` para `utf8mb4` usando `ALTER TABLE`. Suponha que uma tabela tenha esta definição:

```
CREATE TABLE t1 (
  col1 CHAR(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  col2 CHAR(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL
) CHARACTER SET utf8mb3;
```

A seguinte declaração converte `t1` para usar `utf8mb4`:

```
ALTER TABLE t1
  DEFAULT CHARACTER SET utf8mb4,
  MODIFY col1 CHAR(10)
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  MODIFY col2 CHAR(10)
    CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL;
```

O problema ao converter de `utf8mb3` para `utf8mb4` é que o comprimento máximo de uma coluna ou chave de índice não é alterado em termos de *bytes*. Portanto, é menor em termos de *caracteres* porque o comprimento máximo de um caractere é de quatro bytes em vez de três. Para os tipos de dados `CHAR`, `VARCHAR` e `TEXT`, fique atento a esses problemas ao converter suas tabelas MySQL:

* Verifique todas as definições de colunas `utf8mb3` e certifique-se de que elas não excedam o comprimento máximo para o motor de armazenamento.

* Verifique todos os índices em colunas `utf8mb3` e certifique-se de que eles não excedam o comprimento máximo para o motor de armazenamento. Às vezes, o máximo pode mudar devido a melhorias no motor de armazenamento.

Se as condições anteriores se aplicarem, você deve reduzir o comprimento definido das colunas ou índices, ou continuar usando `utf8mb3` em vez de `utf8mb4`.

Aqui estão alguns exemplos onde podem ser necessárias mudanças estruturais:

* Uma coluna `TINYTEXT` pode armazenar até 255 bytes, podendo, portanto, armazenar até 85 caracteres de 3 bytes ou 63 caracteres de 4 bytes. Suponha que você tenha uma coluna `TINYTEXT` que usa `utf8mb3`, mas que precise conter mais de 63 caracteres. Você não pode convertê-la para `utf8mb4` a menos que também mude o tipo de dados para um tipo mais longo, como `TEXT`.

  Da mesma forma, uma coluna `VARCHAR` muito longa pode precisar ser convertida para um dos tipos `TEXT` mais longos se você quiser convertê-la de `utf8mb3` para `utf8mb4`.

* O `InnoDB` tem um comprimento máximo de índice de 767 bytes para tabelas que usam o formato de linha `COMPACT` ou `REDUNDANT`, portanto, para colunas `utf8mb3` ou `utf8mb4`, você pode indexar um máximo de 255 ou 191 caracteres, respectivamente. Se você atualmente tiver colunas `utf8mb3` com índices maiores que 191 caracteres, você deve indexar um número menor de caracteres.

  Em uma tabela `InnoDB` que usa o formato de linha `COMPACT` ou `REDUNDANT`, essas definições de coluna e índice são legais:

  ```
  col1 VARCHAR(500) CHARACTER SET utf8mb3, INDEX (col1(255))
  ```

  Para usar `utf8mb4` em vez disso, o índice deve ser menor:

  ```
  col1 VARCHAR(500) CHARACTER SET utf8mb4, INDEX (col1(191))
  ```

  Nota

  Para tabelas `InnoDB` que usam o formato de linha `COMPRESSED` ou `DYNAMIC`, prefixos de chaves de índice maiores que 767 bytes (até 3072 bytes) são permitidos. Tabelas criadas com esses formatos de linha permitem que você indexe um máximo de 1024 ou 768 caracteres para colunas `utf8mb3` ou `utf8mb4`, respectivamente. Para informações relacionadas, consulte a Seção 17.21, “Limites do InnoDB” e o Formato de Linha DINÂMICA.

Os tipos de mudanças anteriores provavelmente serão necessários apenas se você tiver colunas ou índices muito longos. Caso contrário, você deve ser capaz de converter suas tabelas de `utf8mb3` para `utf8mb4` sem problemas, usando `ALTER TABLE` como descrito anteriormente.

Os seguintes itens resumem outras incompatibilidades potenciais:

* `SET NAMES 'utf8mb4'` faz com que o conjunto de caracteres de 4 bytes seja usado para os conjuntos de caracteres de conexão. Enquanto não forem enviados caracteres de 4 bytes do servidor, não deverão haver problemas. Caso contrário, as aplicações que esperam receber um máximo de três bytes por caractere podem ter problemas. Por outro lado, as aplicações que esperam enviar caracteres de 4 bytes devem garantir que o servidor os entenda.

* Para a replicação, se conjuntos de caracteres que suportam caracteres suplementares forem usados na fonte, todas as réplicas também devem compreendê-los.

  Além disso, lembre-se do princípio geral de que, se uma tabela tiver definições diferentes na fonte e na réplica, isso pode levar a resultados inesperados. Por exemplo, as diferenças na comprimento máximo da chave do índice tornam arriscado usar `utf8mb3` na fonte e `utf8mb4` na réplica.

Se você tiver convertido para `utf8mb4`, `utf16`, `utf16le` ou `utf32`, e depois decidir converter de volta para `utf8mb3` ou `ucs2` (por exemplo, para descer para uma versão mais antiga do MySQL), essas considerações se aplicam:

* Os dados de `utf8mb3` e `ucs2` não devem apresentar problemas.

* O servidor deve ser recente o suficiente para reconhecer definições que se referem ao conjunto de caracteres do qual você está convertendo.

* Para definições de objetos que se referem ao conjunto de caracteres `utf8mb4`, você pode fazer o dump com **mysqldump** antes de descer, editar o arquivo de dump para alterar as instâncias de `utf8mb4` para `utf8` e recarregar o arquivo no servidor mais antigo, desde que não haja caracteres de 4 bytes nos dados. O servidor mais antigo vê `utf8` nos objetos de definições de dump e cria novos objetos que usam o conjunto de caracteres `utf8` (3 bytes).