## 18.2 O Motor de Armazenamento MyISAM

18.2.1 Opções de Inicialização do MyISAM

18.2.2 Espaço Necessário para Chaves

18.2.3 Formatos de Armazenamento de Tabelas MyISAM

18.2.4 Problemas com Tabelas MyISAM

O `MyISAM` é baseado no motor de armazenamento mais antigo (e já não disponível) `ISAM`, mas possui muitas extensões úteis.

**Tabela 18.2 Recursos do Motor de Armazenamento MyISAM**

<table frame="box" rules="all" summary="Recursos suportados pelo mecanismo de armazenamento MyISAM."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Característica</th> <th>Suporte</th> </tr></thead><tbody><tr><td><span class="bold"><strong>Indekses B-tree</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Recuperação de ponto no tempo</strong></span> (Implementado no servidor, e não no mecanismo de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Suporte a bancos de dados em clúster</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Indekses agrupados</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Dados comprimidos</strong></span></td> <td>Sim (Tabelas MyISAM comprimidas são suportadas apenas ao usar o formato de linha comprimido. Tabelas que usam o formato de linha comprimido com MyISAM são apenas de leitura.)</td> </tr><tr><td><span class="bold"><strong>Caches de dados</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Dados criptografados</strong></span></td> <td>Sim (Implementado no servidor por meio de funções de criptografia.)</td> </tr><tr><td><span class="bold"><strong>Suporte a chaves estrangeiras</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Indekses de busca full-text</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Suporte a tipos de dados geográficos</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Suporte a indexação geográficos</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Indekses de hash</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Caches de índice</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Granularidade de bloqueio</strong></span></td> <td>Tabela</td> </tr><tr><td><span class="bold"><strong>MVCC</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Suporte a replicação</strong></span> (Implementado no servidor, e não no mecanismo de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Limites de armazenamento</strong></span></td> <td>256TB</td> </tr><tr><td><span class="bold"><strong>Indekses T-tree</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Transações</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Estatísticas de atualização para o dicionário de dados</strong></span></td> <td>Sim</td> </tr></tbody></table>

Cada tabela `MyISAM` é armazenada no disco em dois arquivos. Os arquivos têm nomes que começam com o nome da tabela e têm uma extensão para indicar o tipo de arquivo. O arquivo de dados tem a extensão `.MYD` (`MYData`). O arquivo de índice tem a extensão `.MYI` (`MYIndex`). A definição da tabela é armazenada no dicionário de dados do MySQL.

Para especificar explicitamente que você deseja uma tabela `MyISAM`, indique isso com uma opção de tabela `ENGINE`:

```
CREATE TABLE t (i INT) ENGINE = MYISAM;
```

No MySQL 9.5, normalmente é necessário usar `ENGINE` para especificar o motor de armazenamento `MyISAM` porque `InnoDB` é o motor padrão.

Você pode verificar ou reparar tabelas `MyISAM` com o cliente **mysqlcheck** ou o utilitário **myisamchk**. Você também pode comprimir tabelas `MyISAM` com **myisampack** para ocupar muito menos espaço. Veja a Seção 6.5.3, “mysqlcheck — Um Programa de Manutenção de Tabelas”, a Seção 6.6.4, “myisamchk — Ferramenta de Manutenção de Tabelas MyISAM”, e a Seção 6.6.6, “myisampack — Gerar Tabelas MyISAM Compressas e Apenas de Leitura”.

No MySQL 9.5, o motor de armazenamento `MyISAM` não oferece suporte a partição. *Tabelas `MyISAM` particionadas criadas em versões anteriores do MySQL não podem ser usadas no MySQL 9.5*. Para mais informações, veja a Seção 26.6.2, “Limitações de Partição Relacionadas aos Motores de Armazenamento”. Para obter ajuda com a atualização dessas tabelas para que possam ser usadas no MySQL 9.5, veja a Seção 3.5, “Alterações no MySQL 9.5”.

Tabelas `MyISAM` têm as seguintes características:

* Todos os valores de dados são armazenados com o byte mais baixo primeiro. Isso torna os dados independentes da máquina e do sistema operacional. Os únicos requisitos para a portabilidade binária são que a máquina use inteiros assinados em complemento de dois e o formato de ponto flutuante IEEE. Esses requisitos são amplamente utilizados em máquinas convencionais. A compatibilidade binária pode não ser aplicável a sistemas embarcados, que às vezes têm processadores peculiares.

Não há penalidade significativa de velocidade para armazenar os dados com o byte mais baixo primeiro; os bytes em uma linha de tabela normalmente não estão alinhados e leva pouco mais de processamento para ler um byte desalinhado em ordem inversa do que na ordem reversa. Além disso, o código no servidor que busca os valores das colunas não é crítico em termos de tempo em comparação com outros códigos.

* Todos os valores de chave numéricos são armazenados com o byte mais alto primeiro para permitir uma melhor compressão de índice.

* Arquivos grandes (até 63 bits de comprimento de arquivo) são suportados em sistemas de arquivos e sistemas operacionais que suportam arquivos grandes.

* Há um limite de (232)2 (1.844E+19) linhas em uma tabela `MyISAM`.

* O número máximo de índices por tabela `MyISAM` é de 64.

* O número máximo de colunas por índice é de 16.

* O comprimento máximo da chave é de 1000 bytes. Isso também pode ser alterado alterando a fonte e recompilando. No caso de uma chave mais longa que 250 bytes, um tamanho de bloco de chave maior que o padrão de 1024 bytes é usado.

* Quando as linhas são inseridas em ordem ordenada (como quando você está usando uma coluna `AUTO_INCREMENT`), a árvore de índice é dividida para que o nó superior contenha apenas uma chave. Isso melhora a utilização de espaço na árvore de índice.

* O gerenciamento interno de uma coluna `AUTO_INCREMENT` por tabela é suportado. O `MyISAM` atualiza automaticamente essa coluna para operações de `INSERT` e `UPDATE`. Isso torna as colunas `AUTO_INCREMENT` mais rápidas (pelo menos 10%). Os valores no topo da sequência não são reutilizados após serem excluídos. (Quando uma coluna `AUTO_INCREMENT` é definida como a última coluna de um índice de múltiplas colunas, a reutilização de valores excluídos do topo de uma sequência ocorre.) O valor `AUTO_INCREMENT` pode ser redefinido com `ALTER TABLE` ou **myisamchk**.

* Linhas de tamanho dinâmico são muito menos fragmentadas ao misturar exclusões com atualizações e inserções. Isso é feito combinando automaticamente blocos excluídos adjacentes e estendendo blocos se o próximo bloco for excluído.

* O `MyISAM` suporta inserções concorrentes: Se uma tabela não tiver blocos livres no meio do arquivo de dados, você pode `INSERT` novas linhas nela ao mesmo tempo em que outros threads estão lendo da tabela. Um bloco livre pode ocorrer como resultado da exclusão de linhas ou de uma atualização de uma linha de comprimento dinâmico com mais dados do que seu conteúdo atual. Quando todos os blocos livres são usados (preenchidos), as inserções futuras tornam-se concorrentes novamente. Veja a Seção 10.11.3, “Inserções Concorrentes”.

* Você pode colocar o arquivo de dados e o arquivo de índice em diretórios diferentes em dispositivos físicos diferentes para obter mais velocidade com as opções de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` no `CREATE TABLE`. Veja a Seção 15.1.24, “Instrução CREATE TABLE”.

* Colunas `BLOB` e `TEXT` podem ser indexadas.

* Valores `NULL` são permitidos em colunas indexadas. Isso consome de 0 a 1 byte por chave.

* Cada coluna de caracteres pode ter um conjunto de caracteres diferente. Veja o Capítulo 12, *Conjunto de Caracteres, Colagens, Unicode*.

* Existe uma bandeira no arquivo de índice `MyISAM` que indica se a tabela foi fechada corretamente. Se o **mysqld** for iniciado com a variável de sistema `myisam_recover_options` definida, as tabelas `MyISAM` são verificadas automaticamente ao serem abertas e reparadas se a tabela não tiver sido fechada corretamente.

* O **myisamchk** marca as tabelas como verificadas se você executá-lo com a opção `--update-state`. **myisamchk --fast** verifica apenas as tabelas que não têm essa marca.

* **myisamchk --analyze** armazena estatísticas para partes de chaves, bem como para chaves inteiras.

* O **myisampack** pode compactar colunas `BLOB` e `VARCHAR`.

O `MyISAM` também suporta os seguintes recursos:

* Suporte a um verdadeiro tipo `VARCHAR`; uma coluna `VARCHAR` começa com uma extensão de comprimento armazenada em um ou dois bytes.

* As tabelas com colunas `VARCHAR` podem ter comprimento de linha fixo ou dinâmico.

* A soma dos comprimentos das colunas `VARCHAR` e `CHAR` em uma tabela pode ser de até 64 KB.

* Restrições `UNIQUE` de comprimento arbitrário.

### Recursos Adicionais

* Um fórum dedicado ao motor de armazenamento `MyISAM` está disponível em <https://forums.mysql.com/list.php?21>.