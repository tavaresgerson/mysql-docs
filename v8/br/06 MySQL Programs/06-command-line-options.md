#### 6.2.2.1 Utilização de opções na linha de comando

As opções de programa especificadas na linha de comando seguem estas regras:

- As opções são indicadas após o nome do comando.
- Um argumento de opção começa com um traço ou dois traços, dependendo se é uma forma curta ou longa do nome da opção.
- Os nomes das opções são sensíveis a maiúsculas e minúsculas. \[`-v`] e \[`-V`] são ambos legais e têm significados diferentes. (São as formas abreviadas correspondentes das opções \[`--verbose`]] e \[`--version`]].)
- Algumas opções tomam um valor após o nome da opção. Por exemplo, `-h localhost` ou `--host=localhost` indicam o host do servidor MySQL para um programa cliente. O valor da opção diz ao programa o nome do host onde o servidor MySQL está sendo executado.
- Para uma opção longa que leva um valor, separe o nome da opção e o valor por um sinal de `=`. Para uma opção curta que leva um valor, o valor da opção pode seguir imediatamente a letra da opção, ou pode haver um espaço entre: `-hlocalhost` e `-h localhost` são equivalentes. Uma exceção a esta regra é a opção para especificar sua senha do MySQL. Esta opção pode ser dada em forma longa como `--password=pass_val` ou como `--password`. No último caso (sem o valor da senha dado), o programa interativamente solicita a senha. A opção de senha também pode ser dada em forma curta como `-ppass_val` ou como `-p`. No entanto, para a forma curta, se o valor da senha for dado, deve seguir a letra da opção sem intervenção de \*: \* Se a opção não tiver uma letra de espaço, o programa supõe que o argumento seja um valor ou dois outros tipos de senha. Consequentemente,

  ```
  mysql -ptest
  mysql -p test
  ```

  O primeiro comando instrui o `mysql` a usar um valor de senha de `test`, mas não especifica nenhum banco de dados padrão. O segundo instrui o `mysql` a solicitar o valor da senha e a usar `test` como banco de dados padrão.
- Dentro de nomes de opções, traço (`-`) e sublinhado (`_`) podem ser usados de forma intercambiável na maioria dos casos, embora os traços iniciais \* não \* possam ser dados como sublinhados. Por exemplo, `--skip-grant-tables` e `--skip_grant_tables` são equivalentes.

  Neste Manual, usamos traços nos nomes das opções, exceto quando os sublinhados são significativos. Este é o caso, por exemplo, de `--log-bin` e `--log_bin`, que são opções diferentes.
- O servidor MySQL tem certas opções de comando que podem ser especificadas apenas na inicialização, e um conjunto de variáveis do sistema, algumas das quais podem ser definidas na inicialização, no tempo de execução ou em ambos. Os nomes de variáveis do sistema usam sublinhados em vez de traços, e quando referenciados no tempo de execução (por exemplo, usando instruções `SET` ou `SELECT`), devem ser escritos usando sublinhados:

  ```
  SET GLOBAL general_log = ON;
  SELECT @@GLOBAL.general_log;
  ```

  Na inicialização do servidor, a sintaxe para variáveis do sistema é a mesma que para opções de comando, então dentro de nomes de variáveis, traços e sublinhados podem ser usados de forma intercambiável. Por exemplo, `--general_log=ON` e `--general-log=ON` são equivalentes. (Isso também é verdade para variáveis do sistema definidas dentro de arquivos de opções.)
- Para opções que tomam um valor numérico, o valor pode ser dado com um sufixo de `K`, `M`, ou `G` para indicar um multiplicador de 1024, 10242 ou 10243.

  Por exemplo, o seguinte comando diz a mysqladmin para fazer ping ao servidor 1024 vezes, dormindo 10 segundos entre cada ping:

  ```
  mysqladmin --count=1K --sleep=10 ping
  ```
- Ao especificar nomes de arquivo como valores de opção, evite o uso do metacaráter do shell `~`. Ele pode não ser interpretado como você espera.

Por exemplo, a opção `--execute` (ou `-e`) pode ser usada com `mysql` para passar uma ou mais instruções SQL separadas por ponto e vírgula para o servidor. Quando esta opção é usada, `mysql` executa as instruções no valor da opção e sai. As instruções devem ser fechadas por aspas. Por exemplo:

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

::: info Note

A forma longa (`--execute`) é seguida por um sinal de igual (`=`).

:::

Para usar valores com aspas dentro de uma instrução, você deve evitar as aspas internas ou usar um tipo diferente de aspas dentro da instrução do que as usadas para citar a instrução em si. As capacidades do seu processador de comandos ditam suas escolhas para se você pode usar aspas simples ou duplas e a sintaxe para escapar de caracteres de aspas. Por exemplo, se o seu processador de comandos suporta aspas com aspas simples ou duplas, você pode usar aspas duplas em torno da instrução e aspas simples para quaisquer valores com aspas dentro da instrução.
