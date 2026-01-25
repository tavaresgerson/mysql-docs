#### 8.4.2.2 Otimizando para Tipos de Caractere e String

Para colunas de caractere e string, siga estas diretrizes:

* Use a ordem de binary collation para operações rápidas de comparação e ordenação (sort), quando você não precisar de recursos de collation específicos do idioma. Você pode usar o operador `BINARY` para usar binary collation dentro de uma Query específica.

* Ao comparar valores de colunas diferentes, declare essas colunas com o mesmo character set e collation sempre que possível, para evitar string conversions (conversões de string) durante a execução da Query.

* Para valores de coluna com tamanho inferior a 8KB, use `VARCHAR` binário em vez de `BLOB`. As cláusulas `GROUP BY` e `ORDER BY` podem gerar temporary tables, e essas temporary tables podem usar o storage engine `MEMORY` se a tabela original não contiver nenhuma coluna `BLOB`.

* Se uma tabela contiver colunas string, como nome e endereço, mas muitas Queries não recuperarem essas colunas, considere separar as colunas string em uma tabela separada e usar join queries com uma foreign key quando necessário. Quando o MySQL recupera qualquer valor de uma linha, ele lê um bloco de dados contendo todas as colunas dessa linha (e possivelmente outras linhas adjacentes). Manter cada linha pequena, contendo apenas as colunas mais usadas, permite que mais linhas caibam em cada bloco de dados. Essas tabelas compactas reduzem o I/O de disco e o uso de memória para Queries comuns.

* Ao usar um valor gerado aleatoriamente como uma Primary Key em uma tabela `InnoDB`, prefixe-o com um valor ascendente, como a data e hora atuais, se possível. Quando valores primários consecutivos são armazenados fisicamente próximos uns dos outros, o `InnoDB` pode inseri-los e recuperá-los mais rapidamente.

* Consulte a Seção 8.4.2.1, “Otimizando para Dados Numéricos” para saber as razões pelas quais uma coluna numérica é geralmente preferível a uma coluna string equivalente.
