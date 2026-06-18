#### 6.2.2.1 Usar opções na linha de comando

As opções do programa especificadas na linha de comando seguem estas regras:

- As opções são fornecidas após o nome do comando.

- Um argumento de opção começa com uma ou duas barras, dependendo se é uma forma curta ou longa do nome da opção. Muitas opções têm formas curtas e longas. Por exemplo, `-?` e `--help` são as formas curta e longa da opção que instrui um programa MySQL a exibir sua mensagem de ajuda.

- Os nomes das opções são sensíveis a maiúsculas e minúsculas. `-v` e `-V` são ambos válidos e têm significados diferentes. (Eles são as formas abreviadas correspondentes das opções `--verbose` e `--version`.)

- Algumas opções aceitam um valor após o nome da opção. Por exemplo, `-h localhost` ou `--host=localhost` indicam o host do servidor MySQL para um programa cliente. O valor da opção informa ao programa o nome do host onde o servidor MySQL está em execução.

- Para uma opção longa que recebe um valor, separe o nome da opção e o valor com um sinal `=`. Para uma opção curta que recebe um valor, o valor da opção pode seguir imediatamente a letra da opção, ou pode haver um espaço entre eles: `-hlocalhost` e `-h localhost` são equivalentes. Uma exceção a essa regra é a opção para especificar sua senha do MySQL. Essa opção pode ser dada na forma longa como `--password=pass_val` ou como `--password`. No último caso (sem valor de senha dado), o programa solicita interativamente a senha. A opção de senha também pode ser dada na forma curta como `-ppass_val` ou como `-p`. No entanto, para a forma curta, se o valor da senha for dado, ele deve seguir a letra da opção com *sem espaço intermediário*: Se um espaço seguir a letra da opção, o programa não tem como saber se um argumento seguinte é o valor da senha ou algum outro tipo de argumento. Consequentemente, os dois comandos seguintes têm dois significados completamente diferentes:

  ```
  mysql -ptest
  mysql -p test
  ```

  O primeiro comando instrui o **mysql** a usar um valor de senha de `test`, mas não especifica um banco de dados padrão. O segundo comando instrui o **mysql** a solicitar o valor da senha e a usar `test` como o banco de dados padrão.

- Dentro dos nomes das opções, travessão (`-`) e sublinhado (`_`) podem ser usados de forma intercambiável na maioria dos casos, embora os travessões iniciais *não possam* ser usados como sublinhados. Por exemplo, `--skip-grant-tables` e `--skip_grant_tables` são equivalentes.

  Neste Manual, usamos travessões nos nomes das opções, exceto quando os sublinhados são significativos. Esse é o caso, por exemplo, de `--log-bin` e `--log_bin`, que são opções diferentes. Incentivamos que você faça o mesmo.

- O servidor MySQL possui certas opções de comando que podem ser especificadas apenas durante o inicialização, e um conjunto de variáveis de sistema, algumas das quais podem ser definidas durante o inicialização, durante a execução ou ambas. Os nomes das variáveis de sistema usam sublinhados em vez de travessões, e quando referenciadas durante a execução (por exemplo, usando as instruções `SET` ou `SELECT`), devem ser escritos com sublinhados:

  ```
  SET GLOBAL general_log = ON;
  SELECT @@GLOBAL.general_log;
  ```

  Ao iniciar o servidor, a sintaxe para variáveis de sistema é a mesma que para opções de comando, portanto, dentro dos nomes das variáveis, travessões e sublinhados podem ser usados de forma intercambiável. Por exemplo, `--general_log=ON` e `--general-log=ON` são equivalentes. (Isso também é verdadeiro para variáveis de sistema definidas em arquivos de opções.)

- Para opções que aceitam um valor numérico, o valor pode ser fornecido com o sufixo `K`, `M` ou `G` para indicar um multiplicador de 1024, 10242 ou

  10243. A partir do MySQL 8.0.14, um sufixo também pode ser `T`, `P` e `E` para indicar um multiplicador de 10244, 10245 ou

  10244. As letras do sufixo podem ser maiúsculas ou minúsculas.

  Por exemplo, o seguinte comando informa ao **mysqladmin** para pingar o servidor 1024 vezes, dormindo 10 segundos entre cada ping:

  ```
  mysqladmin --count=1K --sleep=10 ping
  ```

- Ao especificar nomes de arquivos como valores de opção, evite o uso do caractere meta `~` do shell. Ele pode não ser interpretado conforme o esperado.

Os valores das opções que contêm espaços devem ser entre aspas quando fornecidos na linha de comando. Por exemplo, a opção `--execute` (ou `-e`) pode ser usada com **mysql** para passar uma ou mais instruções SQL separadas por ponto e vírgula ao servidor. Quando essa opção é usada, o **mysql** executa as instruções no valor da opção e sai. As instruções devem ser fechadas entre aspas. Por exemplo:

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

Nota

A forma longa (`--execute`) é seguida por um sinal de igual (`=`).

Para usar valores citados dentro de uma declaração, você deve escapar as aspas internas ou usar um tipo diferente de aspas dentro da declaração das usadas para citar a própria declaração. As capacidades do seu processador de comandos ditam suas escolhas sobre se você pode usar aspas simples ou duplas e a sintaxe para escapar caracteres de aspas. Por exemplo, se o seu processador de comandos suportar a citação com aspas simples ou duplas, você pode usar aspas duplas ao redor da declaração e aspas simples para quaisquer valores citados dentro da declaração.
