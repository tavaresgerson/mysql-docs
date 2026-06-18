### 11.2.3 Sensibilidade do identificador à maiúscula e minúscula

No MySQL, os bancos de dados correspondem a diretórios dentro do diretório de dados. Cada tabela dentro de um banco de dados corresponde a pelo menos um arquivo dentro do diretório do banco de dados (e possivelmente mais, dependendo do mecanismo de armazenamento). Os gatilhos também correspondem a arquivos. Consequentemente, a sensibilidade à maiúscula ou minúscula do sistema operacional subjacente desempenha um papel na sensibilidade à maiúscula ou minúscula dos nomes de banco de dados, tabelas e gatilhos. Isso significa que esses nomes não são sensíveis à maiúscula ou minúscula no Windows, mas são sensíveis à maiúscula ou minúscula na maioria das variedades do Unix. Uma exceção notável é o macOS, que é baseado no Unix, mas usa um tipo de sistema de arquivos padrão (HFS+) que não é sensível à maiúscula ou minúscula. No entanto, o macOS também suporta volumes UFS, que são sensíveis à maiúscula ou minúscula da mesma forma que em qualquer Unix. Veja a Seção 1.6.1, “Extensões MySQL para SQL Padrão”. A variável de sistema `lower_case_table_names` também afeta como o servidor lida com a sensibilidade à maiúscula ou minúscula dos identificadores, conforme descrito mais adiante nesta seção.

Nota

Embora os nomes de bancos de dados, tabelas e gatilhos não sejam sensíveis ao maiúsculas e minúsculas em algumas plataformas, você não deve se referir a um deles usando diferentes casos dentro da mesma declaração. A seguinte declaração não funcionaria porque ela se refere a uma tabela tanto como `my_table` quanto como `MY_TABLE`:

```
mysql> SELECT * FROM my_table WHERE MY_TABLE.col=1;
```

Os nomes de partição, subpartição, coluna, índice, rotina armazenada, evento e grupo de recursos não são sensíveis ao caso em nenhuma plataforma, assim como os aliases de coluna.

No entanto, os nomes dos grupos de logfile são sensíveis a maiúsculas e minúsculas. Isso difere do SQL padrão.

Por padrão, os aliases de tabela são sensíveis a maiúsculas e minúsculas no Unix, mas não no Windows ou no macOS. A seguinte declaração não funcionaria no Unix, porque ela se refere ao alias tanto como `a` quanto como `A`:

```
mysql> SELECT col_name FROM tbl_name AS a
       WHERE a.col_name = 1 OR A.col_name = 2;
```

No entanto, essa mesma declaração é permitida no Windows. Para evitar problemas causados por essas diferenças, é melhor adotar uma convenção consistente, como sempre criar e referenciar bancos de dados e tabelas usando nomes em minúsculas. Essa convenção é recomendada para máxima portabilidade e facilidade de uso.

A forma como os nomes de tabelas e bancos de dados são armazenados no disco e usados no MySQL é afetada pela variável de sistema `lower_case_table_names`. `lower_case_table_names` pode assumir os valores mostrados na tabela a seguir. Essa variável *não* afeta a sensibilidade ao caso dos identificadores de gatilho. No Unix, o valor padrão de `lower_case_table_names` é 0. No Windows, o valor padrão é 1. No macOS, o valor padrão é 2.

O `lower_case_table_names` só pode ser configurado durante a inicialização do servidor. Alterar o ajuste `lower_case_table_names` após a inicialização do servidor é proibido.

