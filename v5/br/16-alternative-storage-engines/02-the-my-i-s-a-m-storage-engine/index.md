## 15.2 O Storage Engine MyISAM

15.2.1 Opções de Inicialização do MyISAM

15.2.2 Espaço Necessário para Keys

15.2.3 Formatos de Armazenamento de Tabela MyISAM

15.2.4 Problemas em Tabelas MyISAM

O `MyISAM` é baseado no storage engine `ISAM` mais antigo (e que não está mais disponível), mas possui muitas extensões úteis.

**Tabela 15.2 Funcionalidades do Storage Engine MyISAM**

<table frame="box" rules="all" summary="Funcionalidades suportadas pelo storage engine MyISAM."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Funcionalidade</th> <th>Suporte</th> </tr></thead><tbody><tr><td><span><strong>Indexes B-tree</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Backup/recuperação point-in-time</strong></span> (Implementado no server, e não no storage engine.)</td> <td>Sim</td> </tr><tr><td><span><strong>Suporte a Cluster Database</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Indexes Clusterizados</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Dados Comprimidos</strong></span></td> <td>Sim (Tabelas MyISAM comprimidas são suportadas apenas ao usar o formato de linha comprimida. Tabelas MyISAM que usam o formato de linha comprimida são somente leitura.)</td> </tr><tr><td><span><strong>Caches de Dados</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Dados Criptografados</strong></span></td> <td>Sim (Implementado no server via funções de criptografia.)</td> </tr><tr><td><span><strong>Suporte a Foreign Key</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Indexes de Busca Full-Text</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Suporte a Tipo de Dados Geoespaciais</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Suporte a Indexing Geoespacial</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Indexes Hash</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Caches de Index</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Granularidade de Lock</strong></span></td> <td>Tabela</td> </tr><tr><td><span><strong>MVCC</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Suporte à Replication</strong></span> (Implementado no server, e não no storage engine.)</td> <td>Sim</td> </tr><tr><td><span><strong>Limites de Storage</strong></span></td> <td>256TB</td> </tr><tr><td><span><strong>Indexes T-tree</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Transactions</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Atualização de estatísticas para dicionário de dados</strong></span></td> <td>Sim</td> </tr></tbody></table>

Cada tabela `MyISAM` é armazenada em disco em três arquivos. Os arquivos têm nomes que começam com o nome da tabela e possuem uma extensão para indicar o tipo de arquivo. Um arquivo `.frm` armazena o formato da tabela. O arquivo de dados tem a extensão `.MYD` (`MYData`). O arquivo de index tem a extensão `.MYI` (`MYIndex`).

Para especificar explicitamente que você deseja uma tabela `MyISAM`, indique isso com a opção de tabela `ENGINE`:

```sql
CREATE TABLE t (i INT) ENGINE = MYISAM;
```

No MySQL 5.7, é normalmente necessário usar `ENGINE` para especificar o storage engine `MyISAM` porque o `InnoDB` é o engine padrão.

Você pode checar ou reparar tabelas `MyISAM` com o cliente **mysqlcheck** ou o utilitário **myisamchk**. Você também pode comprimir tabelas `MyISAM` com **myisampack** para ocupar muito menos espaço. Consulte Seção 4.5.3, “mysqlcheck — Um Programa de Manutenção de Tabela”, Seção 4.6.3, “myisamchk — Utilitário de Manutenção de Tabela MyISAM”, e Seção 4.6.5, “myisampack — Gerar Tabelas MyISAM Comprimidas e Somente Leitura”.

Tabelas `MyISAM` possuem as seguintes características:

* Todos os valores de dados são armazenados com o byte baixo primeiro. Isso torna os dados independentes da máquina e do sistema operacional. Os únicos requisitos para portabilidade binária são que a máquina use inteiros assinados (signed integers) de complemento de dois e o formato de ponto flutuante IEEE. Esses requisitos são amplamente utilizados entre as máquinas principais. A compatibilidade binária pode não ser aplicável a sistemas embarcados, que às vezes possuem processadores peculiares.

  Não há penalidade de velocidade significativa para armazenar dados com o byte baixo primeiro; os bytes em uma linha de tabela normalmente estão desalinhados e requer pouco mais processamento para ler um byte desalinhado em ordem do que em ordem inversa. Além disso, o código no server que busca valores de coluna não é crítico em termos de tempo em comparação com outro código.

