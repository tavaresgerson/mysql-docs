#### 4.2.2.1 Usando Options na Command Line

As Options de programa especificadas na Command Line seguem estas regras:

* As Options são fornecidas após o nome do comando.
* Um argumento de Option começa com um traço ou dois traços, dependendo se é a forma curta (short form) ou forma longa (long form) do nome da Option. Muitas Options possuem ambas as formas. Por exemplo, `-?` e `--help` são as formas curta e longa da Option que instrui um programa MySQL a exibir sua mensagem de ajuda (help message).
* Os nomes das Options diferenciam maiúsculas de minúsculas (case-sensitive). `-v` e `-V` são ambos válidos (legal) e têm significados diferentes. (Eles são as formas curtas correspondentes das Options `--verbose` e `--version`.)
* Algumas Options aceitam um valor após o nome da Option. Por exemplo, `-h localhost` ou `--host=localhost` indicam o host do MySQL Server a um programa Client. O valor da Option informa ao programa o nome do host onde o MySQL Server está em execução.
* Para uma Option longa que requer um valor, separe o nome da Option e o valor por um sinal de `=`. Para uma Option curta que requer um valor, o valor da Option pode seguir imediatamente a letra da Option, ou pode haver um espaço entre eles: `-hlocalhost` e `-h localhost` são equivalentes. Uma exceção a esta regra é a Option para especificar sua senha do MySQL. Esta Option pode ser fornecida na forma longa como `--password=pass_val` ou como `--password`. Neste último caso (sem valor de senha fornecido), o programa solicitará a senha de forma interativa. A Option de senha também pode ser fornecida na forma curta como `-ppass_val` ou como `-p`. No entanto, para a forma curta, se o valor da senha for fornecido, ele deve seguir a letra da Option *sem espaço intermediário*: Se um espaço seguir a letra da Option, o programa não tem como saber se um argumento subsequente deve ser o valor da senha ou algum outro tipo de argumento. Consequentemente, os dois comandos a seguir têm significados completamente diferentes:

  ```sql
  mysql -ptest
  mysql -p test
  ```

  O primeiro comando instrui o **mysql** a usar o valor de senha `test`, mas não especifica um Database padrão. O segundo instrui o **mysql** a solicitar interativamente o valor da senha e a usar `test` como o Database padrão.

* Dentro dos nomes das Options, traço (`-`) e underscore (`_`) podem ser usados de forma intercambiável na maioria dos casos, embora os traços iniciais *não* possam ser fornecidos como underscores. Por exemplo, `--skip-grant-tables` e `--skip_grant_tables` são equivalentes.

  Neste Manual, usamos traços nos nomes das Options, exceto onde underscores são significativos. É o caso de, por exemplo, `--log-bin` e `--log_bin`, que são Options diferentes. Encorajamos você a fazer o mesmo.

* O MySQL Server possui certas Options de comando que podem ser especificadas apenas na inicialização (startup), e um conjunto de variáveis de sistema, algumas das quais podem ser definidas na inicialização, em tempo de execução (runtime), ou em ambos. Os nomes das variáveis de sistema usam underscores em vez de traços e, quando referenciados em runtime (por exemplo, usando instruções `SET` ou `SELECT`), devem ser escritos usando underscores:

  ```sql
  SET GLOBAL general_log = ON;
  SELECT @@GLOBAL.general_log;
  ```

  Na inicialização do Server, a sintaxe para variáveis de sistema é a mesma que para Options de comando, então, dentro dos nomes das variáveis, traços e underscores podem ser usados de forma intercambiável. Por exemplo, `--general_log=ON` e `--general-log=ON` são equivalentes. (Isto também é verdadeiro para variáveis de sistema definidas dentro de arquivos de Option.)

* Para Options que aceitam um valor numérico, o valor pode ser fornecido com um sufixo `K`, `M` ou `G` (maiúsculo ou minúsculo) para indicar um multiplicador de 1024, 1024² ou 1024³. Por exemplo, o comando a seguir instrui o **mysqladmin** a fazer ping no Server 1024 vezes, com um intervalo de 10 segundos entre cada ping:

  ```sql
  mysqladmin --count=1K --sleep=10 ping
  ```

* Ao especificar nomes de arquivo como valores de Option, evite o uso do metacaractere de shell `~`. Ele pode não ser interpretado como você espera.

Valores de Option que contêm espaços devem ser citados (quoted) quando fornecidos na Command Line. Por exemplo, a Option `--execute` (ou `-e`) pode ser usada com o **mysql** para passar uma ou mais instruções SQL separadas por ponto e vírgula para o Server. Quando esta Option é usada, o **mysql** executa as instruções no valor da Option e sai. As instruções devem ser delimitadas por aspas. Por exemplo:

```sql
$> mysql -u root -p -e "SELECT VERSION();SELECT NOW()"
Enter password: ******
+------------+
| VERSION()  |
+------------+
| 5.7.29     |
+------------+
+---------------------+
| NOW()               |
+---------------------+
| 2019-09-03 10:36:28 |
+---------------------+
$>
```

Nota

A forma longa (`--execute`) é seguida por um sinal de igual (`=`).

Para usar valores entre aspas dentro de uma instrução, você deve escapar as aspas internas ou usar um tipo de aspas diferente dentro da instrução daquelas usadas para citar a instrução em si. As capacidades do seu processador de comandos ditam suas escolhas sobre se você pode usar aspas simples ou duplas e a sintaxe para escapar caracteres de aspas (quote characters). Por exemplo, se o seu processador de comandos suporta citação com aspas simples ou duplas, você pode usar aspas duplas ao redor da instrução e aspas simples para quaisquer valores citados dentro da instrução.