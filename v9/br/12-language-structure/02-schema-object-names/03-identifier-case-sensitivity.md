### 11.2.3 Sensibilidade de Caso dos Identificadores

No MySQL, os bancos de dados correspondem a diretórios dentro do diretório de dados. Cada tabela dentro de um banco de dados corresponde a pelo menos um arquivo dentro do diretório do banco de dados (e possivelmente mais, dependendo do mecanismo de armazenamento). Os gatilhos também correspondem a arquivos. Consequentemente, a sensibilidade de caso do sistema operacional subjacente desempenha um papel na sensibilidade de caso dos nomes de banco de dados, tabelas e gatilhos. Isso significa que tais nomes não são sensíveis ao caso em Windows, mas são sensíveis ao caso na maioria das variedades de Unix. Uma exceção notável é o macOS, que é baseado em Unix, mas usa um tipo de sistema de arquivos padrão (HFS+) que não é sensível ao caso. No entanto, o macOS também suporta volumes UFS, que são sensíveis ao caso assim como em qualquer Unix. Veja a Seção 1.7.1, “Extensões MySQL ao SQL Padrão”. A variável de sistema `lower_case_table_names` também afeta como o servidor lida com a sensibilidade de caso dos identificadores, conforme descrito mais adiante nesta seção.

Nota

Embora os nomes de banco de dados, tabela e gatilho não sejam sensíveis ao caso em algumas plataformas, você não deve referir-se a um desses usando diferentes casos dentro da mesma declaração. A seguinte declaração não funcionaria porque se refere a uma tabela tanto como `my_table` quanto como `MY_TABLE`:

```
mysql> SELECT * FROM my_table WHERE MY_TABLE.col=1;
```

Os nomes de partição, subpartição, coluna, índice, rotina armazenada, evento e grupo de recursos não são sensíveis ao caso em nenhuma plataforma, assim como os aliases de coluna.

No entanto, os nomes dos grupos de logfile são sensíveis ao caso. Isso difere do SQL padrão.

Por padrão, os aliases de tabela são sensíveis ao caso em Unix, mas não no Windows ou no macOS. A seguinte declaração não funcionaria em Unix, porque se refere ao alias tanto como `a` quanto como `A`:

```
mysql> SELECT col_name FROM tbl_name AS a
       WHERE a.col_name = 1 OR A.col_name = 2;
```

No entanto, essa mesma declaração é permitida no Windows. Para evitar problemas causados por essas diferenças, é melhor adotar uma convenção consistente, como sempre criar e referenciar bancos de dados e tabelas usando nomes em minúsculas. Essa convenção é recomendada para máxima portabilidade e facilidade de uso.

Como os nomes de tabelas e bancos de dados são armazenados no disco e usados no MySQL, é afetado pela variável de sistema `lower_case_table_names`. `lower_case_table_names` pode assumir os valores mostrados na tabela a seguir. Essa variável *não* afeta a sensibilidade de caso dos identificadores de gatilho. No Unix, o valor padrão de `lower_case_table_names` é 0. No Windows, o valor padrão é 1. No macOS, o valor padrão é 2.

`lower_case_table_names` só pode ser configurado ao inicializar o servidor. Alterar o ajuste `lower_case_table_names` após o servidor ser inicializado é proibido.

<table summary="Valores para a variável de sistema lower_case_table_names."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Valor</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>0</code></td> <td>Os nomes de tabelas e bancos de dados são armazenados no disco usando a letra maiúscula especificada na declaração <code>CREATE TABLE</code> ou <code>CREATE DATABASE</code>. As comparações de nomes são sensíveis à letra maiúscula. Você não deve <span class="emphasis"><em>definir</em></span> essa variável para 0 se estiver executando o MySQL em um sistema que tem nomes de arquivos não sensíveis à letra maiúscula (como Windows ou macOS). Se você forçar essa variável para 0 com <code>--lower-case-table-names=0</code> em um sistema de arquivos não sensível à letra maiúscula e acessar nomes de tabelas <code>MyISAM</code> usando diferentes letras, pode ocorrer corrupção de índice.</td> </tr><tr> <td><code>1</code></td> <td>Os nomes de tabelas são armazenados em minúsculas no disco e as comparações de nomes não são sensíveis à letra maiúscula. O MySQL converte todos os nomes de tabelas para minúsculas no armazenamento e busca. Esse comportamento também se aplica aos nomes de bancos de dados e aliases de tabelas.</td> </tr><tr> <td><code>2</code></td> <td>Os nomes de tabelas e bancos de dados são armazenados no disco usando a letra maiúscula especificada na declaração <code>CREATE TABLE</code> ou <code>CREATE DATABASE</code>, mas o MySQL converte-os para minúsculas na busca. As comparações de nomes não são sensíveis à letra maiúscula. Esse comportamento funciona <span class="emphasis"><em>apenas</em></span> em sistemas de arquivos que não são sensíveis à letra maiúscula! Os nomes de tabelas <code>InnoDB</code> e os nomes de vistas são armazenados em minúsculas, como para <code>lower_case_table_names=1</code>.</td> </tr></tbody></table>

Se você estiver usando MySQL em apenas uma plataforma, normalmente não precisa usar uma configuração `lower_case_table_names` além da padrão. No entanto, você pode encontrar dificuldades se quiser transferir tabelas entre plataformas que diferem na sensibilidade ao caso das letras do sistema de arquivos. Por exemplo, no Unix, você pode ter duas tabelas diferentes chamadas `my_table` e `MY_TABLE`, mas no Windows esses dois nomes são considerados idênticos. Para evitar problemas de transferência de dados decorrentes da letra maiúscula ou minúscula dos nomes de bancos de dados ou tabelas, você tem duas opções:

* Use `lower_case_table_names=1` em todos os sistemas. A principal desvantagem disso é que, quando você usa `SHOW TABLES` ou `SHOW DATABASES`, você não vê os nomes em seu caso original.

* Use `lower_case_table_names=0` no Unix e `lower_case_table_names=2` no Windows. Isso preserva o caso maiúsculo dos nomes de bancos de dados e tabelas. A desvantagem disso é que você deve garantir que suas declarações sempre se refiram aos seus nomes de banco de dados e tabelas com o caso correto no Windows. Se você transferir suas declarações para o Unix, onde o caso das letras é significativo, elas não funcionam se o caso das letras estiver incorreto.

**Exceção**: Se você estiver usando tabelas `InnoDB` e estiver tentando evitar esses problemas de transferência de dados, você deve usar `lower_case_table_names=1` em todas as plataformas para forçar que os nomes sejam convertidos para minúsculas.

Os nomes de objetos podem ser considerados duplicados se suas formas maiúsculas forem iguais de acordo com uma ordenação binária. Isso é verdade para nomes de cursors, condições, procedimentos, funções, pontos de salvamento, parâmetros de rotinas armazenadas, variáveis locais de programas armazenados e plugins. Não é verdade para nomes de colunas, restrições, bancos de dados, partições, declarações preparadas com `PREPARE`, tabelas, gatilhos, usuários e variáveis definidas pelo usuário.

A sensibilidade à maiúscula ou minúscula do sistema de arquivos pode afetar as pesquisas em colunas de strings das tabelas do `INFORMATION_SCHEMA`. Para obter mais informações, consulte a Seção 12.8.7, “Usando a Cotação em Pesquisas do INFORMATION_SCHEMA”.