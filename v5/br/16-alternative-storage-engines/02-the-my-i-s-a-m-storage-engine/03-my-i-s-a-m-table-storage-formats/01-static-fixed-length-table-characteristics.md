#### 15.2.3.1 Características de Tabelas Estáticas (Comprimento Fixo)

O formato estático é o padrão para tabelas `MyISAM`. Ele é usado quando a tabela não contém colunas de comprimento variável (`VARCHAR`, `VARBINARY`, `BLOB` ou `TEXT`). Cada linha é armazenada usando um número fixo de bytes.

Dos três formatos de armazenamento `MyISAM`, o formato estático é o mais simples e seguro (o menos sujeito à corrupção). É também o mais rápido dos formatos em disco devido à facilidade com que as linhas no arquivo de dados podem ser encontradas no disco: Para buscar uma linha com base em um número de linha no Index, multiplique o número da linha pelo comprimento da linha para calcular a posição da linha. Além disso, ao escanear uma tabela, é muito fácil ler um número constante de linhas a cada operação de leitura de disco.

A segurança é evidenciada se o seu computador falhar enquanto o servidor MySQL estiver escrevendo em um arquivo `MyISAM` de formato fixo. Neste caso, o **myisamchk** pode determinar facilmente onde cada linha começa e termina, de modo que geralmente pode recuperar todas as linhas, exceto aquela parcialmente escrita. Os Indexes de tabelas `MyISAM` podem ser sempre reconstruídos com base nas linhas de dados.

Nota

O formato de linha de comprimento fixo está disponível apenas para tabelas sem colunas `BLOB` ou `TEXT`. A criação de uma tabela com essas colunas usando uma cláusula `ROW_FORMAT` explícita não gera um error ou warning; a especificação do formato é ignorada.

Tabelas de formato estático possuem estas características:

* Colunas `CHAR` e `VARCHAR` são preenchidas com espaços (space-padded) até a largura especificada da coluna, embora o tipo de coluna não seja alterado. Colunas `BINARY` e `VARBINARY` são preenchidas com bytes `0x00` até a largura da coluna.

* Colunas `NULL` exigem espaço adicional na linha para registrar se seus valores são `NULL`. Cada coluna `NULL` ocupa um bit extra, arredondado para o byte mais próximo.

* Muito rápidas.
* Fáceis de fazer cache.
* Fáceis de reconstruir após uma falha (crash), pois as linhas estão localizadas em posições fixas.

* A reorganização é desnecessária, a menos que você exclua um grande número de linhas e queira retornar o espaço livre em disco para o sistema operacional. Para fazer isso, use `OPTIMIZE TABLE` ou **myisamchk -r**.

* Geralmente requerem mais espaço em disco do que as tabelas de formato dinâmico.
* O comprimento de linha esperado em bytes para linhas de tamanho estático é calculado usando a seguinte expressão:

  ```sql
  row length = 1
               + (sum of column lengths)
               + (number of NULL columns + delete_flag + 7)/8
               + (number of variable-length columns)
  ```

*`delete_flag`* é 1 para tabelas com formato de linha estático. As tabelas estáticas usam um bit no registro da linha como uma flag que indica se a linha foi excluída. *`delete_flag`* é 0 para tabelas dinâmicas porque a flag é armazenada no header de linha dinâmico.