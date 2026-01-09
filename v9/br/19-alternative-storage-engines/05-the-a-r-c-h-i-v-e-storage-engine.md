## 18.5 O Motor de Armazenamento ARCHIVE

O motor de armazenamento `ARCHIVE` produz tabelas de propósito especial que armazenam grandes quantidades de dados não indexados em um espaço muito pequeno.

**Tabela 18.5 Características do Motor de Armazenamento ARCHIVE**

<table frame="box" rules="all" summary="Recursos suportados pelo mecanismo de armazenamento ARCHIVE."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Característica</th> <th>Suporte</th> </tr></thead><tbody><tr><td><span><strong>Indekses B-tree</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Recuperação de ponto no tempo</strong></span> (Implementado no servidor, e não no mecanismo de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span><strong>Suporte a bancos de dados em cluster</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Indekses agrupados</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Dados comprimidos</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Caches de dados</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Dados criptografados</strong></span></td> <td>Sim (Implementado no servidor por meio de funções de criptografia.)</td> </tr><tr><td><span><strong>Suporte a chaves estrangeiras</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Indekses de busca full-text</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Tipo de dados geográficos</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Suporte a indexação geográficos</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Indekses de hash</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Caches de índice</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Granularidade de bloqueio</strong></span></td> <td>Linha</td> </tr><tr><td><span><strong>MVCC</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Suporte a replicação</strong></span> (Implementado no servidor, e não no mecanismo de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span><strong>Limites de armazenamento</strong></span></td> <td>Nenhum</td> </tr><tr><td><span><strong>Indekses T-tree</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Transações</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Estatísticas de atualização do dicionário de dados</strong></span></td> <td>Sim</td> </tr></tbody></table>

O mecanismo de armazenamento `ARCHIVE` está incluído nas distribuições binárias do MySQL. Para habilitar este mecanismo de armazenamento se você construir o MySQL a partir do código-fonte, inicie o **CMake** com a opção `-DWITH_ARCHIVE_STORAGE_ENGINE`.

Para examinar a fonte do mecanismo `ARCHIVE`, procure no diretório `storage/archive` de uma distribuição de código-fonte do MySQL.

Você pode verificar se o mecanismo de armazenamento `ARCHIVE` está disponível com a instrução `SHOW ENGINES`.

Ao criar uma tabela `ARCHIVE`, o mecanismo de armazenamento cria arquivos com nomes que começam com o nome da tabela. O arquivo de dados tem a extensão `.ARZ`. Um arquivo `.ARN` pode aparecer durante operações de otimização.

O mecanismo `ARCHIVE` suporta `INSERT`, `REPLACE` e `SELECT`, mas não `DELETE` ou `UPDATE`. Ele suporta operações `ORDER BY`, colunas `BLOB` e tipos de dados espaciais (veja a Seção 13.4.1, “Tipos de Dados Espaciais”). Sistemas de referência espacial geográfica não são suportados. O mecanismo `ARCHIVE` usa bloqueio a nível de linha.

O mecanismo `ARCHIVE` suporta o atributo de coluna `AUTO_INCREMENT`. A coluna `AUTO_INCREMENT` pode ter um índice único ou não único. Tentar criar um índice em qualquer outra coluna resulta em um erro. O mecanismo `ARCHIVE` também suporta a opção de tabela `AUTO_INCREMENT` em instruções `CREATE TABLE` para especificar o valor inicial da sequência para uma nova tabela ou reiniciar o valor da sequência para uma tabela existente, respectivamente.

`ARCHIVE` não suporta a inserção de um valor em uma coluna `AUTO_INCREMENT` menor que o valor máximo atual da coluna. Tentativas de fazer isso resultam em um erro `ER_DUP_KEY`.

O mecanismo `ARCHIVE` ignora colunas `BLOB` se não forem solicitadas e escaneia além delas durante a leitura.

O mecanismo de armazenamento `ARCHIVE` não suporta particionamento.

**Armazenamento:** As linhas são compactadas ao serem inseridas. O motor `ARCHIVE` utiliza a compressão de dados sem perda de dados `zlib` (consulte <http://www.zlib.net/>). Você pode usar `OPTIMIZE TABLE` para analisar a tabela e compactá-la em um formato menor (consulte mais adiante nesta seção para saber por que usar `OPTIMIZE TABLE`). O motor também suporta `CHECK TABLE`. Existem vários tipos de inserções que são usadas:

* Uma instrução `INSERT` apenas empurra as linhas para um buffer de compactação, e esse buffer é descarregado conforme necessário. A inserção no buffer é protegida por um bloqueio. Uma `SELECT` força o descarregamento.

* Uma inserção em lote é visível apenas após ser concluída, a menos que outras inserções ocorram ao mesmo tempo, caso em que pode ser vista parcialmente. Uma `SELECT` nunca causa um descarregamento de uma inserção em lote, a menos que uma inserção normal ocorra enquanto ela está sendo carregada.

**Recuperação**: Na recuperação, as linhas são descompactadas sob demanda; não há cache de linhas. Uma operação `SELECT` realiza uma varredura completa da tabela: Quando uma `SELECT` ocorre, ela descobre quantos registros estão atualmente disponíveis e lê esse número de registros. A `SELECT` é realizada como uma leitura consistente. Note que muitas instruções `SELECT` durante a inserção podem deteriorar a compactação, a menos que apenas inserções em lote sejam usadas. Para obter uma melhor compactação, você pode usar `OPTIMIZE TABLE` ou `REPAIR TABLE`. O número de linhas nas tabelas `ARCHIVE` relatado por `SHOW TABLE STATUS` é sempre preciso. Consulte a Seção 15.7.3.4, “Instrução OPTIMIZE TABLE”, a Seção 15.7.3.5, “Instrução REPAIR TABLE” e a Seção 15.7.7.39, “Instrução SHOW TABLE STATUS”.

### Recursos Adicionais

* Um fórum dedicado ao motor de armazenamento `ARCHIVE` está disponível em <https://forums.mysql.com/list.php?112>.