## 18.5 O motor de armazenamento ARCHIVE

O motor de armazenamento `ARCHIVE` produz tabelas de propósito especial que armazenam grandes quantidades de dados não indexados em um espaço muito pequeno.

**Tabela 18.5 Características do mecanismo de armazenamento de ARQUIVO**

<table frame="box" rules="all" summary="Features supported by the ARCHIVE storage engine."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Característica</th> <th>Support</th> </tr></thead><tbody><tr><td>Índices de árvore B</td> <td>No</td> </tr><tr><td>Backup/recuperação em ponto no tempo (implementado no servidor, e não no motor de armazenamento.)</td> <td>Yes</td> </tr><tr><td>Suporte para banco de dados em cluster</td> <td>No</td> </tr><tr><td>Índices agrupados</td> <td>No</td> </tr><tr><td>Dados comprimidos</td> <td>Yes</td> </tr><tr><td>Caches de dados</td> <td>No</td> </tr><tr><td>Dados criptografados</td> <td>Yes (Implemented in the server via encryption functions.)</td> </tr><tr><td>Suporte para chave estrangeira</td> <td>No</td> </tr><tr><td>Indekses de pesquisa de texto completo</td> <td>No</td> </tr><tr><td>Suporte ao tipo de dados geográficos</td> <td>Yes</td> </tr><tr><td>Suporte para indexação geospacial</td> <td>No</td> </tr><tr><td>Indekses de hash</td> <td>No</td> </tr><tr><td>Cache do índice</td> <td>No</td> </tr><tr><td>Granularidade de bloqueio</td> <td>Row</td> </tr><tr><td>MVCC</td> <td>No</td> </tr><tr><td>Suporte à replicação (implementado no servidor, e não no motor de armazenamento.)</td> <td>Yes</td> </tr><tr><td>Limites de armazenamento</td> <td>None</td> </tr><tr><td>Índices T-tree</td> <td>No</td> </tr><tr><td>Transações</td> <td>No</td> </tr><tr><td>Atualize as estatísticas do dicionário de dados</td> <td>Yes</td> </tr></tbody></table>

O motor de armazenamento `ARCHIVE` está incluído nas distribuições binárias do MySQL. Para habilitar este motor de armazenamento se você construir o MySQL a partir do código-fonte, invoque o **CMake** com a opção `-DWITH_ARCHIVE_STORAGE_ENGINE`.

Para examinar a fonte do motor `ARCHIVE`, procure no diretório `storage/archive` de uma distribuição de fonte MySQL.

Você pode verificar se o mecanismo de armazenamento `ARCHIVE` está disponível com a declaração `SHOW ENGINES`.

Quando você cria uma tabela `ARCHIVE`, o mecanismo de armazenamento cria arquivos com nomes que começam com o nome da tabela. O arquivo de dados tem uma extensão de `.ARZ`. Um arquivo `.ARN` pode aparecer durante operações de otimização.

O motor `ARCHIVE` suporta `INSERT`, `REPLACE` e `SELECT`, mas não `DELETE` ou `UPDATE`. Ele suporta operações `ORDER BY`, colunas `BLOB` e tipos de dados espaciais (consulte Seção 13.4.1, “Tipos de Dados Espaciais”). Sistemas de referência espacial geográfica não são suportados. O motor `ARCHIVE` utiliza bloqueio em nível de linha.

O motor `ARCHIVE` suporta o atributo de coluna `AUTO_INCREMENT`. A coluna `AUTO_INCREMENT` pode ter um índice único ou não único. Tentar criar um índice em qualquer outra coluna resulta em um erro. O motor `ARCHIVE` também suporta a opção de tabela `AUTO_INCREMENT` nas declarações `CREATE TABLE` para especificar o valor inicial da sequência para uma nova tabela ou redefinir o valor da sequência para uma tabela existente, respectivamente.

`ARCHIVE` não suporta a inserção de um valor em uma coluna `AUTO_INCREMENT` menor que o valor máximo atual da coluna. Tentativas de fazer isso resultam em um erro `ER_DUP_KEY`.

O motor `ARCHIVE` ignora as colunas `BLOB` se elas não forem solicitadas e as varre em branco ao ler.

O motor de armazenamento `ARCHIVE` não suporta particionamento.

**Armazenamento:** As linhas são compactadas conforme são inseridas. O motor `ARCHIVE` utiliza compressão de dados sem perda `zlib` (ver <http://www.zlib.net/>). Você pode usar `OPTIMIZE TABLE` para analisar a tabela e compactá-la em um formato menor (por um motivo para usar `OPTIMIZE TABLE`, veja mais adiante nesta seção). O motor também suporta [`CHECK TABLE`(check-table.html "15.7.3.2 CHECK TABLE Statement")]. Existem vários tipos de inserções que são usados:

* Uma declaração `INSERT` simplesmente empurra as linhas para um buffer de compressão, e esse buffer é esvaziado conforme necessário. A inserção no buffer é protegida por um bloqueio. Uma declaração `SELECT` força o esvaziamento a ocorrer.

* Um inserto em massa só é visível após ser completado, a menos que outros insertos ocorram ao mesmo tempo, caso em que ele pode ser visto parcialmente. Um `SELECT` nunca causa um flush de um inserto em massa, a menos que um inserto normal ocorra enquanto ele está sendo carregado.

**Recuperação**: Na recuperação, as linhas são descompactadas sob demanda; não há cache de linha. Uma operação `SELECT` realiza uma varredura completa da tabela: Quando ocorre uma `SELECT`, ela descobre quantos registros estão disponíveis atualmente e lê esse número de registros. A `SELECT` é realizada como uma leitura consistente. Observe que muitas declarações `SELECT` durante a inserção podem deteriorar a compactação, a menos que apenas inserções em lote sejam usadas. Para obter uma melhor compactação, você pode usar `OPTIMIZE TABLE` ou `REPAIR TABLE`. O número de linhas nas tabelas `ARCHIVE` relatadas por `SHOW TABLE STATUS` é sempre preciso. Veja a Seção 15.7.3.4, “Declaração OPTIMIZE TABLE”, a Seção 15.7.3.5, “Declaração REPAIR TABLE”, e a Seção 15.7.7.38, “Declaração SHOW TABLE STATUS”.

### Recursos adicionais

* Um fórum dedicado ao motor de armazenamento `ARCHIVE` está disponível em <https://forums.mysql.com/list.php?112>.