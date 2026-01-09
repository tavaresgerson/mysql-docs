### 13.3.2 Tipos `CHAR` e `VARCHAR`

Os tipos `CHAR` e `VARCHAR` são semelhantes, mas diferem na forma como são armazenados e recuperados. Eles também diferem no comprimento máximo e se os espaços finais são retidos.

Os tipos `CHAR` e `VARCHAR` são declarados com um comprimento que indica o número máximo de caracteres que você deseja armazenar. Por exemplo, `CHAR(30)` pode armazenar até 30 caracteres.

O comprimento de uma coluna `CHAR` é fixo ao comprimento que você declara ao criar a tabela. O comprimento pode ser qualquer valor de 0 a 255. Quando os valores `CHAR` são armazenados, eles são preenchidos com espaços à direita até o comprimento especificado. Quando os valores `CHAR` são recuperados, os espaços finais são removidos, a menos que o modo SQL `PAD_CHAR_TO_FULL_LENGTH` esteja habilitado.

Os valores nas colunas `VARCHAR` são strings de comprimento variável. O comprimento pode ser especificado como um valor de 0 a 65.535. O comprimento máximo efetivo de um `VARCHAR` está sujeito ao tamanho máximo da linha (65.535 bytes, que é compartilhado entre todas as colunas) e ao conjunto de caracteres usado. Veja a Seção 10.4.7, “Limites no Número de Colunas da Tabela e Tamanho da Linha”.

Em contraste com `CHAR`, os valores `VARCHAR` são armazenados como um prefixo de comprimento de 1 ou 2 bytes mais dados. O prefixo de comprimento indica o número de bytes no valor. Uma coluna usa um byte de comprimento se os valores não excederem 255 bytes, dois bytes de comprimento se os valores podem exceder 255 bytes.

Se o modo SQL rigoroso não estiver habilitado e você atribuir um valor a uma coluna `CHAR` ou `VARCHAR` que exceda o comprimento máximo da coluna, o valor é truncado para caber e um aviso é gerado. Para a truncagem de caracteres não espaços, você pode causar um erro (em vez de um aviso) e suprimir a inserção do valor usando o modo SQL rigoroso. Veja a Seção 7.1.11, “Modos SQL do Servidor”.

Para as colunas `VARCHAR`, os espaços em branco finais que excedam o comprimento da coluna são truncados antes da inserção e um aviso é gerado, independentemente do modo SQL em uso. Para as colunas `CHAR`, o truncamento dos espaços em branco finais excessivos dos valores inseridos é realizado silenciosamente, independentemente do modo SQL.

Os valores `VARCHAR` não são preenchidos quando armazenados. Os espaços em branco finais são retidos quando os valores são armazenados e recuperados, de acordo com o SQL padrão.

A tabela a seguir ilustra as diferenças entre `CHAR` e `VARCHAR`, mostrando o resultado da armazenagem de vários valores de string em colunas `CHAR(4)` e `VARCHAR(4)` (assumindo que a coluna utiliza um conjunto de caracteres de um único byte, como `latin1`).

<table summary="Ilustração da diferença entre os requisitos de armazenamento de CHAR e VARCHAR, mostrando o armazenamento necessário para vários valores de string em colunas CHAR(4) e VARCHAR(4)."><col style="width: 15%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 15%"/><col style="width: 20%"/><thead><tr> <th>Valor</th> <th><code>CHAR(4)</code></th> <th>Armazenamento Necessário</th> <th><code>VARCHAR(4)</code></th> <th>Armazenamento Necessário</th> </tr></thead><tbody><tr> <th><code>''</code></th> <td><code>'    '</code></td> <td>4 bytes</td> <td><code>''</code></td> <td>1 byte</td> </tr><tr> <th><code>'ab'</code></th> <td><code>'ab  '</code></td> <td>4 bytes</td> <td><code>'ab'</code></td> <td>3 bytes</td> </tr><tr> <th><code>'abcd'</code></th> <td><code>'abcd'</code></td> <td>4 bytes</td> <td><code>'abcd'</code></td> <td>5 bytes</td> </tr><tr> <th><code>'abcdefgh'</code></th> <td><code>'abcd'</code></td> <td>4 bytes</td> <td><code>'abcd'</code></td> <td>5 bytes</td> </tr></tbody></table>

Os valores mostrados como armazenados na última linha da tabela se aplicam *apenas quando não estiver usando o modo SQL rigoroso*; se o modo rigoroso estiver ativado, os valores que excedem o comprimento da coluna *não são armazenados* e resulta em um erro.

O `InnoDB` codifica campos de comprimento fixo maiores ou iguais a 768 bytes como campos de comprimento variável, que podem ser armazenados fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo do byte do conjunto de caracteres for maior que 3, como no caso do `utf8mb4`.

Se um valor específico for armazenado nas colunas `CHAR(4)` e `VARCHAR(4)`, os valores recuperados das colunas nem sempre serão os mesmos, pois os espaços finais são removidos das colunas `CHAR` durante a recuperação. O exemplo a seguir ilustra essa diferença:

```
mysql> CREATE TABLE vc (v VARCHAR(4), c CHAR(4));
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO vc VALUES ('ab  ', 'ab  ');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT CONCAT('(', v, ')'), CONCAT('(', c, ')') FROM vc;
+---------------------+---------------------+
| CONCAT('(', v, ')') | CONCAT('(', c, ')') |
+---------------------+---------------------+
| (ab  )              | (ab)                |
+---------------------+---------------------+
1 row in set (0.06 sec)
```

Os valores nas colunas `CHAR`, `VARCHAR` e `TEXT` são ordenados e comparados de acordo com a ordenação do conjunto de caracteres atribuída à coluna.

As ordenações do MySQL têm um atributo `PAD SPACE`, exceto as ordenações Unicode baseadas na UCA 9.0.0 e superiores, que têm um atributo `PAD NO PAD`. (consulte Seção 12.10.1, “Conjunto de Caracteres Unicode”).

Para determinar o atributo `PAD` de uma ordenação, use a tabela `COLLATIONS` do `INFORMATION_SCHEMA`, que tem uma coluna `PAD_ATTRIBUTE`.

Para strings não binárias (`CHAR`, `VARCHAR` e `TEXT`), o atributo de padronização da ordenação da string determina o tratamento em comparações de espaços finais no final das strings. As ordenações `NO PAD` tratam os espaços finais como significativos em comparações, como qualquer outro caractere. As ordenações `PAD SPACE` tratam os espaços finais como insignificantes em comparações; as strings são comparadas sem considerar os espaços finais. Veja o tratamento de espaços finais em comparações. O modo SQL do servidor não tem efeito no comportamento de comparação em relação aos espaços finais.

Nota

Para obter mais informações sobre os conjuntos de caracteres e as colorações do MySQL, consulte o Capítulo 12, *Conjunto de caracteres, colorações, Unicode*. Para obter informações adicionais sobre os requisitos de armazenamento, consulte a Seção 13.7, “Requisitos de armazenamento de tipos de dados”.

Nos casos em que os caracteres de preenchimento finais são removidos ou as comparações os ignoram, se uma coluna tiver um índice que exija valores únicos, inserir valores na coluna que diferem apenas no número de caracteres de preenchimento final resulta em um erro de chave duplicada. Por exemplo, se uma tabela contiver `'a'`, uma tentativa de armazenar `'a '` causa um erro de chave duplicada.