<table summary="Valores para a variável de sistema lower_case_table_names."><thead><tr> <th>Valor</th> <th>Significado</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>lower_case_table_names=1</code>]</td> <td>Os nomes de tabelas e bancos de dados são armazenados no disco usando a letra maiúscula especificada na declaração [[PH_HTML_CODE_<code>lower_case_table_names=1</code>] ou [[<code>CREATE DATABASE</code>]]. As comparações de nomes são sensíveis à maiúscula. Você deve<span class="emphasis"><em>não</em></span>defina essa variável para 0 se estiver executando o MySQL em um sistema que tem nomes de arquivos não sensíveis ao caso (como o Windows ou o macOS). Se você forçar essa variável para 0 com [[<code>--lower-case-table-names=0</code>]] em um sistema de arquivos não sensível ao caso e acessar os nomes de tabelas [[<code>MyISAM</code>]] usando diferentes maiúsculas e minúsculas, pode ocorrer corrupção de índice.</td> </tr><tr> <td>[[<code>1</code>]]</td> <td>Os nomes das tabelas são armazenados em minúsculas no disco e as comparações de nomes não são sensíveis ao maiúsculas e minúsculas. O MySQL converte todos os nomes das tabelas para minúsculas durante o armazenamento e a pesquisa. Esse comportamento também se aplica aos nomes dos bancos de dados e aos aliases das tabelas.</td> </tr><tr> <td>[[<code>2</code>]]</td> <td>Os nomes de tabelas e bancos de dados são armazenados no disco usando a letra maiúscula especificada na declaração [[<code>CREATE TABLE</code>]] ou [[<code>CREATE DATABASE</code>]], mas o MySQL os converte para minúsculas na consulta. As comparações de nomes não são sensíveis à letra inicial. Isso funciona<span class="emphasis"><em>apenas</em></span>nos sistemas de arquivos que não são case-sensitive! Os nomes de tabelas e vistas são armazenados em minúsculas, como no [[<code>lower_case_table_names=1</code>]].</td> </tr></tbody></table>

Se você estiver usando o MySQL em apenas uma plataforma, normalmente não precisa usar um ajuste `lower_case_table_names` além do padrão. No entanto, você pode encontrar dificuldades se quiser transferir tabelas entre plataformas que diferem na sensibilidade ao caso de letras do sistema de arquivos. Por exemplo, no Unix, você pode ter duas tabelas diferentes chamadas `my_table` e `MY_TABLE`, mas no Windows esses dois nomes são considerados idênticos. Para evitar problemas de transferência de dados decorrentes do caso de letras dos nomes de bancos de dados ou tabelas, você tem duas opções:

- Use `lower_case_table_names=1` em todos os sistemas. A principal desvantagem disso é que, quando você usa `SHOW TABLES` ou `SHOW DATABASES`, você não verá os nomes em maiúsculas.

- Use `lower_case_table_names=0` no Unix e `lower_case_table_names=2` no Windows. Isso preserva a maiúscula das letras dos nomes de banco de dados e tabelas. A desvantagem disso é que você deve garantir que suas instruções sempre se refiram aos nomes de banco de dados e tabelas com a letra correta no Windows. Se você transferir suas instruções para o Unix, onde a letra é importante, elas não funcionarão se a letra estiver incorreta.

  **Exceção**: Se você estiver usando tabelas `InnoDB` e estiver tentando evitar esses problemas de transferência de dados, você deve usar `lower_case_table_names=1` em todas as plataformas para forçar a conversão dos nomes para maiúsculas minúsculas.

Os nomes de objetos podem ser considerados duplicados se suas formas maiúsculas forem iguais de acordo com uma ordenação binária. Isso é verdadeiro para nomes de cursors, condições, procedimentos, funções, pontos de salvamento, parâmetros de rotina armazenada, variáveis locais de programas armazenados e plugins. Não é verdadeiro para nomes de colunas, restrições, bancos de dados, partições, instruções preparadas com `PREPARE`, tabelas, gatilhos, usuários e variáveis definidas pelo usuário.

A sensibilidade à maiúscula ou minúscula do sistema de arquivos pode afetar as pesquisas em colunas de strings das tabelas `INFORMATION_SCHEMA`. Para obter mais informações, consulte a Seção 12.8.7, “Usando a Cotação em Pesquisas do INFORMATION\_SCHEMA”.
