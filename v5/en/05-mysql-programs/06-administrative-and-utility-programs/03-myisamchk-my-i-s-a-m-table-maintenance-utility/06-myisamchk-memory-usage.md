#### 4.6.3.6 Uso de Memória do myisamchk

A alocação de memória é importante ao executar o **myisamchk**. O **myisamchk** não usa mais memória do que o definido em suas variáveis relacionadas à memória. Se você for usar o **myisamchk** em tabelas muito grandes, você deve primeiro decidir quanta memória deseja que ele use. O padrão é usar apenas cerca de 3MB para realizar reparos. Ao usar valores maiores, você pode fazer com que o **myisamchk** opere mais rapidamente. Por exemplo, se você tiver mais de 512MB de RAM disponível, você pode usar opções como estas (além de quaisquer outras opções que você possa especificar):

```sql
myisamchk --myisam_sort_buffer_size=256M \
           --key_buffer_size=512M \
           --read_buffer_size=64M \
           --write_buffer_size=64M ...
```

Usar `--myisam_sort_buffer_size=16M` é provavelmente suficiente para a maioria dos casos.

Esteja ciente de que o **myisamchk** usa arquivos temporários no `TMPDIR`. Se o `TMPDIR` apontar para um sistema de arquivos em memória, erros de falta de memória podem ocorrer facilmente. Se isso acontecer, execute o **myisamchk** com a opção `--tmpdir=dir_name` para especificar um diretório localizado em um sistema de arquivos que tenha mais espaço.

Ao realizar operações de reparo, o **myisamchk** também precisa de bastante espaço em disco:

* O dobro do tamanho do arquivo de Data (o arquivo original e uma cópia). Este espaço não é necessário se você fizer um reparo com `--quick`; neste caso, apenas o arquivo de Index é recriado. *Este espaço deve estar disponível no mesmo file system que o arquivo de Data original*, pois a cópia é criada no mesmo diretório do original.

* Espaço para o novo arquivo de Index que substitui o antigo. O arquivo de Index antigo é truncado no início da operação de reparo, então você geralmente ignora este espaço. Este espaço deve estar disponível no mesmo file system que o arquivo de Data original.

* Ao usar `--recover` ou `--sort-recover` (mas não ao usar `--safe-recover`), você precisa de espaço em disco para a ordenação (sorting). Este espaço é alocado no diretório temporário (especificado por `TMPDIR` ou `--tmpdir=dir_name`). A fórmula a seguir fornece a quantidade de espaço necessária:

  ```sql
  (largest_key + row_pointer_length) * number_of_rows * 2
  ```

  Você pode verificar o comprimento das Keys e o *`row_pointer_length`* com **myisamchk -dv *`tbl_name`*** (consulte a Seção 4.6.3.5, “Obtendo Informações da Tabela com myisamchk”). Os valores *`row_pointer_length`* e *`number_of_rows`* são os valores de `Datafile pointer` e `Data records` na descrição da tabela. Para determinar o valor *`largest_key`*, verifique as linhas `Key` na descrição da tabela. A coluna `Len` indica o número de bytes para cada parte da Key. Para um Index de múltiplas colunas, o tamanho da Key é a soma dos valores `Len` para todas as partes da Key.

Se você tiver um problema com espaço em disco durante o reparo, você pode tentar `--safe-recover` em vez de `--recover`.