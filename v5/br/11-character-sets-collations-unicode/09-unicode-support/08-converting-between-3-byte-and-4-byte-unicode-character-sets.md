### 10.9.8 Conversão entre conjuntos de caracteres Unicode de 3 e 4 bytes

Esta seção descreve os problemas que você pode enfrentar ao converter dados de caracteres entre os conjuntos de caracteres `utf8mb3` e `utf8mb4`.

Nota

Esta discussão foca principalmente na conversão entre `utf8mb3` e `utf8mb4`, mas princípios semelhantes se aplicam à conversão entre o conjunto de caracteres `ucs2` e conjuntos de caracteres como `utf16` ou `utf32`.

Os conjuntos de caracteres `utf8mb3` e `utf8mb4` diferem da seguinte forma:

- O `utf8mb3` suporta apenas caracteres do Plano Multilíngue Básico (BMP). O `utf8mb4`, além disso, suporta caracteres suplementares que estão fora do BMP.

- O `utf8mb3` usa no máximo três bytes por caractere. O `utf8mb4` usa no máximo quatro bytes por caractere.

Nota

Esta discussão se refere aos nomes dos conjuntos de caracteres `utf8mb3` e `utf8mb4` para ser explícito ao se referir aos dados de conjuntos de caracteres UTF-8 de 3 e 4 bytes, respectivamente. A exceção é que, nas definições de tabelas, o `utf8` é usado porque o MySQL converte instâncias de `utf8mb3` especificadas nessas definições para `utf8`, que é um alias para `utf8mb3`.

Uma vantagem de converter do `utf8mb3` para `utf8mb4` é que isso permite que as aplicações usem caracteres suplementares. Uma compensação é que isso pode aumentar os requisitos de espaço de armazenamento de dados.

Em termos de conteúdo da tabela, a conversão de `utf8mb3` para `utf8mb4` não apresenta problemas:

- Para um caractere BMP, `utf8mb4` e `utf8mb3` têm características de armazenamento idênticas: os mesmos valores de código, mesma codificação, mesma extensão.

- Para um caractere suplementar, o `utf8mb4` requer quatro bytes para armazená-lo, enquanto o `utf8mb3` não consegue armazenar o caractere de forma alguma. Ao converter colunas `utf8mb3` para `utf8mb4`, você não precisa se preocupar em converter caracteres suplementares, pois não há nenhum.

Em termos de estrutura de tabela, essas são as principais incompatibilidades potenciais:

- Para os tipos de dados de caracteres de comprimento variável (`VARCHAR` e os tipos `TEXT`), o comprimento máximo permitido em caracteres é menor para as colunas `utf8mb4` do que para as colunas `utf8mb3`.

- Para todos os tipos de dados de caracteres (`CHAR`, `VARCHAR` e os tipos `TEXT`), o número máximo de caracteres que podem ser indexados é menor para as colunas `utf8mb4` do que para as colunas `utf8mb3`.

Consequentemente, para converter tabelas de `utf8mb3` para `utf8mb4`, pode ser necessário alterar algumas definições de colunas ou índices.

As tabelas podem ser convertidas de `utf8mb3` para `utf8mb4` usando `ALTER TABLE`. Suponha que uma tabela tenha esta definição:

```sql
CREATE TABLE t1 (
  col1 CHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  col2 CHAR(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) CHARACTER SET utf8;
```

A seguinte declaração converte `t1` para usar `utf8mb4`:

```sql
ALTER TABLE t1
  DEFAULT CHARACTER SET utf8mb4,
  MODIFY col1 CHAR(10)
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  MODIFY col2 CHAR(10)
    CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL;
```

O problema ao converter de `utf8mb3` para `utf8mb4` é que o comprimento máximo de uma coluna ou chave de índice não muda em termos de *bytes*. Portanto, é menor em termos de *caracteres* porque o comprimento máximo de um caractere é de quatro bytes, em vez de três. Para os tipos de dados `CHAR`, `VARCHAR` e `TEXT`, fique atento a esses problemas ao converter suas tabelas MySQL:

- Verifique todas as definições das colunas `utf8mb3` e certifique-se de que elas não excedam o comprimento máximo do motor de armazenamento.

- Verifique todos os índices nas colunas `utf8mb3` e certifique-se de que eles não excedam o comprimento máximo do motor de armazenamento. Às vezes, o máximo pode mudar devido a melhorias no motor de armazenamento.

Se as condições anteriores se aplicarem, você deve reduzir o comprimento definido das colunas ou índices, ou continuar usando `utf8mb3` em vez de `utf8mb4`.

