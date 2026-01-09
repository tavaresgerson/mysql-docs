#### 26.4.5.2 A função extract_table_from_file_name()

Dada um nome de caminho de arquivo, retorna o componente de caminho que representa o nome da tabela.

Essa função é útil ao extrair informações de E/S de arquivos do Gerenciamento de Desempenho que incluem nomes de caminho de arquivo. Ela fornece uma maneira conveniente de exibir nomes de tabelas, que podem ser mais facilmente compreendidos do que nomes de caminhos completos, e pode ser usada em junções contra nomes de tabelas de objetos.

##### Parâmetros

- `path VARCHAR(512)`: O caminho completo para um arquivo de dados a partir do qual extrair o nome da tabela.

##### Valor de retorno

Um valor `VARCHAR(64)`.

##### Exemplo

```sql
mysql> SELECT sys.extract_table_from_file_name('/usr/local/mysql/data/world/City.ibd');
+--------------------------------------------------------------------------+
| sys.extract_table_from_file_name('/usr/local/mysql/data/world/City.ibd') |
+--------------------------------------------------------------------------+
| City                                                                     |
+--------------------------------------------------------------------------+
```
