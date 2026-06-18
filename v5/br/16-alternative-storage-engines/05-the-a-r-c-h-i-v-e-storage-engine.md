## 15.5 O Storage Engine ARCHIVE

O Storage Engine `ARCHIVE` produz tabelas de propósito especial que armazenam grandes quantidades de dados não indexados em um tamanho muito reduzido.

**Tabela 15.5 Funcionalidades do Storage Engine ARCHIVE**

<table frame="box" rules="all" summary="Funcionalidades suportadas pelo storage engine ARCHIVE."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Funcionalidade</th> <th>Suporte</th> </tr></thead><tbody><tr><td><span><strong>Indexes B-tree</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Backup/Recuperação point-in-time</strong></span> (Implementado no servidor, e não no storage engine.)</td> <td>Sim</td> </tr><tr><td><span><strong>Suporte a Database Cluster</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Indexes Clusterizados</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Dados Comprimidos</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Caches de Dados</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Dados Criptografados</strong></span> (Implementado no servidor via funções de criptografia.)</td> <td>Sim</td> </tr><tr><td><span><strong>Suporte a Foreign Key</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Indexes de Pesquisa Full-text</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Suporte a Tipos de Dados Geoespaciais</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Suporte a Indexing Geoespacial</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Indexes Hash</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Caches de Index</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Granularidade de Lock</strong></span></td> <td>Linha (Row)</td> </tr><tr><td><span><strong>MVCC</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Suporte a Replication</strong></span> (Implementado no servidor, e não no storage engine.)</td> <td>Sim</td> </tr><tr><td><span><strong>Limites de Storage</strong></span></td> <td>Nenhum</td> </tr><tr><td><span><strong>Indexes T-tree</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Transactions</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Atualização de estatísticas para dicionário de dados</strong></span></td> <td>Sim</td> </tr></tbody></table>

O Storage Engine `ARCHIVE` está incluído nas distribuições binárias do MySQL. Para habilitar este storage engine se você compilar o MySQL a partir do código fonte, invoque o **CMake** com a opção `-DWITH_ARCHIVE_STORAGE_ENGINE`.

Para examinar o código fonte do engine `ARCHIVE`, procure no diretório `storage/archive` de uma distribuição de código fonte do MySQL.

Você pode verificar se o Storage Engine `ARCHIVE` está disponível com o comando `SHOW ENGINES`.

Ao criar uma tabela `ARCHIVE`, o servidor cria um arquivo de formato de tabela no diretório da Database. O arquivo começa com o nome da tabela e tem a extensão `.frm`. O storage engine cria outros arquivos, todos com nomes que começam com o nome da tabela. O arquivo de dados tem a extensão `.ARZ`. Um arquivo `.ARN` pode aparecer durante operações de otimização.

O engine `ARCHIVE` suporta `INSERT`, `REPLACE` e `SELECT`, mas não `DELETE` ou `UPDATE`. Ele suporta operações `ORDER BY`, colunas `BLOB` e, basicamente, todos os tipos de dados, incluindo tipos de dados espaciais (consulte a Seção 11.4.1, “Tipos de Dados Espaciais”). Sistemas de referência espaciais geográficos não são suportados. O engine `ARCHIVE` usa Lock no nível de linha (row-level locking).

O engine `ARCHIVE` suporta o atributo de coluna `AUTO_INCREMENT`. A coluna `AUTO_INCREMENT` pode ter um Index único ou não único. Tentar criar um Index em qualquer outra coluna resulta em um erro. O engine `ARCHIVE` também suporta a opção de tabela `AUTO_INCREMENT` nos comandos `CREATE TABLE` para especificar o valor inicial da sequência para uma nova tabela ou redefinir o valor da sequência para uma tabela existente, respectivamente.

O `ARCHIVE` não suporta a inserção de um valor em uma coluna `AUTO_INCREMENT` menor do que o valor máximo atual da coluna. Tentativas de fazê-lo resultam em um erro `ER_DUP_KEY`.

O engine `ARCHIVE` ignora colunas `BLOB` se elas não forem solicitadas e as ignora durante a leitura.

**Storage:** As linhas são comprimidas à medida que são inseridas. O engine `ARCHIVE` usa a compressão de dados sem perdas `zlib` (consulte <http://www.zlib.net/>). Você pode usar `OPTIMIZE TABLE` para analisar a tabela e compactá-la em um formato menor (para uma razão para usar `OPTIMIZE TABLE`, veja mais adiante nesta seção). O engine também suporta `CHECK TABLE`. Existem vários tipos de inserções que são usados:

* Um comando `INSERT` apenas empurra as linhas para um Buffer de compressão, e esse Buffer é descarregado (flush) conforme necessário. A inserção no Buffer é protegida por um Lock. Um `SELECT` força a ocorrência de um descarregamento (flush).

* Uma inserção em massa (bulk insert) é visível apenas após ser concluída, a menos que outras inserções ocorram ao mesmo tempo, caso em que pode ser vista parcialmente. Um `SELECT` nunca causa um flush de uma inserção em massa, a menos que uma inserção normal ocorra enquanto o carregamento está sendo feito.

**Recuperação (Retrieval):** Na recuperação, as linhas são descomprimidas sob demanda; não há um Cache de linha. Uma operação `SELECT` executa um scan completo da tabela: Quando um `SELECT` ocorre, ele descobre quantas linhas estão atualmente disponíveis e lê esse número de linhas. O `SELECT` é executado como uma leitura consistente (consistent read). Observe que muitos comandos `SELECT` durante a inserção podem deteriorar a compressão, a menos que apenas inserções em massa (bulk) ou atrasadas (delayed) sejam usadas. Para obter uma melhor compressão, você pode usar `OPTIMIZE TABLE` ou `REPAIR TABLE`. O número de linhas nas tabelas `ARCHIVE` reportado por `SHOW TABLE STATUS` é sempre preciso. Consulte a Seção 13.7.2.4, “Comando OPTIMIZE TABLE”, Seção 13.7.2.5, “Comando REPAIR TABLE” e Seção 13.7.5.36, “Comando SHOW TABLE STATUS”.

### Recursos Adicionais

* Um fórum dedicado ao Storage Engine `ARCHIVE` está disponível em <https://forums.mysql.com/list.php?112>.