#### 4.5.1.5 Executando SQL Statements a Partir de um Arquivo de Texto

O **mysql** client é tipicamente usado de forma interativa, assim:

```sql
mysql db_name
```

No entanto, também é possível colocar seus SQL statements em um arquivo e, em seguida, instruir o **mysql** a ler sua entrada (input) a partir desse arquivo. Para fazer isso, crie um arquivo de texto *`text_file`* que contenha os statements que você deseja executar. Depois, invoque o **mysql** conforme mostrado aqui:

```sql
mysql db_name < text_file
```

Se você colocar um statement `USE db_name` como o primeiro statement no arquivo, não será necessário especificar o nome do Database na linha de comando:

```sql
mysql < text_file
```

Se você já estiver executando o **mysql**, você pode executar um arquivo SQL script usando o comando `source` ou o comando `\.`:

```sql
mysql> source file_name
mysql> \. file_name
```

Às vezes, você pode querer que seu script exiba informações de progresso para o usuário. Para isso, você pode inserir statements como este:

```sql
SELECT '<info_to_display>' AS ' ';
```

O statement mostrado gera o output `<info_to_display>`.

Você também pode invocar o **mysql** com a opção `--verbose`, o que faz com que cada statement seja exibido antes do resultado que ele produz.

O **mysql** ignora caracteres Unicode byte order mark (BOM) no início dos arquivos de input. Anteriormente, ele os lia e os enviava para o server, resultando em um syntax error. A presença de um BOM não faz com que o **mysql** altere seu character set padrão. Para fazer isso, invoque o **mysql** com uma opção como `--default-character-set=utf8`.

Para mais informações sobre batch mode, consulte a Seção 3.5, “Usando mysql em Batch Mode”.