## 5.5 Usando o mysql no Modo de Batch

Nas seções anteriores, você usou o **mysql** interativamente para inserir instruções e visualizar os resultados. Você também pode executar o **mysql** no modo batch. Para fazer isso, coloque as instruções que você deseja executar em um arquivo e, em seguida, diga ao **mysql** para ler sua entrada do arquivo:

```
$> mysql < batch-file
```

Se você estiver executando o **mysql** no Windows e tiver alguns caracteres especiais no arquivo que causam problemas, você pode fazer isso:

```
C:\> mysql -e "source batch-file"
```

Se você precisar especificar parâmetros de conexão na linha de comando, o comando pode parecer assim:

```
$> mysql -h host -u user -p < batch-file
Enter password: ********
```

Ao usar o **mysql** dessa maneira, você está criando um arquivo de script e, em seguida, executando o script.

Se você quiser que o script continue mesmo que algumas das instruções nele produzam erros, você deve usar a opção de linha de comando `--force`.

Por que usar um script? Aqui estão algumas razões:

* Se você executar uma consulta repetidamente (digamos, todos os dias ou todas as semanas), fazer isso em um script permite que você evite reescrevê-lo cada vez que executá-lo.

* Você pode gerar novas consultas a partir de existentes que são semelhantes, copiando e editando arquivos de script.

* O modo batch também pode ser útil enquanto você está desenvolvendo uma consulta, particularmente para instruções de várias linhas ou sequências de várias instruções. Se você cometer um erro, não precisa reescrever tudo. Basta editar seu script para corrigir o erro e, em seguida, dizer ao **mysql** para executá-lo novamente.

* Se você tiver uma consulta que produz uma grande quantidade de saída, você pode executar a saída através de um pager em vez de vê-la rolar para o topo da tela:

  ```
  $> mysql < batch-file | more
  ```

* Você pode capturar a saída em um arquivo para processamento adicional:

  ```
  $> mysql < batch-file > mysql.out
  ```

* Você pode distribuir seu script para outras pessoas para que elas também possam executar as instruções.

* Algumas situações não permitem o uso interativo, por exemplo, quando você executa uma consulta a partir de um **cron**. Nesse caso, você deve usar o modo de lote.

O formato de saída padrão é diferente (mais conciso) quando você executa o **mysql** no modo de lote do que quando o usa de forma interativa. Por exemplo, o resultado de `SELECT DISTINCT species FROM pet` parece assim quando o **mysql** é executado de forma interativa:

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

No modo de lote, o resultado parece assim:

```
species
bird
cat
dog
hamster
snake
```

Se você quiser obter o formato de saída interativo no modo de lote, use **mysql -t**. Para ecoar as instruções que são executadas, use **mysql -v**.

Você também pode usar scripts a partir do prompt do **mysql** usando o comando `source` ou o comando `\.`:

```
mysql> source filename;
mysql> \. filename
```

Consulte a Seção 6.5.1.5, “Executando instruções SQL a partir de um arquivo de texto”, para obter mais informações.