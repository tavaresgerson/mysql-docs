## 3.5 Usando o mysql em Modo Batch

Nas seções anteriores, você usou o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") interativamente para inserir statements e visualizar os resultados. Você também pode executar o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") em modo batch. Para fazer isso, coloque os statements que você deseja executar em um arquivo e, em seguida, instrua o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") a ler sua input a partir desse arquivo:

```sql
$> mysql < batch-file
```

Se você estiver executando o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") no Windows e tiver caracteres especiais no arquivo que causem problemas, você pode fazer o seguinte:

```sql
C:\> mysql -e "source batch-file"
```

Se você precisar especificar parâmetros de conexão na linha de comando, o comando pode se parecer com isto:

```sql
$> mysql -h host -u user -p < batch-file
Enter password: ********
```

Quando você usa o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") dessa maneira, você está criando um arquivo script e, em seguida, executando o script.

Se você quiser que o script continue mesmo que alguns dos statements produzam erros, você deve usar a opção de linha de comando [`--force`](mysql-command-options.html#option_mysql_force).

Por que usar um script? Aqui estão algumas razões:

* Se você executa uma Query repetidamente (por exemplo, todos os dias ou todas as semanas), transformá-la em um script permite que você evite digitá-la novamente toda vez que for executada.

* Você pode gerar novas Queries a partir de outras existentes que são semelhantes, copiando e editando arquivos script.

* O modo batch também pode ser útil enquanto você está desenvolvendo uma Query, particularmente para statements de múltiplas linhas ou sequências de múltiplos statements. Se você cometer um erro, não precisa redigitar tudo. Basta editar seu script para corrigir o erro e, em seguida, instruir o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") a executá-lo novamente.

* Se você tiver uma Query que produz muita output, você pode canalizar a output através de um pager em vez de vê-la rolar para fora da parte superior da sua tela:

  ```sql
  $> mysql < batch-file | more
  ```

* Você pode capturar a output em um arquivo para processamento posterior:

  ```sql
  $> mysql < batch-file > mysql.out
  ```

* Você pode distribuir seu script para outras pessoas para que elas também possam executar os statements.

* Algumas situações não permitem o uso interativo, por exemplo, quando você executa uma Query a partir de um **cron** job. Neste caso, você deve usar o modo batch.

O formato de output padrão é diferente (mais conciso) quando você executa o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") em modo batch do que quando você o usa interativamente. Por exemplo, a output de `SELECT DISTINCT species FROM pet` se parece com isto quando o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") é executado interativamente:

```sql
+---------+
| species |
+---------+
| bird    |
| cat     |
| dog     |
| hamster |
| snake   |
+---------+
```

Em modo batch, a output se parece com isto:

```sql
species
bird
cat
dog
hamster
snake
```

Se você deseja obter o formato de output interativo em modo batch, use [**mysql -t**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"). Para ecoar na output os statements que estão sendo executados, use [**mysql -v**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

Você também pode usar scripts a partir do prompt do [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") usando o comando `source` ou o comando `\.`:

```sql
mysql> source filename;
mysql> \. filename
```

Veja [Seção 4.5.1.5, “Executing SQL Statements from a Text File”](mysql-batch-commands.html "4.5.1.5 Executing SQL Statements from a Text File"), para mais informações.