#### 4.5.1.5 Executando instruções SQL a partir de um arquivo de texto

O cliente **mysql** é normalmente usado de forma interativa, como este:

```sh
mysql db_name
```

No entanto, também é possível colocar suas instruções SQL em um arquivo e, em seguida, informar o **mysql** para ler sua entrada desse arquivo. Para fazer isso, crie um arquivo de texto *`text_file`* que contenha as instruções que deseja executar. Em seguida, inicie o **mysql** conforme mostrado aqui:

```sh
mysql db_name < text_file
```

Se você colocar uma declaração `USE db_name` como a primeira declaração no arquivo, não é necessário especificar o nome do banco de dados na linha de comando:

```sh
mysql < text_file
```

Se você já estiver executando o **mysql**, você pode executar um arquivo de script SQL usando o comando `source` ou o comando `\.`:

```sh
mysql> source file_name
mysql> \. file_name
```

Às vezes, você pode querer que seu script exiba informações de progresso ao usuário. Para isso, você pode inserir instruções como esta:

```sql
SELECT '<info_to_display>' AS ' ';
```

A declaração exibida exibe `<info_to_display>`.

Você também pode invocar o **mysql** com a opção `--verbose`, o que faz com que cada instrução seja exibida antes do resultado que ela produz.

O **mysql** ignora os caracteres da marca de ordem de bytes Unicode (BOM) no início dos arquivos de entrada. Anteriormente, ele os lia e os enviava para o servidor, resultando em um erro de sintaxe. A presença de um BOM não faz com que o **mysql** mude seu conjunto de caracteres padrão. Para fazer isso, invocando o **mysql** com uma opção como `--default-character-set=utf8`.

Para obter mais informações sobre o modo de lote, consulte a Seção 3.5, “Usando o mysql no Modo de Lote”.
