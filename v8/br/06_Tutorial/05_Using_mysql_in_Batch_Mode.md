## 5.5 Usando o mysql no Modo de Batch

Nas seções anteriores, você usou o **mysql** interativamente para inserir declarações e visualizar os resultados. Você também pode executar o **mysql** em modo em lote. Para fazer isso, coloque as declarações que você deseja executar em um arquivo e, em seguida, diga ao **mysql** para ler sua entrada a partir do arquivo:

```
$> mysql < batch-file
```

Se você está executando o **mysql** no Windows e tem alguns caracteres especiais no arquivo que causam problemas, você pode fazer o seguinte:

```
C:\> mysql -e "source batch-file"
```

Se você precisar especificar os parâmetros de conexão na linha de comando, o comando pode parecer assim:

```
$> mysql -h host -u user -p < batch-file
Enter password: ********
```

Quando você usa o **mysql** dessa maneira, você está criando um arquivo de script e, em seguida, executando o script.

Se você deseja que o script continue mesmo que algumas das declarações produzam erros, você deve usar a opção de linha de comando `--force`.

Por que usar um roteiro? Aqui estão algumas razões:

* Se você executa uma consulta repetidamente (digamos, todos os dias ou todas as semanas), fazer dela um script permite que você evite redigitá-la cada vez que a execute.

* Você pode gerar novas consultas a partir de aquelas existentes que são semelhantes, copiando e editando arquivos de script.

O modo em lote também pode ser útil enquanto você está desenvolvendo uma consulta, especialmente para declarações de várias linhas ou sequências de várias declarações. Se você cometer um erro, não precisa redigitar tudo. Basta editar seu script para corrigir o erro e, em seguida, informar ao **mysql** para executá-lo novamente.

* Se você tiver uma consulta que gera uma grande quantidade de saída, você pode executar a saída através de um pager em vez de vê-la rolar fora da parte superior da tela:

  ```
  $> mysql < batch-file | more
  ```

* Você pode capturar a saída em um arquivo para processamento adicional:

  ```
  $> mysql < batch-file > mysql.out
  ```

* Você pode distribuir seu roteiro para outras pessoas, para que elas também possam executar as declarações.

* Algumas situações não permitem o uso interativo, por exemplo, quando você executa uma consulta a partir de um **cron**. Nesse caso, você deve usar o modo em lote.

O formato de saída padrão é diferente (mais conciso) quando você executa o **mysql** em modo em lote do que quando o usa interativamente. Por exemplo, a saída de `SELECT DISTINCT species FROM pet` parece assim quando o **mysql** é executado interativamente:

```
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

No modo em lote, a saída parece assim:

```
species
bird
cat
dog
hamster
snake
```

Se você deseja obter o formato de saída interativa no modo em lote, use **mysql -t**. Para exibir as declarações que são executadas na saída, use **mysql -v**.

Você também pode usar scripts do prompt **mysql** usando o comando `source` ou `\.`:

```
mysql> source filename;
mysql> \. filename
```

Consulte a Seção 6.5.1.5, “Executar declarações SQL a partir de um arquivo de texto”, para obter mais informações.