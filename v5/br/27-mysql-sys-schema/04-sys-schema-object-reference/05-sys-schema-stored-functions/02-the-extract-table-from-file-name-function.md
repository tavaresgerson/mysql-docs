#### 26.4.5.2 A Função extract_table_from_file_name()

Dado um nome de *path* de arquivo, retorna o componente do *path* que representa o nome da tabela.

Esta função é útil ao extrair informações de I/O de arquivo do *Performance Schema* que incluem nomes de *path* de arquivo. Ela fornece uma maneira conveniente de exibir nomes de tabelas, que são mais facilmente compreendidos do que nomes de *path* completos, e pode ser usada em *JOINs* contra nomes de tabelas de objeto.

##### Parâmetros

* `path VARCHAR(512)`: O *path* completo para um arquivo de dados do qual extrair o nome da tabela.

##### Valor de Retorno

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