### 9.2.3 Sensibilidade do identificador à maiúscula e minúscula

No MySQL, os bancos de dados correspondem a diretórios dentro do diretório de dados. Cada tabela dentro de um banco de dados corresponde a pelo menos um arquivo dentro do diretório do banco de dados (e possivelmente mais, dependendo do mecanismo de armazenamento). Os gatilhos também correspondem a arquivos. Consequentemente, a sensibilidade à maiúscula ou minúscula do sistema operacional subjacente desempenha um papel na sensibilidade à maiúscula ou minúscula dos nomes de banco de dados, tabelas e gatilhos. Isso significa que esses nomes não são sensíveis à maiúscula ou minúscula no Windows, mas são sensíveis à maiúscula ou minúscula na maioria das variedades do Unix. Uma exceção notável é o macOS, que é baseado no Unix, mas usa um tipo de sistema de arquivos padrão (HFS+) que não é sensível à maiúscula ou minúscula. No entanto, o macOS também suporta volumes UFS, que são sensíveis à maiúscula ou minúscula da mesma forma que em qualquer Unix. Veja a Seção 1.6.1, “Extensões MySQL para SQL Padrão”. A variável de sistema `lower_case_table_names` também afeta como o servidor lida com a sensibilidade à maiúscula ou minúscula dos identificadores, conforme descrito mais adiante nesta seção.

Nota

Embora os nomes de bancos de dados, tabelas e gatilhos não sejam sensíveis ao caso em algumas plataformas, você não deve se referir a um deles usando diferentes casos dentro da mesma declaração. A seguinte declaração não funcionaria porque ela se refere a uma tabela tanto como `my_table` quanto como `MY_TABLE`:

```sql
mysql> SELECT * FROM my_table WHERE MY_TABLE.col=1;
```

Os nomes de colunas, índices, rotinas armazenadas e eventos não são sensíveis ao caso em nenhuma plataforma, assim como os aliases de colunas.

No entanto, os nomes dos grupos de logfile são sensíveis a maiúsculas e minúsculas. Isso difere do SQL padrão.

Por padrão, os aliases de tabela são sensíveis a maiúsculas e minúsculas no Unix, mas não no Windows ou no macOS. A seguinte declaração não funcionaria no Unix, porque ela se refere ao alias tanto como `a` quanto como `A`:

```sql
mysql> SELECT col_name FROM tbl_name AS a
       WHERE a.col_name = 1 OR A.col_name = 2;
```

No entanto, essa mesma declaração é permitida no Windows. Para evitar problemas causados por essas diferenças, é melhor adotar uma convenção consistente, como sempre criar e referenciar bancos de dados e tabelas usando nomes em minúsculas. Essa convenção é recomendada para máxima portabilidade e facilidade de uso.

A forma como os nomes de tabelas e bancos de dados são armazenados no disco e usados no MySQL é afetada pela variável de sistema `lower_case_table_names`, que você pode definir ao iniciar o **mysqld**. `lower_case_table_names` pode assumir os valores mostrados na tabela a seguir. Essa variável *não* afeta a sensibilidade de maiúsculas e minúsculas dos identificadores de gatilho. No Unix, o valor padrão de `lower_case_table_names` é 0. No Windows, o valor padrão é 1. No macOS, o valor padrão é 2.

<table summary="Valores para a variável de sistema lower_case_table_names.">
  <col style="width: 10%"/>
  <col style="width: 90%"/>
  <thead>
    <tr>
      <th>Value</th>
      <th>Meaning</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>0</code></td>
      <td>Os nomes de tabelas e bancos de dados são armazenados no disco usando letras maiúsculas especificadas na instrução <code>CREATE TABLE</code> ou <code>CREATE DATABASE</code>. As comparações de nomes diferenciam maiúsculas de minúsculas. Você não deve <span><em>não</em></span> definir esta variável como 0 se estiver executando o MySQL em um sistema que possui nomes de arquivos que não diferenciam maiúsculas de minúsculas (como Windows ou macOS). Se você forçar esta variável para 0 com <code>--lower-case-table-names=0</code> em um sistema de arquivos que não diferencia maiúsculas de minúsculas e acessar nomes de tabelas <code>MyISAM</code> usando letras diferentes, poderá ocorrer corrupção do índice.</td>
    </tr>
    <tr>
      <td><code>1</code></td>
      <td>Os nomes das tabelas são armazenados em letras minúsculas no disco e as comparações de nomes não diferenciam maiúsculas de minúsculas. O MySQL converte todos os nomes de tabelas em letras minúsculas no armazenamento e na pesquisa. Esse comportamento também se aplica a nomes de bancos de dados e aliases de tabelas.</td>
    </tr>
    <tr>
      <td><code>2</code></td>
      <td>Os nomes de tabelas e bancos de dados são armazenados no disco usando letras maiúsculas especificadas na instrução <code>CREATE TABLE</code> ou <code>CREATE DATABASE</code>, mas o MySQL os converte para letras minúsculas na pesquisa. As comparações de nomes não diferenciam maiúsculas de minúsculas. Isso funciona <span><em>somente</em></span> em sistemas de arquivos que não diferenciam maiúsculas de minúsculas! Os nomes de tabelas e nomes de visualizações do <code>InnoDB</code> são armazenados em letras minúsculas, como em <code>lower_case_table_names=1</code>.</td>
    </tr>
  </tbody>
