#### 30.4.5.2 A função extract_table_from_file_name()

Dado um nome de caminho de arquivo, retorna o componente de caminho que representa o nome da tabela.

Esta função é útil ao extrair informações de E/S de arquivo do Schema de Desempenho que inclui nomes de caminhos de arquivo. Ela fornece uma maneira conveniente de exibir os nomes das tabelas, que podem ser mais facilmente compreendidos do que os nomes completos de caminho, e pode ser usada em junções contra os nomes das tabelas de objetos.

##### Parâmetros

* `path VARCHAR(512)`: O caminho completo de um arquivo de dados a partir do qual extrair o nome da tabela.

##### Valor de retorno

Um valor `VARCHAR(64)`.

##### Exemplo

```
mysql> SELECT sys.extract_table_from_file_name('/usr/local/mysql/data/world/City.ibd');
+--------------------------------------------------------------------------+
| sys.extract_table_from_file_name('/usr/local/mysql/data/world/City.ibd') |
+--------------------------------------------------------------------------+
| City                                                                     |
+--------------------------------------------------------------------------+
```