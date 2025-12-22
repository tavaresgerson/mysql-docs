#### 6.5.1.5 Execução de instruções SQL a partir de um ficheiro de texto

O cliente `mysql` normalmente é usado interativamente, assim:

```
mysql db_name
```

No entanto, também é possível colocar suas instruções SQL em um arquivo e, em seguida, dizer ao `mysql` para ler sua entrada a partir desse arquivo. Para isso, crie um arquivo de texto `text_file` que contenha as instruções que você deseja executar. Em seguida, invoque `mysql` como mostrado aqui:

```
mysql db_name < text_file
```

Se você colocar uma instrução `USE db_name` como a primeira instrução no arquivo, não é necessário especificar o nome do banco de dados na linha de comando:

```
mysql < text_file
```

Se você já está executando `mysql`, você pode executar um arquivo de script SQL usando o comando `source` ou o comando `\.`:

```
mysql> source file_name
mysql> \. file_name
```

Às vezes você pode querer que seu script exiba informações de progresso para o usuário. Para isso você pode inserir instruções como esta:

```
SELECT '<info_to_display>' AS ' ';
```

A instrução mostrada dá `<info_to_display>`.

Você também pode invocar `mysql` com a opção `--verbose`, que faz com que cada instrução seja exibida antes do resultado que ela produz.

`mysql` ignora os caracteres da marca de ordem de bytes (BOM) do Unicode no início dos arquivos de entrada. Anteriormente, ele os lia e os enviava para o servidor, resultando em um erro de sintaxe. A presença de um BOM não faz com que `mysql` mude seu conjunto de caracteres padrão. Para fazer isso, invoque `mysql` com uma opção como `--default-character-set=utf8mb4`.

Para obter mais informações sobre o modo por lotes, ver Secção 5.5, "Utilizar mysql no modo por lotes".
