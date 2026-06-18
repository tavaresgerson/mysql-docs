#### 15.1.20.1 Arquivos criados por CREATE TABLE

Para uma tabela `InnoDB` criada em um espaço de tabelas por arquivo ou espaço de tabelas geral, os dados da tabela e os índices associados são armazenados em um arquivo .ibd no diretório do banco de dados. Quando uma tabela `InnoDB` é criada no espaço de tabelas do sistema, os dados da tabela e os índices são armazenados nos arquivos ibdata\* que representam o espaço de tabelas do sistema. A opção `innodb_file_per_table` controla se as tabelas são criadas em espaços de tabelas por arquivo ou no espaço de tabelas do sistema, por padrão. A opção `TABLESPACE` pode ser usada para colocar uma tabela em um espaço de tabelas por arquivo, espaço de tabelas geral ou no espaço de tabelas do sistema, independentemente da configuração `innodb_file_per_table`.

Para as tabelas `MyISAM`, o mecanismo de armazenamento cria arquivos de dados e índices. Assim, para cada tabela `MyISAM` `tbl_name`, existem dois arquivos de disco.

<table summary="O propósito dos arquivos de disco da tabela MyISAM tbl_name."><thead><tr> <th>Arquivo</th> <th>Objetivo</th> </tr></thead><tbody><tr> <td>[[<code><em class="replaceable"><code>tbl_name</code>]]</em>.MYD</code></td> <td>Arquivo de dados</td> </tr><tr> <td>[[<code><em class="replaceable"><code>tbl_name</code>]]</em>.MYI</code></td> <td>Arquivo de índice</td> </tr></tbody></table>

O Capítulo 18, *Motores de Armazenamento Alternativos*, descreve quais arquivos cada motor de armazenamento cria para representar tabelas. Se o nome de uma tabela contiver caracteres especiais, os nomes dos arquivos da tabela conterão versões codificadas desses caracteres, conforme descrito na Seção 11.2.4, “Mapeamento de Identificadores a Nomes de Arquivos”.
