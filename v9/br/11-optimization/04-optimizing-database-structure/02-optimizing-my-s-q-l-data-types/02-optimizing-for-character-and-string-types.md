#### 10.4.2.2 Otimizando para Tipos de Caracteres e Strings

Para colunas de caracteres e strings, siga estas diretrizes:

* Use a ordem de ordenação binária para comparações e operações de ordenação rápidas, quando você não precisar de recursos de ordenação específicos para o idioma. Você pode usar o operador `BINARY` para usar a ordenação binária em uma consulta específica.

* Ao comparar valores de colunas diferentes, declare essas colunas com o mesmo conjunto de caracteres e ordenação sempre que possível, para evitar conversões de strings durante a execução da consulta.

* Para valores de colunas menores que 8 KB, use `VARCHAR` binário em vez de `BLOB`. As cláusulas `GROUP BY` e `ORDER BY` podem gerar tabelas temporárias, e essas tabelas temporárias podem usar o mecanismo de armazenamento `MEMORY` se a tabela original não contiver colunas `BLOB`.

* Se uma tabela contiver colunas de string como nome e endereço, mas muitas consultas não recuperem essas colunas, considere dividir as colunas de string em uma tabela separada e usar consultas de junção com uma chave estrangeira quando necessário. Quando o MySQL recupera qualquer valor de uma linha, ele lê um bloco de dados contendo todas as colunas daquela linha (e possivelmente outras linhas adjacentes). Manter cada linha pequena, com apenas as colunas mais usadas, permite que mais linhas sejam inseridas em cada bloco de dados. Tais tabelas compactas reduzem o I/O de disco e o uso de memória para consultas comuns.

* Quando você usa um valor gerado aleatoriamente como chave primária em uma tabela `InnoDB`, prefixe-o com um valor ascendente, como a data e hora atuais, se possível. Quando valores primários consecutivos são armazenados fisicamente próximos uns dos outros, o `InnoDB` pode inserir e recuperar-los mais rapidamente.

* Veja a Seção 10.4.2.1, “Otimizando para Dados Numéricos” para entender por que uma coluna numérica é geralmente preferível a uma coluna de string equivalente.