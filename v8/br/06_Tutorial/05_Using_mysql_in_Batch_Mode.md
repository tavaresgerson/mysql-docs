## 5.5 Usando o mysql no modo de lote

Nas seções anteriores, você usou o **mysql** interativamente para inserir instruções e visualizar os resultados. Você também pode executar o **mysql** em modo batch. Para fazer isso, coloque as instruções que você deseja executar em um arquivo e, em seguida, diga ao **mysql** para ler sua entrada do arquivo:

```
$> mysql < batch-file
```

Se você estiver executando o **mysql** no Windows e tiver alguns caracteres especiais no arquivo que causam problemas, você pode fazer o seguinte:

```
C:\> mysql -e "source batch-file"
```

Se você precisar especificar os parâmetros de conexão na linha de comando, o comando pode parecer assim:

```
$> mysql -h host -u user -p < batch-file
Enter password: ********
```

Quando você usa **mysql** dessa maneira, você está criando um arquivo de script e, em seguida, executando o script.

Se você quiser que o script continue mesmo que algumas das declarações produzam erros, você deve usar a opção de linha de comando `--force`.

Por que usar um roteiro? Aqui estão algumas razões:

- Se você executar uma consulta repetidamente (por exemplo, todos os dias ou todas as semanas), criar um script permite que você evite reescrevê-la toda vez que executá-la.

- Você pode gerar novas consultas a partir de existentes que são semelhantes, copiando e editando arquivos de script.

- O modo lote também pode ser útil enquanto você está desenvolvendo uma consulta, especialmente para instruções de várias linhas ou sequências de várias instruções. Se você cometer um erro, não precisa redigitar tudo. Basta editar seu script para corrigir o erro e, em seguida, informar ao **mysql** para executá-lo novamente.

- Se você tiver uma consulta que gera uma grande quantidade de saída, você pode executar a saída através de um pager em vez de vê-la rolar para fora do topo da tela:

  ```
  $> mysql < batch-file | more
  ```

- Você pode capturar a saída em um arquivo para processamento posterior:

  ```
  $> mysql < batch-file > mysql.out
  ```

- Você pode distribuir seu roteiro para outras pessoas para que elas também possam executar as declarações.

- Algumas situações não permitem o uso interativo, por exemplo, quando você executa uma consulta a partir de um **cron**. Nesse caso, você deve usar o modo de lote.

O formato de saída padrão é diferente (mais conciso) quando você executa o **mysql** em modo batch do que quando o usa interativamente. Por exemplo, a saída de `SELECT DISTINCT species FROM pet` parece assim quando o **mysql** é executado interativamente:

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

No modo lote, a saída parece assim:

```
species
bird
cat
dog
hamster
snake
```

Se você deseja obter o formato de saída interativa no modo batch, use **mysql -t**. Para exibir as instruções executadas na saída, use **mysql -v**.

Você também pode usar scripts do prompt **mysql** usando o comando `source` ou o comando `\.`:

```
mysql> source filename;
mysql> \. filename
```

Consulte a Seção 6.5.1.5, “Executando instruções SQL a partir de um arquivo de texto”, para obter mais informações.
