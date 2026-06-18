## 18.2 O Motor de Armazenamento MyISAM

18.2.1 Opções de inicialização do MyISAM

18.2.2 Espaço necessário para as chaves

18.2.3 Formas de armazenamento de tabelas MyISAM

18.2.4 Problemas com tabelas MyISAM

O `MyISAM` é baseado no motor de armazenamento mais antigo (e já não disponível) `ISAM`, mas possui muitas extensões úteis.

**Tabela 18.2 Características do Motor de Armazenamento MyISAM**

<table summary="Recursos suportados pelo motor de armazenamento MyISAM."><thead><tr><th>Característica</th> <th>Suporte</th> </tr></thead><tbody><tr><td><span class="bold"><strong>Índices de árvores B</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Backup/recuperação em ponto no tempo</strong></span>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Suporte a bancos de dados em cluster</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Índices agrupados</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Dados comprimidos</strong></span></td> <td>Sim (As tabelas MyISAM compactadas são suportadas apenas quando o formato de linha compactado é usado. As tabelas que usam o formato de linha compactada com MyISAM são apenas de leitura.)</td> </tr><tr><td><span class="bold"><strong>Caches de dados</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Dados criptografados</strong></span></td> <td>Sim (implementado no servidor por meio de funções de criptografia.)</td> </tr><tr><td><span class="bold"><strong>Suporte para chave estrangeira</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Índices de pesquisa de texto completo</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Suporte ao tipo de dados geográficos</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Suporte de indexação geospacial</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Índices de hash</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Caches de índice</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Granularidade de bloqueio</strong></span></td> <td>Tabela</td> </tr><tr><td><span class="bold"><strong>MVCC</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Suporte à replicação</strong></span>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Limites de armazenamento</strong></span></td> <td>256 TB</td> </tr><tr><td><span class="bold"><strong>Índices de T-tree</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Transações</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Atualizar estatísticas para o dicionário de dados</strong></span></td> <td>Sim</td> </tr></tbody></table>

Cada tabela `MyISAM` é armazenada em disco em dois arquivos. Os arquivos têm nomes que começam com o nome da tabela e têm uma extensão para indicar o tipo de arquivo. O arquivo de dados tem uma extensão `.MYD` (`MYData`). O arquivo de índice tem uma extensão `.MYI` (`MYIndex`). A definição da tabela é armazenada no dicionário de dados do MySQL.

Para especificar explicitamente que você deseja uma tabela `MyISAM`, indique isso com uma opção de tabela `ENGINE`:

```
CREATE TABLE t (i INT) ENGINE = MYISAM;
```

No MySQL 8.0, normalmente é necessário usar `ENGINE` para especificar o mecanismo de armazenamento `MyISAM`, pois `InnoDB` é o mecanismo padrão.

Você pode verificar ou reparar as tabelas `MyISAM` com o cliente **mysqlcheck** ou o utilitário **myisamchk**. Você também pode comprimir as tabelas `MyISAM` com **myisampack** para ocupar muito menos espaço. Veja a Seção 6.5.3, “mysqlcheck — Um Programa de Manutenção de Tabelas”, a Seção 6.6.4, “myisamchk — Utilitário de Manutenção de Tabelas MyISAM”, e a Seção 6.6.6, “myisampack — Gerar Tabelas MyISAM Compressas e Apenas de Leitura”.

No MySQL 8.0, o mecanismo de armazenamento `MyISAM` não oferece suporte à partição. *Tabelas `MyISAM` particionadas criadas em versões anteriores do MySQL não podem ser usadas no MySQL 8.0*. Para obter mais informações, consulte a Seção 26.6.2, “Limitações de Partição Relacionadas aos Mecanismos de Armazenamento”. Para obter ajuda com a atualização dessas tabelas para que possam ser usadas no MySQL 8.0, consulte a Seção 3.5, “Mudanças no MySQL 8.0”.

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

- O gerenciamento interno de uma coluna `AUTO_INCREMENT` por tabela é suportado. A `MyISAM` atualiza automaticamente essa coluna para as operações `INSERT` e `UPDATE`. Isso torna as colunas `AUTO_INCREMENT` mais rápidas (pelo menos 10%). Os valores no topo da sequência não são reutilizados após serem excluídos. (Quando uma coluna `AUTO_INCREMENT` é definida como a última coluna de um índice de múltiplas colunas, a reutilização de valores excluídos do topo de uma sequência ocorre.) O valor `AUTO_INCREMENT` pode ser redefinido com `ALTER TABLE` ou **myisamchk**.

- As linhas de tamanho dinâmico são muito menos fragmentadas ao combinar exclusividades com atualizações e inserções. Isso é feito combinando automaticamente blocos excluídos adjacentes e estendendo blocos se o próximo bloco for excluído.

- `MyISAM` suporta inserções concorrentes: Se uma tabela não tiver blocos livres no meio do arquivo de dados, você pode `INSERT` inserir novas linhas nela ao mesmo tempo em que outros threads estão lendo da tabela. Um bloco livre pode ocorrer como resultado da exclusão de linhas ou da atualização de uma linha de comprimento dinâmico com mais dados do que seu conteúdo atual. Quando todos os blocos livres são esgotados (preenchidos), as inserções futuras tornam-se concorrentes novamente. Veja a Seção 10.11.3, “Inserções Concorrentes”.

- Você pode colocar o arquivo de dados e o arquivo de índice em diretórios diferentes em dispositivos físicos diferentes para obter mais velocidade com as opções de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` para `CREATE TABLE`. Veja a Seção 15.1.20, “Instrução CREATE TABLE”.

- As colunas `BLOB` e `TEXT` podem ser indexadas.

- Os valores `NULL` são permitidos em colunas indexadas. Isso consome de 0 a 1 byte por chave.

- Cada coluna de caracteres pode ter um conjunto de caracteres diferente. Veja o Capítulo 12, *Conjunto de caracteres, Colagens, Unicode*.

- Há uma bandeira no arquivo de índice `MyISAM` que indica se a tabela foi fechada corretamente. Se o **mysqld** for iniciado com a variável de sistema `myisam_recover_options` definida, as tabelas `MyISAM` são verificadas automaticamente ao serem abertas e reparadas se a tabela não tiver sido fechada corretamente.

- O **myisamchk** marca as tabelas como verificadas se você executá-lo com a opção `--update-state`. **myisamchk --fast** verifica apenas aquelas tabelas que não têm essa marca.

- O comando **myisamchk --analyze** armazena estatísticas para partes de chaves, bem como para chaves inteiras.

- O **myisampack** pode embalar as colunas `BLOB` e `VARCHAR`.

`MyISAM` também suporta os seguintes recursos:

- Suporte para um tipo verdadeiro de `VARCHAR`; uma coluna `VARCHAR` começa com um comprimento armazenado em um ou dois bytes.

- As tabelas com colunas `VARCHAR` podem ter comprimento de linha fixo ou dinâmico.

- A soma das comprimentos das colunas `VARCHAR` e `CHAR` em uma tabela pode ser de até 64 KB.

- Restrições de comprimento arbitrário `UNIQUE`.

### Recursos adicionais

- Um fórum dedicado ao motor de armazenamento `MyISAM` está disponível em <https://forums.mysql.com/list.php?21>.
