#### 26.4.5.1 A função extract_schema_from_file_name()

Dada um nome de caminho de arquivo, retorna o componente de caminho que representa o nome do esquema. Esta função assume que o nome do arquivo está dentro do diretório do esquema. Por essa razão, ela não funciona com partições ou tabelas definidas usando a opção `DATA_DIRECTORY` própria.

Essa função é útil ao extrair informações de E/S de arquivos do Schema de Desempenho que incluem nomes de caminho de arquivo. Ela fornece uma maneira conveniente de exibir nomes de esquemas, que podem ser mais facilmente compreendidos do que nomes de caminhos completos, e pode ser usada em junções contra nomes de esquemas de objetos.

##### Parâmetros

- `path VARCHAR(512)`: O caminho completo para um arquivo de dados a partir do qual extrair o nome do esquema.

##### Valor de retorno

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