</table>

Se você estiver usando o MySQL em apenas uma plataforma, normalmente não precisa alterar a variável `lower_case_table_names` do seu valor padrão. No entanto, você pode encontrar dificuldades se quiser transferir tabelas entre plataformas que diferem na sensibilidade ao caso de letras do sistema de arquivos. Por exemplo, no Unix, você pode ter duas tabelas diferentes chamadas `my_table` e `MY_TABLE`, mas no Windows esses dois nomes são considerados idênticos. Para evitar problemas de transferência de dados decorrentes da letra maiúscula ou minúscula dos nomes de bancos de dados ou tabelas, você tem duas opções:

- Use `lower_case_table_names=1` em todos os sistemas. A principal desvantagem disso é que, quando você usa `SHOW TABLES` ou `SHOW DATABASES`, você não vê os nomes em maiúsculas.

- Use `lower_case_table_names=0` no Unix e `lower_case_table_names=2` no Windows. Isso preserva a maiúscula ou minúscula dos nomes de banco de dados e tabelas. A desvantagem disso é que você deve garantir que suas instruções sempre se refiram aos nomes de banco de dados e tabelas com a letra correta no Windows. Se você transferir suas instruções para o Unix, onde a letra é importante, elas não funcionarão se a letra estiver incorreta.

  **Exceção**: Se você estiver usando tabelas `InnoDB` e estiver tentando evitar esses problemas de transferência de dados, você deve definir `lower_case_table_names` para 1 em todas as plataformas para forçar a conversão dos nomes para maiúsculas minúsculas.

Se você planeja definir a variável de sistema `lower_case_table_names` para 1 no Unix, você deve primeiro converter os nomes de banco de dados e tabelas antigos para minúsculas antes de parar o **mysqld** e reiniciá-lo com o novo valor da variável. Para fazer isso para uma tabela individual, use `RENAME TABLE`:

```sql
RENAME TABLE T1 TO t1;
```

Para converter um ou mais bancos de dados inteiros, faça um dump deles antes de definir `lower_case_table_names`, depois exclua os bancos de dados e recarregue-os após definir `lower_case_table_names`:

1. Use **mysqldump** para fazer o dump de cada banco de dados:

   ```sql
   mysqldump --databases db1 > db1.sql
   mysqldump --databases db2 > db2.sql
   ...
   ```

   Faça isso para cada banco de dados que precisa ser recriado.

2. Use `DROP DATABASE` para excluir cada banco de dados.

3. Pare o servidor, defina `lower_case_table_names` e reinicie o servidor.

4. Recarregue o arquivo de dump para cada banco de dados. Como `lower_case_table_names` está definido, cada nome de banco de dados e tabela é convertido para minúsculas ao ser recriado:

   ```sql
   mysql < db1.sql
   mysql < db2.sql
   ...
   ```

Os nomes de objetos podem ser considerados duplicados se suas formas maiúsculas forem iguais de acordo com uma ordenação binária. Isso é verdadeiro para nomes de cursors, condições, procedimentos, funções, pontos de salvamento, parâmetros de rotina armazenada, variáveis locais de programas armazenados e plugins. Não é verdadeiro para nomes de colunas, restrições, bancos de dados, partições, instruções preparadas com `PREPARE`, tabelas, gatilhos, usuários e variáveis definidas pelo usuário.

A sensibilidade à maiúscula ou minúscula do sistema de arquivos pode afetar as pesquisas em colunas de strings das tabelas do `INFORMATION_SCHEMA`. Para mais informações, consulte a Seção 10.8.7, “Usando a Cotação em Pesquisas do INFORMATION_SCHEMA”.
