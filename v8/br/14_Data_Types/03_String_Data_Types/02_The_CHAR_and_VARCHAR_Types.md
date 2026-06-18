### 13.3.2 Tipos CHAR e VARCHAR

Os tipos `CHAR` e `VARCHAR` são semelhantes, mas diferem na forma como são armazenados e recuperados. Eles também diferem no comprimento máximo e se os espaços finais são mantidos.

Os tipos `CHAR` e `VARCHAR` são declarados com um comprimento que indica o número máximo de caracteres que você deseja armazenar. Por exemplo, `CHAR(30)` pode armazenar até 30 caracteres.

O comprimento de uma coluna `CHAR` é fixo ao comprimento que você declara ao criar a tabela. O comprimento pode ser qualquer valor de 0 a 255. Quando os valores de `CHAR` são armazenados, eles são preenchidos com espaços à direita até o comprimento especificado. Quando os valores de `CHAR` são recuperados, os espaços finais são removidos, a menos que o modo SQL `PAD_CHAR_TO_FULL_LENGTH` esteja habilitado.

Os valores nas colunas `VARCHAR` são cadeias de caracteres de comprimento variável. O comprimento pode ser especificado como um valor entre 0 e 65.535. O comprimento máximo efetivo de um `VARCHAR` está sujeito ao tamanho máximo da linha (65.535 bytes, que é compartilhado entre todas as colunas) e ao conjunto de caracteres utilizado. Consulte a Seção 10.4.7, “Limites de Contagem de Colunas da Tabela e Tamanho da Linha”.

Em contraste com `CHAR`, os valores de `VARCHAR` são armazenados como um prefixo de comprimento de 1 ou 2 bytes mais os dados. O prefixo de comprimento indica o número de bytes no valor. Uma coluna usa um byte de comprimento se os valores não exijam mais de 255 bytes, dois bytes de comprimento se os valores podem exigir mais de 255 bytes.

Se o modo SQL rigoroso não estiver habilitado e você atribuir um valor a uma coluna `CHAR` ou `VARCHAR` que exceda o comprimento máximo da coluna, o valor será truncado para caber e um aviso será gerado. Para o truncamento de caracteres que não são espaços, você pode causar um erro (em vez de um aviso) e suprimir a inserção do valor usando o modo SQL rigoroso. Veja a Seção 7.1.11, “Modos SQL do Servidor”.

Para as colunas `VARCHAR`, espaços em branco excessivos além do comprimento da coluna são truncados antes da inserção e um aviso é gerado, independentemente do modo SQL em uso. Para as colunas `CHAR`, o truncamento de espaços em branco excessivos dos valores inseridos é feito silenciosamente, independentemente do modo SQL.

Os valores de `VARCHAR` não são preenchidos quando armazenados. Espaços finais são mantidos quando os valores são armazenados e recuperados, de acordo com o SQL padrão.

A tabela a seguir ilustra as diferenças entre `CHAR` e `VARCHAR`, mostrando o resultado da armazenagem de vários valores de string nas colunas `CHAR(4)` e `VARCHAR(4)` (assumindo que a coluna utiliza um conjunto de caracteres de um byte, como `latin1`).

<table summary="Ilustração da diferença entre os requisitos de armazenamento de CHAR e VARCHAR, mostrando o armazenamento necessário para vários valores de string nas colunas CHAR(4) e VARCHAR(4)."><thead><tr> <th scope="col">Valor</th> <th scope="col">[[PH_HTML_CODE_<code>'abcd'</code>]</th> <th scope="col">Armazenamento necessário</th> <th scope="col">[[PH_HTML_CODE_<code>'abcd'</code>]</th> <th scope="col">Armazenamento necessário</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>'abcd'</code>]</th> <td>[[PH_HTML_CODE_<code>'abcd'</code>]</td> <td>4 bytes</td> <td>[[<code>''</code>]]</td> <td>1 byte</td> </tr><tr> <th>[[<code>'ab'</code>]]</th> <td>[[<code>'ab  '</code>]]</td> <td>4 bytes</td> <td>[[<code>'ab'</code>]]</td> <td>3 bytes</td> </tr><tr> <th>[[<code>'abcd'</code>]]</th> <td>[[<code>'abcd'</code>]]</td> <td>4 bytes</td> <td>[[<code>'abcd'</code>]]</td> <td>5 bytes</td> </tr><tr> <th>[[<code>VARCHAR(4)</code><code>'abcd'</code>]</th> <td>[[<code>'abcd'</code>]]</td> <td>4 bytes</td> <td>[[<code>'abcd'</code>]]</td> <td>5 bytes</td> </tr></tbody></table>

Os valores mostrados como armazenados na última linha da tabela *aplicam-se apenas quando não estiver usando o modo SQL rigoroso*; se o modo rigoroso estiver ativado, os valores que excederem o comprimento da coluna *não são armazenados* e um erro é gerado.

`InnoDB` codifica campos de comprimento fixo maior ou igual a 768 bytes como campos de comprimento variável, que podem ser armazenados fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo de byte do conjunto de caracteres for maior que 3, como no caso de `utf8mb4`.

Se um valor específico for armazenado nas colunas `CHAR(4)` e `VARCHAR(4)`, os valores recuperados das colunas nem sempre são os mesmos, pois os espaços finais são removidos das colunas `CHAR` durante a recuperação. O exemplo a seguir ilustra essa diferença:

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

As colorações do MySQL têm um atributo de `PAD SPACE`, diferente das colorações Unicode baseadas na UCA 9.0.0 e superior, que têm um atributo de `NO PAD` (consulte a Seção 12.10.1, “Conjunto de Caracteres Unicode”).

Para determinar o atributo do suporte para uma colagem, use a tabela `INFORMATION_SCHEMA` `COLLATIONS`, que possui uma coluna `PAD_ATTRIBUTE`.

Para cadeias não binárias (os valores `CHAR`, `VARCHAR` e `TEXT`), o atributo pad de ordenação da cadeia determina o tratamento em comparações de espaços finais nas cadeias. As ordenações `NO PAD` tratam os espaços finais como significativos em comparações, como qualquer outro caractere. As ordenações `PAD SPACE` tratam os espaços finais como insignificantes em comparações; as cadeias são comparadas sem considerar os espaços finais. Veja o tratamento de espaços finais em comparações. O modo SQL do servidor não tem efeito no comportamento de comparação em relação aos espaços finais.

Nota

Para obter mais informações sobre os conjuntos de caracteres e as colatações do MySQL, consulte o Capítulo 12, *Conjunto de caracteres, colatações, Unicode*. Para informações adicionais sobre os requisitos de armazenamento, consulte a Seção 13.7, “Requisitos de armazenamento de tipos de dados”.

Nos casos em que os caracteres de preenchimento são removidos ou as comparações os ignoram, se uma coluna tiver um índice que exige valores únicos, inserir valores na coluna que diferem apenas no número de caracteres de preenchimento resulta em um erro de chave duplicada. Por exemplo, se uma tabela contém `'a'`, uma tentativa de armazenar `'a '` causa um erro de chave duplicada.
