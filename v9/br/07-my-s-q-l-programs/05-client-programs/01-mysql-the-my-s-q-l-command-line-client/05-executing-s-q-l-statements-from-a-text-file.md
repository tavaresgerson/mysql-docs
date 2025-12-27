#### 6.5.1.5 Executando instruções SQL a partir de um arquivo de texto

O cliente **mysql** é tipicamente usado interativamente, como este:

```
mysql db_name
```

No entanto, também é possível colocar suas instruções SQL em um arquivo e, em seguida, informar ao **mysql** para ler sua entrada desse arquivo. Para fazer isso, crie um arquivo de texto *`arquivo_de_texto`* que contenha as instruções que deseja executar. Em seguida, inicie o **mysql** conforme mostrado aqui:

```
mysql db_name < text_file
```

Se você colocar uma instrução `USE db_name` como a primeira instrução no arquivo, não é necessário especificar o nome da base de dados na linha de comando:

```
mysql < text_file
```

Se você já estiver executando o **mysql**, pode executar um arquivo de script SQL usando o comando `source` ou `\.`:

```
mysql> source file_name
mysql> \. file_name
```

Às vezes, você pode querer que seu script exiba informações de progresso ao usuário. Para isso, você pode inserir instruções como esta:

```
SELECT '<info_to_display>' AS ' ';
```

A instrução mostrada exibe `<info_to_display>`.

Você também pode iniciar o **mysql** com a opção `--verbose`, o que faz com que cada instrução seja exibida antes do resultado que ela produz.

O **mysql** ignora os caracteres de marcação de ordem de bytes Unicode (BOM) no início dos arquivos de entrada. Anteriormente, ele os lia e os enviava para o servidor, resultando em um erro de sintaxe. A presença de um BOM não faz com que o **mysql** mude seu conjunto de caracteres padrão. Para isso, inicie o **mysql** com uma opção como `--default-character-set=utf8mb4`.

Para mais informações sobre o modo de lote, consulte a Seção 5.5, “Usando o mysql no modo de lote”.