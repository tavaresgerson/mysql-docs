## 15.2 O Motor de Armazenamento MyISAM

15.2.1 Opções de inicialização do MyISAM

15.2.2 Espaço necessário para as chaves

15.2.3 Formas de armazenamento de tabelas MyISAM

15.2.4 Problemas com tabelas MyISAM

`MyISAM` é baseado no motor de armazenamento mais antigo (e já não disponível) `ISAM`, mas possui muitas extensões úteis.

**Tabela 15.2 Características do Motor de Armazenamento MyISAM**

<table frame="box" rules="all" summary="Recursos suportados pelo motor de armazenamento MyISAM."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Característica</th> <th>Suporte</th> </tr></thead><tbody><tr><td><span><strong>Índices de árvores B</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Backup/recuperação em ponto no tempo</strong></span>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span><strong>Suporte a bancos de dados em cluster</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Índices agrupados</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Dados comprimidos</strong></span></td> <td>Sim (As tabelas MyISAM compactadas são suportadas apenas quando o formato de linha compactado é usado. As tabelas que usam o formato de linha compactada com MyISAM são apenas de leitura.)</td> </tr><tr><td><span><strong>Caches de dados</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Dados criptografados</strong></span></td> <td>Sim (implementado no servidor por meio de funções de criptografia.)</td> </tr><tr><td><span><strong>Suporte para chave estrangeira</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Índices de pesquisa de texto completo</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Suporte ao tipo de dados geográficos</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Suporte de indexação geospacial</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Índices de hash</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Caches de índice</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Granularidade de bloqueio</strong></span></td> <td>Tabela</td> </tr><tr><td><span><strong>MVCC</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Suporte à replicação</strong></span>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span><strong>Limites de armazenamento</strong></span></td> <td>256 TB</td> </tr><tr><td><span><strong>Índices de T-tree</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Transações</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Atualizar estatísticas para o dicionário de dados</strong></span></td> <td>Sim</td> </tr></tbody></table>

Cada tabela `MyISAM` é armazenada no disco em três arquivos. Os arquivos têm nomes que começam com o nome da tabela e têm uma extensão para indicar o tipo de arquivo. Um arquivo `.frm` armazena o formato da tabela. O arquivo de dados tem a extensão `.MYD` (`MYData`). O arquivo de índice tem a extensão `.MYI` (`MYIndex`).

Para especificar explicitamente que você deseja uma tabela `MyISAM`, indique isso com uma opção de tabela `ENGINE`:

```sql
CREATE TABLE t (i INT) ENGINE = MYISAM;
```

No MySQL 5.7, normalmente é necessário usar `ENGINE` para especificar o motor de armazenamento `MyISAM`, pois `InnoDB` é o motor padrão.

Você pode verificar ou reparar as tabelas `MyISAM` com o cliente **mysqlcheck** ou o utilitário **myisamchk**. Você também pode comprimir as tabelas `MyISAM` com **myisampack** para ocupar muito menos espaço. Veja a Seção 4.5.3, “mysqlcheck — Um Programa de Manutenção de Tabelas”, a Seção 4.6.3, “myisamchk — Utilitário de Manutenção de Tabelas MyISAM” e a Seção 4.6.5, “myisampack — Gerar Tabelas MyISAM Compridas e Apenas de Leitura”.

As tabelas `MyISAM` têm as seguintes características:

- Todos os valores de dados são armazenados com o byte de menor ordem primeiro. Isso torna o sistema de dados independente do sistema operacional. Os únicos requisitos para a portabilidade binária são que a máquina use inteiros assinados em complemento de dois e o formato de ponto flutuante IEEE. Esses requisitos são amplamente utilizados em máquinas convencionais. A compatibilidade binária pode não ser aplicável a sistemas embarcados, que às vezes têm processadores peculiares.

  Não há penalidade significativa de velocidade ao armazenar os dados com os bytes mais baixos primeiro; os bytes de uma linha de tabela normalmente não estão alinhados e leva um pouco mais de processamento para ler um byte desalinhado em ordem inversa do que em ordem direta. Além disso, o código no servidor que recupera os valores das colunas não é crítico em termos de tempo em comparação com outros códigos.

- Todos os valores de teclas numéricas são armazenados com o byte alto primeiro para permitir uma melhor compressão de índice.