* Todos os valores de key numéricas são armazenados com o byte alto primeiro para permitir uma melhor compressão de index.

* Arquivos grandes (com até 63 bits de comprimento de arquivo) são suportados em sistemas de arquivos e sistemas operacionais que suportam arquivos grandes.

* Há um limite de (2^32)^2 (1.844E+19) linhas em uma tabela `MyISAM`.

* O número máximo de indexes por tabela `MyISAM` é 64.

  O número máximo de colunas por index é 16.

* O comprimento máximo da key é de 1000 bytes. Isso também pode ser alterado modificando o código-fonte e recompilando. No caso de uma key com mais de 250 bytes, é usado um tamanho de bloco de key maior do que o padrão de 1024 bytes.

* Quando linhas são inseridas em ordem classificada (como ao usar uma coluna `AUTO_INCREMENT`), a árvore de index é dividida de modo que o nó alto contenha apenas uma key. Isso melhora a utilização do espaço na árvore de index.

* O tratamento interno de uma coluna `AUTO_INCREMENT` por tabela é suportado. O `MyISAM` atualiza automaticamente esta coluna para operações `INSERT` e `UPDATE`. Isso torna as colunas `AUTO_INCREMENT` mais rápidas (pelo menos 10%). Valores no topo da sequência não são reutilizados após serem excluídos. (Quando uma coluna `AUTO_INCREMENT` é definida como a última coluna de um index de múltiplas colunas, a reutilização de valores excluídos do topo de uma sequência ocorre.) O valor `AUTO_INCREMENT` pode ser redefinido com `ALTER TABLE` ou **myisamchk**.

* Linhas de tamanho dinâmico são muito menos fragmentadas ao misturar exclusões com updates e inserts. Isso é feito combinando automaticamente blocos excluídos adjacentes e estendendo blocos se o próximo bloco for excluído.

* O `MyISAM` suporta inserts concorrentes: Se uma tabela não tiver blocos livres no meio do arquivo de dados, você pode executar `INSERT` de novas linhas nela ao mesmo tempo em que outros Threads estão lendo a tabela. Um bloco livre pode ocorrer como resultado da exclusão de linhas ou de um update de uma linha de comprimento dinâmico com mais dados do que seu conteúdo atual. Quando todos os blocos livres são utilizados (preenchidos), inserts futuros tornam-se concorrentes novamente. Consulte Seção 8.11.3, “Concurrent Inserts”.

* Você pode colocar o arquivo de dados e o arquivo de index em diferentes diretórios em diferentes dispositivos físicos para obter mais velocidade com as opções de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` no `CREATE TABLE`. Consulte Seção 13.1.18, “CREATE TABLE Statement”.

* Colunas `BLOB` e `TEXT` podem ser indexadas.

* Valores `NULL` são permitidos em colunas indexadas. Isso leva de 0 a 1 byte por key.

* Cada coluna de caracteres pode ter um conjunto de caracteres diferente. Consulte Capítulo 10, *Character Sets, Collations, Unicode*.

* Há um flag no arquivo de index `MyISAM` que indica se a tabela foi fechada corretamente. Se o **mysqld** for iniciado com a variável de sistema `myisam_recover_options` configurada, tabelas `MyISAM` são checadas automaticamente quando abertas e são reparadas se a tabela não foi fechada corretamente.

* O **myisamchk** marca as tabelas como checadas se você o executar com a opção `--update-state`. O **myisamchk --fast** verifica apenas as tabelas que não possuem essa marca.

* O **myisamchk --analyze** armazena estatísticas para porções de keys, bem como para keys inteiras.

* O **myisampack** pode empacotar colunas `BLOB` e `VARCHAR`.

O `MyISAM` também suporta as seguintes funcionalidades:

* Suporte para um tipo `VARCHAR` verdadeiro; uma coluna `VARCHAR` começa com um comprimento armazenado em um ou dois bytes.

* Tabelas com colunas `VARCHAR` podem ter comprimento de linha fixo ou dinâmico.

* A soma dos comprimentos das colunas `VARCHAR` e `CHAR` em uma tabela pode ser de até 64KB.

* Constraints `UNIQUE` de comprimento arbitrário.

### Recursos Adicionais

Um fórum dedicado ao storage engine `MyISAM` está disponível em <https://forums.mysql.com/list.php?21>.