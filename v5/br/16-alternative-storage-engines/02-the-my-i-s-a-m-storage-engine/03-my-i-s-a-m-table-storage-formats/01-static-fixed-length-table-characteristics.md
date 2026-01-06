#### 15.2.3.1 Características de uma tabela estática (com comprimento fixo)

O formato estático é o padrão para as tabelas `MyISAM`. Ele é usado quando a tabela não contém colunas de comprimento variável (`VARCHAR`, `VARBINARY`, `BLOB` ou `TEXT`). Cada linha é armazenada com um número fixo de bytes.

Dos três formatos de armazenamento `MyISAM`, o formato estático é o mais simples e seguro (menos propenso à corrupção). É também o mais rápido dos formatos em disco, devido à facilidade com que as linhas no arquivo de dados podem ser encontradas no disco: para procurar uma linha com base em um número de linha no índice, multiplique o número de linha pela extensão da linha para calcular a posição da linha. Além disso, ao digitalizar uma tabela, é muito fácil ler um número constante de linhas em cada operação de leitura em disco.

A segurança é evidenciada se o seu computador falhar enquanto o servidor MySQL está escrevendo em um arquivo `MyISAM` de formato fixo. Nesse caso, o **myisamchk** pode facilmente determinar onde cada linha começa e termina, permitindo que ele recupere todas as linhas, exceto a parcialmente escrita. Os índices das tabelas `MyISAM` sempre podem ser reconstruídos com base nas linhas de dados.

Nota

O formato de linha de comprimento fixo está disponível apenas para tabelas sem colunas `BLOB` ou `TEXT`. Criar uma tabela com essas colunas com uma cláusula explícita `ROW_FORMAT` não gera um erro ou aviso; a especificação do formato é ignorada.

As tabelas em formato estático têm essas características:

- As colunas `CHAR` e `VARCHAR` são preenchidas com espaços até a largura da coluna especificada, embora o tipo da coluna não seja alterado. As colunas `BINARY` e `VARBINARY` são preenchidas com bytes `0x00` até a largura da coluna.

- As colunas `NULL` exigem espaço adicional na linha para registrar se seus valores são `NULL`. Cada coluna `NULL` ocupa um bit extra, arredondado para o byte mais próximo.

- Muito rápido.

- Fácil de armazenar em cache.

- Fácil de reconstruir após um acidente, porque as linhas estão localizadas em posições fixas.

- A reorganização não é necessária, a menos que você queira excluir um grande número de linhas e liberar espaço em disco para o sistema operacional. Para fazer isso, use `OPTIMIZE TABLE` ou **myisamchk -r**.

- Geralmente exigem mais espaço em disco do que as tabelas de formato dinâmico.

- O comprimento da linha esperado em bytes para linhas de tamanho estático é calculado usando a seguinte expressão:

  ```sql
  row length = 1
               + (sum of column lengths)
               + (number of NULL columns + delete_flag + 7)/8
               + (number of variable-length columns)
  ```

  *`delete_flag`* é 1 para tabelas com formato de linha estático. As tabelas estáticas usam um bit no registro da linha para uma bandeira que indica se a linha foi excluída. *`delete_flag`* é 0 para tabelas dinâmicas, pois a bandeira é armazenada no cabeçalho dinâmico da linha.
