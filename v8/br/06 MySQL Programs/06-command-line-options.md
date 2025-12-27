#### 6.2.2.1 Usando Opções na Linha de Comando

As opções do programa especificadas na linha de comando seguem estas regras:

* As opções são dadas após o nome do comando.
* Um argumento de opção começa com uma barra simples ou duas barras, dependendo se é uma forma curta ou longa do nome da opção. Muitas opções têm tanto formas curtas quanto longas. Por exemplo, `-?` e `--help` são as formas curtas e longas da opção que instrui um programa MySQL a exibir sua mensagem de ajuda.
* Os nomes das opções são sensíveis a maiúsculas e minúsculas. `-v` e `-V` são ambos válidos e têm significados diferentes. (Eles são as formas curtas correspondentes das opções `--verbose` e `--version`.)
* Algumas opções aceitam um valor após o nome da opção. Por exemplo, `-h localhost` ou `--host=localhost` indicam o host do servidor MySQL para um programa cliente. O valor da opção informa ao programa o nome do host onde o servidor MySQL está em execução.
* Para uma opção longa que aceita um valor, separe o nome da opção e o valor com um sinal `=` . Para uma opção curta que aceita um valor, o valor da opção pode seguir imediatamente a letra da opção, ou pode haver um espaço entre: `-hlocalhost` e `-h localhost` são equivalentes. Uma exceção a esta regra é a opção para especificar sua senha MySQL. Esta opção pode ser dada na forma longa como `--password=pass_val` ou como `--password`. No último caso (sem valor de senha dado), o programa solicita interativamente a senha. A opção de senha também pode ser dada na forma curta como `-ppass_val` ou como `-p`. No entanto, para a forma curta, se o valor da senha for dado, ele deve seguir a letra da opção sem espaço intermediário: Se um espaço seguir a letra da opção, o programa não tem como saber se um argumento seguinte é o valor da senha ou algum outro tipo de argumento. Consequentemente, os dois comandos seguintes têm significados completamente diferentes:

  ```
  mysql -ptest
  mysql -p test
  ```

O primeiro comando instrui o `mysql` a usar um valor de senha de `test`, mas não especifica uma base de dados padrão. O segundo comando instrui o `mysql` a solicitar o valor da senha e a usar `test` como a base de dados padrão.
* Dentro dos nomes das opções, traço (`-`) e sublinha (`_`) podem ser usados de forma intercambiável na maioria dos casos, embora os traços iniciais *não possam* ser usados como sublinhados. Por exemplo, `--skip-grant-tables` e `--skip_grant_tables` são equivalentes.

Neste Manual, usamos traços nos nomes das opções, exceto quando os sublinhados são significativos. Esse é o caso, por exemplo, de `--log-bin` e `--log_bin`, que são opções diferentes. Também o incentivamos a fazer o mesmo.
* O servidor MySQL tem certas opções de comando que podem ser especificadas apenas no início e um conjunto de variáveis de sistema, algumas das quais podem ser definidas no início, durante a execução ou em ambos. Os nomes das variáveis de sistema usam sublinhados em vez de traços, e quando referenciadas durante a execução (por exemplo, usando instruções `SET` ou `SELECT`), devem ser escritas usando sublinhados:

  ```
  SET GLOBAL general_log = ON;
  SELECT @@GLOBAL.general_log;
  ```

  No início do servidor, a sintaxe para variáveis de sistema é a mesma que para opções de comando, então, dentro dos nomes das variáveis, traços e sublinhados podem ser usados de forma intercambiável. Por exemplo, `--general_log=ON` e `--general-log=ON` são equivalentes. (Isso também é verdadeiro para variáveis de sistema definidas dentro de arquivos de opção.)
* Para opções que aceitam um valor numérico, o valor pode ser fornecido com um sufixo de `K`, `M` ou `G` para indicar um multiplicador de 1024, 10242 ou
  10243. A partir do MySQL 8.0.14, um sufixo também pode ser `T`, `P` e `E` para indicar um multiplicador de 10244, 10245 ou
  10246. As letras dos sufixos podem ser maiúsculas ou minúsculas.

Por exemplo, o seguinte comando instrui o `mysqladmin` a pingar o servidor 1024 vezes, dormindo 10 segundos entre cada ping:

  ```
  mysqladmin --count=1K --sleep=10 ping
  ```
* Ao especificar nomes de arquivos como valores de opção, evite o uso do caractere metacaracter `~` do shell. Ele pode não ser interpretado como você espera.

Os valores das opções que contêm espaços devem ser entre aspas quando fornecidos na linha de comando. Por exemplo, a opção `--execute` (ou `-e`) pode ser usada com `mysql` para passar uma ou mais instruções SQL separadas por ponto e vírgula para o servidor. Quando essa opção é usada, o `mysql` executa as instruções no valor da opção e sai. As instruções devem ser fechadas com aspas. Por exemplo:

```
$> mysql -u root -p -e "SELECT VERSION();SELECT NOW()"
Enter password: ******
+------------+
| VERSION()  |
+------------+
| 8.0.19     |
+------------+
+---------------------+
| NOW()               |
+---------------------+
| 2019-09-03 10:36:48 |
+---------------------+
$>
```

::: info Nota

A forma longa ( `--execute`) é seguida por um sinal de igual (`=`).

:::

Para usar valores entre aspas dentro de uma instrução, você deve escapar as aspas internas ou usar um tipo diferente de aspas dentro da instrução das usadas para citar a própria instrução. As capacidades do seu processador de comandos ditam suas escolhas sobre se você pode usar aspas simples ou duplas e a sintaxe para escapar caracteres de aspas. Por exemplo, se o seu processador de comandos suportar a citação com aspas simples ou duplas, você pode usar aspas duplas ao redor da instrução e aspas simples para quaisquer valores citados dentro da instrução.