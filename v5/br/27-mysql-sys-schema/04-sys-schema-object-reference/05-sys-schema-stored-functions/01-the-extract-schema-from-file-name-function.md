#### 26.4.5.1 A Função extract_schema_from_file_name()

Dado um nome de caminho de arquivo (*file path name*), retorna o componente do caminho que representa o nome do *schema*. Esta função assume que o nome do arquivo está dentro do diretório do *schema*. Por esta razão, ela não funciona com partições ou tabelas definidas usando sua própria opção de tabela `DATA_DIRECTORY`.

Esta função é útil ao extrair informações de I/O de arquivo do *Performance Schema* que incluem nomes de caminho de arquivo. Ela fornece uma maneira conveniente de exibir nomes de *schema*, que podem ser mais facilmente compreendidos do que nomes de caminho completos, e pode ser usada em *joins* contra nomes de *schema* de objetos.

##### Parâmetros

* `path VARCHAR(512)`: O caminho completo para um arquivo de dados do qual extrair o nome do *schema*.

##### Valor de Retorno

Um valor `VARCHAR(64)`.

##### Exemplo

```sql
mysql> SELECT sys.extract_schema_from_file_name('/usr/local/mysql/data/world/City.ibd');
+---------------------------------------------------------------------------+
| sys.extract_schema_from_file_name('/usr/local/mysql/data/world/City.ibd') |
+---------------------------------------------------------------------------+
| world                                                                     |
+---------------------------------------------------------------------------+
```