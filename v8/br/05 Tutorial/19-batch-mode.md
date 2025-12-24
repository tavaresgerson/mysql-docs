## 5.5 Usando o mysql em modo de lote

Nas seções anteriores, você usou `mysql` interativamente para inserir instruções e visualizar os resultados. Você também pode executar `mysql` em modo de lote. Para fazer isso, coloque as instruções que você deseja executar em um arquivo, e depois diga a `mysql` para ler sua entrada do arquivo:

```
$> mysql < batch-file
```

Se você está executando `mysql` no Windows e tem alguns caracteres especiais no arquivo que causam problemas, você pode fazer o seguinte:

```
C:\> mysql -e "source batch-file"
```

Se você precisar especificar parâmetros de conexão na linha de comando, o comando pode ser assim:

```
$> mysql -h host -u user -p < batch-file
Enter password: ********
```

Quando você usa `mysql` desta maneira, você está criando um arquivo de script, e depois executando o script.

Se você quiser que o script continue mesmo que algumas das instruções nele produzam erros, você deve usar a opção de linha de comando `--force`.

Por que usar um roteiro?

- Se você executar uma consulta repetidamente (por exemplo, todos os dias ou todas as semanas), torná-la um script permite que você evite digitá-la novamente a cada vez que a executa.
- Você pode gerar novas consultas a partir de consultas existentes que são semelhantes copiando e editando arquivos de script.
- O modo de lote também pode ser útil enquanto você está desenvolvendo uma consulta, particularmente para instruções de várias linhas ou sequências de várias instruções. Se você cometer um erro, não precisa digitar tudo novamente. Apenas edite seu script para corrigir o erro e, em seguida, diga a `mysql` para executá-lo novamente.
- Se você tem uma consulta que produz muita saída, você pode executar a saída através de um pager em vez de vê-lo rolar para fora do topo da sua tela:

  ```
  $> mysql < batch-file | more
  ```
- Você pode capturar a saída em um arquivo para processamento adicional:

  ```
  $> mysql < batch-file > mysql.out
  ```
- Você pode distribuir seu script para outras pessoas para que eles também possam executar as instruções.
- Algumas situações não permitem o uso interativo, por exemplo, quando você executa uma consulta a partir de uma tarefa `cron`. Neste caso, você deve usar o modo de lote.

O formato de saída padrão é diferente (mais conciso) quando você executa `mysql` no modo de lote do que quando você o usa interativamente. Por exemplo, a saída de `SELECT DISTINCT species FROM pet` parece assim quando `mysql` é executado interativamente:

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

No modo de lote, a saída é assim:

```
species
bird
cat
dog
hamster
snake
```

Se você quiser obter o formato de saída interativo em modo de lote, use `mysql -t`. Para ecoar para a saída as instruções que são executadas, use `mysql -v`.

Você também pode usar scripts do prompt `mysql` usando o comando `source` ou `\.`:

```
mysql> source filename;
mysql> \. filename
```
