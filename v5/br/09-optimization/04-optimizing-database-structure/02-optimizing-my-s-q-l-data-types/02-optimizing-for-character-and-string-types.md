#### 8.4.2.2 Otimização para tipos de caracteres e strings

Para as colunas de caracteres e strings, siga estas diretrizes:

- Use a ordem de ordenação binária para operações de comparação e ordenação rápidas, quando você não precisa de recursos de ordenação específicos para o idioma. Você pode usar o operador `BINARY` para usar a ordenação binária em uma consulta específica.

- Ao comparar valores de diferentes colunas, declare essas colunas com o mesmo conjunto de caracteres e ordenação sempre que possível, para evitar conversões de strings durante a execução da consulta.

- Para valores de coluna menores que 8 KB, use `VARCHAR` binário em vez de `BLOB`. As cláusulas `GROUP BY` e `ORDER BY` podem gerar tabelas temporárias, e essas tabelas temporárias podem usar o mecanismo de armazenamento `MEMORY` se a tabela original não contiver nenhuma coluna `BLOB`.

- Se uma tabela contiver colunas de texto, como nome e endereço, mas muitas consultas não recuperarem essas colunas, considere dividir as colunas de texto em uma tabela separada e usar consultas de junção com uma chave estrangeira, quando necessário. Quando o MySQL recupera qualquer valor de uma linha, ele lê um bloco de dados que contém todas as colunas daquela linha (e possivelmente outras linhas adjacentes). Manter cada linha pequena, com apenas as colunas mais frequentemente usadas, permite que mais linhas sejam inseridas em cada bloco de dados. Tais tabelas compactas reduzem o I/O de disco e o uso de memória para consultas comuns.

- Quando você usa um valor gerado aleatoriamente como chave primária em uma tabela `InnoDB`, prefixá-lo com um valor ascendente, como a data e hora atuais, se possível. Quando valores primários consecutivos são armazenados fisicamente próximos uns dos outros, o `InnoDB` pode inseri-los e recuperá-los mais rapidamente.

- Consulte a Seção 8.4.2.1, “Otimização para Dados Numéricos”, para entender as razões pelas quais uma coluna numérica é geralmente preferível a uma coluna de texto equivalente.
