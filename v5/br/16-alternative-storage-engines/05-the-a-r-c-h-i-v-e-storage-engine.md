## 15.5 O Motor de Armazenamento ARCHIVE

O mecanismo de armazenamento `ARCHIVE` produz tabelas de propósito especial que armazenam grandes quantidades de dados não indexados em um espaço muito pequeno.

**Tabela 15.5 Características do Motor de Armazenamento de ARQUIVO**

<table frame="box" rules="all" summary="Recursos suportados pelo motor de armazenamento ARCHIVE."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Característica</th> <th>Suporte</th> </tr></thead><tbody><tr><td><span><strong>Índices de árvores B</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Backup/recuperação em ponto no tempo</strong></span>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span><strong>Suporte a bancos de dados em cluster</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Índices agrupados</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Dados comprimidos</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Caches de dados</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Dados criptografados</strong></span></td> <td>Sim (implementado no servidor por meio de funções de criptografia.)</td> </tr><tr><td><span><strong>Suporte para chave estrangeira</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Índices de pesquisa de texto completo</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Suporte ao tipo de dados geográficos</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Suporte de indexação geospacial</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Índices de hash</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Caches de índice</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Granularidade de bloqueio</strong></span></td> <td>Linha</td> </tr><tr><td><span><strong>MVCC</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Suporte à replicação</strong></span>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span><strong>Limites de armazenamento</strong></span></td> <td>Nenhum</td> </tr><tr><td><span><strong>Índices de T-tree</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Transações</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Atualizar estatísticas para o dicionário de dados</strong></span></td> <td>Sim</td> </tr></tbody></table>

O mecanismo de armazenamento `ARCHIVE` está incluído nas distribuições binárias do MySQL. Para habilitar este mecanismo de armazenamento se você construir o MySQL a partir do código-fonte, inicie o **CMake** com a opção `-DWITH_ARCHIVE_STORAGE_ENGINE`.

Para examinar a fonte do motor `ARCHIVE`, procure no diretório `storage/archive` de uma distribuição de fonte MySQL.

Você pode verificar se o mecanismo de armazenamento `ARCHIVE` está disponível com a instrução `SHOW ENGINES`.

Quando você cria uma tabela `ARCHIVE`, o servidor cria um arquivo de formato de tabela no diretório do banco de dados. O arquivo começa com o nome da tabela e tem a extensão `.frm`. O mecanismo de armazenamento cria outros arquivos, todos com nomes que começam com o nome da tabela. O arquivo de dados tem a extensão `.ARZ`. Um arquivo `.ARN` pode aparecer durante operações de otimização.

O motor `ARCHIVE` suporta `INSERT`, `REPLACE` e `SELECT`, mas não `DELETE` ou `UPDATE`. Ele suporta operações `ORDER BY`, colunas `BLOB` e, basicamente, todos os tipos de dados, incluindo tipos de dados espaciais (veja a Seção 11.4.1, “Tipos de Dados Espaciais”). Os sistemas de referência espacial geográfica não são suportados. O motor `ARCHIVE` usa bloqueio em nível de linha.

O motor `ARCHIVE` suporta o atributo de coluna `AUTO_INCREMENT`. A coluna `AUTO_INCREMENT` pode ter um índice único ou não único. Tentar criar um índice em qualquer outra coluna resulta em um erro. O motor `ARCHIVE` também suporta a opção de tabela `AUTO_INCREMENT` nas instruções `CREATE TABLE` para especificar o valor inicial da sequência para uma nova tabela ou reiniciar o valor da sequência para uma tabela existente, respectivamente.

`ARCHIVE` não suporta a inserção de um valor em uma coluna `AUTO_INCREMENT` menor que o valor máximo atual da coluna. Tentativas de fazer isso resultam em um erro `ER_DUP_KEY`.

O motor `ARCHIVE` ignora as colunas `BLOB` se elas não forem solicitadas e passa por elas durante a leitura.

**Armazenamento:** As linhas são compactadas ao serem inseridas. O motor `ARCHIVE` utiliza a compressão de dados sem perda `zlib` (consulte <http://www.zlib.net/>). Você pode usar `OPTIMIZE TABLE` para analisar a tabela e compactá-la em um formato menor (para saber por que usar `OPTIMIZE TABLE`, consulte mais adiante nesta seção). O motor também suporta `CHECK TABLE`. Existem vários tipos de inserções que são usadas:

- Uma instrução `INSERT` apenas empurra linhas para um buffer de compressão, e esse buffer é descarregado conforme necessário. A inserção no buffer é protegida por um bloqueio. Uma `SELECT` força o descarregamento a ocorrer.

- Um inserimento em lote só é visível após ser concluído, a menos que outros inserimentos ocorram ao mesmo tempo, caso em que ele pode ser visto parcialmente. Um `SELECT` nunca causa um esvaziamento de um inserimento em lote, a menos que um inserimento normal ocorra enquanto ele está sendo carregado.

**Recuperação**: Na recuperação, as linhas são descompactadas sob demanda; não há cache de linha. Uma operação `SELECT` realiza uma varredura completa da tabela: Quando ocorre um `SELECT`, ele determina quantos registros estão disponíveis atualmente e lê esse número de registros. O `SELECT` é realizado como uma leitura consistente. Observe que muitas instruções `SELECT` durante a inserção podem deteriorar a compactação, a menos que apenas inserções em lote ou atrasadas sejam usadas. Para obter uma melhor compactação, você pode usar `OPTIMIZE TABLE` ou `REPAIR TABLE`. O número de linhas nas tabelas `ARCHIVE` relatado por `SHOW TABLE STATUS` é sempre preciso. Consulte a Seção 13.7.2.4, “Instrução OPTIMIZE TABLE”, a Seção 13.7.2.5, “Instrução REPAIR TABLE” e a Seção 13.7.5.36, “Instrução SHOW TABLE STATUS”.

### Recursos adicionais

- Um fórum dedicado ao mecanismo de armazenamento `ARCHIVE` está disponível em <https://forums.mysql.com/list.php?112>.