Aqui estão alguns exemplos em que podem ser necessárias mudanças estruturais:

- Uma coluna `TINYTEXT` pode armazenar até 255 bytes, portanto, pode armazenar até 85 caracteres de 3 bytes ou 63 caracteres de 4 bytes. Suponha que você tenha uma coluna `TINYTEXT` que usa `utf8mb3`, mas deve ser capaz de conter mais de 63 caracteres. Você não pode convertê-la para `utf8mb4`, a menos que também mude o tipo de dados para um tipo mais longo, como `TEXT`.

  Da mesma forma, uma coluna `VARCHAR` muito longa pode precisar ser alterada para um dos tipos `TEXT` mais longos se você quiser convertê-la de `utf8mb3` para `utf8mb4`.

- O `InnoDB` tem um comprimento máximo de índice de 767 bytes para tabelas que usam o formato de linha `COMPACT` ou `REDUNDANT`, portanto, para colunas `utf8mb3` ou `utf8mb4`, você pode indexar um máximo de 255 ou 191 caracteres, respectivamente. Se você atualmente tiver colunas `utf8mb3` com índices maiores que 191 caracteres, você deve indexar um número menor de caracteres.

  Em uma tabela `InnoDB` que usa o formato de linha `COMPACT` ou `REDUNDANT`, essas definições de coluna e índice são válidas:

  ```sql
  col1 VARCHAR(500) CHARACTER SET utf8, INDEX (col1(255))
  ```

  Para usar `utf8mb4` em vez disso, o índice deve ser menor:

  ```sql
  col1 VARCHAR(500) CHARACTER SET utf8mb4, INDEX (col1(191))
  ```

  Nota

  Para tabelas `InnoDB` que usam o formato de linha `COMPRESSED` ou `DYNAMIC`, você pode habilitar a opção `innodb_large_prefix` para permitir prefixos de chaves de índice maiores que 767 bytes (até 3072 bytes). A criação dessas tabelas também requer os valores das opções `innodb_file_format=barracuda` e `innodb_file_per_table=true`.) Neste caso, habilitar a opção `innodb_large_prefix` permite indexar um máximo de 1024 ou 768 caracteres para as colunas `utf8mb3` ou `utf8mb4`, respectivamente. Para informações relacionadas, consulte a Seção 14.23, “Limites do InnoDB”.

Os tipos de alterações anteriores provavelmente só serão necessários se você tiver colunas ou índices muito longos. Caso contrário, você poderá converter suas tabelas de `utf8mb3` para `utf8mb4` sem problemas, usando `ALTER TABLE` conforme descrito anteriormente.

Os itens a seguir resumem outras possíveis incompatibilidades:

- `SET NAMES 'utf8mb4'` faz com que o conjunto de caracteres de 4 bytes seja usado para os conjuntos de caracteres de conexão. Enquanto não forem enviados caracteres de 4 bytes do servidor, não deverão haver problemas. Caso contrário, as aplicações que esperam receber um máximo de três bytes por caractere podem ter problemas. Por outro lado, as aplicações que esperam enviar caracteres de 4 bytes devem garantir que o servidor os entenda.

- Para a replicação, se os conjuntos de caracteres que suportam caracteres suplementares forem usados na fonte, todas as réplicas devem compreendê-los também.

  Além disso, tenha em mente o princípio geral de que, se uma tabela tiver definições diferentes na fonte e na replica, isso pode levar a resultados inesperados. Por exemplo, as diferenças na comprimento máximo da chave do índice tornam arriscado o uso de `utf8mb3` na fonte e `utf8mb4` na replica.

Se você tiver convertido para `utf8mb4`, `utf16`, `utf16le` ou `utf32` e depois decidir converter de volta para `utf8mb3` ou `ucs2` (por exemplo, para descer para uma versão mais antiga do MySQL), essas considerações se aplicam:

- Os dados `utf8mb3` e `ucs2` não devem apresentar problemas.

- O servidor deve ser recente o suficiente para reconhecer definições que se referem ao conjunto de caracteres a partir do qual você está convertendo.

- Para definições de objetos que se referem ao conjunto de caracteres `utf8mb4`, você pode fazer o dump com o **mysqldump** antes de fazer o downgrade, editar o arquivo de dump para alterar as instâncias de `utf8mb4` para `utf8` e recarregar o arquivo no servidor mais antigo, desde que não haja caracteres de 4 bytes nos dados. O servidor mais antigo vê `utf8` no arquivo de dump das definições de objetos e cria novos objetos que usam o conjunto de caracteres `utf8` (de 3 bytes).
