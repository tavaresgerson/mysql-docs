## 3.5 Usando o mysql no Modo de Batch

Nas seções anteriores, você usou **mysql** interativamente para inserir instruções e visualizar os resultados. Você também pode executar **mysql** em modo batch. Para fazer isso, coloque as instruções que você deseja executar em um arquivo e, em seguida, diga ao **mysql** para ler sua entrada do arquivo:

```sh
$> mysql < batch-file
```

Se você estiver executando **mysql** no Windows e tiver alguns caracteres especiais no arquivo que causam problemas, você pode fazer o seguinte:

```sh
C:\> mysql -e "source batch-file"
```

Se você precisar especificar os parâmetros de conexão na linha de comando, o comando pode parecer assim:

```sh
$> mysql -h host -u user -p < batch-file
Enter password: ********
```

Quando você usa **mysql** dessa maneira, você está criando um arquivo de script e, em seguida, executando o script.

Se você deseja que o script continue mesmo que algumas das declarações produzam erros, você deve usar a opção de linha de comando `--force`.

Por que usar um roteiro? Aqui estão algumas razões:

- Se você executar uma consulta repetidamente (por exemplo, todos os dias ou todas as semanas), criar um script permite que você evite reescrevê-la toda vez que executá-la.

- Você pode gerar novas consultas a partir de existentes que são semelhantes, copiando e editando arquivos de script.

- O modo lote também pode ser útil enquanto você está desenvolvendo uma consulta, especialmente para instruções de várias linhas ou sequências de várias instruções. Se você cometer um erro, não precisa reescrever tudo. Basta editar seu script para corrigir o erro e, em seguida, informar o **mysql** para executá-lo novamente.

- Se você tiver uma consulta que gera uma grande quantidade de saída, você pode executar a saída através de um pager em vez de vê-la rolar para fora do topo da tela:

  ```sh
  $> mysql < batch-file | more
  ```

- Você pode capturar a saída em um arquivo para processamento posterior:

  ```sh
  $> mysql < batch-file > mysql.out
  ```

- Você pode distribuir seu roteiro para outras pessoas para que elas também possam executar as declarações.

- Algumas situações não permitem o uso interativo, por exemplo, quando você executa uma consulta a partir de um **cron**. Nesse caso, você deve usar o modo de lote.

O formato de saída padrão é diferente (mais conciso) quando você executa **mysql** no modo em lote do que quando você usa-o interativamente. Por exemplo, o resultado de `SELECT DISTINCT species FROM pet` parece assim quando **mysql** é executado interativamente:

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

No modo lote, a saída parece assim:

```sql
species
bird
cat
dog
hamster
snake
```

Se você deseja obter o formato de saída interativa em modo batch, use **mysql -t**. Para exibir as instruções executadas na saída, use **mysql -v**.

Você também pode usar scripts do prompt **mysql** usando o comando `source` ou o comando `\.`:

```sh
mysql> source filename;
mysql> \. filename
```

Para obter mais informações, consulte Seção 4.5.1.5, “Executando instruções SQL a partir de um arquivo de texto”.
