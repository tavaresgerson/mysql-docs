## 15.5 O Motor de Armazenamento ARCHIVE

O motor de armazenamento `ARCHIVE` produz tabelas de propósito especial que armazenam grandes quantidades de dados não indexados em um espaço muito pequeno.

**Tabela 15.5 Características do Motor de Armazenamento ARQUIVO**

<table frame="box" rules="all" summary="Features supported by the ARCHIVE storage engine."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Característica</th> <th>Support</th> </tr></thead><tbody><tr><td><strong>Índices de árvore B</strong></td> <td>No</td> </tr><tr><td><strong>Backup/recuperação em ponto no tempo</strong>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Yes</td> </tr><tr><td><strong>Suporte para banco de dados em cluster</strong></td> <td>No</td> </tr><tr><td><strong>Índices agrupados</strong></td> <td>No</td> </tr><tr><td><strong>Dados comprimidos</strong></td> <td>Yes</td> </tr><tr><td><strong>Caches de dados</strong></td> <td>No</td> </tr><tr><td><strong>Dados criptografados</strong></td> <td>Yes (Implemented in the server via encryption functions.)</td> </tr><tr><td><strong>Suporte para chave estrangeira</strong></td> <td>No</td> </tr><tr><td><strong>Indekses de pesquisa de texto completo</strong></td> <td>No</td> </tr><tr><td><strong>Suporte ao tipo de dados geográficos</strong></td> <td>Yes</td> </tr><tr><td><strong>Suporte para indexação geospacial</strong></td> <td>No</td> </tr><tr><td><strong>Indekses de hash</strong></td> <td>No</td> </tr><tr><td><strong>Cache do índice</strong></td> <td>No</td> </tr><tr><td><strong>Granularidade de bloqueio</strong></td> <td>Row</td> </tr><tr><td><strong>MVCC</strong></td> <td>No</td> </tr><tr><td><strong>Suporte para replicação</strong>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Yes</td> </tr><tr><td><strong>Limites de armazenamento</strong></td> <td>None</td> </tr><tr><td><strong>Índices T-tree</strong></td> <td>No</td> </tr><tr><td><strong>Transações</strong></td> <td>No</td> </tr><tr><td><strong>Atualize as estatísticas do dicionário de dados</strong></td> <td>Yes</td> </tr></tbody></table>

O motor de armazenamento `ARCHIVE` está incluído nas distribuições binárias do MySQL. Para habilitar este motor de armazenamento se você construir o MySQL a partir do código-fonte, invoque o **CMake** com a opção `-DWITH_ARCHIVE_STORAGE_ENGINE`.

Para examinar a fonte do motor `ARCHIVE`, procure no diretório `storage/archive` de uma distribuição de fonte MySQL.

Você pode verificar se o mecanismo de armazenamento `ARCHIVE` está disponível com a declaração `SHOW ENGINES`.

Quando você cria uma tabela `ARCHIVE`, o servidor cria um arquivo de formato de tabela no diretório do banco de dados. O arquivo começa com o nome da tabela e tem uma extensão `.frm`. O mecanismo de armazenamento cria outros arquivos, todos com nomes que começam com o nome da tabela. O arquivo de dados tem uma extensão de `.ARZ`. Um arquivo `.ARN` pode aparecer durante operações de otimização.

O motor `ARCHIVE` suporta `INSERT`, `REPLACE` e `SELECT`, mas não `DELETE` ou `UPDATE`. Ele suporta operações `ORDER BY`, colunas `BLOB` e, basicamente, todos os tipos de dados, incluindo tipos de dados espaciais (consulte a Seção 11.4.1, “Tipos de Dados Espaciais”). Sistemas de referência espacial geográfica não são suportados. O motor `ARCHIVE` usa bloqueio em nível de string.

O motor `ARCHIVE` suporta o atributo de coluna `AUTO_INCREMENT`. A coluna `AUTO_INCREMENT` pode ter um índice único ou não único. Tentar criar um índice em qualquer outra coluna resulta em um erro. O motor `ARCHIVE` também suporta a opção de tabela `AUTO_INCREMENT` nas declarações `CREATE TABLE` para especificar o valor inicial da sequência para uma nova tabela ou redefinir o valor da sequência para uma tabela existente, respectivamente.

`ARCHIVE` não suporta a inserção de um valor em uma coluna `AUTO_INCREMENT` menor que o valor máximo atual da coluna. Tentativas de fazer isso resultam em um erro `ER_DUP_KEY`.

O motor `ARCHIVE` ignora as colunas `BLOB` se elas não forem solicitadas e passa por elas durante a leitura.

**Armazenamento:** As strings são compactadas conforme são inseridas. O motor `ARCHIVE` utiliza compressão de dados sem perda `zlib` (ver <http://www.zlib.net/>). Você pode usar `OPTIMIZE TABLE` para analisar a tabela e compactá-la em um formato menor (por um motivo para usar `OPTIMIZE TABLE`, veja mais adiante nesta seção). O motor também suporta [`CHECK TABLE`(check-table.html "13.7.2.2 CHECK TABLE Statement")]. Existem vários tipos de inserções que são usados:

* Uma declaração `INSERT` simplesmente empurra as strings para um buffer de compressão, e esse buffer é esvaziado conforme necessário. A inserção no buffer é protegida por um bloqueio. Uma declaração `SELECT` força o esvaziamento a ocorrer.

* Um inserto em massa só é visível após ser completado, a menos que outros insertos ocorram ao mesmo tempo, caso em que ele pode ser visto parcialmente. Um `SELECT` nunca causa um flush de um inserto em massa, a menos que um inserto normal ocorra enquanto ele está sendo carregado.

**Recuperação**: Na recuperação, as strings são descompactadas sob demanda; não há cache de string. Uma operação `SELECT` realiza uma varredura completa da tabela: Quando ocorre uma `SELECT`, ela descobre quantos registros estão disponíveis atualmente e lê esse número de registros. A `SELECT` é realizada como uma leitura consistente. Observe que muitas declarações `SELECT` durante a inserção podem deteriorar a compactação, a menos que apenas inserções em massa ou atrasadas sejam usadas. Para obter uma melhor compactação, você pode usar `OPTIMIZE TABLE` ou `REPAIR TABLE`. O número de strings nas tabelas `ARCHIVE` relatado por `SHOW TABLE STATUS` é sempre preciso. Veja a Seção 13.7.2.4, “Declaração OPTIMIZE TABLE”, a Seção 13.7.2.5, “Declaração REPAIR TABLE”, e a Seção 13.7.5.36, “Declaração SHOW TABLE STATUS”.

### Recursos adicionais

* Um fórum dedicado ao motor de armazenamento `ARCHIVE` está disponível em <https://forums.mysql.com/list.php?112>.