- Arquivos grandes (até 63 bits de comprimento de arquivo) são suportados em sistemas de arquivos e sistemas operacionais que suportam arquivos grandes.

- Há um limite de (232)2 (1,844E+19) linhas em uma tabela `MyISAM`.

- O número máximo de índices por tabela `MyISAM` é de 64.

  O número máximo de colunas por índice é 16.

- O comprimento máximo da chave é de 1000 bytes. Isso também pode ser alterado alterando a fonte e recompilando. No caso de uma chave maior que 250 bytes, um tamanho de bloco de chave maior que o padrão de 1024 bytes é usado.

- Quando as linhas são inseridas em ordem ordenada (como quando você está usando uma coluna `AUTO_INCREMENT`), a árvore de índice é dividida para que o nó superior contenha apenas uma chave. Isso melhora a utilização do espaço na árvore de índice.

- O gerenciamento interno de uma coluna `AUTO_INCREMENT` por tabela é suportado. O `MyISAM` atualiza automaticamente essa coluna para operações `INSERT` e `UPDATE`. Isso torna as colunas `AUTO_INCREMENT` mais rápidas (pelo menos 10%). Os valores no topo da sequência não são reutilizados após serem excluídos. (Quando uma coluna `AUTO_INCREMENT` é definida como a última coluna de um índice de múltiplas colunas, a reutilização de valores excluídos do topo de uma sequência ocorre.) O valor `AUTO_INCREMENT` pode ser redefinido com `ALTER TABLE` ou **myisamchk**.

- As linhas de tamanho dinâmico são muito menos fragmentadas ao combinar exclusividades com atualizações e inserções. Isso é feito combinando automaticamente blocos excluídos adjacentes e estendendo blocos se o próximo bloco for excluído.

- `MyISAM` suporta inserções concorrentes: se uma tabela não tiver blocos livres no meio do arquivo de dados, você pode `INSERT` novas linhas nela ao mesmo tempo em que outros threads estão lendo da tabela. Um bloco livre pode ocorrer como resultado da exclusão de linhas ou de uma atualização de uma linha de comprimento dinâmico com mais dados do que seu conteúdo atual. Quando todos os blocos livres são esgotados (preenchidos), as inserções futuras tornam-se concorrentes novamente. Veja a Seção 8.11.3, “Inserções Concorrentes”.

- Você pode colocar o arquivo de dados e o arquivo de índice em diretórios diferentes em dispositivos físicos diferentes para obter mais velocidade com as opções de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` no comando `CREATE TABLE`. Veja a Seção 13.1.18, “Instrução CREATE TABLE”.

- As colunas `BLOB` e `TEXT` podem ser indexadas.

- Os valores `NULL` são permitidos em colunas indexadas. Isso consome de 0 a 1 byte por chave.

- Cada coluna de caracteres pode ter um conjunto de caracteres diferente. Veja o Capítulo 10, *Conjunto de caracteres, Colagens, Unicode*.

- Existe uma bandeira no arquivo de índice `MyISAM` que indica se a tabela foi fechada corretamente. Se o **mysqld** for iniciado com a variável de sistema `myisam_recover_options` definida, as tabelas `MyISAM` são verificadas automaticamente ao serem abertas e reparadas se a tabela não tiver sido fechada corretamente.

- O **myisamchk** marca as tabelas como verificadas se você executá-lo com a opção **--update-state**. O **myisamchk --fast** verifica apenas as tabelas que não têm essa marca.

- O comando **myisamchk --analyze** armazena estatísticas para partes de chaves, bem como para chaves inteiras.

- O **myisampack** pode embalar colunas `BLOB` e `VARCHAR`.

`MyISAM` também suporta os seguintes recursos:

- Suporte para um tipo `VARCHAR` verdadeiro; uma coluna `VARCHAR` começa com um comprimento armazenado em um ou dois bytes.

- As tabelas com colunas `VARCHAR` podem ter comprimento de linha fixo ou dinâmico.

- A soma das comprimentos das colunas `VARCHAR` e `CHAR` em uma tabela pode ser de até 64 KB.

- Restrições `UNIQUE` de comprimento arbitrário.

### Recursos adicionais

- Um fórum dedicado ao motor de armazenamento `MyISAM` está disponível em <https://forums.mysql.com/list.php?21>.
